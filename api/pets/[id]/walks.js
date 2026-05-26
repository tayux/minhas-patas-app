import { sql } from '../../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id: pet_id, recordId } = req.query;

  if (req.method === 'GET') {
    const walks = await sql`
      SELECT * FROM walks WHERE pet_id = ${pet_id} ORDER BY date DESC, created_at DESC
    `;
    return res.status(200).json(walks);
  }

  if (req.method === 'POST') {
    const { date, duration_min = 0, distance_km, mood = 0, notes } = req.body;
    if (!date) return res.status(400).json({ error: 'date is required' });
    const [walk] = await sql`
      INSERT INTO walks (pet_id, date, duration_min, distance_km, mood, notes)
      VALUES (${pet_id}, ${date}, ${duration_min}, ${distance_km || null}, ${mood}, ${notes || null})
      RETURNING *
    `;
    return res.status(201).json(walk);
  }

  if (req.method === 'DELETE' && recordId) {
    await sql`DELETE FROM walks WHERE id = ${recordId} AND pet_id = ${pet_id}`;
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
