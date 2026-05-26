import { sql } from '../../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id: pet_id, recordId } = req.query;

  if (req.method === 'GET') {
    const vaccines = await sql`
      SELECT * FROM vaccines WHERE pet_id = ${pet_id} ORDER BY date DESC
    `;
    return res.status(200).json(vaccines);
  }

  if (req.method === 'POST') {
    const { name, date, next_date, lot, vet_name } = req.body;
    if (!name || !date) return res.status(400).json({ error: 'name and date are required' });
    const [vaccine] = await sql`
      INSERT INTO vaccines (pet_id, name, date, next_date, lot, vet_name)
      VALUES (${pet_id}, ${name}, ${date}, ${next_date || null}, ${lot || null}, ${vet_name || null})
      RETURNING *
    `;
    return res.status(201).json(vaccine);
  }

  if (req.method === 'DELETE' && recordId) {
    await sql`DELETE FROM vaccines WHERE id = ${recordId} AND pet_id = ${pet_id}`;
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
