import 'dotenv/config';
import Groq from 'groq-sdk';
import { retrieve } from './retriever.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function ask(question) {
  // Step 1: Retrieve relevant chunks
  console.log('Retrieving relevant context...');
  const chunks = await retrieve(question, 3);

  if (chunks.length === 0) {
    return "I couldn't find relevant information in the podcast transcripts.";
  }

  // Step 2: Build context from chunks
  const context = chunks
    .map((c, i) => `[Excerpt ${i + 1} from "${c.episode_title}"]:\n${c.content}`)
    .join('\n\n');

  // Step 3: Send to Groq with RAG prompt
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant for the Dialogues podcast. 
You answer questions based strictly on the podcast transcript excerpts provided.
If the answer is not in the excerpts, say so honestly.
Always reference which episode the information comes from.`
      },
      {
        role: 'user',
        content: `Here are relevant excerpts from the podcast:\n\n${context}\n\nQuestion: ${question}`
      }
    ],
    temperature: 0.3,
    max_tokens: 1000
  });

  return response.choices[0].message.content;
}

// Test
const question = "What did the hosts say about the manosphere?";
console.log(`\nQuestion: ${question}\n`);
const answer = await ask(question);
console.log('Answer:\n', answer);