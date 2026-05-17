import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const MEALS = [
  { e:'🌅', label:'Café da manhã', time:'07:00', portion:'120g', done:true },
  { e:'☀️', label:'Almoço', time:'12:00', portion:'120g', done:true },
  { e:'🌙', label:'Jantar', time:'18:30', portion:'80g', done:false },
];

const WEEK = ['S','T','Q','Q','S','S','D'];
const VALS = [0.9, 1.0, 0.85, 1.0, 1.0, 0.7, 0.8];

function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{
      width:44, height:24, borderRadius:12, position:'relative', cursor:'pointer',
      background: on ? T.brand : '#D0CDD7', transition:'background 0.22s' }}>
      <div style={{ position:'absolute', top:2, left: on?22:2, width:20, height:20,
        borderRadius:10, background:'#fff', transition:'left 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow:'0 1px 4px rgba(0,0,0,0.18)' }} />
    </div>
  );
}

export default function Feeding() {
  const { back } = useNav();
  const [meals, setMeals] = useState(MEALS);
  const [supps, setSupps] = useState([
    { n:'Ômega 3', dose:'5ml · diário', on:true },
    { n:'Probiótico', dose:'1 sachê · 2×/sem', on:false },
  ]);

  const toggle = i => {
    setMeals(ms => ms.map((m, j) => j===i ? { ...m, done:!m.done } : m));
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Alimentação</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
        {/* Ration card */}
        <div style={{ background:T.surface, borderRadius:20, padding:20, marginBottom:16,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:4 }}>
            🥣 Ração Premium · 3kg
          </div>
          <div style={{ fontSize:13, color:T.inkSoft, marginBottom:12 }}>1.4 kg restando</div>
          <div style={{ height:12, background:T.bgWash, borderRadius:6, marginBottom:8, overflow:'hidden' }}>
            <div style={{ height:12, width:'46%', background:'#F59E0B', borderRadius:6 }} />
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px',
            background:'#FEF3C7', borderRadius:99, fontSize:12, fontWeight:700, color:'#92400E' }}>
            ⚠️ Estoque baixo — pedir em breve
          </div>
        </div>

        {/* Meals */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Refeições de hoje</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {meals.map((m, i) => (
            <div key={i} onClick={() => toggle(i)} style={{
              background:T.surface, borderRadius:16, padding:'14px 16px',
              display:'flex', alignItems:'center', gap:12, cursor:'pointer',
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:24 }}>{m.e}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{m.label}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>{m.time} · {m.portion}</div>
              </div>
              <div style={{ width:28, height:28, borderRadius:14,
                background: m.done ? '#DCFCE7' : T.bgWash,
                border: `1.5px solid ${m.done ? '#16A34A' : T.hairlineStrong}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700, color:'#16A34A', transition:'all 0.15s' }}>
                {m.done ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:12 }}>Consumo semanal</div>
        <div style={{ background:T.surface, borderRadius:20, padding:'16px 16px 12px',
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:68, marginBottom:8 }}>
            {VALS.map((v, i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ width:'100%', borderRadius:'4px 4px 0 0',
                  height: Math.round(v * 60),
                  background: i===4 ? T.brand : T.brandSoft,
                  transition:'height 0.4s' }} />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {WEEK.map((d, i) => (
              <div key={i} style={{ flex:1, textAlign:'center', fontSize:11,
                fontWeight: i===4?700:500, color: i===4?T.brand:T.inkSoft }}>{d}</div>
            ))}
          </div>
        </div>

        {/* Supplements */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Suplementos</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
          {supps.map((s, i) => (
            <div key={i} style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
              display:'flex', alignItems:'center', boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{s.n}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>{s.dose}</div>
              </div>
              <Toggle on={s.on} onChange={v => setSupps(ss => ss.map((x,j) => j===i?{...x,on:v}:x))} />
            </div>
          ))}
        </div>

        {/* Diet banner */}
        <div style={{ background:T.brandSoft, borderRadius:16, padding:'14px 16px',
          display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:24 }}>🥗</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Dieta ativa: Ração Premium</div>
            <div style={{ fontSize:12, color:T.inkSoft }}>3 refeições · 320g/dia</div>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:T.brand, cursor:'pointer' }}>Ver dieta</div>
        </div>
      </div>
    </div>
  );
}
