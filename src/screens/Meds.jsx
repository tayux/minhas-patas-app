import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, IconCircle, IconBtn, Eyebrow, Display, PetHeader } from '../components/Shared.jsx';

const TINT_MAP = {
  tintLavender: T.tintLavender,
  tintSky:      T.tintSky,
  tintMint:     T.tintMint,
  tintPeach:    T.tintPeach,
  tintRose:     T.tintRose,
  tintCream:    T.tintCream,
};

function MedDetail({ med, onClose, onDelete }) {
  const tint = TINT_MAP[med.tintKey] || T.tintLavender;
  const [confirm, setConfirm] = useState(false);
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
          <EmojiCircle emoji={med.emoji || '💊'} size={52} tint={tint} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink }}>{med.name}</div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>
              {med.type || 'Medicamento'}
            </div>
          </div>
          <div onClick={() => setConfirm(true)}
            style={{ width:36, height:36, borderRadius:12, background:'#FEE2E2',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', flexShrink:0 }}>
            <I.trash size={17} color='#EF4444' strokeWidth={2} />
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {med.dose && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.bgWash, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Dose</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>
                {med.dose}{med.unit ? ` ${med.unit}` : ''}
              </span>
            </div>
          )}
          {med.freq && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.bgWash, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Frequência</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{med.freq}</span>
            </div>
          )}
          {med.startDate && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.bgWash, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Início</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{med.startDate}</span>
            </div>
          )}
          {med.endDate && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
              background:T.bgWash, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Fim</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{med.endDate}</span>
            </div>
          )}
          {med.continuous && (
            <div style={{ padding:'12px 16px', background:T.brandSoft, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:700, color:T.brand }}>♾️ Uso contínuo</span>
            </div>
          )}
          {med.notes && (
            <div style={{ background:T.bgWash, borderRadius:14, padding:'12px 16px' }}>
              <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>Observações</div>
              <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{med.notes}</div>
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ width:'100%', height:48, borderRadius:99, marginTop:20,
          background:T.surface, color:T.ink, border:'none',
          fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Fechar
        </button>

        {confirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, padding:20 }}>
            <div style={{ background:T.bg, borderRadius:20, padding:'22px 20px', maxWidth:340, width:'100%' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
                <IconCircle icon={I.trash} size={52} tint='#FEE2E2' color='#EF4444' />
              </div>
              <div style={{ fontSize:16, fontWeight:800, color:T.ink, textAlign:'center', marginBottom:6 }}>
                Remover {med.name}?
              </div>
              <div style={{ fontSize:13, color:T.inkSoft, textAlign:'center', lineHeight:1.5, marginBottom:18 }}>
                O medicamento e seus lembretes no Google Calendar serão removidos.
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setConfirm(false)} style={{ flex:1, height:44, borderRadius:99,
                  background:T.surface, color:T.ink, border:'none',
                  fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
                  Cancelar
                </button>
                <button onClick={() => { onDelete(); onClose(); }} style={{ flex:1, height:44, borderRadius:99,
                  background:'#EF4444', color:'#fff', border:'none',
                  fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Meds() {
  const { nav, back } = useNav();
  const { activePet, medications, deleteMedication } = usePet();
  const [filter, setFilter]     = useState('Ativos');
  const [toggleMap, setToggleMap] = useState({});
  const [detail, setDetail]     = useState(null);
  const [fabOpen, setFabOpen]   = useState(false);

  const toggle = (id) => setToggleMap(prev => ({ ...prev, [id]: !(prev[id] ?? true) }));
  const isOn = (m) => toggleMap[m.id] !== undefined ? toggleMap[m.id] : m.on;

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>💊</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Nenhum medicamento</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para gerenciar os medicamentos.
        </div>
      </div>
    </div>
  );

  const active   = medications.filter(m => isOn(m));
  const done     = medications.filter(m => !isOn(m));
  const filtered = filter === 'Ativos' ? active : filter === 'Concluídos' ? done : medications;

  const filterTabs = [
    { l:'Ativos',     n: active.length },
    { l:'Concluídos', n: done.length },
    { l:'Todos',      n: medications.length },
  ];

  if (medications.length === 0) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <PetHeader />
        <div style={{ width:36 }} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:'0 32px 80px', textAlign:'center' }}>
        <div style={{ fontSize:64 }}>💊</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>
          Nenhum medicamento ainda
        </div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Registre os medicamentos e tratamentos do seu pet para acompanhar as doses diárias.
        </div>
      </div>
      {/* FAB */}
      {fabOpen && (
        <div style={{ position:'absolute', bottom:96, right:20, display:'flex', flexDirection:'column',
          alignItems:'flex-end', gap:10, zIndex:100 }}>
          {[
            { label:'Adicionar manualmente', emoji:'✏️', action: () => { nav('addmedication'); setFabOpen(false); } },
            { label:'A partir de uma imagem', emoji:'📷', action: () => { nav('ai'); setFabOpen(false); } },
          ].map(o => (
            <div key={o.label} onClick={o.action}
              style={{ display:'flex', alignItems:'center', gap:10, background:T.bg,
                borderRadius:99, padding:'10px 16px 10px 12px',
                boxShadow:'0 4px 16px rgba(20,20,30,0.15)', cursor:'pointer' }}>
              <span style={{ fontSize:18 }}>{o.emoji}</span>
              <span style={{ fontSize:14, fontWeight:700, color:T.ink }}>{o.label}</span>
            </div>
          ))}
        </div>
      )}
      {fabOpen && <div onClick={() => setFabOpen(false)} style={{ position:'fixed', inset:0, zIndex:99 }} />}
      <div onClick={() => setFabOpen(v => !v)}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56, borderRadius:28,
          background: fabOpen ? T.inkSoft : T.ink, color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)',
          transition:'background 0.2s, transform 0.2s',
          transform: fabOpen ? 'rotate(45deg)' : 'none', zIndex:101 }}>
        <I.plus size={26} color='#fff' strokeWidth={2.2} />
      </div>
    </div>
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <PetHeader />
        <div style={{ width:36 }} />
      </div>
      <div style={{ padding:'20px 24px 0' }}>
        <Eyebrow>Medicamentos</Eyebrow>
        <Display size={32} weight={400} style={{ marginTop:6 }}>
          Tratamento de <span style={{ fontStyle:'italic' }}>{activePet.name}</span>
        </Display>
        <div style={{ fontSize:13, color:T.inkSoft, marginTop:8 }}>
          {active.length} {active.length === 1 ? 'ativo' : 'ativos'}
        </div>
      </div>
      <div style={{ display:'flex', gap:8, padding:'18px 24px 4px', overflowX:'auto' }}>
        {filterTabs.map((f, i) => {
          const a = filter === f.l;
          return (
            <div key={i} onClick={() => setFilter(f.l)} style={{ padding:'8px 14px', borderRadius:99,
              fontWeight:600, fontSize:13, flexShrink:0, fontFamily:FONT_BODY,
              background: a ? T.ink : T.surface, color: a ? '#fff' : T.ink,
              display:'flex', alignItems:'center', gap:6, cursor:'pointer',
              boxShadow: a ? 'none' : '0 1px 2px rgba(20,20,30,0.04)' }}>
              {f.l}
              <span style={{ padding:'1px 7px', borderRadius:99, fontSize:11,
                background: a ? 'rgba(255,255,255,0.18)' : T.bgWash,
                color: a ? '#fff' : T.inkSoft }}>{f.n}</span>
            </div>
          );
        })}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 24px 96px', display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px', color:T.inkMute }}>
            <div style={{ fontSize:40 }}>🎉</div>
            <div style={{ fontWeight:700, color:T.ink, marginTop:8 }}>
              {filter === 'Concluídos' ? 'Nenhum tratamento concluído' : 'Nenhum medicamento nesta categoria'}
            </div>
          </div>
        ) : filtered.map((m) => {
          const tint = TINT_MAP[m.tintKey] || T.tintLavender;
          const on = isOn(m);
          return (
            <Card key={m.id} pad={14} radius={20} style={{ cursor:'pointer' }}
              onClick={() => setDetail(m)}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <EmojiCircle emoji={m.emoji || '💊'} size={42} tint={tint} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>{m.name}</div>
                  <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>
                    {[m.dose, m.unit].filter(Boolean).join('')}
                    {m.freq ? ` · ${m.freq}` : ''}
                  </div>
                  {m.startDate && (
                    <div style={{ fontSize:12, color:T.brand, marginTop:6,
                      fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                      <Icon d={I.cal} size={12} color={T.brand} stroke={2} />
                      Início · {m.startDate}
                    </div>
                  )}
                </div>
                <div onClick={e => { e.stopPropagation(); toggle(m.id); }} style={{
                  width:40, height:24, borderRadius:99,
                  background: on ? T.brand : T.bgWash, position:'relative',
                  transition:'background 0.2s', cursor:'pointer', flexShrink:0 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff',
                    position:'absolute', top:2, left: on ? 18 : 2,
                    boxShadow:'0 1px 3px rgba(20,20,30,0.2)', transition:'left 0.2s' }} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* FAB with 2 options */}
      {fabOpen && (
        <div style={{ position:'absolute', bottom:96, right:20, display:'flex', flexDirection:'column',
          alignItems:'flex-end', gap:10, zIndex:100 }}>
          {[
            { label:'Adicionar manualmente', emoji:'✏️', action: () => { nav('addmedication'); setFabOpen(false); } },
            { label:'A partir de uma imagem', emoji:'📷', action: () => { nav('ai'); setFabOpen(false); } },
          ].map(o => (
            <div key={o.label} onClick={o.action}
              style={{ display:'flex', alignItems:'center', gap:10, background:T.bg,
                borderRadius:99, padding:'10px 16px 10px 12px',
                boxShadow:'0 4px 16px rgba(20,20,30,0.15)', cursor:'pointer' }}>
              <span style={{ fontSize:18 }}>{o.emoji}</span>
              <span style={{ fontSize:14, fontWeight:700, color:T.ink }}>{o.label}</span>
            </div>
          ))}
        </div>
      )}
      {fabOpen && <div onClick={() => setFabOpen(false)} style={{ position:'fixed', inset:0, zIndex:99 }} />}
      <div onClick={() => setFabOpen(v => !v)}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56, borderRadius:28,
          background: fabOpen ? T.inkSoft : T.ink, color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)',
          transition:'background 0.2s, transform 0.2s',
          transform: fabOpen ? 'rotate(45deg)' : 'none', zIndex:101 }}>
        <I.plus size={26} color='#fff' strokeWidth={2.2} />
      </div>

      {detail && (
        <MedDetail
          med={detail}
          onClose={() => setDetail(null)}
          onDelete={() => { deleteMedication(detail.id); setDetail(null); }}
        />
      )}
    </div>
  );
}
