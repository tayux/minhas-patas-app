import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { user_id, rating, category, comment, rating_label } = req.body;
    const result = await sql`
      INSERT INTO feedbacks (user_id, rating, category, comment, rating_label)
      VALUES (${user_id || null}, ${rating}, ${category || 'Geral'}, ${comment || null}, ${rating_label || null})
      RETURNING id, created_at
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
