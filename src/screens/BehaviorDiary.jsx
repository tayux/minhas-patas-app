import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I, PetHeader } from '../components/Shared.jsx';

const MOODS = ['😴','😐','🙂','😊','🤩','😰'];
const APPETITE = ['Pouco','Normal','Muito'];
const BEHAVIORS = ['Letárgica','Vomitou','Coceira','Bebeu muito','Agitada','Latiu mais','Coçando','Tremeu'];

export default function BehaviorDiary() {
  const { back } = useNav();
  const [mood, setMood] = useState(3);
  const [appetite, setAppetite] = useState(1);
  const [selected, setSelected] = useState(new Set([0, 2]));
  const [note, setNote] = useState('');

  const toggleBehavior = i => {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Diário de comportamento</div>
          <div style={{ fontSize:12, color:T.inkSoft }}>Quarta, 14 mai 2025</div>
        </div>
        <PetHeader />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 100px' }}>
        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', display:'flex', flexDirection:'column', gap:0 }}>

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

          {/* Photo strip */}
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:10 }}>Fotos do dia</div>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ width:68, height:68, background:T.brandSoft, borderRadius:12, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:26, fontWeight:700, color:T.brand }}>+</div>
              {[0,1].map(i => (
                <div key={i} style={{ width:68, height:68, background:T.bgWash, borderRadius:12,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🐾</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={back} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          Salvar registro
        </button>
      </div>
    </div>
  );
}
