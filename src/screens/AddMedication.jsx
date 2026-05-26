import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, IconBtn, PetHeader } from '../components/Shared.jsx';

const TYPES = [
  { e:'💊', l:'Comprimido' },
  { e:'🧴', l:'Líquido' },
  { e:'💉', l:'Injeção' },
  { e:'🩹', l:'Tópico' },
];
const TYPE_EMOJI  = ['💊','🧴','💉','🩹'];
const TYPE_TINTS  = ['tintLavender','tintSky','tintMint','tintPeach'];

const FREQ_OPTIONS = ['1× ao dia','2× ao dia','3× ao dia','4× ao dia','A cada 8h','A cada 12h','Semanal','Quinzenal','Quando necessário'];
const UNIT_OPTIONS = ['mg','ml','g','comprimido','gota'];

const SUGGESTED_TIMES = {
  '1× ao dia':         ['08:00'],
  '2× ao dia':         ['08:00','20:00'],
  '3× ao dia':         ['07:00','15:00','23:00'],
  '4× ao dia':         ['06:00','12:00','18:00','00:00'],
  'A cada 8h':         ['06:00','14:00','22:00'],
  'A cada 12h':        ['08:00','20:00'],
  'Semanal':           ['09:00'],
  'Quinzenal':         ['09:00'],
  'Quando necessário': [],
};

// Auto-suggest end date: Semanal = 12 weeks, Quinzenal = 12 doses (24 weeks)
const FREQ_END_DAYS = { 'Semanal': 84, 'Quinzenal': 168 };

function addDaysToIso(isoDate, days) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function nextDoseDates(startIso, freqLabel, count = 4) {
  if (!startIso) return [];
  const intervalDays = freqLabel === 'Quinzenal' ? 14 : freqLabel === 'Semanal' ? 7 : 0;
  if (!intervalDays) return [];
  const dates = [];
  for (let i = 1; i <= count; i++) {
    dates.push(addDaysToIso(startIso, intervalDays * i));
  }
  return dates;
}

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

const selectStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, fontWeight:600, color:T.ink, fontFamily:FONT_BODY,
  appearance:'none', WebkitAppearance:'none', cursor:'pointer',
};

// HTML date input uses yyyy-mm-dd. Convert to/from dd/mm/yyyy used elsewhere in the app.
const isoToBr = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : '';
};

