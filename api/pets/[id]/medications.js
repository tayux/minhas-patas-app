import { sql } from '../../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id: pet_id, medId } = req.query;

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

  // PUT /api/pets/:id/medications?medId=:medId — update a single medication
  if (req.method === 'PUT' && medId) {
    const { name, emoji = '💊', type = 'comprimido', dose, frequency,
            times = [], start_date, end_date, active = true, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [med] = await sql`
      UPDATE medications
      SET name = ${name}, emoji = ${emoji}, type = ${type},
          dose = ${dose || null}, frequency = ${frequency || null},
          times = ${JSON.stringify(times)},
          start_date = ${start_date || null}, end_date = ${end_date || null},
          active = ${active !== false}, notes = ${notes || null}
      WHERE id = ${medId} AND pet_id = ${pet_id}
      RETURNING *
    `;
    if (!med) return res.status(404).json({ error: 'Medication not found' });
    return res.status(200).json(med);
  }

  // DELETE /api/pets/:id/medications?medId=:medId — delete a single medication
  if (req.method === 'DELETE' && medId) {
    await sql`DELETE FROM medications WHERE id = ${medId} AND pet_id = ${pet_id}`;
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
