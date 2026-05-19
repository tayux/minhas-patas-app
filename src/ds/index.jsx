import { useState, useRef, useEffect } from 'react';
import { colors as C, spacing as S, radius as R, shadow, FONT_BODY } from './tokens.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

const base = { fontFamily: FONT_BODY, boxSizing: 'border-box' };

const sizeH = { sm: 32, md: 40, lg: 48 };
const sizePH = { sm: 12, md: 12, lg: 14 };
const sizePV = { sm: 6,  md: 10, lg: 12 };
const sizeFs = { sm: 13, md: 14, lg: 16 };

// ─── Button ───────────────────────────────────────────────────────────────────

const btnStyles = {
  default:     { bg: C.primary[500], color: C.white,         border: 'none' },
  secondary:   { bg: C.primary[100], color: C.primary[700],  border: 'none' },
  outline:     { bg: 'transparent',  color: C.primary[600],  border: `1.5px solid ${C.primary[500]}` },
  ghost:       { bg: 'transparent',  color: C.primary[600],  border: 'none' },
  destructive: { bg: C.error[600],   color: C.white,         border: 'none' },
  link:        { bg: 'transparent',  color: C.primary[600],  border: 'none', textDecoration: 'underline' },
};

export function Button({
  children, variant = 'default', size = 'md', disabled = false,
  leadingIcon, trailingIcon, onClick, style,
}) {
  const [hov, setHov] = useState(false);
  const vs = btnStyles[variant] || btnStyles.default;
  const h  = size === 'icon' ? sizeH.md : sizeH[size] || sizeH.md;
  const ph = size === 'icon' ? 10 : sizePH[size] || 12;
  const fs = sizeFs[size] || sizeFs.md;

  const hoverBg = {
    default:     C.primary[600],
    secondary:   C.primary[200],
    outline:     C.primary[50],
    ghost:       C.primary[50],
    destructive: C.error[700],
    link:        'transparent',
  }[variant];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...base,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, height: h, paddingLeft: ph, paddingRight: ph,
        borderRadius: R.md, fontSize: fs, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s, opacity 0.15s',
        background: hov && !disabled ? hoverBg : vs.bg,
        color: vs.color,
        border: vs.border || 'none',
        textDecoration: vs.textDecoration || 'none',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {leadingIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{trailingIcon}</span>}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({
  label, hint, placeholder = 'Placeholder...', size = 'md', state = 'default',
  leadingIcon, trailingIcon, type = 'text', value, onChange, style,
}) {
  const [focused, setFocused] = useState(false);
  const isError    = state === 'error';
  const isDisabled = state === 'disabled';
  const borderColor = isError ? C.error[500] : focused ? C.primary[500] : C.gray[200];
  const h = sizeH[size] || sizeH.md;
  const pv = sizePV[size] || sizePV.md;
  const fs = sizeFs[size] || sizeFs.md;

  return (
    <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: C.gray[700], fontFamily: FONT_BODY }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: h, paddingLeft: 12, paddingRight: 12, paddingTop: pv, paddingBottom: pv,
        border: `1px solid ${borderColor}`, borderRadius: R.md,
        background: isDisabled ? C.gray[50] : C.white,
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
      }}>
        {leadingIcon && <span style={{ color: C.gray[400], flexShrink: 0 }}>{leadingIcon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          disabled={isDisabled}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: FONT_BODY, fontSize: fs, color: isDisabled ? C.gray[400] : C.gray[900],
          }}
        />
        {trailingIcon && <span style={{ color: C.gray[400], flexShrink: 0 }}>{trailingIcon}</span>}
      </div>
      {hint && (
        <span style={{ fontSize: 12, color: isError ? C.error[500] : C.gray[500], fontFamily: FONT_BODY }}>
          {hint}
        </span>
      )}
    </div>
  );
}

export function Textarea({
  label, hint, placeholder = 'Enter text here...', state = 'default',
  value, onChange, rows = 3, style,
}) {
  const [focused, setFocused] = useState(false);
  const isError    = state === 'error';
  const isDisabled = state === 'disabled';
  const borderColor = isError ? C.error[500] : focused ? C.primary[500] : C.gray[200];

  return (
    <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: C.gray[700], fontFamily: FONT_BODY }}>
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        disabled={isDisabled}
        value={value}
        onChange={onChange}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontFamily: FONT_BODY, fontSize: 14, color: isDisabled ? C.gray[400] : C.gray[900],
          padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: R.md,
          background: isDisabled ? C.gray[50] : C.white, resize: 'vertical',
          outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box',
        }}
      />
      {hint && (
        <span style={{ fontSize: 12, color: isError ? C.error[500] : C.gray[500], fontFamily: FONT_BODY }}>
          {hint}
        </span>
      )}
    </div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

