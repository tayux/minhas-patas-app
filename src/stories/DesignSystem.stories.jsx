import { useState } from 'react';
import { FONT_BODY } from '../ds/tokens.js';
import {
  Button, Input, Textarea, Checkbox, Radio, Switch,
  Badge, Avatar, Select, Tooltip, Toast, Modal,
} from '../ds/index.jsx';
import { I } from '../components/Shared.jsx';

export default {
  title: 'Design System/Base Components',
  parameters: { layout: 'padded', backgrounds: { default: 'warm' } },
};

// ─── layout helpers ───────────────────────────────────────────────────────────

const Row = ({ children, gap = 12, align = 'flex-start', wrap = true }) => (
  <div style={{ display: 'flex', flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: align, gap }} >
    {children}
  </div>
);

const Col = ({ label, children, width }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width }}>
    {label && (
      <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: 1,
        textTransform: 'uppercase', color: '#A5A7AE', marginBottom: 2 }}>{label}
      </div>
    )}
    {children}
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 0 8px' }}>
    <div style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
      textTransform: 'uppercase', color: '#A5A7AE', borderBottom: '1px solid #E5E5E5',
      paddingBottom: 8 }}>{title}
    </div>
    {children}
  </div>
);

const ChevSvg = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── 1. Button ────────────────────────────────────────────────────────────────

export const Buttons = {
  name: '1 · Button',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Section title="Variant">
        <Row gap={12} align="center">
          {['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'].map(v => (
            <Col key={v} label={v}>
              <Button variant={v}>Button</Button>
            </Col>
          ))}
        </Row>
      </Section>

      <Section title="Size">
        <Row gap={12} align="center">
          {['sm', 'md', 'lg'].map(s => (
            <Col key={s} label={s}>
              <Button size={s}>Button {s}</Button>
            </Col>
          ))}
          <Col label="icon">
            <Button size="icon" variant="outline" aria-label="Settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M12 4H3M5 12H3m18 0h-2M7.757 6.343A6 6 0 1 0 16.243 17.657"/>
              </svg>
            </Button>
          </Col>
        </Row>
      </Section>

      <Section title="With icons">
        <Row gap={12} align="center">
          <Button leadingIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v14M5 12h14"/></svg>}>
            Novo pet
          </Button>
          <Button variant="outline" trailingIcon={<ChevSvg />}>Mais opções</Button>
          <Button variant="destructive" leadingIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>}>
            Excluir
          </Button>
        </Row>
      </Section>

      <Section title="States">
        <Row gap={12} align="center">
          <Col label="Normal"><Button>Normal</Button></Col>
          <Col label="Disabled"><Button disabled>Disabled</Button></Col>
          <Col label="Disabled outline"><Button variant="outline" disabled>Disabled</Button></Col>
        </Row>
      </Section>
    </div>
  ),
};

// ─── 2. Input & Textarea ──────────────────────────────────────────────────────

export const Inputs = {
  name: '2 · Input & Textarea',
  render: () => {
    const [v, setV] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 520 }}>
        <Section title="States">
          <Row gap={16} wrap>
            <Col label="Default" width={220}><Input label="Label" hint="Helper text" placeholder="Enter text..." value={v} onChange={e => setV(e.target.value)} /></Col>
            <Col label="Focus (click)" width={220}><Input label="Label" placeholder="Click to focus..." /></Col>
            <Col label="Error" width={220}><Input label="Label" state="error" hint="This field is required" placeholder="Invalid value" /></Col>
            <Col label="Disabled" width={220}><Input label="Label" state="disabled" placeholder="Disabled..." /></Col>
          </Row>
        </Section>

        <Section title="Size">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input size="sm" placeholder="Small (32px)" label="sm" />
            <Input size="md" placeholder="Medium (40px)" label="md" />
            <Input size="lg" placeholder="Large (48px)" label="lg" />
          </div>
        </Section>

        <Section title="With icons">
          <Row gap={16} wrap>
            <Col width={220}>
              <Input
                label="Search"
                placeholder="Search pets..."
                leadingIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>}
              />
            </Col>
            <Col width={220}>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                trailingIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
              />
            </Col>
          </Row>
        </Section>

        <Section title="Textarea">
          <Row gap={16} wrap>
            <Col label="Default" width={220}><Textarea label="Notes" hint="Max 500 chars" placeholder="Write something..." /></Col>
            <Col label="Error" width={220}><Textarea label="Notes" state="error" hint="Field is required" /></Col>
            <Col label="Disabled" width={220}><Textarea label="Notes" state="disabled" /></Col>
          </Row>
        </Section>
      </div>
    );
  },
};

