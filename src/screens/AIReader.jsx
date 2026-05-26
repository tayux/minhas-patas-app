import { useState, useRef, useCallback } from 'react';
import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { todayStr } from '../utils/dateUtils.js';
import { Icon, I, Card, EmojiCircle, SectionPill, IconBtn, Eyebrow, Display, Stripe } from '../components/Shared.jsx';

function addDaysBR(brDate, days) {
  const [d, m, y] = brDate.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
}

function compressImage(dataUrl, maxPx = 1200, q = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', q));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function emojiTint(emoji) {
  if (['💉','🩹','🌿','🍃'].includes(emoji)) return { tint: T.tintMint,     tintKey: 'tintMint'     };
  if (['🧴','💧','🫧','🧃'].includes(emoji)) return { tint: T.tintSky,      tintKey: 'tintSky'      };
  if (['🌸','🍊','🟠'].includes(emoji))        return { tint: T.tintPeach,    tintKey: 'tintPeach'    };
  return                                                { tint: T.tintLavender, tintKey: 'tintLavender' };
}

function buildSchedule(medications) {
  const map = {};
  medications.forEach(med => {
    (med.suggestedTimes || []).forEach(time => {
      if (!map[time]) map[time] = [];
      const shortName = med.name.split(' ')[0];
      if (!map[time].includes(shortName)) map[time].push(shortName);
    });
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, names]) => {
      const h = parseInt(time.split(':')[0]);
      return {
        time:  `${h}h`,
        label: h < 12 ? 'Manhã' : h < 18 ? 'Tarde' : 'Noite',
        emoji: h < 12 ? '🌅'    : h < 18 ? '☀️'    : '🌙',
        tint:  h < 12 ? T.tintPeach : h < 18 ? T.tintCream : T.tintLavender,
        med:   names.join(' + '),
      };
    });
}

