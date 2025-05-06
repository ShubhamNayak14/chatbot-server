// api/chat.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const api_key = process.env.OPENROUTER_API_KEY;
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: question }],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No response received.';
    res.status(200).json({ response: content });
  } catch (error) {
    console.error('Fetch failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
