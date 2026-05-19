import { useState } from 'react';
import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from './NavContext.jsx';

export const Icon = ({ d, size = 22, color = 'currentColor', stroke = 1.6, fill = 'none', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

export const I = {
  paw:  <><circle cx="6" cy="11" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="11" r="2"/><path d="M8 17c0-2.5 1.8-4 4-4s4 1.5 4 4-1.8 4-4 4-4-1.5-4-4z"/></>,
  bell: <><path d="M6 9a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  more: <><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/></>,
  chevR: <path d="M9 6l6 6-6 6"/>,
  chevL: <path d="M15 6l-6 6 6 6"/>,
  chevD: <path d="M6 9l6 6 6-6"/>,
  check: <path d="M5 12l5 5L20 7"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>,
  cal:  <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
  scan: <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>,
  edit: <><path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 6l4 4"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  download: <><path d="M12 3v14M6 13l6 6 6-6M5 21h14"/></>,
  burger: <path d="M5 8h14M5 16h8"/>,
  person: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  wallet: <><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></>,
};

export const GoogleG = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5A20 20 0 0 0 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C41 35.9 44 30.4 44 24c0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

export const SectionPill = ({ icon, label, count, tint = T.tintLavender, ink = T.tintLavenderInk, style }) => (
  <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 14px 8px 12px',
    borderRadius:999, background:tint, color:ink, fontFamily:FONT_BODY, fontSize:11,
    fontWeight:700, letterSpacing:1.2, textTransform:'uppercase', whiteSpace:'nowrap', ...style }}>
    {icon && <span style={{ fontSize:14, lineHeight:1 }}>{icon}</span>}
    <span>{label}{count != null && ` (${count})`}</span>
    <Icon d={I.chevD} size={14} color={ink} stroke={2} />
  </div>
);

export const EmojiCircle = ({ emoji, size = 44, tint = T.tintLavender, style }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', background:tint,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:size * 0.46, flexShrink:0, ...style }}>{emoji}</div>
);

export const CheckBubble = ({ done = false, size = 28, color = T.brand, onClick }) => {
  const [scale, setScale] = useState(1);
  const handle = () => {
    if (!onClick) return;
    setScale(0.8);
    setTimeout(() => setScale(1.18), 80);
    setTimeout(() => setScale(1), 220);
    onClick();
  };
  return (
    <div onClick={handle}
      style={{ width:size, height:size, borderRadius:'50%', flexShrink:0,
        border: done ? 'none' : `2px solid ${T.inkFaint}`,
        background: done ? color : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor: onClick ? 'pointer' : 'default',
        transform:`scale(${scale})`,
        transition:'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s, border-color 0.15s',
        WebkitTapHighlightColor:'transparent' }}>
      {done && <Icon d={I.check} size={size * 0.55} color="#fff" stroke={3} />}
    </div>
  );
};

export const Card = ({ children, style, onClick, pad = 16, radius = 22, className }) => {
  const [pressed, setPressed] = useState(false);
  const interactive = !!onClick;
  return (
    <div onClick={onClick}
      onPointerDown={() => interactive && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={className}
      style={{ background:T.surface, borderRadius:radius, padding:pad,
        boxShadow:'0 1px 2px rgba(20,20,30,0.03), 0 8px 24px -12px rgba(20,20,30,0.08)',
        transform: interactive && pressed ? 'scale(0.97)' : 'scale(1)',
        transition:'transform 0.12s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.12s',
        WebkitTapHighlightColor:'transparent',
        ...style }}>
      {children}
    </div>
  );
};

export const IconBtn = ({ icon, onClick, size = 40, className, style }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <button onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={className}
      style={{ width:size, height:size, borderRadius:'50%',
        background:T.surface, border:'none',
        boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 4px 12px -6px rgba(20,20,30,0.10)',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer',
        transform: pressed ? 'scale(0.88)' : 'scale(1)',
        transition:'transform 0.14s cubic-bezier(0.34,1.56,0.64,1)',
        WebkitTapHighlightColor:'transparent',
        ...style }}>
      <Icon d={icon} size={18} color={T.ink} stroke={2} />
    </button>
  );
};

export const Mascot = ({ size = 200 }) => (
  <img src="/leia-nova.png" alt="Leia" draggable={false} style={{
    width:size, height:size * 1.4, objectFit:'contain', objectPosition:'50% 100%',
    userSelect:'none', pointerEvents:'none', display:'block', flexShrink:0 }} />
);

export const MascotAvatar = ({ size = 40, hue = 270, photo = false }) => {
  if (photo) return (
    <div style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden',
      flexShrink:0, background:T.brandSoft, boxShadow:'0 1px 2px rgba(20,20,30,0.10)' }}>
      <img src="/leia-nova.png" alt="" draggable={false} style={{
        width:'100%', height:'100%', objectFit:'contain', objectPosition:'50% 20%',
        display:'block', userSelect:'none', pointerEvents:'none' }} />
    </div>
  );
  return (
    <div style={{ width:size, height:size, borderRadius:'50%',
      background:`radial-gradient(120% 120% at 30% 30%, oklch(94% 0.04 ${hue}), oklch(82% 0.10 ${hue}))`,
      position:'relative', overflow:'hidden', flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={T.ink}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="20" cy="20" rx="11" ry="10" fill={T.surface}/>
        <path d="M12 16 Q9 13 9 19"/><path d="M28 16 Q31 13 31 19"/>
        <path d="M16 19 Q17 20 18 19"/><path d="M22 19 Q23 20 24 19"/>
        <ellipse cx="20" cy="24" rx="1.4" ry="1" fill={T.ink}/>
        <path d="M17 26 Q20 29 23 26"/>
      </svg>
    </div>
  );
};

export const UserAvatar = ({ size = 40, name = 'T', hue = 28, picture }) => {
  if (picture) return (
    <img src={picture} alt={name} referrerPolicy="no-referrer"
      style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', flexShrink:0,
        boxShadow:'0 1px 2px rgba(20,20,30,0.08)', display:'block' }} />
  );
  return (
    <div style={{ width:size, height:size, borderRadius:'50%',
      background:`radial-gradient(120% 120% at 30% 25%, oklch(92% 0.06 ${hue}), oklch(74% 0.13 ${hue}))`,
      color:'#fff', fontFamily:FONT_BODY, fontWeight:800, fontSize:size * 0.42,
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      boxShadow:'0 1px 2px rgba(20,20,30,0.08)' }}>
      {(name[0] || 'T').toUpperCase()}
    </div>
  );
};

