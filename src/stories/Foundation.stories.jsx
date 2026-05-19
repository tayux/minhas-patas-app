import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';

export default {
  title: 'Design System/Foundation',
  parameters: { layout: 'fullscreen' },
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 48 }}>
    <div style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
      textTransform: 'uppercase', color: T.inkMute, marginBottom: 16 }}>{title}</div>
    {children}
  </div>
);

const Swatch = ({ name, value, border }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 80 }}>
    <div style={{ width: 72, height: 72, borderRadius: 16, background: value,
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      border: border ? `1px solid ${T.hairlineStrong}` : 'none' }} />
    <div style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: T.ink }}>{name}</div>
    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: T.inkMute }}>{value}</div>
  </div>
);

const TypeSample = ({ label, style, text = 'MinhasPatas — O melhor para o seu pet' }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: 1,
      textTransform: 'uppercase', color: T.inkMute, marginBottom: 8 }}>{label}</div>
    <div style={style}>{text}</div>
  </div>
);

export const Colors = {
  render: () => (
    <div style={{ padding: 40, background: T.bgWash, minHeight: '100vh' }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, color: T.ink,
        margin: '0 0 48px', fontStyle: 'italic' }}>Foundation</h1>

      <Section title="Background">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <Swatch name="bg" value={T.bg} border />
          <Swatch name="bgWash" value={T.bgWash} border />
          <Swatch name="surface" value={T.surface} border />
          <Swatch name="surfaceLo" value={T.surfaceLo} border />
        </div>
      </Section>

      <Section title="Ink (Text)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <Swatch name="ink" value={T.ink} />
          <Swatch name="inkSoft" value={T.inkSoft} />
          <Swatch name="inkMute" value={T.inkMute} />
          <Swatch name="inkFaint" value={T.inkFaint} />
          <Swatch name="hairline" value="rgba(20,20,30,0.06)" border />
        </div>
      </Section>

      <Section title="Brand">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <Swatch name="brand" value={T.brand} />
          <Swatch name="brandSoft" value={T.brandSoft} />
          <Swatch name="brandWash" value={T.brandWash} border />
        </div>
      </Section>

      <Section title="Tints">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {[
            ['Peach',    T.tintPeach,    T.tintPeachInk],
            ['Lavender', T.tintLavender, T.tintLavenderInk],
            ['Mint',     T.tintMint,     T.tintMintInk],
            ['Cream',    T.tintCream,    T.tintCreamInk],
            ['Rose',     T.tintRose,     T.tintRoseInk],
            ['Sky',      T.tintSky,      T.tintSkyInk],
          ].map(([name, bg, ink]) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: ink }}>
                {name}
              </div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: T.inkMute }}>
                {bg}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Typography = {
  render: () => (
    <div style={{ padding: 40, background: T.bg, minHeight: '100vh' }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, color: T.ink,
        margin: '0 0 48px', fontStyle: 'italic' }}>Typography</h1>

      <Section title="Display — Newsreader (serif)">
        <TypeSample label="Display 64 / Regular" text="Olá, Taynara"
          style={{ fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 400, color: T.ink, lineHeight: 1.04 }} />
        <TypeSample label="Display 52 / Regular Italic" text="Leia"
          style={{ fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 400, fontStyle: 'italic',
            color: T.ink, lineHeight: 1.04 }} />
        <TypeSample label="Display 40 / Regular" text="Histórico de Saúde"
          style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400, color: T.ink, lineHeight: 1.1 }} />
      </Section>

      <Section title="Body — Manrope (sans-serif)">
        <TypeSample label="Body 20 / ExtraBold" text="Próximas doses (3)"
          style={{ fontFamily: FONT_BODY, fontSize: 20, fontWeight: 800, color: T.ink }} />
        <TypeSample label="Body 15 / Bold"
          style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 700, color: T.ink }} />
        <TypeSample label="Body 13 / SemiBold"
          style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.inkSoft }} />
        <TypeSample label="Body 12 / Medium"
          style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 500, color: T.inkSoft }} />
        <TypeSample label="Eyebrow 11 / Bold / Uppercase" text="SEGUNDA · 14 MAIO"
          style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
            textTransform: 'uppercase', color: T.inkMute }} />
      </Section>
    </div>
  ),
};
