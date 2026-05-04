import 'dotenv/config';
import express from 'express';
import { ask } from './agent.js';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.json({ status: 'Dialogues Knowledge Base API is running' });
});

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const answer = await ask(question);
    return res.json({ question, answer });
  } catch (error) {
    console.error('Error answering question:', error);
    return res.status(500).json({ error: 'Unable to answer the question at this time' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
