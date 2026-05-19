import { useState } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, CheckBubble, IconBtn, Display, BottomNav } from '../components/Shared.jsx';

const TODAY_LABEL = 'Hoje';
const TODAY_DATE  = '18 de maio, 2026';

function TaskRow({ emoji, tint, time, title, sub, done, late, onToggle }) {
  return (
    <Card pad={14} radius={20} className="pressable"
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
        <CheckBubble done={done} onClick={onToggle} />
      </div>
    </Card>
  );
}

export default function Today() {
  const { nav, back } = useNav();
  const { activePet, medications } = usePet();

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

  // Build today's tasks from active medications
  const [doneMap, setDoneMap] = useState({});
  const toggleDone = (id) => setDoneMap(prev => ({ ...prev, [id]: !prev[id] }));

  const medTasks = medications.filter(m => m.on !== false).map((m, i) => ({
    id: `med_${m.id}`,
    emoji: m.emoji || '💊',
    tint: T.tintLavender,
    time: '--:--',
    title: m.name,
    sub: [m.dose, m.unit].filter(Boolean).join('') + (m.freq ? ` · ${m.freq}` : ''),
    s: 'm',
  }));

  const allTasks = medTasks; // Future: add walks, meals, etc.
  const doneCount = allTasks.filter(t => doneMap[t.id]).length;

  if (allTasks.length === 0) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ display:'flex', gap:8 }}>
          <IconBtn icon={I.cal} className="btn-press" onClick={() => nav('calendar')} />
          <IconBtn icon={I.plus} className="btn-press" onClick={() => nav('addmedication')} />
        </div>
      </div>
      <div style={{ padding:'30px 24px 0', textAlign:'center' }}>
        <Display size={56} weight={400}>{TODAY_LABEL}</Display>
        <div style={{ fontSize:16, color:T.inkSoft, marginTop:6 }}>{TODAY_DATE}</div>
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

  const morning   = allTasks.filter(t => t.s === 'm');
  const afternoon = allTasks.filter(t => t.s === 'a');
  const night     = allTasks.filter(t => t.s === 'n');

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ display:'flex', gap:8 }}>
          <IconBtn icon={I.cal} className="btn-press" onClick={() => nav('calendar')} />
          <IconBtn icon={I.plus} className="btn-press" onClick={() => nav('addmedication')} />
        </div>
      </div>

      <div style={{ padding:'30px 24px 0', textAlign:'center' }}>
        <Display size={56} weight={400}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {TODAY_LABEL}
          <span style={{ fontSize:12, fontFamily:FONT_BODY, fontWeight:700, letterSpacing:0.8,
            textTransform:'uppercase', padding:'4px 10px', borderRadius:99,
            background:T.brandSoft, color:T.brand, verticalAlign:'middle' }}>hoje</span>
        </Display>
        <div style={{ fontSize:16, color:T.inkSoft, marginTop:6 }}>{TODAY_DATE}</div>
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
                <TaskRow key={t.id} {...t} done={!!doneMap[t.id]} onToggle={() => toggleDone(t.id)} />
              ))}
            </div>
          </>
        )}
        {afternoon.length > 0 && (
          <>
            <SectionPill icon="☀️" label="Tarde" count={afternoon.length} tint={T.tintLavender} ink={T.tintLavenderInk} />
            <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 22px' }}>
              {afternoon.map(t => (
                <TaskRow key={t.id} {...t} done={!!doneMap[t.id]} onToggle={() => toggleDone(t.id)} />
              ))}
            </div>
          </>
        )}
        {night.length > 0 && (
          <>
            <SectionPill icon="🌙" label="Noite" count={night.length} tint={T.tintSky} ink={T.tintSkyInk} />
            <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 0' }}>
              {night.map(t => (
                <TaskRow key={t.id} {...t} done={!!doneMap[t.id]} onToggle={() => toggleDone(t.id)} />
              ))}
            </div>
          </>
        )}
        {morning.length > 0 && afternoon.length === 0 && night.length === 0 && (
          <div style={{ textAlign:'center', marginTop:8 }}>
            <div style={{ fontSize:12, color:T.inkMute }}>
              Todos os medicamentos aparecem pela manhã. Configure horários em cada medicamento para distribuí-los ao longo do dia.
            </div>
          </div>
        )}
      </div>
      <BottomNav active="today" />
    </div>
  );
}
