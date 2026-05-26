import { useState, useMemo } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, IconCircle, SectionPill, IconBtn, Eyebrow, Display } from '../components/Shared.jsx';

// Parse dd/mm/yyyy → Date (returns null if invalid)
function parseDdmm(str) {
  if (!str) return null;
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  return isNaN(d.getTime()) ? null : d;
}

function diffDays(date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function relativeTime(daysAgo) {
  if (daysAgo === 0) return 'hoje';
  if (daysAgo === 1) return 'amanhã';
  if (daysAgo === -1) return 'ontem';
  if (daysAgo > 0) return `em ${daysAgo}d`;
  return `${Math.abs(daysAgo)}d atrás`;
}

function generateNotifications(medications, vaccines, consultations, activePet) {
  const notifs = [];
  const petName = activePet?.name || 'seu pet';

  // ── Medications (active) ──────────────────────────────────────────
  medications
    .filter(m => m.on !== false && m.active !== false)
    .forEach(m => {
      const dose = [m.dose, m.unit].filter(Boolean).join(' ');
      notifs.push({
        id:     `med-${m.id}`,
        icon:   I.meds,
        tint:   T.tintLavender,
        ink:    T.tintLavenderInk,
        title:  `Medicamento: ${m.name}`,
        sub:    `${dose}${m.freq ? ` · ${m.freq}` : ''}${m.notes ? ` · ${m.notes}` : ''}`,
        time:   'ativo',
        urgent: false,
        action: 'meds',
      });
    });

  // ── Vaccines (overdue or due within 45 days) ──────────────────────
  vaccines.forEach(v => {
    const next = parseDdmm(v.nextDate);
    if (!next) return;
    const diff = diffDays(next);
    if (diff > 45) return; // too far out, skip
    const overdue = diff < 0;
    notifs.push({
      id:     `vac-${v.id}`,
      icon:   I.vaccine,
      tint:   overdue ? '#FEE2E2' : T.tintMint,
      ink:    overdue ? '#EF4444' : T.tintMintInk,
      title:  overdue
        ? `Vacina atrasada: ${v.name}`
        : diff === 0
          ? `Vacina vence hoje: ${v.name}`
          : `Vacina em ${diff} dia${diff === 1 ? '' : 's'}: ${v.name}`,
      sub:    overdue
        ? `Venceu em ${v.nextDate} — agende já`
        : `Próxima dose: ${v.nextDate}`,
      time:   relativeTime(diff),
      urgent: overdue || diff <= 7,
      action: 'vaccines',
    });
  });

  // ── Consultations (upcoming 30 days) ─────────────────────────────
  consultations.forEach(c => {
    const date = parseDdmm(c.date);
    if (!date) return;
    const diff = diffDays(date);
    if (diff < 0 || diff > 30) return;
    const vetInfo = c.vet || c.vet_name;
    notifs.push({
      id:     `cons-${c.id}`,
      icon:   I.cal,
      tint:   T.tintSky,
      ink:    T.tintSkyInk,
      title:  diff === 0
        ? `Consulta hoje — ${petName}`
        : `Consulta em ${diff} dia${diff === 1 ? '' : 's'}`,
      sub:    [vetInfo, c.date].filter(Boolean).join(' · '),
      time:   relativeTime(diff),
      urgent: diff <= 1,
      action: 'vet',
    });
  });

  return notifs;
}

const STORAGE_KEY = 'mp_notif_read_ids';

function loadReadIds() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveReadIds(set) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set))); } catch {}
}

export default function Notifications() {
  const { back, nav } = useNav();
  const { activePet, medications, vaccines, consultations } = usePet();
  const [readIds, setReadIds] = useState(loadReadIds);

  const generated = useMemo(
    () => generateNotifications(medications, vaccines, consultations, activePet),
    [medications, vaccines, consultations, activePet]
  );

  const notifs = generated.map(n => ({ ...n, read: readIds.has(n.id) }));

  const markRead = (id) => {
    setReadIds(prev => {
      const next = new Set(prev); next.add(id); saveReadIds(next); return next;
    });
  };
  const markAll = () => {
    setReadIds(prev => {
      const next = new Set(prev);
      generated.forEach(n => next.add(n.id));
      saveReadIds(next);
      return next;
    });
  };

  const unread  = notifs.filter(n => !n.read);
  const read    = notifs.filter(n => n.read);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} className="btn-press" />
        {unread.length > 0 && (
          <button onClick={markAll} className="btn-press"
            style={{ height:34, padding:'0 14px', borderRadius:99, border:'none',
              background:T.surface, fontFamily:FONT_BODY, fontSize:12, fontWeight:700,
              color:T.inkSoft, cursor:'pointer' }}>
            Marcar todas como lidas
          </button>
        )}
        {unread.length === 0 && <div style={{ width:40 }} />}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 24px' }}>
        <Eyebrow>central de avisos</Eyebrow>
        <Display size={40} weight={400} style={{ marginTop:8 }}>
          Notificações
          {unread.length > 0 && (
            <span style={{ marginLeft:10, fontSize:16, fontFamily:FONT_BODY, fontWeight:800,
              padding:'4px 10px', borderRadius:99, background:T.brand, color:'#fff',
              verticalAlign:'middle' }}>{unread.length}</span>
          )}
        </Display>

        {notifs.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink, marginBottom:8 }}>
              Tudo em dia!
            </div>
            <div style={{ fontSize:14, color:T.inkSoft, lineHeight:1.5, maxWidth:260, margin:'0 auto' }}>
              {activePet
                ? `Nenhum aviso pendente para ${activePet.name}.`
                : 'Cadastre um pet para ver notificações.'}
            </div>
          </div>
        )}

        {unread.length > 0 && (
          <div style={{ marginTop:22 }}>
            <SectionPill icon={I.bell} label="Novos" count={unread.length}
              tint={T.tintRose} ink={T.tintRoseInk} />
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
              {unread.map(n => (
                <Card key={n.id} pad={14} radius={20} className="pressable"
                  onClick={() => { markRead(n.id); nav(n.action); }}
                  style={{ cursor:'pointer', borderLeft:`3px solid ${n.urgent ? '#EF4444' : T.brand}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <IconCircle icon={n.icon} size={40} tint={n.tint} color={n.ink} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:T.ink }}>{n.title}</div>
                      <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{n.sub}</div>
                    </div>
                    <div style={{ fontSize:11, color: n.urgent ? '#EF4444' : T.inkMute, flexShrink:0, fontWeight: n.urgent?700:400 }}>
                      {n.time}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {read.length > 0 && (
          <div style={{ marginTop: unread.length > 0 ? 26 : 22 }}>
            <SectionPill icon={I.info} label="Anteriores" count={read.length}
              tint={T.bgWash} ink={T.inkSoft} />
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
              {read.map(n => (
                <Card key={n.id} pad={14} radius={20} className="pressable"
                  onClick={() => nav(n.action)}
                  style={{ cursor:'pointer', opacity:0.7 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <IconCircle icon={n.icon} size={40} tint={n.tint} color={n.ink} />
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
        )}
      </div>
    </div>
  );
}
