import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, Icon, IconCircle, PetHeader } from '../components/Shared.jsx';
import { maskDate, todayStr } from '../utils/dateUtils.js';

const CATS = ['Todos','Receitas','Exames','Vacinas','Cirurgias','Outros'];

const CAT_CONFIG = {
  Receita:  { e:'💊', tint:T.tintLavender },
  Exame:    { e:'📋', tint:T.tintSky },
  Vacina:   { e:'💉', tint:T.tintPeach },
  Cirurgia: { e:'🏥', tint:T.tintRose },
  Outro:    { e:'📄', tint:T.tintCream },
};

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

function AddDocForm({ onSave, onCancel }) {
  const [cat, setCat]     = useState('Exame');
  const [title, setTitle] = useState('');
  const [date, setDate]   = useState(todayStr());
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachName, setAttachName] = useState('');
  const cats = ['Receita','Exame','Vacina','Cirurgia','Outro'];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachName(file.name);
    const reader = new FileReader();
    reader.onload = ev => setAttachment(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px', maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, marginBottom:16 }}>
          Adicionar documento
        </div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', marginBottom:20 }}>
          {cats.map(c => (
            <div key={c} onClick={() => setCat(c)} style={{
              padding:'8px 14px', borderRadius:99, flexShrink:0,
              background: cat===c ? T.brand : T.surface,
              color: cat===c ? '#fff' : T.ink,
              fontSize:12, fontWeight:700, cursor:'pointer',
              boxShadow: cat===c ? 'none' : '0 1px 4px rgba(20,20,30,0.06)' }}>{c}</div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Título</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder="Ex: Hemograma, Receita prednisolona..."
                value={title} onChange={e => setTitle(e.target.value)} autoFocus />
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px', display:'flex', gap:8 }}>
              <span>📅</span>
              <input style={inputStyle} placeholder="dd/mm/aaaa"
                value={date} onChange={e => setDate(maskDate(e.target.value))} inputMode="numeric" />
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
              Observações (opcional)
            </div>
            <textarea style={{ width:'100%', minHeight:60, background:T.bgWash, borderRadius:14,
              padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
              border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
              placeholder="Resultado, detalhes..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
              Anexar arquivo (opcional)
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:10, background:T.bgWash,
              borderRadius:14, padding:'13px 16px', cursor:'pointer' }}>
              <span style={{ fontSize:18 }}>📎</span>
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
          <button onClick={() => title.trim() && onSave({
            cat, title, date, notes, attachmentBase64: attachment, attachName,
            e: CAT_CONFIG[cat]?.e || '📄', tint: CAT_CONFIG[cat]?.tint || T.tintCream,
          })} style={{ flex:1.5, height:48, borderRadius:99,
            background:T.brand, color:'#fff', border:'none',
            fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ doc, onClose, onDelete }) {
  const cfg = CAT_CONFIG[doc.cat] || CAT_CONFIG.Outro;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px', maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:cfg.tint,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>
            {doc.e}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.inkSoft,
              textTransform:'uppercase', letterSpacing:0.8, marginBottom:4 }}>{doc.cat}</div>
            <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>{doc.title}</div>
          </div>
          {doc._manual && (
            <div onClick={() => { onDelete(doc.id); onClose(); }}
              style={{ width:36, height:36, borderRadius:12, background:'#FEE2E2',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', flexShrink:0 }}>
              <I.trash size={17} color='#EF4444' strokeWidth={2} />
            </div>
          )}
        </div>
        {doc.date && (
          <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'center' }}>
            <span style={{ fontSize:16 }}>📅</span>
            <span style={{ fontSize:13, color:T.ink }}>{doc.date}</span>
          </div>
        )}
        {doc.notes && (
          <div style={{ background:T.bgWash, borderRadius:14, padding:'12px 16px', marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>Observações</div>
            <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{doc.notes}</div>
          </div>
        )}
        {doc.attachmentBase64 && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:6 }}>Anexo</div>
            {doc.attachmentBase64.startsWith('data:image') ? (
              <img src={doc.attachmentBase64} alt="anexo"
                style={{ width:'100%', borderRadius:14, objectFit:'contain', maxHeight:220 }} />
            ) : (
              <a href={doc.attachmentBase64} download={doc.attachName || 'documento.pdf'}
                style={{ display:'flex', alignItems:'center', gap:10, background:T.bgWash,
                  borderRadius:14, padding:'12px 16px', textDecoration:'none' }}>
                <span style={{ fontSize:20 }}>📄</span>
                <span style={{ fontSize:13, fontWeight:600, color:T.brand }}>
                  {doc.attachName || 'Baixar PDF'}
                </span>
              </a>
            )}
          </div>
        )}
        <button onClick={onClose} style={{ width:'100%', height:48, borderRadius:99,
          background:T.surface, color:T.ink, border:'none',
          fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function DocumentsLibrary() {
  const { back } = useNav();
  const { activePet, documents, addDocument, healthRecords = [], vaccines = [] } = usePet();
  const [cat, setCat]       = useState('Todos');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>📁</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Nenhum documento</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para armazenar receitas, exames e vacinas.
        </div>
      </div>
    </div>
  );

  const handleSave = (doc) => { addDocument(doc); setShowForm(false); };
  const handleDelete = (id) => setDeletedIds(prev => [...prev, id]);

  // Aggregate all docs: manual + health records with attachment + vaccines
  const allDocs = [
    ...documents.filter(d => !deletedIds.includes(d.id)).map(d => ({ ...d, _manual: true })),
    ...healthRecords
      .filter(r => r.attachmentBase64)
      .map(r => ({
        id: r.id, _manual: false,
        cat: r.type === 'Exame' ? 'Exame' : r.type === 'Cirurgia' ? 'Cirurgia' : 'Outro',
        title: r.title, date: r.date, notes: r.notes,
        attachmentBase64: r.attachmentBase64, attachName: r.attachName,
        e: CAT_CONFIG[r.type]?.e || '📋',
        tint: CAT_CONFIG[r.type]?.tint || T.tintSky,
        createdAt: r.createdAt,
      })),
    ...vaccines.map(v => ({
      id: v.id, _manual: false,
      cat: 'Vacina', title: v.name, date: v.date, notes: v.lot ? `Lote: ${v.lot}` : '',
      e: '💉', tint: T.tintPeach, createdAt: v.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const catMap = { Receitas:'Receita', Exames:'Exame', Vacinas:'Vacina', Cirurgias:'Cirurgia', Outros:'Outro' };
  const filtered = allDocs
    .filter(d => cat === 'Todos' || d.cat === catMap[cat])
    .filter(d => !search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.cat?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:20, fontWeight:800, color:T.ink, flex:1 }}>Documentos</div>
        <PetHeader />
      </div>

      <div style={{ padding:'12px 20px 0' }}>
        <div style={{ background:T.surface, borderRadius:14, padding:'11px 16px',
          display:'flex', alignItems:'center', gap:8,
          boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
          <Icon d={I.search} size={16} color={T.inkSoft} stroke={2} />
          <input style={{ flex:1, border:'none', outline:'none', background:'transparent',
            fontSize:14, color:T.ink, fontFamily:FONT_BODY }}
            placeholder="Buscar documentos..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <div onClick={() => setSearch('')}
              style={{ fontSize:18, color:T.inkSoft, cursor:'pointer', lineHeight:1 }}>×</div>
          )}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, padding:'12px 20px 0', overflowX:'auto' }}>
        {CATS.map(c => (
          <div key={c} onClick={() => setCat(c)} style={{
            padding:'7px 16px', borderRadius:100, flexShrink:0, cursor:'pointer',
            background: cat===c ? T.brand : T.surface, fontSize:13, fontWeight:700,
            color: cat===c ? '#fff' : T.ink, fontFamily:FONT_BODY,
            boxShadow: cat===c ? 'none' : '0 1px 4px rgba(20,20,30,0.06)' }}>
            {c}
          </div>
        ))}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 96px' }}>
        {allDocs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:64 }}>📁</div>
            <div style={{ fontWeight:800, fontSize:18, color:T.ink, marginTop:12 }}>
              Nenhum documento ainda
            </div>
            <div style={{ fontSize:14, color:T.inkSoft, marginTop:8, maxWidth:240, margin:'8px auto 0', lineHeight:1.5 }}>
              Adicione receitas, exames e documentos. Vacinas e exames cadastrados aparecem aqui automaticamente.
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:48 }}>🔍</div>
            <div style={{ fontSize:16, fontWeight:700, color:T.ink, marginTop:12 }}>Nenhum resultado</div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:4 }}>Tente outro termo ou categoria</div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {filtered.map((d) => (
              <div key={d.id} onClick={() => setDetail(d)}
                style={{ background:T.surface, borderRadius:16, overflow:'hidden',
                  boxShadow:'0 2px 8px rgba(20,20,30,0.05)', cursor:'pointer',
                  position:'relative' }}>
                <div style={{ background:d.tint || T.tintCream, padding:'20px 0',
                  textAlign:'center', fontSize:36 }}>
                  {d.e || '📄'}
                  <div style={{ position:'absolute', top:8, right:8, padding:'3px 8px',
                    background:'rgba(255,255,255,0.7)', borderRadius:99,
                    fontSize:9, fontWeight:700, color:T.inkSoft }}>{d.cat}</div>
                  {!d._manual && (
                    <div style={{ position:'absolute', top:8, left:8, padding:'3px 6px',
                      background:'rgba(255,255,255,0.7)', borderRadius:99,
                      fontSize:9, fontWeight:700, color:T.brand }}>auto</div>
                  )}
                </div>
                <div style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.title}</div>
                  <div style={{ fontSize:11, color:T.inkSoft, marginTop:2 }}>{d.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div onClick={() => setShowForm(true)}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56, borderRadius:28,
          background:T.ink, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:28, color:'#fff', cursor:'pointer',
          boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)', zIndex:10 }}>+</div>

      {showForm && <AddDocForm onSave={handleSave} onCancel={() => setShowForm(false)} />}
      {detail && <DetailModal doc={detail} onClose={() => setDetail(null)} onDelete={handleDelete} />}
    </div>
  );
}
