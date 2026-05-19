import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

export default function AddVaccine() {
  const { back } = useNav();
  const [name, setName]       = useState('');
  const [date, setDate]       = useState('');
  const [nextDate, setNext]   = useState('');
  const [lot, setLot]         = useState('');
  const [vet, setVet]         = useState('');

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Registrar vacina</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
          <div style={{ width:72, height:72, borderRadius:36, background:T.tintMint,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>💉</div>
        </div>

        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', display:'flex', flexDirection:'column', gap:16 }}>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Nome da vacina</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Ex: Antirrábica, V10, V8..."
                value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data de aplicação</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:8 }}>
              <span>📅</span>
              <input style={inputStyle} placeholder="dd / mm / aaaa"
                value={date} onChange={e => setDate(e.target.value)} inputMode="numeric" />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Próxima dose (opcional)</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:8 }}>
              <span>📅</span>
              <input style={inputStyle} placeholder="dd / mm / aaaa"
                value={nextDate} onChange={e => setNext(e.target.value)} inputMode="numeric" />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Número do lote (opcional)</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Ex: LT4421"
                value={lot} onChange={e => setLot(e.target.value)} />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Veterinário (opcional)</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Nome do veterinário"
                value={vet} onChange={e => setVet(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={back} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          Salvar vacina
        </button>
      </div>
    </div>
  );
}
