import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const CATS = ['Todos','Receitas','Exames','Vacinas','Cirurgias'];

const DOCS = [
  { e:'📋', title:'Hemograma', cat:'Exame', date:'12 abr', tint:T.tintSky },
  { e:'💊', title:'Prednisolona', cat:'Receita', date:'12 abr', tint:T.tintLavender },
  { e:'🩺', title:'Consulta jan', cat:'Relatório', date:'10 jan', tint:T.tintMint },
  { e:'💉', title:'Vacina V10', cat:'Vacina', date:'05 set', tint:T.tintPeach },
  { e:'🔬', title:'Urina EAS', cat:'Exame', date:'02 fev', tint:T.tintSky },
  { e:'📄', title:'Alta cirúrgica', cat:'Cirurgia', date:'02 mai', tint:T.tintCream },
];

export default function DocumentsLibrary() {
  const { back, nav } = useNav();
  const { activePet } = usePet();
  const [cat, setCat] = useState('Todos');
  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>📁</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Nenhum documento</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para armazenar receitas, exames e vacinas.
        </div>
      </div>
    </div>
  );

  const filtered = cat === 'Todos' ? DOCS : DOCS.filter(d => d.cat === cat || d.cat.toLowerCase().startsWith(cat.slice(0,-1).toLowerCase()));

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:20, fontWeight:800, color:T.ink }}>Documentos</div>
      </div>

      {/* Search */}
      <div style={{ padding:'12px 20px 0' }}>
        <div style={{ background:T.surface, borderRadius:14, padding:'12px 16px',
          display:'flex', alignItems:'center', gap:8, fontSize:14, color:T.inkSoft,
          boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
          🔍  Buscar documentos...
        </div>
      </div>

      {/* Category chips */}
      <div style={{ display:'flex', gap:8, padding:'12px 20px 0', overflowX:'auto' }}>
        {CATS.map(c => (
          <div key={c} onClick={() => setCat(c)} className="btn-press" style={{
            padding:'7px 16px', borderRadius:100, flexShrink:0, cursor:'pointer',
            background: cat===c ? T.brand : T.surface, fontSize:13, fontWeight:700,
            color: cat===c ? '#fff' : T.ink, fontFamily:FONT_BODY,
            boxShadow: cat===c ? 'none' : '0 1px 4px rgba(20,20,30,0.06)',
            transition:'background 0.15s, color 0.15s' }}>
            {c}
          </div>
        ))}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 100px' }}>
        {filtered.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {filtered.map((d, i) => (
              <div key={i} style={{ background:T.surface, borderRadius:16, overflow:'hidden',
                boxShadow:'0 2px 8px rgba(20,20,30,0.05)', cursor:'pointer' }}>
                <div style={{ background:d.tint, padding:'20px 0', textAlign:'center', fontSize:36,
                  position:'relative' }}>
                  {d.e}
                  <div style={{ position:'absolute', top:8, right:8, padding:'3px 8px',
                    background:'rgba(255,255,255,0.7)', borderRadius:99,
                    fontSize:9, fontWeight:700, color:T.inkSoft }}>{d.cat}</div>
                </div>
                <div style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{d.title}</div>
                  <div style={{ fontSize:11, color:T.inkSoft, marginTop:2 }}>{d.date}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:48 }}>📂</div>
            <div style={{ fontSize:16, fontWeight:700, color:T.ink, marginTop:12 }}>Nenhum documento</div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:4 }}>Adicione documentos usando o botão abaixo</div>
          </div>
        )}
      </div>

      {/* FAB */}
      <div onClick={() => nav('examupload')} style={{
        position:'absolute', bottom:24, right:20, width:56, height:56, borderRadius:28,
        background:T.brand, display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:28, fontWeight:300, color:'#fff', cursor:'pointer',
        boxShadow:`0 6px 16px rgba(124,107,252,0.4)` }}>+</div>
    </div>
  );
}
