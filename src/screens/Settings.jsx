import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { IconBtn, I, Icon } from '../components/Shared.jsx';

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

function SettingRow({ e, label, arrow, toggle, on, onChange, color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'14px 16px', gap:12 }}>
      <div style={{ fontSize:20 }}>{e}</div>
      <div style={{ flex:1, fontSize:14, fontWeight:600, color: color || T.ink }}>{label}</div>
      {arrow && <Icon d={I.chevR} size={16} color={T.inkSoft} />}
      {toggle && <Toggle on={on} onChange={onChange} />}
    </div>
  );
}

export default function Settings() {
  const { back, nav } = useNav();
  const [toggles, setToggles] = useState({ push:true, alarm:false, biometric:true });
  const t = (k) => v => setToggles(s => ({ ...s, [k]:v }));

  const sections = [
    { title:'Pets', rows:[
      { e:'🐾', label:'Gerenciar pets', arrow:true },
      { e:'➕', label:'Adicionar novo pet', arrow:true },
    ]},
    { title:'Notificações & Alarmes', rows:[
      { e:'🔔', label:'Notificações push', toggle:true, key:'push' },
      { e:'⏰', label:'Alarmes sonoros', toggle:true, key:'alarm' },
    ]},
    { title:'Conta & Segurança', rows:[
      { e:'🔒', label:'Alterar senha', arrow:true },
      { e:'👆', label:'Biometria', toggle:true, key:'biometric' },
      { e:'🛡️', label:'Privacidade', arrow:true },
    ]},
    { title:'Dados & Privacidade', rows:[
      { e:'📤', label:'Exportar dados', arrow:true },
      { e:'🗑️', label:'Apagar conta', arrow:true, color:'#EF4444' },
    ]},
    { title:'Sobre', rows:[
      { e:'ℹ️', label:'Versão 1.0.0' },
      { e:'⭐', label:'Avaliar o app', arrow:true },
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
        <div style={{ background:T.surface, borderRadius:20, padding:'16px 20px',
          display:'flex', alignItems:'center', gap:14, marginBottom:20,
          boxShadow:'0 4px 20px rgba(20,20,30,0.07)', cursor:'pointer' }}>
          <div style={{ width:52, height:52, borderRadius:26, background:T.brandSoft,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>👤</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:700, color:T.ink }}>Tainara Menezes</div>
            <div style={{ fontSize:13, color:T.inkSoft }}>tainara@email.com</div>
          </div>
          <Icon d={I.chevR} size={16} color={T.inkSoft} />
        </div>

        {/* Premium */}
        <div style={{ borderRadius:18, padding:'16px 20px', marginBottom:20,
          background:`linear-gradient(135deg, ${T.brand} 0%, #9B86FD 100%)`,
          display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ fontSize:28 }}>⭐</div>
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
                  {i > 0 && <div style={{ height:1, background:T.hairline, marginLeft:48 }} />}
                  <SettingRow
                    e={row.e} label={row.label} arrow={row.arrow} color={row.color}
                    toggle={row.toggle} on={toggles[row.key]} onChange={t(row.key)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 20px 28px',
        background:`linear-gradient(to top, ${T.bg} 80%, transparent)` }}>
        <button className="btn-press" onClick={() => nav('onboarding')} style={{
          width:'100%', height:48, borderRadius:100, border:`1.5px solid #EF4444`,
          background:'transparent', color:'#EF4444', fontSize:16, fontWeight:700,
          fontFamily:FONT_BODY, cursor:'pointer' }}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
