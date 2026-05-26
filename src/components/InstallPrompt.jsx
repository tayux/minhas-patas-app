import { useState, useEffect } from 'react';
import { T, FONT_BODY } from '../theme.js';

const DISMISSED_KEY = 'mp_install_dismissed';

export default function InstallPrompt() {
  const [prompt, setPrompt]     = useState(null); // Android beforeinstallprompt
  const [showIOS, setShowIOS]   = useState(false);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    // Already installed as standalone — don't show
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    if (localStorage.getItem(DISMISSED_KEY)) return;

    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua);

    if (isIOS) {
      // Delay a bit so the app finishes loading before showing the banner
      const t = setTimeout(() => { setShowIOS(true); setVisible(true); }, 2500);
      return () => clearTimeout(t);
    }

    // Android / Chrome / Edge: wait for the install event
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, '1');
  };

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setPrompt(null);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 88, left: 12, right: 12, zIndex: 600,
      animation: 'slideInUp 0.35s cubic-bezier(0.22,0.61,0.36,1) both',
    }}>
      <div style={{
        background: T.bg,
        borderRadius: 20,
        padding: '14px 16px',
        boxShadow: '0 8px 32px rgba(20,20,30,0.22)',
        border: `1px solid ${T.inkFaint}`,
      }}>
        {showIOS ? (
          /* iOS: manual instruction */
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>📱</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, marginBottom: 4, fontFamily: FONT_BODY }}>
                Instalar MinhasPatas
              </div>
              <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.5, fontFamily: FONT_BODY }}>
                Toque em <strong style={{ color: T.ink }}>Compartilhar</strong>{' '}
                <span style={{ fontSize: 15 }}>⬆️</span>{' '}e depois em{' '}
                <strong style={{ color: T.ink }}>Adicionar à Tela de Início</strong>.
              </div>
              {/* Arrow pointing down-center toward bottom bar */}
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ flex: 1, height: 1, background: T.inkFaint }} />
                <span style={{ fontSize: 18 }}>↓</span>
                <div style={{ flex: 1, height: 1, background: T.inkFaint }} />
              </div>
            </div>
            <button onClick={dismiss} style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
              background: T.bgWash, border: 'none', fontSize: 16, color: T.inkSoft,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_BODY, lineHeight: 1,
            }}>×</button>
          </div>
        ) : (
          /* Android/Chrome: native install button */
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: T.brandSoft, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>🐾</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, fontFamily: FONT_BODY }}>
                Instalar MinhasPatas
              </div>
              <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2, fontFamily: FONT_BODY }}>
                Acesse como app direto na tela inicial
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={dismiss} style={{
                padding: '8px 12px', borderRadius: 99, background: T.bgWash,
                color: T.inkSoft, border: 'none', fontSize: 13, fontWeight: 600,
                fontFamily: FONT_BODY, cursor: 'pointer',
              }}>Não</button>
              <button onClick={install} style={{
                padding: '8px 16px', borderRadius: 99, background: T.brand,
                color: '#fff', border: 'none', fontSize: 13, fontWeight: 700,
                fontFamily: FONT_BODY, cursor: 'pointer',
              }}>Instalar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