// ─── 3. Checkbox ─────────────────────────────────────────────────────────────

export const Checkboxes = {
  name: '3 · Checkbox',
  render: () => {
    const [values, setValues] = useState({ a: false, b: true, c: false });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Section title="States">
          <Row gap={32}>
            <Col label="Unchecked"><Checkbox label="Accept terms" /></Col>
            <Col label="Checked"><Checkbox label="Accept terms" checked /></Col>
            <Col label="Disabled"><Checkbox label="Disabled option" disabled /></Col>
            <Col label="Disabled checked"><Checkbox label="Locked option" checked disabled /></Col>
          </Row>
        </Section>

        <Section title="With description">
          <Checkbox
            label="Email notifications"
            description="Receive updates about medications and appointments"
            checked={values.a}
            onChange={v => setValues(s => ({ ...s, a: v }))}
          />
        </Section>

        <Section title="Interativo (checkbox group)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'a', label: 'Vacinas',      desc: 'Lembretes de vacinação' },
              { key: 'b', label: 'Medicamentos', desc: 'Doses e horários' },
              { key: 'c', label: 'Consultas',    desc: 'Agendamentos veterinários' },
            ].map(({ key, label, desc }) => (
              <Checkbox key={key} label={label} description={desc}
                checked={values[key]} onChange={v => setValues(s => ({ ...s, [key]: v }))} />
            ))}
          </div>
        </Section>
      </div>
    );
  },
};

// ─── 4. Radio ─────────────────────────────────────────────────────────────────

export const Radios = {
  name: '4 · Radio',
  render: () => {
    const [sel, setSel] = useState('dog');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Section title="States">
          <Row gap={32}>
            <Col label="Unchecked"><Radio label="Option A" /></Col>
            <Col label="Checked"><Radio label="Option A" checked /></Col>
            <Col label="Disabled"><Radio label="Disabled" disabled /></Col>
          </Row>
        </Section>

        <Section title="Interativo (radio group)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { value: 'dog',  label: 'Cachorro', desc: 'Canis lupus familiaris' },
              { value: 'cat',  label: 'Gato',     desc: 'Felis catus' },
              { value: 'bird', label: 'Pássaro',  desc: 'Aves' },
            ].map(opt => (
              <Radio key={opt.value} label={opt.label} description={opt.desc}
                checked={sel === opt.value} onChange={() => setSel(opt.value)} />
            ))}
          </div>
        </Section>
      </div>
    );
  },
};

// ─── 5. Switch ────────────────────────────────────────────────────────────────

export const Switches = {
  name: '5 · Switch',
  render: () => {
    const [settings, setSettings] = useState({
      notif: true, dark: false, sync: true, sound: false,
    });
    const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Section title="States">
          <Row gap={32} align="center">
            <Col label="Off"><Switch /></Col>
            <Col label="On"><Switch on /></Col>
            <Col label="Disabled off"><Switch disabled /></Col>
            <Col label="Disabled on"><Switch on disabled /></Col>
          </Row>
        </Section>

        <Section title="Com label — interativo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 280 }}>
            {[
              { key: 'notif', label: 'Notificações push' },
              { key: 'dark',  label: 'Modo escuro' },
              { key: 'sync',  label: 'Sincronização automática' },
              { key: 'sound', label: 'Sons do app' },
            ].map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: '#404040' }}>{label}</span>
                <Switch on={settings[key]} onChange={() => toggle(key)} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    );
  },
};

