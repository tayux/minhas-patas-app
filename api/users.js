import { sql } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // POST — upsert by email so the same Google account = same user on every device
  if (req.method === 'POST') {
    const { name, email, avatar_hue = 28 } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    if (email) {
      const [existing] = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
      if (existing) return res.status(200).json(existing);
    }

    const [user] = await sql`
      INSERT INTO users (name, email, avatar_hue)
      VALUES (${name}, ${email || null}, ${avatar_hue})
      RETURNING *
    `;
    return res.status(201).json(user);
  }

  if (req.method === 'GET') {
    const { id, email } = req.query;
    if (email) {
      const [user] = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json(user);
    }
    if (!id) return res.status(400).json({ error: 'id or email is required' });
    const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
