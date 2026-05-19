import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import {
  Card, IconBtn, EmojiCircle, CheckBubble, SectionPill,
  Display, Eyebrow, UserAvatar, MascotAvatar, Stripe,
  Icon, I,
} from '../components/Shared.jsx';

export default {
  title: 'Design System/Components',
  parameters: { layout: 'padded', backgrounds: { default: 'warm' } },
};

// ─── Decorators / wrappers ────────────────────────────────────────────────────

const Row = ({ children, gap = 12 }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap }} >
    {children}
  </div>
);

const Col = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {label && (
      <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: 1,
        textTransform: 'uppercase', color: T.inkMute }}>{label}</div>
    )}
    {children}
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Cards = {
  name: 'Card',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Col label="Default">
        <Card pad={16} radius={22}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 700, color: T.ink }}>Card padrão</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.inkSoft, marginTop: 4 }}>
            Conteúdo do card com padding e sombra suave
          </div>
        </Card>
      </Col>

      <Col label="Pressable (clique para ver animação)">
        <Card pad={16} radius={22} onClick={() => {}} className="pressable">
          <div style={{ fontFamily: FONT_BODY, fontWeight: 700, color: T.ink }}>Card clicável</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.inkSoft, marginTop: 4 }}>
            Pressione para ver o efeito de escala
          </div>
        </Card>
      </Col>

      <Col label="Tile (112px)">
        <Row>
          {[
            { label: 'Saúde',      emoji: '❤️', tint: T.tintRose },
            { label: 'Medicamentos', emoji: '💊', tint: T.tintLavender },
          ].map(t => (
            <Card key={t.label} pad={16} radius={22} onClick={() => {}} className="pressable"
              style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 112,
                width: 148, cursor: 'pointer' }}>
              <EmojiCircle emoji={t.emoji} size={36} tint={t.tint} />
              <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 15, color: T.ink }}>
                {t.label}
              </div>
            </Card>
          ))}
        </Row>
      </Col>
    </div>
  ),
};

// ─── IconBtn ──────────────────────────────────────────────────────────────────

export const IconButtons = {
  name: 'IconBtn',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Col label="Ícones disponíveis">
        <Row>
          {Object.entries(I).map(([name, d]) => (
            <Col key={name} label={name}>
              <IconBtn icon={d} />
            </Col>
          ))}
        </Row>
      </Col>

      <Col label="Tamanhos">
        <Row gap={16}>
          {[32, 40, 48].map(s => (
            <Col key={s} label={`${s}px`}>
              <IconBtn icon={I.bell} size={s} />
            </Col>
          ))}
        </Row>
      </Col>
    </div>
  ),
};

// ─── EmojiCircle ─────────────────────────────────────────────────────────────

export const EmojiCircles = {
  name: 'EmojiCircle',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Col label="Tints">
        <Row>
          {[
            { emoji: '❤️', tint: T.tintRose,     name: 'Rose' },
            { emoji: '💊', tint: T.tintLavender, name: 'Lavender' },
            { emoji: '🌿', tint: T.tintMint,     name: 'Mint' },
            { emoji: '🥣', tint: T.tintCream,    name: 'Cream' },
            { emoji: '🍑', tint: T.tintPeach,    name: 'Peach' },
            { emoji: '🌤', tint: T.tintSky,      name: 'Sky' },
          ].map(({ emoji, tint, name }) => (
            <Col key={name} label={name}>
              <EmojiCircle emoji={emoji} tint={tint} size={44} />
            </Col>
          ))}
        </Row>
      </Col>

      <Col label="Tamanhos">
        <Row gap={16} style={{ alignItems: 'flex-end' }}>
          {[28, 36, 44, 56].map(size => (
            <Col key={size} label={`${size}px`}>
              <EmojiCircle emoji="🐾" tint={T.tintLavender} size={size} />
            </Col>
          ))}
        </Row>
      </Col>
    </div>
  ),
};

// ─── CheckBubble ─────────────────────────────────────────────────────────────

export const CheckBubbles = {
  name: 'CheckBubble',
  render: () => {
    const [done, setDone] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Col label="Estados">
          <Row gap={24}>
            <Col label="Não feito"><CheckBubble done={false} /></Col>
            <Col label="Feito"><CheckBubble done={true} /></Col>
          </Row>
        </Col>
        <Col label="Interativo (clique)">
          <Row gap={16} style={{ alignItems: 'center' }}>
            <CheckBubble done={done} onClick={() => setDone(d => !d)} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: T.inkSoft }}>
              {done ? 'Dose marcada ✓' : 'Marcar como feito'}
            </span>
          </Row>
        </Col>
        <Col label="Tamanhos">
          <Row gap={16}>
            {[22, 28, 36].map(s => (
              <Col key={s} label={`${s}px`}>
                <CheckBubble done={true} size={s} />
              </Col>
            ))}
          </Row>
        </Col>
      </div>
    );
  },
};

// ─── SectionPill ─────────────────────────────────────────────────────────────

export const SectionPills = {
  name: 'SectionPill',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        { icon: '⏰', label: 'Próximas doses',   count: 3,  tint: T.tintLavender, ink: T.tintLavenderInk },
        { icon: '❤️', label: 'Histórico de saúde', count: 12, tint: T.tintRose,     ink: T.tintRoseInk },
        { icon: '🏃', label: 'Atividades',        count: 5,  tint: T.tintMint,     ink: T.tintMintInk },
      ].map(p => (
        <SectionPill key={p.label} icon={p.icon} label={p.label}
          count={p.count} tint={p.tint} ink={p.ink} />
      ))}
    </div>
  ),
};

// ─── Display & Eyebrow ───────────────────────────────────────────────────────

export const TextComponents = {
  name: 'Display & Eyebrow',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow>Segunda · 14 maio</Eyebrow>
      <Display size={46} weight={400}>
        Olá, <span style={{ fontStyle: 'italic' }}>Taynara</span>
      </Display>
      <Eyebrow color={T.inkSoft}>Subtítulo em eyebrow</Eyebrow>
      <Display size={32} weight={400} style={{ fontStyle: 'italic' }}>Leia</Display>
    </div>
  ),
};

// ─── Avatars ──────────────────────────────────────────────────────────────────

export const Avatars = {
  name: 'Avatars',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Col label="UserAvatar">
        <Row gap={16}>
          {[
            { name: 'Taynara', hue: 28 },
            { name: 'Ana',     hue: 280 },
            { name: 'Bruno',   hue: 120 },
          ].map(({ name, hue }) => (
            <Col key={name} label={name}>
              <UserAvatar name={name} hue={hue} size={40} />
            </Col>
          ))}
        </Row>
      </Col>

      <Col label="MascotAvatar — gerado">
        <Row gap={16}>
          {[270, 30, 150].map(hue => (
            <Col key={hue} label={`hue ${hue}`}>
              <MascotAvatar size={40} hue={hue} />
            </Col>
          ))}
        </Row>
      </Col>

      <Col label="MascotAvatar — foto (Leia)">
        <MascotAvatar size={40} photo />
      </Col>
    </div>
  ),
};

// ─── Stripe ───────────────────────────────────────────────────────────────────

export const Stripes = {
  name: 'Stripe (placeholder)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <Stripe label="gráfico" h={120} />
      <Stripe label="imagem" h={80} />
    </div>
  ),
};
