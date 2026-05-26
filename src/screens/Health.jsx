import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, IconBtn, IconCircle, PetHeader } from '../components/Shared.jsx';
import { maskDate, todayStr } from '../utils/dateUtils.js';

const TABS = ['Timeline','Exames','Alergias','Cirurgias'];

const TYPE_CONFIG = {
  Exame:    { color:T.tintSkyInk,  bg:T.tintSky,   icon:I.exam    },
  Alergia:  { color:'#B45309',      bg:'#FEF3C7',   icon:I.alert   },
  Cirurgia: { color:'#B45309',      bg:'#FEF3C7',   icon:I.hospital },
  Consulta: { color:T.brand,        bg:T.brandSoft, icon:I.health  },
};

const STATUS_CONFIG = {
  'normal':  { color:'#166534', bg:'#DCFCE7', label:'Normal' },
  'atenção': { color:'#92400E', bg:'#FEF3C7', label:'Atenção' },
  'alerta':  { color:'#991B1B', bg:'#FEE2E2', label:'Alerta' },
};

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

function parseDataUrl(dataUrl) {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function AddForm({ initialType = 'Exame', onSave, onCancel }) {
  const [type, setType]   = useState(initialType);
  const [title, setTitle] = useState('');
  const [date, setDate]   = useState(todayStr());
  const [vet, setVet]     = useState('');
  const [severity, setSev] = useState('Leve');
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachName, setAttachName] = useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachName(file.name);
    const reader = new FileReader();
    reader.onload = ev => setAttachment(ev.target.result);
    reader.readAsDataURL(file);
  };

  const types = ['Exame','Alergia','Cirurgia'];

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px', maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, marginBottom:16 }}>
          Novo registro de saúde
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {types.map(t => (
            <div key={t} onClick={() => setType(t)} style={{
              flex:1, textAlign:'center', padding:'10px 0', borderRadius:14,
              background: type===t ? T.brandSoft : T.surface,
              border: `1.5px solid ${type===t ? T.brand : 'transparent'}`,
              fontSize:12, fontWeight:700, color: type===t ? T.brand : T.inkSoft,
              cursor:'pointer' }}>{t}</div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Título</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder={
                type==='Exame' ? 'Ex: Hemograma completo...' :
                type==='Alergia' ? 'Ex: Alergia a frango...' : 'Ex: Castração...'
              } value={title} onChange={e => setTitle(e.target.value)} autoFocus />
            </div>
          </div>
          {type !== 'Alergia' && (
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px', display:'flex', gap:8, alignItems:'center' }}>
                <Icon d={I.cal} size={16} color={T.inkSoft} />
                <input style={inputStyle} placeholder="dd/mm/aaaa"
                  value={date} onChange={e => setDate(maskDate(e.target.value))} inputMode="numeric" />
              </div>
            </div>
          )}
          {type === 'Alergia' && (
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Gravidade</div>
              <div style={{ display:'flex', background:T.bgWash, borderRadius:14, padding:3, gap:3 }}>
                {['Leve','Moderada','Grave'].map(s => {
                  const a = severity === s;
                  return (
                    <div key={s} onClick={() => setSev(s)} style={{
                      flex:1, textAlign:'center', padding:'10px 0', borderRadius:11,
                      background: a ? T.surface : 'transparent',
                      fontWeight: a?700:500, fontSize:13, color: a?T.ink:T.inkSoft,
                      cursor:'pointer' }}>{s}</div>
                  );
                })}
              </div>
            </div>
          )}
          {type !== 'Alergia' && (
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
                {type === 'Cirurgia' ? 'Veterinário / Clínica' : 'Veterinário (opcional)'}
              </div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
                <input style={inputStyle} placeholder="Dr. Ana, Clínica PetCare..."
                  value={vet} onChange={e => setVet(e.target.value)} />
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
              Observações (opcional)
            </div>
            <textarea style={{ width:'100%', minHeight:60, background:T.bgWash, borderRadius:14,
              padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
              border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
              placeholder="Resultado, recomendações..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
              Anexar resultado (opcional)
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:10, background:T.bgWash,
              borderRadius:14, padding:'13px 16px', cursor:'pointer' }}>
              <Icon d={I.clip} size={18} color={T.inkSoft} />
              <span style={{ fontSize:13, color: attachName ? T.ink : T.inkSoft, flex:1 }}>
                {attachName || 'Selecionar imagem ou PDF'}
              </span>
              <input type="file" accept="image/*,application/pdf" onChange={handleFile}
                style={{ display:'none' }} />
            </label>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:20 }}>
          <button onClick={onCancel} style={{ flex:1, height:48, borderRadius:99,
            background:T.surface, color:T.ink, border:'none',
            fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Cancelar
          </button>
          <button onClick={() => title.trim() && onSave({ type, title, date, vet, severity, notes, attachmentBase64: attachment, attachName })}
            style={{ flex:1.5, height:48, borderRadius:99,
              background:T.brand, color:'#fff', border:'none',
              fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function ExplainPanel({ explanation, onClose }) {
  if (!explanation) return null;
  if (explanation.error) return (
    <div style={{ marginTop:12, background:'#FEE2E2', borderRadius:14, padding:'14px 16px' }}>
      <div style={{ fontSize:13, color:'#991B1B', fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
        <Icon d={I.alert} size={14} color='#991B1B' /> {explanation.error}
      </div>
    </div>
  );

  const overall = STATUS_CONFIG[explanation.overallStatus] || STATUS_CONFIG['normal'];

  return (
    <div style={{ marginTop:16 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <Icon d={I.sparkles} size={18} color='#7C3AED' />
        <span style={{ fontWeight:700, fontSize:15, color:T.ink }}>Explicação com IA</span>
        <div style={{ flex:1 }} />
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99,
          background:overall.bg, color:overall.color }}>{overall.label}</span>
      </div>

      {/* Summary */}
      {explanation.examType && (
        <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, textTransform:'uppercase',
          letterSpacing:0.5, marginBottom:4 }}>{explanation.examType}</div>
      )}
      <div style={{ fontSize:14, color:T.ink, lineHeight:1.6, marginBottom:12,
        background:T.bgWash, borderRadius:12, padding:'12px 14px' }}>
        {explanation.summary}
      </div>

      {/* Parameters */}
      {explanation.parameters?.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft, textTransform:'uppercase',
            letterSpacing:0.5, marginBottom:8 }}>Parâmetros</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {explanation.parameters.map((p, i) => {
              const st = STATUS_CONFIG[p.status] || STATUS_CONFIG['normal'];
              return (
                <div key={i} style={{ background:T.surface, borderRadius:12,
                  padding:'10px 12px', borderLeft:`3px solid ${st.color}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:13, color:T.ink, flex:1 }}>{p.name}</span>
                    <span style={{ fontWeight:700, fontSize:12, color:st.color }}>{p.value}</span>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:99,
                      background:st.bg, color:st.color }}>{st.label}</span>
                  </div>
                  {p.reference && (
                    <div style={{ fontSize:11, color:T.inkSoft, marginBottom:4 }}>Ref: {p.reference}</div>
                  )}
                  <div style={{ fontSize:12, color:T.ink, lineHeight:1.5 }}>{p.explanation}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Highlights */}
      {explanation.highlights?.length > 0 && (
        <div style={{ background:'#FEF3C7', borderRadius:12, padding:'10px 14px', marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#92400E', marginBottom:6, display:'flex', alignItems:'center', gap:5 }}>
            <Icon d={I.alert} size={13} color='#92400E' /> Pontos de atenção
          </div>
          {explanation.highlights.map((h, i) => (
            <div key={i} style={{ fontSize:13, color:'#78350F', lineHeight:1.5, marginBottom:i < explanation.highlights.length - 1 ? 4 : 0 }}>
              • {h}
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      {explanation.recommendation && (
        <div style={{ background:T.brandSoft, borderRadius:12, padding:'10px 14px', marginBottom:10 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.brand, marginBottom:4, display:'flex', alignItems:'center', gap:5 }}>
            <Icon d={I.health} size={13} color={T.brand} /> Recomendação
          </div>
          <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{explanation.recommendation}</div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ fontSize:11, color:T.inkSoft, lineHeight:1.5, fontStyle:'italic',
        textAlign:'center', paddingTop:4 }}>
        {explanation.disclaimer || 'Este é um resumo educativo. Consulte sempre seu veterinário para interpretação e diagnóstico.'}
      </div>
    </div>
  );
}

function DetailModal({ record, onClose }) {
  const { activePet, saveExamExplanation } = usePet();
  const cfg = TYPE_CONFIG[record.type] || TYPE_CONFIG.Exame;

  // Initialise from cached DB value — no API call needed if already analysed
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState(record.aiExplanation || null);

  const hasAttachment = !!record.attachmentBase64;
  const isExamType = ['Exame', 'Cirurgia'].includes(record.type);

  const handleExplain = async () => {
    const parsed = parseDataUrl(record.attachmentBase64);
    if (!parsed) return;
    setExplaining(true);
    setExplanation(null);
    try {
      const res = await fetch('/api/analyze-prescription?action=exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: parsed.data,
          mimeType: parsed.mimeType,
          petName: activePet?.name || null,
          petSpecies: activePet?.species || null,
        }),
      });
      const data = await res.json();
      setExplanation(data);
      // Persist to DB and local state so future opens skip the API call
      if (!data.error && record.id) {
        saveExamExplanation(record.id, data);
      }
    } catch (e) {
      setExplanation({ error: 'Não foi possível conectar à IA. Tente novamente.' });
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <IconCircle icon={cfg.icon} size={44} tint={cfg.bg} color={cfg.color} />
          <div>
            <div style={{ display:'inline-flex', padding:'3px 10px', borderRadius:99,
              background:cfg.bg, color:cfg.color, fontSize:11, fontWeight:700, marginBottom:4 }}>
              {record.type}
            </div>
            <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>{record.title}</div>
          </div>
        </div>
        {record.date && (
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
            <Icon d={I.cal} size={14} color={T.inkSoft} />
            <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Data:</span>
            <span style={{ fontSize:13, color:T.ink }}>{record.date}</span>
          </div>
        )}
        {record.vet && (
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
            <Icon d={I.health} size={14} color={T.inkSoft} />
            <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Vet:</span>
            <span style={{ fontSize:13, color:T.ink }}>{record.vet}</span>
          </div>
        )}
        {record.severity && record.type === 'Alergia' && (
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
            <Icon d={I.alert} size={14} color='#B45309' />
            <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Gravidade:</span>
            <span style={{ fontSize:13, color:T.ink }}>{record.severity}</span>
          </div>
        )}
        {record.notes && (
          <div style={{ background:T.bgWash, borderRadius:14, padding:'12px 16px', marginTop:4 }}>
            <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>Observações</div>
            <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{record.notes}</div>
          </div>
        )}
        {hasAttachment && (
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:6 }}>Anexo</div>
            {record.attachmentBase64.startsWith('data:image') ? (
              <img src={record.attachmentBase64} alt="anexo"
                style={{ width:'100%', borderRadius:14, objectFit:'contain', maxHeight:220 }} />
            ) : (
              <a href={record.attachmentBase64} download={record.attachName || 'documento.pdf'}
                style={{ display:'flex', alignItems:'center', gap:10, background:T.bgWash,
                  borderRadius:14, padding:'12px 16px', textDecoration:'none' }}>
                <Icon d={I.file} size={20} color={T.brand} />
                <span style={{ fontSize:13, fontWeight:600, color:T.brand }}>
                  {record.attachName || 'Baixar PDF'}
                </span>
              </a>
            )}

            {/* AI Explain button — show for exams with attachment when not yet analysed */}
            {isExamType && !explanation && !explaining && (
              <button
                onClick={handleExplain}
                style={{ width:'100%', height:44, borderRadius:14, border:'none',
                  marginTop:10, cursor:'pointer',
                  background:'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                  color:'#fff', fontFamily:FONT_BODY, fontSize:14, fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <Icon d={I.sparkles} size={16} color='#fff' /> Explicar resultado com IA
              </button>
            )}
            {isExamType && explaining && (
              <div style={{ width:'100%', height:44, borderRadius:14, marginTop:10,
                background:T.bgWash, display:'flex', alignItems:'center',
                justifyContent:'center', gap:8, color:T.inkSoft,
                fontFamily:FONT_BODY, fontSize:14, fontWeight:600 }}>
                <Icon d={I.rotate} size={16} color={T.inkSoft} style={{ animation:'spin 1s linear infinite' }} /> Analisando…
              </div>
            )}

            {/* Explanation panel */}
            {explanation && <ExplainPanel explanation={explanation} onClose={() => setExplanation(null)} />}

            {/* Re-analyze button */}
            {explanation && !explanation.error && (
              <button onClick={() => { setExplanation(null); }}
                style={{ width:'100%', height:38, borderRadius:12, border:'none', marginTop:8,
                  background:T.bgWash, color:T.inkSoft,
                  fontFamily:FONT_BODY, fontSize:13, fontWeight:600, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <Icon d={I.rotate} size={14} color={T.inkSoft} /> Analisar novamente
              </button>
            )}
          </div>
        )}
        <button onClick={onClose} style={{ width:'100%', height:48, borderRadius:99, marginTop:20,
          background:T.surface, color:T.ink, border:'none',
          fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function Health() {
  const { back } = useNav();
  const { activePet, healthRecords, addHealthRecord } = usePet();
  const [tab, setTab]     = useState('Timeline');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('Exame');
  const [fabOpen, setFabOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const openFab = (type) => { setFormType(type); setShowForm(true); setFabOpen(false); };
  const handleSave = (rec) => { addHealthRecord(rec); setShowForm(false); };

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <Icon d={I.health} size={52} color={T.inkSoft} />
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Sem histórico de saúde</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para registrar o histórico de saúde.
        </div>
      </div>
    </div>
  );

  const sortByDateDesc = (arr) => [...arr].sort((a, b) => {
    const toIso = (d) => {
      if (!d) return '';
      if (/^\d{4}-/.test(d)) return d.slice(0, 10);
      const parts = d.split('/');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return d;
    };
    return toIso(b.date).localeCompare(toIso(a.date));
  });

  const tabFiltered = sortByDateDesc(
    tab === 'Timeline' ? healthRecords
      : healthRecords.filter(r => r.type === (tab === 'Exames' ? 'Exame' : tab === 'Alergias' ? 'Alergia' : 'Cirurgia'))
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, flex:1 }}>Saúde & Exames</div>
        <PetHeader />
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', padding:'16px 20px 0', gap:4, overflowX:'auto' }}>
        {TABS.map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            padding:'7px 16px', borderRadius:99, flexShrink:0, cursor:'pointer',
            fontSize:13, fontWeight: tab===t?700:500,
            color: tab===t?T.brand:T.inkSoft,
            background: tab===t?T.brandSoft:'transparent',
            fontFamily:FONT_BODY }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ height:1, background:T.hairline, margin:'8px 0 0' }} />

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 96px' }}>
        {tabFiltered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <Icon d={I.health} size={52} color={T.inkSoft} />
            <div style={{ fontWeight:700, fontSize:16, color:T.ink, marginTop:12 }}>
              Nenhum registro ainda
            </div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:4, maxWidth:240, margin:'8px auto 0' }}>
              {tab === 'Timeline'
                ? 'Use o botão + para adicionar exames, alergias ou cirurgias.'
                : `Adicione o primeiro registro de ${tab.toLowerCase()}.`}
            </div>
          </div>
        ) : (
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:23, top:8, bottom:0, width:2,
              background:T.brandSoft }} />
            {tabFiltered.map((ev, i) => {
              const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.Exame;
              const hasFile = !!ev.attachmentBase64;
              return (
                <div key={ev.id || i} onClick={() => setDetail(ev)}
                  style={{ display:'flex', gap:16, marginBottom:28, cursor:'pointer' }}>
                  <div style={{ width:16, height:16, borderRadius:8, background:T.brand,
                    marginTop:4, flexShrink:0, position:'relative', zIndex:1,
                    boxShadow:`0 0 0 4px ${T.brandSoft}` }} />
                  <div style={{ flex:1, background:T.surface, borderRadius:16, padding:'12px 14px',
                    boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
                    <div style={{ fontSize:11, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>
                      {ev.date || '—'}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                      <div style={{ display:'inline-flex', padding:'3px 10px', borderRadius:99,
                        background:cfg.bg, color:cfg.color,
                        fontSize:11, fontWeight:700 }}>{ev.type}</div>
                      {hasFile && (
                        <div style={{ fontSize:11, padding:'3px 8px', borderRadius:99,
                          background:'linear-gradient(135deg, #EDE9FE, #E0E7FF)',
                          color:'#4F46E5', fontWeight:700 }}>✨ IA</div>
                      )}
                    </div>
                    <div style={{ fontSize:14, fontWeight:600, color:T.ink }}>{ev.title}</div>
                    {ev.vet && <div style={{ fontSize:12, color:T.inkSoft, marginTop:2, display:'flex', alignItems:'center', gap:4 }}><Icon d={I.health} size={12} color={T.inkSoft} />{ev.vet}</div>}
                    {ev.notes && <div style={{ fontSize:12, color:T.inkMute, marginTop:4, fontStyle:'italic' }}>
                      {ev.notes.slice(0, 80)}{ev.notes.length > 80 ? '…' : ''}
                    </div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB with options */}
      {fabOpen && (
        <div style={{ position:'absolute', bottom:96, right:20, display:'flex', flexDirection:'column',
          alignItems:'flex-end', gap:10, zIndex:100 }}>
          {[
            { type:'Exame',    label:'Exame',    icon:I.exam    },
            { type:'Alergia',  label:'Alergia',  icon:I.alert   },
            { type:'Cirurgia', label:'Cirurgia', icon:I.hospital },
          ].map(o => (
            <div key={o.type} onClick={() => openFab(o.type)}
              style={{ display:'flex', alignItems:'center', gap:10, background:T.bg,
                borderRadius:99, padding:'10px 16px 10px 12px',
                boxShadow:'0 4px 16px rgba(20,20,30,0.15)', cursor:'pointer' }}>
              <Icon d={o.icon} size={18} color={T.ink} />
              <span style={{ fontSize:14, fontWeight:700, color:T.ink }}>{o.label}</span>
            </div>
          ))}
        </div>
      )}
      {fabOpen && (
        <div onClick={() => setFabOpen(false)}
          style={{ position:'fixed', inset:0, zIndex:99 }} />
      )}
      <div onClick={() => setFabOpen(v => !v)}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56, borderRadius:28,
          background: fabOpen ? T.inkSoft : T.ink, color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)',
          fontSize:28, transition:'background 0.2s, transform 0.2s',
          transform: fabOpen ? 'rotate(45deg)' : 'none', zIndex:101 }}>+</div>

      {showForm && <AddForm initialType={formType} onSave={handleSave} onCancel={() => setShowForm(false)} />}
      {detail && <DetailModal record={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
