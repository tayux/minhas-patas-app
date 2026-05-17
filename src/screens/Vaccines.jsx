import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const UPCOMING = [
  { name:'Antirrábica', date:'22 jun 2025', urgent:true },
  { name:'V10 (reforço)', date:'15 set 2025', urgent:false },
];

const HISTORY = [
  { name:'V10', date:'02 fev 2025', lot:'LT4421', vet:'Dr. Renata' },
  { name:'Antirrábica', date:'22 jun 2024', lot:'LT3311', vet:'Dr. Carlos' },
  { name:'V8', date:'22 jun 2023', lot:'LT2200', vet:'Dr. Carlos' },
];

const BADGES = [
  { label:'V8 ✓', done:true },
  { label:'V10 ✓', done:true },
  { label:'Raiva ✓', done:true },
  { label:'Giardia ⚠️', done:false },
];

export default function Vaccines() {
  const { back } = useNav();
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Vacinas</div>
        <div style={{ flex:1 }} />
        <button className="btn-press" style={{ border:'none', background:T.brandSoft, color:T.brand,
          borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>+ Registrar</button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
        {/* Warning */}
        <div style={{ background:'#FEF3C7', borderRadius:20, padding:'14px 16px', marginBottom:16,
          border:'1px solid #FDE68A', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:28 }}>⚠️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>Vacina vencendo em breve</div>
            <div style={{ fontSize:13, color:T.inkSoft }}>Antirrábica vence em 22 jun 2025</div>
          </div>
          <div style={{ padding:'6px 12px', background:'#F59E0B', borderRadius:99,
            fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer', whiteSpace:'nowrap' }}>Agendar</div>
        </div>

        {/* Passport */}
        <div style={{ borderRadius:24, padding:20, marginBottom:20,
          background:`linear-gradient(135deg, ${T.brand} 0%, #9B86FD 100%)`,
          boxShadow:`0 8px 24px rgba(124,107,252,0.35)` }}>
          <div style={{ display:'flex', gap:14 }}>
            <div style={{ width:80, height:100, background:'rgba(255,255,255,0.2)', borderRadius:16,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>🐶</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)', marginBottom:2 }}>Passaporte Vacinal</div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>Leia</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:12 }}>SRD · fêmea · 8 anos</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {BADGES.map((b, i) => (
                  <div key={i} style={{ padding:'5px 10px', borderRadius:8,
                    background: b.done ? 'rgba(255,255,255,0.2)' : 'rgba(255,200,50,0.25)',
                    fontSize:10, fontWeight:700, color:'#fff' }}>{b.label}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Próximas vacinas</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {UPCOMING.map((v, i) => (
            <div key={i} style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
              display:'flex', alignItems:'center', gap:12,
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:26 }}>💉</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{v.name}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>Vencimento: {v.date}</div>
                <div style={{ fontSize:12, fontWeight:700, color:T.brand, marginTop:2, cursor:'pointer' }}>
                  Agendar vacinação
                </div>
              </div>
              {v.urgent
                ? <div style={{ padding:'5px 12px', background:'#FEF3C7', borderRadius:99,
                    fontSize:11, fontWeight:700, color:'#92400E' }}>⚠️ Urgente</div>
                : <div style={{ padding:'5px 12px', background:'#DCFCE7', borderRadius:99,
                    fontSize:11, fontWeight:700, color:'#16A34A' }}>Em dia</div>
              }
            </div>
          ))}
        </div>

        {/* History */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Histórico</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {HISTORY.map((v, i) => (
            <div key={i} style={{ background:T.surface, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:12,
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:22 }}>✅</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{v.name}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>{v.date} · Lote: {v.lot}</div>
                <div style={{ fontSize:11, color:T.inkMute }}>Dr.: {v.vet}</div>
              </div>
              <div style={{ padding:'4px 10px', background:T.bgWash, borderRadius:6,
                fontSize:11, fontWeight:500, color:T.inkSoft }}>📎 Cert.pdf</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
