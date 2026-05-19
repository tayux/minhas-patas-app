import { useState } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, CheckBubble, IconBtn, Display, BottomNav } from '../components/Shared.jsx';

const DAYS = [
  { label:'Sábado',    date:'10 de maio, 2026', events:[
    { s:'m', time:'07:00', emoji:'🥣', tint:T.tintCream,    title:'Café da manhã',    sub:'Ração 80g',              done:true },
    { s:'a', time:'14:00', emoji:'🚶', tint:T.tintPeach,    title:'Passeio',          sub:'30 min · Parque',        done:true },
    { s:'n', time:'21:00', emoji:'🧴', tint:T.tintSky,      title:'Protetor hepático',sub:'2.5ml líquido',          done:true },
  ]},
  { label:'Domingo',   date:'11 de maio, 2026', events:[
    { s:'m', time:'07:00', emoji:'🥣', tint:T.tintCream,    title:'Café da manhã',    sub:'Ração 80g',              done:true },
    { s:'m', time:'08:00', emoji:'💊', tint:T.tintLavender, title:'Apoquel 16mg',     sub:'1 comprimido',           done:true },
    { s:'n', time:'22:00', emoji:'🧴', tint:T.tintSky,      title:'Protetor hepático',sub:'2.5ml líquido',          done:true },
  ]},
  { label:'Segunda',   date:'12 de maio, 2026', events:[
    { s:'m', time:'07:00', emoji:'🥣', tint:T.tintCream,    title:'Café da manhã',    sub:'Ração 80g',              done:true },
    { s:'m', time:'08:00', emoji:'💊', tint:T.tintLavender, title:'Apoquel 16mg',     sub:'1 comprimido',           done:true },
    { s:'a', time:'10:30', emoji:'🩺', tint:T.tintRose,     title:'Consulta Dr. Henrique', sub:'CRMV 4821',        done:true },
    { s:'n', time:'22:00', emoji:'🧴', tint:T.tintSky,      title:'Protetor hepático',sub:'2.5ml líquido',          done:true },
  ]},
  { label:'Terça',     date:'13 de maio, 2026', events:[
    { s:'m', time:'07:00', emoji:'🥣', tint:T.tintCream,    title:'Café da manhã',    sub:'Ração 80g',              done:true },
    { s:'m', time:'08:00', emoji:'💊', tint:T.tintLavender, title:'Apoquel 16mg',     sub:'1 comprimido',           done:true },
    { s:'a', time:'15:00', emoji:'💊', tint:T.tintLavender, title:'Prednisolona 10mg',sub:'1 comp · após refeição', done:true },
    { s:'n', time:'18:00', emoji:'🦴', tint:T.tintPeach,    title:'Passeio da tarde', sub:'20 min',                 done:true },
    { s:'n', time:'22:00', emoji:'🧴', tint:T.tintSky,      title:'Protetor hepático',sub:'2.5ml líquido',          done:true },
  ]},
  { label:'Quarta',    date:'14 de maio, 2026', events:[
    { s:'m', time:'07:00', emoji:'🥣', tint:T.tintCream,    title:'Café da manhã',    sub:'Ração 80g',              done:true },
    { s:'m', time:'08:00', emoji:'💊', tint:T.tintLavender, title:'Apoquel 16mg',     sub:'1 comprimido',           done:true },
    { s:'a', time:'10:30', emoji:'🚶', tint:T.tintPeach,    title:'Passeio matinal',  sub:'30 min · Parque',        done:false, late:true },
    { s:'a', time:'12:30', emoji:'🥗', tint:T.tintMint,     title:'Almoço da Leia',   sub:'Sachê de frango',        done:false },
    { s:'a', time:'15:00', emoji:'💊', tint:T.tintLavender, title:'Prednisolona 10mg',sub:'1 comp · após refeição', done:false },
    { s:'n', time:'18:00', emoji:'🦴', tint:T.tintPeach,    title:'Passeio da tarde', sub:'20 min',                 done:false },
    { s:'n', time:'22:00', emoji:'🧴', tint:T.tintSky,      title:'Protetor hepático',sub:'2.5ml líquido',          done:false },
  ]},
  { label:'Quinta',    date:'15 de maio, 2026', events:[
    { s:'m', time:'07:00', emoji:'🥣', tint:T.tintCream,    title:'Café da manhã',    sub:'Ração 80g',              done:false },
    { s:'m', time:'08:00', emoji:'💊', tint:T.tintLavender, title:'Apoquel 16mg',     sub:'1 comprimido',           done:false },
    { s:'a', time:'15:00', emoji:'💊', tint:T.tintLavender, title:'Prednisolona 10mg',sub:'1 comp · após refeição', done:false },
    { s:'n', time:'22:00', emoji:'🧴', tint:T.tintSky,      title:'Protetor hepático',sub:'2.5ml líquido',          done:false },
  ]},
  { label:'Sexta',     date:'16 de maio, 2026', events:[
    { s:'m', time:'07:00', emoji:'🥣', tint:T.tintCream,    title:'Café da manhã',    sub:'Ração 80g',              done:false },
    { s:'a', time:'15:00', emoji:'💊', tint:T.tintLavender, title:'Prednisolona 10mg',sub:'1 comp · após refeição', done:false },
    { s:'a', time:'16:30', emoji:'🛁', tint:T.tintMint,     title:'Banho & tosa',     sub:'Pet shop Patas Felizes', done:false },
    { s:'n', time:'22:00', emoji:'🧴', tint:T.tintSky,      title:'Protetor hepático',sub:'2.5ml líquido',          done:false },
  ]},
];

