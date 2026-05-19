import { sql } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { name, email, avatar_hue = 28 } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [user] = await sql`
      INSERT INTO users (name, email, avatar_hue)
      VALUES (${name}, ${email || null}, ${avatar_hue})
      RETURNING *
    `;
    return res.status(201).json(user);
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
