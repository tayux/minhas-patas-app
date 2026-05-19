import { createContext, useContext, useState, useEffect } from 'react';

// Dados locais usados como fallback enquanto a API carrega
const PETS_FALLBACK = [
  {
    id: 'leia',
    name: 'Leia',
    hue: 30,
    photo: true,
    age: '8 anos',
    weight: '12.3 kg',
    breed: 'SRD',
    gender: 'fêmea · castrada',
    tiles: [
      { label:'Saúde',        emoji:'🩺', sub:'em dia'      },
      { label:'Medicamentos', emoji:'💊', sub:'5 ativos'    },
      { label:'Finanças',     emoji:'🪙', sub:'R$ 1.247'    },
      { label:'Documentos',   emoji:'📁', sub:'8 itens'     },
    ],
    upcoming: [
      { time:'15:00', emoji:'💊', title:'Prednisolona', sub:'10mg · após o almoço', late:false },
      { time:'17:30', emoji:'🚶', title:'Passeio da tarde', sub:'20 min · Leia', late:true },
    ],
    medsCount: 5,
    nextDose: '15:00',
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
      { label:'Saúde',        emoji:'🩺', sub:'consulta pendente' },
      { label:'Medicamentos', emoji:'💊', sub:'2 ativos'          },
      { label:'Finanças',     emoji:'🪙', sub:'R$ 380'            },
      { label:'Documentos',   emoji:'📁', sub:'3 itens'           },
    ],
    upcoming: [
      { time:'08:00', emoji:'💊', title:'Vermífugo', sub:'1 comprimido', late:false },
      { time:'14:00', emoji:'🐾', title:'Consulta veterinária', sub:'Dr. Renata · clínica', late:false },
    ],
    medsCount: 2,
    nextDose: '08:00',
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
      { label:'Saúde',        emoji:'🩺', sub:'vacinação pendente' },
      { label:'Medicamentos', emoji:'💊', sub:'sem ativos'         },
      { label:'Finanças',     emoji:'🪙', sub:'R$ 620'             },
      { label:'Documentos',   emoji:'📁', sub:'5 itens'            },
    ],
    upcoming: [
      { time:'09:00', emoji:'🥣', title:'Café da manhã', sub:'Ração premium 120g', late:false },
      { time:'16:00', emoji:'🚶', title:'Passeio longo', sub:'45 min · parque', late:false },
    ],
    medsCount: 0,
    nextDose: '—',
  },
];

// Converte o pet do banco para o formato esperado pelos componentes
function dbPetToUi(p) {
  return {
    id: p.id,
    name: p.name,
    hue: p.hue ?? 270,
    photo: !!p.photo_url,
    age: p.birth_year ? `${new Date().getFullYear() - p.birth_year} anos` : '—',
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

// Garante que o usuário local existe no banco; cria se necessário
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

export const PETS = PETS_FALLBACK;

export const PetCtx = createContext({
  activePet: null,
  setActivePetId: () => {},
  PETS: [],
  userId: null,
  loading: false,
  addPet: async () => {},
  updatePet: async () => {},
});

export const usePet = () => useContext(PetCtx);

export function PetProvider({ children }) {
  const authenticated = isAuthenticated();
  const [pets, setPets]             = useState(authenticated ? [] : PETS_FALLBACK);
  const [activePetId, setActivePetId] = useState(authenticated ? null : PETS_FALLBACK[0].id);
  const [userId, setUserId]         = useState(null);
  const [loading, setLoading]       = useState(true);

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

  const activePet = pets.find(p => p.id === activePetId) || pets[0];

  return (
    <PetCtx.Provider value={{ activePet, setActivePetId, PETS: pets, userId, loading, addPet, updatePet }}>
      {children}
    </PetCtx.Provider>
  );
}
