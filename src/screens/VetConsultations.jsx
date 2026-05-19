import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

export default function VetConsultations() {
  const { back, nav } = useNav();
  const { activePet, consultations } = usePet();
  const [tab, setTab] = useState('Histórico');

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>📅</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Sem consultas registradas</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para acompanhar as consultas veterinárias.
        </div>
      </div>
    </div>
  );

  if (consultations.length === 0) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Consultas veterinárias</div>
        <div style={{ flex:1 }} />
        <button onClick={() => nav('addvet')} className="btn-press" style={{
          border:'none', background:T.brandSoft, color:T.brand,
          borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>+ Agendar</button>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:64 }}>🩺</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>
          Nenhuma consulta registrada
        </div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Agende e registre as consultas do seu pet para nunca perder um retorno ou check-up.
        </div>
        <button onClick={() => nav('addvet')} style={{
          marginTop:8, padding:'12px 28px', borderRadius:99,
          background:T.brand, color:'#fff', border:'none',
          fontSize:15, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
          + Agendar primeira consulta
        </button>
      </div>
    </div>
  );

  const sorted = [...consultations].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  const next = sorted[0];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Consultas veterinárias</div>
        <div style={{ flex:1 }} />
        <button onClick={() => nav('addvet')} className="btn-press" style={{
          border:'none', background:T.brandSoft, color:T.brand,
          borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>+ Agendar</button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
        {/* Hero — most recent / next */}
        {next && (
          <div style={{ borderRadius:24, padding:20, marginBottom:20,
            background:`linear-gradient(135deg, ${T.brand} 0%, #9B86FD 100%)`,
            boxShadow:`0 8px 24px rgba(124,107,252,0.35)` }}>
            <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)', marginBottom:4 }}>
              Consulta agendada
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:'#fff', marginBottom:2 }}>
              {next.vet || 'Veterinário'}
            </div>
            {next.clinic && (
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', marginBottom:12 }}>
                {next.clinic}
              </div>
            )}
            <div style={{ height:1, background:'rgba(255,255,255,0.18)', marginBottom:12 }} />
            <div style={{ display:'flex', gap:20, marginBottom:next.reason ? 12 : 0 }}>
              {next.date && (
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:16 }}>📅</span>
                  <span style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{next.date}</span>
                </div>
              )}
              {next.time && (
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:16 }}>🕐</span>
                  <span style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{next.time}</span>
                </div>
              )}
            </div>
            {next.reason && (
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)' }}>{next.reason}</div>
            )}
          </div>
        )}

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
            {sorted.map((c) => (
              <div key={c.id} style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
                boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
                <div style={{ fontSize:11, color:T.inkSoft, marginBottom:4 }}>
                  {c.date || '—'}{c.time ? ` · ${c.time}` : ''}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ padding:'3px 10px', background:T.brandSoft, borderRadius:99,
                    fontSize:11, fontWeight:700, color:T.brand }}>{c.vet || 'Veterinário'}</div>
                </div>
                {c.reason && (
                  <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{c.reason}</div>
                )}
                {c.clinic && (
                  <div style={{ fontSize:12, color:T.inkSoft, marginTop:4 }}>{c.clinic}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'Favoritos' && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:12, padding:'32px 0', textAlign:'center' }}>
            <div style={{ fontSize:40 }}>⭐</div>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Nenhum favorito ainda</div>
            <div style={{ fontSize:13, color:T.inkSoft }}>Seus veterinários favoritos aparecerão aqui</div>
          </div>
        )}
      </div>
    </div>
  );
}
