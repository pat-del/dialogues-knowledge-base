# Agent Instructions for `dialogues-knowledge-base`

## Purpose
Help AI coding agents understand the structure, runtime behavior, and local development flow of this project quickly.

## Project overview
- Simple RAG chatbot for the Dialogues podcast.
- Backend: Node.js + Express in `src/server.js`.
- Retrieval: `src/retriever.js` uses Supabase and Nomic embeddings.
- Prompting: `src/agent.js` sends chat completions to Groq.
- Ingestion: `src/ingest.js` converts `episode1.txt` into vector chunks.
- Frontend: static `public/index.html` with vanilla HTML/CSS/JS.

## Key files
- `src/server.js` — serves static files and exposes POST `/ask`.
- `public/index.html` — browser UI and fetch logic to backend.
- `src/agent.js` — composes RAG prompt and calls Groq chat completions.
- `src/retriever.js` — computes similarity and returns top-N transcript excerpts.
- `src/ingest.js` — reads transcript, embeds chunks, stores them in Postgres/Supabase.
- `episode1.txt` — source transcript content.

## Local development
- Install dependencies: `npm install`
- Run backend: `node src/server.js`
- Open app in browser: `http://localhost:3000`
- The frontend fetches `http://localhost:3000/ask`.

## Environment variables
The app expects these values in `.env`:
- `GROQ_API_KEY`
- `NOMIC_API_KEY`
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Important behavior notes
- There is no build/bundler step. The app uses native ESM and plain browser JS.
- The backend serves `public/` as static assets.
- The `public/index.html` UI performs CORS-enabled requests to the local Express server.
- If you need a browser preview, use the running backend at `http://localhost:3000` rather than relying solely on VS Code Live Server.

## Live server / custom browser guidance
- The canonical local dev flow is: start `node src/server.js`, then open `http://localhost:3000` in a browser.
- If using a Live Server extension for static preview, target `public/index.html`, but you still need the backend running on port `3000` for `/ask` to work.
- Do not assume a custom browser or separate SPA bundler is required.

## Testing assumptions
- There are no existing npm scripts for running or building the app.
- The `test` script is the default placeholder and should not be treated as a real test runner.

## When editing
- Preserve simple vanilla JS and avoid introducing frontend frameworks unless the repo explicitly expands toward a more complex UI.
- Keep backend API shape stable: POST `/ask` with `{ question }` and response `{ question, answer }`.
