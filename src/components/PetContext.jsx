import { createContext, useContext, useState } from 'react';

export const PETS = [
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

export const PetCtx = createContext({ activePet: PETS[0], setActivePetId: () => {} });
export const usePet = () => useContext(PetCtx);

export function PetProvider({ children }) {
  const [activePetId, setActivePetId] = useState('leia');
  const activePet = PETS.find(p => p.id === activePetId) || PETS[0];
  return (
    <PetCtx.Provider value={{ activePet, setActivePetId, PETS }}>
      {children}
    </PetCtx.Provider>
  );
}
