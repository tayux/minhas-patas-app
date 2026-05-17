import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, IconBtn } from '../components/Shared.jsx';

function Seg({ options, value, onChange }) {
  return (
    <div style={{ display:'flex', background:T.bgWash, borderRadius:14, padding:3, gap:3 }}>
      {options.map(o => {
        const a = value === o;
        return (
          <div key={o} onClick={() => onChange(o)} style={{
            flex:1, textAlign:'center', padding:'10px 0', borderRadius:11,
            background: a ? T.surface : 'transparent',
            fontWeight: a ? 700 : 500, fontSize:14, color: a ? T.ink : T.inkSoft,
            cursor:'pointer', fontFamily:FONT_BODY,
            boxShadow: a ? '0 2px 8px rgba(20,20,30,0.10)' : 'none',
            transition:'all 0.18s',
          }}>{o}</div>
        );
      })}
    </div>
  );
}

function Field({ label, placeholder, icon }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>{label}</div>
      <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
        display:'flex', alignItems:'center', gap:8, fontSize:14, color:T.inkSoft }}>
        {icon && <span>{icon}</span>}
        <span>{placeholder}</span>
      </div>
    </div>
  );
}

export default function PetOnboarding() {
  const { nav, back } = useNav();
  const [species, setSpecies] = useState('Cachorro');
  const [sex, setSex] = useState('Fêmea');

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <span style={{ fontSize:13, fontWeight:700, color:T.inkSoft }}>Novo pet</span>
        <div style={{ width:36 }} />
      </div>

      {/* Progress */}
      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:600, color:T.inkSoft }}>Passo 1 de 3</span>
        </div>
        <div style={{ height:4, background:T.brandSoft, borderRadius:4 }}>
          <div style={{ height:4, width:'33%', background:T.brand, borderRadius:4 }} />
        </div>
      </div>

      <div style={{ padding:'24px 20px 0' }}>
        <div style={{ fontSize:26, fontWeight:800, color:T.ink, lineHeight:1.25 }}>
          Vamos conhecer<br />seu pet! 🐾
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        {/* Photo */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
          <div style={{
            width:88, height:88, borderRadius:44, background:T.brandSoft,
            border:`2px dashed ${T.brand}`, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <div style={{ fontSize:28 }}>📷</div>
            <div style={{ fontSize:10, fontWeight:600, color:T.brand, marginTop:2 }}>Adicionar foto</div>
          </div>
        </div>

        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
          <Field label="🐾  Nome do pet" placeholder="Ex: Luna, Thor, Mel..." />

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Espécie</div>
            <Seg options={['🐶  Cachorro','🐱  Gato']} value={'🐶  '+species} onChange={v => setSpecies(v.replace('🐶  ','').replace('🐱  ',''))} />
          </div>

          <Field label="Raça" placeholder="Buscar raça ou SRD..." />
          <Field label="Data de nascimento" placeholder="📅  dd / mm / aaaa" />

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Sexo</div>
            <Seg options={['♂  Macho','♀  Fêmea']} value={'♀  '+sex} onChange={v => setSex(v.replace('♂  ','').replace('♀  ',''))} />
          </div>

          <div style={{ marginBottom:4 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Peso (kg)</div>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'13px 16px',
                fontSize:18, fontWeight:700, color:T.ink }}>0.0</div>
              <div style={{ width:72, background:T.brandSoft, borderRadius:14, padding:'13px 0',
                textAlign:'center', fontSize:14, fontWeight:700, color:T.brand }}>kg</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={() => nav('home')} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          Continuar
        </button>
        <div style={{ textAlign:'center', marginTop:12, fontSize:14,
          fontWeight:600, color:T.inkSoft, cursor:'pointer' }}>
          Pular por agora
        </div>
      </div>
    </div>
  );
}