export function Checkbox({
  label, description, checked = false, disabled = false, onChange, style,
}) {
  const [hov, setHov] = useState(false);
  const borderColor = checked ? C.primary[500] : hov ? C.primary[400] : C.gray[300];

  return (
    <label style={{ ...base, display: 'inline-flex', alignItems: 'flex-start', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, ...style }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 16, height: 16, borderRadius: R.sm, flexShrink: 0, marginTop: 2,
          border: `1.5px solid ${borderColor}`,
          background: checked ? C.primary[500] : disabled ? C.gray[100] : C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && <span style={{ fontSize: 14, fontWeight: 500, color: disabled ? C.gray[400] : C.gray[700] }}>{label}</span>}
          {description && <span style={{ fontSize: 12, color: C.gray[500] }}>{description}</span>}
        </div>
      )}
    </label>
  );
}

// ─── Radio ────────────────────────────────────────────────────────────────────

export function Radio({
  label, description, checked = false, disabled = false, onChange, style,
}) {
  const [hov, setHov] = useState(false);
  const borderColor = checked ? C.primary[500] : hov ? C.primary[400] : C.gray[300];

  return (
    <label style={{ ...base, display: 'inline-flex', alignItems: 'flex-start', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, ...style }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          border: `1.5px solid ${borderColor}`,
          background: checked ? C.primary[500] : disabled ? C.gray[100] : C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        {checked && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.white }} />}
      </div>
      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && <span style={{ fontSize: 14, fontWeight: 500, color: disabled ? C.gray[400] : C.gray[700] }}>{label}</span>}
          {description && <span style={{ fontSize: 12, color: C.gray[500] }}>{description}</span>}
        </div>
      )}
    </label>
  );
}

// ─── Switch ───────────────────────────────────────────────────────────────────

