import { useState, useEffect } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, CheckBubble, IconBtn, Display, BottomNav, PetHeader } from '../components/Shared.jsx';
import { markOccurrenceComplete, isCalendarConnected } from '../utils/googleCalendar.js';

const MONTHS_PT = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function todayBR() {
  const t = new Date();
  return `${String(t.getDate()).padStart(2,'0')}/${String(t.getMonth()+1).padStart(2,'0')}/${t.getFullYear()}`;
}
function todayLabel() {
  const t = new Date();
  return `${t.getDate()} de ${MONTHS_PT[t.getMonth()]}, ${t.getFullYear()}`;
}
function bucketFor(time) {
  const h = parseInt((time || '').split(':')[0], 10);
  if (isNaN(h)) return 'm';
  if (h < 12) return 'm';
  if (h < 18) return 'a';
  return 'n';
}

function TaskRow({ emoji, tint, time, title, sub, done, late, onToggle, onClick }) {
  return (
    <Card pad={14} radius={20} className="pressable"
      onClick={onClick}
      style={{ opacity: done ? 0.55 : 1, cursor:'pointer',
        transition:'opacity 0.2s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <EmojiCircle emoji={emoji} size={42} tint={tint} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
            <span style={{ fontWeight:700, fontSize:15, color:T.ink,
              textDecoration: done ? 'line-through' : 'none' }}>{title}</span>
            {late && !done && (
              <span style={{ fontSize:10, fontWeight:800, letterSpacing:0.8,
                textTransform:'uppercase', padding:'3px 8px', borderRadius:99,
                background:T.tintRose, color:T.tintRoseInk }}>atrasado</span>
            )}
          </div>
          <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{time} · {sub}</div>
        </div>
        <div onClick={e => { e.stopPropagation(); onToggle(); }}>
          <CheckBubble done={done} onClick={onToggle} />
        </div>
      </div>
    </Card>
  );
}

function MedDetailModal({ med, onClose, onSave, onDelete }) {
  const [name, setName]     = useState(med.name || '');
  const [dose, setDose]     = useState(med.dose || '');
  const [unit, setUnit]     = useState(med.unit || 'mg');
  const [freq, setFreq]     = useState(med.freq || '');
  const [times, setTimes]   = useState(Array.isArray(med.times) && med.times.length ? med.times : ['08:00']);
  const [notes, setNotes]   = useState(med.notes || '');
  const [confirm, setConfirm] = useState(false);

  const updateTime = (i, v) => setTimes(prev => prev.map((t, idx) => idx === i ? v : t));
  const addTimeSlot = () => setTimes(prev => [...prev, '12:00']);
  const removeTimeSlot = (i) => setTimes(prev => prev.filter((_, idx) => idx !== i));

  const save = () => {
    onSave({ name: name.trim(), dose, unit, freq, times, notes: notes.trim() });
    onClose();
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 28px', maxHeight:'92vh', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
          <EmojiCircle emoji={med.emoji || '💊'} size={48} tint={T.tintLavender} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.inkSoft,
              letterSpacing:0.8, textTransform:'uppercase' }}>Medicamento</div>
            <div style={{ fontSize:17, fontWeight:800, color:T.ink, marginTop:2 }}>{med.name}</div>
          </div>
          <div onClick={() => setConfirm(true)}
            style={{ width:36, height:36, borderRadius:12, background:'#FEE2E2',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', fontSize:16, flexShrink:0 }}>🗑️</div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:4 }}>Nome</div>
            <div style={{ background:T.bgWash, borderRadius:12, padding:'10px 14px' }}>
              <input value={name} onChange={e => setName(e.target.value)}
                style={{ width:'100%', border:'none', outline:'none', background:'transparent',
                  fontSize:14, color:T.ink, fontFamily:FONT_BODY, fontWeight:600 }} />
            </div>
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:4 }}>Dose</div>
              <div style={{ background:T.bgWash, borderRadius:12, padding:'10px 14px' }}>
                <input value={dose} onChange={e => setDose(e.target.value)}
                  style={{ width:'100%', border:'none', outline:'none', background:'transparent',
                    fontSize:14, color:T.ink, fontFamily:FONT_BODY }} />
              </div>
            </div>
            <div style={{ width:110 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:4 }}>Unidade</div>
              <div style={{ background:T.bgWash, borderRadius:12, padding:'10px 14px' }}>
                <input value={unit} onChange={e => setUnit(e.target.value)}
                  style={{ width:'100%', border:'none', outline:'none', background:'transparent',
                    fontSize:14, color:T.ink, fontFamily:FONT_BODY }} />
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:4 }}>Frequência</div>
            <div style={{ background:T.bgWash, borderRadius:12, padding:'10px 14px' }}>
              <input value={freq} onChange={e => setFreq(e.target.value)}
                style={{ width:'100%', border:'none', outline:'none', background:'transparent',
                  fontSize:14, color:T.ink, fontFamily:FONT_BODY }} />
            </div>
          </div>

          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontSize:12, fontWeight:700, color:T.inkSoft }}>⏰ Horários</span>
              <span onClick={addTimeSlot} style={{ fontSize:12, fontWeight:700, color:T.brand, cursor:'pointer' }}>
                + Adicionar
              </span>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {times.map((t, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:4,
                  background:T.brandSoft, borderRadius:99, padding:'4px 10px 4px 14px' }}>
                  <input type="time" value={t}
                    onChange={e => updateTime(i, e.target.value)}
                    style={{ border:'none', outline:'none', background:'transparent',
                      fontSize:14, fontWeight:700, color:T.brand, fontFamily:FONT_BODY,
                      width:76 }} />
                  {times.length > 1 && (
                    <div onClick={() => removeTimeSlot(i)}
                      style={{ width:22, height:22, borderRadius:'50%',
                        background:'rgba(255,255,255,0.6)', display:'flex',
                        alignItems:'center', justifyContent:'center', cursor:'pointer',
                        fontSize:14, fontWeight:700, color:T.brand, lineHeight:1 }}>×</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, marginBottom:4 }}>Observações</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              style={{ width:'100%', minHeight:64, background:T.bgWash, borderRadius:12,
                padding:'10px 14px', fontSize:13, color:T.ink, fontFamily:FONT_BODY,
                border:'none', outline:'none', resize:'none', boxSizing:'border-box' }} />
          </div>

          <div style={{ fontSize:11, color:T.inkMute, lineHeight:1.5 }}>
            {med.startDate && `Início: ${med.startDate}`}
            {med.endDate && ` · Fim: ${med.endDate}`}
            {med.continuous && ' · uso contínuo'}
          </div>
        </div>

        <div style={{ display:'flex', gap:10, marginTop:18 }}>
          <button onClick={onClose} style={{ flex:1, height:46, borderRadius:99,
            background:T.surface, color:T.ink, border:'none',
            fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Cancelar
          </button>
          <button onClick={save} style={{ flex:1.5, height:46, borderRadius:99,
            background:T.brand, color:'#fff', border:'none',
            fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Salvar alterações
          </button>
        </div>

        {confirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, padding:20 }}>
            <div style={{ background:T.bg, borderRadius:20, padding:'22px 20px', maxWidth:340, width:'100%' }}>
              <div style={{ fontSize:36, textAlign:'center', marginBottom:8 }}>🗑️</div>
              <div style={{ fontSize:16, fontWeight:800, color:T.ink, textAlign:'center', marginBottom:6 }}>
                Remover {med.name}?
              </div>
              <div style={{ fontSize:13, color:T.inkSoft, textAlign:'center', lineHeight:1.5, marginBottom:18 }}>
                O medicamento e seus lembretes no Google Calendar serão removidos.
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setConfirm(false)} style={{ flex:1, height:44, borderRadius:99,
                  background:T.surface, color:T.ink, border:'none',
                  fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
                  Cancelar
                </button>
                <button onClick={() => { onDelete(); onClose(); }} style={{ flex:1, height:44, borderRadius:99,
                  background:'#EF4444', color:'#fff', border:'none',
                  fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Today() {
  const { nav, back } = useNav();
  const { activePet, medications, updateMedication, deleteMedication } = usePet();

  const today = todayBR();
  const doneKey = activePet ? `mp_done_${activePet.id}_${today}` : null;
  const [doneMap, setDoneMap] = useState({});
  const [detail, setDetail] = useState(null);

  // Load done state for today (per pet) from localStorage
  useEffect(() => {
    if (!doneKey) { setDoneMap({}); return; }
    try {
      const raw = localStorage.getItem(doneKey);
      setDoneMap(raw ? JSON.parse(raw) : {});
    } catch {
      setDoneMap({});
    }
  }, [doneKey]);

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>📅</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Nenhuma agenda ainda</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Adicione um pet para ver a rotina diária aqui.
        </div>
      </div>
      <BottomNav active="today" />
    </div>
  );

  // Expand each medication into one task per scheduled time.
  const activeMeds = medications.filter(m => m.on !== false);
  const allTasks = [];
  activeMeds.forEach(m => {
    const times = Array.isArray(m.times) && m.times.length > 0 ? m.times : ['--:--'];
    times.forEach(time => {
      allTasks.push({
        id: `med_${m.id}_${time}`,
        medId: m.id,
        time,
        emoji: m.emoji || '💊',
        tint: T.tintLavender,
        title: m.name,
        sub: [m.dose, m.unit].filter(Boolean).join('') + (m.freq ? ` · ${m.freq}` : ''),
        s: bucketFor(time),
        gcalEventId: m.gcalEventIds?.[time] || null,
        med: m,
      });
    });
  });
  allTasks.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const toggleDone = (task) => {
    setDoneMap(prev => {
      const next = { ...prev, [task.id]: !prev[task.id] };
      if (doneKey) {
        try { localStorage.setItem(doneKey, JSON.stringify(next)); } catch {}
      }
      // Sync to Google Calendar if connected and we have an event ID
      if (task.gcalEventId && isCalendarConnected()) {
        markOccurrenceComplete({
          eventId: task.gcalEventId,
          brDate: today,
          time: task.time,
          complete: !prev[task.id],
        }).catch(() => {});
      }
      return next;
    });
  };

  const handleEdit = (med, patch) => {
    updateMedication(med.id, patch);
  };

  const handleDelete = (med) => {
    deleteMedication(med.id);
  };

  const doneCount = allTasks.filter(t => doneMap[t.id]).length;
  const morning   = allTasks.filter(t => t.s === 'm');
  const afternoon = allTasks.filter(t => t.s === 'a');
  const night     = allTasks.filter(t => t.s === 'n');

  if (allTasks.length === 0) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <PetHeader />
        <div style={{ display:'flex', gap:8 }}>
          <IconBtn icon={I.cal} className="btn-press" onClick={() => nav('calendar')} />
          <IconBtn icon={I.plus} className="btn-press" onClick={() => nav('addmedication')} />
        </div>
      </div>
      <div style={{ padding:'30px 24px 0', textAlign:'center' }}>
        <Display size={56} weight={400}>Hoje</Display>
        <div style={{ fontSize:16, color:T.inkSoft, marginTop:6 }}>{todayLabel()}</div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:'0 32px 80px', textAlign:'center' }}>
        <div style={{ fontSize:64 }}>📋</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>
          Nenhuma tarefa ainda
        </div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Adicione medicamentos, passeios e refeições para montar a rotina diária do seu pet.
        </div>
        <button onClick={() => nav('addmedication')} style={{
          marginTop:8, padding:'12px 28px', borderRadius:99,
          background:T.brand, color:'#fff', border:'none',
          fontSize:15, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
          + Adicionar medicamento
        </button>
      </div>
      <BottomNav active="today" />
    </div>
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <PetHeader />
        <div style={{ display:'flex', gap:8 }}>
          <IconBtn icon={I.cal} className="btn-press" onClick={() => nav('calendar')} />
          <IconBtn icon={I.plus} className="btn-press" onClick={() => nav('addmedication')} />
        </div>
      </div>

      <div style={{ padding:'30px 24px 0', textAlign:'center' }}>
        <Display size={56} weight={400}>Hoje</Display>
        <div style={{ fontSize:16, color:T.inkSoft, marginTop:6 }}>{todayLabel()}</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px',
          borderRadius:99, background:T.surface, fontWeight:700, fontSize:13,
          color:T.ink, fontFamily:FONT_BODY, marginTop:12,
          boxShadow:'0 1px 2px rgba(20,20,30,0.04)' }}>
          {doneCount === allTasks.length ? '🎉' : '📋'} {doneCount}/{allTasks.length}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'22px 24px 16px' }}>
        {morning.length > 0 && (
          <>
            <SectionPill icon="🌅" label="Manhã" count={morning.length} tint={T.tintPeach} ink={T.tintPeachInk} />
            <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 22px' }}>
              {morning.map(t => (
                <TaskRow key={t.id} {...t} done={!!doneMap[t.id]}
                  onToggle={() => toggleDone(t)}
                  onClick={() => setDetail(t.med)} />
              ))}
            </div>
          </>
        )}
        {afternoon.length > 0 && (
          <>
            <SectionPill icon="☀️" label="Tarde" count={afternoon.length} tint={T.tintLavender} ink={T.tintLavenderInk} />
            <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 22px' }}>
              {afternoon.map(t => (
                <TaskRow key={t.id} {...t} done={!!doneMap[t.id]}
                  onToggle={() => toggleDone(t)}
                  onClick={() => setDetail(t.med)} />
              ))}
            </div>
          </>
        )}
        {night.length > 0 && (
          <>
            <SectionPill icon="🌙" label="Noite" count={night.length} tint={T.tintSky} ink={T.tintSkyInk} />
            <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 0' }}>
              {night.map(t => (
                <TaskRow key={t.id} {...t} done={!!doneMap[t.id]}
                  onToggle={() => toggleDone(t)}
                  onClick={() => setDetail(t.med)} />
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav active="today" />

      {detail && (
        <MedDetailModal
          med={detail}
          onClose={() => setDetail(null)}
          onSave={(patch) => handleEdit(detail, patch)}
          onDelete={() => handleDelete(detail)}
        />
      )}
    </div>
  );
}
