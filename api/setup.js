import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT,
        avatar_hue INTEGER DEFAULT 28,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS pets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        species TEXT DEFAULT 'dog',
        sex TEXT DEFAULT 'female',
        breed TEXT,
        weight_kg NUMERIC(5,2),
        birth_year INTEGER,
        neutered BOOLEAN DEFAULT false,
        photo_url TEXT,
        hue INTEGER DEFAULT 270,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS medications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        emoji TEXT DEFAULT '💊',
        type TEXT DEFAULT 'comprimido',
        dose TEXT,
        frequency TEXT,
        times JSONB DEFAULT '[]',
        start_date DATE,
        end_date DATE,
        active BOOLEAN DEFAULT true,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS medication_doses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
        scheduled_at TIMESTAMPTZ NOT NULL,
        taken_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS health_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        date DATE NOT NULL,
        vet_name TEXT,
        clinic TEXT,
        notes TEXT,
        cost_brl NUMERIC(10,2),
        attachment_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS vaccines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        date DATE NOT NULL,
        next_date DATE,
        lot TEXT,
        vet_name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS financial_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        description TEXT,
        amount_brl NUMERIC(10,2) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        category TEXT DEFAULT 'Geral',
        comment TEXT,
        rating_label TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS walks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        duration_min INTEGER DEFAULT 0,
        distance_km NUMERIC(6,2),
        mood INTEGER DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        mood INTEGER DEFAULT 3,
        appetite INTEGER DEFAULT 1,
        behaviors JSONB DEFAULT '[]',
        note TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    // Migrations — safe to run on every setup call
    await sql`ALTER TABLE health_records ADD COLUMN IF NOT EXISTS ai_explanation JSONB`;

    res.status(200).json({ ok: true, message: 'Schema criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
