import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, IconBtn } from '../components/Shared.jsx';

const TYPES = [
  { e:'💊', l:'Comprimido' },
  { e:'🧴', l:'Líquido' },
  { e:'💉', l:'Injeção' },
  { e:'🩹', l:'Tópico' },
];

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

export default function AddMedication() {
  const { back } = useNav();
  const [step, setStep] = useState(1);
  const [type, setType] = useState(0);
  const [continuous, setContinuous] = useState(false);
  const [reminders, setReminders] = useState(true);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={step===1 ? back : () => setStep(1)} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Adicionar medicamento</div>
      </div>

      {/* Progress */}
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
            {/* Name */}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Nome do medicamento</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px', fontSize:14, color:T.inkSoft }}>
                Ex: Prednisolona, Amoxicilina...
              </div>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Princípio ativo (opcional)</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px', fontSize:14, color:T.inkSoft }}>
                Buscar princípio ativo...
              </div>
            </div>

            {/* Type */}
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

            {/* Dose */}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Dose</div>
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'13px 16px',
                  fontSize:18, fontWeight:700, color:T.ink }}>10</div>
                <div style={{ width:80, background:T.brandSoft, borderRadius:14, padding:'13px 0',
                  textAlign:'center', fontSize:14, fontWeight:700, color:T.brand }}>mg  ›</div>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Frequência</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px',
                display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:14, fontWeight:600, color:T.ink }}>2× ao dia</span>
                <Icon d={I.chevR} size={16} color={T.inkSoft} />
              </div>
            </div>

            {/* Duration */}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Duração do tratamento</div>
              <div style={{ display:'flex', gap:10 }}>
                {[{l:'📅 Início',v:'14/05/2025'},{l:'📅 Fim',v:'28/05/2025'}].map(d => (
                  <div key={d.l} style={{ flex:1, background:T.bgWash, borderRadius:14, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:T.inkSoft }}>{d.l}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginTop:2 }}>{d.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continuous */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <span style={{ fontSize:14, fontWeight:600, color:T.ink }}>Uso contínuo</span>
              <Toggle on={continuous} onChange={setContinuous} />
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
                <Toggle on={reminders} onChange={setReminders} />
              </div>
              {reminders && (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[{l:'Notificação push',on:true},{l:'Alarme sonoro',on:false}].map((r,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'center', padding:'10px 14px', background:T.bgWash, borderRadius:12 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.l}</span>
                      <Toggle on={r.on} onChange={() => {}} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background:T.surface, borderRadius:20, padding:20,
              boxShadow:'0 4px 20px rgba(20,20,30,0.07)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Instruções especiais</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px', minHeight:80,
                fontSize:14, color:T.inkSoft }}>Ex: Dar com comida, não partir...</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button onClick={step===1 ? () => setStep(2) : back} className="btn-press" style={{
          width:'100%', height:52, borderRadius:100, border:'none',
          background:T.brand, color:'#fff', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          {step===1 ? 'Continuar  →' : 'Salvar Medicamento'}
        </button>
      </div>
    </div>
  );
}