export function Switch({ on = false, disabled = false, label, onChange, style }) {
  return (
    <label style={{ ...base, display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <div
        onClick={() => !disabled && onChange && onChange(!on)}
        style={{
          width: 36, height: 20, borderRadius: 10, flexShrink: 0, position: 'relative',
          background: on ? C.primary[500] : C.gray[200],
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 2, left: on ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: C.white,
          boxShadow: shadow.sm, transition: 'left 0.2s',
        }} />
      </div>
      {label && <span style={{ fontSize: 14, fontWeight: 500, color: disabled ? C.gray[400] : C.gray[700] }}>{label}</span>}
    </label>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const badgeTokens = {
  default:  { bg: C.gray[100],     text: C.gray[700]     },
  primary:  { bg: C.primary[100],  text: C.primary[700]  },
  success:  { bg: C.success[100],  text: C.success[700]  },
  warning:  { bg: C.warning[100],  text: C.warning[700]  },
  error:    { bg: C.error[100],    text: C.error[700]    },
  info:     { bg: C.info[100],     text: C.info[700]     },
};

const badgeSizes = {
  sm: { ph: 8,  pv: 2,  fs: 11 },
  md: { ph: 10, pv: 2,  fs: 13 },
  lg: { ph: 12, pv: 4,  fs: 13 },
};

export function Badge({ children, color = 'default', size = 'md', dot = false, onDismiss, style }) {
  const tk = badgeTokens[color] || badgeTokens.default;
  const sz = badgeSizes[size] || badgeSizes.md;

  return (
    <span style={{
      ...base, display: 'inline-flex', alignItems: 'center', gap: 4,
      paddingLeft: sz.ph, paddingRight: sz.ph, paddingTop: sz.pv, paddingBottom: sz.pv,
      borderRadius: R.full, background: tk.bg, color: tk.text,
      fontSize: sz.fs, fontWeight: 600, whiteSpace: 'nowrap', ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: tk.text, flexShrink: 0 }} />}
      {children}
      {onDismiss && (
        <span onClick={onDismiss} style={{ cursor: 'pointer', opacity: 0.7, marginLeft: 2, fontSize: sz.fs + 2 }}>×</span>
      )}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

const avSizes = { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 };
const avFs    = { xs: 10, sm: 12, md: 14, lg: 16, xl: 20 };

export function Avatar({ name, src, size = 'md', statusIndicator = false, style }) {
  const dim = avSizes[size] || avSizes.md;
  const fs  = avFs[size]    || avFs.md;
  const initials = name
    ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <div style={{
        width: dim, height: dim, borderRadius: '50%', flexShrink: 0,
        background: src ? 'transparent' : C.primary[100],
        color: C.primary[700], fontSize: fs, fontWeight: 600, fontFamily: FONT_BODY,
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {src
          ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials}
      </div>
      {statusIndicator && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: Math.max(8, Math.round(dim * 0.25)), height: Math.max(8, Math.round(dim * 0.25)),
          borderRadius: '50%', background: C.success[500],
          border: `2px solid ${C.white}`,
        }} />
      )}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

export function Select({
  label, hint, placeholder = 'Select an option...', size = 'md', state = 'default',
  options = [], value, onChange, style,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isError    = state === 'error';
  const isDisabled = state === 'disabled';
  const borderColor = isError ? C.error[500] : open ? C.primary[500] : C.gray[200];
  const h  = sizeH[size] || sizeH.md;
  const pv = sizePV[size] || sizePV.md;
  const fs = sizeFs[size] || sizeFs.md;
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ ...base, display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: C.gray[700], fontFamily: FONT_BODY }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => !isDisabled && setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            height: h, paddingLeft: 12, paddingRight: 12,
            border: `1px solid ${borderColor}`, borderRadius: R.md,
            background: isDisabled ? C.gray[50] : C.white,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.15s', userSelect: 'none',
          }}
        >
          <span style={{ flex: 1, fontSize: fs, color: selected ? C.gray[900] : C.gray[400], fontFamily: FONT_BODY }}>
            {selected ? selected.label : placeholder}
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d={open ? 'M3 9l4-4 4 4' : 'M3 5l4 4 4-4'} stroke={C.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {open && (
          <div style={{
            position: 'absolute', top: h + 4, left: 0, right: 0, zIndex: 50,
            background: C.white, border: `1px solid ${C.gray[200]}`,
            borderRadius: R.lg, boxShadow: shadow.lg, padding: 4, overflow: 'hidden',
          }}>
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => { onChange && onChange(opt.value); setOpen(false); }}
                style={{
                  padding: '8px 8px', borderRadius: R.sm, cursor: 'pointer', fontSize: fs,
                  fontFamily: FONT_BODY, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: opt.value === value ? C.primary[50] : 'transparent',
                  color: opt.value === value ? C.primary[700] : C.gray[700],
                }}
              >
                {opt.label}
                {opt.value === value && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 3.5" stroke={C.primary[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {hint && <span style={{ fontSize: 12, color: isError ? C.error[500] : C.gray[500], fontFamily: FONT_BODY }}>{hint}</span>}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

export function Tooltip({ children, content, title, placement = 'top', style }) {
  const [visible, setVisible] = useState(false);
  const arrowStyle = {
    position: 'absolute', width: 0, height: 0,
    borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
  };
  const pos = {
    top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%',    left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left:   { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right:  { left: '100%',  top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
  }[placement] || pos.top;

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        {children}
      </div>
      {visible && (
        <div style={{
          position: 'absolute', zIndex: 100, whiteSpace: 'nowrap',
          background: C.gray[900], borderRadius: R.md, padding: '8px 12px',
          maxWidth: 240, pointerEvents: 'none', ...pos,
        }}>
          {title && <div style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: FONT_BODY, marginBottom: content ? 2 : 0 }}>{title}</div>}
          {content && <div style={{ fontSize: 12, color: C.gray[200], fontFamily: FONT_BODY }}>{content}</div>}
        </div>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

const toastTokens = {
  default: { bg: C.white,         border: C.gray[200],    icon: 'ℹ', iconBg: C.gray[100],     iconColor: C.gray[600],    title: C.gray[900], body: C.gray[600] },
  success: { bg: C.success[50],   border: C.success[200], icon: '✓', iconBg: C.success[100],  iconColor: C.success[600], title: C.gray[900], body: C.success[700] },
  warning: { bg: C.warning[50],   border: C.warning[200], icon: '⚠', iconBg: C.warning[100],  iconColor: C.warning[600], title: C.gray[900], body: C.warning[700] },
  error:   { bg: C.error[50],     border: C.error[200],   icon: '✕', iconBg: C.error[100],    iconColor: C.error[600],   title: C.gray[900], body: C.error[700] },
  info:    { bg: C.info[50],      border: C.info[200],    icon: 'ℹ', iconBg: C.info[100],     iconColor: C.info[600],    title: C.gray[900], body: C.info[700] },
};

export function Toast({ type = 'default', title, body, action, onClose, style }) {
  const tk = toastTokens[type] || toastTokens.default;
  return (
    <div style={{
      ...base, display: 'flex', gap: 12, padding: '16px',
      background: tk.bg, border: `1px solid ${tk.border}`, borderRadius: R.lg,
      boxShadow: shadow.md, maxWidth: 360, ...style,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        background: tk.iconBg, color: tk.iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, fontFamily: FONT_BODY,
      }}>
        {tk.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 14, fontWeight: 600, color: tk.title, fontFamily: FONT_BODY, marginBottom: body ? 2 : 0 }}>{title}</div>}
        {body  && <div style={{ fontSize: 13, color: tk.body, fontFamily: FONT_BODY }}>{body}</div>}
        {action && (
          <button onClick={action.onClick} style={{
            marginTop: 6, border: 'none', background: 'none', padding: 0,
            fontSize: 13, fontWeight: 600, color: tk.iconColor, cursor: 'pointer', fontFamily: FONT_BODY,
          }}>{action.label}</button>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} style={{
          border: 'none', background: 'none', padding: 0, cursor: 'pointer',
          color: tk.body, fontSize: 18, lineHeight: 1, flexShrink: 0, fontFamily: FONT_BODY,
        }}>×</button>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const modalWidths = { sm: 400, md: 560, lg: 720 };
const modalCtaColors = { default: C.primary[500], destructive: C.error[600], info: C.primary[500] };
const modalCtaLabels = { default: 'Confirm', destructive: 'Delete', info: 'Got it' };
const modalIcons = { destructive: { char: '⚠', bg: C.error[100], color: C.error[600] }, info: { char: 'ℹ', bg: C.info[100], color: C.info[600] } };

export function Modal({
  open = false, type = 'default', size = 'md',
  title, description, children, onClose, onConfirm, style,
}) {
  if (!open) return null;
  const w = modalWidths[size] || modalWidths.md;
  const ctaBg = modalCtaColors[type] || C.primary[500];
  const ctaLabel = modalCtaLabels[type] || 'Confirm';
  const iconDef = modalIcons[type];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}
      onClick={e => e.target === e.currentTarget && onClose && onClose()}
    >
      <div style={{
        ...base, background: C.white, borderRadius: R.xl, width: '100%', maxWidth: w,
        boxShadow: shadow.xl, overflow: 'hidden', ...style,
      }}>
        {/* header */}
        <div style={{ padding: '24px 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {iconDef && (
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: iconDef.bg, color: iconDef.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {iconDef.char}
                </div>
              )}
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.gray[900], fontFamily: FONT_BODY }}>{title}</h2>
            </div>
            {onClose && (
              <button onClick={onClose} style={{
                border: 'none', background: 'none', cursor: 'pointer', color: C.gray[500],
                fontSize: 22, lineHeight: 1, padding: 0, flexShrink: 0,
              }}>×</button>
            )}
          </div>
          {description && (
            <p style={{ margin: '12px 0 0', fontSize: 14, color: C.gray[600], fontFamily: FONT_BODY, lineHeight: 1.6 }}>
              {description}
            </p>
          )}
        </div>

        {children && (
          <>
            <div style={{ height: 1, background: C.gray[200] }} />
            <div style={{ padding: '20px 24px' }}>{children}</div>
          </>
        )}

        <div style={{ height: 1, background: C.gray[200] }} />

        {/* footer */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          {onClose && (
            <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
          )}
          {onConfirm && (
            <Button
              size="md"
              variant={type === 'destructive' ? 'destructive' : 'default'}
              onClick={onConfirm}
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
