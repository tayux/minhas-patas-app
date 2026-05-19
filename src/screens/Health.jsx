import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, IconBtn } from '../components/Shared.jsx';

const TABS = ['Timeline','Exames','Alergias','Cirurgias'];

const EVENTS = [
  { date:'12 abr 2025', type:'Consulta', typeColor:T.brand, typeBg:T.brandSoft,
    title:'Check-up anual · Dr. Renata', chips:['Receita.pdf','Exame.pdf'] },
  { date:'02 fev 2025', type:'Vacina', typeColor:T.tintMintInk, typeBg:T.tintMint,
    title:'V10 + Antirrábica', chips:['Carteirinha.pdf'] },
  { date:'15 nov 2024', type:'Cirurgia', typeColor:'#B45309', typeBg:'#FEF3C7',
    title:'Castração', chips:['Alta.pdf','Cuidados.pdf'] },
  { date:'03 set 2024', type:'Exame', typeColor:T.tintSkyInk, typeBg:T.tintSky,
    title:'Hemograma completo', chips:['Laudo.pdf'] },
];

export default function Health() {
  const { back, nav } = useNav();
  const { activePet } = usePet();
  const [tab, setTab] = useState('Timeline');
  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>🩺</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Sem histórico de saúde</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para registrar o histórico de saúde.
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Saúde & Exames</div>
        <div style={{ flex:1 }} />
        <button onClick={() => nav('examupload')} className="btn-press" style={{
          border:'none', background:T.brandSoft, color:T.brand,
          borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>+ Exame</button>
      </div>

      {/* Stats */}
      <div style={{ margin:'16px 20px 0', background:T.surface, borderRadius:20,
        padding:'16px 20px', boxShadow:'0 4px 20px rgba(20,20,30,0.07)',
        display:'flex', justifyContent:'space-between' }}>
        {[['Última consulta','12 abr'],['Próximo retorno','14 jun'],['Peso atual','12.3 kg']].map(([l,v],i) => (
          <div key={i} style={{ flex:1, textAlign: i===1?'center':'left', borderLeft: i>0?`1px solid ${T.hairline}`:'none', paddingLeft: i>0?16:0 }}>
            <div style={{ fontSize:20, fontWeight:800, color:T.ink }}>{v}</div>
            <div style={{ fontSize:10, fontWeight:600, color:T.inkSoft, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', padding:'16px 20px 0', gap:4, overflowX:'auto' }}>
        {TABS.map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            padding:'7px 16px', borderRadius:99, flexShrink:0, cursor:'pointer',
            fontSize:13, fontWeight: tab===t?700:500,
            color: tab===t?T.brand:T.inkSoft,
            background: tab===t?T.brandSoft:'transparent',
            fontFamily:FONT_BODY }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ height:1, background:T.hairline, margin:'8px 0 0' }} />

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 80px' }}>
        {tab === 'Timeline' && (
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:23, top:8, bottom:0, width:2,
              background:T.brandSoft }} />
            {EVENTS.map((ev, i) => (
              <div key={i} style={{ display:'flex', gap:16, marginBottom:28 }}>
                <div style={{ width:16, height:16, borderRadius:8, background:T.brand,
                  marginTop:4, flexShrink:0, position:'relative', zIndex:1,
                  boxShadow:`0 0 0 4px ${T.brandSoft}` }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>{ev.date}</div>
                  <div style={{ display:'inline-flex', padding:'3px 10px', borderRadius:99,
                    background:ev.typeBg, color:ev.typeColor,
                    fontSize:11, fontWeight:700, marginBottom:6 }}>{ev.type}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:T.ink, marginBottom:8 }}>{ev.title}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {ev.chips.map(c => (
                      <div key={c} style={{ padding:'4px 10px', background:T.bgWash,
                        borderRadius:6, fontSize:11, fontWeight:500, color:T.inkSoft }}>
                        📎 {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab !== 'Timeline' && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:T.inkMute }}>
            <div style={{ fontSize:36 }}>📋</div>
            <div style={{ fontWeight:700, color:T.ink, marginTop:8 }}>Nenhum registro ainda</div>
            <div style={{ fontSize:13, marginTop:4 }}>Adicione o primeiro registro de {tab.toLowerCase()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
