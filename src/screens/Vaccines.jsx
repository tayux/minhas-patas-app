import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, Icon, PetHeader } from '../components/Shared.jsx';

function VaccineDetail({ vaccine, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ fontSize:36 }}>💉</div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink }}>{vaccine.name}</div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>
              {vaccine.date ? `Aplicada em ${vaccine.date}` : 'Data não informada'}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {vaccine.date && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.bgWash, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Data de aplicação</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{vaccine.date}</span>
            </div>
          )}
          {vaccine.nextDate && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.brandSoft, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.brand }}>Próximo reforço</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.brand }}>{vaccine.nextDate}</span>
            </div>
          )}
          {vaccine.lot && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.bgWash, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Lote</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{vaccine.lot}</span>
            </div>
          )}
          {vaccine.vet && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.bgWash, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Veterinário</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{vaccine.vet}</span>
            </div>
          )}
          <div style={{ padding:'12px 16px', background:'#DCFCE7', borderRadius:14,
            display:'flex', alignItems:'center', gap:8 }}>
            <span>✅</span>
            <span style={{ fontSize:13, fontWeight:700, color:'#16A34A' }}>Vacina registrada</span>
          </div>
        </div>
        <button onClick={onClose} style={{ width:'100%', height:48, borderRadius:99, marginTop:20,
          background:T.surface, color:T.ink, border:'none',
          fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const [d, m, y] = dateStr.split('/');
  if (!d || !m || !y) return false;
  return new Date(+y, +m - 1, +d) < new Date(new Date().toDateString());
}

export default function Vaccines() {
  const { back, nav } = useNav();
  const { activePet, vaccines } = usePet();
  const [detail, setDetail] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>🛡️</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Sem vacinas registradas</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para controlar o calendário de vacinas.
        </div>
      </div>
    </div>
  );

  const sorted   = [...vaccines].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const upcoming = sorted.filter(v => v.nextDate);

  if (vaccines.length === 0) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, flex:1 }}>Vacinas</div>
        <PetHeader />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:'0 32px 80px', textAlign:'center' }}>
        <div style={{ fontSize:64 }}>💉</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>
          Nenhuma vacina registrada
        </div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Registre as vacinas do seu pet para acompanhar o calendário e receber lembretes de reforço.
        </div>
      </div>
      {FabMenu({ fabOpen, setFabOpen, nav })}
    </div>
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, flex:1 }}>Vacinas</div>
        <PetHeader />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 96px' }}>
        {/* Passport */}
        <div style={{ borderRadius:24, padding:20, marginBottom:20,
          background:`linear-gradient(135deg, ${T.brand} 0%, #9B86FD 100%)`,
          boxShadow:`0 8px 24px rgba(124,107,252,0.35)` }}>
          <div style={{ display:'flex', gap:14 }}>
            <div style={{ width:80, height:100, background:'rgba(255,255,255,0.2)', borderRadius:16,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>🐾</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)', marginBottom:2 }}>Passaporte Vacinal</div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{activePet.name}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:12 }}>
                {activePet.breed} · {activePet.gender.split(' ·')[0]}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {sorted.slice(0, 4).map((v, i) => (
                  <div key={i} style={{ padding:'5px 10px', borderRadius:8,
                    background:'rgba(255,255,255,0.2)',
                    fontSize:10, fontWeight:700, color:'#fff' }}>{v.name} ✓</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Próximas doses</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
              {upcoming.map((v) => (
                <div key={v.id} onClick={() => setDetail(v)}
                  style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
                    display:'flex', alignItems:'center', gap:12, cursor:'pointer',
                    boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
                  <div style={{ fontSize:26 }}>💉</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{v.name}</div>
                    <div style={{ fontSize:12, color:T.inkSoft }}>Próxima: {v.nextDate}</div>
                  </div>
                  {isOverdue(v.nextDate) ? (
                    <div style={{ padding:'5px 12px', background:'#FEE2E2', borderRadius:99,
                      fontSize:11, fontWeight:700, color:'#EF4444' }}>Atrasada</div>
                  ) : (
                    <div style={{ padding:'5px 12px', background:'#DCFCE7', borderRadius:99,
                      fontSize:11, fontWeight:700, color:'#16A34A' }}>Em dia</div>
                  )}
                  <Icon d={I.chevR} size={16} color={T.inkMute} stroke={2} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* History */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Histórico</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {sorted.map((v) => (
            <div key={v.id} onClick={() => setDetail(v)}
              style={{ background:T.surface, borderRadius:14, padding:'13px 16px',
                display:'flex', alignItems:'center', gap:12, cursor:'pointer',
                boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:22 }}>✅</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{v.name}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>
                  {v.date || '—'}{v.lot ? ` · Lote: ${v.lot}` : ''}
                </div>
                {v.vet && <div style={{ fontSize:11, color:T.inkMute }}>Dr.: {v.vet}</div>}
              </div>
              <Icon d={I.chevR} size={16} color={T.inkMute} stroke={2} />
            </div>
          ))}
        </div>
      </div>

      {FabMenu({ fabOpen, setFabOpen, nav })}
      {detail && <VaccineDetail vaccine={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function FabMenu({ fabOpen, setFabOpen, nav }) {
  return (
    <>
      {fabOpen && (
        <div style={{ position:'absolute', bottom:96, right:20, display:'flex', flexDirection:'column',
          alignItems:'flex-end', gap:10, zIndex:100 }}>
          {[
            { label:'Cadastrar manualmente', emoji:'✏️', action: () => { nav('addvaccine'); setFabOpen(false); } },
            { label:'Ler cartão de vacina', emoji:'📷', action: () => { nav('ai'); setFabOpen(false); } },
          ].map(o => (
            <div key={o.label} onClick={o.action}
              style={{ display:'flex', alignItems:'center', gap:10, background:T.bg,
                borderRadius:99, padding:'10px 16px 10px 12px',
                boxShadow:'0 4px 16px rgba(20,20,30,0.15)', cursor:'pointer' }}>
              <span style={{ fontSize:18 }}>{o.emoji}</span>
              <span style={{ fontSize:14, fontWeight:700, color:T.ink }}>{o.label}</span>
            </div>
          ))}
        </div>
      )}
      {fabOpen && <div onClick={() => setFabOpen(false)} style={{ position:'fixed', inset:0, zIndex:99 }} />}
      <div onClick={() => setFabOpen(v => !v)}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56, borderRadius:28,
          background: fabOpen ? T.inkSoft : T.ink, color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)',
          fontSize:28, transition:'background 0.2s, transform 0.2s',
          transform: fabOpen ? 'rotate(45deg)' : 'none', zIndex:101 }}>+</div>
    </>
  );
}
