import arxiv
from pypdf import PdfReader
import requests
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

CHROMA_PATH = "./chroma_db"
EMBED_MODEL = "all-MiniLM-L6-v2"

def get_embeddings():
    return HuggingFaceEmbeddings(model_name=EMBED_MODEL)

def get_vectorstore():
    return Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=get_embeddings()
    )

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    import io
    reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def chunk_text(text: str, source: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = splitter.create_documents(
        [text],
        metadatas=[{"source": source}]
    )
    return chunks

def ingest_pdf_bytes(pdf_bytes: bytes, filename: str):
    text = extract_text_from_pdf_bytes(pdf_bytes)
    chunks = chunk_text(text, source=filename)
    vectorstore = get_vectorstore()
    vectorstore.add_documents(chunks)
    return len(chunks)

def ingest_arxiv_paper(arxiv_id: str):
    search = arxiv.Search(id_list=[arxiv_id])
    paper = next(search.results())
    
    pdf_url = paper.pdf_url
    response = requests.get(pdf_url)
    pdf_bytes = response.content
    
    text = extract_text_from_pdf_bytes(pdf_bytes)
    source = f"[ArXiv:{arxiv_id}] {paper.title}"
    chunks = chunk_text(text, source=source)
    
    vectorstore = get_vectorstore()
    vectorstore.add_documents(chunks)
    
    return {
        "title": paper.title,
        "authors": [a.name for a in paper.authors],
        "summary": paper.summary,
        "chunks": len(chunks)
    }

def list_ingested_sources():
    vectorstore = get_vectorstore()
    collection = vectorstore._collection
    results = collection.get(include=["metadatas"])
    sources = list(set(m["source"] for m in results["metadatas"] if m))
    return sources
