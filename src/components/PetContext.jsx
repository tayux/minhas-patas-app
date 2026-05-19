import { createContext, useContext, useState, useEffect } from 'react';

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

function dbPetToUi(p) {
  const photoUrl = localStorage.getItem(`pet_photo_${p.id}`) || null;
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
  let userId = localStorage.getItem('mp_user_id');
  if (userId) return userId;

  const storedUser = JSON.parse(localStorage.getItem('mp_google_user') || 'null');
  const name = storedUser?.name || 'Usuário';
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, avatar_hue: 28 }),
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
  const authenticated = isAuthenticated();
  const [pets, setPets]               = useState(authenticated ? [] : PETS_FALLBACK);
  const [activePetId, setActivePetId] = useState(authenticated ? null : PETS_FALLBACK[0].id);
  const [userId, setUserId]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [petData, setPetDataState]    = useState(loadPetData);

  const savePetData = (newData) => {
    setPetDataState(newData);
    try { localStorage.setItem('mp_pet_data', JSON.stringify(newData)); } catch(e) {}
  };

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

        if (dbPets.length > 0) {
          const uiPets = dbPets.map(dbPetToUi);
          setPets(uiPets);
          setActivePetId(uiPets[0].id);
        } else if (authenticated) {
          // Authenticated but no pets yet — show empty state
          setPets([]);
          setActivePetId(null);
        }
      } catch (err) {
        console.warn('API indisponível, usando dados locais:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addPet = async (petData) => {
    const res = await fetch('/api/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...petData }),
    });
    if (!res.ok) throw new Error('Falha ao criar pet');
    const newPet = await res.json();
    const uiPet = dbPetToUi(newPet);
    // Save photo to localStorage if provided
    if (petData.photoDataUrl) {
      localStorage.setItem(`pet_photo_${newPet.id}`, petData.photoDataUrl);
      uiPet.photo = true;
      uiPet.photoUrl = petData.photoDataUrl;
    }
    setPets(prev => [...prev, uiPet]);
    return uiPet;
  };

  const updatePet = async (id, petData) => {
    const res = await fetch(`/api/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData),
    });
    if (!res.ok) throw new Error('Falha ao atualizar pet');
    const updated = await res.json();
    const uiPet = dbPetToUi(updated);
    setPets(prev => prev.map(p => p.id === id ? uiPet : p));
    return uiPet;
  };

  const activePet = pets.find(p => p.id === activePetId) || (pets.length > 0 ? pets[0] : null);
  const pid = activePet?.id;

  // Per-pet data helpers
  const getList = (key) => (pid ? (petData[pid]?.[key] || []) : []);
  const addToList = (key, item) => {
    if (!pid) return;
    const newItem = { ...item, id: String(Date.now()), createdAt: new Date().toISOString() };
    const updated = {
      ...petData,
      [pid]: { ...petData[pid], [key]: [newItem, ...(petData[pid]?.[key] || [])] },
    };
    savePetData(updated);
    return newItem;
  };
  const setForPet = (key, value) => {
    if (!pid) return;
    const updated = { ...petData, [pid]: { ...petData[pid], [key]: value } };
    savePetData(updated);
  };

  const medications    = getList('medications');
  const addMedication  = (med) => addToList('medications', med);
  const vaccines       = getList('vaccines');
  const addVaccine     = (vac) => addToList('vaccines', vac);
  const expenses       = getList('expenses');
  const addExpense     = (exp) => addToList('expenses', exp);
  const consultations  = getList('consultations');
  const addConsultation = (con) => addToList('consultations', con);
  const hygieneRecords = getList('hygieneRecords');
  const addHygieneRecord = (rec) => addToList('hygieneRecords', rec);
  const feedingConfig  = pid ? (petData[pid]?.feedingConfig || null) : null;
  const setFeedingConfig = (config) => setForPet('feedingConfig', config);
  const todayTasks     = getList('todayTasks');
  const setTodayTasks  = (tasks) => setForPet('todayTasks', tasks);

  return (
    <PetCtx.Provider value={{
      activePet, setActivePetId, PETS: pets, userId, loading,
      addPet, updatePet,
      medications, addMedication,
      vaccines, addVaccine,
      expenses, addExpense,
      consultations, addConsultation,
      hygieneRecords, addHygieneRecord,
      feedingConfig, setFeedingConfig,
      todayTasks, setTodayTasks,
    }}>
      {children}
    </PetCtx.Provider>
  );
}
