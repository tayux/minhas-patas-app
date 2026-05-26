import { createContext, useContext, useState, useEffect } from 'react';
import {
  pushMedicationEvents, pushVaccineEvent, pushConsultationEvent,
  deleteCalendarEvent, isCalendarConnected,
} from '../utils/googleCalendar.js';
import { ddmmToIso, isoToDdmm } from '../utils/dateUtils.js';

const PETS_FALLBACK = [
  {
    id: 'leia',
    name: 'Leia',
    hue: 30,
    photo: false,
    age: '8 anos',
    weight: '12.3 kg',
    breed: 'SRD',
    gender: 'fêmea · castrada',
    tiles: [
      { label:'Saúde',        emoji:'🩺', sub:'em dia'      },
      { label:'Medicamentos', emoji:'💊', sub:'ver lista'   },
      { label:'Finanças',     emoji:'🪙', sub:'ver gastos'  },
      { label:'Documentos',   emoji:'📁', sub:'8 itens'     },
    ],
    upcoming: [],
    medsCount: 0,
    nextDose: '—',
  },
  {
    id: 'filo',
    name: 'Filô',
    hue: 200,
    photo: false,
    age: '3 anos',
    weight: '8.5 kg',
    breed: 'Poodle',
    gender: 'fêmea · castrada',
    tiles: [
      { label:'Saúde',        emoji:'🩺', sub:'ver registros' },
      { label:'Medicamentos', emoji:'💊', sub:'ver lista'     },
      { label:'Finanças',     emoji:'🪙', sub:'ver gastos'    },
      { label:'Documentos',   emoji:'📁', sub:'3 itens'       },
    ],
    upcoming: [],
    medsCount: 0,
    nextDose: '—',
  },
  {
    id: 'fiapa',
    name: 'Fiapa',
    hue: 340,
    photo: false,
    age: '5 anos',
    weight: '15.0 kg',
    breed: 'Labrador mix',
    gender: 'fêmea · não castrada',
    tiles: [
      { label:'Saúde',        emoji:'🩺', sub:'ver registros' },
      { label:'Medicamentos', emoji:'💊', sub:'ver lista'     },
      { label:'Finanças',     emoji:'🪙', sub:'ver gastos'    },
      { label:'Documentos',   emoji:'📁', sub:'5 itens'       },
    ],
    upcoming: [],
    medsCount: 0,
    nextDose: '—',
  },
];

// ── DB ↔ UI helpers ─────────────────────────────────────────────────────────

// Convert frontend medication object to DB fields
function medToDb(med) {
  return {
    name: med.name,
    emoji: med.emoji || '💊',
    type: med.type || 'comprimido',
    dose: med.dose || null,
    frequency: med.freq || med.frequency || 'Diário',
    times: med.times || [],
    start_date: ddmmToIso(med.startDate || med.start_date) || null,
    end_date: med.continuous ? null : (ddmmToIso(med.endDate || med.end_date) || null),
    active: med.on !== false && med.active !== false,
    notes: med.notes || null,
  };
}

// Convert DB row to frontend medication object
function medFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji || '💊',
    type: row.type || 'comprimido',
    dose: row.dose || null,
    freq: row.frequency || 'Diário',
    times: Array.isArray(row.times) ? row.times : [],
    startDate: isoToDdmm(row.start_date) || null,
    endDate: isoToDdmm(row.end_date) || null,
    continuous: !row.end_date,
    on: row.active !== false,
    active: row.active !== false,
    notes: row.notes || null,
    createdAt: row.created_at,
    _fromDb: true,
  };
}

// Health records (healthRecords, consultations, hygieneRecords, documents all share this table)
function healthToDb(rec, defaultType = 'saude') {
  return {
    type: rec.type || defaultType,
    title: rec.title || rec.type || rec.desc || rec.procedure || 'Registro',
    // Convert dd/mm/yyyy → yyyy-mm-dd for Postgres DATE column
    date: ddmmToIso(rec.date) || new Date().toISOString().slice(0, 10),
    vet_name: rec.vet || rec.vet_name || null,
    clinic: rec.clinic || null,
    notes: rec.notes || null,
    cost_brl: rec.cost ? parseFloat(rec.cost) : (rec.price ? parseFloat(rec.price) : null),
    // Store attachment in DB; never bloat localStorage with base64
    attachment_url: rec.attachmentBase64 || rec.attachment_url || null,
  };
}

