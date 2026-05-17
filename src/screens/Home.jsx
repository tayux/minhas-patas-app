import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet, PETS } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, CheckBubble, IconBtn, MascotAvatar, UserAvatar, Display, Eyebrow, BottomNav } from '../components/Shared.jsx';

const TILE_ROUTES = { Saúde:'pet', Medicamentos:'meds', Finanças:'finance', Documentos:'pet' };
const TILE_TINTS  = [
  { tint:T.tintRose,     ink:T.tintRoseInk     },
  { tint:T.tintLavender, ink:T.tintLavenderInk },
  { tint:T.tintMint,     ink:T.tintMintInk     },
  { tint:T.tintCream,    ink:T.tintCreamInk    },
];
const UPCOMING_TINTS = [T.tintLavender, T.tintPeach];

export default function Home() {
  const { nav } = useNav();
  const { activePet, setActivePetId } = usePet();

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ flex:1, overflowY:'auto', padding:'4px 24px 16px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
          <IconBtn icon={I.burger} className="btn-press" onClick={() => nav('notifications')} />
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <IconBtn icon={I.bell} className="btn-press" onClick={() => nav('notifications')} />
            <UserAvatar size={40} name="Taynara" hue={28} />
          </div>
        </div>

        {/* Greeting */}
        <div style={{ marginTop:32, textAlign:'center' }}>
          <Eyebrow>Segunda · 14 maio</Eyebrow>
          <Display size={46} weight={400} style={{ marginTop:8 }}>
            Olá, <span style={{ fontStyle:'italic' }}>Taynara</span>
          </Display>
        </div>

        {/* Pet chips */}
        <div style={{ display:'flex', gap:8, marginTop:28, overflowX:'auto', paddingBottom:4 }}>
          {PETS.map((p) => {
            const isActive = p.id === activePet.id;
            return (
              <div key={p.id}
                onClick={() => setActivePetId(p.id)}
                className="pressable"
                style={{ display:'flex', alignItems:'center', gap:8,
                  padding:'5px 14px 5px 5px', borderRadius:99,
                  background: isActive ? T.ink : T.surface,
                  color: isActive ? '#fff' : T.ink,
                  fontWeight:600, fontSize:13, flexShrink:0, fontFamily:FONT_BODY,
                  boxShadow: isActive ? 'none' : '0 1px 2px rgba(20,20,30,0.04)',
                  cursor:'pointer',
                  transition:'background 0.18s, color 0.18s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                <MascotAvatar size={28} hue={p.hue} photo={p.photo} />{p.name}
              </div>
            );
          })}
          <div onClick={() => {}} className="pressable" style={{ display:'flex', alignItems:'center', gap:6,
            padding:'5px 14px 5px 8px', borderRadius:99, color:T.inkSoft, fontWeight:600,
            fontSize:13, fontFamily:FONT_BODY, border:`1px dashed ${T.hairlineStrong}`,
            cursor:'pointer' }}>
            <Icon d={I.plus} size={14} color={T.inkSoft} stroke={2} /> Adicionar
          </div>
        </div>

        {/* Tiles */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:24 }}>
          {activePet.tiles.map((t, i) => (
            <Card key={t.label} pad={16} radius={22}
              onClick={() => nav(TILE_ROUTES[t.label] || 'home')}
              className="pressable"
              style={{ display:'flex', flexDirection:'column', gap:16, height:112, cursor:'pointer',
                transition:'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s' }}>
              <EmojiCircle emoji={t.emoji} size={36} tint={TILE_TINTS[i].tint} />
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>{t.label}</div>
                <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{t.sub}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Upcoming */}
        <div style={{ marginTop:28, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <SectionPill icon="⏰" label="Próximas doses"
            count={activePet.upcoming.length} tint={T.tintLavender} ink={T.tintLavenderInk} />
          <span onClick={() => nav('meds')} className="btn-press"
            style={{ fontSize:12, color:T.inkSoft, fontWeight:600, cursor:'pointer' }}>Ver todas →</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:14 }}>
          {activePet.upcoming.map((m, i) => (
            <Card key={i} pad={14} radius={20}
              onClick={() => nav('today')}
              className="pressable"
              style={{ cursor:'pointer' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <EmojiCircle emoji={m.emoji} size={42} tint={UPCOMING_TINTS[i % 2]} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontWeight:700, fontSize:15, color:T.ink }}>{m.title}</span>
                    {m.late && (
                      <span style={{ fontSize:10, fontWeight:800, letterSpacing:0.8,
                        textTransform:'uppercase', padding:'3px 8px', borderRadius:99,
                        background:T.tintRose, color:T.tintRoseInk }}>atrasado</span>
                    )}
                  </div>
                  <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{m.time} · {m.sub}</div>
                </div>
                <CheckBubble done={false} />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}
