import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const DOW = ['S','T','Q','Q','S','S','D'];
const DONE_DAYS = [0,1,2];
const TODAY_IDX = 3;

const HISTORY = [
  { dur:'45 min', mood:'😊', date:'14/05', dist:'2.4 km' },
  { dur:'20 min', mood:'😐', date:'12/05', dist:'1.1 km' },
  { dur:'30 min', mood:'🙂', date:'10/05', dist:'1.6 km' },
];

export default function WalksActivities() {
  const { back } = useNav();
  const [walkMood, setWalkMood] = useState(0);
  const [duration, setDuration] = useState('30');

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Passeios & Atividades</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
        {/* Progress ring */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:20 }}>
          <div style={{ position:'relative', width:140, height:140 }}>
            <svg width="140" height="140" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r="54" fill="none" stroke={T.brandSoft} strokeWidth="12" />
              <circle cx="70" cy="70" r="54" fill="none" stroke={T.brand} strokeWidth="12"
                strokeDasharray={`${(3/5)*339.3} 339.3`} strokeLinecap="round" />
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:24, fontWeight:800, color:T.ink }}>3 / 5</div>
              <div style={{ fontSize:12, color:T.inkSoft }}>passeios</div>
              <div style={{ fontSize:11, color:T.inkMute }}>meta semanal</div>
            </div>
          </div>

          {/* Day dots */}
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            {DOW.map((d, i) => {
              const done = DONE_DAYS.includes(i);
              const today = i === TODAY_IDX;
              return (
                <div key={i} style={{ width:28, height:28, borderRadius:14,
                  background: done ? T.brand : today ? T.brandSoft : T.bgWash,
                  border: today ? `1.5px solid ${T.brand}` : 'none',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:700,
                  color: done ? '#fff' : today ? T.brand : T.inkSoft }}>
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick add */}
        <div style={{ background:T.surface, borderRadius:20, padding:20, marginBottom:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:14 }}>
            + Registrar passeio agora
          </div>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <div>
              <div style={{ fontSize:12, color:T.inkSoft, marginBottom:4 }}>Duração</div>
              <div style={{ background:T.bgWash, borderRadius:10, padding:'9px 12px',
                display:'flex', alignItems:'center', gap:4 }}>
                <input
                  style={{ width:44, border:'none', outline:'none', background:'transparent',
                    fontSize:14, fontWeight:700, color:T.ink, fontFamily:FONT_BODY, textAlign:'center' }}
                  value={duration} onChange={e => setDuration(e.target.value)}
                  inputMode="numeric" />
                <span style={{ fontSize:12, color:T.inkSoft, fontWeight:600 }}>min</span>
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:T.inkSoft, marginBottom:4 }}>Humor</div>
              <div style={{ display:'flex', gap:6 }}>
                {['😊','😐','😴'].map((m,i) => (
                  <div key={i} onClick={() => setWalkMood(i)} style={{
                    width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:20,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background: walkMood===i ? T.brandSoft : T.bgWash,
                    border: walkMood===i ? `1.5px solid ${T.brand}` : 'none',
                    transition:'all 0.15s' }}>{m}</div>
                ))}
              </div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:T.brand, cursor:'pointer' }}>+ Foto</div>
          </div>
        </div>

        {/* History */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Histórico de passeios</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {HISTORY.map((w, i) => (
            <div key={i} style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
              display:'flex', alignItems:'center', gap:12,
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ width:48, height:48, background:T.brandSoft, borderRadius:12,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
                {w.mood}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16, fontWeight:700, color:T.ink }}>{w.dur}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>{w.date} · {w.dist}</div>
              </div>
              <div style={{ width:56, height:52, background:T.brandSoft, borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🗺️</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
