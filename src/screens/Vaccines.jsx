import { useState, useRef, useEffect, useCallback } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, Icon, MascotAvatar } from '../components/Shared.jsx';
import { maskDate } from '../utils/dateUtils.js';

// ── Booklet palette ──────────────────────────────────────────────────────────
const BK = {
  cover:    '#1B4332',
  cover2:   '#2D6A4F',
  gold:     '#C9A84C',
  goldSoft: '#F0E6CC',
  page:     '#FEF9EF',
  pageRule: 'rgba(150,130,90,0.14)',
  ink:      '#2C1A0E',
  inkSoft:  '#7A6045',
  stampGr:  '#14532D',
  stampRd:  '#991B1B',
  stampAmb: '#78350F',
};

// ── CSS animations ───────────────────────────────────────────────────────────
const STYLES = `
@keyframes stamp-press {
  0%   { transform: scale(2.2) rotate(var(--rot)); opacity: 0; }
  55%  { transform: scale(0.92) rotate(var(--rot)); opacity: 0.85; }
  75%  { transform: scale(1.06) rotate(var(--rot)); opacity: 0.8; }
  100% { transform: scale(1) rotate(var(--rot)); opacity: 0.78; }
}
@keyframes scan-corners {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}
@keyframes spin-ai {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes slide-up-sheet {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
`;

// ── Utilities ────────────────────────────────────────────────────────────────
function isOverdue(dateStr) {
  if (!dateStr) return false;
  const [d, m, y] = dateStr.split('/');
  if (!d || !m || !y) return false;
  return new Date(+y, +m - 1, +d) < new Date(new Date().toDateString());
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const [d, m, y] = dateStr.split('/');
  if (!d || !m || !y) return null;
  return Math.round((new Date(+y, +m - 1, +d) - new Date(new Date().toDateString())) / 86400000);
}
function todayFormatted() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// ── Rubber stamp component ───────────────────────────────────────────────────
function StampMark({ status, size = 72, animate = false, delay = 0 }) {
  const cfg = {
    overdue:  { color: BK.stampRd,  label: 'ATRASADA', rot: '8deg'  },
    upcoming: { color: BK.stampAmb, label: 'REFORÇO',  rot: '-10deg' },
    ok:       { color: BK.stampGr,  label: 'APLICADA', rot: '-14deg' },
  }[status] || { color: BK.stampGr, label: 'APLICADA', rot: '-14deg' };

  const style = animate
    ? {
        animation: `stamp-press 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both`,
        '--rot': cfg.rot,
      }
    : { transform: `rotate(${cfg.rot})`, opacity: 0.78 };

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2.5px double ${cfg.color}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, ...style,
    }}>
      <div style={{ width: size * 0.6, height: 1.5, background: cfg.color, marginBottom: 4 }} />
      <div style={{
        fontSize: size * 0.135, fontWeight: 900, color: cfg.color,
        letterSpacing: 0.8, textAlign: 'center', lineHeight: 1.15,
        fontFamily: FONT_BODY,
      }}>{cfg.label}</div>
      <div style={{ width: size * 0.6, height: 1.5, background: cfg.color, marginTop: 4 }} />
    </div>
  );
}