// ─── 6. Badge ─────────────────────────────────────────────────────────────────

export const Badges = {
  name: '6 · Badge',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Section title="Color">
        <Row gap={8} align="center">
          {['default', 'primary', 'success', 'warning', 'error', 'info'].map(c => (
            <Badge key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
          ))}
        </Row>
      </Section>

      <Section title="Size">
        <Row gap={8} align="center">
          {['sm', 'md', 'lg'].map(s => (
            <Col key={s} label={s}>
              <Badge size={s} color="primary">Badge</Badge>
            </Col>
          ))}
        </Row>
      </Section>

      <Section title="Com dot">
        <Row gap={8} align="center">
          {['primary', 'success', 'warning', 'error'].map(c => (
            <Badge key={c} color={c} dot>Status</Badge>
          ))}
        </Row>
      </Section>

      <Section title="Dismissable">
        <Row gap={8} align="center">
          {['Leia', 'Filô', 'Fiapa'].map(name => (
            <Badge key={name} color="primary" onDismiss={() => {}}>{name}</Badge>
          ))}
        </Row>
      </Section>

      <Section title="Em contexto">
        <Row gap={8} align="center">
          <Badge color="success" dot>Saudável</Badge>
          <Badge color="warning" dot>Vacina pendente</Badge>
          <Badge color="error"   dot>Medicamento atrasado</Badge>
          <Badge color="info">Nova</Badge>
          <Badge color="default">Arquivado</Badge>
        </Row>
      </Section>
    </div>
  ),
};

// ─── 7. Avatar ────────────────────────────────────────────────────────────────

export const Avatars = {
  name: '7 · Avatar',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Section title="Size">
        <Row gap={16} align="flex-end">
          {['xs', 'sm', 'md', 'lg', 'xl'].map(s => (
            <Col key={s} label={s}>
              <Avatar name="Taynara" size={s} />
            </Col>
          ))}
        </Row>
      </Section>

      <Section title="Com indicador de status">
        <Row gap={16} align="center">
          {['sm', 'md', 'lg'].map(s => (
            <Col key={s} label={`${s} + status`}>
              <Avatar name="Ana Luiza" size={s} statusIndicator />
            </Col>
          ))}
        </Row>
      </Section>

      <Section title="Initials — diferentes nomes">
        <Row gap={12} align="center">
          {[
            { name: 'Taynara Menezes', label: 'TM' },
            { name: 'Bruno Costa',     label: 'BC' },
            { name: 'Ana',             label: 'A' },
            { name: 'Dr. Renata',      label: 'DR' },
          ].map(({ name }) => (
            <Col key={name} label={name}>
              <Avatar name={name} size="md" />
            </Col>
          ))}
        </Row>
      </Section>

      <Section title="Em grupo (stack simulado)">
        <div style={{ display: 'flex' }}>
          {['TM', 'BC', 'AL', 'DR'].map((n, i) => (
            <div key={n} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 10 - i }}>
              <Avatar name={n} size="sm" style={{ border: '2px solid white' }} />
            </div>
          ))}
          <div style={{ marginLeft: -10 }}>
            <Avatar name="+5" size="sm" style={{ border: '2px solid white', background: '#E5E5E5' }} />
          </div>
        </div>
      </Section>
    </div>
  ),
};

// ─── 8. Select ────────────────────────────────────────────────────────────────

const SPECIES_OPTIONS = [
  { value: 'dog',    label: '🐶 Cachorro' },
  { value: 'cat',    label: '🐱 Gato'     },
  { value: 'bird',   label: '🦜 Pássaro'  },
  { value: 'rabbit', label: '🐰 Coelho'   },
  { value: 'fish',   label: '🐟 Peixe'    },
];

