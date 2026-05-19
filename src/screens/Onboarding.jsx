import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { useAuth } from '../components/AuthContext.jsx';
import { Icon, I, GoogleG, Mascot } from '../components/Shared.jsx';

export default function Onboarding() {
  const { nav } = useNav();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        await login(tokenResponse);
        nav('home');
      } catch (err) {
        setError('Erro ao entrar com Google. Tente novamente.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Login cancelado ou não autorizado.');
      setLoading(false);
    },
  });

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
        {error && (
          <div style={{ textAlign:'center', fontSize:13, color:'#EF4444',
            padding:'8px 16px', borderRadius:12, background:'#FEE2E2' }}>
            {error}
          </div>
        )}
        <button
          onClick={() => { setError(null); setLoading(true); handleGoogle(); }}
          disabled={loading}
          style={{ height:56, borderRadius:99, border:'none',
            background: loading ? T.surface : T.surface,
            color: T.ink, fontFamily:FONT_BODY, fontSize:15, fontWeight:600,
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 6px 16px -8px rgba(20,20,30,0.12)',
            opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
          <GoogleG size={18} />
          {loading ? 'Entrando…' : 'Continuar com Google'}
        </button>
      </div>
    </div>
  );
}
