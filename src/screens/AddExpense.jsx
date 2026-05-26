import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, MascotAvatar } from '../components/Shared.jsx';
import { maskDate, todayStr } from '../utils/dateUtils.js';

const CATS = [
  { e:'🩺', l:'Consulta' },
  { e:'💊', l:'Medicamento' },
  { e:'🔬', l:'Exame' },
  { e:'✂️', l:'Banho/Tosa' },
  { e:'🥣', l:'Alimentação' },
  { e:'🎾', l:'Acessório' },
  { e:'📋', l:'Outros' },
];

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

export default function AddExpense() {
  const { back } = useNav();
  const { activePet, PETS, addExpenseForPet } = usePet();
  const [selectedPetId, setSelectedPetId] = useState(activePet?.id || null);
  const [catIdx, setCat]    = useState(null);
  const [desc, setDesc]     = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate]     = useState(todayStr());

  const handleSave = () => {
    const petId = selectedPetId || activePet?.id;
    if (amount.trim() && petId) {
      addExpenseForPet(petId, {
        cat: catIdx !== null ? CATS[catIdx].l : 'Outros',
        emoji: catIdx !== null ? CATS[catIdx].e : '📋',
        desc: desc.trim(),
        amount: amount.trim(),
        date,
      });
    }
    back();
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Registrar gasto</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        {PETS.length > 1 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:10 }}>Pet</div>
            <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
              {PETS.map(p => {
                const sel = p.id === selectedPetId;
                return (
                  <div key={p.id} onClick={() => setSelectedPetId(p.id)}
                    style={{ display:'flex', alignItems:'center', gap:7,
                      padding:'6px 14px 6px 6px', borderRadius:99, flexShrink:0, cursor:'pointer',
                      background: sel ? T.ink : T.surface,
                      color: sel ? '#fff' : T.ink,
                      boxShadow: sel ? 'none' : '0 1px 4px rgba(20,20,30,0.06)',
                      fontWeight:700, fontSize:13, fontFamily:FONT_BODY }}>
                    <MascotAvatar size={26} hue={p.hue} photo={p.photo} photoUrl={p.photoUrl} />
                    {p.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>Categoria</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {CATS.map((c, i) => (
              <div key={i} onClick={() => setCat(i)} style={{
                background: catIdx===i ? T.brandSoft : T.surface,
                border: catIdx===i ? `1.5px solid ${T.brand}` : '1.5px solid transparent',
                borderRadius:16, padding:'12px 8px', textAlign:'center', cursor:'pointer',
                boxShadow:'0 2px 8px rgba(20,20,30,0.05)', transition:'all 0.15s' }}>
                <div style={{ fontSize:26 }}>{c.e}</div>
                <div style={{ fontSize:11, fontWeight:700, color: catIdx===i ? T.brand : T.ink, marginTop:4 }}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', display:'flex', flexDirection:'column', gap:16 }}>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Valor</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:14, fontWeight:700, color:T.inkSoft }}>R$</span>
              <input style={{ ...inputStyle, fontSize:18, fontWeight:700 }}
                placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)}
                inputMode="decimal" autoFocus />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Descrição</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Ex: Consulta de rotina, Ração 15kg..."
                value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:8 }}>
              <span>📅</span>
              <input style={inputStyle} placeholder="dd/mm/aaaa"
                value={date} onChange={e => setDate(maskDate(e.target.value))} inputMode="numeric" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={handleSave} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          Salvar gasto
        </button>
      </div>
    </div>
  );
}
