import { useState, useRef, useEffect } from "react";
import { Upload, Send, BookOpen, Trash2, Plus, FileText, Loader2, X, ChevronDown } from "lucide-react";

const API = "http://localhost:8000";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d0d;
    --surface: #141414;
    --surface2: #1c1c1c;
    --border: #2a2a2a;
    --accent: #c8a96e;
    --accent2: #e8c98e;
    --text: #f0ece4;
    --muted: #6b6560;
    --danger: #c0392b;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    overflow: hidden;
  }

  .app {
    display: grid;
    grid-template-columns: 300px 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* SIDEBAR */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--border);
  }

  .logo-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: var(--accent);
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-sub {
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-top: 4px;
  }

  .sidebar-section {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
  }

  .section-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--muted);
    margin-bottom: 12px;
  }

  .ingest-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
  }

  .tab-btn {
    flex: 1;
    padding: 6px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .tab-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #0d0d0d;
  }

  .input-row {
    display: flex;
    gap: 6px;
  }

  .text-input {
    flex: 1;
    padding: 8px 10px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    outline: none;
    transition: border-color 0.15s;
  }

  .text-input:focus { border-color: var(--accent); }
  .text-input::placeholder { color: var(--muted); }

  .icon-btn {
    padding: 8px 10px;
    background: var(--accent);
    border: none;
    border-radius: 4px;
    color: #0d0d0d;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s;
    flex-shrink: 0;
  }

  .icon-btn:hover { opacity: 0.85; }
  .icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .upload-zone {
    border: 1px dashed var(--border);
    border-radius: 4px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
  }

  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(200,169,110,0.05); }

  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }

  .upload-text { font-size: 10px; color: var(--muted); margin-top: 6px; }

  .sources-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
  }

  .source-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 10px;
    color: var(--muted);
    line-height: 1.4;
  }

  .source-item:last-child { border-bottom: none; }

  .source-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
    margin-top: 4px;
  }

  .reset-btn {
    margin: 12px 24px;
    padding: 8px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.15s;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .reset-btn:hover { border-color: var(--danger); color: var(--danger); }

  /* MAIN */
  .main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg);
  }

  .header {
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-title {
    font-family: 'DM Serif Display', serif;
    font-size: 15px;
    color: var(--muted);
    font-style: italic;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #27ae60;
    display: inline-block;
    margin-right: 6px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .status-text { font-size: 10px; color: var(--muted); }

  /* CHAT */
  .chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    scroll-behavior: smooth;
  }

  .chat-area::-webkit-scrollbar { width: 4px; }
  .chat-area::-webkit-scrollbar-track { background: transparent; }
  .chat-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: var(--muted);
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-title {
    font-family: 'DM Serif Display', serif;
    font-size: 24px;
    color: var(--text);
    opacity: 0.3;
  }

  .empty-sub { font-size: 11px; text-align: center; line-height: 1.6; max-width: 300px; }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 8px;
  }

  .suggestion-chip {
    padding: 6px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    font-size: 10px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'DM Mono', monospace;
  }

  .suggestion-chip:hover { border-color: var(--accent); color: var(--accent); }

  /* MESSAGES */
  .message {
    display: flex;
    gap: 16px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .message.user { flex-direction: row-reverse; }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
    font-family: 'DM Serif Display', serif;
    border: 1px solid var(--border);
  }

  .avatar.user { background: var(--accent); color: #0d0d0d; border-color: var(--accent); }
  .avatar.ai { background: var(--surface); color: var(--accent); }

  .bubble {
    max-width: 70%;
    padding: 14px 18px;
    border-radius: 2px;
    font-size: 13px;
    line-height: 1.7;
    border: 1px solid var(--border);
  }

  .message.user .bubble {
    background: var(--surface2);
    border-color: var(--border);
    color: var(--text);
    border-radius: 2px 2px 0 2px;
  }

  .message.ai .bubble {
    background: var(--surface);
    border-radius: 2px 2px 2px 0;
  }

  .sources-tag {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
    font-size: 10px;
    color: var(--muted);
  }

  .sources-tag strong { color: var(--accent); display: block; margin-bottom: 4px; letter-spacing: 0.1em; text-transform: uppercase; font-size: 9px; }

  .source-pill {
    display: inline-block;
    padding: 2px 8px;
    background: rgba(200,169,110,0.1);
    border: 1px solid rgba(200,169,110,0.2);
    border-radius: 2px;
    margin: 2px 2px 0 0;
    font-size: 9px;
    color: var(--accent);
    line-height: 1.6;
  }

  .thinking {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 6px 0;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    animation: bounce 1.2s infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-6px); opacity: 1; }
  }

  /* INPUT */
  .input-area {
    padding: 20px 32px 24px;
    border-top: 1px solid var(--border);
  }

  .input-box {
    display: flex;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 4px 4px 4px 16px;
    transition: border-color 0.15s;
  }

  .input-box:focus-within { border-color: var(--accent); }

  .chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 10px 0;
    resize: none;
    max-height: 120px;
    line-height: 1.5;
  }

  .chat-input::placeholder { color: var(--muted); }

  .send-btn {
    padding: 10px 14px;
    background: var(--accent);
    border: none;
    border-radius: 3px;
    color: #0d0d0d;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    transition: opacity 0.15s;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    align-self: flex-end;
    margin-bottom: 2px;
  }

  .send-btn:hover { opacity: 0.85; }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .hint { font-size: 10px; color: var(--muted); text-align: center; margin-top: 8px; }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 10px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 11px;
    color: var(--text);
    animation: fadeUp 0.3s ease;
    z-index: 100;
  }

  .toast.success { border-color: #27ae60; color: #27ae60; }
  .toast.error { border-color: var(--danger); color: var(--danger); }

  .no-sources { font-size: 10px; color: var(--muted); font-style: italic; padding: 8px 0; }
`;

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [activeTab, setActiveTab] = useState("pdf");
  const [arxivId, setArxivId] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [toast, setToast] = useState(null);
  const [drag, setDrag] = useState(false);
  const chatEndRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { fetchSources(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSources = async () => {
    try {
      const res = await fetch(`${API}/sources`);
      const data = await res.json();
      setSources(data.sources || []);
    } catch {}
  };

  const handleFileUpload = async (file) => {
    if (!file || !file.name.endsWith(".pdf")) return showToast("Only PDF files supported", "error");
    setIngesting(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API}/ingest/pdf`, { method: "POST", body: formData });
      const data = await res.json();
      showToast(`✓ ${data.message} (${data.chunks} chunks)`);
      fetchSources();
    } catch { showToast("Upload failed", "error"); }
    setIngesting(false);
  };

  const handleArxiv = async () => {
    if (!arxivId.trim()) return;
    setIngesting(true);
    try {
      const res = await fetch(`${API}/ingest/arxiv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arxiv_id: arxivId.trim() })
      });
      const data = await res.json();
      showToast(`✓ Ingested: ${data.title}`);
      setArxivId("");
      fetchSources();
    } catch { showToast("ArXiv ingestion failed", "error"); }
    setIngesting(false);
  };

  const handleReset = async () => {
    if (!confirm("Clear all ingested papers?")) return;
    await fetch(`${API}/reset`, { method: "DELETE" });
    setSources([]);
    showToast("Vector store cleared");
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: question }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, top_k: 5 })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "ai", text: data.answer, sources: data.sources }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Error connecting to backend. Make sure the server is running.", sources: [] }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const suggestions = [
    "What are the main contributions of this paper?",
    "Explain the methodology used",
    "What datasets were used?",
    "What are the limitations?"
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="logo">
            <div className="logo-title">
              <BookOpen size={18} />
              ScholarMind
            </div>
            <div className="logo-sub">RAG Research Assistant</div>
          </div>

          <div className="sidebar-section">
            <div className="section-label">Ingest Papers</div>
            <div className="ingest-tabs">
              <button className={`tab-btn ${activeTab === "pdf" ? "active" : ""}`} onClick={() => setActiveTab("pdf")}>PDF</button>
              <button className={`tab-btn ${activeTab === "arxiv" ? "active" : ""}`} onClick={() => setActiveTab("arxiv")}>ArXiv</button>
            </div>

            {activeTab === "pdf" ? (
              <div
                className={`upload-zone ${drag ? "drag" : ""}`}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleFileUpload(e.dataTransfer.files[0]); }}
              >
                <input type="file" accept=".pdf" onChange={e => handleFileUpload(e.target.files[0])} ref={fileRef} />
                {ingesting
                  ? <Loader2 size={18} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
                  : <Upload size={18} style={{ color: "var(--muted)" }} />
                }
                <div className="upload-text">{ingesting ? "Processing..." : "Drop PDF or click to upload"}</div>
              </div>
            ) : (
              <div className="input-row">
                <input
                  className="text-input"
                  placeholder="e.g. 2005.11401"
                  value={arxivId}
                  onChange={e => setArxivId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleArxiv()}
                />
                <button className="icon-btn" onClick={handleArxiv} disabled={ingesting}>
                  {ingesting ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Plus size={14} />}
                </button>
              </div>
            )}
          </div>

          <div className="sources-list">
            <div className="section-label">Ingested Papers ({sources.length})</div>
            {sources.length === 0
              ? <div className="no-sources">No papers ingested yet</div>
              : sources.map((s, i) => (
                <div className="source-item" key={i}>
                  <div className="source-dot" />
                  <span>{s}</span>
                </div>
              ))
            }
          </div>

          <button className="reset-btn" onClick={handleReset}>
            <Trash2 size={12} /> Clear All Papers
          </button>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="header">
            <div className="header-title">Ask anything about your research papers</div>
            <div className="status-text">
              <span className="status-dot" />
              TinyLlama · Ollama
            </div>
          </div>

          <div className="chat-area">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><BookOpen size={28} style={{ color: "var(--muted)" }} /></div>
                <div className="empty-title">ScholarMind</div>
                <div className="empty-sub">Upload research papers on the left, then ask questions about them in natural language.</div>
                <div className="suggestions">
                  {suggestions.map((s, i) => (
                    <div key={i} className="suggestion-chip" onClick={() => setInput(s)}>{s}</div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <div className={`avatar ${m.role}`}>{m.role === "user" ? "U" : "S"}</div>
                  <div className="bubble">
                    {m.text}
                    {m.sources?.length > 0 && (
                      <div className="sources-tag">
                        <strong>Sources</strong>
                        {m.sources.map((s, j) => <span key={j} className="source-pill">{s}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="message ai">
                <div className="avatar ai">S</div>
                <div className="bubble">
                  <div className="thinking">
                    <div className="dot" /><div className="dot" /><div className="dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="input-area">
            <div className="input-box">
              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder="Ask a question about your papers..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
              />
              <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
                <Send size={13} /> Send
              </button>
            </div>
            <div className="hint">Enter to send · Shift+Enter for new line</div>
          </div>
        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
