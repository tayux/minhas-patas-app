import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, IconBtn, Eyebrow, Display } from '../components/Shared.jsx';

const TINT_MAP = {
  tintLavender: T.tintLavender,
  tintSky:      T.tintSky,
  tintMint:     T.tintMint,
  tintPeach:    T.tintPeach,
  tintRose:     T.tintRose,
  tintCream:    T.tintCream,
};

export default function Meds() {
  const { nav, back } = useNav();
  const { activePet, medications, addMedication } = usePet();
  const [filter, setFilter] = useState('Ativos');
  const [localMeds, setLocalMeds] = useState(() => medications.map(m => ({ ...m })));

  // Sync localMeds when medications changes (e.g. after adding)
  // We keep on/off toggle local so it's fast
  const [toggleMap, setToggleMap] = useState({});
  const toggle = (id) => setToggleMap(prev => ({ ...prev, [id]: !(prev[id] ?? true) }));
  const isOn = (m) => toggleMap[m.id] !== undefined ? toggleMap[m.id] : m.on;

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>💊</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Nenhum medicamento</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para gerenciar os medicamentos.
        </div>
      </div>
    </div>
  );

  const active = medications.filter(m => isOn(m));
  const done   = medications.filter(m => !isOn(m));
  const filtered = filter === 'Ativos' ? active
                 : filter === 'Concluídos' ? done
                 : medications;

  if (medications.length === 0) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <IconBtn icon={I.plus} onClick={() => nav('addmedication')} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:64 }}>💊</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>
          Nenhum medicamento ainda
        </div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Registre os medicamentos e tratamentos do seu pet para acompanhar as doses diárias.
        </div>
        <button onClick={() => nav('addmedication')} style={{
          marginTop:8, padding:'12px 28px', borderRadius:99,
          background:T.brand, color:'#fff', border:'none',
          fontSize:15, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
          + Adicionar medicamento
        </button>
      </div>
    </div>
  );

  const filterTabs = [
    { l:'Ativos', n: active.length },
    { l:'Concluídos', n: done.length },
    { l:'Todos', n: medications.length },
  ];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:T.inkMute, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase' }}>pet</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink, display:'flex', alignItems:'center', gap:4 }}>
            {activePet.name} <Icon d={I.chevD} size={12} color={T.inkSoft} stroke={2.2} />
          </div>
        </div>
        <IconBtn icon={I.plus} onClick={() => nav('addmedication')} />
      </div>
      <div style={{ padding:'24px 24px 0' }}>
        <Eyebrow>Medicamentos</Eyebrow>
        <Display size={44} weight={400} style={{ marginTop:8 }}>
          Tratamento<br /><span style={{ fontStyle:'italic' }}>de {activePet.name}</span>
        </Display>
        <div style={{ fontSize:14, color:T.inkSoft, marginTop:10 }}>
          {active.length} {active.length === 1 ? 'ativo' : 'ativos'}
          {active.length > 0 && ` · próxima dose às ${medications[0]?.startDate || '—'}`}
        </div>
      </div>
      <div style={{ display:'flex', gap:8, padding:'22px 24px 4px', overflowX:'auto' }}>
        {filterTabs.map((f, i) => {
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
      {filtered.length > 0 && (
        <div style={{ padding:'18px 24px 0' }}>
          <SectionPill icon="⏱️" label={filter} count={filtered.length}
            tint={T.tintLavender} ink={T.tintLavenderInk} />
        </div>
      )}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 24px 96px', display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px', color:T.inkMute }}>
            <div style={{ fontSize:40 }}>🎉</div>
            <div style={{ fontWeight:700, color:T.ink, marginTop:8 }}>
              {filter === 'Concluídos' ? 'Nenhum tratamento concluído' : 'Nenhum medicamento nesta categoria'}
            </div>
          </div>
        ) : filtered.map((m) => {
          const tint = TINT_MAP[m.tintKey] || T.tintLavender;
          const on = isOn(m);
          return (
            <Card key={m.id} pad={14} radius={20}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <EmojiCircle emoji={m.emoji || '💊'} size={42} tint={tint} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:700, fontSize:15, color:T.ink }}>{m.name}</span>
                  </div>
                  <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>
                    {[m.dose, m.unit].filter(Boolean).join('')}
                    {m.freq ? ` · ${m.freq}` : ''}
                  </div>
                  {m.startDate && (
                    <div style={{ fontSize:12, color:T.brand, marginTop:6,
                      fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                      <Icon d={I.cal} size={12} color={T.brand} stroke={2} />
                      Início · {m.startDate}
                    </div>
                  )}
                </div>
                <div onClick={() => toggle(m.id)} style={{
                  width:40, height:24, borderRadius:99,
                  background: on ? T.brand : T.bgWash, position:'relative',
                  transition:'background 0.2s', cursor:'pointer' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff',
                    position:'absolute', top:2, left: on ? 18 : 2,
                    boxShadow:'0 1px 3px rgba(20,20,30,0.2)', transition:'left 0.2s' }} />
                </div>
              </div>
            </Card>
          );
        })}
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
