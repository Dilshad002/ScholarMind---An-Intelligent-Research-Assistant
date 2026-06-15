from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
import ollama as ollama_client

from ingest import (
    reset_vectorstore_cache,
    get_embeddings,
    get_vectorstore,
    ingest_pdf_bytes,
    ingest_arxiv_paper,
    list_ingested_sources,
    CHROMA_PATH
)

app = FastAPI(title="ScholarMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RAG_PROMPT = PromptTemplate.from_template("""
You are ScholarMind, an intelligent academic research assistant.
Answer the user's question based ONLY on the context provided below.
If the answer is not in the context, say "I couldn't find relevant information in the uploaded papers."
Always mention which paper(s) you sourced the answer from.

Context:
{context}

Question: {question}

Answer:
""")

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5

class ArxivRequest(BaseModel):
    arxiv_id: str

@app.get("/")
def root():
    return {"status": "ScholarMind API is running"}

@app.post("/ingest/pdf")
async def ingest_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    pdf_bytes = await file.read()
    chunks = ingest_pdf_bytes(pdf_bytes, file.filename)
    return {"message": f"Successfully ingested {file.filename}", "chunks": chunks}

@app.post("/ingest/arxiv")
async def ingest_arxiv(request: ArxivRequest):
    try:
        result = ingest_arxiv_paper(request.arxiv_id)
        return {"message": "Paper ingested successfully", **result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/sources")
def get_sources():
    sources = list_ingested_sources()
    return {"sources": sources, "count": len(sources)}

@app.post("/query")
async def query(request: QueryRequest):
    vectorstore = get_vectorstore()
    
    retriever = vectorstore.similarity_search_with_score(
        request.question,
        k=request.top_k
    )
    
    if not retriever:
        return {"answer": "No papers have been ingested yet. Please upload some papers first.", "sources": []}
    
    context_parts = []
    sources = []
    for doc, score in retriever:
        context_parts.append(doc.page_content)
        source = doc.metadata.get("source", "Unknown")
        if source not in sources:
            sources.append(source)
    
    context = "\n\n---\n\n".join(context_parts)
    prompt = RAG_PROMPT.format(context=context, question=request.question)
    
    response = ollama_client.chat(
        model="tinyllama",
        messages=[{"role": "user", "content": prompt}]
    )
    
    answer = response["message"]["content"]
    
    return {
        "answer": answer,
        "sources": sources,
        "chunks_retrieved": len(retriever)
    }

@app.delete("/reset")
def reset_vectorstore():
    import shutil, os, gc
    reset_vectorstore_cache()
    try:
        from chromadb import PersistentClient
        client = PersistentClient(path=CHROMA_PATH)
        client.reset()
        del client
        gc.collect()
    except Exception:
        pass
    try:
        if os.path.exists(CHROMA_PATH):
            shutil.rmtree(CHROMA_PATH, ignore_errors=True)
    except Exception:
        pass
    return {"message": "Vector store reset successfully"}