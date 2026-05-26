import { useState, useMemo } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, Card, IconCircle } from '../components/Shared.jsx';

const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function parseDdmm(str) {
  if (!str) return null;
  const [d, m, y] = str.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatBRL(val) {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

const PERIOD_OPTIONS = [
  { label:'Este mês', months:1   },
  { label:'3 meses',  months:3   },
  { label:'6 meses',  months:6   },
  { label:'Este ano', months:12  },
  { label:'Tudo',     months:999 },
];

// ── Print helper ─────────────────────────────────────────────────────────────
function printReport(petName, stats, catRows, vaccineStatus) {
  const style = document.createElement('style');
  style.textContent = `@media print { body > *:not(#mp-print) { display:none!important; } #mp-print { display:block!important; } }`;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'mp-print';
  root.style.cssText = 'display:none;position:fixed;inset:0;background:#fff;z-index:9999;overflow:auto;padding:48px;font-family:sans-serif;';
  root.innerHTML = `
    <h1 style="margin:0 0 4px;font-size:24px">Relatório — ${petName}</h1>
    <p style="color:#888;margin:0 0 28px;font-size:13px">Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
    <h2 style="font-size:15px;border-bottom:1px solid #eee;padding-bottom:8px;margin:0 0 14px">Resumo</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:28px">
      ${[
        ['Medicamentos ativos', stats.activeMeds, 'Passeios no período', stats.walks],
        ['Consultas', stats.consults, 'Registros de saúde', stats.healthRecs],
        ['Gastos totais', stats.totalExpenses, 'Status de vacinas', stats.vaccines],
      ].map((r,i) => `<tr style="${i%2?'background:#f9f9f9':''}">
        <td style="padding:8px 12px;font-weight:600;color:#555">${r[0]}</td><td style="padding:8px 12px">${r[1]}</td>
        <td style="padding:8px 12px;font-weight:600;color:#555">${r[2]}</td><td style="padding:8px 12px">${r[3]}</td>
      </tr>`).join('')}
    </table>
    ${catRows.length > 0 ? `
    <h2 style="font-size:15px;border-bottom:1px solid #eee;padding-bottom:8px;margin:0 0 14px">Gastos por categoria</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:28px">
      <tr style="background:#f0f0f0"><th style="padding:8px 12px;text-align:left">Categoria</th><th style="padding:8px 12px;text-align:right">Total</th><th style="padding:8px 12px;text-align:right">%</th></tr>
      ${catRows.map((c,i) => `<tr style="${i%2?'background:#f9f9f9':''}"><td style="padding:8px 12px">${c.cat}</td><td style="padding:8px 12px;text-align:right">${c.total}</td><td style="padding:8px 12px;text-align:right">${c.pct}%</td></tr>`).join('')}
    </table>` : ''}
    <p style="color:#bbb;font-size:11px;margin-top:40px;border-top:1px solid #eee;padding-top:12px">Gerado pelo app MinhasPatas · minhaspatas.app</p>
  `;
  document.body.appendChild(root);
  window.print();
  setTimeout(() => { document.body.removeChild(root); document.head.removeChild(style); }, 1000);
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ReportsExport() {
  const { back } = useNav();
  const {
    activePet, PETS, petData, allPetsExpenses,
    medications, walks, expenses, consultations,
    vaccines, healthRecords,
  } = usePet();

  const [periodIdx, setPeriodIdx]       = useState(0);
  const [selectedPetId, setSelectedPetId] = useState(null); // null = Todos

  // Cross-pet data aggregation
  const currentPetData  = selectedPetId ? (petData?.[selectedPetId] || {}) : null;
  const currentMeds     = selectedPetId ? (currentPetData.medications  || []) : PETS.flatMap(p => petData?.[p.id]?.medications  || []);
  const currentWalks    = selectedPetId ? (currentPetData.walks        || []) : PETS.flatMap(p => petData?.[p.id]?.walks        || []);
  const currentConsults = selectedPetId ? (currentPetData.consultations|| []) : PETS.flatMap(p => petData?.[p.id]?.consultations|| []);
  const currentHealth   = selectedPetId ? (currentPetData.healthRecords|| []) : PETS.flatMap(p => petData?.[p.id]?.healthRecords|| []);
  const currentVaccines = selectedPetId ? (currentPetData.vaccines     || []) : PETS.flatMap(p => petData?.[p.id]?.vaccines     || []);
  const currentExpenses = selectedPetId ? (currentPetData.expenses     || []) : (allPetsExpenses || []);
  const currentPetName  = selectedPetId ? (PETS.find(p => p.id === selectedPetId)?.name ?? 'Pet') : 'Todos os pets';

  const cutoff = useMemo(() => {
    const months = PERIOD_OPTIONS[periodIdx].months;
    if (months >= 999) return new Date(0);
    const d = new Date();
    d.setMonth(d.getMonth() - months);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [periodIdx]);

  const inPeriod = (item) => {
    const d = parseDdmm(item.date || item.startDate);
    return d ? d >= cutoff : true;
  };

  const activeMeds     = currentMeds.filter(m => m.on !== false && m.active !== false).length;
  const periodWalks    = currentWalks.filter(inPeriod);
  const periodConsults = currentConsults.filter(inPeriod);
  const periodHealth   = currentHealth.filter(inPeriod);
  const periodExp      = currentExpenses.filter(inPeriod);
  const totalExp       = periodExp.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const totalWalkMin   = periodWalks.reduce((s, w) => s + (w.duration || 0), 0);
  const totalWalkDist  = periodWalks.reduce((s, w) => s + (w.distance || 0), 0);

  const now = new Date();
  const overdueVax = currentVaccines.filter(v => { const d = parseDdmm(v.nextDate); return d && d < now; }).length;
  const vaccineStatus = currentVaccines.length === 0 ? 'Nenhuma cadastrada'
    : overdueVax === 0 ? `${currentVaccines.length} em dia ✓`
    : `${overdueVax} atrasada${overdueVax > 1 ? 's' : ''}`;

  // Expenses by category
  const catMap = {};
  periodExp.forEach(e => {
    const cat = e.cat || e.category || 'Outros';
    catMap[cat] = (catMap[cat] || 0) + (parseFloat(e.amount) || 0);
  });
  const catRows = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => ({
      cat, val, total: formatBRL(val),
      pct: totalExp > 0 ? Math.round((val / totalExp) * 100) : 0,
    }));

  // Timeline
  const TLINE_ICONS  = { consulta: I.cal, saúde: I.health, passeio: I.paw };
  const TLINE_TINTS  = { consulta: T.tintSky, saúde: T.tintRose, passeio: T.tintMint };
  const TLINE_INKS   = { consulta: T.tintSkyInk, saúde: T.tintRoseInk, passeio: T.tintMintInk };
  const timeline = [
    ...periodConsults.map(c => ({ type:'consulta', date:c.date, label:`Consulta${c.title ? ': '+c.title : ''}${c.vet ? ' · '+c.vet : ''}` })),
    ...periodHealth.map(h  => ({ type:'saúde',    date:h.date, label:`Saúde: ${h.title || h.type}` })),
    ...periodWalks.map(w   => ({ type:'passeio',  date:w.date, label:`Passeio: ${w.duration}min${w.distance ? ' · '+w.distance+'km' : ''}` })),
  ]
    .filter(e => e.date)
    .sort((a, b) => (parseDdmm(b.date)?.getTime() ?? 0) - (parseDdmm(a.date)?.getTime() ?? 0))
    .slice(0, 12);

  const isEmpty = activeMeds === 0 && currentWalks.length === 0 && currentExpenses.length === 0 &&
    currentVaccines.length === 0 && currentHealth.length === 0;

  const handlePrint = () => printReport(
    currentPetName,
    { activeMeds, walks: periodWalks.length, consults: periodConsults.length,
      totalExpenses: formatBRL(totalExp), healthRecs: periodHealth.length, vaccines: vaccineStatus },
    catRows,
    vaccineStatus,
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      {/* Header */}
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:20, fontWeight:800, color:T.ink, flex:1 }}>Relatórios</div>
        {PETS.length > 0 && !isEmpty && (
          <button onClick={handlePrint} className="btn-press"
            style={{ height:36, padding:'0 16px', borderRadius:99, border:'none',
              background:T.surface, fontFamily:FONT_BODY, fontSize:13, fontWeight:700,
              color:T.ink, cursor:'pointer', display:'flex', alignItems:'center', gap:6,
              boxShadow:'0 1px 4px rgba(20,20,30,0.08)' }}>
            <I.upload size={14} strokeWidth={2} /> Exportar PDF
          </button>
        )}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>

        {/* Pet filter chips — only show when multiple pets */}
        {PETS.length > 1 && (
          <div style={{ display:'flex', gap:8, marginBottom:12, overflowX:'auto', paddingBottom:2 }}>
            <div onClick={() => setSelectedPetId(null)}
              style={{ padding:'7px 14px', borderRadius:99, flexShrink:0,
                background: selectedPetId === null ? T.ink : T.surface,
                color: selectedPetId === null ? '#fff' : T.ink,
                fontSize:13, fontWeight:600, cursor:'pointer',
                boxShadow: selectedPetId === null ? 'none' : '0 1px 2px rgba(20,20,30,0.04)' }}>
              Todos os pets
            </div>
            {PETS.map(p => (
              <div key={p.id} onClick={() => setSelectedPetId(p.id)}
                style={{ padding:'7px 14px', borderRadius:99, flexShrink:0,
                  background: selectedPetId === p.id ? T.brand : T.surface,
                  color: selectedPetId === p.id ? '#fff' : T.ink,
                  fontSize:13, fontWeight:600, cursor:'pointer',
                  boxShadow: selectedPetId === p.id ? 'none' : '0 1px 2px rgba(20,20,30,0.04)' }}>
                {p.name}
              </div>
            ))}
          </div>
        )}

        {/* Period filter chips */}
        {(activePet || PETS.length > 0) && (
          <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:2 }}>
            {PERIOD_OPTIONS.map((p, i) => (
              <div key={i} onClick={() => setPeriodIdx(i)}
                style={{ padding:'7px 14px', borderRadius:99, flexShrink:0,
                  background: i === periodIdx ? T.ink : T.surface,
                  color: i === periodIdx ? '#fff' : T.ink,
                  fontSize:13, fontWeight:600, cursor:'pointer',
                  boxShadow: i === periodIdx ? 'none' : '0 1px 2px rgba(20,20,30,0.04)' }}>
                {p.label}
              </div>
            ))}
          </div>
        )}

        {PETS.length === 0 ? (
          <div style={{ textAlign:'center', padding:'64px 20px' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🐾</div>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink }}>Nenhum pet cadastrado</div>
          </div>
        ) : isEmpty ? (
          <div style={{ textAlign:'center', padding:'64px 20px' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>📊</div>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink, marginBottom:8 }}>Sem dados ainda</div>
            <div style={{ fontSize:14, color:T.inkSoft, lineHeight:1.5, maxWidth:260, margin:'0 auto' }}>
              Registre medicamentos, passeios, consultas e vacinas para ver o relatório de {currentPetName}.
            </div>
          </div>
        ) : (
          <>
            {/* Stats grid 2×2 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              {[
                { icon:I.meds,    tint:T.tintLavender, ink:T.tintLavenderInk, val:activeMeds,             label:'meds ativos'    },
                { icon:I.paw,     tint:T.tintMint,     ink:T.tintMintInk,     val:periodWalks.length,    label:'passeios'        },
                { icon:I.cal,     tint:T.tintSky,      ink:T.tintSkyInk,      val:periodConsults.length,  label:'consultas'       },
                { icon:I.health,  tint:T.tintRose,     ink:T.tintRoseInk,     val:periodHealth.length,    label:'reg. de saúde'   },
              ].map((s, i) => (
                <Card key={i} pad={14} radius={18}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <IconCircle icon={s.icon} size={36} tint={s.tint} color={s.ink} />
                    <div>
                      <div style={{ fontFamily:FONT_DISPLAY, fontSize:22, fontWeight:500, color:T.ink, lineHeight:1 }}>
                        {s.val}
                      </div>
                      <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600 }}>{s.label}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Walk detail */}
            {periodWalks.length > 0 && (
              <Card pad={16} radius={18} style={{ marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>Atividade física</div>
                <div style={{ display:'flex' }}>
                  {[
                    { val:periodWalks.length, unit:'passeios' },
                    { val:`${totalWalkMin}min`, unit:'total' },
                    { val:totalWalkDist > 0 ? `${totalWalkDist.toFixed(1)}km` : '—', unit:'percorridos' },
                  ].map((s, i) => (
                    <div key={i} style={{ flex:1, textAlign:'center',
                      borderLeft: i > 0 ? `1px solid ${T.hairline}` : 'none', padding:'0 8px' }}>
                      <div style={{ fontFamily:FONT_DISPLAY, fontSize:20, fontWeight:500, color:T.ink }}>
                        {s.val}
                      </div>
                      <div style={{ fontSize:10, color:T.inkSoft, fontWeight:600 }}>{s.unit}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Vaccines */}
            <Card pad={16} radius={18} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <IconCircle icon={I.vaccine} size={36}
                  tint={overdueVax > 0 ? '#FEE2E2' : T.tintMint}
                  color={overdueVax > 0 ? '#EF4444' : T.tintMintInk} />
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:T.ink }}>Vacinas</div>
                  <div style={{ fontSize:12, color: overdueVax > 0 ? '#EF4444' : T.inkSoft }}>
                    {vaccineStatus}
                  </div>
                </div>
              </div>
            </Card>

            {/* Expenses breakdown */}
            {totalExp > 0 && (
              <Card pad={16} radius={18} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Gastos</div>
                  <div style={{ fontFamily:FONT_DISPLAY, fontSize:18, fontWeight:500, color:T.ink }}>
                    {formatBRL(totalExp)}
                  </div>
                </div>
                {catRows.map((c, i) => (
                  <div key={i} style={{ marginBottom: i < catRows.length-1 ? 12 : 0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:T.ink }}>{c.cat}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{c.total}
                        <span style={{ fontSize:11, color:T.inkSoft, fontWeight:400 }}> · {c.pct}%</span>
                      </span>
                    </div>
                    <div style={{ height:6, borderRadius:3, background:T.bgWash, overflow:'hidden' }}>
                      <div style={{ width:`${c.pct}%`, height:'100%', background:T.brand, borderRadius:3, minWidth:4 }} />
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>
                  Linha do tempo
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {timeline.map((e, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10,
                      background:T.surface, borderRadius:14, padding:'11px 14px',
                      boxShadow:'0 1px 4px rgba(20,20,30,0.05)' }}>
                      <IconCircle icon={TLINE_ICONS[e.type] || I.health} size={28}
                        tint={TLINE_TINTS[e.type] || T.tintRose}
                        color={TLINE_INKS[e.type] || T.tintRoseInk} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{e.label}</div>
                        <div style={{ fontSize:11, color:T.inkSoft }}>{e.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
