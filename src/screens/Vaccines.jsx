import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

export default function Vaccines() {
  const { back, nav } = useNav();
  const { activePet, vaccines } = usePet();

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

  if (vaccines.length === 0) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Vacinas</div>
        <div style={{ flex:1 }} />
        <button onClick={() => nav('addvaccine')} className="btn-press" style={{
          border:'none', background:T.brandSoft, color:T.brand,
          borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>+ Registrar</button>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:64 }}>💉</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>
          Nenhuma vacina registrada
        </div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Registre as vacinas do seu pet para acompanhar o calendário e receber lembretes de reforço.
        </div>
        <button onClick={() => nav('addvaccine')} style={{
          marginTop:8, padding:'12px 28px', borderRadius:99,
          background:T.brand, color:'#fff', border:'none',
          fontSize:15, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
          + Registrar primeira vacina
        </button>
      </div>
    </div>
  );

  // Sort: most recent first
  const sorted = [...vaccines].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  const upcoming = sorted.filter(v => v.nextDate);
  const history  = sorted;

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>Vacinas</div>
        <div style={{ flex:1 }} />
        <button onClick={() => nav('addvaccine')} className="btn-press" style={{
          border:'none', background:T.brandSoft, color:T.brand,
          borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>+ Registrar</button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 80px' }}>
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
                {history.slice(0, 4).map((v, i) => (
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
                <div key={v.id} style={{ background:T.surface, borderRadius:16, padding:'14px 16px',
                  display:'flex', alignItems:'center', gap:12,
                  boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
                  <div style={{ fontSize:26 }}>💉</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{v.name}</div>
                    <div style={{ fontSize:12, color:T.inkSoft }}>Próxima: {v.nextDate}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.brand, marginTop:2, cursor:'pointer' }}>
                      Agendar vacinação
                    </div>
                  </div>
                  <div style={{ padding:'5px 12px', background:'#DCFCE7', borderRadius:99,
                    fontSize:11, fontWeight:700, color:'#16A34A' }}>Em dia</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* History */}
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:12 }}>Histórico</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {history.map((v) => (
            <div key={v.id} style={{ background:T.surface, borderRadius:14, padding:'13px 16px',
              display:'flex', alignItems:'center', gap:12,
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
              <div style={{ fontSize:22 }}>✅</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{v.name}</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>
                  {v.date || '—'}{v.lot ? ` · Lote: ${v.lot}` : ''}
                </div>
                {v.vet && <div style={{ fontSize:11, color:T.inkMute }}>Dr.: {v.vet}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
