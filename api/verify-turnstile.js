export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    // Use environment variable, fallback to Cloudflare's always-pass secret for local development/testing
    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x00000000000000000000000000000000AA';

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`
    });

    const data = await response.json();
    return res.status(200).json({ success: data.success });
  } catch (error) {
    console.error('Error verifying Turnstile:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
