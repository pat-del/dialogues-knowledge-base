import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function embedQuery(text) {
  const response = await fetch('https://api-atlas.nomic.ai/v1/embedding/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`
    },
    body: JSON.stringify({
      model: 'nomic-embed-text-v1.5',
      texts: [text],
      task_type: 'search_query'
    })
  });
  const data = await response.json();
  return data.embeddings[0];
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

export async function retrieve(question, topK = 3) {
  const queryEmbedding = await embedQuery(question);

  const { data, error } = await supabase
    .from('documents')
    .select('id, episode_title, content, embedding');

  if (error) {
    console.error('Fetch error:', error);
    return [];
  }

  const scored = data.map(doc => ({
    id: doc.id,
    episode_title: doc.episode_title,
    content: doc.content,
    similarity: cosineSimilarity(queryEmbedding, JSON.parse(doc.embedding))
  }));

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}
