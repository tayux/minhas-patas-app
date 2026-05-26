import { useState, useMemo } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, IconCircle, PetHeader } from '../components/Shared.jsx';

const MOODS     = ['😴','😐','🙂','😊','🤩','😰'];
const MOOD_LBLS = ['Sonolento','Neutro','Bem','Feliz','Animado','Ansioso'];
const APPETITE  = ['Pouco','Normal','Muito'];
const BEHAVIORS = ['Letárgica','Vomitou','Coceira','Bebeu muito','Agitada','Latiu mais','Coçando','Tremeu'];
const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DOW_PT    = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function toDdmm(date) {
  return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`;
}
function parseDdmm(str) {
  if (!str) return null;
  const [d, m, y] = str.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
}

// ── Entry bottom sheet ───────────────────────────────────────────────────────
function EntrySheet({ date, existing, onSave, onCancel }) {
  const [mood,     setMood]     = useState(existing?.mood ?? 3);
  const [appetite, setAppetite] = useState(existing?.appetite ?? 1);
  const [selected, setSelected] = useState(() => new Set(existing?.behaviors ?? []));
  const [note,     setNote]     = useState(existing?.note ?? '');

  const toggle = i => {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  };

  const handleSave = () => {
    onSave({ date, mood, appetite, behaviors: Array.from(selected), note: note.trim() });
  };

  const d = parseDdmm(date);
  const label = d
    ? `${DOW_PT[d.getDay()]}, ${d.getDate()} ${MONTHS_PT[d.getMonth()].slice(0,3).toLowerCase()}.`
    : date;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'20px 20px 40px', maxHeight:'88vh', overflowY:'auto' }}>

        {/* Handle bar */}
        <div style={{ width:40, height:4, background:T.hairline, borderRadius:2,
          margin:'0 auto 16px' }} />

        <div style={{ fontSize:13, fontWeight:700, color:T.inkSoft, marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:18, fontWeight:800, color:T.ink, marginBottom:20 }}>
          {existing ? 'Editar registro' : 'Registrar comportamento'}
        </div>

        {/* Mood */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:10 }}>HUMOR</div>
          <div style={{ display:'flex', gap:6 }}>
            {MOODS.map((m, i) => (
              <div key={i} onClick={() => setMood(i)} style={{
                flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                padding:'10px 0', borderRadius:12, cursor:'pointer',
                background: mood===i ? T.brandSoft : T.surface,
                border: mood===i ? `1.5px solid ${T.brand}` : `1.5px solid transparent`,
                transition:'all 0.15s' }}>
                <span style={{ fontSize:20 }}>{m}</span>
                <span style={{ fontSize:8, fontWeight:700,
                  color: mood===i ? T.brand : T.inkMute }}>{MOOD_LBLS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appetite */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:10 }}>APETITE</div>
          <div style={{ display:'flex', gap:8 }}>
            {APPETITE.map((a, i) => (
              <div key={i} onClick={() => setAppetite(i)} style={{
                flex:1, textAlign:'center', padding:'10px 0', borderRadius:10, cursor:'pointer',
                background: appetite===i ? T.brandSoft : T.surface,
                border: appetite===i ? `1.5px solid ${T.brand}` : `1.5px solid ${T.hairline}`,
                fontSize:13, fontWeight: appetite===i ? 700 : 500,
                color: appetite===i ? T.brand : T.inkSoft }}>
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Behaviors */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:10 }}>
            COMPORTAMENTOS INCOMUNS
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {BEHAVIORS.map((b, i) => {
              const active = selected.has(i);
              return (
                <div key={i} onClick={() => toggle(i)} style={{
                  padding:'6px 14px', borderRadius:100, cursor:'pointer',
                  background: active ? T.brandSoft : T.surface,
                  border: active ? `1px solid ${T.brand}` : `1px solid ${T.hairline}`,
                  fontSize:12, fontWeight: active ? 700 : 500,
                  color: active ? T.brand : T.ink }}>
                  {b}
                </div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:8 }}>OBSERVAÇÕES</div>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Escreva uma nota livre..."
            style={{ width:'100%', minHeight:72, background:T.surface,
              border:`1.5px solid ${T.hairline}`, borderRadius:12,
              padding:'12px 14px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
              outline:'none', resize:'none', boxSizing:'border-box' }} />
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button onClick={onCancel} style={{ flex:1, height:48, borderRadius:99,
            background:T.surface, color:T.ink, border:'none',
            fontSize:15, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Cancelar
          </button>
          <button onClick={handleSave} style={{ flex:2, height:48, borderRadius:99,
            background:T.brand, color:'#fff', border:'none',
            fontSize:15, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
            {existing ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Calendar ─────────────────────────────────────────────────────────────────
function MonthCalendar({ year, month, entries, selectedDate, onSelectDate }) {
  const today    = new Date();
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const startOff = firstDow; // grid starts on Sun
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Build set of dates that have entries
  const entryDates = useMemo(() => new Set(entries.map(e => e.date)), [entries]);

  const cells = [];
  for (let i = 0; i < startOff; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div>
      {/* Day-of-week header */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)',
        marginBottom:4, gap:0 }}>
        {['D','S','T','Q','Q','S','S'].map((l, i) => (
          <div key={i} style={{ textAlign:'center', fontSize:11, fontWeight:700,
            color:T.inkMute, padding:'4px 0' }}>{l}</div>
        ))}
      </div>
      {/* Day cells */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px 0' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dt  = new Date(year, month, day);
          const str = toDdmm(dt);
          const isToday    = isSameDate(dt, today);
          const isSelected = str === selectedDate;
          const hasEntry   = entryDates.has(str);
          const isFuture   = dt > today;

          return (
            <div key={i} onClick={() => !isFuture && onSelectDate(str)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center',
                gap:3, padding:'6px 0', cursor: isFuture ? 'default' : 'pointer' }}>
              <div style={{
                width:32, height:32, borderRadius:16,
                background: isSelected ? T.brand : isToday ? T.brandSoft : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                border: isToday && !isSelected ? `1.5px solid ${T.brand}` : 'none',
              }}>
                <span style={{ fontSize:13, fontWeight: isToday || isSelected ? 800 : 400,
                  color: isSelected ? '#fff' : isToday ? T.brand : isFuture ? T.inkFaint : T.ink }}>
                  {day}
                </span>
              </div>
              {/* Entry dot */}
              <div style={{ width:5, height:5, borderRadius:3,
                background: hasEntry ? T.brand : 'transparent' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isSameDate(a, b) {
  return a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function BehaviorDiary() {
  const { back } = useNav();
  const { activePet, diaryEntries, addDiaryEntry, updateDiaryEntry } = usePet();

  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDdmm(today));
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedEntry = diaryEntries.find(e => e.date === selectedDate);
  const isToday       = selectedDate === toDdmm(today);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    const maxYear  = today.getFullYear();
    const maxMonth = today.getMonth();
    if (viewYear > maxYear || (viewYear === maxYear && viewMonth >= maxMonth)) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const handleSave = (entry) => {
    if (selectedEntry) updateDiaryEntry(selectedEntry.id, entry);
    else addDiaryEntry(entry);
    setSheetOpen(false);
  };

  // Recent entries (last 5, excluding selected day preview)
  const recentEntries = [...diaryEntries]
    .sort((a, b) => {
      const da = parseDdmm(a.date), db = parseDdmm(b.date);
      return (db?.getTime() ?? 0) - (da?.getTime() ?? 0);
    })
    .slice(0, 6);

  const isAtMaxMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      {/* Header */}
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ flex:1, fontSize:17, fontWeight:700, color:T.ink }}>
          Diário de comportamento
        </div>
        <PetHeader />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 32px' }}>

        {/* Calendar card */}
        <div style={{ background:T.surface, borderRadius:20, padding:'16px 16px 12px',
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', marginBottom:16 }}>

          {/* Month nav */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div onClick={prevMonth}
              style={{ width:32, height:32, borderRadius:16, background:T.bgWash,
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <I.chevL size={16} color={T.inkSoft} strokeWidth={2} />
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:T.ink }}>
              {MONTHS_PT[viewMonth]} {viewYear}
            </div>
            <div onClick={nextMonth}
              style={{ width:32, height:32, borderRadius:16,
                background: isAtMaxMonth ? T.bgWash : T.bgWash,
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor: isAtMaxMonth ? 'default' : 'pointer',
                opacity: isAtMaxMonth ? 0.3 : 1 }}>
              <I.chevR size={16} color={T.inkSoft} strokeWidth={2} />
            </div>
          </div>

          <MonthCalendar
            year={viewYear}
            month={viewMonth}
            entries={diaryEntries}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Selected day panel */}
        <div style={{ background:T.surface, borderRadius:20, padding:18,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', marginBottom:16 }}>

          {/* Day label */}
          <div style={{ fontSize:13, fontWeight:700, color:T.inkSoft, marginBottom:4 }}>
            {(() => {
              const d = parseDdmm(selectedDate);
              if (!d) return selectedDate;
              return `${DOW_PT[d.getDay()]}, ${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`;
            })()}
          </div>

          {selectedEntry ? (
            /* Entry summary */
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <span style={{ fontSize:32 }}>{MOODS[selectedEntry.mood ?? 3]}</span>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:T.ink }}>
                    {MOOD_LBLS[selectedEntry.mood ?? 3]}
                  </div>
                  <div style={{ fontSize:12, color:T.inkSoft }}>
                    Apetite: {APPETITE[selectedEntry.appetite ?? 1]}
                  </div>
                </div>
              </div>

              {selectedEntry.behaviors?.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                  {selectedEntry.behaviors.map(i => (
                    <span key={i} style={{ padding:'4px 10px', borderRadius:99,
                      background:T.tintRose, color:T.tintRoseInk,
                      fontSize:11, fontWeight:700 }}>
                      {BEHAVIORS[i]}
                    </span>
                  ))}
                </div>
              )}

              {selectedEntry.note && (
                <div style={{ background:T.bgWash, borderRadius:12, padding:'10px 12px',
                  fontSize:13, color:T.ink, lineHeight:1.5, marginBottom:14 }}>
                  {selectedEntry.note}
                </div>
              )}

              <button onClick={() => setSheetOpen(true)} style={{
                width:'100%', height:44, borderRadius:99, border:`1.5px solid ${T.brand}`,
                background:'transparent', color:T.brand, fontSize:14, fontWeight:700,
                fontFamily:FONT_BODY, cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center', gap:8 }}>
                <I.edit size={15} strokeWidth={2} /> Editar registro
              </button>
            </div>
          ) : (
            /* No entry */
            <div style={{ textAlign:'center', padding:'16px 0' }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📝</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:4 }}>
                {isToday ? 'Como está hoje?' : 'Sem registro neste dia'}
              </div>
              <div style={{ fontSize:12, color:T.inkSoft, marginBottom:16, lineHeight:1.5 }}>
                {isToday
                  ? `Registre o humor, apetite e comportamento de ${activePet?.name ?? 'seu pet'} hoje.`
                  : 'Não é possível adicionar registros para datas passadas sem entrada.'}
              </div>
              {isToday && activePet && (
                <button onClick={() => setSheetOpen(true)} style={{
                  height:44, padding:'0 24px', borderRadius:99, border:'none',
                  background:T.brand, color:'#fff', fontSize:14, fontWeight:700,
                  fontFamily:FONT_BODY, cursor:'pointer' }}>
                  + Registrar hoje
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick action chips */}
        {isToday && activePet && (
          <div style={{ display:'flex', gap:10, marginBottom:16, overflowX:'auto', paddingBottom:2 }}>
            {[
              { icon: I.meds,     label:'Medicamentos', color:T.tintLavenderInk, tint:T.tintLavender },
              { icon: I.health,   label:'Saúde',        color:T.tintRoseInk,     tint:T.tintRose },
              { icon: I.paw,      label:'Passeio',      color:T.tintMintInk,     tint:T.tintMint },
              { icon: I.utensils, label:'Alimentação',  color:T.tintCreamInk,    tint:T.tintCream },
            ].map((c, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:7,
                padding:'8px 14px', borderRadius:99, background:T.surface, flexShrink:0,
                boxShadow:'0 2px 8px rgba(20,20,30,0.06)', cursor:'pointer',
                border:`1px solid ${T.hairline}` }}>
                <IconCircle icon={c.icon} size={22} tint={c.tint} color={c.color} />
                <span style={{ fontSize:12, fontWeight:700, color:T.ink }}>{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recent history */}
        {recentEntries.length > 0 && (
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:10 }}>
              Registros recentes
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {recentEntries.map(e => (
                <div key={e.id}
                  onClick={() => {
                    const d = parseDdmm(e.date);
                    if (d) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
                    setSelectedDate(e.date);
                  }}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                    background:T.surface, borderRadius:14, cursor:'pointer',
                    boxShadow:'0 1px 4px rgba(20,20,30,0.05)' }}>
                  <span style={{ fontSize:24 }}>{MOODS[e.mood ?? 3]}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{e.date}</div>
                    <div style={{ fontSize:11, color:T.inkSoft }}>
                      {MOOD_LBLS[e.mood ?? 3]} · {APPETITE[e.appetite ?? 1]}
                      {e.behaviors?.length > 0 ? ` · ${e.behaviors.length} comportamento(s)` : ''}
                    </div>
                  </div>
                  <I.chevR size={14} color={T.inkFaint} strokeWidth={2} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty history state */}
        {diaryEntries.length === 0 && !isToday && (
          <div style={{ textAlign:'center', padding:'32px 20px', color:T.inkMute }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🗓️</div>
            <div style={{ fontWeight:700, color:T.ink }}>Nenhum registro ainda</div>
            <div style={{ fontSize:12, marginTop:6 }}>
              Toque em hoje no calendário para começar.
            </div>
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      {sheetOpen && (
        <EntrySheet
          date={selectedDate}
          existing={selectedEntry}
          onSave={handleSave}
          onCancel={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
