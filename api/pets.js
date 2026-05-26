import { sql } from './_db.js';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const pets = await sql`
      SELECT * FROM pets WHERE user_id = ${userId} ORDER BY created_at ASC
    `;
    return res.status(200).json(pets);
  }

  if (req.method === 'POST') {
    const { user_id, name, species = 'dog', sex = 'female', breed, weight_kg,
            birth_year, neutered = false, photo_url, hue = 270 } = req.body;
    if (!user_id || !name) return res.status(400).json({ error: 'user_id and name are required' });
    const [pet] = await sql`
      INSERT INTO pets (user_id, name, species, sex, breed, weight_kg, birth_year, neutered, photo_url, hue)
      VALUES (${user_id}, ${name}, ${species}, ${sex}, ${breed || null},
              ${weight_kg || null}, ${birth_year || null}, ${neutered}, ${photo_url || null}, ${hue})
      RETURNING *
    `;
    return res.status(201).json(pet);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
