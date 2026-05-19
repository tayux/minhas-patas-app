import { useState, useRef } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, IconBtn } from '../components/Shared.jsx';
import { maskDate } from '../utils/dateUtils.js';

const CATS = ['Hemograma','Raio-X','Ultrassom','Urina / EAS','Bioquímica','Cultura','Outros'];

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

export default function ExamUpload() {
  const { back } = useNav();
  const [file, setFile]         = useState(null);
  const [examName, setName]     = useState('');
  const [date, setDate]         = useState('');
  const [vet, setVet]           = useState('');
  const [catIdx, setCat]        = useState(null);
  const [showCats, setShowCats] = useState(false);
  const fileRef = useRef();

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Adicionar exame</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        <div onClick={() => fileRef.current.click()} style={{
          border:`2px dashed ${T.brand}`, borderRadius:20, padding:'32px 20px',
          textAlign:'center', background:file ? T.brandSoft : '#F8F6FF',
          cursor:'pointer', marginBottom:20 }}>
          <input ref={fileRef} type="file" accept=".pdf,image/*"
            style={{ display:'none' }} onChange={e => setFile(e.target.files[0])} />
          <div style={{ fontSize:44 }}>📄</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginTop:10 }}>
            {file ? file.name : 'Arraste ou toque para enviar'}
          </div>
          <div style={{ fontSize:12, color:T.inkSoft, marginTop:4 }}>PDF · JPG · PNG · HEIC · até 20 MB</div>
        </div>

        <div style={{ display:'flex', gap:10, marginBottom:24 }}>
          {[{e:'📷',l:'Câmera'},{e:'🖼️',l:'Galeria'},{e:'📁',l:'Arquivos'}].map(src => (
            <div key={src.l} onClick={() => fileRef.current.click()} style={{
              flex:1, background:T.surface, borderRadius:16, padding:'14px 0',
              textAlign:'center', cursor:'pointer', boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
              <div style={{ fontSize:24 }}>{src.e}</div>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginTop:4 }}>{src.l}</div>
            </div>
          ))}
        </div>

        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', display:'flex', flexDirection:'column', gap:16 }}>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Nome do exame</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Ex: Hemograma, Raio-X..."
                value={examName} onChange={e => setName(e.target.value)} />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data do exame</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:8 }}>
              <span>📅</span>
              <input style={inputStyle} placeholder="dd/mm/aaaa"
                value={date} onChange={e => setDate(maskDate(e.target.value))} inputMode="numeric" />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Veterinário responsável</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Nome do veterinário"
                value={vet} onChange={e => setVet(e.target.value)} />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Categoria</div>
            <div onClick={() => setShowCats(s => !s)} style={{ background:T.bgWash, borderRadius:14,
              padding:'13px 16px', display:'flex', justifyContent:'space-between',
              alignItems:'center', cursor:'pointer' }}>
              <span style={{ fontSize:14, color: catIdx !== null ? T.ink : T.inkSoft }}>
                {catIdx !== null ? CATS[catIdx] : 'Selecionar categoria...'}
              </span>
              <Icon d={I.chevR} size={16} color={T.inkSoft} />
            </div>
            {showCats && (
              <div style={{ marginTop:6, background:T.bgWash, borderRadius:14, overflow:'hidden' }}>
                {CATS.map((c, i) => (
                  <div key={c} onClick={() => { setCat(i); setShowCats(false); }}
                    style={{ padding:'12px 16px', fontSize:14, fontWeight:600,
                      color: catIdx===i ? T.brand : T.ink, cursor:'pointer',
                      background: catIdx===i ? T.brandSoft : 'transparent',
                      borderBottom: i < CATS.length-1 ? `1px solid ${T.hairline}` : 'none' }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={back} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          Salvar exame
        </button>
      </div>
    </div>
  );
}
