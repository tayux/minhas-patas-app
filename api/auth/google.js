import { sql } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { google_id, email, name, picture_url, avatar_hue = 28 } = req.body;
  if (!google_id) return res.status(400).json({ error: 'google_id is required' });

  try {
    // Garante colunas google_id e picture_url existem
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS picture_url TEXT`;

    // Upsert: cria ou retorna usuário existente pelo google_id
    const [user] = await sql`
      INSERT INTO users (name, email, avatar_hue, google_id, picture_url)
      VALUES (${name}, ${email || null}, ${avatar_hue}, ${google_id}, ${picture_url || null})
      ON CONFLICT (google_id) DO UPDATE
        SET name = EXCLUDED.name,
            picture_url = EXCLUDED.picture_url
      RETURNING *
    `;
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
