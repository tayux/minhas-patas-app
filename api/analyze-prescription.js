// Allow up to 10MB body for large PDFs/images
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

// Builds the correct content block for Claude depending on mime type
function mediaBlock(mimeType, base64) {
  if (mimeType === 'application/pdf') {
    return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } };
  }
  return { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } };
}

async function callClaude(apiKey, base64, mimeType, prompt, maxTokens = 2048) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'pdfs-2024-09-25',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: [mediaBlock(mimeType, base64), { type: 'text', text: prompt }],
      }],
    }),
  });
  return res;
}

function parseJson(text) {
  const clean = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
  try { return JSON.parse(clean); } catch {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

// ─── action=prescription ────────────────────────────────────────────────────
async function handlePrescription(req, res, apiKey) {
  const { imageBase64, mimeType } = req.body || {};
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });

  const prompt = `Analise este documento de receita veterinária e retorne um JSON com os medicamentos prescritos.

INSTRUÇÕES CRÍTICAS:
- Leia o texto do documento com atenção antes de responder.
- Inclua SOMENTE os medicamentos cujos nomes estão ESCRITOS no documento.
- NÃO invente medicamentos que não estejam no texto. Se não tiver certeza de um nome, omita.
- Para "name": copie o nome exato como está escrito, incluindo concentração se houver.
- Para "dose": número exato escrito, ou null se não informado.
- Para "unit": unidade como escrita (comprimido, ml, gotas, ampola), ou null.
- Para "freq": frequência como escrita (ex: "1x ao dia", "a cada 12h"), ou null.
- Para "durationDays": número de dias se escrito, ou null.
- Para "purpose": você PODE usar conhecimento veterinário para descrever em 1 frase o que o medicamento trata.
- Para "suggestedTimes": calcule a partir da freq — 1x/dia→["08:00"], 2x/dia ou a cada 12h→["08:00","20:00"], 3x/dia→["08:00","14:00","20:00"], dose única→["08:00"].

Retorne SOMENTE o JSON abaixo, sem nenhum texto antes ou depois, sem markdown:
{"medications":[{"name":"...","purpose":"...","dose":"...","unit":"...","freq":"...","durationDays":null,"suggestedTimes":["08:00"],"emoji":"💊"}],"vet":"nome ou null","crmv":"número ou null"}

Se não for uma receita veterinária legível: {"medications":[],"vet":null,"crmv":null,"error":"Não foi possível identificar uma receita veterinária. Tente uma foto mais nítida ou outro arquivo."}`;

  try {
    const claudeRes = await callClaude(apiKey, imageBase64, mimeType, prompt, 2048);
    if (!claudeRes.ok) {
      const detail = await claudeRes.text();
      console.error('Claude error (prescription):', claudeRes.status, detail);
      const msg = claudeRes.status === 401
        ? 'Chave de API inválida. Contate o suporte.'
        : 'Erro ao contatar a IA. Tente novamente.';
      return res.status(502).json({ error: msg });
    }
    const data = await claudeRes.json();
    const text = data.content?.[0]?.text || '';
    console.log('[prescription] Claude raw (first 500):', text.slice(0, 500));
    const result = parseJson(text);
    if (!result) {
      console.error('[prescription] JSON parse failed, raw:', text.slice(0, 300));
      return res.status(200).json({ medications: [], error: 'A IA não conseguiu estruturar a resposta. Tente uma foto mais nítida.' });
    }
    return res.status(200).json(result);
  } catch (e) {
    console.error('prescription error:', e);
    return res.status(500).json({ error: 'Erro interno ao analisar a receita.' });
  }
}

// ─── action=exam ────────────────────────────────────────────────────────────
async function handleExam(req, res, apiKey) {
  const { imageBase64, mimeType, petName, petSpecies } = req.body || {};
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });

  const petInfo = petName ? `O pet se chama ${petName}${petSpecies ? ` e é um(a) ${petSpecies}` : ''}.` : '';

  const prompt = `Você é um assistente veterinário que explica exames de forma simples e acolhedora para tutores de pets. ${petInfo}

Analise este exame veterinário e retorne um JSON com a explicação detalhada.

INSTRUÇÕES:
- Use linguagem simples, acessível, sem jargão técnico excessivo.
- Seja acolhedor e tranquilizador, mas honesto quando há algo a observar.
- Para cada parâmetro fora da referência, explique o que pode significar de forma clara.
- Não substitua o diagnóstico veterinário — sempre oriente consultar o veterinário para interpretação final.
- Se não conseguir ler o exame, retorne um objeto com "error".

Retorne SOMENTE o JSON abaixo, sem nenhum texto antes ou depois, sem markdown:
{"examType":"tipo do exame","summary":"resumo geral em 2-3 frases acolhedoras","overallStatus":"normal","parameters":[{"name":"nome","value":"valor com unidade","reference":"faixa de referência ou null","status":"normal","explanation":"o que mede e o que o valor significa em linguagem simples"}],"highlights":["observação importante"],"recommendation":"orientação final sobre buscar o veterinário ou não","disclaimer":"Este é um resumo educativo. Consulte sempre seu veterinário para interpretação e diagnóstico."}

Para "overallStatus" e "status" de cada parâmetro use somente: "normal", "atenção" ou "alerta".

Se não for um exame legível: {"error":"Não foi possível identificar um exame veterinário. Tente uma foto mais nítida ou outro arquivo."}`;

  try {
    const claudeRes = await callClaude(apiKey, imageBase64, mimeType, prompt, 3000);
    if (!claudeRes.ok) {
      const detail = await claudeRes.text();
      console.error('Claude error (exam):', claudeRes.status, detail);
      const msg = claudeRes.status === 401
        ? 'Chave de API inválida. Contate o suporte.'
        : 'Erro ao contatar a IA. Tente novamente.';
      return res.status(502).json({ error: msg });
    }
    const data = await claudeRes.json();
    const text = data.content?.[0]?.text || '';
    console.log('[exam] Claude raw (first 500):', text.slice(0, 500));
    const result = parseJson(text);
    if (!result) {
      console.error('[exam] JSON parse failed, raw:', text.slice(0, 300));
      return res.status(200).json({ error: 'A IA não conseguiu estruturar a resposta. Tente uma foto mais nítida.' });
    }
    return res.status(200).json(result);
  } catch (e) {
    console.error('exam error:', e);
    return res.status(500).json({ error: 'Erro interno ao analisar o exame.' });
  }
}

// ─── Main handler ────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor.' });

  const action = req.query.action || 'prescription';

  if (action === 'exam') return handleExam(req, res, apiKey);
  return handlePrescription(req, res, apiKey);
}