const Spinner = () => (
  <svg className="spin" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" stroke={T.bgWash} strokeWidth="3" />
    <path d="M16 4a12 12 0 0 1 12 12" stroke={T.brand} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default function AIReader() {
  const { nav, back } = useNav();
  const { addMedication, addDocument } = usePet();

  const [phase, setPhase]       = useState('idle'); // idle | loading | done
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState('');
  const [preview, setPreview]   = useState(null);
  const [aiResult, setAiResult] = useState(null);  // { medications, vet, crmv }
  const [aiError, setAiError]   = useState('');
  const [saving, setSaving]     = useState(false);

  const fileRef = useRef(null);
  const camRef  = useRef(null);
  const timerRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setFilename(file.name);
    setAiResult(null);
    setAiError('');
    setPhase('loading');
    setProgress(0);

    try {
      // Read raw
      const rawDataUrl = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload  = e => res(e.target.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const isImage = file.type.startsWith('image/');
      let apiBase64, apiMime;

      if (isImage) {
        const compressed = await compressImage(rawDataUrl, 1200, 0.85);
        setPreview(compressed);
        apiBase64 = compressed.split(',')[1];
        apiMime   = 'image/jpeg';
      } else {
        setPreview(null);
        apiBase64 = rawDataUrl.split(',')[1];
        apiMime   = file.type; // application/pdf
      }

      // Animate progress to 80% while waiting for API
      let p = 0;
      timerRef.current = setInterval(() => {
        p = Math.min(p + 1.5, 80);
        setProgress(Math.round(p));
      }, 120);

      const res = await fetch('/api/analyze-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: apiBase64, mimeType: apiMime }),
      });

      clearInterval(timerRef.current);

      if (!res.ok) throw new Error('api');
      const result = await res.json();

      if (result.error && (!result.medications || result.medications.length === 0)) {
        setAiError(result.error);
        setPhase('idle');
        return;
      }

      setProgress(100);
      setAiResult(result);
      setTimeout(() => setPhase('done'), 500);
    } catch {
      clearInterval(timerRef.current);
      setAiError('Não foi possível analisar a receita. Verifique sua conexão e tente novamente.');
      setPhase('idle');
    }
  }, []);

  const handleActivate = async () => {
    if (saving || !aiResult) return;
    setSaving(true);
    const start = todayStr();

    addDocument({
      cat: 'Receita',
      title: filename || `Receita ${start}`,
      date: start,
      notes: aiResult.vet ? `Dr(a). ${aiResult.vet}${aiResult.crmv ? ` · CRMV ${aiResult.crmv}` : ''}` : '',
      attachmentBase64: preview || null,
      attachName: filename || '',
      e: '💊',
      tint: T.tintLavender,
    });

    (aiResult.medications || []).forEach(m => {
      const { tintKey } = emojiTint(m.emoji || '💊');
      addMedication({
        name:       m.name,
        type:       0,
        emoji:      m.emoji || '💊',
        tintKey,
        dose:       m.dose || '',
        unit:       m.unit || 'comprimido',
        freq:       m.freq || 'Diário',
        startDate:  start,
        endDate:    m.durationDays ? addDaysBR(start, m.durationDays) : '',
        continuous: !m.durationDays,
        times:      m.suggestedTimes || ['08:00'],
        reminders:  true,
        pushNotif:  true,
        alarm:      false,
        notes:      m.purpose || '',
        on:         true,
      });
    });

    setSaving(false);
    nav('today');
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
          Envie a receita do veterinário e a IA organiza os medicamentos e horários pra você.
        </div>

        {aiError && (
          <div style={{ marginTop:20, padding:'14px 16px', background:'#FEE2E2', borderRadius:16,
            fontSize:13, fontWeight:600, color:'#B91C1C', lineHeight:1.5 }}>
            ⚠ {aiError}
          </div>
        )}

        <div onClick={() => fileRef.current?.click()}
          style={{ marginTop:28, border:`2px dashed ${T.brand}`, borderRadius:24,
            padding:'40px 24px', textAlign:'center', cursor:'pointer',
            background:T.brandWash, transition:'background 0.15s' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📄</div>
          <div style={{ fontWeight:700, fontSize:16, color:T.ink }}>Toque para enviar arquivo</div>
          <div style={{ fontSize:13, color:T.inkSoft, marginTop:6 }}>PDF, JPG ou PNG da receita</div>
        </div>

        <div style={{ display:'flex', gap:12, marginTop:16 }}>
          <button onClick={() => camRef.current?.click()} className="btn-press"
            style={{ flex:1, height:56, borderRadius:18, border:`1.5px solid ${T.hairlineStrong}`,
              background:T.surface, fontFamily:FONT_BODY, fontSize:14, fontWeight:600,
              color:T.ink, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>📷</span> Câmera
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-press"
            style={{ flex:1, height:56, borderRadius:18, border:`1.5px solid ${T.hairlineStrong}`,
              background:T.surface, fontFamily:FONT_BODY, fontSize:14, fontWeight:600,
              color:T.ink, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>🖼️</span> Galeria / PDF
          </button>
        </div>

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
        <IconBtn icon={I.chevL} onClick={() => { clearInterval(timerRef.current); setPhase('idle'); }} className="btn-press" />
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
                    style={{ width:`${progress}%`, height:'100%', background:T.brand, borderRadius:99,
                      transition:'width 0.2s ease' }} />
                </div>
                <span style={{ fontSize:11, color:T.inkSoft, fontWeight:700, minWidth:28 }}>{progress}%</span>
              </div>
            </div>
          </div>
        </Card>

        <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:14 }}>
          {[
            { label:'Identificando medicamentos',     done: progress >= 40 },
            { label:'Extraindo posologia e doses',    done: progress >= 65 },
            { label:'Criando agenda personalizada',   done: progress >= 100 },
          ].map((step, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:24, height:24, borderRadius:'50%',
                background: step.done ? T.brand : T.bgWash,
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, transition:'background 0.3s' }}>
                {step.done
                  ? <Icon d={I.check} size={13} color="#fff" stroke={3} />
                  : <div style={{ width:8, height:8, borderRadius:'50%', background:T.inkFaint }} />
                }
              </div>
              <span style={{ fontSize:14, fontWeight:600,
                color: step.done ? T.ink : T.inkMute, transition:'color 0.3s' }}>
                {step.label}
              </span>
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
  const meds     = aiResult?.medications || [];
  const schedule = buildSchedule(meds);

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
              {filename || 'receita.pdf'}
            </div>
            {(aiResult?.vet || aiResult?.crmv) && (
              <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>
                {aiResult.vet ? `Dr(a). ${aiResult.vet}` : ''}{aiResult.crmv ? ` · CRMV ${aiResult.crmv}` : ''}
              </div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
              <div style={{ flex:1, height:3, borderRadius:99, background:T.bgWash }}>
                <div style={{ width:'100%', height:'100%', background:T.tintMintInk, borderRadius:99 }} />
              </div>
              <span style={{ fontSize:11, color:T.tintMintInk, fontWeight:700 }}>100%</span>
            </div>
          </div>
        </Card>

        {meds.length === 0 ? (
          <div style={{ marginTop:28, textAlign:'center', padding:'32px 0', color:T.inkMute }}>
            <div style={{ fontSize:32 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:600, marginTop:8, color:T.inkSoft }}>
              Nenhum medicamento identificado.
            </div>
            <div style={{ fontSize:12, marginTop:4 }}>Tente uma foto mais nítida da receita.</div>
          </div>
        ) : (
          <>
            <div style={{ marginTop:24 }}>
              <SectionPill icon="💊" label="Identificados" count={meds.length} tint={T.tintLavender} ink={T.tintLavenderInk} />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
              {meds.map((m, i) => {
                const { tint } = emojiTint(m.emoji || '💊');
                const doseLabel = [m.dose, m.unit, m.freq, m.durationDays ? `${m.durationDays} dias` : null]
                  .filter(Boolean).join(' · ');
                return (
                  <Card key={i} pad={14} radius={20}>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <EmojiCircle emoji={m.emoji || '💊'} size={42} tint={tint} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>{m.name}</div>
                        {doseLabel && <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{doseLabel}</div>}
                      </div>
                    </div>
                    {m.purpose && (
                      <div style={{ marginTop:12, padding:'12px 14px', background:T.surfaceLo,
                        borderRadius:14, fontSize:13, color:T.ink, lineHeight:1.5 }}>
                        <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.2,
                          textTransform:'uppercase', color:T.inkMute, marginBottom:4 }}>para que serve</div>
                        {m.purpose}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {schedule.length > 0 && (
              <>
                <div style={{ marginTop:24 }}>
                  <SectionPill icon="✨" label="Horários sugeridos" count={schedule.length} tint={T.tintCream} ink={T.tintCreamInk} />
                </div>
                <Card pad={16} radius={22} style={{ marginTop:12 }}>
                  <div style={{ position:'relative', paddingLeft:28 }}>
                    <div style={{ position:'absolute', left:17, top:8, bottom:8, width:2,
                      background:`repeating-linear-gradient(180deg, ${T.inkFaint} 0 4px, transparent 4px 8px)` }} />
                    {schedule.map((s, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:14,
                        padding:'8px 0', position:'relative' }}>
                        <div style={{ position:'absolute', left:-28 }}>
                          <EmojiCircle emoji={s.emoji} size={36} tint={s.tint}
                            style={{ boxShadow:`0 0 0 4px ${T.surface}` }} />
                        </div>
                        <div style={{ flex:1, marginLeft:18 }}>
                          <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                            <span style={{ fontFamily:FONT_DISPLAY, fontWeight:500, fontSize:22, color:T.ink }}>
                              {s.time}
                            </span>
                            <span style={{ fontSize:12, color:T.inkSoft }}>· {s.label}</span>
                          </div>
                          <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>{s.med}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            <button onClick={handleActivate} disabled={saving} className="btn-press"
              style={{ marginTop:22, width:'100%', height:56, borderRadius:99, border:'none',
                background:T.ink, color:'#fff', fontFamily:FONT_BODY, fontSize:15, fontWeight:600,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Salvando…' : 'Ativar agenda completa'}
              <Icon d={I.arrow} size={16} color="#fff" stroke={2} />
            </button>
            <div style={{ textAlign:'center', fontSize:12, color:T.inkMute, marginTop:10 }}>
              Você pode ajustar horários a qualquer momento.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
