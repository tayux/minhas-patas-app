import { sql } from '../../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id: pet_id, recordId } = req.query;

  if (req.method === 'GET') {
    const entries = await sql`
      SELECT * FROM diary_entries WHERE pet_id = ${pet_id} ORDER BY date DESC, created_at DESC
    `;
    return res.status(200).json(entries);
  }

  if (req.method === 'POST') {
    const { date, mood = 3, appetite = 1, behaviors = [], note } = req.body;
    if (!date) return res.status(400).json({ error: 'date is required' });
    const [entry] = await sql`
      INSERT INTO diary_entries (pet_id, date, mood, appetite, behaviors, note)
      VALUES (${pet_id}, ${date}, ${mood}, ${appetite}, ${JSON.stringify(behaviors)}, ${note || null})
      RETURNING *
    `;
    return res.status(201).json(entry);
  }

  if (req.method === 'PATCH' && recordId) {
    const { mood, appetite, behaviors, note } = req.body || {};
    const [entry] = await sql`
      UPDATE diary_entries
      SET mood      = COALESCE(${mood ?? null}, mood),
          appetite  = COALESCE(${appetite ?? null}, appetite),
          behaviors = COALESCE(${behaviors ? JSON.stringify(behaviors) : null}::jsonb, behaviors),
          note      = COALESCE(${note ?? null}, note)
      WHERE id = ${recordId} AND pet_id = ${pet_id}
      RETURNING *
    `;
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    return res.status(200).json(entry);
  }

  if (req.method === 'DELETE' && recordId) {
    await sql`DELETE FROM diary_entries WHERE id = ${recordId} AND pet_id = ${pet_id}`;
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
