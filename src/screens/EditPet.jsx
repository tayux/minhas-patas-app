import { useState, useRef, useCallback } from 'react';
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

// Resize + compress a data URL to max `maxPx` on the long edge, jpeg quality `q`.
function compressImage(dataUrl, maxPx = 600, q = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', q));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function Toast({ message, type = 'success' }) {
  const bg    = type === 'success' ? '#DCFCE7' : '#FEE2E2';
  const color = type === 'success' ? '#16A34A' : '#B91C1C';
  return (
    <div style={{
      position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
      background:bg, color, borderRadius:99, padding:'10px 20px',
      fontSize:13, fontWeight:700, fontFamily:FONT_BODY,
      boxShadow:'0 4px 16px rgba(20,20,30,0.12)', zIndex:500,
      whiteSpace:'nowrap', animation:'slideInUp 0.28s cubic-bezier(0.22,0.61,0.36,1) both',
    }}>
      {type === 'success' ? '✓ ' : '⚠ '}{message}
    </div>
  );
}

export default function EditPet() {
  const { back } = useNav();
  const { activePet, updatePet } = usePet();
  const fileRef = useRef();

  const pet = activePet || {};
  const initSpecies  = pet.species === 'cat' ? 'Gato' : 'Cachorro';
  const initSex      = pet.sex === 'male' ? 'Macho' : 'Fêmea';
  const initNeutered = /castrad[oa]\b/i.test(pet.gender || '') && !/não/i.test(pet.gender || '') ? 'Sim' : 'Não';
  const initWeight   = pet.weight_kg ? String(pet.weight_kg) : '';
  const initBirth    = pet.birth_year ? `01/01/${pet.birth_year}` : '';
  const initBreed    = (!pet.breed || pet.breed === 'SRD') ? '' : pet.breed;

  const [name, setName]           = useState(pet.name || '');
  const [species, setSpecies]     = useState(initSpecies);
  const [breed, setBreed]         = useState(initBreed);
  const [birthDate, setBirth]     = useState(initBirth);
  const [sex, setSex]             = useState(initSex);
  const [neutered, setNeutered]   = useState(initNeutered);
  const [weight, setWeight]       = useState(initWeight);
  const [photoPreview, setPhoto]  = useState(pet.photoUrl || null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [toast, setToast]         = useState(null); // { message, type }
  const [compressing, setCompress] = useState(false);

  if (!activePet) return null;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePhotoChange = useCallback(async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCompress(true);
    setError('');
    try {
      const reader = new FileReader();
      const raw = await new Promise((res, rej) => {
        reader.onload = ev => res(ev.target.result);
        reader.onerror = rej;
        reader.readAsDataURL(f);
      });
      const compressed = await compressImage(raw);
      setPhoto(compressed);
    } catch {
      setError('Não foi possível processar a foto. Tente outra imagem.');
    } finally {
      setCompress(false);
      // Reset input so the same file can be re-selected
      e.target.value = '';
    }
  }, []);

  const handleSave = async () => {
    if (!name.trim()) { setError('Informe o nome do pet.'); return; }
    setSaving(true);
    setError('');
    try {
      const birthYear   = parseYear(birthDate);
      const isNewPhoto  = photoPreview && photoPreview !== pet.photoUrl;
      await updatePet(activePet.id, {
        name:         name.trim(),
        species:      species === 'Cachorro' ? 'dog' : 'cat',
        sex:          sex === 'Fêmea' ? 'female' : 'male',
        neutered:     neutered === 'Sim',
        breed:        breed.trim() || null,
        weight_kg:    weight ? parseFloat(weight.replace(',', '.')) : null,
        birth_year:   birthYear || null,
        photoDataUrl: isNewPhoto ? photoPreview : undefined,
      });
      showToast('Alterações salvas!');
      setTimeout(back, 1200);
    } catch (e) {
      if (e.message === 'photo:quota') {
        // API succeeded but photo didn't fit in localStorage — data saved, only photo failed
        showToast('Dados salvos! Foto não cabe no armazenamento — tente uma imagem menor.', 'error');
        setTimeout(back, 2500);
      } else if (e.message?.startsWith('api:')) {
        const code = e.message.split(':')[1];
        setError(
          code === '404' ? 'Pet não encontrado. Tente recarregar o app.' :
          code === '413' ? 'Dados muito grandes. Tente uma foto menor.' :
          `Erro ao salvar (${code}). Verifique sua conexão e tente novamente.`
        );
      } else {
        setError('Não foi possível salvar. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <span style={{ fontSize:13, fontWeight:700, color:T.inkSoft }}>Editar perfil</span>
        <div style={{ width:36 }} />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        {/* Photo picker */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
          <input ref={fileRef} type="file" accept="image/*"
            style={{ display:'none' }} onChange={handlePhotoChange} />
          <div onClick={() => !compressing && fileRef.current.click()} style={{
            width:88, height:88, borderRadius:44,
            background: photoPreview ? 'transparent' : T.brandSoft,
            border: photoPreview ? 'none' : `2px dashed ${T.brand}`,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            cursor: compressing ? 'wait' : 'pointer',
            overflow:'hidden', position:'relative',
            opacity: compressing ? 0.6 : 1,
            transition:'opacity 0.2s',
          }}>
            {compressing ? (
              <div style={{ fontSize:13, fontWeight:600, color:T.brand }}>...</div>
            ) : photoPreview ? (
              <img src={photoPreview} alt="foto"
                style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              <>
                <div style={{ fontSize:28 }}>📷</div>
                <div style={{ fontSize:10, fontWeight:600, color:T.brand, marginTop:2 }}>Adicionar foto</div>
              </>
            )}
          </div>
          {photoPreview && !compressing && (
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

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Castrado(a)?</div>
            <Seg options={['Sim','Não']} value={neutered} onChange={setNeutered} />
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
          <div style={{ marginTop:12, padding:'12px 16px', background:'#FEE2E2', borderRadius:14,
            fontSize:13, fontWeight:600, color:'#B91C1C', lineHeight:1.5 }}>
            ⚠ {error}
          </div>
        )}
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={handleSave} disabled={saving || compressing} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background: (saving || compressing) ? T.brandSoft : T.brand,
          color: (saving || compressing) ? T.brand : '#fff',
          fontSize:16, fontWeight:700, fontFamily:FONT_BODY,
          cursor: (saving || compressing) ? 'default' : 'pointer' }}>
          {compressing ? 'Processando foto...' : saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <div onClick={back} style={{ textAlign:'center', marginTop:12, fontSize:14,
          fontWeight:600, color:T.inkSoft, cursor:'pointer' }}>
          Cancelar
        </div>
      </div>
    </div>
  );
}
