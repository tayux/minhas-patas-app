import { useState } from 'react';
import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, IconBtn, Eyebrow, Display, BottomNav } from '../components/Shared.jsx';

const MONTHS = [
  { key:'dez', label:'Dez', short:'Dez 2025', total: 980.00,  vs: -8 },
  { key:'jan', label:'Jan', short:'Jan 2026', total:1120.30,  vs:+14 },
  { key:'fev', label:'Fev', short:'Fev 2026', total:1890.40,  vs:+69, peak:true },
  { key:'mar', label:'Mar', short:'Mar 2026', total:1050.00,  vs:-44 },
  { key:'abr', label:'Abr', short:'Abr 2026', total:1418.40,  vs:+35 },
  { key:'mai', label:'Mai', short:'Mai 2026', total:1247.80,  vs:-12, current:true },
];

function BarChart({ months, selectedKey, peak, onSelect }) {
  const max = Math.max(...months.map(m => m.total));
  const H = 130;
  return (
    <div style={{ marginTop:16, paddingBottom:4 }}>
      <div style={{ position:'relative', height:H, width:'100%' }}>
        {[0.25,0.5,0.75].map((p,i) => (
          <div key={i} style={{ position:'absolute', left:0, right:0, top:H*(1-p),
            height:1, background:T.hairline }} />
        ))}
        <div style={{ position:'absolute', inset:0, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          {months.map(m => {
            const h = Math.max(6, (m.total/max)*(H-14));
            const isSel = m.key === selectedKey;
            const isPeak = peak && m.key === peak.key;
            const color = isSel ? T.ink : isPeak ? T.brand : T.bgWash;
            return (
              <div key={m.key} onClick={() => onSelect(m.key)} style={{ flex:1, display:'flex',
                flexDirection:'column', alignItems:'center', justifyContent:'flex-end',
                height:'100%', cursor:'pointer', position:'relative' }}>
                {isPeak && !isSel && (
                  <div style={{ position:'absolute', top:H-h-22, padding:'3px 7px', borderRadius:99,
                    background:T.brand, color:'#fff', fontSize:9, fontWeight:800,
                    letterSpacing:0.6, textTransform:'uppercase', whiteSpace:'nowrap' }}>pico</div>
                )}
                {isSel && (
                  <div style={{ position:'absolute', top:H-h-26, padding:'3px 8px', borderRadius:99,
                    background:T.ink, color:'#fff', fontSize:10, fontWeight:700,
                    whiteSpace:'nowrap' }}>R$ {Math.round(m.total/100)/10}k</div>
                )}
                <div style={{ width:'78%', maxWidth:32, height:h, borderRadius:8, background:color,
                  transition:'all 0.25s', boxShadow: isSel ? '0 4px 12px -4px rgba(20,20,30,0.25)':'none' }} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
        {months.map(m => (
          <div key={m.key} onClick={() => onSelect(m.key)} style={{ flex:1, textAlign:'center',
            fontSize:11, fontWeight:700, color: m.key===selectedKey ? T.ink : T.inkMute, cursor:'pointer' }}>
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Finance() {
  const { back, nav } = useNav();
  const { activePet, expenses } = usePet();
  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>💰</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Sem dados financeiros</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Adicione um pet para começar a registrar os gastos.
        </div>
      </div>
      <BottomNav active="finance" />
    </div>
  );
  const [selectedKey, setSelectedKey] = useState('mai');
  const selected = MONTHS.find(m => m.key === selectedKey);
  const prevIdx  = MONTHS.findIndex(m => m.key === selectedKey) - 1;
  const previous = prevIdx >= 0 ? MONTHS[prevIdx] : null;
  const peak = MONTHS.reduce((a,b) => b.total>a.total?b:a, MONTHS[0]);
  const avg  = MONTHS.reduce((s,m) => s+m.total, 0)/MONTHS.length;
  const segments = [
    { label:'Medicamentos', pct:43.5, color:T.brand },
    { label:'Consultas',    pct:30.5, color:'#5390B0' },
    { label:'Alimentação',  pct:19.7, color:'#D4A93A' },
    { label:'Outros',       pct: 6.3, color:'#5BA890' },
  ];
  const recentExpenses = [...expenses].sort((a,b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 10);
  const r = 46, circ = 2*Math.PI*r;
  let acc = 0;
  const fmt = v => v.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <IconBtn icon={I.search} />
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 16px' }}>
        <Eyebrow>panorama com a Leia</Eyebrow>
        <Display size={42} weight={400} style={{ marginTop:8 }}>Finanças</Display>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12, flexWrap:'wrap' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'7px 14px',
            borderRadius:99, background:T.surface, fontSize:13, fontWeight:600, color:T.ink,
            boxShadow:'0 1px 2px rgba(20,20,30,0.04)', fontFamily:FONT_BODY }}>
            2026 <Icon d={I.chevD} size={12} color={T.inkSoft} stroke={2.2} />
          </div>
          <div style={{ fontSize:12, color:T.inkSoft }}>
            média mensal <strong style={{ color:T.ink, fontWeight:700 }}>R$ {fmt(avg)}</strong>
          </div>
        </div>
        <Card pad={18} radius={24} style={{ marginTop:18 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
            <div>
              <Eyebrow>{selected.short}</Eyebrow>
              <div style={{ marginTop:6, display:'flex', alignItems:'baseline', gap:2 }}>
                <span style={{ fontFamily:FONT_DISPLAY, fontSize:14, color:T.inkSoft }}>R$</span>
                <span style={{ fontFamily:FONT_DISPLAY, fontSize:30, fontWeight:400, color:T.ink,
                  letterSpacing:-0.6, lineHeight:1, marginLeft:4 }}>{fmt(selected.total).split(',')[0]}</span>
                <span style={{ fontFamily:FONT_DISPLAY, fontSize:16, color:T.inkSoft }}>,{fmt(selected.total).split(',')[1]}</span>
              </div>
              <div style={{ fontSize:11, color:T.inkMute, marginTop:4 }}>toque numa barra para comparar</div>
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'5px 10px',
              borderRadius:99, background: selected.vs<=0 ? T.tintMint : T.tintRose,
              color: selected.vs<=0 ? T.tintMintInk : T.tintRoseInk,
              fontSize:11, fontWeight:800, flexShrink:0 }}>
              {selected.vs<=0?'↓':'↑'} {Math.abs(selected.vs)}%
            </div>
          </div>
          <BarChart months={MONTHS} selectedKey={selectedKey} peak={peak} onSelect={setSelectedKey} />
          <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
            borderRadius:14, background:T.surfaceLo }}>
            <span style={{ fontSize:18 }}>📈</span>
            <div style={{ flex:1, fontSize:12, color:T.inkSoft, lineHeight:1.4 }}>
              <strong style={{ color:T.ink, fontWeight:700 }}>{peak.short}</strong> foi seu mês mais caro<br />
              <span style={{ color:T.inkMute }}>R$ {fmt(peak.total)} · +{Math.round((peak.total/avg-1)*100)}% da média</span>
            </div>
          </div>
        </Card>
        {previous && (
          <Card pad={16} radius={22} style={{ marginTop:12 }}>
            <Eyebrow>comparativo</Eyebrow>
            <div style={{ display:'flex', alignItems:'stretch', gap:12, marginTop:10 }}>
              {[selected, previous].map((m,i) => (
                <div key={i} style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:T.inkMute, fontWeight:700, textTransform:'uppercase', letterSpacing:0.6 }}>{m.short}</div>
                  <div style={{ fontFamily:FONT_DISPLAY, fontSize:24, fontWeight:400,
                    color: i===0 ? T.ink : T.inkSoft, marginTop:4, letterSpacing:-0.4 }}>
                    R$ {fmt(m.total).split(',')[0]}
                    <span style={{ fontSize:14, color:T.inkSoft }}>,{fmt(m.total).split(',')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, fontSize:12, color:T.inkSoft, lineHeight:1.5 }}>
              {selected.total < previous.total
                ? <>Você economizou <strong style={{ color:T.tintMintInk }}>R$ {fmt(previous.total-selected.total)}</strong> em relação ao mês anterior 👏</>
                : <>Você gastou <strong style={{ color:T.tintRoseInk }}>R$ {fmt(selected.total-previous.total)}</strong> a mais que no mês anterior.</>
              }
            </div>
          </Card>
        )}
        <div style={{ marginTop:24 }}>
          <SectionPill icon="🧭" label={`Categorias · ${selected.label}`} tint={T.tintLavender} ink={T.tintLavenderInk} />
        </div>
        <Card pad={20} radius={22} style={{ marginTop:12, display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ position:'relative', width:110, height:110, flexShrink:0 }}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r={r} fill="none" stroke={T.bgWash} strokeWidth="12"/>
              {segments.map((s,i) => {
                const len = (s.pct/100)*circ;
                const off = circ - acc;
                acc += len;
                return <circle key={i} cx="55" cy="55" r={r} fill="none"
                  stroke={s.color} strokeWidth="12"
                  strokeDasharray={`${len-2} ${circ}`} strokeDashoffset={off}
                  transform="rotate(-90 55 55)" strokeLinecap="butt"/>;
              })}
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontFamily:FONT_DISPLAY, fontSize:22, fontWeight:500, color:T.ink }}>4</div>
              <Eyebrow style={{ fontSize:9, marginTop:2 }}>categorias</Eyebrow>
            </div>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
            {segments.map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:10, height:10, borderRadius:3, background:s.color }} />
                <span style={{ flex:1, fontSize:12, color:T.ink, fontWeight:600 }}>{s.label}</span>
                <span style={{ fontSize:12, color:T.inkSoft, fontWeight:700 }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ marginTop:26 }}>
          <SectionPill icon="📋" label="Gastos recentes" count={recentExpenses.length}
            tint={T.tintCream} ink={T.tintCreamInk} />
        </div>
        {recentExpenses.length === 0 ? (
          <div style={{ textAlign:'center', padding:'32px 20px' }}>
            <div style={{ fontSize:36 }}>🪙</div>
            <div style={{ fontWeight:700, fontSize:15, color:T.ink, marginTop:8 }}>
              Nenhum gasto registrado
            </div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:4 }}>
              Toque em "Adicionar gasto" para começar a controlar as finanças do seu pet.
            </div>
          </div>
        ) : (
          <Card pad={0} radius={22} style={{ marginTop:12, overflow:'hidden' }}>
            {recentExpenses.map((e, i) => (
              <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                borderBottom: i<recentExpenses.length-1 ? `1px solid ${T.hairline}` : 'none' }}>
                <EmojiCircle emoji={e.emoji || '📋'} size={36} tint={T.tintCream} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:T.ink, whiteSpace:'nowrap',
                    overflow:'hidden', textOverflow:'ellipsis' }}>{e.desc || e.cat}</div>
                  <div style={{ fontSize:11, color:T.inkSoft, marginTop:1 }}>{e.cat} · {e.date}</div>
                </div>
                <div style={{ fontFamily:FONT_DISPLAY, fontSize:17, fontWeight:500, color:T.ink }}>
                  R$ {e.amount}
                </div>
              </div>
            ))}
          </Card>
        )}
        <div style={{ display:'flex', gap:10, marginTop:18 }}>
          <button onClick={() => nav('reports')} style={{ flex:1, height:52, borderRadius:99, background:T.surface, color:T.ink,
            border:'none', fontFamily:FONT_BODY, fontSize:14, fontWeight:600, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            boxShadow:'0 1px 2px rgba(20,20,30,0.04)' }}>
            <Icon d={I.download} size={16} color={T.ink} stroke={2} /> Exportar PDF
          </button>
          <button onClick={() => nav('addexpense')} style={{ flex:1.2, height:52, borderRadius:99, background:T.ink, color:'#fff',
            border:'none', fontFamily:FONT_BODY, fontSize:14, fontWeight:600, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <Icon d={I.plus} size={16} color="#fff" stroke={2.4} /> Adicionar gasto
          </button>
        </div>
      </div>
      <BottomNav active="finance" />
    </div>
  );
}
