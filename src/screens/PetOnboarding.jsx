import { useState, useRef } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, IconBtn } from '../components/Shared.jsx';
import { maskDate, parseYear } from '../utils/dateUtils.js';

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

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

export default function PetOnboarding() {
  const { nav, back } = useNav();
  const { addPet, setActivePetId } = usePet();
  const fileRef = useRef();

  const [name, setName]         = useState('');
  const [species, setSpecies]   = useState('Cachorro');
  const [breed, setBreed]       = useState('');
  const [birthDate, setBirth]   = useState('');
  const [sex, setSex]           = useState('Fêmea');
  const [weight, setWeight]     = useState('');
  const [photoPreview, setPhoto] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const handlePhotoChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleSave = async () => {
    if (!name.trim()) { setError('Informe o nome do pet.'); return; }
    setSaving(true);
    setError('');
    try {
      const birthYear = parseYear(birthDate);
      const newPet = await addPet({
        name: name.trim(),
        species: species === 'Cachorro' ? 'dog' : 'cat',
        sex: sex === 'Fêmea' ? 'female' : 'male',
        breed: breed.trim() || null,
        weight_kg: weight ? parseFloat(weight.replace(',', '.')) : null,
        birth_year: birthYear || null,
        photoDataUrl: photoPreview || null,
      });
      setActivePetId(newPet.id);
      nav('home');
    } catch (e) {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <span style={{ fontSize:13, fontWeight:700, color:T.inkSoft }}>Novo pet</span>
        <div style={{ width:36 }} />
      </div>

      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ height:4, background:T.brandSoft, borderRadius:4 }}>
          <div style={{ height:4, width:'100%', background:T.brand, borderRadius:4 }} />
        </div>
      </div>

      <div style={{ padding:'24px 20px 0' }}>
        <div style={{ fontSize:26, fontWeight:800, color:T.ink, lineHeight:1.25 }}>
          Vamos conhecer<br />seu pet! 🐾
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        {/* Photo picker */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
          <input ref={fileRef} type="file" accept="image/*"
            style={{ display:'none' }} onChange={handlePhotoChange} />
          <div onClick={() => fileRef.current.click()} style={{
            width:88, height:88, borderRadius:44,
            background: photoPreview ? 'transparent' : T.brandSoft,
            border: photoPreview ? 'none' : `2px dashed ${T.brand}`,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            cursor:'pointer', overflow:'hidden', position:'relative' }}>
            {photoPreview
              ? <img src={photoPreview} alt="foto"
                  style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <>
                  <div style={{ fontSize:28 }}>📷</div>
                  <div style={{ fontSize:10, fontWeight:600, color:T.brand, marginTop:2 }}>Adicionar foto</div>
                </>
            }
          </div>
          {photoPreview && (
            <div onClick={() => fileRef.current.click()}
              style={{ position:'relative', left:-28, bottom:-62,
                width:26, height:26, borderRadius:13, background:T.brand,
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', flexShrink:0 }}>
              <Icon d={I.edit} size={13} color="#fff" stroke={2.2} />
            </div>
          )}
        </div>

        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>🐾  Nome do pet</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Ex: Luna, Thor, Mel..."
                value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Espécie</div>
            <Seg
              options={['🐶  Cachorro','🐱  Gato']}
              value={species === 'Cachorro' ? '🐶  Cachorro' : '🐱  Gato'}
              onChange={v => setSpecies(v.includes('Cachorro') ? 'Cachorro' : 'Gato')}
            />
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Raça</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Ex: Golden, SRD, Siamês..."
                value={breed} onChange={e => setBreed(e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data de nascimento</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px', display:'flex', alignItems:'center', gap:8 }}>
              <span>📅</span>
              <input style={inputStyle} placeholder="dd/mm/aaaa"
                value={birthDate}
                onChange={e => setBirth(maskDate(e.target.value))}
                inputMode="numeric" />
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Sexo</div>
            <Seg
              options={['♂  Macho','♀  Fêmea']}
              value={sex === 'Fêmea' ? '♀  Fêmea' : '♂  Macho'}
              onChange={v => setSex(v.includes('Fêmea') ? 'Fêmea' : 'Macho')}
            />
          </div>

          <div style={{ marginBottom:4 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Peso (kg)</div>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
                <input style={{ ...inputStyle, fontSize:18, fontWeight:700 }}
                  placeholder="0.0" value={weight}
                  onChange={e => setWeight(e.target.value)} inputMode="decimal" />
              </div>
              <div style={{ width:72, background:T.brandSoft, borderRadius:14, padding:'13px 0',
                textAlign:'center', fontSize:14, fontWeight:700, color:T.brand }}>kg</div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ marginTop:12, padding:'10px 16px', background:'#FEE2E2', borderRadius:12,
            fontSize:13, fontWeight:600, color:'#B91C1C' }}>{error}</div>
        )}
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={handleSave} disabled={saving} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background: saving ? T.brandSoft : T.brand,
          color: saving ? T.brand : '#fff',
          fontSize:16, fontWeight:700, fontFamily:FONT_BODY, cursor: saving ? 'default' : 'pointer' }}>
          {saving ? 'Salvando...' : 'Adicionar pet'}
        </button>
        <div onClick={back} style={{ textAlign:'center', marginTop:12, fontSize:14,
          fontWeight:600, color:T.inkSoft, cursor:'pointer' }}>
          Cancelar
        </div>
      </div>
    </div>
  );
}
