import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const HISTORY = [
  { date:'12 abr 2025', vet:'Dr. Renata', diag:'Dermatite atópica · tratamento ativo', cost:'R$ 280', chips:['Receita.pdf'] },
  { date:'10 jan 2025', vet:'Dr. Carlos', diag:'Check-up anual · sem alterações', cost:'R$ 160', chips:['Exame.pdf','Relat.pdf'] },
  { date:'05 set 2024', vet:'Dr. Renata', diag:'Infecção urinária · antibiótico 7d', cost:'R$ 220', chips:['Receita.pdf'] },
];

export default function VetConsultations() {
  const { back } = useNav();
  const [tab, setTab] = useState('Histórico');

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Consultas veterinárias</div>
        <div style={{ flex:1 }} />
        <button className="btn-press" style={{ border:'none', background:T.brandSoft, color:T.brand,
          borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>+ Agendar</button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
        {/* Hero card */}
        <div style={{ borderRadius:24, padding:20, marginBottom:20,
          background:`linear-gradient(135deg, ${T.brand} 0%, #9B86FD 100%)`,
          boxShadow:`0 8px 24px rgba(124,107,252,0.35)` }}>
          <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)', marginBottom:4 }}>
            Próxima consulta
          </div>
          <div style={{ fontSize:20, fontWeight:800, color:'#fff', marginBottom:2 }}>Dr. Renata Souza</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', marginBottom:12 }}>
            Clínica Veterinária VetCenter
          </div>
          <div style={{ height:1, background:'rgba(255,255,255,0.18)', marginBottom:12 }} />
          <div style={{ display:'flex', gap:20, marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:16 }}>📅</span>
              <span style={{ fontSize:14, fontWeight:600, color:'#fff' }}>14 junho 2025</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:16 }}>🕐</span>
              <span style={{ fontSize:14, fontWeight:600, color:'#fff' }}>14:30</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {['📍 Ver no mapa','📞 Ligar'].map(a => (
              <div key={a} style={{ flex:1, textAlign:'center', padding:'8px 0', borderRadius:10,
                background:'rgba(255,255,255,0.18)', fontSize:12, fontWeight:700,
                color:'#fff', cursor:'pointer' }}>{a}</div>
            ))}
          </div>
        </div>

        {/* Tab */}
        <div style={{ display:'flex', gap:4, marginBottom:16, padding:'3px', background:T.bgWash, borderRadius:14 }}>
          {['Histórico','Favoritos'].map(t => (
            <div key={t} onClick={() => setTab(t)} style={{
              flex:1, textAlign:'center', padding:'9px 0', borderRadius:11, cursor:'pointer',
              background: tab===t ? T.surface : 'transparent',
              fontWeight: tab===t?700:500, fontSize:14, color: tab===t?T.ink:T.inkSoft,
              boxShadow: tab===t ? '0 2px 8px rgba(20,20,30,0.1)' : 'none',
              transition:'all 0.15s', fontFamily:FONT_BODY }}>
              {t}
            </div>
          ))}
        </div>

        {tab === 'Histórico' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {HISTORY.map((c, i) => (
              <div key={i} style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
                boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
                <div style={{ fontSize:11, color:T.inkSoft, marginBottom:4 }}>{c.date}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ padding:'3px 10px', background:T.brandSoft, borderRadius:99,
                    fontSize:11, fontWeight:700, color:T.brand }}>{c.vet}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#16A34A', marginLeft:'auto' }}>{c.cost}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:8 }}>{c.diag}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {c.chips.map(ch => (
                    <div key={ch} style={{ padding:'4px 10px', background:T.bgWash,
                      borderRadius:6, fontSize:11, fontWeight:500, color:T.inkSoft }}>
                      📎 {ch}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Favoritos' && (
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {['Dr. Renata','Dr. Carlos'].map(v => (
              <div key={v} style={{ background:T.surface, borderRadius:16, padding:16,
                boxShadow:'0 2px 8px rgba(20,20,30,0.05)', minWidth:140 }}>
                <div style={{ fontSize:28, marginBottom:6 }}>🩺</div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{v}</div>
                <div style={{ fontSize:11, color:T.inkSoft }}>Consulta geral</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
