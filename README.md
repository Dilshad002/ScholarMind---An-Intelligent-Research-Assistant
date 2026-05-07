# 🎓 ScholarMind — Intelligent Research Assistant

> **An AI-powered research assistant that lets you upload academic papers and ask questions about them in natural language — with source-attributed, hallucination-free answers.**

![Python](https://img.shields.io/badge/Python-3.14-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![LangChain](https://img.shields.io/badge/LangChain-RAG-orange)
![ChromaDB](https://img.shields.io/badge/ChromaDB-vectorstore-purple)
![Ollama](https://img.shields.io/badge/Ollama-local%20LLM-red)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

---

## 📌 Problem Statement

Researchers and students struggle to efficiently extract insights from large volumes of academic papers. Traditional keyword search returns documents but does not answer questions — users still have to read dozens of papers manually.

**ScholarMind solves this** by enabling natural language querying over a curated collection of research documents using Retrieval-Augmented Generation (RAG).

---

## ✨ Features

- 📄 **PDF Upload** — drag and drop research papers directly
- 🔬 **ArXiv Integration** — fetch papers by ArXiv ID (e.g. `1706.03762`)
- 💬 **Natural Language Q&A** — ask questions in plain English
- 🧠 **Semantic Retrieval** — finds relevant sections using vector similarity search
- ✅ **Grounded Answers** — LLM answers only from retrieved context, no hallucination
- 📎 **Source Attribution** — every answer shows which paper it came from
- 🔒 **Fully Local** — runs entirely on your machine, zero cloud API costs
- ⚡ **React Chat UI** — clean, professional interface with dark theme

---

## 🏗️ System Architecture

```
INGESTION FLOW
PDF / ArXiv ──► Text Extraction (PyPDF) ──► Chunking (800 tokens) ──► Embedding (Sentence Transformers) ──► ChromaDB

QUERY FLOW  
User Question ──► Embed Query ──► Similarity Search (Top-5) ──► RAG Prompt ──► LLM (Ollama) ──► Answer + Sources
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.14, FastAPI, Uvicorn |
| **RAG Framework** | LangChain, LangChain-HuggingFace |
| **Embeddings** | Sentence Transformers (`all-MiniLM-L6-v2`) |
| **Vector Database** | ChromaDB (persistent, local) |
| **LLM** | Ollama + TinyLLaMA 1.1B |
| **PDF Parsing** | PyPDF |
| **ArXiv Fetching** | arxiv Python library |
| **Frontend** | React 18, Vite |
| **Text Splitting** | LangChain RecursiveCharacterTextSplitter |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.com) installed

### Step 1 — Pull an LLM model

```bash
# Recommended (low RAM)
ollama pull tinyllama

# Better quality (needs 4.5GB RAM)
ollama pull mistral
```

### Step 2 — Backend setup

```bash
cd backend
pip install fastapi uvicorn python-multipart
pip install langchain langchain-community langchain-core langchain-chroma
pip install langchain-huggingface langchain-text-splitters
pip install chromadb sentence-transformers
pip install arxiv ollama pypdf
```

```bash
uvicorn main:app --reload --port 8000
```

### Step 3 — Frontend setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

### Step 4 — Open the app

```
http://localhost:5173
```

---

## 📖 How to Use

1. **Upload a paper** — use the sidebar PDF upload or enter an ArXiv ID
2. **Wait for ingestion** — the paper is chunked and embedded into ChromaDB
3. **Ask a question** — type any question about the paper in the chat
4. **Get a grounded answer** — ScholarMind retrieves relevant sections and generates an answer with source attribution

### Example ArXiv IDs to try

| Paper | ArXiv ID |
|---|---|
| Attention Is All You Need (Transformer) | `1706.03762` |
| BERT | `1810.04805` |
| RAG (original paper) | `2005.11401` |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/ingest/pdf` | Upload and ingest a PDF file |
| `POST` | `/ingest/arxiv` | Ingest a paper by ArXiv ID |
| `GET` | `/sources` | List all ingested paper names |
| `POST` | `/query` | Ask a question, receive a grounded answer |
| `DELETE` | `/reset` | Clear all stored vectors |

Full API docs available at `http://localhost:8000/docs`

---

## 📁 Project Structure

```
scholarmind/
├── backend/
│   ├── main.py          # FastAPI app and endpoints
│   ├── ingest.py        # PDF extraction, chunking, embedding, ChromaDB
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React component — chat UI
│   │   └── main.jsx     # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Configuration

Key parameters in `backend/ingest.py`:

```python
EMBED_MODEL = "all-MiniLM-L6-v2"   # Embedding model
CHROMA_PATH = "./chroma_db"          # Vector store location
chunk_size = 800                     # Tokens per chunk
chunk_overlap = 100                  # Overlap between chunks
```

Key parameter in `backend/main.py`:

```python
model = "tinyllama"   # Change to "mistral" for better quality
top_k = 5             # Number of chunks retrieved per query
```

---

## 🧪 Performance

| Query | Retrieval | Answer Quality |
|---|---|---|
| What is the main architecture proposed? | ✅ Correct | Accurate |
| What is Transformer architecture? | ✅ Correct | Accurate |
| Why choose Transformer over RNN? | ✅ Correct | Accurate |

- Source attribution accuracy: **100%** across all test queries
- Zero hallucination — LLM restricted to retrieved context only
- Average response time: **3–5 seconds** (TinyLLaMA, CPU)

---

## 🔮 Future Improvements

- [ ] Upgrade to Mistral 7B on higher-RAM hardware
- [ ] Add multi-turn conversation history
- [ ] Implement hybrid search (vector + BM25 keyword)
- [ ] Deploy on Hugging Face Spaces
- [ ] Add RAGAS evaluation framework
- [ ] Section-aware chunking by paper sections

---

## 📚 Built As

This project was developed as part of an internship at **Inventeron Technologies and Business Solutions LLP, Bangalore** in the role of **Trainee AI Engineer**.

**College:** SEA College of Engineering and Technology, affiliated to Visvesvaraya Technological University, Belagavi
**Program:** B.E. in Artificial Intelligence and Machine Learning

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [LangChain](https://langchain.com) — RAG pipeline framework
- [ChromaDB](https://trychroma.com) — vector database
- [Sentence Transformers](https://sbert.net) — embedding model
- [Ollama](https://ollama.com) — local LLM inference
- [ArXiv](https://arxiv.org) — open access research papers
