import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I } from '../components/Shared.jsx';

export default function LockNotif() {
  const { nav } = useNav();
  return (
    <div style={{ height:'100%', position:'relative', overflow:'hidden',
      background:'linear-gradient(170deg, #C9BEFF 0%, #B3A6FF 40%, #9E8FF7 100%)' }}>
      <div style={{ position:'absolute', top:-50, left:-40, width:240, height:240, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(255,236,210,0.6), transparent 70%)', filter:'blur(20px)' }} />
      <div style={{ position:'absolute', bottom:140, right:-60, width:280, height:280, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)', filter:'blur(30px)' }} />
      <div style={{ position:'absolute', top:56, left:'50%', transform:'translateX(-50%)', color:'rgba(0,0,0,0.4)' }}>
        <svg width="14" height="18" viewBox="0 0 14 18">
          <path d="M3 8V5a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" fill="none"/>
          <rect x="1" y="8" width="12" height="9" rx="2" fill="currentColor"/>
        </svg>
      </div>
      <div style={{ textAlign:'center', color:T.ink, paddingTop:92 }}>
        <div style={{ fontFamily:FONT_DISPLAY, fontSize:18, fontStyle:'italic', fontWeight:400,
          opacity:0.75, letterSpacing:0.2 }}>segunda-feira, 14 de maio</div>
        <div style={{ fontFamily:FONT_DISPLAY, fontSize:96, fontWeight:300, lineHeight:1,
          marginTop:4, letterSpacing:-3 }}>15:00</div>
      </div>
      <div style={{ padding:'40px 14px 0' }}>
        <div onClick={() => nav('home')} style={{ background:'rgba(255,255,255,0.78)',
          backdropFilter:'blur(28px) saturate(180%)', WebkitBackdropFilter:'blur(28px) saturate(180%)',
          border:'0.5px solid rgba(255,255,255,0.7)', borderRadius:22, padding:'12px 14px 8px',
          boxShadow:'0 10px 40px rgba(20,10,40,0.18)', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:T.ink,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, color:'#fff', fontWeight:800 }}>🐾</div>
            <span style={{ fontSize:11, fontWeight:700, color:T.inkSoft, letterSpacing:0.5,
              textTransform:'uppercase' }}>minhaspatas</span>
            <span style={{ flex:1 }} />
            <span style={{ fontSize:12, color:T.inkSoft, fontWeight:500 }}>agora</span>
          </div>
          <div style={{ fontFamily:FONT_DISPLAY, fontSize:19, fontWeight:500, color:T.ink, lineHeight:1.25 }}>
            Hora do remédio da <span style={{ fontStyle:'italic' }}>Leia</span>
          </div>
          <div style={{ fontSize:13, color:T.inkSoft, marginTop:4, lineHeight:1.45 }}>
            Prednisolona 10mg — dar com comida.<br />Deslize para confirmar.
          </div>
          <div style={{ display:'flex', gap:8, marginTop:12, paddingTop:10, borderTop:'1px solid rgba(0,0,0,0.06)' }}>
            <button style={{ flex:1, height:38, borderRadius:12, border:'none',
              background:T.ink, color:'#fff', fontFamily:FONT_BODY, fontWeight:700, fontSize:13,
              display:'flex', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer' }}>
              <Icon d={I.check} size={14} color="#fff" stroke={3} /> Confirmar
            </button>
            <button style={{ flex:1, height:38, borderRadius:12, border:'none',
              background:'rgba(20,20,30,0.06)', color:T.ink,
              fontFamily:FONT_BODY, fontWeight:700, fontSize:13, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              Adiar 15min
            </button>
          </div>
        </div>
        <div style={{ marginTop:8, padding:'10px 14px', borderRadius:18,
          background:'rgba(255,255,255,0.35)', backdropFilter:'blur(20px)',
          WebkitBackdropFilter:'blur(20px)', color:T.ink }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:18, height:18, borderRadius:5, background:'rgba(20,20,30,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>📅</div>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:0.5,
              textTransform:'uppercase', opacity:0.7 }}>Lembrete</span>
            <span style={{ flex:1 }} />
            <span style={{ fontSize:11, opacity:0.7 }}>14:00</span>
          </div>
          <div style={{ fontSize:13, fontWeight:600, marginTop:4 }}>Passeio da Leia em 1h</div>
        </div>
      </div>
    </div>
  );
}
