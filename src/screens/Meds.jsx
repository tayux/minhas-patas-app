import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, IconBtn, Eyebrow, Display } from '../components/Shared.jsx';

export default function Meds() {
  const { nav, back } = useNav();
  const [filter, setFilter] = useState('Ativos');
  const [meds, setMeds] = useState([
    { name:'Prednisolona',      dose:'10mg · 1x ao dia',    next:'15:00', emoji:'💊', tint:T.tintLavender, on:true },
    { name:'Apoquel',           dose:'16mg · diário',       next:'08:00', emoji:'💊', tint:T.tintLavender, on:true, late:true },
    { name:'Protetor hepático', dose:'2.5ml · 2x ao dia',  next:'21:00', emoji:'🧴', tint:T.tintSky,      on:true },
    { name:'Suplemento Ômega',  dose:'1 cápsula · diário',  next:'12:00', emoji:'🐟', tint:T.tintPeach,    on:true },
    { name:'Antibiótico',       dose:'500mg · 3x ao dia',   next:'amanhã 07:00', emoji:'💊', tint:T.tintMint, on:false },
  ]);
  const filtered = filter === 'Concluídos' ? [] : meds;
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:T.inkMute, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase' }}>pet</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink, display:'flex', alignItems:'center', gap:4 }}>
            Leia <Icon d={I.chevD} size={12} color={T.inkSoft} stroke={2.2} />
          </div>
        </div>
        <IconBtn icon={I.plus} />
      </div>
      <div style={{ padding:'24px 24px 0' }}>
        <Eyebrow>Medicamentos</Eyebrow>
        <Display size={44} weight={400} style={{ marginTop:8 }}>
          Tratamento<br /><span style={{ fontStyle:'italic' }}>da Leia</span>
        </Display>
        <div style={{ fontSize:14, color:T.inkSoft, marginTop:10 }}>5 ativos · próxima dose às 15:00</div>
      </div>
      <div style={{ display:'flex', gap:8, padding:'22px 24px 4px', overflowX:'auto' }}>
        {[{l:'Ativos',n:5},{l:'Concluídos',n:12},{l:'Todos',n:17}].map((f,i) => {
          const a = filter === f.l;
          return (
            <div key={i} onClick={() => setFilter(f.l)} style={{ padding:'8px 14px', borderRadius:99,
              fontWeight:600, fontSize:13, flexShrink:0, fontFamily:FONT_BODY,
              background: a ? T.ink : T.surface, color: a ? '#fff' : T.ink,
              display:'flex', alignItems:'center', gap:6, cursor:'pointer',
              boxShadow: a ? 'none' : '0 1px 2px rgba(20,20,30,0.04)' }}>
              {f.l}
              <span style={{ padding:'1px 7px', borderRadius:99, fontSize:11,
                background: a ? 'rgba(255,255,255,0.18)' : T.bgWash,
                color: a ? '#fff' : T.inkSoft }}>{f.n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ padding:'18px 24px 0' }}>
        <SectionPill icon="⏱️" label="Ativos" count={5} tint={T.tintLavender} ink={T.tintLavenderInk} />
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 24px 96px', display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px', color:T.inkMute }}>
            <div style={{ fontSize:40 }}>🎉</div>
            <div style={{ fontWeight:700, color:T.ink, marginTop:8 }}>Nenhum tratamento concluído</div>
          </div>
        ) : filtered.map((m,i) => (
          <Card key={i} pad={14} radius={20}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <EmojiCircle emoji={m.emoji} size={42} tint={m.tint} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                  <span style={{ fontWeight:700, fontSize:15, color:T.ink }}>{m.name}</span>
                  {m.late && <span style={{ fontSize:10, fontWeight:800, letterSpacing:0.8,
                    textTransform:'uppercase', padding:'3px 8px', borderRadius:99,
                    background:T.tintRose, color:T.tintRoseInk }}>atrasado</span>}
                </div>
                <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{m.dose}</div>
                <div style={{ fontSize:12, color: m.late ? T.tintRoseInk : T.brand, marginTop:6,
                  fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                  <Icon d={I.cal} size={12} color={m.late ? T.tintRoseInk : T.brand} stroke={2} />
                  Próx · {m.next}
                </div>
              </div>
              <div onClick={() => setMeds(meds.map((x,idx) => idx===i ? {...x,on:!x.on} : x))} style={{
                width:40, height:24, borderRadius:99,
                background: m.on ? T.brand : T.bgWash, position:'relative',
                transition:'background 0.2s', cursor:'pointer' }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:2, left: m.on ? 18 : 2,
                  boxShadow:'0 1px 3px rgba(20,20,30,0.2)', transition:'left 0.2s' }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <button onClick={() => nav('ai')} style={{ position:'absolute', right:22, bottom:24,
        width:56, height:56, borderRadius:'50%', border:'none',
        background:T.ink, color:'#fff', cursor:'pointer',
        boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon d={I.scan} size={22} color="#fff" stroke={2} />
      </button>
    </div>
  );
}
