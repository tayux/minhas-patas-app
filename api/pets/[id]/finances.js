import { sql } from '../../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id: pet_id, recordId } = req.query;

  if (req.method === 'GET') {
    const records = await sql`
      SELECT * FROM financial_records WHERE pet_id = ${pet_id} ORDER BY date DESC
    `;
    return res.status(200).json(records);
  }

  if (req.method === 'POST') {
    const { category, description, amount_brl, date } = req.body;
    if (!category || !amount_brl || !date) {
      return res.status(400).json({ error: 'category, amount_brl and date are required' });
    }
    const [record] = await sql`
      INSERT INTO financial_records (pet_id, category, description, amount_brl, date)
      VALUES (${pet_id}, ${category}, ${description || null}, ${amount_brl}, ${date})
      RETURNING *
    `;
    return res.status(201).json(record);
  }

  if (req.method === 'DELETE' && recordId) {
    await sql`DELETE FROM financial_records WHERE id = ${recordId} AND pet_id = ${pet_id}`;
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
