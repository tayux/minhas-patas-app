import { sql } from '../_db.js';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

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
    // Fetch current values first so missing fields fall back gracefully
    const [current] = await sql`SELECT * FROM pets WHERE id = ${id}`;
    if (!current) return res.status(404).json({ error: 'Pet not found' });

    const b = req.body;
    // Explicit null is allowed for optional fields (clears the value in DB).
    // Only fall back to current when the key is entirely absent from the body.
    const name       = 'name'       in b ? b.name       : current.name;
    const species    = 'species'    in b ? b.species     : current.species;
    const sex        = 'sex'        in b ? b.sex         : current.sex;
    const breed      = 'breed'      in b ? b.breed       : current.breed;
    const weight_kg  = 'weight_kg'  in b ? b.weight_kg   : current.weight_kg;
    const birth_year = 'birth_year' in b ? b.birth_year  : current.birth_year;
    const neutered   = 'neutered'   in b ? b.neutered    : current.neutered;
    const photo_url  = 'photo_url'  in b ? b.photo_url   : current.photo_url;
    const hue        = 'hue'        in b ? b.hue         : current.hue;

    const [pet] = await sql`
      UPDATE pets SET
        name        = ${name},
        species     = ${species},
        sex         = ${sex},
        breed       = ${breed},
        weight_kg   = ${weight_kg},
        birth_year  = ${birth_year},
        neutered    = ${neutered},
        photo_url   = ${photo_url},
        hue         = ${hue}
      WHERE id = ${id}
      RETURNING *
    `;
    return res.status(200).json(pet);
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM pets WHERE id = ${id}`;
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
