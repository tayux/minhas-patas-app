// Allow up to 10MB body for photos
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

async function callClaude(apiKey, base64, mimeType, prompt) {
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'pdfs-2024-09-25',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
          { type: 'text', text: prompt },
        ],
      }],
    }),
  });
}

function parseJson(text) {
  const clean = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
  try { return JSON.parse(clean); } catch {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada.' });

  const { imageBase64, mimeType } = req.body || {};
  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });
  }

  const prompt = `Você está analisando uma foto de um cartão ou caderneta de vacinação veterinária.

Extraia TODAS as vacinas registradas e retorne em JSON.

INSTRUÇÕES CRÍTICAS:
- Leia com atenção todo o texto visível na imagem.
- Inclua SOMENTE vacinas cujos nomes estão escritos na imagem — não invente.
- Para "name": copie o nome exato como está escrito (ex: "Antirrábica", "V10", "V8", "Gripe Felina").
- Para "date": data de aplicação no formato dd/mm/aaaa. Se o ano tiver 2 dígitos, adicione 2000. Se não visível, use null.
- Para "nextDate": data do próximo reforço ou retorno no formato dd/mm/aaaa. Se não visível, use null.
- Para "lot": número do lote (geralmente precedido por "Lote:", "Lt." ou similar). Se não visível, use null.
- Para "vet": nome do veterinário ou clínica. Se não visível, use null.

Retorne SOMENTE o JSON abaixo, sem nenhum texto antes ou depois, sem markdown:
{"vaccines":[{"name":"...","date":"dd/mm/aaaa ou null","nextDate":"dd/mm/aaaa ou null","lot":"...ou null","vet":"...ou null"}]}

Se não for um cartão de vacinação legível ou a imagem estiver muito borrada:
{"vaccines":[],"error":"Não foi possível identificar um cartão de vacinação. Tente uma foto mais nítida e com boa iluminação."}`;

  try {
    const claudeRes = await callClaude(apiKey, imageBase64, mimeType, prompt);
    if (!claudeRes.ok) {
      const detail = await claudeRes.text();
      console.error('Claude error (vaccine-card):', claudeRes.status, detail);
      return res.status(502).json({ error: 'Erro ao contatar a IA. Tente novamente.' });
    }
    const data = await claudeRes.json();
    const text = data.content?.[0]?.text || '';
    console.log('[vaccine-card] Claude raw (first 500):', text.slice(0, 500));
    const result = parseJson(text);
    if (!result) {
      console.error('[vaccine-card] JSON parse failed, raw:', text.slice(0, 300));
      return res.status(200).json({
        vaccines: [],
        error: 'A IA não conseguiu estruturar a resposta. Tente uma foto mais nítida.',
      });
    }
    return res.status(200).json(result);
  } catch (e) {
    console.error('vaccine-card error:', e);
    return res.status(500).json({ error: 'Erro interno ao analisar o cartão.' });
  }
}
