import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { useAuth } from '../components/AuthContext.jsx';
import { IconBtn, I, Icon, IconCircle, UserAvatar } from '../components/Shared.jsx';

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

function SettingRow({ icon, tint, ink, label, arrow, toggle, on, onChange, color, onClick }) {
  return (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', padding:'12px 16px', gap:12,
      cursor: onClick ? 'pointer' : 'default' }}>
      <IconCircle icon={icon} size={34} tint={tint || T.tintLavender} color={ink || T.tintLavenderInk} />
      <div style={{ flex:1, fontSize:14, fontWeight:600, color: color || T.ink }}>{label}</div>
      {arrow && <Icon d={I.chevR} size={16} color={T.inkSoft} />}
      {toggle && <Toggle on={on} onChange={onChange} />}
    </div>
  );
}

export default function Settings() {
  const { back, nav } = useNav();
  const { user, logout } = useAuth();
  const [toggles, setToggles] = useState({ push:true, alarm:false, biometric:true });
  const t = (k) => v => setToggles(s => ({ ...s, [k]:v }));

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      '🐾 Conheça o *MinhasPatas* — o app completo para cuidar do seu pet!\n\nControle vacinas, medicamentos, consultas, alimentação e muito mais em um só lugar.\n\nBaixe agora: https://minhaspatas.app'
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const sections = [
    { title:'Pets', rows:[
      { icon:I.paw,    tint:T.tintLavender, ink:T.tintLavenderInk, label:'Gerenciar pets',     arrow:true, onClick:() => nav('managepets') },
      { icon:I.plus,   tint:T.tintMint,     ink:T.tintMintInk,     label:'Adicionar novo pet', arrow:true, onClick:() => nav('petonboarding') },
    ]},
    { title:'Notificações & Alarmes', rows:[
      { icon:I.bell,   tint:T.tintRose,     ink:T.tintRoseInk,     label:'Notificações push', toggle:true, key:'push' },
      { icon:I.clock,  tint:T.tintPeach,    ink:'#B45309',          label:'Alarmes sonoros',   toggle:true, key:'alarm' },
    ]},
    { title:'Conta & Segurança', rows:[
      { icon:I.lock,   tint:T.tintSky,      ink:T.tintSkyInk,      label:'Alterar senha',  arrow:true, onClick:() => nav('notifications') },
      { icon:I.finger, tint:'#EDE9FE',      ink:'#7C3AED',          label:'Biometria',      toggle:true, key:'biometric' },
    ]},
    { title:'Dados & Privacidade', rows:[
      { icon:I.upload, tint:T.tintMint,     ink:T.tintMintInk,     label:'Exportar dados', arrow:true, onClick:() => nav('reports') },
      { icon:I.trash,  tint:'#FEE2E2',      ink:'#EF4444',          label:'Apagar conta',   arrow:true, color:'#EF4444', onClick:() => nav('notifications') },
    ]},
    { title:'Sobre', rows:[
      { icon:I.info,   tint:T.tintCream,    ink:T.tintCreamInk,    label:'Versão 1.0.0' },
      { icon:I.star,   tint:'#FEF3C7',      ink:'#B45309',          label:'Avaliar o app',              arrow:true, onClick:() => nav('appfeedback') },
      { icon:I.share,  tint:T.tintLavender, ink:T.tintLavenderInk, label:'Compartilhar via WhatsApp',   arrow:true, onClick: shareWhatsApp },
    ]},
  ];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:20, fontWeight:800, color:T.ink }}>Configurações</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 100px' }}>
        {/* Profile */}
        <div onClick={() => nav('notifications')} style={{ background:T.surface, borderRadius:20, padding:'16px 20px',
          display:'flex', alignItems:'center', gap:14, marginBottom:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', cursor:'pointer' }}>
          <UserAvatar size={52} name={user?.name ?? 'T'} picture={user?.picture} hue={28} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:700, color:T.ink }}>{user?.name ?? '—'}</div>
            <div style={{ fontSize:13, color:T.inkSoft }}>{user?.email ?? '—'}</div>
          </div>
          <Icon d={I.chevR} size={16} color={T.inkSoft} />
        </div>

        {/* Premium */}
        <div style={{ borderRadius:18, padding:'16px 20px', marginBottom:20,
          background:`linear-gradient(135deg, ${T.brand} 0%, #9B86FD 100%)`,
          display:'flex', alignItems:'center', gap:14 }}>
          <IconCircle icon={I.sparkles} size={42} tint='rgba(255,255,255,0.2)' color='#fff' />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>Plano Premium</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)' }}>Desbloqueie relatórios e muito mais</div>
          </div>
          <div style={{ padding:'6px 14px', background:'rgba(255,255,255,0.2)', borderRadius:99,
            fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer' }}>Upgrade</div>
        </div>

        {/* Sections */}
        {sections.map(sec => (
          <div key={sec.title} style={{ marginBottom:20 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft,
              letterSpacing:0.8, textTransform:'uppercase', marginBottom:8 }}>{sec.title}</div>
            <div style={{ background:T.surface, borderRadius:16,
              boxShadow:'0 2px 8px rgba(20,20,30,0.05)', overflow:'hidden' }}>
              {sec.rows.map((row, i) => (
                <div key={i}>
                  {i > 0 && <div style={{ height:1, background:T.hairline, marginLeft:62 }} />}
                  <SettingRow
                    icon={row.icon} tint={row.tint} ink={row.ink}
                    label={row.label} arrow={row.arrow} color={row.color}
                    toggle={row.toggle} on={toggles[row.key]} onChange={t(row.key)}
                    onClick={row.onClick} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button className="btn-press" onClick={() => { logout(); nav('onboarding'); }} style={{
          width:'100%', height:48, borderRadius:100, border:`1.5px solid #EF4444`,
          background:'transparent', color:'#EF4444', fontSize:15, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <I.logout size={18} strokeWidth={2} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}
