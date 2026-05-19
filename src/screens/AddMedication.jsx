import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, IconBtn } from '../components/Shared.jsx';
import { maskDate } from '../utils/dateUtils.js';

const TYPES = [
  { e:'💊', l:'Comprimido' },
  { e:'🧴', l:'Líquido' },
  { e:'💉', l:'Injeção' },
  { e:'🩹', l:'Tópico' },
];
const TYPE_EMOJI  = ['💊','🧴','💉','🩹'];
const TYPE_TINTS  = ['tintLavender','tintSky','tintMint','tintPeach'];

const FREQ_OPTIONS = ['1× ao dia','2× ao dia','3× ao dia','4× ao dia','A cada 8h','A cada 12h','Semanal','Quando necessário'];
const UNIT_OPTIONS = ['mg','ml','g','comprimido','gota'];

function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{
      width:44, height:24, borderRadius:12, position:'relative', cursor:'pointer',
      background: on ? T.brand : '#D0CDD7', transition:'background 0.22s' }}>
      <div style={{ position:'absolute', top:2, left: on?22:2, width:20, height:20,
        borderRadius:10, background:'#fff', transition:'left 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow:'0 1px 4px rgba(0,0,0,0.18)' }} />
    </div>
  );
}

const inputStyle = (extra = {}) => ({
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY, ...extra,
});