export const StatusBar = ({ dark = false }) => {
  const c = dark ? '#fff' : T.ink;
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'14px 28px 6px', fontFamily:FONT_BODY, fontWeight:700, fontSize:15, color:c }}>
      <span>9:41</span>
      <span style={{ display:'flex', gap:6, alignItems:'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><path d="M1 9h2v1H1zm3-2h2v3H4zm3-2h2v5H7zm3-2h2v7h-2zm3-2h2v9h-2z" fill={c}/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.5C9.5 2.5 11.4 3.3 12.7 4.6L13.7 3.6C12 2 9.9 1 7.5 1S3 2 1.3 3.6l1 1C3.6 3.3 5.5 2.5 7.5 2.5zm0 3.5c1.1 0 2 .4 2.7 1.1l1-1C10.2 5 8.9 4.5 7.5 4.5S4.8 5 3.8 6.1l1 1C5.5 6.4 6.4 6 7.5 6zm0 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" fill="none" stroke={c} opacity="0.5"/><rect x="2" y="2" width="17" height="7" rx="1.2" fill={c}/><path d="M22 3.5v4c0.7-0.3 1.2-1 1.2-2s-0.5-1.7-1.2-2z" fill={c} opacity="0.5"/></svg>
      </span>
    </div>
  );
};

export const HomeBar = ({ dark = false }) => (
  <div style={{ display:'flex', justifyContent:'center', padding:'8px 0 10px' }}>
    <div style={{ width:120, height:5, borderRadius:99,
      background: dark ? 'rgba(255,255,255,0.85)' : 'rgba(20,20,30,0.25)' }} />
  </div>
);

export const PhoneShell = ({ children, dark = false, bg }) => (
  <div style={{ width:'100%', height:'100%', background: dark ? '#0F0B1A' : (bg || T.bg),
    display:'flex', flexDirection:'column', fontFamily:FONT_BODY,
    color: dark ? '#fff' : T.ink, position:'relative' }}>
    <div style={{ flex:1, overflow:'hidden', position:'relative' }}>{children}</div>
    <HomeBar dark={dark} />
  </div>
);

export const BottomNav = ({ active = 'home' }) => {
  const { nav } = useNav();
  const items = [
    { id:'home',    icon: I.paw,    label:'Início' },
    { id:'today',   icon: I.cal,    label:'Hoje' },
    { id:'pet',     icon: I.person, label:'Perfil' },
    { id:'finance', icon: I.wallet, label:'Finanças' },
  ];
  return (
    <div style={{ padding:'10px 16px 14px' }}>
      <div style={{ background:T.surface, borderRadius:99, padding:6, display:'flex',
        boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 8px 22px -8px rgba(20,20,30,0.10)' }}>
        {items.map(it => {
          const isActive = active === it.id;
          return (
            <div key={it.id} onClick={() => nav(it.id)}
              className="nav-item"
              style={{ flex:1, padding:'10px 0', borderRadius:99,
                background: isActive ? T.brandSoft : 'transparent',
                display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                cursor:'pointer', WebkitTapHighlightColor:'transparent' }}>
              <Icon d={it.icon} size={20} color={isActive ? T.brand : T.inkSoft}
                stroke={isActive ? 2.2 : 1.8} />
              <span style={{ fontSize:10.5, fontWeight:700,
                color: isActive ? T.brand : T.inkSoft }}>{it.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Display = ({ children, size = 44, weight = 400, style }) => (
  <h1 style={{ fontFamily:FONT_DISPLAY, fontSize:size, fontWeight:weight,
    lineHeight:1.04, letterSpacing:-0.5, color:T.ink, margin:0, ...style }}>
    {children}
  </h1>
);

export const Eyebrow = ({ children, color = T.inkMute, style }) => (
  <div style={{ fontFamily:FONT_BODY, fontSize:11, fontWeight:700, letterSpacing:1.4,
    textTransform:'uppercase', color, ...style }}>{children}</div>
);

export const Stripe = ({ w = '100%', h = 100, radius = 14, label }) => (
  <div style={{ width:w, height:h, borderRadius:radius,
    background:`repeating-linear-gradient(135deg, ${T.surfaceLo} 0 10px, ${T.bgWash} 10px 20px)`,
    display:'flex', alignItems:'center', justifyContent:'center',
    color:T.inkMute, fontFamily:'ui-monospace, monospace', fontSize:10,
    letterSpacing:0.8, textTransform:'uppercase', flexShrink:0 }}>{label}</div>
);
