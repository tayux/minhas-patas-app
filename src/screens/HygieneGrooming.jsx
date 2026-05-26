import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, PetHeader } from '../components/Shared.jsx';
import { maskDate, todayStr } from '../utils/dateUtils.js';

const CARE_TYPES = [
  { e:'🛁', l:'Banho' },
  { e:'✂️', l:'Tosa' },
  { e:'👂', l:'Orelhas' },
  { e:'💅', l:'Unhas' },
  { e:'🦷', l:'Dentes' },
  { e:'🧴', l:'Outros' },
];

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

function AddForm({ onSave, onCancel }) {
  const [typeIdx, setType] = useState(0);
  const [date, setDate]   = useState(todayStr());
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px', maxHeight:'80vh', overflowY:'auto' }}>
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, marginBottom:20 }}>
          Registrar cuidado
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
          {CARE_TYPES.map((c, i) => (
            <div key={i} onClick={() => setType(i)} style={{
              background: typeIdx===i ? T.brandSoft : T.surface,
              border: typeIdx===i ? `1.5px solid ${T.brand}` : '1.5px solid transparent',
              borderRadius:16, padding:'12px 8px', textAlign:'center', cursor:'pointer',
              transition:'all 0.15s' }}>
              <div style={{ fontSize:26 }}>{c.e}</div>
              <div style={{ fontSize:11, fontWeight:700,
                color: typeIdx===i ? T.brand : T.ink, marginTop:4 }}>{c.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:8 }}>
              <span>📅</span>
              <input style={inputStyle} placeholder="dd/mm/aaaa"
                value={date} onChange={e => setDate(maskDate(e.target.value))} inputMode="numeric" />
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
              Valor (opcional)
            </div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:13, fontWeight:700, color:T.inkSoft }}>R$</span>
              <input style={inputStyle} placeholder="0,00"
                value={price} onChange={e => setPrice(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
              Observações (opcional)
            </div>
            <textarea style={{ width:'100%', minHeight:72, background:T.bgWash, borderRadius:14,
              padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
              border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
              placeholder="Ex: Cabelo curto, produto hipoalergênico..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:20 }}>
          <button onClick={onCancel} style={{ flex:1, height:48, borderRadius:99,
            background:T.surface, color:T.ink, border:'none',
            fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Cancelar
          </button>
          <button onClick={() => onSave({
            type: CARE_TYPES[typeIdx].l,
            emoji: CARE_TYPES[typeIdx].e,
            date, price: price.trim(), notes: notes.trim(),
          })} style={{ flex:1.5, height:48, borderRadius:99,
            background:T.brand, color:'#fff', border:'none',
            fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ record, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ fontSize:40 }}>{record.emoji}</div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink }}>{record.type}</div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>
              {record.date || 'Data não informada'}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {record.date && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.bgWash, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Data</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{record.date}</span>
            </div>
          )}
          {record.price && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:'#DCFCE7', borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:'#16A34A' }}>Valor</span>
              <span style={{ fontSize:13, fontWeight:700, color:'#16A34A' }}>R$ {record.price}</span>
            </div>
          )}
          {record.notes && (
            <div style={{ background:T.bgWash, borderRadius:14, padding:'12px 16px' }}>
              <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>Observações</div>
              <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{record.notes}</div>
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ width:'100%', height:48, borderRadius:99, marginTop:20,
          background:T.surface, color:T.ink, border:'none',
          fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function HygieneGrooming() {
  const { back } = useNav();
  const { activePet, hygieneRecords, addHygieneRecord } = usePet();
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState(null);

  const handleSave = (rec) => {
    addHygieneRecord(rec);
    setShowForm(false);
  };

  const sorted = [...hygieneRecords].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, flex:1 }}>Higiene & Beleza</div>
        <PetHeader />
      </div>

      {hygieneRecords.length === 0 ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
          <div style={{ fontSize:64 }}>✂️</div>
          <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>
            Nenhum registro ainda
          </div>
          <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
            Registre banhos, tosas, cuidados com orelhas, unhas e dentes do seu pet.
          </div>
        </div>
      ) : (
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 96px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {sorted.map((r) => (
              <div key={r.id} onClick={() => setDetail(r)}
                style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
                  display:'flex', alignItems:'center', gap:12, cursor:'pointer',
                  boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
                <div style={{ fontSize:28 }}>{r.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{r.type}</div>
                  <div style={{ fontSize:12, color:T.inkSoft }}>{r.date || '—'}</div>
                  {r.notes && (
                    <div style={{ fontSize:12, color:T.inkMute, marginTop:2 }}>{r.notes}</div>
                  )}
                </div>
                {r.price && (
                  <div style={{ padding:'5px 12px', background:'#DCFCE7', borderRadius:99,
                    fontSize:12, fontWeight:700, color:'#16A34A' }}>R$ {r.price}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      <div onClick={() => setShowForm(true)}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56, borderRadius:28,
          background:T.ink, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:28, color:'#fff', cursor:'pointer',
          boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)', zIndex:10 }}>+</div>

      {showForm && <AddForm onSave={handleSave} onCancel={() => setShowForm(false)} />}
      {detail && <DetailModal record={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