function healthFromDb(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    // Convert yyyy-mm-dd back to dd/mm/yyyy for UI display
    date: isoToDdmm(row.date) || row.date,
    vet: row.vet_name || null,
    vet_name: row.vet_name || null,
    clinic: row.clinic || null,
    notes: row.notes || null,
    cost: row.cost_brl ? String(row.cost_brl) : null,
    price: row.cost_brl ? String(row.cost_brl) : null,
    attachmentBase64: row.attachment_url || null,
    attachment_url: row.attachment_url || null,
    // AI explanation cached in DB — load it so the UI never re-calls the API
    aiExplanation: row.ai_explanation || null,
    createdAt: row.created_at,
    _fromDb: true,
  };
}

function vaccineToDb(vac) {
  return {
    name: vac.name || vac.vaccine || 'Vacina',
    date: ddmmToIso(vac.date) || new Date().toISOString().slice(0, 10),
    next_date: ddmmToIso(vac.nextDate || vac.next_date) || null,
    lot: vac.lot || vac.batch || null,
    vet_name: vac.vet || vac.vet_name || null,
  };
}

function vaccineFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    date: isoToDdmm(row.date) || row.date,
    nextDate: isoToDdmm(row.next_date) || null,
    next_date: row.next_date || null,
    lot: row.lot || null,
    vet: row.vet_name || null,
    vet_name: row.vet_name || null,
    createdAt: row.created_at,
    _fromDb: true,
  };
}

function financeToDb(exp) {
  return {
    category: exp.cat || exp.category || 'Outros',
    description: exp.desc || exp.description || null,
    amount_brl: parseFloat(exp.amount || exp.amount_brl || 0),
    date: ddmmToIso(exp.date) || new Date().toISOString().slice(0, 10),
  };
}

function financeFromDb(row) {
  return {
    id: row.id,
    cat: row.category,
    category: row.category,
    desc: row.description || null,
    description: row.description || null,
    amount: row.amount_brl ? String(row.amount_brl) : '0',
    amount_brl: row.amount_brl,
    date: isoToDdmm(row.date) || row.date,
    emoji: '💰',
    createdAt: row.created_at,
    _fromDb: true,
  };
}

