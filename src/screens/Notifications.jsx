import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, IconBtn, Eyebrow, Display } from '../components/Shared.jsx';

const NOTIFS = [
  { id:1, emoji:'💊', tint:T.tintLavender, title:'Hora do remédio da Leia',
    sub:'Prednisolona 10mg — dar com comida', time:'agora', read:false, action:'today' },
  { id:2, emoji:'🩺', tint:T.tintRose, title:'Consulta em 2 dias',
    sub:'Dr. Henrique · 22 mai às 14:00', time:'há 3h', read:false, action:'calendar' },
  { id:3, emoji:'🚶', tint:T.tintPeach, title:'Passeio da tarde atrasado',
    sub:'Leia esperando há 30 min', time:'há 5h', read:false, action:'today' },
  { id:4, emoji:'💉', tint:T.tintMint, title:'Vacina antirrábica próxima',
    sub:'Vence em 19 de maio · agende já', time:'ontem', read:true, action:'calendar' },
  { id:5, emoji:'🏆', tint:T.tintCream, title:'Sequência de 5 dias!',
    sub:'Você completou todos os cuidados da Leia', time:'há 2 dias', read:true, action:'home' },
  { id:6, emoji:'📋', tint:T.tintSky, title:'Receita nova disponível',
    sub:'Dr. Henrique enviou uma atualização', time:'há 3 dias', read:true, action:'ai' },
];

export default function Notifications() {
  const { back, nav } = useNav();
  const [notifs, setNotifs] = useState(NOTIFS);

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const unread  = notifs.filter(n => !n.read).length;

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} className="btn-press" />
        {unread > 0 && (
          <button onClick={markAll} className="btn-press"
            style={{ height:34, padding:'0 14px', borderRadius:99, border:'none',
              background:T.surface, fontFamily:FONT_BODY, fontSize:12, fontWeight:700,
              color:T.inkSoft, cursor:'pointer' }}>
            Marcar todas como lidas
          </button>
        )}
        {unread === 0 && <div style={{ width:40 }} />}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 24px' }}>
        <Eyebrow>central de avisos</Eyebrow>
        <Display size={40} weight={400} style={{ marginTop:8 }}>
          Notificações
          {unread > 0 && (
            <span style={{ marginLeft:10, fontSize:16, fontFamily:FONT_BODY, fontWeight:800,
              padding:'4px 10px', borderRadius:99, background:T.brand, color:'#fff',
              verticalAlign:'middle' }}>{unread}</span>
          )}
        </Display>

        {unread > 0 && (
          <div style={{ marginTop:22 }}>
            <SectionPill icon="🔔" label="Novas" count={unread}
              tint={T.tintRose} ink={T.tintRoseInk} />
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
              {notifs.filter(n => !n.read).map(n => (
                <Card key={n.id} pad={14} radius={20} className="pressable"
                  onClick={() => { setNotifs(ns => ns.map(x => x.id===n.id ? {...x,read:true} : x)); nav(n.action); }}
                  style={{ cursor:'pointer', borderLeft:`3px solid ${T.brand}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <EmojiCircle emoji={n.emoji} size={40} tint={n.tint} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:T.ink }}>{n.title}</div>
                      <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{n.sub}</div>
                    </div>
                    <div style={{ fontSize:11, color:T.inkMute, flexShrink:0 }}>{n.time}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: unread > 0 ? 26 : 22 }}>
          <SectionPill icon="📋" label="Anteriores"
            count={notifs.filter(n => n.read).length}
            tint={T.bgWash} ink={T.inkSoft} />
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
            {notifs.filter(n => n.read).map(n => (
              <Card key={n.id} pad={14} radius={20} className="pressable"
                onClick={() => nav(n.action)}
                style={{ cursor:'pointer', opacity:0.7 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <EmojiCircle emoji={n.emoji} size={40} tint={n.tint} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:14, color:T.ink }}>{n.title}</div>
                    <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{n.sub}</div>
                  </div>
                  <div style={{ fontSize:11, color:T.inkMute, flexShrink:0 }}>{n.time}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
