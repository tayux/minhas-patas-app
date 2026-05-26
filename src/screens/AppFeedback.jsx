import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I } from '../components/Shared.jsx';

const RATINGS = [
  { value: 1, emoji: '😞', label: 'Ruim' },
  { value: 2, emoji: '😕', label: 'Regular' },
  { value: 3, emoji: '😊', label: 'Bom' },
  { value: 4, emoji: '😄', label: 'Ótimo' },
  { value: 5, emoji: '🤩', label: 'Incrível' },
];

const CATEGORIES = ['Geral', 'Bugs', 'Sugestão', 'Design', 'Desempenho'];

export default function AppFeedback() {
  const { back } = useNav();
  const { addFeedback, userId } = usePet();

  const [rating, setRating]     = useState(null);
  const [category, setCategory] = useState('Geral');
  const [comment, setComment]   = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = rating !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const ratingLabel = RATINGS.find(r => r.value === rating)?.label;
    addFeedback({
      rating,
      category,
      comment: comment.trim(),
      ratingLabel,
      submittedAt: new Date().toISOString(),
    });
    try {
      await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || null,
          rating,
          category,
          comment: comment.trim(),
          rating_label: ratingLabel,
        }),
      });
    } catch (e) {}
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column',
        background:T.bg, alignItems:'center', justifyContent:'center', padding:32 }}>
        <div style={{ fontSize:72, marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:22, fontWeight:800, color:T.ink, textAlign:'center' }}>
          Obrigada pelo feedback!
        </div>
        <div style={{ fontSize:14, color:T.inkSoft, textAlign:'center', marginTop:8,
          maxWidth:260, lineHeight:1.6 }}>
          Sua opinião é muito importante para continuarmos melhorando o MinhasPatas.
        </div>
        <button onClick={back} style={{ marginTop:32, height:48, padding:'0 40px',
          borderRadius:99, background:T.brand, color:'#fff', border:'none',
          fontSize:15, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:20, fontWeight:800, color:T.ink }}>Avaliar app</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'24px 20px 40px' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🐾</div>
          <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>
            Como está sendo sua experiência?
          </div>
          <div style={{ fontSize:13, color:T.inkSoft, marginTop:6, lineHeight:1.5 }}>
            Sua avaliação nos ajuda a melhorar o app para você e seu pet.
          </div>
        </div>

        {/* Star rating */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>
            Nota geral
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
            {RATINGS.map(r => (
              <div key={r.value} onClick={() => setRating(r.value)}
                style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
                  gap:6, padding:'12px 4px', borderRadius:16, cursor:'pointer',
                  background: rating === r.value ? T.brandSoft : T.surface,
                  border: rating === r.value ? `2px solid ${T.brand}` : '2px solid transparent',
                  transition:'all 0.15s' }}>
                <div style={{ fontSize:28 }}>{r.emoji}</div>
                <div style={{ fontSize:10, fontWeight:700,
                  color: rating === r.value ? T.brand : T.inkSoft }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>
            Categoria
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {CATEGORIES.map(cat => (
              <div key={cat} onClick={() => setCategory(cat)}
                style={{ padding:'8px 16px', borderRadius:99, cursor:'pointer', fontSize:13,
                  fontWeight:600, transition:'all 0.15s',
                  background: category === cat ? T.brand : T.surface,
                  color: category === cat ? '#fff' : T.ink,
                  boxShadow: category === cat
                    ? `0 4px 12px rgba(124,107,252,0.3)`
                    : '0 1px 4px rgba(20,20,30,0.06)' }}>
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div style={{ marginBottom:32 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:8 }}>
            Comentário (opcional)
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Conte mais sobre sua experiência, sugestões de melhoria ou reporte um problema..."
            style={{ width:'100%', minHeight:100, background:T.bgWash, borderRadius:16,
              padding:'14px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
              border:'none', outline:'none', resize:'none', boxSizing:'border-box',
              lineHeight:1.5 }}
          />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={!canSubmit}
          style={{ width:'100%', height:52, borderRadius:99, border:'none',
            background: canSubmit ? T.brand : T.surface,
            color: canSubmit ? '#fff' : T.inkMute,
            fontSize:16, fontWeight:700, fontFamily:FONT_BODY,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition:'all 0.2s',
            boxShadow: canSubmit ? `0 8px 24px rgba(124,107,252,0.3)` : 'none' }}>
          Enviar avaliação
        </button>
      </div>
    </div>
  );
}
