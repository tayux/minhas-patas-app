import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, IconBtn, Mascot, Eyebrow, Display, BottomNav } from '../components/Shared.jsx';

export default function Pet() {
  const { nav, back } = useNav();
  const { activePet } = usePet();
  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>🐾</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Nenhum pet cadastrado</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Adicione seu primeiro pet para ver o perfil completo aqui.
        </div>
      </div>
      <BottomNav active="pet" />
    </div>
  );
  const rows = [
    { label:'Histórico de saúde',     emoji:'❤️', tint:T.tintRose,     meta:'12 registros',      to:'health' },
    { label:'Medicamentos ativos',    emoji:'💊', tint:T.tintLavender, meta:'5 ativos', dot:true, to:'meds' },
    { label:'Consultas',              emoji:'📅', tint:T.tintSky,      meta:'Próxima · 22 mai',  to:'vet' },
    { label:'Vacinas',                emoji:'🛡️',tint:T.tintMint,     meta:'Em dia',             to:'vaccines' },
    { label:'Documentos',             emoji:'📁', tint:T.tintCream,    meta:'8 arquivos',         to:'documents' },
    { label:'Diário & comportamento', emoji:'📓', tint:T.tintPeach,    meta:'3 notas esta semana',to:'behaviordiary' },
    { label:'Alimentação',            emoji:'🥣', tint:T.tintCream,    meta:'3 refeições/dia',    to:'feeding' },
    { label:'Passeios & atividades',  emoji:'🐾', tint:T.tintMint,     meta:'3 de 5 esta semana', to:'walks' },
    { label:'Higiene & beleza',       emoji:'✂️', tint:T.tintSky,      meta:'Banho · há 4 dias',  to:'hygiene' },
  ];
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg,
      position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:280,
        background:`radial-gradient(120% 80% at 50% -10%, ${T.brandSoft} 0%, ${T.bg} 75%)` }} />
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8, position:'relative' }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ display:'flex', gap:8 }}>
          <IconBtn icon={I.bell} onClick={() => nav('notifications')} />
          <IconBtn icon={I.more} onClick={() => nav('settings')} />
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'16px 24px 24px', position:'relative' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginTop:8 }}>
          {activePet.photoUrl
            ? <div style={{ width:150, height:150, borderRadius:75, overflow:'hidden',
                border:`3px solid ${T.surface}`, boxShadow:'0 4px 20px rgba(20,20,30,0.12)' }}>
                <img src={activePet.photoUrl} alt={activePet.name}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            : <Mascot size={150} />
          }
          <Eyebrow style={{ marginTop:12 }}>{activePet.gender} · {activePet.breed}</Eyebrow>
          <Display size={52} weight={400} style={{ marginTop:6 }}>
            <span style={{ fontStyle:'italic' }}>{activePet.name}</span>
          </Display>
          <div style={{ display:'flex', gap:8, marginTop:18 }}>
            {[{l:activePet.age.replace(' anos',''),u:'anos',k:'idade'},{l:activePet.weight.replace(' kg',''),u:'kg',k:'peso'}].map((c,i) => (
              <div key={i} style={{ padding:'10px 16px', borderRadius:16, background:T.surface,
                textAlign:'center', minWidth:70,
                boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 6px 16px -10px rgba(20,20,30,0.10)' }}>
                <div style={{ fontFamily:FONT_DISPLAY, fontSize:22, fontWeight:500, color:T.ink, lineHeight:1 }}>
                  {c.l}<span style={{ fontSize:12, color:T.inkSoft, marginLeft:2, fontFamily:FONT_BODY, fontWeight:600 }}>{c.u}</span>
                </div>
                <div style={{ fontSize:10, color:T.inkMute, fontWeight:700, letterSpacing:0.8,
                  textTransform:'uppercase', marginTop:4 }}>{c.k}</div>
              </div>
            ))}
          </div>
        </div>
        <Card pad={0} radius={22} style={{ marginTop:26, overflow:'hidden' }}>
          {rows.map((r,i) => (
            <div key={i} onClick={() => nav(r.to)} style={{ display:'flex', alignItems:'center',
              gap:14, padding:'14px 16px', cursor:'pointer',
              borderBottom: i < rows.length-1 ? `1px solid ${T.hairline}` : 'none' }}>
              <EmojiCircle emoji={r.emoji} size={38} tint={r.tint} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontWeight:700, fontSize:15, color:T.ink }}>{r.label}</span>
                  {r.dot && <span style={{ width:6, height:6, borderRadius:'50%',
                    background:T.brand, display:'inline-block' }} />}
                </div>
                <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{r.meta}</div>
              </div>
              <Icon d={I.chevR} size={18} color={T.inkMute} stroke={2} />
            </div>
          ))}
        </Card>
        <button onClick={() => nav('petonboarding')} style={{ marginTop:14, width:'100%', height:52, borderRadius:99,
          background:T.surface, color:T.ink, border:'none', fontFamily:FONT_BODY,
          fontSize:14, fontWeight:600, display:'flex', alignItems:'center',
          justifyContent:'center', gap:8, cursor:'pointer',
          boxShadow:'0 1px 2px rgba(20,20,30,0.04)' }}>
          <Icon d={I.edit} size={16} color={T.ink} stroke={2} /> Editar perfil
        </button>
      </div>
      <BottomNav active="pet" />
    </div>
  );
}
