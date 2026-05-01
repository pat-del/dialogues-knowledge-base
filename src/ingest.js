import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Split transcript into chunks
function chunkText(text, chunkSize = 500, overlap = 50) {
  const words = text.split(' ');
  const chunks = [];
  let i = 0;

  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
    i += chunkSize - overlap;
  }

  return chunks;
}

// Get embeddings from Nomic
async function getEmbedding(text) {
  const response = await fetch('https://api-atlas.nomic.ai/v1/embedding/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`
    },
    body: JSON.stringify({
      model: 'nomic-embed-text-v1.5',
      texts: [text],
      task_type: 'search_document'
    })
  });

  const data = await response.json();
  return data.embeddings[0];
}

// Main ingestion function
async function ingestTranscript(filePath, episodeTitle) {
  console.log(`Reading transcript: ${episodeTitle}`);
  const text = fs.readFileSync(filePath, 'utf-8');
  const chunks = chunkText(text);
  console.log(`Split into ${chunks.length} chunks`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Embedding chunk ${i + 1}/${chunks.length}...`);

    const embedding = await getEmbedding(chunk);
    const vectorString = `[${embedding.join(',')}]`;

    await pool.query(
      `INSERT INTO documents (episode_title, content, embedding) 
       VALUES ($1, $2, $3::vector)`,
      [episodeTitle, chunk, vectorString]
    );
  }

  console.log(`Done! ${chunks.length} chunks stored in Supabase.`);
  await pool.end();
}

// Run it
ingestTranscript(
  path.join(process.cwd(), 'episode1.txt'),
  'Episode 1 - The Manosphere'
);