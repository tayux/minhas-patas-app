import { sql } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const [pet] = await sql`SELECT * FROM pets WHERE id = ${id}`;
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    return res.status(200).json(pet);
  }

  if (req.method === 'PUT') {
    const { name, species, sex, breed, weight_kg, birth_year, neutered, photo_url, hue } = req.body;
    const [pet] = await sql`
      UPDATE pets SET
        name        = COALESCE(${name}, name),
        species     = COALESCE(${species}, species),
        sex         = COALESCE(${sex}, sex),
        breed       = COALESCE(${breed}, breed),
        weight_kg   = COALESCE(${weight_kg}, weight_kg),
        birth_year  = COALESCE(${birth_year}, birth_year),
        neutered    = COALESCE(${neutered}, neutered),
        photo_url   = COALESCE(${photo_url}, photo_url),
        hue         = COALESCE(${hue}, hue)
      WHERE id = ${id}
      RETURNING *
    `;
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    return res.status(200).json(pet);
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM pets WHERE id = ${id}`;
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
