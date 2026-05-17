import { useState } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, Card, EmojiCircle, IconBtn, Eyebrow, Display, BottomNav } from '../components/Shared.jsx';

const WEEK = ['D','S','T','Q','Q','S','S'];

// May 2026: starts on Friday (index 5)
const MAY_START_DOW = 5;
const MAY_DAYS = 31;

const EVENTS = {
  5:  [{ emoji:'💊', tint:T.tintLavender, label:'Prednisolona 15:00' }],
  7:  [{ emoji:'🧴', tint:T.tintSky,      label:'Protetor hepático' }],
  9:  [{ emoji:'🥣', tint:T.tintCream,    label:'Ração especial' }],
  12: [{ emoji:'🩺', tint:T.tintRose,     label:'Consulta Dr. Henrique' }, { emoji:'💊', tint:T.tintLavender, label:'Prednisolona 10mg' }],
  14: [{ emoji:'💊', tint:T.tintLavender, label:'Prednisolona' }, { emoji:'🚶', tint:T.tintPeach, label:'Passeio da tarde' }],
  16: [{ emoji:'🛁', tint:T.tintMint,     label:'Banho & tosa' }, { emoji:'💊', tint:T.tintLavender, label:'Prednisolona' }],
  19: [{ emoji:'💉', tint:T.tintRose,     label:'Vacina antirrábica' }],
  22: [{ emoji:'🩺', tint:T.tintRose,     label:'Consulta retorno' }],
  26: [{ emoji:'🧴', tint:T.tintSky,      label:'Protetor hepático (fim)' }],
};

export default function Calendar() {
  const { back, nav } = useNav();
  const [selectedDay, setSelectedDay] = useState(14);

  const cells = [];
  for (let i = 0; i < MAY_START_DOW; i++) cells.push(null);
  for (let d = 1; d <= MAY_DAYS; d++) cells.push(d);

  const selectedEvents = EVENTS[selectedDay] || [];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} className="btn-press" />
        <div style={{ textAlign:'center' }}>
          <Eyebrow>calendário</Eyebrow>
        </div>
        <div style={{ width:40 }} />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 24px 24px' }}>
        {/* Month header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <IconBtn icon={I.chevL} size={34} className="btn-press" />
          <Display size={28} weight={400}>
            <span style={{ fontStyle:'italic' }}>Maio</span> 2026
          </Display>
          <IconBtn icon={I.chevR} size={34} className="btn-press" />
        </div>

        {/* Weekday headers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:8 }}>
          {WEEK.map((d,i) => (
            <div key={i} style={{ textAlign:'center', fontSize:11, fontWeight:700,
              color:T.inkMute, letterSpacing:0.8, padding:'4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px 0' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const hasEvents = !!EVENTS[day];
            const isSelected = day === selectedDay;
            const isToday = day === 14;
            return (
              <div key={i} onClick={() => setSelectedDay(day)}
                className="pressable"
                style={{ aspectRatio:'1', display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', borderRadius:12,
                  cursor:'pointer', position:'relative',
                  background: isSelected ? T.ink : isToday ? T.brandSoft : 'transparent' }}>
                <span style={{ fontSize:15, fontWeight: isSelected || isToday ? 700 : 500,
                  color: isSelected ? '#fff' : isToday ? T.brand : T.ink }}>
                  {day}
                </span>
                {hasEvents && !isSelected && (
                  <div style={{ display:'flex', gap:2, marginTop:2 }}>
                    {(EVENTS[day] || []).slice(0,3).map((_,j) => (
                      <div key={j} style={{ width:4, height:4, borderRadius:'50%',
                        background: isToday ? T.brand : T.inkFaint }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected day events */}
        <div style={{ marginTop:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            marginBottom:14 }}>
            <Eyebrow>{selectedDay} de maio</Eyebrow>
            {selectedDay === 14 && (
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99,
                background:T.brandSoft, color:T.brand }}>hoje</span>
            )}
          </div>
          {selectedEvents.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px 0', color:T.inkMute }}>
              <div style={{ fontSize:32 }}>✨</div>
              <div style={{ fontSize:14, fontWeight:600, marginTop:8, color:T.inkSoft }}>
                Dia livre! Aproveite.
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {selectedEvents.map((ev, i) => (
                <Card key={i} pad={14} radius={18} className="pressable"
                  onClick={() => nav('today')} style={{ cursor:'pointer',
                    display:'flex', alignItems:'center', gap:12 }}>
                  <EmojiCircle emoji={ev.emoji} size={38} tint={ev.tint} />
                  <span style={{ fontWeight:600, fontSize:14, color:T.ink }}>{ev.label}</span>
                  <div style={{ flex:1 }} />
                  <Icon d={I.chevR} size={16} color={T.inkFaint} stroke={2} />
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav active="today" />
    </div>
  );
}
