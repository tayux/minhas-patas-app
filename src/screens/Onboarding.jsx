import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, GoogleG, Mascot } from '../components/Shared.jsx';

export default function Onboarding() {
  const { nav } = useNav();
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'24px 28px 28px',
      background:`linear-gradient(180deg, #FFFFFF 0%, ${T.brandWash} 55%, ${T.brandSoft} 100%)` }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:28 }}>
        <Mascot size={240} />
        <div style={{ textAlign:'center' }}>
          <h1 style={{ fontFamily:FONT_DISPLAY, fontSize:48, fontWeight:400, lineHeight:1.04,
            letterSpacing:-1.4, color:T.ink, margin:0 }}>
            minhas<span style={{ fontStyle:'italic' }}>patas</span>
          </h1>
          <div style={{ fontFamily:FONT_BODY, fontSize:16, color:T.inkSoft, marginTop:12,
            lineHeight:1.5, maxWidth:280 }}>
            A rotina do seu melhor amigo, organizada com calma.
          </div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <button onClick={() => nav('home')} style={{ height:56, borderRadius:99, border:'none',
          background:T.surface, color:T.ink, fontFamily:FONT_BODY, fontSize:15, fontWeight:600,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 6px 16px -8px rgba(20,20,30,0.12)' }}>
          <GoogleG size={18} /> Continuar com Google
        </button>
        <button onClick={() => nav('home')} style={{ height:56, borderRadius:99, border:'none',
          background:T.ink, color:'#fff', fontFamily:FONT_BODY, fontSize:15, fontWeight:600,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
          <Icon d={I.mail} size={16} color="#fff" stroke={2} /> Continuar com e-mail
        </button>
        <div style={{ textAlign:'center', fontSize:13, color:T.inkMute, marginTop:10 }}>
          Já tem conta?{' '}
          <span onClick={() => nav('home')} style={{ color:T.ink, fontWeight:600,
            textDecoration:'underline', cursor:'pointer' }}>Entrar</span>
        </div>
      </div>
    </div>
  );
}
