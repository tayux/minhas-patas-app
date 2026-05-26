import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, PetHeader } from '../components/Shared.jsx';

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

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

function ConfigForm({ onSave, onCancel }) {
  const [brand, setBrand]   = useState('');
  const [amount, setAmount] = useState('');
  const [meals, setMeals]   = useState('3');
  const [time1, setTime1]   = useState('07:00');
  const [time2, setTime2]   = useState('12:00');
  const [time3, setTime3]   = useState('18:00');
  const [notes, setNotes]   = useState('');

  const timesForMeals = () => {
    const n = parseInt(meals) || 1;
    const times = [time1, time2, time3].slice(0, n);
    return times;
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px', maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, marginBottom:20 }}>
          Configurar alimentação
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Nome da ração</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Ex: Premier Sênior, Royal Canin..."
                value={brand} onChange={e => setBrand(e.target.value)} autoFocus />
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Porção por refeição (g)</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:8 }}>
              <input style={{ ...inputStyle, fontSize:18, fontWeight:700 }}
                placeholder="120" value={amount} onChange={e => setAmount(e.target.value)}
                inputMode="numeric" />
              <span style={{ fontSize:13, fontWeight:700, color:T.inkSoft }}>g</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Número de refeições por dia</div>
            <div style={{ display:'flex', background:T.bgWash, borderRadius:14, padding:3, gap:3 }}>
              {['1','2','3','4'].map(n => {
                const a = meals === n;
                return (
                  <div key={n} onClick={() => setMeals(n)} style={{
                    flex:1, textAlign:'center', padding:'10px 0', borderRadius:11,
                    background: a ? T.surface : 'transparent',
                    fontWeight: a?700:500, fontSize:14, color: a?T.ink:T.inkSoft,
                    cursor:'pointer', fontFamily:FONT_BODY,
                    boxShadow: a ? '0 2px 8px rgba(20,20,30,0.10)' : 'none' }}>{n}</div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:10 }}>Horários</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { n:1, l:'1ª refeição', v:time1, set:setTime1 },
                { n:2, l:'2ª refeição', v:time2, set:setTime2, hide: parseInt(meals) < 2 },
                { n:3, l:'3ª refeição', v:time3, set:setTime3, hide: parseInt(meals) < 3 },
              ].filter(r => !r.hide).map((r) => (
                <div key={r.n} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, minWidth:80 }}>{r.l}</div>
                  <div style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'10px 16px' }}>
                    <input style={inputStyle} placeholder="hh:mm"
                      value={r.v} onChange={e => r.set(e.target.value)} inputMode="numeric" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Observações (opcional)</div>
            <textarea style={{ width:'100%', minHeight:60, background:T.bgWash, borderRadius:14,
              padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
              border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
              placeholder="Alergias, restrições, suplementos..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:20 }}>
          <button onClick={onCancel} style={{ flex:1, height:48, borderRadius:99,
            background:T.surface, color:T.ink, border:'none',
            fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Cancelar
          </button>
          <button onClick={() => onSave({ brand, amount, meals, times: timesForMeals(), notes })}
            style={{ flex:1.5, height:48, borderRadius:99,
              background:T.brand, color:'#fff', border:'none',
              fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Feeding() {
  const { back } = useNav();
  const { activePet, feedingConfig, setFeedingConfig } = usePet();
  const [showForm, setShowForm] = useState(false);
  const [doneMap, setDoneMap]   = useState({});

  const handleSave = (config) => {
    setFeedingConfig(config);
    setShowForm(false);
  };
  const toggleDone = (i) => setDoneMap(prev => ({ ...prev, [i]: !prev[i] }));

  if (!feedingConfig) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, flex:1 }}>Alimentação</div>
        <PetHeader />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:64 }}>🥣</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>
          Alimentação não configurada
        </div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Configure a ração, quantidade e horários das refeições do seu pet para acompanhar a rotina alimentar.
        </div>
        <button onClick={() => setShowForm(true)} style={{
          marginTop:8, padding:'12px 28px', borderRadius:99,
          background:T.brand, color:'#fff', border:'none',
          fontSize:15, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Configurar alimentação
        </button>
      </div>
      {showForm && <ConfigForm onSave={handleSave} onCancel={() => setShowForm(false)} />}
    </div>
  );

  const { brand, amount, meals, times, notes } = feedingConfig;
  const mealList = Array.from({ length: parseInt(meals) || 1 }, (_, i) => ({
    label: i === 0 ? '☀️ Manhã' : i === 1 ? '🌤️ Almoço' : '🌙 Noite',
    time: times?.[i] || '--:--',
    amount,
  }));
  const doneCount = mealList.filter((_, i) => doneMap[i]).length;

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Alimentação</div>
        <div style={{ flex:1 }} />
        <button onClick={() => setShowForm(true)} className="btn-press" style={{
          border:'none', background:T.bgWash, color:T.ink,
          borderRadius:99, padding:'6px 14px', fontSize:12, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>Editar</button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
        {/* Ration card */}
        <div style={{ background:T.surface, borderRadius:20, padding:20, marginBottom:16,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:4 }}>
            🥣 {brand || 'Ração'}
          </div>
          <div style={{ fontSize:13, color:T.inkSoft, marginBottom:8 }}>
            {amount ? `${amount}g por refeição` : 'Porção não definida'} · {meals} {parseInt(meals) === 1 ? 'refeição' : 'refeições'}/dia
          </div>
          {notes ? (
            <div style={{ fontSize:12, color:T.inkMute, fontStyle:'italic' }}>{notes}</div>
          ) : null}
        </div>

        {/* Today's meals */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>
          Refeições de hoje · {doneCount}/{mealList.length}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {mealList.map((m, i) => (
            <div key={i} onClick={() => toggleDone(i)} style={{
              background:T.surface, borderRadius:16, padding:'14px 16px',
              display:'flex', alignItems:'center', gap:12, cursor:'pointer',
              opacity: doneMap[i] ? 0.55 : 1,
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:24 }}>{m.label.split(' ')[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink,
                  textDecoration: doneMap[i] ? 'line-through' : 'none' }}>
                  {m.label.replace(/^[^ ]+ /, '')}
                </div>
                <div style={{ fontSize:12, color:T.inkSoft }}>{m.time} · {m.amount ? `${m.amount}g` : 'porção'}</div>
              </div>
              <div style={{ width:28, height:28, borderRadius:14,
                background: doneMap[i] ? '#DCFCE7' : T.bgWash,
                border: `1.5px solid ${doneMap[i] ? '#16A34A' : T.hairlineStrong}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700, color:'#16A34A', transition:'all 0.15s' }}>
                {doneMap[i] ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && <ConfigForm onSave={handleSave} onCancel={() => setShowForm(false)} />}
    </div>
  );
}