export const Selects = {
  name: '8 · Select',
  render: () => {
    const [species, setSpecies] = useState('');
    const [freq,    setFreq]    = useState('daily');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 520 }}>
        <Section title="Interativo">
          <Row gap={16} wrap>
            <Col label="Espécie" width={220}>
              <Select
                label="Espécie"
                hint="Selecione a espécie do pet"
                options={SPECIES_OPTIONS}
                value={species}
                onChange={setSpecies}
                placeholder="Selecionar..."
              />
            </Col>
            <Col label="Frequência" width={220}>
              <Select
                label="Frequência"
                options={[
                  { value: 'daily',   label: 'Diário'   },
                  { value: 'weekly',  label: 'Semanal'  },
                  { value: 'monthly', label: 'Mensal'   },
                ]}
                value={freq}
                onChange={setFreq}
              />
            </Col>
          </Row>
        </Section>

        <Section title="States">
          <Row gap={16} wrap>
            <Col label="Error" width={220}>
              <Select label="Espécie" state="error" hint="Campo obrigatório" options={SPECIES_OPTIONS} />
            </Col>
            <Col label="Disabled" width={220}>
              <Select label="Espécie" state="disabled" options={SPECIES_OPTIONS} value="dog" />
            </Col>
          </Row>
        </Section>

        <Section title="Sizes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['sm', 'md', 'lg'].map(s => (
              <Select key={s} size={s} label={`Size ${s}`} options={SPECIES_OPTIONS} placeholder={`Select (${s})...`} />
            ))}
          </div>
        </Section>
      </div>
    );
  },
};

// ─── 9. Tooltip ───────────────────────────────────────────────────────────────

export const Tooltips = {
  name: '9 · Tooltip',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Section title="Placement (hover nos botões)">
        <Row gap={32} align="center" style={{ padding: '40px 0' }}>
          {['top', 'right', 'bottom', 'left'].map(p => (
            <Col key={p} label={p}>
              <Tooltip placement={p} title="Tooltip" content="Short description text.">
                <Button variant="outline">Hover {p}</Button>
              </Tooltip>
            </Col>
          ))}
        </Row>
      </Section>

      <Section title="Apenas título (sem description)">
        <Row gap={16}>
          <Tooltip title="Excluir pet" placement="top">
            <Button variant="destructive" size="sm">Delete</Button>
          </Tooltip>
          <Tooltip title="Salvar alterações" placement="top">
            <Button size="sm">Save</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Em ícones">
        <Row gap={16} align="center">
          {[
            { icon: '🩺', tip: 'Saúde',        desc: 'Histórico de saúde e consultas' },
            { icon: '💊', tip: 'Medicamentos',  desc: 'Doses e horários ativos' },
            { icon: '🪙', tip: 'Finanças',      desc: 'Gastos e despesas' },
            { icon: '📁', tip: 'Documentos',    desc: 'Arquivos e registros' },
          ].map(({ icon, tip, desc }) => (
            <Tooltip key={tip} title={tip} content={desc} placement="top">
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: '#EDE8FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, cursor: 'default',
              }}>{icon}</div>
            </Tooltip>
          ))}
        </Row>
      </Section>
    </div>
  ),
};

// ─── 10. Toast ────────────────────────────────────────────────────────────────

