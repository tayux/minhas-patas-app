import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const CARE = [
  { e:'👂', label:'Orelhas', last:'08 mai', due:false },
  { e:'💅', label:'Unhas', last:'01 mai', due:true },
  { e:'🦷', label:'Dentes', last:'06 mai', due:false },
];

export default function HygieneGrooming() {
  const { back } = useNav();
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Higiene & Beleza</div>
        <div style={{ flex:1 }} />
        <button className="btn-press" style={{ border:'none', background:T.brandSoft, color:T.brand,
          borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>+ Agendar</button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
        {/* Upcoming appointments */}
        <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:12 }}>Próximos agendamentos</div>
        <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:4, marginBottom:20 }}>
          {[{e:'✂️',t:'Banho & Tosa',d:'22 mai',p:'R$ 80'},{e:'🛁',t:'Banho',d:'05 jun',p:'R$ 45'}].map((ap,i) => (
            <div key={i} style={{ minWidth:164, background:T.surface, borderRadius:16, padding:16,
              boxShadow:'0 4px 20px rgba(20,20,30,0.07)', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <div style={{ fontSize:22 }}>{ap.e}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{ap.t}</div>
                  <div style={{ fontSize:11, color:T.inkSoft }}>{ap.d}</div>
                </div>
              </div>
              <div style={{ display:'inline-flex', padding:'4px 12px', background:'#DCFCE7',
                borderRadius:99, fontSize:12, fontWeight:700, color:'#16A34A' }}>{ap.p}</div>
            </div>
          ))}
        </div>

        {/* Bath & Groom info */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          <div style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
            display:'flex', alignItems:'center', gap:12,
            boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
            <div style={{ fontSize:28 }}>🛁</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Último banho</div>
              <div style={{ fontSize:12, color:T.inkSoft }}>10 mai 2025 · há 4 dias</div>
            </div>
            <div style={{ padding:'5px 12px', background:T.brandSoft, borderRadius:99,
              fontSize:11, fontWeight:700, color:T.brand }}>Próximo: 24 mai</div>
          </div>
          <div style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
            display:'flex', alignItems:'center', gap:12,
            boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
            <div style={{ fontSize:28 }}>✂️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Última tosa</div>
              <div style={{ fontSize:12, color:T.inkSoft }}>02 mai 2025 · há 12 dias</div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:T.brand, cursor:'pointer' }}>Registrar</div>
          </div>
        </div>

        {/* Basic care */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Cuidados básicos</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {CARE.map((c, i) => (
            <div key={i} style={{ background:T.surface, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:12,
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:22 }}>{c.e}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{c.label}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>Último: {c.last}</div>
              </div>
              {c.due
                ? <div style={{ padding:'5px 12px', background:'#FEF3C7', borderRadius:99,
                    fontSize:11, fontWeight:700, color:'#92400E' }}>⚠️ Vencido</div>
                : <div style={{ fontSize:13, fontWeight:700, color:T.brand, cursor:'pointer' }}>Registrar</div>
              }
            </div>
          ))}
        </div>

        {/* Coat */}
        <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:8 }}>Pelagem & pele</div>
        <div style={{ background:T.surface, borderRadius:16, padding:16,
          boxShadow:'0 2px 8px rgba(20,20,30,0.05)', marginBottom:12 }}>
          <div style={{ background:T.bgWash, borderRadius:12, padding:'12px 14px',
            fontSize:14, color:T.inkSoft, minHeight:72, marginBottom:10 }}>
            Observações sobre pelagem e pele...
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {['📷','🖼️'].map(ic => (
              <div key={ic} style={{ width:36, height:36, background:T.bgWash, borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18, cursor:'pointer' }}>{ic}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
