# Dialogues Knowledge Base

A RAG (Retrieval-Augmented Generation) chatbot built on top of the Dialogues podcast transcript archive. Ask questions about any topic discussed on the podcast and get answers grounded in actual episode content.

## Architecture
Transcript (.txt)
      ↓
Ingestion Pipeline
(chunk → embed → store)
      ↓
Supabase + pgvector
      ↓
Cosine Similarity Retrieval ← User Question
      ↓
Groq LLM (llama-3.3-70b)
      ↓
Express REST API
      ↓
Chat Frontend
## Tech Stack

- **Runtime:** Node.js (ESM)
- **API:** Express.js
- **Embeddings:** Nomic Embed v1.5
- **Vector Store:** Supabase (pgvector)
- **LLM:** Groq (llama-3.3-70b-versatile)
- **Frontend:** Vanilla HTML/CSS/JS

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file:

```env
DATABASE_URL=your_supabase_connection_string
GROQ_API_KEY=your_groq_api_key
NOMIC_API_KEY=your_nomic_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Add your transcript as `episode1.txt` in the root
5. Run ingestion: `node src/ingest.js`
6. Start server: `node src/server.js`
7. Open `http://localhost:3000`

## Project Structure
src/
ingest.js      # Transcript ingestion pipeline
retriever.js   # Vector similarity search
agent.js       # RAG query + Groq response
server.js      # Express API
public/
index.html     # Chat frontend