export default function AddMedication() {
  const { back } = useNav();
  const { addMedication } = usePet();
  const [step, setStep]       = useState(1);
  const [type, setType]       = useState(0);
  const [name, setName]       = useState('');
  const [active, setActive]   = useState('');
  const [dose, setDose]       = useState('');
  const [unitIdx, setUnitIdx] = useState(0);
  const [freqIdx, setFreqIdx] = useState(1);
  const [startDate, setStart] = useState('');
  const [endDate, setEnd]     = useState('');
  const [continuous, setCont] = useState(false);
  const [reminders, setRem]   = useState(true);
  const [pushNotif, setPush]  = useState(true);
  const [alarm, setAlarm]     = useState(false);
  const [notes, setNotes]     = useState('');

  const cycleUnit = () => setUnitIdx(i => (i + 1) % UNIT_OPTIONS.length);
  const cycleFreq = () => setFreqIdx(i => (i + 1) % FREQ_OPTIONS.length);

  const handleSave = () => {
    if (name.trim()) {
      addMedication({
        name: name.trim(),
        active: active.trim(),
        type,
        emoji: TYPE_EMOJI[type],
        tintKey: TYPE_TINTS[type],
        dose: dose,
        unit: UNIT_OPTIONS[unitIdx],
        freq: FREQ_OPTIONS[freqIdx],
        startDate,
        endDate,
        continuous,
        notes: notes.trim(),
        on: true,
      });
    }
    back();
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={step===1 ? back : () => setStep(1)} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Adicionar medicamento</div>
      </div>

      <div style={{ padding:'12px 20px 0' }}>
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:6 }}>
          <span style={{ fontSize:11, fontWeight:600, color:T.inkSoft }}>Passo {step} de 2</span>
        </div>
        <div style={{ height:4, background:T.brandSoft, borderRadius:4 }}>
          <div style={{ height:4, width: step===1?'50%':'100%', background:T.brand, borderRadius:4, transition:'width 0.3s' }} />
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        {step === 1 && (
          <div style={{ background:T.surface, borderRadius:20, padding:20,
            boxShadow:'0 4px 20px rgba(20,20,30,0.07)', display:'flex', flexDirection:'column', gap:18 }}>

            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Nome do medicamento</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
                <input style={inputStyle()} placeholder="Ex: Prednisolona, Amoxicilina..."
                  value={name} onChange={e => setName(e.target.value)} autoFocus />
              </div>
            </div>

            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Princípio ativo (opcional)</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
                <input style={inputStyle()} placeholder="Buscar princípio ativo..."
                  value={active} onChange={e => setActive(e.target.value)} />
              </div>
            </div>

            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:8 }}>Tipo</div>
              <div style={{ display:'flex', gap:6, background:T.bgWash, borderRadius:16, padding:3 }}>
                {TYPES.map((tp, i) => (
                  <div key={i} onClick={() => setType(i)} style={{
                    flex:1, textAlign:'center', padding:'8px 0', borderRadius:13, cursor:'pointer',
                    background: type===i ? T.surface : 'transparent',
                    boxShadow: type===i ? '0 2px 8px rgba(20,20,30,0.10)' : 'none',
                    transition:'all 0.15s' }}>
                    <div style={{ fontSize:18 }}>{tp.e}</div>
                    <div style={{ fontSize:9, fontWeight: type===i?700:500, color: type===i?T.ink:T.inkSoft, marginTop:2 }}>
                      {tp.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Dose</div>
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
                  <input style={inputStyle({ fontSize:18, fontWeight:700 })}
                    placeholder="0" value={dose} onChange={e => setDose(e.target.value)} inputMode="decimal" />
                </div>
                <div onClick={cycleUnit} style={{ minWidth:80, background:T.brandSoft, borderRadius:14,
                  padding:'13px 0', textAlign:'center', fontSize:14, fontWeight:700,
                  color:T.brand, cursor:'pointer' }}>{UNIT_OPTIONS[unitIdx]}  ›</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Frequência</div>
              <div onClick={cycleFreq} style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
                display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}>
                <span style={{ fontSize:14, fontWeight:600, color:T.ink }}>{FREQ_OPTIONS[freqIdx]}</span>
                <Icon d={I.chevR} size={16} color={T.inkSoft} />
              </div>
            </div>

            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Duração do tratamento</div>
              <div style={{ display:'flex', gap:10 }}>
                {[{l:'📅 Início', v:startDate, set:setStart},{l:'📅 Fim', v:endDate, set:setEnd}].map(d => (
                  <div key={d.l} style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:T.inkSoft, marginBottom:4 }}>{d.l}</div>
                    <input style={inputStyle({ fontSize:13, fontWeight:700 })}
                      placeholder="dd/mm/aaaa" value={d.v}
                      onChange={e => d.set(maskDate(e.target.value))}
                      inputMode="numeric" />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <span style={{ fontSize:14, fontWeight:600, color:T.ink }}>Uso contínuo</span>
              <Toggle on={continuous} onChange={setCont} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:T.surface, borderRadius:20, padding:20,
              boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>
                🤖  Horários sugeridos pela IA
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['07:00','15:00','23:00'].map(h => (
                  <div key={h} style={{ padding:'8px 18px', background:T.brandSoft, borderRadius:99,
                    fontSize:14, fontWeight:700, color:T.brand, cursor:'pointer' }}>{h}</div>
                ))}
              </div>
            </div>

            <div style={{ background:T.surface, borderRadius:20, padding:20,
              boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <span style={{ fontSize:14, fontWeight:700, color:T.ink }}>🔔  Lembretes</span>
                <Toggle on={reminders} onChange={setRem} />
              </div>
              {reminders && (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[{l:'Notificação push', on:pushNotif, set:setPush},{l:'Alarme sonoro', on:alarm, set:setAlarm}].map((r,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'center', padding:'10px 14px', background:T.bgWash, borderRadius:12 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.l}</span>
                      <Toggle on={r.on} onChange={r.set} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background:T.surface, borderRadius:20, padding:20,
              boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Instruções especiais</div>
              <textarea
                style={{ width:'100%', minHeight:80, background:T.bgWash, borderRadius:14,
                  padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
                  border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
                placeholder="Ex: Dar com comida, não partir..."
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={step===1 ? () => setStep(2) : handleSave} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          {step===1 ? 'Continuar  →' : 'Salvar Medicamento'}
        </button>
      </div>
    </div>
  );
}