function dbPetToUi(p) {
  // Prefer photo from DB; fall back to localStorage (older devices before sync)
  const photoUrl = p.photo_url || localStorage.getItem(`pet_photo_${p.id}`) || null;
  let age = '—';
  if (p.birth_year) {
    const years = new Date().getFullYear() - p.birth_year;
    age = `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
  return {
    id: p.id,
    name: p.name,
    hue: p.hue ?? 270,
    photo: !!photoUrl,
    photoUrl,
    age,
    weight: p.weight_kg ? `${p.weight_kg} kg` : '—',
    breed: p.breed || 'SRD',
    gender: `${p.sex === 'male' ? 'macho' : 'fêmea'} · ${p.neutered ? 'castrado(a)' : 'não castrado(a)'}`,
    species: p.species || 'dog',
    sex: p.sex || 'female',
    birth_year: p.birth_year || null,
    weight_kg: p.weight_kg || null,
    tiles: [
      { label:'Saúde',        emoji:'🩺', sub:'ver registros'  },
      { label:'Medicamentos', emoji:'💊', sub:'ver lista'      },
      { label:'Finanças',     emoji:'🪙', sub:'ver gastos'     },
      { label:'Documentos',   emoji:'📁', sub:'ver arquivos'   },
    ],
    upcoming: [],
    medsCount: 0,
    nextDose: '—',
    _fromDb: true,
  };
}

async function ensureUser() {
  const storedUser = JSON.parse(localStorage.getItem('mp_google_user') || 'null');
  const email = storedUser?.email;

  // Email-first: same Google account always maps to the same DB user across devices
  if (email) {
    try {
      const r = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      if (r.ok) {
        const dbUser = await r.json();
        localStorage.setItem('mp_user_id', dbUser.id);
        return dbUser.id;
      }
    } catch {}
  }

  const stored = localStorage.getItem('mp_user_id');
  if (stored) return stored;

  const name = storedUser?.name || 'Usuário';
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email: email || null, avatar_hue: 28 }),
  });
  if (!res.ok) throw new Error('Falha ao criar usuário');
  const user = await res.json();
  localStorage.setItem('mp_user_id', user.id);
  return user.id;
}

const isAuthenticated = () => !!localStorage.getItem('mp_google_user');

function loadPetData() {
  try { return JSON.parse(localStorage.getItem('mp_pet_data') || '{}'); }
  catch { return {}; }
}

export const PETS = PETS_FALLBACK;

export const PetCtx = createContext({
  activePet: null,
  setActivePetId: () => {},
  PETS: [],
  userId: null,
  loading: false,
  addPet: async () => {},
  updatePet: async () => {},
  medications: [],
  addMedication: () => {},
  vaccines: [],
  addVaccine: () => {},
  expenses: [],
  addExpense: () => {},
  consultations: [],
  addConsultation: () => {},
  hygieneRecords: [],
  addHygieneRecord: () => {},
  feedingConfig: null,
  setFeedingConfig: () => {},
  todayTasks: [],
  setTodayTasks: () => {},
});

export const usePet = () => useContext(PetCtx);

export function PetProvider({ children }) {
  // Always start with fallback data — replaced by real DB data once loaded.
  // This prevents a jarring "empty" flash for authenticated users whose DB is still loading.
  const [pets, setPets]               = useState(PETS_FALLBACK);
  const [activePetId, setActivePetId] = useState(PETS_FALLBACK[0].id);
  const [userId, setUserId]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [petData, setPetDataState]    = useState(loadPetData);

  // Accepts either an object (replace) or a function (prev => next). Functional form
  // is required when calling multiple writes in sequence so each read sees the latest state.
  const savePetData = (updater) => {
    setPetDataState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        // Strip attachmentBase64 from all health-type records before persisting to
        // localStorage — base64 attachments can be several MB and quickly exhaust
        // the ~5 MB quota. The attachment lives in the DB (attachment_url).
        const stripped = Object.fromEntries(
          Object.entries(next).map(([petId, data]) => [
            petId,
            {
              ...data,
              ...(data.healthRecords ? { healthRecords: data.healthRecords.map(stripAttachment) } : {}),
              ...(data.consultations ? { consultations: data.consultations.map(stripAttachment) } : {}),
              ...(data.hygieneRecords ? { hygieneRecords: data.hygieneRecords.map(stripAttachment) } : {}),
              ...(data.documents     ? { documents:     data.documents.map(stripAttachment)     } : {}),
            },
          ])
        );
        localStorage.setItem('mp_pet_data', JSON.stringify(stripped));
      } catch(e) {
        console.warn('mp_pet_data save failed:', e?.name, e?.message?.slice(0, 80));
      }
      return next;
    });
  };

  // Remove large base64 blobs before writing to localStorage; keep only DB reference.
  function stripAttachment(item) {
    if (!item.attachmentBase64) return item;
    const { attachmentBase64, ...rest } = item;
    return rest;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const uid = await ensureUser();
        if (cancelled) return;
        setUserId(uid);

        const res = await fetch(`/api/pets?userId=${uid}`);
        if (!res.ok) throw new Error('Falha ao buscar pets');
        const dbPets = await res.json();
        if (cancelled) return;

        // Always replace state with real DB data — even an empty array.
        // PETS_FALLBACK is only valid before the first DB response (loading splash).
        // Showing fallback pets to a user who has none is misleading and must be avoided.
        const uiPets = dbPets.map(dbPetToUi);
        setPets(uiPets);
        setActivePetId(uiPets[0]?.id ?? null);
      } catch (err) {
        console.warn('API indisponível, usando dados locais:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addPet = async (petData) => {
    // Re-resolve userId if the async init hasn't completed yet (race condition on first open)
    let uid = userId;
    if (!uid) {
      try { uid = await ensureUser(); setUserId(uid); } catch (e) {}
    }
    if (!uid) throw new Error('Usuário não identificado. Tente novamente.');

    const { photoDataUrl, ...fields } = petData;
    const res = await fetch('/api/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: uid, ...fields, photo_url: photoDataUrl || null }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Falha ao criar pet: ${text}`);
    }
    const newPet = await res.json();
    // Also cache photo in localStorage for faster first paint
    if (photoDataUrl) {
      try { localStorage.setItem(`pet_photo_${newPet.id}`, photoDataUrl); } catch {}
    }
    const uiPet = dbPetToUi(newPet);
    setPets(prev => [...prev, uiPet]);
    return uiPet;
  };

  const deletePet = async (id) => {
    try {
      await fetch(`/api/pets/${id}`, { method: 'DELETE' });
    } catch (e) {}
    localStorage.removeItem(`pet_photo_${id}`);
    savePetData(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setPets(prev => prev.filter(p => p.id !== id));
    setActivePetId(prev => prev === id ? null : prev);
  };

  const updatePet = async (id, petData) => {
    const { photoDataUrl, ...fields } = petData;

    const res = await fetch(`/api/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // Send photo_url to DB so it syncs across devices
      body: JSON.stringify({ ...fields, ...(photoDataUrl !== undefined ? { photo_url: photoDataUrl } : {}) }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`api:${res.status}:${text}`);
    }
    const updated = await res.json();

    // Also cache in localStorage for faster first paint on this device
    if (photoDataUrl) {
      try {
        localStorage.removeItem(`pet_photo_${id}`);
        localStorage.setItem(`pet_photo_${id}`, photoDataUrl);
      } catch {}
    }

    const uiPet = dbPetToUi(updated);
    setPets(prev => prev.map(p => p.id === id ? uiPet : p));
    return uiPet;
  };

  const activePet = pets.find(p => p.id === activePetId) || (pets.length > 0 ? pets[0] : null);
  const pid = activePet?.id;

  // Fetch all pet data from DB whenever the active pet changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!pid) return;
    let cancelled = false;
    (async () => {
      try {
        const [medsRes, healthRes, vacRes, finRes] = await Promise.all([
          fetch(`/api/pets/${pid}/medications`),
          fetch(`/api/pets/${pid}/health`),
          fetch(`/api/pets/${pid}/vaccines`),
          fetch(`/api/pets/${pid}/finances`),
        ]);
        if (cancelled) return;

        const [medsRows, healthRows, vacRows, finRows] = await Promise.all([
          medsRes.ok  ? medsRes.json()   : [],
          healthRes.ok ? healthRes.json() : [],
          vacRes.ok   ? vacRes.json()    : [],
          finRes.ok   ? finRes.json()    : [],
        ]);
        if (cancelled) return;

        const meds        = medsRows.map(medFromDb);
        const vaccines    = vacRows.map(vaccineFromDb);
        const finances    = finRows.map(financeFromDb);
        const healthRecs  = healthRows.filter(r => !['consulta','higiene','documento'].includes(r.type)).map(healthFromDb);
        const consults    = healthRows.filter(r => r.type === 'consulta').map(healthFromDb);
        const hygienes    = healthRows.filter(r => r.type === 'higiene').map(healthFromDb);
        const docs        = healthRows.filter(r => r.type === 'documento').map(healthFromDb);

        savePetData(prev => {
          const cur = prev[pid] || {};
          const patch = {};
          if (meds.length     > 0) patch.medications   = meds;
          if (vaccines.length > 0) patch.vaccines       = vaccines;
          if (finances.length > 0) patch.expenses       = finances;
          if (healthRecs.length > 0) patch.healthRecords = healthRecs;
          if (consults.length > 0)   patch.consultations = consults;
          if (hygienes.length > 0)   patch.hygieneRecords = hygienes;
          if (docs.length     > 0)   patch.documents     = docs;
          return { ...prev, [pid]: { ...cur, ...patch } };
        });
      } catch (e) {
        console.warn('Falha ao sincronizar dados do pet:', e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [pid]);

  // Per-pet data helpers
  const getList = (key) => (pid ? (petData[pid]?.[key] || []) : []);
  const addToList = (key, item) => {
    if (!pid) return;
    const newItem = { ...item, id: String(Date.now()) + Math.random().toString(36).slice(2,6), createdAt: new Date().toISOString() };
    savePetData(prev => ({
      ...prev,
      [pid]: { ...prev[pid], [key]: [newItem, ...(prev[pid]?.[key] || [])] },
    }));
    return newItem;
  };
  const setForPet = (key, value) => {
    if (!pid) return;
    savePetData(prev => ({ ...prev, [pid]: { ...prev[pid], [key]: value } }));
  };

  const medications    = getList('medications');
  const updateItem = (key, id, patch) => {
    if (!pid) return;
    savePetData(prev => {
      const current = prev[pid] || {};
      const list = current[key] || [];
      return {
        ...prev,
        [pid]: { ...current, [key]: list.map(it => it.id === id ? { ...it, ...patch } : it) },
      };
    });
  };
  const removeFromList = (key, id) => {
    if (!pid) return;
    savePetData(prev => {
      const current = prev[pid] || {};
      const list = current[key] || [];
      return {
        ...prev,
        [pid]: { ...current, [key]: list.filter(it => it.id !== id) },
      };
    });
  };
  const addMedication = (med) => {
    const saved = addToList('medications', med);
    if (saved && pid) {
      // Sync to DB in background; on success swap temp id for DB uuid
      fetch(`/api/pets/${pid}/medications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medToDb(med)),
      }).then(r => r.ok ? r.json() : null).then(row => {
        if (row?.id) updateItem('medications', saved.id, { id: row.id, _fromDb: true });
      }).catch(() => {});

      pushMedicationEvents(saved, activePet?.name).then(eventIds => {
        if (eventIds && Object.keys(eventIds).length > 0) {
          updateItem('medications', saved.id, { gcalEventIds: eventIds });
        }
      }).catch(() => {});
    }
    return saved;
  };
  const updateMedication = (id, patch) => {
    if (!pid) return;
    const existing = (petData[pid]?.medications || []).find(m => m.id === id);
    updateItem('medications', id, patch);
    const merged = { ...existing, ...patch };
    // Sync to DB in background
    fetch(`/api/pets/${pid}/medications?medId=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medToDb(merged)),
    }).catch(() => {});
    // If times/dates changed, drop old GCal events and reschedule.
    const timesChanged = patch.times && JSON.stringify(patch.times) !== JSON.stringify(existing?.times);
    const dateChanged = ('startDate' in patch && patch.startDate !== existing?.startDate)
      || ('endDate' in patch && patch.endDate !== existing?.endDate)
      || ('continuous' in patch && patch.continuous !== existing?.continuous);
    if ((timesChanged || dateChanged) && existing?.gcalEventIds) {
      Object.values(existing.gcalEventIds).forEach(eid => deleteCalendarEvent(eid).catch(() => {}));
      pushMedicationEvents(merged, activePet?.name).then(eventIds => {
        updateItem('medications', id, { gcalEventIds: eventIds || {} });
      }).catch(() => {});
    }
  };
  const deleteMedication = (id) => {
    if (!pid) return;
    const existing = (petData[pid]?.medications || []).find(m => m.id === id);
    if (existing?.gcalEventIds) {
      Object.values(existing.gcalEventIds).forEach(eid => deleteCalendarEvent(eid).catch(() => {}));
    }
    removeFromList('medications', id);
    // Sync deletion to DB in background
    fetch(`/api/pets/${pid}/medications?medId=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Pushes existing items that don't yet have GCal event IDs (e.g. created
  // before the user connected Google Calendar). Called when the user connects.
  const syncAllToCalendar = async () => {
    if (!isCalendarConnected() || !pid) return { meds: 0, vac: 0, con: 0 };
    const current = petData[pid] || {};
    let medsPushed = 0, vacPushed = 0, conPushed = 0;
    for (const m of (current.medications || [])) {
      if (m.on === false) continue;
      if (m.gcalEventIds && Object.keys(m.gcalEventIds).length > 0) continue;
      const ids = await pushMedicationEvents(m, activePet?.name);
      if (ids && Object.keys(ids).length > 0) {
        updateItem('medications', m.id, { gcalEventIds: ids });
        medsPushed++;
      }
    }
    for (const v of (current.vaccines || [])) {
      if (v.gcalEventId) continue;
      const r = await pushVaccineEvent(v, activePet?.name);
      if (r?.ok && r.event?.id) {
        updateItem('vaccines', v.id, { gcalEventId: r.event.id });
        vacPushed++;
      }
    }
    for (const c of (current.consultations || [])) {
      if (c.gcalEventId) continue;
      const r = await pushConsultationEvent(c, activePet?.name);
      if (r?.ok && r.event?.id) {
        updateItem('consultations', c.id, { gcalEventId: r.event.id });
        conPushed++;
      }
    }
    return { meds: medsPushed, vac: vacPushed, con: conPushed };
  };
  const vaccines       = getList('vaccines');
  const addVaccine     = (vac) => {
    const saved = addToList('vaccines', vac);
    if (saved && pid) {
      fetch(`/api/pets/${pid}/vaccines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vaccineToDb(vac)),
      }).then(r => r.ok ? r.json() : null).then(row => {
        if (row?.id) updateItem('vaccines', saved.id, { id: row.id, _fromDb: true });
      }).catch(() => {});
      pushVaccineEvent(saved, activePet?.name).then(r => {
        if (r?.ok && r.event?.id) updateItem('vaccines', saved.id, { gcalEventId: r.event.id });
      }).catch(() => {});
    }
    return saved;
  };
  const deleteVaccine = (id) => {
    removeFromList('vaccines', id);
    if (pid) fetch(`/api/pets/${pid}/vaccines?recordId=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const expenses       = getList('expenses');
  const addExpense     = (exp) => {
    const saved = addToList('expenses', exp);
    if (saved && pid) {
      fetch(`/api/pets/${pid}/finances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(financeToDb(exp)),
      }).then(r => r.ok ? r.json() : null).then(row => {
        if (row?.id) updateItem('expenses', saved.id, { id: row.id, _fromDb: true });
      }).catch(() => {});
    }
    return saved;
  };
  const deleteExpense = (id) => {
    removeFromList('expenses', id);
    if (pid) fetch(`/api/pets/${pid}/finances?recordId=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const addExpenseForPet = (petId, exp) => {
    if (!petId) return;
    const newItem = { ...exp, id: String(Date.now()) + Math.random().toString(36).slice(2,6), createdAt: new Date().toISOString() };
    savePetData(prev => ({
      ...prev,
      [petId]: { ...prev[petId], expenses: [newItem, ...(prev[petId]?.expenses || [])] },
    }));
    fetch(`/api/pets/${petId}/finances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(financeToDb(exp)),
    }).catch(() => {});
    return newItem;
  };

  const consultations  = getList('consultations');
  const addConsultation = (con) => {
    const saved = addToList('consultations', con);
    if (saved && pid) {
      fetch(`/api/pets/${pid}/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(healthToDb(con, 'consulta')),
      }).then(r => r.ok ? r.json() : null).then(row => {
        if (row?.id) updateItem('consultations', saved.id, { id: row.id, _fromDb: true });
      }).catch(() => {});
      pushConsultationEvent(saved, activePet?.name).then(r => {
        if (r?.ok && r.event?.id) updateItem('consultations', saved.id, { gcalEventId: r.event.id });
      }).catch(() => {});
    }
    return saved;
  };
  const deleteConsultation = (id) => {
    removeFromList('consultations', id);
    if (pid) fetch(`/api/pets/${pid}/health?recordId=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const hygieneRecords = getList('hygieneRecords');
  const addHygieneRecord = (rec) => {
    if (!pid) return;
    const now = Date.now();
    const newRec = { ...rec, id: String(now) + 'h', createdAt: new Date().toISOString() };
    const expense = rec.price ? {
      id: String(now) + 'e',
      createdAt: new Date().toISOString(),
      cat: 'Higiene', emoji: '✂️', desc: rec.type,
      amount: rec.price, date: rec.date,
    } : null;
    savePetData(prev => {
      const current = prev[pid] || {};
      const nextPet = {
        ...current,
        hygieneRecords: [newRec, ...(current.hygieneRecords || [])],
      };
      if (expense) nextPet.expenses = [expense, ...(current.expenses || [])];
      return { ...prev, [pid]: nextPet };
    });
    // Sync hygiene record to DB
    fetch(`/api/pets/${pid}/health`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(healthToDb(rec, 'higiene')),
    }).catch(() => {});
    // Sync linked expense to DB
    if (expense) {
      fetch(`/api/pets/${pid}/finances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(financeToDb(expense)),
      }).catch(() => {});
    }
    return newRec;
  };
  const deleteHygieneRecord = (id) => {
    removeFromList('hygieneRecords', id);
    if (pid) fetch(`/api/pets/${pid}/health?recordId=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const healthRecords  = getList('healthRecords');
  const addHealthRecord = (rec) => {
    const saved = addToList('healthRecords', rec);
    if (saved && pid) {
      fetch(`/api/pets/${pid}/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(healthToDb(rec, 'saude')),
      }).then(r => r.ok ? r.json() : null).then(row => {
        if (row?.id) updateItem('healthRecords', saved.id, { id: row.id, _fromDb: true });
      }).catch(() => {});
    }
    return saved;
  };
  const deleteHealthRecord = (id) => {
    removeFromList('healthRecords', id);
    if (pid) fetch(`/api/pets/${pid}/health?recordId=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Save AI explanation to DB and update local state so the modal never re-calls the API
  const saveExamExplanation = (recordId, explanation) => {
    if (!pid || !recordId) return;
    updateItem('healthRecords', recordId, { aiExplanation: explanation });
    fetch(`/api/pets/${pid}/health?recordId=${recordId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ai_explanation: explanation }),
    }).catch(() => {});
  };

  const documents      = getList('documents');
  const addDocument    = (doc) => {
    const saved = addToList('documents', doc);
    if (saved && pid) {
      fetch(`/api/pets/${pid}/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(healthToDb(doc, 'documento')),
      }).then(r => r.ok ? r.json() : null).then(row => {
        if (row?.id) updateItem('documents', saved.id, { id: row.id, _fromDb: true });
      }).catch(() => {});
    }
    return saved;
  };
  const deleteDocument = (id) => {
    removeFromList('documents', id);
    if (pid) fetch(`/api/pets/${pid}/health?recordId=${id}`, { method: 'DELETE' }).catch(() => {});
  };
  const diaryEntries     = getList('diaryEntries');
  const addDiaryEntry    = (entry) => addToList('diaryEntries', entry);
  const updateDiaryEntry = (id, patch) => updateItem('diaryEntries', id, patch);

  const feedbacks      = getList('feedbacks');
  const addFeedback    = (fb) => addToList('feedbacks', fb);
  const feedingConfig  = pid ? (petData[pid]?.feedingConfig || null) : null;
  const setFeedingConfig = (config) => setForPet('feedingConfig', config);
  const todayTasks     = getList('todayTasks');
  const setTodayTasks  = (tasks) => setForPet('todayTasks', tasks);

  return (
    <PetCtx.Provider value={{
      activePet, setActivePetId, PETS: pets, userId, loading,
      addPet, updatePet, deletePet,
      medications, addMedication, updateMedication, deleteMedication,
      vaccines, addVaccine, deleteVaccine,
      expenses, addExpense, deleteExpense, addExpenseForPet,
      consultations, addConsultation, deleteConsultation,
      hygieneRecords, addHygieneRecord, deleteHygieneRecord,
      healthRecords, addHealthRecord, deleteHealthRecord, saveExamExplanation,
      documents, addDocument, deleteDocument,
      diaryEntries, addDiaryEntry, updateDiaryEntry,
      feedbacks, addFeedback,
      feedingConfig, setFeedingConfig,
      todayTasks, setTodayTasks,
    }}>
      {children}
    </PetCtx.Provider>
  );
}