// ── Booklet cover ────────────────────────────────────────────────────────────
function BookletCover({ pet, total, overdueCt }) {
  return (
    <div style={{
      background: `linear-gradient(155deg, ${BK.cover} 0%, ${BK.cover2} 100%)`,
      borderRadius: 24, padding: 28,
      boxShadow: '0 14px 48px rgba(0,0,0,0.30)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Gold inner border */}
      <div style={{
        position: 'absolute', inset: 9,
        border: `1px solid ${BK.gold}`,
        borderRadius: 17, opacity: 0.35, pointerEvents: 'none',
      }} />

      {/* Header label */}
      <div style={{
        textAlign: 'center', fontFamily: FONT_BODY,
        fontSize: 9.5, fontWeight: 800, letterSpacing: 3.5,
        color: BK.goldSoft, textTransform: 'uppercase',
        marginBottom: 22, opacity: 0.8,
      }}>Caderneta de Vacinação</div>

      {/* Pet avatar with gold ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <div style={{
          borderRadius: '50%',
          padding: 3,
          background: `linear-gradient(135deg, ${BK.gold}, ${BK.goldSoft})`,
          boxShadow: `0 0 0 2px ${BK.cover}, 0 0 0 4px ${BK.gold}40`,
        }}>
          <div style={{ borderRadius: '50%', overflow: 'hidden', width: 80, height: 80 }}>
            <MascotAvatar size={80} hue={pet.hue} photo={pet.photo} photoUrl={pet.photoUrl} />
          </div>
        </div>
      </div>

      {/* Pet name */}
      <div style={{
        textAlign: 'center', color: '#fff', fontWeight: 800,
        fontSize: 24, fontFamily: FONT_DISPLAY, fontStyle: 'italic', marginBottom: 4,
      }}>{pet.name}</div>
      <div style={{
        textAlign: 'center', color: BK.goldSoft, fontSize: 12,
        fontFamily: FONT_BODY, opacity: 0.72,
      }}>{pet.breed || 'Pet'} · {pet.gender?.split(' ·')[0] || ''}</div>

      {/* Stats */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 40, marginTop: 22,
        paddingTop: 18, borderTop: `1px solid rgba(201,168,76,0.25)`,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: 10, color: BK.goldSoft, opacity: 0.75, fontFamily: FONT_BODY, marginTop: 3 }}>
            {total === 1 ? 'vacina' : 'vacinas'}
          </div>
        </div>
        {overdueCt > 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#FBBF24', lineHeight: 1 }}>{overdueCt}</div>
            <div style={{ fontSize: 10, color: '#FDE68A', fontFamily: FONT_BODY, marginTop: 3 }}>
              {overdueCt === 1 ? 'atrasada' : 'atrasadas'}
            </div>
          </div>
        )}
      </div>

      {/* Issue date */}
      <div style={{
        textAlign: 'center', marginTop: 16,
        fontSize: 9, color: BK.goldSoft, opacity: 0.5, fontFamily: FONT_BODY,
      }}>Emitido em {todayFormatted()}</div>
    </div>
  );
}

