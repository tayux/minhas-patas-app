import { useState } from 'react';
import {
  PawPrint, Bell, Plus, MoreHorizontal,
  ChevronRight, ChevronLeft, ChevronDown,
  Check, Search, Calendar, ScanLine, Mail,
  Pencil, ArrowRight, Download, Menu, User, Wallet,
  Trash2, X, Stethoscope, Pill, Coins, FolderOpen,
  Clock, AlertTriangle, Building2, Microscope,
  Paperclip, FileText, Syringe, Scissors, Heart,
  Activity, DollarSign, Notebook, ClipboardList,
  CheckCircle2, RotateCcw, Sparkles,
} from 'lucide-react';
import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from './NavContext.jsx';
import { usePet } from './PetContext.jsx';

// ── Icon registry ─────────────────────────────────────────────────────────────
// All values are Lucide React components — pass directly to <Icon d={I.xxx} />
export const I = {
  // Navigation & actions
  paw:      PawPrint,
  bell:     Bell,
  plus:     Plus,
  more:     MoreHorizontal,
  chevR:    ChevronRight,
  chevL:    ChevronLeft,
  chevD:    ChevronDown,
  check:    Check,
  search:   Search,
  cal:      Calendar,
  scan:     ScanLine,
  mail:     Mail,
  edit:     Pencil,
  arrow:    ArrowRight,
  download: Download,
  burger:   Menu,
  person:   User,
  wallet:   Wallet,
  trash:    Trash2,
  close:    X,
  heart:    Heart,
  activity: Activity,
  rotate:   RotateCcw,
  sparkles: Sparkles,
  // Semantic / screen-specific
  health:   Stethoscope,
  meds:     Pill,
  finance:  Coins,
  docs:     FolderOpen,
  clock:    Clock,
  alert:    AlertTriangle,
  hospital: Building2,
  exam:     Microscope,
  clip:     Paperclip,
  file:     FileText,
  vaccine:  Syringe,
  scissors: Scissors,
  notebook: Notebook,
  checkOk:  CheckCircle2,
  list:     ClipboardList,
  dollar:   DollarSign,
};

// ── Icon renderer ─────────────────────────────────────────────────────────────
// Accepts a Lucide component (function OR forwardRef object) or legacy SVG path string
export const Icon = ({ d: D, size = 22, color = 'currentColor', stroke = 1.6, fill = 'none', style }) => {
  // Lucide icons can be forwardRef objects (typeof === 'object') or plain functions
  if (D && typeof D !== 'string') {
    return <D size={size} color={color} strokeWidth={stroke} style={style} />;
  }
  if (!D) return null;
  // Legacy: raw SVG path string
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={D} />
    </svg>
  );
};

export const GoogleG = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5A20 20 0 0 0 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C41 35.9 44 30.4 44 24c0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

// ── IconCircle ────────────────────────────────────────────────────────────────
// Replaces EmojiCircle for Lucide icons
export const IconCircle = ({ icon: LucideIcon, size = 44, tint = T.tintLavender, color, style }) => {
  if (!LucideIcon) return null;
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:tint,
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, ...style }}>
      <LucideIcon size={Math.round(size * 0.48)} color={color || 'currentColor'} strokeWidth={1.8} />
    </div>
  );
};

// Keep EmojiCircle for cases where emoji content strings are still used
export const EmojiCircle = ({ emoji, size = 44, tint = T.tintLavender, style }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', background:tint,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:size * 0.46, flexShrink:0, ...style }}>{emoji}</div>
);

export const SectionPill = ({ icon, label, count, tint = T.tintLavender, ink = T.tintLavenderInk, style }) => {
  const IconEl = typeof icon === 'function' ? icon : null;
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 14px 8px 12px',
      borderRadius:999, background:tint, color:ink, fontFamily:FONT_BODY, fontSize:11,
      fontWeight:700, letterSpacing:1.2, textTransform:'uppercase', whiteSpace:'nowrap', ...style }}>
      {IconEl
        ? <IconEl size={14} strokeWidth={2.2} color={ink} />
        : icon && <span style={{ fontSize:14, lineHeight:1 }}>{icon}</span>
      }
      <span>{label}{count != null && ` (${count})`}</span>
      <ChevronDown size={14} color={ink} strokeWidth={2} />
    </div>
  );
};

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
      {done && <Check size={size * 0.55} color="#fff" strokeWidth={3} />}
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

