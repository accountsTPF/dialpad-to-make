import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const makeUrl = process.env.MAKE_HOOK_URL;
    if (!makeUrl) throw new Error('Missing MAKE_HOOK_URL');

    const response = await fetch(makeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) {
      console.error('Make webhook error', response.status);
      return res.status(502).json({ error: 'Forward failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Relay error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
