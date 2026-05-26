import { useState, useMemo } from 'react';
import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, IconBtn, Eyebrow, Display, BottomNav, PetHeader } from '../components/Shared.jsx';

const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function BarChart({ months, selectedKey, onSelect }) {
  const totals = months.map(m => m.total);
  const max = Math.max(...totals, 1);
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
            const h = Math.max(4, (m.total / max) * (H - 14));
            const isSel = m.key === selectedKey;
            const color = isSel ? T.ink : m.total > 0 ? T.brand : T.bgWash;
            return (
              <div key={m.key} onClick={() => onSelect(m.key)}
                style={{ flex:1, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'flex-end',
                  height:'100%', cursor:'pointer', position:'relative' }}>
                {isSel && m.total > 0 && (
                  <div style={{ position:'absolute', top:H-h-26, padding:'3px 8px', borderRadius:99,
                    background:T.ink, color:'#fff', fontSize:10, fontWeight:700,
                    whiteSpace:'nowrap' }}>
                    R${(Math.round(m.total/100)/10).toFixed(1)}k
                  </div>
                )}
                <div style={{ width:'78%', maxWidth:32, height: m.total > 0 ? h : 6,
                  borderRadius:8, background:color,
                  transition:'all 0.25s', opacity: m.total === 0 ? 0.3 : 1,
                  boxShadow: isSel ? '0 4px 12px -4px rgba(20,20,30,0.25)':'none' }} />
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
  const { activePet, PETS, expenses } = usePet();
  const currentYear = new Date().getFullYear();
  const [year, setYear]         = useState(currentYear);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedKey, setSelectedKey] = useState(MONTH_NAMES[new Date().getMonth()].toLowerCase());
  const [search, setSearch]     = useState('');
  const [showSearch, setShowSearch] = useState(false);

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

  const fmt = v => v.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');

  // Parse expense dates and filter
  const allExpenses = expenses.filter(e => {
    if (!e.date) return false;
    const parts = e.date.split('/');
    if (parts.length < 3) return false;
    return parseInt(parts[2]) === year;
  });

  // Build month data from real expenses
  const monthData = MONTH_NAMES.map((label, idx) => {
    const key = label.toLowerCase();
    const monthExps = allExpenses.filter(e => {
      const parts = e.date.split('/');
      return parseInt(parts[1]) - 1 === idx;
    });
    const total = monthExps.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    return { key, label, total, exps: monthExps };
  });

  const selected = monthData.find(m => m.key === selectedKey) || monthData[0];
  const prevIdx  = monthData.findIndex(m => m.key === selectedKey) - 1;
  const previous = prevIdx >= 0 ? monthData[prevIdx] : null;
  const peak     = monthData.reduce((a, b) => b.total > a.total ? b : a, monthData[0]);
  const avg      = monthData.reduce((s, m) => s + m.total, 0) / 12;

  // Filtered recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(e => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (e.desc || '').toLowerCase().includes(s) ||
             (e.cat  || '').toLowerCase().includes(s);
    })
    .slice(0, 20);

  const hasAnyExpenses = expenses.length > 0;

  // Category breakdown from current month
  const catMap = {};
  selected.exps.forEach(e => {
    catMap[e.cat] = (catMap[e.cat] || 0) + parseFloat(e.amount || 0);
  });
  const catTotal = Object.values(catMap).reduce((s, v) => s + v, 0);
  const CAT_COLORS = ['#7C6BFC','#5390B0','#D4A93A','#5BA890','#E07B78','#A0C4A0'];
  const segments = Object.entries(catMap).map(([label, val], i) => ({
    label, pct: catTotal > 0 ? Math.round(val / catTotal * 100 * 10) / 10 : 0,
    color: CAT_COLORS[i % CAT_COLORS.length],
  }));

  const r = 46, circ = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <PetHeader />
        <div onClick={() => setShowSearch(s => !s)} style={{ cursor:'pointer' }}>
          <Icon d={I.search} size={22} color={T.ink} stroke={2} />
        </div>
      </div>

      {showSearch && (
        <div style={{ padding:'8px 24px 0' }}>
          <div style={{ background:T.surface, borderRadius:14, padding:'10px 16px',
            display:'flex', alignItems:'center', gap:8 }}>
            <Icon d={I.search} size={15} color={T.inkSoft} stroke={2} />
            <input style={{ flex:1, border:'none', outline:'none', background:'transparent',
              fontSize:14, color:T.ink, fontFamily:FONT_BODY }}
              placeholder="Buscar gastos..." autoFocus
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && <div onClick={() => setSearch('')} style={{ fontSize:18, color:T.inkSoft, cursor:'pointer' }}>×</div>}
          </div>
        </div>
      )}

      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 96px' }}>
        <Eyebrow>finanças com {activePet.name}</Eyebrow>
        <Display size={42} weight={400} style={{ marginTop:8 }}>Finanças</Display>

        {/* Year + Pet filters */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12, flexWrap:'wrap' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            <div onClick={() => setYear(y => y - 1)} style={{ width:28, height:28, borderRadius:14,
              background:T.surface, display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', boxShadow:'0 1px 4px rgba(20,20,30,0.06)' }}>
              <Icon d={I.chevL} size={14} color={T.ink} stroke={2.5} />
            </div>
            <div style={{ padding:'6px 14px', borderRadius:99, background:T.surface,
              fontSize:13, fontWeight:700, color:T.ink,
              boxShadow:'0 1px 2px rgba(20,20,30,0.04)' }}>{year}</div>
            <div onClick={() => setYear(y => y + 1)} style={{ width:28, height:28, borderRadius:14,
              background:T.surface, display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', boxShadow:'0 1px 4px rgba(20,20,30,0.06)' }}>
              <Icon d={I.chevR} size={14} color={T.ink} stroke={2.5} />
            </div>
          </div>
          {PETS.length > 1 && (
            <div style={{ display:'flex', gap:6, overflowX:'auto' }}>
              <div onClick={() => setSelectedPetId(null)} style={{ padding:'5px 12px', borderRadius:99, flexShrink:0,
                background: !selectedPetId ? T.brand : T.surface,
                color: !selectedPetId ? '#fff' : T.ink,
                fontSize:12, fontWeight:700, cursor:'pointer' }}>Todos</div>
              {PETS.map(p => (
                <div key={p.id} onClick={() => setSelectedPetId(p.id === selectedPetId ? null : p.id)}
                  style={{ padding:'5px 12px', borderRadius:99, flexShrink:0,
                    background: selectedPetId === p.id ? T.brand : T.surface,
                    color: selectedPetId === p.id ? '#fff' : T.ink,
                    fontSize:12, fontWeight:700, cursor:'pointer' }}>{p.name}</div>
              ))}
            </div>
          )}
          {hasAnyExpenses && (
            <div style={{ fontSize:12, color:T.inkSoft }}>
              média <strong style={{ color:T.ink }}>R$ {fmt(avg)}</strong>/mês
            </div>
          )}
        </div>

        {!hasAnyExpenses ? (
          <div style={{ marginTop:24, textAlign:'center', padding:'32px 20px' }}>
            <div style={{ fontSize:48 }}>🪙</div>
            <div style={{ fontWeight:700, fontSize:16, color:T.ink, marginTop:12 }}>
              Nenhum gasto registrado ainda
            </div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:4, maxWidth:240, margin:'8px auto 0' }}>
              Toque em + para adicionar o primeiro gasto e acompanhar as finanças do seu pet.
            </div>
          </div>
        ) : (
          <>
            <Card pad={18} radius={24} style={{ marginTop:18 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                <div>
                  <Eyebrow>{MONTH_NAMES[monthData.findIndex(m => m.key === selectedKey)]} {year}</Eyebrow>
                  <div style={{ marginTop:6, display:'flex', alignItems:'baseline', gap:2 }}>
                    <span style={{ fontFamily:FONT_DISPLAY, fontSize:14, color:T.inkSoft }}>R$</span>
                    <span style={{ fontFamily:FONT_DISPLAY, fontSize:30, fontWeight:400, color:T.ink,
                      letterSpacing:-0.6, lineHeight:1, marginLeft:4 }}>
                      {fmt(selected.total).split(',')[0]}
                    </span>
                    <span style={{ fontFamily:FONT_DISPLAY, fontSize:16, color:T.inkSoft }}>
                      ,{fmt(selected.total).split(',')[1]}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:T.inkMute, marginTop:4 }}>toque numa barra para comparar</div>
                </div>
                {previous && selected.total > 0 && (
                  <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'5px 10px',
                    borderRadius:99,
                    background: selected.total <= previous.total ? T.tintMint : T.tintRose,
                    color: selected.total <= previous.total ? T.tintMintInk : T.tintRoseInk,
                    fontSize:11, fontWeight:800, flexShrink:0 }}>
                    {selected.total <= previous.total ? '↓' : '↑'}
                    {previous.total > 0 ? ` ${Math.abs(Math.round((selected.total/previous.total-1)*100))}%` : ''}
                  </div>
                )}
              </div>
              <BarChart months={monthData} selectedKey={selectedKey} onSelect={setSelectedKey} />
              {peak.total > 0 && (
                <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                  borderRadius:14, background:T.surfaceLo }}>
                  <span style={{ fontSize:18 }}>📈</span>
                  <div style={{ flex:1, fontSize:12, color:T.inkSoft, lineHeight:1.4 }}>
                    <strong style={{ color:T.ink, fontWeight:700 }}>
                      {MONTH_NAMES[monthData.findIndex(m => m.key === peak.key)]} {year}
                    </strong> foi o mês mais caro
                  </div>
                </div>
              )}
            </Card>

            {previous && previous.total > 0 && selected.total > 0 && (
              <Card pad={16} radius={22} style={{ marginTop:12 }}>
                <Eyebrow>comparativo</Eyebrow>
                <div style={{ display:'flex', alignItems:'stretch', gap:12, marginTop:10 }}>
                  {[selected, previous].map((m, i) => (
                    <div key={i} style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:T.inkMute, fontWeight:700, textTransform:'uppercase', letterSpacing:0.6 }}>
                        {MONTH_NAMES[monthData.findIndex(x => x.key === m.key)]}
                      </div>
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
                    ? <>Você economizou <strong style={{ color:T.tintMintInk }}>R$ {fmt(previous.total - selected.total)}</strong> em relação ao mês anterior 👏</>
                    : <>Você gastou <strong style={{ color:T.tintRoseInk }}>R$ {fmt(selected.total - previous.total)}</strong> a mais que no mês anterior.</>
                  }
                </div>
              </Card>
            )}

            {segments.length > 0 && (
              <>
                <div style={{ marginTop:24 }}>
                  <SectionPill icon="🧭" label={`Categorias · ${selected.key}`} tint={T.tintLavender} ink={T.tintLavenderInk} />
                </div>
                <Card pad={20} radius={22} style={{ marginTop:12, display:'flex', alignItems:'center', gap:18 }}>
                  <div style={{ position:'relative', width:110, height:110, flexShrink:0 }}>
                    <svg width="110" height="110" viewBox="0 0 110 110">
                      <circle cx="55" cy="55" r={r} fill="none" stroke={T.bgWash} strokeWidth="12"/>
                      {segments.map((s, i) => {
                        const len = (s.pct / 100) * circ;
                        const off = circ - acc;
                        acc += len;
                        return <circle key={i} cx="55" cy="55" r={r} fill="none"
                          stroke={s.color} strokeWidth="12"
                          strokeDasharray={`${len - 2} ${circ}`} strokeDashoffset={off}
                          transform="rotate(-90 55 55)" strokeLinecap="butt"/>;
                      })}
                    </svg>
                    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center' }}>
                      <div style={{ fontFamily:FONT_DISPLAY, fontSize:22, fontWeight:500, color:T.ink }}>
                        {segments.length}
                      </div>
                      <Eyebrow style={{ fontSize:9, marginTop:2 }}>cat.</Eyebrow>
                    </div>
                  </div>
                  <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                    {segments.map((s, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:10, height:10, borderRadius:3, background:s.color }} />
                        <span style={{ flex:1, fontSize:12, color:T.ink, fontWeight:600 }}>{s.label}</span>
                        <span style={{ fontSize:12, color:T.inkSoft, fontWeight:700 }}>{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </>
        )}

        <div style={{ marginTop:26 }}>
          <SectionPill icon="📋" label="Gastos recentes" count={recentExpenses.length}
            tint={T.tintCream} ink={T.tintCreamInk} />
        </div>
        {recentExpenses.length === 0 ? (
          <div style={{ textAlign:'center', padding:'32px 20px' }}>
            <div style={{ fontSize:36 }}>🪙</div>
            <div style={{ fontWeight:700, fontSize:15, color:T.ink, marginTop:8 }}>
              {search ? 'Nenhum resultado' : 'Nenhum gasto registrado'}
            </div>
            {!search && (
              <div style={{ fontSize:13, color:T.inkSoft, marginTop:4 }}>
                Toque em + para adicionar o primeiro gasto.
              </div>
            )}
          </div>
        ) : (
          <Card pad={0} radius={22} style={{ marginTop:12, overflow:'hidden' }}>
            {recentExpenses.map((e, i) => (
              <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                borderBottom: i < recentExpenses.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
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

        <div style={{ marginTop:18 }}>
          <button onClick={() => window.print()} style={{ width:'100%', height:52, borderRadius:99,
            background:T.surface, color:T.ink, border:'none', fontFamily:FONT_BODY,
            fontSize:14, fontWeight:600, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            boxShadow:'0 1px 2px rgba(20,20,30,0.04)' }}>
            <Icon d={I.download} size={16} color={T.ink} stroke={2} /> Imprimir / salvar PDF
          </button>
        </div>
      </div>

      {/* FAB */}
      <div onClick={() => nav('addexpense')}
        style={{ position:'absolute', bottom:80, right:20, width:56, height:56, borderRadius:28,
          background:T.ink, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:28, color:'#fff', cursor:'pointer',
          boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)', zIndex:10 }}>+</div>

      <BottomNav active="finance" />

      {/* Print view — hidden in browser, visible when printing */}
      <style>{`
        @media print {
          @page { margin: 18mm; }
          body * { visibility: hidden !important; }
          .mp-print-view, .mp-print-view * { visibility: visible !important; }
          .mp-print-view {
            display: block !important;
            position: absolute !important;
            top: 0; left: 0;
            width: 100%;
            background: #fff !important;
            color: #000 !important;
          }
          .mp-print-view table { page-break-inside: auto; }
          .mp-print-view tr { page-break-inside: avoid; }
        }
      `}</style>
      <div className="mp-print-view" style={{ display:'none' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end',
          borderBottom:'2px solid #000', paddingBottom:12, marginBottom:18 }}>
          <div>
            <h1 style={{ fontFamily:'sans-serif', fontSize:24, margin:0, lineHeight:1.1 }}>
              Finanças — {activePet.name}
            </h1>
            <div style={{ fontFamily:'sans-serif', fontSize:12, color:'#444', marginTop:4 }}>
              {activePet.breed}{activePet.gender ? ` · ${activePet.gender}` : ''}{activePet.age && activePet.age !== '—' ? ` · ${activePet.age}` : ''}
            </div>
          </div>
          <div style={{ fontFamily:'sans-serif', fontSize:12, textAlign:'right', color:'#444' }}>
            <div style={{ fontWeight:700, color:'#000' }}>Ano {year}</div>
            <div>Emitido em {new Date().toLocaleDateString('pt-BR')}</div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display:'flex', gap:14, marginBottom:18, fontFamily:'sans-serif' }}>
          <div style={{ flex:1, border:'1px solid #ddd', borderRadius:6, padding:'10px 12px' }}>
            <div style={{ fontSize:10, color:'#666', textTransform:'uppercase', letterSpacing:0.6 }}>Total no ano</div>
            <div style={{ fontSize:18, fontWeight:700, marginTop:2 }}>
              R$ {fmt(allExpenses.reduce((s,e) => s + parseFloat(e.amount||0), 0))}
            </div>
          </div>
          <div style={{ flex:1, border:'1px solid #ddd', borderRadius:6, padding:'10px 12px' }}>
            <div style={{ fontSize:10, color:'#666', textTransform:'uppercase', letterSpacing:0.6 }}>Lançamentos</div>
            <div style={{ fontSize:18, fontWeight:700, marginTop:2 }}>{allExpenses.length}</div>
          </div>
          <div style={{ flex:1, border:'1px solid #ddd', borderRadius:6, padding:'10px 12px' }}>
            <div style={{ fontSize:10, color:'#666', textTransform:'uppercase', letterSpacing:0.6 }}>Média/mês</div>
            <div style={{ fontSize:18, fontWeight:700, marginTop:2 }}>R$ {fmt(avg)}</div>
          </div>
        </div>

        {/* Category breakdown */}
        {(() => {
          const byCat = {};
          allExpenses.forEach(e => {
            byCat[e.cat || 'Outros'] = (byCat[e.cat || 'Outros'] || 0) + parseFloat(e.amount || 0);
          });
          const totalCat = Object.values(byCat).reduce((s, v) => s + v, 0) || 1;
          const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
          if (cats.length === 0) return null;
          return (
            <div style={{ marginBottom:18, fontFamily:'sans-serif' }}>
              <h2 style={{ fontSize:14, margin:'0 0 8px', textTransform:'uppercase', letterSpacing:0.8, color:'#444' }}>
                Por categoria
              </h2>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'#f4f4f4' }}>
                    <th style={{ textAlign:'left', padding:'6px 10px', borderBottom:'1px solid #ccc' }}>Categoria</th>
                    <th style={{ textAlign:'right', padding:'6px 10px', borderBottom:'1px solid #ccc' }}>Valor</th>
                    <th style={{ textAlign:'right', padding:'6px 10px', borderBottom:'1px solid #ccc', width:60 }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {cats.map(([cat, val]) => (
                    <tr key={cat} style={{ borderBottom:'1px solid #eee' }}>
                      <td style={{ padding:'5px 10px' }}>{cat}</td>
                      <td style={{ padding:'5px 10px', textAlign:'right' }}>R$ {fmt(val)}</td>
                      <td style={{ padding:'5px 10px', textAlign:'right' }}>{((val / totalCat) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* Detailed expenses */}
        <div style={{ fontFamily:'sans-serif' }}>
          <h2 style={{ fontSize:14, margin:'0 0 8px', textTransform:'uppercase', letterSpacing:0.8, color:'#444' }}>
            Lançamentos detalhados
          </h2>
          {allExpenses.length === 0 ? (
            <div style={{ fontSize:12, color:'#888', padding:'12px 0', textAlign:'center',
              border:'1px dashed #ddd', borderRadius:6 }}>
              Nenhum gasto registrado em {year}.
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#f4f4f4' }}>
                  <th style={{ textAlign:'left', padding:'6px 10px', borderBottom:'1px solid #ccc', width:90 }}>Data</th>
                  <th style={{ textAlign:'left', padding:'6px 10px', borderBottom:'1px solid #ccc', width:130 }}>Categoria</th>
                  <th style={{ textAlign:'left', padding:'6px 10px', borderBottom:'1px solid #ccc' }}>Descrição</th>
                  <th style={{ textAlign:'right', padding:'6px 10px', borderBottom:'1px solid #ccc', width:100 }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {[...allExpenses].sort((a,b) => {
                  const [da,ma,ya] = (a.date||'').split('/');
                  const [db,mb,yb] = (b.date||'').split('/');
                  return new Date(`${yb}-${mb}-${db}`) - new Date(`${ya}-${ma}-${da}`);
                }).map((e,i) => (
                  <tr key={i} style={{ borderBottom:'1px solid #eee' }}>
                    <td style={{ padding:'5px 10px' }}>{e.date || '—'}</td>
                    <td style={{ padding:'5px 10px' }}>{e.emoji || ''} {e.cat}</td>
                    <td style={{ padding:'5px 10px' }}>{e.desc || '—'}</td>
                    <td style={{ padding:'5px 10px', textAlign:'right' }}>R$ {e.amount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop:'2px solid #000', fontWeight:'bold', background:'#fafafa' }}>
                  <td colSpan={3} style={{ padding:'8px 10px' }}>Total</td>
                  <td style={{ padding:'8px 10px', textAlign:'right' }}>
                    R$ {fmt(allExpenses.reduce((s,e) => s + parseFloat(e.amount||0), 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        <div style={{ marginTop:24, fontFamily:'sans-serif', fontSize:10, color:'#888',
          textAlign:'center', borderTop:'1px solid #eee', paddingTop:10 }}>
          Relatório gerado pelo MinhasPatas
        </div>
      </div>
    </div>
  );
}
