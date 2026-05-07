# ScholarMind 🎓
### An Intelligent Research Assistant using Retrieval-Augmented Generation (RAG)

---

## Tech Stack
- **LLM:** Mistral (via Ollama, runs locally)
- **Embeddings:** Sentence Transformers (`all-MiniLM-L6-v2`)
- **Vector DB:** ChromaDB
- **Framework:** LangChain
- **Backend:** Python + FastAPI
- **Frontend:** React + Vite

---

## Prerequisites
- Python 3.10+
- Node.js 18+
- Ollama installed → https://ollama.com

---

## Setup & Run

### Step 1 — Pull Mistral model
```bash
ollama pull mistral
```

### Step 2 — Backend setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Step 3 — Frontend setup (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 4 — Open the app
Visit: http://localhost:5173

---

## How to Use
1. **Upload a PDF** using the sidebar, or enter an **ArXiv paper ID** (e.g. `2005.11401`)
2. Wait for ingestion to complete
3. **Ask any question** about your papers in the chat
4. ScholarMind retrieves relevant chunks and answers with source attribution

---

## Project Architecture

```
User Query
    ↓
Embed query (Sentence Transformers)
    ↓
Similarity search in ChromaDB
    ↓
Retrieve top-k relevant chunks
    ↓
Build prompt with context + question
    ↓
Send to Mistral via Ollama
    ↓
Return grounded answer with sources
```

---

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ingest/pdf` | Upload a PDF file |
| POST | `/ingest/arxiv` | Ingest paper by ArXiv ID |
| GET | `/sources` | List all ingested papers |
| POST | `/query` | Ask a question |
| DELETE | `/reset` | Clear vector store |