export const Toasts = {
  name: '10 · Toast',
  render: () => {
    const [visible, setVisible] = useState({ success: true, error: true });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Section title="Tipos">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
            <Toast type="default" title="Informação" body="Ação concluída com sucesso." onClose={() => {}} />
            <Toast type="success" title="Salvo!" body="As alterações foram salvas." onClose={() => {}} />
            <Toast type="warning" title="Atenção" body="Vacina da Leia vence em 3 dias." onClose={() => {}} />
            <Toast type="error"   title="Erro"    body="Não foi possível salvar. Tente novamente." onClose={() => {}} />
            <Toast type="info"    title="Dica"    body="Você pode arrastar para reordenar os pets." onClose={() => {}} />
          </div>
        </Section>

        <Section title="Com action">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
            <Toast
              type="warning"
              title="Medicamento atrasado"
              body="Prednisolona da Leia estava programada para 15:00."
              action={{ label: 'Marcar como tomado', onClick: () => {} }}
              onClose={() => {}}
            />
            <Toast
              type="info"
              title="Backup disponível"
              body="Um novo backup foi gerado automaticamente."
              action={{ label: 'Ver backup', onClick: () => {} }}
            />
          </div>
        </Section>

        <Section title="Dismissable — interativo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
            {visible.success && (
              <Toast type="success" title="Pet adicionado!" body="Leia foi cadastrada com sucesso."
                onClose={() => setVisible(v => ({ ...v, success: false }))} />
            )}
            {visible.error && (
              <Toast type="error" title="Conexão perdida" body="Verifique sua internet e tente novamente."
                onClose={() => setVisible(v => ({ ...v, error: false }))} />
            )}
            {!visible.success && !visible.error && (
              <Button variant="outline" onClick={() => setVisible({ success: true, error: true })}>
                Restaurar toasts
              </Button>
            )}
          </div>
        </Section>
      </div>
    );
  },
};

// ─── 11. Modal ────────────────────────────────────────────────────────────────

export const Modals = {
  name: '11 · Modal',
  render: () => {
    const [open, setOpen] = useState(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Section title="Tipos (clique para abrir)">
          <Row gap={12}>
            <Button onClick={() => setOpen('default')}>Default modal</Button>
            <Button variant="destructive" onClick={() => setOpen('destructive')}>Destructive</Button>
            <Button variant="secondary" onClick={() => setOpen('info')}>Info</Button>
            <Button variant="outline" onClick={() => setOpen('sizes')}>Sizes</Button>
          </Row>
        </Section>

        <Section title="Com conteúdo">
          <Row gap={12}>
            <Button variant="outline" onClick={() => setOpen('content')}>Modal com form</Button>
          </Row>
        </Section>

        {/* Default */}
        <Modal open={open === 'default'} type="default" size="md"
          title="Confirmar alterações"
          description="Tem certeza que deseja salvar as alterações no perfil da Leia? Essa ação não pode ser desfeita."
          onClose={() => setOpen(null)} onConfirm={() => setOpen(null)} />

        {/* Destructive */}
        <Modal open={open === 'destructive'} type="destructive" size="sm"
          title="Excluir pet"
          description="Ao excluir Filô, todos os registros de saúde, medicamentos e documentos serão removidos permanentemente."
          onClose={() => setOpen(null)} onConfirm={() => setOpen(null)} />

        {/* Info */}
        <Modal open={open === 'info'} type="info" size="sm"
          title="Sobre os lembretes"
          description="Os lembretes são enviados via notificação push 30 minutos antes do horário programado."
          onClose={() => setOpen(null)} onConfirm={() => setOpen(null)} />

        {/* Sizes */}
        <Modal open={open === 'sizes'} type="default" size="lg"
          title="Modal grande (lg)"
          description="Este é um modal no tamanho lg (720px), ideal para formulários extensos ou conteúdo que requer mais espaço horizontal."
          onClose={() => setOpen(null)} onConfirm={() => setOpen(null)} />

        {/* With content */}
        <Modal open={open === 'content'} type="default" size="md"
          title="Adicionar medicamento"
          description="Preencha as informações do novo medicamento."
          onClose={() => setOpen(null)} onConfirm={() => setOpen(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Nome do medicamento" placeholder="ex: Prednisolona" />
            <Row gap={12}>
              <Input label="Dose" placeholder="ex: 10mg" style={{ flex: 1 }} />
              <Select label="Frequência" style={{ flex: 1 }}
                options={[
                  { value: 'once',  label: '1x ao dia' },
                  { value: 'twice', label: '2x ao dia' },
                  { value: 'three', label: '3x ao dia' },
                ]} />
            </Row>
          </div>
        </Modal>
      </div>
    );
  },
};
