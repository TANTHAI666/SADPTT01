export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Check API key exists
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: {
        type: 'config_error',
        message: 'ANTHROPIC_API_KEY is not set. Go to Vercel → Project Settings → Environment Variables and add ANTHROPIC_API_KEY.',
      },
    });
  }

  try {
    const body = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
