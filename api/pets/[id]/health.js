import { sql } from '../../_db.js';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id: pet_id, recordId } = req.query;

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

  if (req.method === 'PATCH' && recordId) {
    const { ai_explanation } = req.body || {};
    if (!ai_explanation) return res.status(400).json({ error: 'ai_explanation is required' });
    const [updated] = await sql`
      UPDATE health_records
      SET ai_explanation = ${JSON.stringify(ai_explanation)}::jsonb
      WHERE id = ${recordId} AND pet_id = ${pet_id}
      RETURNING id, ai_explanation
    `;
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE' && recordId) {
    await sql`DELETE FROM health_records WHERE id = ${recordId} AND pet_id = ${pet_id}`;
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
