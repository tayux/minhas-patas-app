import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I, Icon } from '../components/Shared.jsx';

const REPORTS = [
  { e:'📋', title:'Histórico de saúde', sub:'Consultas, exames, cirurgias', premium:false },
  { e:'💊', title:'Diário de medicamentos', sub:'Doses, horários, aderência', premium:false },
  { e:'💰', title:'Relatório financeiro', sub:'Gastos por categoria', premium:false },
  { e:'📊', title:'Análise comportamental', sub:'Humor, apetite, atividades', premium:true },
  { e:'🏃', title:'Atividade física', sub:'Passeios, exercícios, metas', premium:true },
];

const STATS = [
  { e:'💊', val:'43', label:'doses dadas' },
  { e:'🏃', val:'12', label:'passeios' },
  { e:'💰', val:'R$1.2k', label:'gastos' },
];

export default function ReportsExport() {
  const { back } = useNav();
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:20, fontWeight:800, color:T.ink }}>Relatórios</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:20 }}>
          {[['📆 Último mês','160px'],['🐾 Leia','auto']].map(([label, w]) => (
            <div key={label} style={{ width:w, background:T.surface, borderRadius:12, padding:'10px 14px',
              display:'flex', alignItems:'center', gap:6, cursor:'pointer',
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)', flex: w==='auto'?1:0 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.ink, flex:1 }}>{label}</span>
              <Icon d={I.chevR} size={14} color={T.inkSoft} />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:10, marginBottom:20 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ flex:1, background:T.surface, borderRadius:16, padding:'14px 12px',
              textAlign:'center', boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{s.e}</div>
              <div style={{ fontSize:20, fontWeight:800, color:T.ink }}>{s.val}</div>
              <div style={{ fontSize:10, color:T.inkSoft, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reports */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Gerar relatório</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {REPORTS.map((r, i) => (
            <div key={i} style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
              display:'flex', alignItems:'center', gap:12,
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:24 }}>{r.e}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{r.title}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>{r.sub}</div>
              </div>
              {r.premium
                ? <div style={{ padding:'5px 10px', background:'#FEF3C7', borderRadius:99,
                    fontSize:11, fontWeight:700, color:'#92400E' }}>⭐ Premium</div>
                : <div style={{ padding:'5px 14px', background:T.brandSoft, borderRadius:99,
                    fontSize:12, fontWeight:700, color:T.brand, cursor:'pointer' }}>Gerar</div>
              }
            </div>
          ))}
        </div>

        {/* Export */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Exportar</div>
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          {[
            { e:'📄', label:'PDF', sub:'Para imprimir', bg:'#FEE2E2', ic:'#EF4444' },
            { e:'📊', label:'Excel', sub:'Para análises', bg:'#DCFCE7', ic:'#16A34A' },
          ].map(ex => (
            <div key={ex.label} style={{ flex:1, background:T.surface, borderRadius:16, padding:'14px 16px',
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ width:40, height:40, background:ex.bg, borderRadius:12,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{ex.e}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>{ex.label}</div>
                  <div style={{ fontSize:11, color:T.inkSoft }}>{ex.sub}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <div style={{ flex:1, textAlign:'center', padding:'7px 0', background:T.bgWash,
                  borderRadius:99, fontSize:12, fontWeight:700, color:T.ink, cursor:'pointer' }}>Baixar</div>
                <div style={{ flex:1, textAlign:'center', padding:'7px 0', background:T.brandSoft,
                  borderRadius:99, fontSize:12, fontWeight:700, color:T.brand, cursor:'pointer' }}>↑ Enviar</div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium banner */}
        <div style={{ background:'#FEF3C7', borderRadius:18, padding:'16px 20px',
          border:'1px solid #FDE68A', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:28 }}>⭐</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Relatórios avançados — Premium</div>
            <div style={{ fontSize:12, color:T.inkSoft }}>Análise de comportamento e gastos por IA</div>
          </div>
          <div style={{ padding:'6px 14px', background:'#F59E0B', borderRadius:99,
            fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer', whiteSpace:'nowrap' }}>Ver planos</div>
        </div>
      </div>
    </div>
  );
}
