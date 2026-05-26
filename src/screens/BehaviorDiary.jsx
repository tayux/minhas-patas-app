import { useState, useEffect } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, PetHeader } from '../components/Shared.jsx';

const MOODS = ['😴','😐','🙂','😊','🤩','😰'];
const APPETITE = ['Pouco','Normal','Muito'];
const BEHAVIORS = ['Letárgica','Vomitou','Coceira','Bebeu muito','Agitada','Latiu mais','Coçando','Tremeu'];

const DAYS_PT = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const MONTHS_PT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

function todayDdmm() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
function todayLabel() {
  const d = new Date();
  return `${DAYS_PT[d.getDay()]}, ${d.getDate()} ${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`;
}

export default function BehaviorDiary() {
  const { back } = useNav();
  const { activePet, diaryEntries, addDiaryEntry, updateDiaryEntry } = usePet();

  const today = todayDdmm();
  const existingEntry = diaryEntries.find(e => e.date === today);

  const [mood, setMood]         = useState(existingEntry?.mood ?? 3);
  const [appetite, setAppetite] = useState(existingEntry?.appetite ?? 1);
  const [selected, setSelected] = useState(() => new Set(existingEntry?.behaviors ?? []));
  const [note, setNote]         = useState(existingEntry?.note ?? '');
  const [saved, setSaved]       = useState(false);

  // Re-load if a different pet becomes active
  useEffect(() => {
    const entry = diaryEntries.find(e => e.date === today);
    setMood(entry?.mood ?? 3);
    setAppetite(entry?.appetite ?? 1);
    setSelected(new Set(entry?.behaviors ?? []));
    setNote(entry?.note ?? '');
    setSaved(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePet?.id]);

  const toggleBehavior = i => {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  };

  const handleSave = () => {
    const entry = {
      date: today,
      mood,
      appetite,
      behaviors: Array.from(selected),
      note: note.trim(),
    };
    if (existingEntry) {
      updateDiaryEntry(existingEntry.id, entry);
    } else {
      addDiaryEntry(entry);
    }
    setSaved(true);
    setTimeout(back, 600);
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Diário de comportamento</div>
          <div style={{ fontSize:12, color:T.inkSoft }}>{todayLabel()}</div>
        </div>
        <PetHeader />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 100px' }}>
        {!activePet ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:T.inkMute }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🐾</div>
            <div style={{ fontWeight:700, color:T.ink }}>Nenhum pet selecionado</div>
          </div>
        ) : (
          <div style={{ background:T.surface, borderRadius:20, padding:20,
            boxShadow:'0 4px 20px rgba(20,20,30,0.07)', display:'flex', flexDirection:'column', gap:0 }}>

            {existingEntry && (
              <div style={{ marginBottom:16, padding:'8px 14px', background:T.brandSoft,
                borderRadius:10, fontSize:12, fontWeight:700, color:T.brand }}>
                ✏️ Editando registro de hoje
              </div>
            )}

            {/* Mood */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:10 }}>😊 Humor</div>
              <div style={{ display:'flex', gap:6 }}>
                {MOODS.map((m, i) => (
                  <div key={i} onClick={() => setMood(i)} style={{
                    flex:1, textAlign:'center', padding:'10px 0', borderRadius:12, cursor:'pointer',
                    background: mood===i ? T.brandSoft : T.bgWash,
                    border: mood===i ? `1.5px solid ${T.brand}` : '1.5px solid transparent',
                    transition:'all 0.15s', fontSize:22 }}>{m}</div>
                ))}
              </div>
            </div>

            <div style={{ height:1, background:T.hairline, marginBottom:18 }} />

            {/* Appetite */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:10 }}>🍽️ Apetite</div>
              <div style={{ display:'flex', gap:8 }}>
                {APPETITE.map((a, i) => (
                  <div key={i} onClick={() => setAppetite(i)} style={{
                    flex:1, textAlign:'center', padding:'9px 0', borderRadius:10, cursor:'pointer',
                    background: appetite===i ? T.brandSoft : T.bgWash,
                    border: appetite===i ? `1.5px solid ${T.brand}` : '1.5px solid transparent',
                    fontSize:13, fontWeight: appetite===i?700:500,
                    color: appetite===i ? T.brand : T.inkSoft, transition:'all 0.15s' }}>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height:1, background:T.hairline, marginBottom:18 }} />

            {/* Behaviors */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:10 }}>Comportamentos incomuns</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {BEHAVIORS.map((b, i) => {
                  const active = selected.has(i);
                  return (
                    <div key={i} onClick={() => toggleBehavior(i)} style={{
                      padding:'6px 14px', borderRadius:100, cursor:'pointer',
                      background: active ? T.brandSoft : T.bgWash,
                      border: active ? `1px solid ${T.brand}` : `1px solid transparent`,
                      fontSize:12, fontWeight: active?700:500,
                      color: active ? T.brand : T.ink, transition:'all 0.15s' }}>
                      {b}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ height:1, background:T.hairline, marginBottom:18 }} />

            {/* Note */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:8 }}>Observações</div>
              <textarea
                style={{ width:'100%', minHeight:88, background:T.bgWash, borderRadius:14,
                  padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
                  border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
                placeholder="Escreva uma nota livre..."
                value={note} onChange={e => setNote(e.target.value)} />
            </div>

            <div style={{ height:1, background:T.hairline, marginBottom:18 }} />

            {/* Previous entries */}
            {diaryEntries.filter(e => e.date !== today).length > 0 && (
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:10 }}>Registros anteriores</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {diaryEntries
                    .filter(e => e.date !== today)
                    .slice(0, 5)
                    .map(e => (
                      <div key={e.id} style={{ display:'flex', alignItems:'center', gap:10,
                        background:T.bgWash, borderRadius:12, padding:'10px 14px' }}>
                        <span style={{ fontSize:20 }}>{MOODS[e.mood ?? 3]}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{e.date}</div>
                          {e.note && <div style={{ fontSize:11, color:T.inkSoft, marginTop:2,
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                            maxWidth:200 }}>{e.note}</div>}
                        </div>
                        <div style={{ fontSize:11, color:T.inkMute }}>
                          {APPETITE[e.appetite ?? 1]}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activePet && (
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
          background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
          <button onClick={handleSave} className="btn-press" style={{
            width:'100%', height:52, borderRadius:100, border:'none',
            background: saved ? '#22C55E' : T.brand,
            color:'#fff', fontSize:16, fontWeight:700,
            fontFamily:FONT_BODY, cursor:'pointer',
            transition:'background 0.3s' }}>
            {saved ? '✓ Salvo!' : existingEntry ? 'Atualizar registro' : 'Salvar registro'}
          </button>
        </div>
      )}
    </div>
  );
}
