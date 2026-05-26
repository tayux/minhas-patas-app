import { useState, useMemo } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, Card, IconCircle, PetHeader } from '../components/Shared.jsx';

const MOODS     = ['😊','🙂','😐','😴','😰'];
const MOOD_LBLS = ['Ótimo','Bem','Ok','Cansado','Agitado'];
const DOW_PT    = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];

function todayDdmm() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// Returns [Mon, Tue, ..., Sun] Date objects for the current week
function currentWeekDates() {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + diff + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function ddmmToDate(str) {
  if (!str) return null;
  const [d, m, y] = str.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
}

function isSameDay(a, b) {
  return a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();
}

// ── Add Walk bottom sheet ───────────────────────────────────────────────────
function AddWalkSheet({ onSave, onCancel }) {
  const [duration, setDuration] = useState('30');
  const [distance, setDistance] = useState('');
  const [mood, setMood]         = useState(0);
  const [notes, setNotes]       = useState('');

  const handleSave = () => {
    const dur = parseInt(duration, 10);
    if (!dur || dur <= 0) return;
    onSave({ duration: dur, distance: distance ? parseFloat(distance) : null, mood, notes: notes.trim(), date: todayDdmm() });
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px', maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ fontSize:17, fontWeight:800, color:T.ink, marginBottom:20 }}>
          Registrar passeio
        </div>

        {/* Duration + Distance */}
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:8 }}>
              Duração (min) *
            </div>
            <input
              type="number" inputMode="numeric" value={duration}
              onChange={e => setDuration(e.target.value)}
              style={{ width:'100%', background:T.surface, border:`1.5px solid ${T.hairline}`,
                borderRadius:12, padding:'12px 14px', fontSize:16, fontWeight:700,
                color:T.ink, fontFamily:FONT_BODY, outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:8 }}>
              Distância (km)
            </div>
            <input
              type="number" inputMode="decimal" value={distance}
              onChange={e => setDistance(e.target.value)}
              placeholder="—"
              style={{ width:'100%', background:T.surface, border:`1.5px solid ${T.hairline}`,
                borderRadius:12, padding:'12px 14px', fontSize:16, fontWeight:700,
                color:T.ink, fontFamily:FONT_BODY, outline:'none', boxSizing:'border-box' }} />
          </div>
        </div>

        {/* Mood */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:10 }}>
            Como foi o humor?
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {MOODS.map((m, i) => (
              <div key={i} onClick={() => setMood(i)} style={{
                flex:1, display:'flex', flexDirection:'column', alignItems:'center',
                gap:4, padding:'10px 0', borderRadius:14, cursor:'pointer',
                background: mood===i ? T.brandSoft : T.surface,
                border: mood===i ? `1.5px solid ${T.brand}` : `1.5px solid ${T.hairline}`,
                transition:'all 0.15s' }}>
                <span style={{ fontSize:22 }}>{m}</span>
                <span style={{ fontSize:9, fontWeight:700, color: mood===i ? T.brand : T.inkMute }}>
                  {MOOD_LBLS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:8 }}>
            Observações
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Algo incomum? Rota favorita?"
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
            Salvar passeio
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function WalksActivities() {
  const { back } = useNav();
  const { activePet, walks, addWalk, deleteWalk, walkGoal } = usePet();
  const [showForm, setShowForm]   = useState(false);
  const [deleteId, setDeleteId]   = useState(null);

  const weekDates = useMemo(currentWeekDates, []);

  // Walks this week
  const thisWeekWalks = useMemo(() => {
    const mon = weekDates[0];
    const sun = weekDates[6];
    return walks.filter(w => {
      const d = ddmmToDate(w.date);
      return d && d >= mon && d <= sun;
    });
  }, [walks, weekDates]);

  const weekCount = thisWeekWalks.length;
  const progress  = Math.min(weekCount / walkGoal, 1);
  const circumference = 2 * Math.PI * 54; // r=54

  // Total stats
  const totalDuration = walks.reduce((s, w) => s + (w.duration || 0), 0);
  const totalDistance = walks.reduce((s, w) => s + (w.distance || 0), 0);

  const handleSave = (walk) => {
    addWalk(walk);
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteId) { deleteWalk(deleteId); setDeleteId(null); }
  };

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>🐾</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink }}>Nenhum pet selecionado</div>
      </div>
    </div>
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      {/* Header */}
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, flex:1 }}>Passeios & Atividades</div>
        <PetHeader />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 100px' }}>

        {/* Progress ring */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24 }}>
          <div style={{ position:'relative', width:150, height:150 }}>
            <svg width="150" height="150" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="75" cy="75" r="54" fill="none" stroke={T.brandSoft} strokeWidth="13" />
              <circle cx="75" cy="75" r="54" fill="none" stroke={T.brand} strokeWidth="13"
                strokeDasharray={`${progress * circumference} ${circumference}`}
                strokeLinecap="round"
                style={{ transition:'stroke-dasharray 0.6s ease' }} />
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontFamily:FONT_DISPLAY, fontSize:28, fontWeight:500, color:T.ink, lineHeight:1 }}>
                {weekCount}
                <span style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, fontWeight:600 }}>/{walkGoal}</span>
              </div>
              <div style={{ fontSize:11, color:T.inkSoft, marginTop:2 }}>esta semana</div>
            </div>
          </div>

          {/* Week dots */}
          <div style={{ display:'flex', gap:6, marginTop:14 }}>
            {weekDates.map((d, i) => {
              const hasWalk = thisWeekWalks.some(w => isSameDay(ddmmToDate(w.date) || new Date(0), d));
              const isToday = isSameDay(d, new Date());
              return (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ fontSize:10, fontWeight:600, color: isToday ? T.brand : T.inkMute }}>
                    {DOW_PT[i]}
                  </div>
                  <div style={{ width:30, height:30, borderRadius:15,
                    background: hasWalk ? T.brand : isToday ? T.brandSoft : T.bgWash,
                    border: isToday && !hasWalk ? `1.5px solid ${T.brand}` : 'none',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {hasWalk && <I.paw size={14} color='#fff' strokeWidth={2} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        {walks.length > 0 && (
          <div style={{ display:'flex', gap:10, marginBottom:20 }}>
            {[
              { icon: I.paw,   val: walks.length,    unit: 'passeios', tint: T.tintMint,   ink: T.tintMintInk },
              { icon: I.clock, val: totalDuration,   unit: 'min total', tint: T.tintSky,    ink: T.tintSkyInk },
              { icon: I.health,val: totalDistance > 0 ? `${totalDistance.toFixed(1)}` : '—',
                unit: 'km total', tint: T.tintLavender, ink: T.tintLavenderInk },
            ].map((s, i) => (
              <div key={i} style={{ flex:1, background:T.surface, borderRadius:16, padding:'12px 10px',
                textAlign:'center', boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
                <IconCircle icon={s.icon} size={28} tint={s.tint} color={s.ink}
                  style={{ margin:'0 auto 6px' }} />
                <div style={{ fontFamily:FONT_DISPLAY, fontSize:18, fontWeight:500, color:T.ink }}>
                  {s.val}
                </div>
                <div style={{ fontSize:10, color:T.inkSoft, fontWeight:600 }}>{s.unit}</div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {walks.length === 0 && (
          <div style={{ background:T.surface, borderRadius:20, padding:'32px 24px',
            textAlign:'center', marginBottom:20, boxShadow:'0 4px 20px rgba(20,20,30,0.06)' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🐾</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.ink, marginBottom:6 }}>
              Nenhum passeio ainda
            </div>
            <div style={{ fontSize:13, color:T.inkSoft, lineHeight:1.5, maxWidth:240, margin:'0 auto 16px' }}>
              Registre os passeios de {activePet.name} para acompanhar a atividade física semanal.
            </div>
          </div>
        )}

        {/* History */}
        {walks.length > 0 && (
          <>
            <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>
              Histórico de passeios
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[...walks].reverse().map((w) => (
                <Card key={w.id} pad={14} radius={18}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:46, height:46, borderRadius:12, background:T.brandSoft,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>
                      {MOODS[w.mood ?? 0]}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>
                        {w.duration} min
                        {w.distance ? ` · ${w.distance} km` : ''}
                      </div>
                      <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>
                        {w.date}
                        {w.notes ? ` · ${w.notes}` : ''}
                      </div>
                    </div>
                    <div onClick={() => setDeleteId(w.id)}
                      style={{ width:34, height:34, borderRadius:10, background:'#FEE2E2',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        cursor:'pointer', flexShrink:0 }}>
                      <I.trash size={15} color='#EF4444' strokeWidth={2} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FAB */}
      <div onClick={() => setShowForm(true)}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56,
          borderRadius:28, background:T.ink, display:'flex', alignItems:'center',
          justifyContent:'center', cursor:'pointer',
          boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)', zIndex:10 }}>
        <I.plus size={26} color='#fff' strokeWidth={2.2} />
      </div>

      {/* Add form */}
      {showForm && (
        <AddWalkSheet onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, padding:20 }}>
          <div style={{ background:T.bg, borderRadius:20, padding:'24px 20px', maxWidth:320, width:'100%' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
              <IconCircle icon={I.trash} size={52} tint='#FEE2E2' color='#EF4444' />
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:T.ink, textAlign:'center', marginBottom:6 }}>
              Remover passeio?
            </div>
            <div style={{ fontSize:13, color:T.inkSoft, textAlign:'center', marginBottom:20 }}>
              Este registro será excluído permanentemente.
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex:1, height:44, borderRadius:99,
                background:T.surface, color:T.ink, border:'none',
                fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleDelete} style={{ flex:1, height:44, borderRadius:99,
                background:'#EF4444', color:'#fff', border:'none',
                fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
