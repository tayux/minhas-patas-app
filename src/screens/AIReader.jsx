import { useState, useRef, useEffect } from 'react';
import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, IconBtn, Eyebrow, Display, Stripe } from '../components/Shared.jsx';

const MEDS = [
  { name:'Prednisolona 10mg', use:'Reduz coceira e inflamação na pele.',
    dose:'1 comprimido · 2x ao dia · 7 dias', emoji:'💊', tint:T.tintLavender },
  { name:'Protetor hepático', use:'Apoia o fígado durante o tratamento.',
    dose:'2.5ml · 2x ao dia · 14 dias', emoji:'🧴', tint:T.tintSky },
];
const SCHEDULE = [
  { time:'07h', label:'Manhã', emoji:'🌅', tint:T.tintPeach,    med:'Prednisolona' },
  { time:'15h', label:'Tarde', emoji:'☀️', tint:T.tintCream,    med:'Prednisolona + Protetor' },
  { time:'23h', label:'Noite', emoji:'🌙', tint:T.tintLavender, med:'Protetor' },
];

// Loading spinner SVG
const Spinner = () => (
  <svg className="spin" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" stroke={T.bgWash} strokeWidth="3" />
    <path d="M16 4a12 12 0 0 1 12 12" stroke={T.brand} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default function AIReader() {
  const { nav, back } = useNav();
  const [phase, setPhase] = useState('idle'); // idle | loading | done
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState('');
  const [preview, setPreview] = useState(null); // data URL for images
  const fileRef = useRef(null);
  const camRef  = useRef(null);

  // Simulate analysis progress
  useEffect(() => {
    if (phase !== 'loading') return;
    setProgress(0);
    const steps = [
      { to:18,  delay:200  },
      { to:43,  delay:700  },
      { to:67,  delay:1300 },
      { to:85,  delay:500  },
      { to:100, delay:600  },
    ];
    let totalDelay = 0;
    const timers = steps.map(({ to, delay }) => {
      totalDelay += delay;
      return setTimeout(() => setProgress(to), totalDelay);
    });
    const done = setTimeout(() => setPhase('done'), totalDelay + 400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [phase]);

  const handleFile = (file) => {
    if (!file) return;
    setFilename(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    setPhase('loading');
  };

  // --- IDLE ---
  if (phase === 'idle') return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} className="btn-press" />
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 40px' }}>
        <Eyebrow>com inteligência artificial</Eyebrow>
        <Display size={42} weight={400} style={{ marginTop:8 }}>
          Receita<br /><span style={{ fontStyle:'italic' }}>inteligente</span>
        </Display>
        <div style={{ fontSize:14, color:T.inkSoft, marginTop:10, lineHeight:1.5 }}>
          Envie a receita do veterinário e organizamos os horários pra você.
        </div>

        {/* Drop / tap area */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{ marginTop:28, border:`2px dashed ${T.brand}`,
            borderRadius:24, padding:'40px 24px', textAlign:'center', cursor:'pointer',
            background:T.brandWash, transition:'background 0.15s' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📄</div>
          <div style={{ fontWeight:700, fontSize:16, color:T.ink }}>Toque para enviar arquivo</div>
          <div style={{ fontSize:13, color:T.inkSoft, marginTop:6 }}>PDF, JPG, PNG ou foto da receita</div>
        </div>

        <div style={{ display:'flex', gap:12, marginTop:16 }}>
          {/* Camera button */}
          <button onClick={() => camRef.current?.click()} className="btn-press"
            style={{ flex:1, height:56, borderRadius:18, border:`1.5px solid ${T.hairlineStrong}`,
              background:T.surface, fontFamily:FONT_BODY, fontSize:14, fontWeight:600,
              color:T.ink, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>📷</span> Câmera
          </button>
          {/* Gallery button */}
          <button onClick={() => fileRef.current?.click()} className="btn-press"
            style={{ flex:1, height:56, borderRadius:18, border:`1.5px solid ${T.hairlineStrong}`,
              background:T.surface, fontFamily:FONT_BODY, fontSize:14, fontWeight:600,
              color:T.ink, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>🖼️</span> Galeria / PDF
          </button>
        </div>

        {/* Hidden file inputs */}
        <input ref={camRef} type="file" accept="image/*" capture="environment"
          style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0])} />
        <input ref={fileRef} type="file" accept=".pdf,image/*"
          style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0])} />

        <div style={{ marginTop:32, textAlign:'center', fontSize:12, color:T.inkMute }}>
          Suas receitas são armazenadas com segurança e nunca compartilhadas.
        </div>
      </div>
    </div>
  );

  // --- LOADING ---
  if (phase === 'loading') return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={() => setPhase('idle')} className="btn-press" />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'24px 24px 40px' }}>
        <Eyebrow>analisando com IA</Eyebrow>
        <Display size={38} weight={400} style={{ marginTop:8 }}>
          Lendo sua<br /><span style={{ fontStyle:'italic' }}>receita…</span>
        </Display>

        <Card pad={18} radius={22} style={{ marginTop:28 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            {preview ? (
              <img src={preview} alt=""
                style={{ width:64, height:82, objectFit:'cover', borderRadius:12, flexShrink:0 }} />
            ) : (
              <Stripe w={64} h={82} label="RX" radius={12} />
            )}
            <div style={{ flex:1, minWidth:0 }}>
              <span className="pulse" style={{ display:'inline-block', fontSize:10, fontWeight:800,
                letterSpacing:1.2, textTransform:'uppercase', padding:'3px 8px',
                borderRadius:99, background:T.brandSoft, color:T.brand }}>analisando ✨</span>
              <div style={{ fontWeight:700, fontSize:14, color:T.ink, marginTop:6,
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {filename || 'receita.pdf'}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
                <div style={{ flex:1, height:4, borderRadius:99, background:T.bgWash, overflow:'hidden' }}>
                  <div className="progress-bar"
                    style={{ width:`${progress}%`, height:'100%', background:T.brand, borderRadius:99 }} />
                </div>
                <span style={{ fontSize:11, color:T.inkSoft, fontWeight:700, minWidth:28 }}>{progress}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Steps */}
        <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:14 }}>
          {[
            { label:'Identificando medicamentos', done: progress >= 43 },
            { label:'Extraindo posologia e doses',done: progress >= 67 },
            { label:'Criando agenda personalizada',done: progress >= 100 },
          ].map((step, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:24, height:24, borderRadius:'50%',
                background: step.done ? T.brand : T.bgWash,
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, transition:'background 0.3s' }}>
                {step.done
                  ? <Icon d={I.check} size={13} color="#fff" stroke={3} />
                  : (progress > i * 33 && progress < (i+1)*33+10
                    ? <Spinner />
                    : <div style={{ width:8, height:8, borderRadius:'50%', background:T.inkFaint }} />)
                }
              </div>
              <span style={{ fontSize:14, fontWeight:600,
                color: step.done ? T.ink : T.inkMute,
                transition:'color 0.3s' }}>{step.label}</span>
            </div>
          ))}
        </div>

        <div style={{ flex:1 }} />
        <div style={{ textAlign:'center', fontSize:12, color:T.inkMute }}>
          Isso leva apenas alguns segundos…
        </div>
      </div>
    </div>
  );

  // --- DONE ---
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={() => setPhase('idle')} className="btn-press" />
        <button onClick={() => setPhase('idle')} className="btn-press"
          style={{ height:34, padding:'0 14px', borderRadius:99, border:'none',
            background:T.surface, fontFamily:FONT_BODY, fontSize:12, fontWeight:700,
            color:T.inkSoft, cursor:'pointer' }}>Nova receita</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 24px' }}>
        <Eyebrow>receita analisada ✓</Eyebrow>
        <Display size={42} weight={400} style={{ marginTop:8 }}>
          Receita<br /><span style={{ fontStyle:'italic' }}>inteligente</span>
        </Display>

        <Card pad={14} radius={22} style={{ marginTop:22, display:'flex', gap:14, alignItems:'center' }}>
          {preview ? (
            <img src={preview} alt=""
              style={{ width:64, height:82, objectFit:'cover', borderRadius:14, flexShrink:0 }} />
          ) : (
            <Stripe w={64} h={82} label="RX" radius={14} />
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase',
              padding:'3px 8px', borderRadius:99, background:T.tintMint, color:T.tintMintInk }}>
              ✓ analisado
            </span>
            <div style={{ fontWeight:700, fontSize:14, color:T.ink, marginTop:6,
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {filename || 'receita-leia-12mai.pdf'}
            </div>
            <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>Dr. Henrique · CRMV 4821</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
              <div style={{ flex:1, height:3, borderRadius:99, background:T.bgWash }}>
                <div style={{ width:'100%', height:'100%', background:T.tintMintInk, borderRadius:99 }} />
              </div>
              <span style={{ fontSize:11, color:T.tintMintInk, fontWeight:700 }}>100%</span>
            </div>
          </div>
        </Card>

        <div style={{ marginTop:24 }}>
          <SectionPill icon="💊" label="Identificados" count={2} tint={T.tintLavender} ink={T.tintLavenderInk} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
          {MEDS.map((m,i) => (
            <Card key={i} pad={14} radius={20} className="pressable" style={{ cursor:'pointer' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <EmojiCircle emoji={m.emoji} size={42} tint={m.tint} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>{m.name}</div>
                  <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{m.dose}</div>
                </div>
              </div>
              <div style={{ marginTop:12, padding:'12px 14px', background:T.surfaceLo,
                borderRadius:14, fontSize:13, color:T.ink, lineHeight:1.5 }}>
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase',
                  color:T.inkMute, marginBottom:4 }}>para que serve</div>
                {m.use}
              </div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop:24 }}>
          <SectionPill icon="✨" label="Horários sugeridos" count={3} tint={T.tintCream} ink={T.tintCreamInk} />
        </div>
        <Card pad={16} radius={22} style={{ marginTop:12 }}>
          <div style={{ position:'relative', paddingLeft:28 }}>
            <div style={{ position:'absolute', left:17, top:8, bottom:8, width:2,
              background:`repeating-linear-gradient(180deg, ${T.inkFaint} 0 4px, transparent 4px 8px)` }} />
            {SCHEDULE.map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 0', position:'relative' }}>
                <div style={{ position:'absolute', left:-28 }}>
                  <EmojiCircle emoji={s.emoji} size={36} tint={s.tint}
                    style={{ boxShadow:`0 0 0 4px ${T.surface}` }} />
                </div>
                <div style={{ flex:1, marginLeft:18 }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <span style={{ fontFamily:FONT_DISPLAY, fontWeight:500, fontSize:22, color:T.ink }}>{s.time}</span>
                    <span style={{ fontSize:12, color:T.inkSoft }}>· {s.label}</span>
                  </div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>{s.med}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <button onClick={() => nav('today')} className="btn-press"
          style={{ marginTop:22, width:'100%', height:56, borderRadius:99, border:'none',
            background:T.ink, color:'#fff', fontFamily:FONT_BODY, fontSize:15, fontWeight:600,
            display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer' }}>
          Ativar agenda completa
          <Icon d={I.arrow} size={16} color="#fff" stroke={2} />
        </button>
        <div style={{ textAlign:'center', fontSize:12, color:T.inkMute, marginTop:10 }}>
          Você pode ajustar horários a qualquer momento.
        </div>
      </div>
    </div>
  );
}
