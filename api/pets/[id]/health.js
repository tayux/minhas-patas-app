import { sql } from '../../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id: pet_id } = req.query;

  if (req.method === 'GET') {
    const records = await sql`
      SELECT * FROM health_records WHERE pet_id = ${pet_id} ORDER BY date DESC
    `;
    return res.status(200).json(records);
  }

  if (req.method === 'POST') {
    const { type, title, date, vet_name, clinic, notes, cost_brl, attachment_url } = req.body;
    if (!type || !title || !date) return res.status(400).json({ error: 'type, title, date are required' });
    const [record] = await sql`
      INSERT INTO health_records (pet_id, type, title, date, vet_name, clinic, notes, cost_brl, attachment_url)
      VALUES (${pet_id}, ${type}, ${title}, ${date}, ${vet_name || null}, ${clinic || null},
              ${notes || null}, ${cost_brl || null}, ${attachment_url || null})
      RETURNING *
    `;
    return res.status(201).json(record);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