// ── One vaccine entry (booklet page style) ───────────────────────────────────
function VaccineEntry({ vaccine, index, onTap }) {
  const [stamped, setStamped] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStamped(true), 100 + index * 140);
    return () => clearTimeout(t);
  }, [index]);

  const overdue  = isOverdue(vaccine.nextDate);
  const days     = vaccine.nextDate ? daysUntil(vaccine.nextDate) : null;
  const upcoming = !overdue && days !== null && days >= 0 && days <= 45;
  const status   = overdue ? 'overdue' : upcoming ? 'upcoming' : 'ok';
  const accent   = overdue ? '#EF4444' : upcoming ? '#F59E0B' : '#16A34A';

  return (
    <div onClick={() => onTap(vaccine)}
      className="pressable"
      style={{
        background: BK.page,
        borderRadius: 16,
        padding: '16px 18px 16px 24px',
        cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        borderLeft: `4px solid ${accent}`,
        boxShadow: '0 3px 14px rgba(44,26,14,0.09)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}>
      {/* Entry number badge */}
      <div style={{
        position: 'absolute', top: 14, left: -11,
        width: 22, height: 22, borderRadius: 11,
        background: overdue ? '#EF4444' : BK.cover,
        color: '#fff', fontSize: 10, fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_BODY, boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        zIndex: 1,
      }}>{index + 1}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Vaccine name */}
          <div style={{
            fontSize: 15, fontWeight: 800, color: BK.ink,
            fontFamily: FONT_BODY, marginBottom: 8,
          }}>{vaccine.name}</div>

          {/* Horizontal rule (booklet line) */}
          <div style={{ height: 1, background: BK.pageRule, marginBottom: 9 }} />

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
            {vaccine.date && (
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: BK.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: FONT_BODY }}>Aplicada</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: BK.ink, fontFamily: FONT_BODY, marginTop: 1 }}>{vaccine.date}</div>
              </div>
            )}
            {vaccine.nextDate && (
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: overdue ? '#EF4444' : BK.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: FONT_BODY }}>
                  Próx. reforço
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: overdue ? '#EF4444' : BK.ink, fontFamily: FONT_BODY, marginTop: 1 }}>{vaccine.nextDate}</div>
              </div>
            )}
            {vaccine.lot && (
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: BK.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: FONT_BODY }}>Lote</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: BK.ink, fontFamily: FONT_BODY, marginTop: 1 }}>{vaccine.lot}</div>
              </div>
            )}
            {vaccine.vet && (
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: BK.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: FONT_BODY }}>Veterinário</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: BK.ink, fontFamily: FONT_BODY, marginTop: 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vaccine.vet}</div>
              </div>
            )}
          </div>

          {/* Status chips */}
          {overdue && (
            <div style={{ marginTop: 10, display: 'inline-flex', padding: '3px 10px',
              background: '#FEE2E2', borderRadius: 99 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#DC2626', fontFamily: FONT_BODY }}>REFORÇO ATRASADO</span>
            </div>
          )}
          {!overdue && upcoming && days !== null && (
            <div style={{ marginTop: 10, display: 'inline-flex', padding: '3px 10px',
              background: '#FEF3C7', borderRadius: 99 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#92400E', fontFamily: FONT_BODY }}>
                {days === 0 ? 'HOJE' : `em ${days} dia${days === 1 ? '' : 's'}`}
              </span>
            </div>
          )}
        </div>

        {/* Animated rubber stamp */}
        {stamped && (
          <StampMark status={status} size={66} animate delay={0} />
        )}
        {!stamped && <div style={{ width: 66, height: 66, flexShrink: 0 }} />}
      </div>
    </div>
  );
}

// ── Vaccine detail bottom sheet ──────────────────────────────────────────────
function DetailSheet({ vaccine, onClose, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const overdue = isOverdue(vaccine.nextDate);
  const accent  = overdue ? '#EF4444' : '#16A34A';
  const accentBg = overdue ? '#FEE2E2' : '#DCFCE7';
  const label   = overdue ? 'Reforço atrasado!' : vaccine.nextDate ? 'Em dia ✓' : 'Registrada ✓';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.48)',
      display: 'flex', alignItems: 'flex-end', zIndex: 300,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: '100%', background: '#fff',
        borderRadius: '26px 26px 0 0',
        padding: '24px 22px 44px',
        animation: 'slide-up-sheet 0.32s cubic-bezier(0.32,0.72,0,1)',
      }}>
        {/* Drag handle */}
        <div style={{ width: 38, height: 4, borderRadius: 2, background: T.inkFaint,
          margin: '-10px auto 20px' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: T.ink, fontFamily: FONT_BODY }}>{vaccine.name}</div>
            <div style={{
              marginTop: 6, display: 'inline-flex', padding: '4px 12px',
              background: accentBg, borderRadius: 99,
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: accent, fontFamily: FONT_BODY }}>{label}</span>
            </div>
          </div>
          {!confirmDel ? (
            <div onClick={() => setConfirmDel(true)} style={{
              width: 38, height: 38, borderRadius: 19,
              background: '#FEE2E2', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
            }}>
              <I.trash size={17} color="#EF4444" strokeWidth={2} />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => setConfirmDel(false)} style={{
                padding: '7px 14px', borderRadius: 99,
                border: `1px solid ${T.hairlineStrong}`, background: 'transparent',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT_BODY,
              }}>Não</button>
              <button onClick={onDelete} style={{
                padding: '7px 14px', borderRadius: 99,
                border: 'none', background: '#EF4444', color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT_BODY,
              }}>Excluir</button>
            </div>
          )}
        </div>

        {/* Stamp display */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <StampMark status={overdue ? 'overdue' : 'ok'} size={90} />
        </div>

        {/* Detail rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Data de aplicação', value: vaccine.date },
            { label: 'Próximo reforço',   value: vaccine.nextDate, highlight: overdue },
            { label: 'Número do lote',    value: vaccine.lot },
            { label: 'Veterinário',       value: vaccine.vet },
          ].filter(r => r.value).map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', borderRadius: 14,
              background: r.highlight ? '#FEE2E2' : T.bgWash,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: r.highlight ? '#DC2626' : T.inkSoft, fontFamily: FONT_BODY }}>
                {r.label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: r.highlight ? '#DC2626' : T.ink, fontFamily: FONT_BODY }}>
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: '100%', height: 50, borderRadius: 99, marginTop: 22,
          background: T.surface, color: T.ink, border: `1px solid ${T.hairlineStrong}`,
          fontSize: 14, fontWeight: 600, fontFamily: FONT_BODY, cursor: 'pointer',
        }}>Fechar</button>
      </div>
    </div>
  );
}

// ── AI Vaccine Card Scanner ──────────────────────────────────────────────────
function CardScanner({ onClose, onDone, petName }) {
  const [step, setStep]           = useState('pick');   // pick | preview | loading | results | error
  const [imageUrl, setImageUrl]   = useState(null);
  const [imageB64, setImageB64]   = useState(null);
  const [mimeType, setMimeType]   = useState(null);
  const [detected, setDetected]   = useState([]);
  const [errMsg, setErrMsg]       = useState('');
  const fileRef = useRef();

  const handleFile = useCallback(e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      setImageUrl(dataUrl);
      setImageB64(dataUrl.split(',')[1]);
      setStep('preview');
    };
    reader.readAsDataURL(file);
  }, []);

  const analyze = useCallback(async () => {
    setStep('loading');
    try {
      const res = await fetch('/api/analyze-vaccine-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageB64, mimeType }),
      });
      const data = await res.json();
      if (data.error && (!data.vaccines || data.vaccines.length === 0)) {
        setErrMsg(data.error);
        setStep('error');
        return;
      }
      if (!data.vaccines || data.vaccines.length === 0) {
        setErrMsg('Nenhuma vacina detectada. Tente uma foto mais nítida, bem iluminada e sem reflexos.');
        setStep('error');
        return;
      }
      setDetected(data.vaccines.map((v, i) => ({ ...v, _key: i })));
      setStep('results');
    } catch {
      setErrMsg('Erro de conexão. Verifique sua internet e tente novamente.');
      setStep('error');
    }
  }, [imageB64, mimeType]);

  const updateDetected = (key, field, val) => {
    setDetected(prev => prev.map(v => v._key === key ? { ...v, [field]: val } : v));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: step === 'pick' ? 'rgba(10,10,15,0.92)' : '#0D1117',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{STYLES}</style>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px', flexShrink: 0,
      }}>
        <div onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Icon d={I.chevL} size={18} color="#fff" stroke={2.5} />
        </div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: FONT_BODY }}>
          Ler Cartão de Vacinação
        </div>
      </div>

      {/* ── PICK step ── */}
      {step === 'pick' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          {/* Animated scan frame */}
          <div style={{
            width: 260, height: 180, position: 'relative',
            marginBottom: 40,
          }}>
            {/* Corner marks */}
            {[
              { top: 0, left: 0, borderTop: '3px solid #fff', borderLeft: '3px solid #fff' },
              { top: 0, right: 0, borderTop: '3px solid #fff', borderRight: '3px solid #fff' },
              { bottom: 0, left: 0, borderBottom: '3px solid #fff', borderLeft: '3px solid #fff' },
              { bottom: 0, right: 0, borderBottom: '3px solid #fff', borderRight: '3px solid #fff' },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute', width: 28, height: 28,
                animation: 'scan-corners 2s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
                ...s,
              }} />
            ))}
            {/* Center content */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ fontSize: 40 }}>📋</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: FONT_BODY, textAlign: 'center' }}>
                Posicione o cartão aqui
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: FONT_BODY, marginBottom: 8 }}>
              Fotografe o cartão de vacinação
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: FONT_BODY, lineHeight: 1.5, maxWidth: 280 }}>
              A IA extrai as vacinas automaticamente — datas, lotes e veterinário incluídos.
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
            {/* Single file input — capture attr removed when user clicks gallery */}
            <input ref={fileRef} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={handleFile} />
            <button onClick={() => { fileRef.current.removeAttribute('capture'); fileRef.current.setAttribute('capture','environment'); fileRef.current?.click(); }} style={{
              height: 54, borderRadius: 99, border: 'none',
              background: T.brand, color: '#fff',
              fontSize: 16, fontWeight: 700, fontFamily: FONT_BODY, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <I.camera size={20} color="#fff" strokeWidth={2} />
              Fotografar cartão
            </button>
            <button onClick={() => { fileRef.current.removeAttribute('capture'); fileRef.current?.click(); }} style={{
              height: 48, borderRadius: 99, border: '1.5px solid rgba(255,255,255,0.3)',
              background: 'transparent', color: 'rgba(255,255,255,0.8)',
              fontSize: 14, fontWeight: 600, fontFamily: FONT_BODY, cursor: 'pointer',
            }}>
              Escolher da galeria
            </button>
          </div>
        </div>
      )}

      {/* ── PREVIEW step ── */}
      {step === 'preview' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 40px' }}>
          <div style={{ flex: 1, width: '100%', borderRadius: 20, overflow: 'hidden', background: '#1A1A1F', marginBottom: 24 }}>
            {imageUrl && (
              <img src={imageUrl} alt="Cartão" style={{
                width: '100%', height: '100%', objectFit: 'contain',
              }} />
            )}
          </div>
          <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={analyze} style={{
              height: 54, borderRadius: 99, border: 'none',
              background: T.brand, color: '#fff',
              fontSize: 16, fontWeight: 700, fontFamily: FONT_BODY, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>✨</span> Analisar com IA
            </button>
            <button onClick={() => { setStep('pick'); setImageUrl(null); }} style={{
              height: 46, borderRadius: 99,
              border: '1.5px solid rgba(255,255,255,0.2)',
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              fontSize: 14, fontWeight: 600, fontFamily: FONT_BODY, cursor: 'pointer',
            }}>Tirar outra foto</button>
          </div>
        </div>
      )}

      {/* ── LOADING step ── */}
      {step === 'loading' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 32,
            border: `4px solid rgba(255,255,255,0.15)`,
            borderTop: `4px solid ${T.brand}`,
            animation: 'spin-ai 0.9s linear infinite',
          }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', fontFamily: FONT_BODY }}>Analisando cartão...</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6, fontFamily: FONT_BODY }}>
              A IA está lendo as vacinas 🔍
            </div>
          </div>
        </div>
      )}

      {/* ── ERROR step ── */}
      {step === 'error' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 }}>
          <div style={{ fontSize: 56 }}>😕</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: FONT_BODY, marginBottom: 8 }}>
              Não foi possível ler
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: FONT_BODY, lineHeight: 1.5 }}>
              {errMsg}
            </div>
          </div>
          <button onClick={() => setStep('pick')} style={{
            height: 50, paddingInline: 32, borderRadius: 99, border: 'none',
            background: T.brand, color: '#fff',
            fontSize: 15, fontWeight: 700, fontFamily: FONT_BODY, cursor: 'pointer',
          }}>Tentar novamente</button>
        </div>
      )}

      {/* ── RESULTS step ── */}
      {step === 'results' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '4px 22px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: FONT_BODY }}>
              {detected.length} vacina{detected.length !== 1 ? 's' : ''} detectada{detected.length !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontFamily: FONT_BODY }}>
              Revise e edite antes de salvar
            </div>
          </div>

          {/* Detected vaccines list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {detected.map((v) => (
                <div key={v._key} style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: 18,
                  padding: '16px 18px', border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
                    fontFamily: FONT_BODY, letterSpacing: 0.5, marginBottom: 10 }}>VACINA</div>
                  <input
                    value={v.name || ''}
                    onChange={e => updateDetected(v._key, 'name', e.target.value)}
                    placeholder="Nome da vacina"
                    style={{
                      width: '100%', background: 'transparent', border: 'none', outline: 'none',
                      fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: FONT_BODY,
                      marginBottom: 12, boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { key: 'date',     label: 'Aplicada',     placeholder: 'dd/mm/aaaa' },
                      { key: 'nextDate', label: 'Próx. reforço', placeholder: 'dd/mm/aaaa' },
                      { key: 'lot',      label: 'Lote',         placeholder: 'Ex: LT4421' },
                      { key: 'vet',      label: 'Veterinário',  placeholder: 'Nome' },
                    ].map(field => (
                      <div key={field.key}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
                          letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: FONT_BODY, marginBottom: 4 }}>
                          {field.label}
                        </div>
                        <input
                          value={v[field.key] || ''}
                          onChange={e => updateDetected(v._key, field.key,
                            (field.key === 'date' || field.key === 'nextDate')
                              ? maskDate(e.target.value) : e.target.value)}
                          placeholder={field.placeholder}
                          inputMode={field.key === 'date' || field.key === 'nextDate' ? 'numeric' : 'text'}
                          style={{
                            width: '100%', background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: 10, padding: '8px 10px',
                            fontSize: 12, color: '#fff', fontFamily: FONT_BODY,
                            outline: 'none', boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save footer */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '14px 22px 36px',
            background: 'linear-gradient(to top, #0D1117 70%, transparent)',
          }}>
            <button onClick={() => onDone(detected.filter(v => v.name?.trim()))} style={{
              width: '100%', height: 54, borderRadius: 99, border: 'none',
              background: T.brand, color: '#fff',
              fontSize: 16, fontWeight: 700, fontFamily: FONT_BODY, cursor: 'pointer',
            }}>
              Salvar {detected.filter(v => v.name?.trim()).length} vacina{detected.filter(v => v.name?.trim()).length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FAB menu ─────────────────────────────────────────────────────────────────
function FabMenu({ fabOpen, setFabOpen, onManual, onScan }) {
  return (
    <>
      {fabOpen && <div onClick={() => setFabOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />}
      {fabOpen && (
        <div style={{
          position: 'absolute', bottom: 88, right: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, zIndex: 100,
        }}>
          {[
            { label: 'Ler cartão com IA', Icon: I.camera, color: T.brand, action: onScan },
            { label: 'Cadastrar manualmente', Icon: I.plus, color: T.ink, action: onManual },
          ].map(o => (
            <div key={o.label} onClick={() => { o.action(); setFabOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: o.color === T.brand ? T.brand : T.bg,
                borderRadius: 99, padding: '10px 18px 10px 14px',
                boxShadow: '0 6px 20px rgba(20,20,30,0.18)', cursor: 'pointer',
              }}>
              <o.Icon size={18} color={o.color === T.brand ? '#fff' : T.ink} strokeWidth={2.2} />
              <span style={{ fontSize: 14, fontWeight: 700, color: o.color === T.brand ? '#fff' : T.ink, fontFamily: FONT_BODY }}>{o.label}</span>
            </div>
          ))}
        </div>
      )}
      <div onClick={() => setFabOpen(v => !v)}
        style={{
          position: 'absolute', bottom: 24, right: 20,
          width: 56, height: 56, borderRadius: 28,
          background: fabOpen ? T.inkSoft : T.ink, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 8px 28px -4px rgba(20,20,30,0.40)',
          transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), background 0.2s',
          transform: fabOpen ? 'rotate(45deg)' : 'none', zIndex: 101,
        }}>
        <I.plus size={26} color="#fff" strokeWidth={2.2} />
      </div>
    </>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function Vaccines() {
  const { back, nav }  = useNav();
  const { activePet, vaccines, addVaccine, deleteVaccine } = usePet();
  const [detail, setDetail]   = useState(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [scanner, setScanner] = useState(false);

  const handleScanDone = useCallback(async (detectedVaccines) => {
    for (const v of detectedVaccines) {
      if (v.name?.trim()) {
        await addVaccine({ name: v.name.trim(), date: v.date || '', nextDate: v.nextDate || '', lot: v.lot || '', vet: v.vet || '' });
      }
    }
    setScanner(false);
  }, [addVaccine]);

  const handleDelete = useCallback((id) => {
    deleteVaccine(id);
    setDetail(null);
  }, [deleteVaccine]);

  if (!activePet) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center' }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🛡️</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.ink, fontFamily: FONT_BODY }}>Sem pet selecionado</div>
        <div style={{ fontSize: 14, color: T.inkSoft, fontFamily: FONT_BODY, maxWidth: 260, lineHeight: 1.5 }}>
          Cadastre um pet para controlar o calendário de vacinas.
        </div>
      </div>
    </div>
  );

  const sorted    = [...vaccines].sort((a, b) => {
    const da = a.date ? a.date.split('/').reverse().join('') : '0';
    const db = b.date ? b.date.split('/').reverse().join('') : '0';
    return db.localeCompare(da);
  });
  const overdueCt = sorted.filter(v => isOverdue(v.nextDate)).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bgWash, position: 'relative' }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 12, background: T.bgWash }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize: 17, fontWeight: 700, color: T.ink, flex: 1, fontFamily: FONT_BODY }}>Vacinas</div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }}>

        {/* Booklet cover */}
        <BookletCover pet={activePet} total={sorted.length} overdueCt={overdueCt} />

        {sorted.length === 0 ? (
          /* Empty state inside booklet */
          <div style={{
            background: BK.page, borderRadius: 20, marginTop: 12, padding: '40px 24px',
            boxShadow: '0 2px 12px rgba(44,26,14,0.07)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14,
          }}>
            {/* Dotted lines effect */}
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: '100%', height: 1, background: BK.pageRule, marginBottom: 6 }} />
            ))}
            <div style={{ fontSize: 48, marginTop: 8 }}>💉</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: BK.ink, fontFamily: FONT_BODY }}>
              Nenhuma vacina registrada
            </div>
            <div style={{ fontSize: 13, color: BK.inkSoft, fontFamily: FONT_BODY, lineHeight: 1.55, maxWidth: 240 }}>
              Adicione as vacinas manualmente ou fotografe o cartão de vacinação — a IA preenche tudo.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => setScanner(true)} style={{
                height: 44, paddingInline: 22, borderRadius: 99, border: 'none',
                background: T.brand, color: '#fff',
                fontSize: 14, fontWeight: 700, fontFamily: FONT_BODY, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <I.camera size={16} color="#fff" strokeWidth={2} />
                Ler cartão com IA
              </button>
              <button onClick={() => nav('addvaccine')} style={{
                height: 44, paddingInline: 22, borderRadius: 99,
                border: `1.5px solid ${BK.cover}`, background: 'transparent', color: BK.cover,
                fontSize: 14, fontWeight: 700, fontFamily: FONT_BODY, cursor: 'pointer',
              }}>
                Cadastrar manualmente
              </button>
            </div>
          </div>
        ) : (
          /* Vaccine entries */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            {/* Section label */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12,
            }}>
              <div style={{ flex: 1, height: 1, background: BK.pageRule }} />
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: BK.inkSoft,
                textTransform: 'uppercase', fontFamily: FONT_BODY }}>Registros</div>
              <div style={{ flex: 1, height: 1, background: BK.pageRule }} />
            </div>

            {sorted.map((v, i) => (
              <VaccineEntry key={v.id} vaccine={v} index={i} onTap={setDetail} />
            ))}

            {/* Bottom note */}
            <div style={{ textAlign: 'center', padding: '16px 0 8px', fontFamily: FONT_BODY,
              fontSize: 11, color: BK.inkSoft, fontStyle: 'italic' }}>
              {sorted.length} vacina{sorted.length !== 1 ? 's' : ''} registrada{sorted.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <FabMenu
        fabOpen={fabOpen} setFabOpen={setFabOpen}
        onManual={() => nav('addvaccine')}
        onScan={() => setScanner(true)}
      />

      {/* Overlays */}
      {detail && (
        <DetailSheet
          vaccine={detail}
          onClose={() => setDetail(null)}
          onDelete={() => handleDelete(detail.id)}
        />
      )}
      {scanner && (
        <CardScanner
          onClose={() => setScanner(false)}
          onDone={handleScanDone}
          petName={activePet?.name}
        />
      )}
    </div>
  );
}