export const MascotAvatar = ({ size = 40, hue = 270, photo = false, photoUrl = null }) => {
  const src = photoUrl || (photo ? '/leia-nova.png' : null);
  if (src) return (
    <div style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden',
      flexShrink:0, background:T.brandSoft, boxShadow:'0 1px 2px rgba(20,20,30,0.10)' }}>
      <img src={src} alt="" draggable={false} style={{
        width:'100%', height:'100%', objectFit: photoUrl ? 'cover' : 'contain',
        objectPosition:'50% 20%',
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
          const NavIcon = it.icon;
          return (
            <div key={it.id} onClick={() => nav(it.id)}
              className="nav-item"
              style={{ flex:1, padding:'10px 0', borderRadius:99,
                background: isActive ? T.brandSoft : 'transparent',
                display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                cursor:'pointer', WebkitTapHighlightColor:'transparent' }}>
              <NavIcon size={20} color={isActive ? T.brand : T.inkSoft}
                strokeWidth={isActive ? 2.2 : 1.8} />
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

export const PetHeader = () => {
  const { activePet, PETS, setActivePetId } = usePet();
  const [open, setOpen] = useState(false);
  if (!activePet) return null;
  return (
    <>
      <div onClick={() => PETS.length > 1 && setOpen(true)}
        style={{ display:'flex', alignItems:'center', gap:8,
          background:T.surface, borderRadius:99, padding:'6px 12px 6px 6px',
          boxShadow:'0 1px 4px rgba(20,20,30,0.07)', cursor: PETS.length > 1 ? 'pointer' : 'default',
          WebkitTapHighlightColor:'transparent', alignSelf:'flex-start' }}>
        <MascotAvatar size={28} hue={activePet.hue} photo={activePet.photo} photoUrl={activePet.photoUrl} />
        <span style={{ fontSize:13, fontWeight:700, color:T.ink, maxWidth:120,
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{activePet.name}</span>
        {PETS.length > 1 && <ChevronDown size={14} color={T.inkSoft} strokeWidth={2} />}
      </div>

      {open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
          display:'flex', alignItems:'flex-end', zIndex:300 }}
          onClick={() => setOpen(false)}>
          <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
            padding:'20px 20px 40px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:16 }}>
              Trocar pet
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {PETS.map(p => (
                <div key={p.id} onClick={() => { setActivePetId(p.id); setOpen(false); }}
                  style={{ display:'flex', alignItems:'center', gap:12,
                    background: p.id === activePet.id ? T.brandSoft : T.surface,
                    borderRadius:16, padding:'12px 14px', cursor:'pointer',
                    border: `1.5px solid ${p.id === activePet.id ? T.brand : 'transparent'}` }}>
                  <MascotAvatar size={40} hue={p.hue} photo={p.photo} photoUrl={p.photoUrl} />
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>{p.name}</div>
                    <div style={{ fontSize:12, color:T.inkSoft }}>{p.breed}</div>
                  </div>
                  {p.id === activePet.id && (
                    <div style={{ marginLeft:'auto', padding:'3px 10px', borderRadius:99,
                      background:T.brand, color:'#fff', fontSize:11, fontWeight:700 }}>ativo</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const Stripe = ({ w = '100%', h = 100, radius = 14, label }) => (
  <div style={{ width:w, height:h, borderRadius:radius,
    background:`repeating-linear-gradient(135deg, ${T.surfaceLo} 0 10px, ${T.bgWash} 10px 20px)`,
    display:'flex', alignItems:'center', justifyContent:'center',
    color:T.inkMute, fontFamily:'ui-monospace, monospace', fontSize:10,
    letterSpacing:0.8, textTransform:'uppercase', flexShrink:0 }}>{label}</div>
);
