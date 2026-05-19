import { sql } from '../../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id: pet_id } = req.query;

  if (req.method === 'GET') {
    const meds = await sql`
      SELECT * FROM medications WHERE pet_id = ${pet_id} ORDER BY created_at DESC
    `;
    return res.status(200).json(meds);
  }

  if (req.method === 'POST') {
    const { name, emoji = '💊', type = 'comprimido', dose, frequency,
            times = [], start_date, end_date, active = true, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [med] = await sql`
      INSERT INTO medications (pet_id, name, emoji, type, dose, frequency, times, start_date, end_date, active, notes)
      VALUES (${pet_id}, ${name}, ${emoji}, ${type}, ${dose || null}, ${frequency || null},
              ${JSON.stringify(times)}, ${start_date || null}, ${end_date || null}, ${active}, ${notes || null})
      RETURNING *
    `;
    return res.status(201).json(med);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