export default function AddMedication() {
  const { back } = useNav();
  const { addMedication } = usePet();
  const [type, setType]       = useState(0);
  const [name, setName]       = useState('');
  const [dose, setDose]       = useState('');
  const [unitIdx, setUnitIdx] = useState(0);
  const [freqIdx, setFreqIdx] = useState(1);
  const [startIso, setStartIso] = useState('');
  const [endIso, setEndIso]     = useState('');
  const [continuous, setCont] = useState(false);
  const [times, setTimes]     = useState(SUGGESTED_TIMES['2× ao dia']);
  const [reminders, setRem]   = useState(true);
  const [pushNotif, setPush]  = useState(true);
  const [alarm, setAlarm]     = useState(false);
  const [notes, setNotes]     = useState('');

  const handleFreqChange = (idx) => {
    setFreqIdx(idx);
    setTimes(SUGGESTED_TIMES[FREQ_OPTIONS[idx]] || []);
    const freq = FREQ_OPTIONS[idx];
    const days = FREQ_END_DAYS[freq];
    if (days && startIso) setEndIso(addDaysToIso(startIso, days));
    else if (!days && FREQ_END_DAYS[FREQ_OPTIONS[freqIdx]]) setEndIso('');
  };

  const handleStartChange = (iso) => {
    setStartIso(iso);
    const freq = FREQ_OPTIONS[freqIdx];
    const days = FREQ_END_DAYS[freq];
    if (days && iso) setEndIso(addDaysToIso(iso, days));
  };

  const updateTime = (i, value) => {
    setTimes(prev => prev.map((t, idx) => idx === i ? value : t));
  };
  const addTimeSlot = () => setTimes(prev => [...prev, '08:00']);
  const removeTimeSlot = (i) => setTimes(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (name.trim()) {
      addMedication({
        name: name.trim(),
        type,
        emoji: TYPE_EMOJI[type],
        tintKey: TYPE_TINTS[type],
        dose,
        unit: UNIT_OPTIONS[unitIdx],
        freq: FREQ_OPTIONS[freqIdx],
        startDate: isoToBr(startIso),
        endDate: isoToBr(endIso),
        continuous,
        times,
        reminders,
        pushNotif,
        alarm,
        notes: notes.trim(),
        on: true,
      });
    }
    back();
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, flex:1 }}>Adicionar medicamento</div>
        <PetHeader />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px',
        display:'flex', flexDirection:'column', gap:16 }}>

        {/* Dados do medicamento */}
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
              <div style={{ minWidth:100, background:T.brandSoft, borderRadius:14,
                padding:'13px 14px', display:'flex', alignItems:'center', gap:6 }}>
                <select value={unitIdx} onChange={e => setUnitIdx(parseInt(e.target.value))}
                  style={{ ...selectStyle, fontSize:14, fontWeight:700, color:T.brand }}>
                  {UNIT_OPTIONS.map((u, i) => <option key={u} value={i}>{u}</option>)}
                </select>
                <Icon d={I.chevD} size={14} color={T.brand} stroke={2.4} />
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Frequência</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <select value={freqIdx} onChange={e => handleFreqChange(parseInt(e.target.value))}
                style={selectStyle}>
                {FREQ_OPTIONS.map((f, i) => <option key={f} value={i}>{f}</option>)}
              </select>
              <Icon d={I.chevD} size={16} color={T.inkSoft} stroke={2} />
            </div>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Duração do tratamento</div>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'10px 14px' }}>
                <div style={{ fontSize:11, color:T.inkSoft, marginBottom:4 }}>📅 Início</div>
                <input type="date" value={startIso} onChange={e => handleStartChange(e.target.value)}
                  style={inputStyle({ fontSize:13, fontWeight:700, color: startIso ? T.ink : T.inkMute })} />
              </div>
              <div style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'10px 14px' }}>
                <div style={{ fontSize:11, color:T.inkSoft, marginBottom:4 }}>📅 Fim</div>
                <input type="date" value={endIso} onChange={e => setEndIso(e.target.value)}
                  disabled={continuous}
                  style={inputStyle({ fontSize:13, fontWeight:700,
                    color: endIso ? T.ink : T.inkMute,
                    opacity: continuous ? 0.4 : 1 })} />
              </div>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
            <span style={{ fontSize:14, fontWeight:600, color:T.ink }}>Uso contínuo</span>
            <Toggle on={continuous} onChange={setCont} />
          </div>

          {/* Next dose preview for weekly/biweekly frequencies */}
          {(() => {
            const freq = FREQ_OPTIONS[freqIdx];
            const preview = nextDoseDates(startIso, freq);
            if (!preview.length) return null;
            const fmt = (iso) => {
              const [y,m,d] = iso.split('-');
              return `${d}/${m}/${y}`;
            };
            return (
              <div style={{ background:T.brandSoft, borderRadius:14, padding:'12px 16px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.brand, marginBottom:6,
                  letterSpacing:0.8, textTransform:'uppercase' }}>
                  Próximas doses
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {preview.map((iso, i) => (
                    <span key={i} style={{ fontSize:12, fontWeight:700, color:T.brand,
                      background:'rgba(255,255,255,0.6)', borderRadius:99, padding:'3px 10px' }}>
                      {fmt(iso)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Horários */}
        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>⏰ Horários</span>
            <span onClick={addTimeSlot} style={{ fontSize:12, fontWeight:700, color:T.brand,
              cursor:'pointer' }}>+ Adicionar</span>
          </div>
          {times.length === 0 ? (
            <div style={{ fontSize:13, color:T.inkSoft, textAlign:'center', padding:'12px 0' }}>
              Nenhum horário fixo
            </div>
          ) : (
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {times.map((t, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:4,
                  background:T.brandSoft, borderRadius:99, padding:'4px 10px 4px 14px' }}>
                  <input type="time" value={t}
                    onChange={e => updateTime(i, e.target.value)}
                    style={{ border:'none', outline:'none', background:'transparent',
                      fontSize:14, fontWeight:700, color:T.brand, fontFamily:FONT_BODY,
                      width:76 }} />
                  <div onClick={() => removeTimeSlot(i)}
                    style={{ width:22, height:22, borderRadius:'50%',
                      background:'rgba(255,255,255,0.6)', display:'flex',
                      alignItems:'center', justifyContent:'center', cursor:'pointer',
                      fontSize:14, fontWeight:700, color:T.brand, lineHeight:1 }}>×</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lembretes */}
        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: reminders ? 14 : 0 }}>
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

        {/* Instruções */}
        <div style={{ background:T.surface, borderRadius:20, padding:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:8 }}>Instruções especiais (opcional)</div>
          <textarea
            style={{ width:'100%', minHeight:80, background:T.bgWash, borderRadius:14,
              padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
              border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
            placeholder="Ex: Dar com comida, não partir..."
            value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={handleSave} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          Salvar Medicamento
        </button>
      </div>
    </div>
  );
}