const TODAY_IDX = 4; // Quarta, 14 maio

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
  const { nav } = useNav();
  const { activePet } = usePet();
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
  const [dayIdx, setDayIdx] = useState(TODAY_IDX);
  const [allEvents, setAllEvents] = useState(() =>
    DAYS.map(d => ({ ...d, events: d.events.map(e => ({ ...e })) }))
  );

  const day = allEvents[dayIdx];
  const events = day.events;
  const toggle = (evtIdx) => {
    setAllEvents(prev => prev.map((d, di) => di !== dayIdx ? d : {
      ...d, events: d.events.map((e, ei) =>
        ei !== evtIdx ? e : { ...e, done: !e.done, late: e.done ? e.late : false }
      )
    }));
  };

  const morning   = events.map((e,i) => ({...e,i})).filter(e => e.s==='m');
  const afternoon = events.map((e,i) => ({...e,i})).filter(e => e.s==='a');
  const night     = events.map((e,i) => ({...e,i})).filter(e => e.s==='n');
  const doneCount = events.filter(e => e.done).length;
  const isToday   = dayIdx === TODAY_IDX;

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px',
          borderRadius:99, background:T.surface, fontWeight:700, fontSize:13,
          color:T.ink, fontFamily:FONT_BODY,
          boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 4px 12px -6px rgba(20,20,30,0.10)' }}>
          {doneCount === events.length ? '🎉' : '📋'} {doneCount}/{events.length}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <IconBtn icon={I.cal} className="btn-press" onClick={() => nav('calendar')} />
          <IconBtn icon={I.plus} className="btn-press" onClick={() => nav('addmedication')} />
        </div>
      </div>

      {/* Date header with navigation */}
      <div style={{ padding:'30px 24px 0', textAlign:'center', position:'relative' }}>
        <button onClick={() => setDayIdx(i => Math.max(0, i-1))} className="btn-press"
          style={{ position:'absolute', left:24, top:38, background:'none', border:'none', padding:8,
            opacity: dayIdx === 0 ? 0.2 : 1, cursor: dayIdx === 0 ? 'default' : 'pointer' }}>
          <Icon d={I.chevL} size={22} color={T.ink} stroke={2} />
        </button>
        <button onClick={() => setDayIdx(i => Math.min(DAYS.length-1, i+1))} className="btn-press"
          style={{ position:'absolute', right:24, top:38, background:'none', border:'none', padding:8,
            opacity: dayIdx === DAYS.length-1 ? 0.2 : 1, cursor: dayIdx === DAYS.length-1 ? 'default' : 'pointer' }}>
          <Icon d={I.chevR} size={22} color={T.ink} stroke={2} />
        </button>
        <div onClick={() => nav('calendar')} style={{ cursor:'pointer', display:'inline-block' }}>
          <Display size={56} weight={400}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {day.label}
            {isToday && (
              <span style={{ fontSize:12, fontFamily:FONT_BODY, fontWeight:700, letterSpacing:0.8,
                textTransform:'uppercase', padding:'4px 10px', borderRadius:99,
                background:T.brandSoft, color:T.brand, verticalAlign:'middle' }}>hoje</span>
            )}
          </Display>
          <div style={{ fontSize:16, color:T.inkSoft, marginTop:6 }}>{day.date}</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'22px 24px 16px' }}>
        <SectionPill icon="🌅" label="Manhã" count={morning.length} tint={T.tintPeach} ink={T.tintPeachInk} />
        <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 22px' }}>
          {morning.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)} />)}
        </div>
        <SectionPill icon="☀️" label="Tarde" count={afternoon.length} tint={T.tintLavender} ink={T.tintLavenderInk} />
        <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 22px' }}>
          {afternoon.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)} />)}
        </div>
        <SectionPill icon="🌙" label="Noite" count={night.length} tint={T.tintSky} ink={T.tintSkyInk} />
        <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 0' }}>
          {night.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)} />)}
        </div>
      </div>
      <BottomNav active="today" />
    </div>
  );
}
