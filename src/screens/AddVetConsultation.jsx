import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

export default function AddVetConsultation() {
  const { back } = useNav();
  const [vet, setVet]       = useState('');
  const [clinic, setClinic] = useState('');
  const [date, setDate]     = useState('');
  const [time, setTime]     = useState('');
  const [reason, setReason] = useState('');

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Agendar consulta</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
          <div style={{ width:72, height:72, borderRadius:36, background:T.tintSky,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>🩺</div>
        </div>

        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', display:'flex', flexDirection:'column', gap:16 }}>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Veterinário</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Nome do veterinário"
                value={vet} onChange={e => setVet(e.target.value)} autoFocus />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Clínica / Hospital</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Nome da clínica"
                value={clinic} onChange={e => setClinic(e.target.value)} />
            </div>
          </div>

          <div style={{ display:'flex', gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
                display:'flex', alignItems:'center', gap:6 }}>
                <span>📅</span>
                <input style={{ ...inputStyle, fontSize:13 }} placeholder="dd/mm/aaaa"
                  value={date} onChange={e => setDate(e.target.value)} inputMode="numeric" />
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Horário</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
                display:'flex', alignItems:'center', gap:6 }}>
                <span>🕐</span>
                <input style={{ ...inputStyle, fontSize:13 }} placeholder="hh:mm"
                  value={time} onChange={e => setTime(e.target.value)} inputMode="numeric" />
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Motivo da consulta</div>
            <textarea
              style={{ width:'100%', minHeight:80, background:T.bgWash, borderRadius:14,
                padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
                border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
              placeholder="Ex: Check-up anual, retorno, emergência..."
              value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={back} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          Confirmar agendamento
        </button>
      </div>
    </div>
  );
}
