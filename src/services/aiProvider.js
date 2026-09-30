import { GoogleGenerativeAI } from '@google/generative-ai';

// Leitura segura das variáveis de ambiente com fallbacks (|| '') para não quebrar a aplicação
const geminiApiKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
  '';

const groqApiKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_GROQ_API_KEY) ||
  '';

/**
 * Clean and parse JSON from AI response text
 */
function cleanAndParseJSON(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Resposta vazia da IA');
  }

  // Remove markdown code fences if present: ```json ... ``` or ``` ... ```
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Find the first '{' and last '}'
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  return JSON.parse(cleaned);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Call Groq API with official model support:
 * 1. llama-3.3-70b-versatile
 * 2. llama3-70b-8192
 * 3. llama3-8b-8192 (contingência rápida)
 * Includes automatic retry with 3.5s backoff on HTTP 429 (Rate Limit).
 */
async function callGroqAPI({ systemPrompt, prompt, preferredModel = 'llama-3.3-70b-versatile' }) {
  if (!groqApiKey) {
    throw new Error('VITE_GROQ_API_KEY não configurada.');
  }

  // Modelos estritamente suportados e homologados pela Groq:
  const allowedGroqModels = [
    'llama-3.3-70b-versatile',
    'llama3-70b-8192',
    'llama3-8b-8192',
  ];

  // Garante a ordem prioritária sem identificadores inválidos ou obsoletos
  const modelsToTry = [
    preferredModel,
    ...allowedGroqModels,
  ].filter((m) => allowedGroqModels.includes(m));

  const uniqueModels = [...new Set(modelsToTry)];
  if (uniqueModels.length === 0) {
    uniqueModels.push('llama-3.3-70b-versatile', 'llama3-70b-8192', 'llama3-8b-8192');
  }

  let lastError = null;

  for (const model of uniqueModels) {
    try {
      console.log(`[AI Provider] Tentando Groq com modelo '${model}'...`);
      let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `${systemPrompt || 'Você é um especialista em marketing.'} Você DEVE SEMPRE responder APENAS com um objeto JSON válido, sem texto introdutório nem conclusivo.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      // Se receber 429 (Rate Limit), executa um backoff automático de 3.5s antes de decidir
      if (response.status === 429) {
        console.warn(`[AI Provider] Groq 429 (Rate Limit) no modelo '${model}'. Pausando 3.5s para backoff antes da segunda tentativa...`);
        await delay(3500);

        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: `${systemPrompt || 'Você é um especialista em marketing.'} Você DEVE SEMPRE responder APENAS com um objeto JSON válido, sem texto introdutório nem conclusivo.`,
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          }),
        });
      }

      const resData = await response.json().catch(() => null);

      if (!response.ok) {
        const errMsg = resData?.error?.message || `Groq HTTP ${response.status}`;
        console.warn(`[AI Provider] Groq modelo '${model}' falhou (${errMsg}). Tentando imediatamente o próximo modelo da lista...`);
        lastError = new Error(`Groq [${model}]: ${errMsg}`);
        continue; // Tenta IMEDIATAMENTE o próximo modelo!
      }

      const content = resData?.choices?.[0]?.message?.content;
      if (!content) {
        console.warn(`[AI Provider] Groq modelo '${model}' retornou resposta vazia. Tentando o próximo modelo...`);
        lastError = new Error(`Groq [${model}]: Resposta vazia`);
        continue; // Tenta IMEDIATAMENTE o próximo modelo!
      }

      const parsed = cleanAndParseJSON(content);
      return {
        data: parsed,
        provider: 'Processado via Groq Fallback',
        modelUsed: model,
        rawText: content,
      };
    } catch (err) {
      console.warn(`[AI Provider] Erro no modelo Groq '${model}':`, err.message, '- tentando imediatamente o próximo modelo da lista...');
      lastError = err;
      // Continua para o próximo modelo sem travar
    }
  }

  throw lastError || new Error('Todos os modelos homologados da Groq falharam.');
}

/**
 * Call Gemini API with timeout, official SDK and resilient direct REST fallback
 * Compatible with Google AI Studio 'AQ.' keys:
 * - Uses x-goog-api-key header and/or ?key= query parameter
 * - NEVER uses 'Authorization: Bearer' which Google rejects with ACCESS_TOKEN_TYPE_UNSUPPORTED
 * - Instantiates official SDK: new GoogleGenerativeAI(geminiApiKey)
 */
async function callGeminiAPI({ systemPrompt, prompt, modelName = 'gemini-1.5-flash' }) {
  if (!geminiApiKey) {
    throw new Error('VITE_GEMINI_API_KEY não configurada.');
  }

  const cleanKey = geminiApiKey.trim();

  // 1. Tenta via SDK oficial @google/generative-ai
  try {
    const genAI = new GoogleGenerativeAI(cleanKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
      systemInstruction: `${systemPrompt || 'Você é um especialista em marketing.'} Responda estritamente em JSON válido.`,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout na requisição do Gemini SDK (12s)')), 12000)
    );

    const requestPromise = model.generateContent(prompt);
    const result = await Promise.race([requestPromise, timeoutPromise]);
    const text = result.response.text();
    const parsed = cleanAndParseJSON(text);

    return {
      data: parsed,
      provider: 'Processado via Google Gemini (SDK)',
      modelUsed: modelName,
      rawText: text,
    };
  } catch (sdkError) {
    console.warn(
      `[AI Provider] SDK Gemini encontrou um aviso (${sdkError.message}). Executando requisição direta REST com header x-goog-api-key e ?key=...`
    );

    // 2. Fallback REST direto com x-goog-api-key e ?key= (sem Authorization Bearer)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(cleanKey)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: `${systemPrompt || 'Você é um especialista em marketing.'} Responda estritamente em JSON válido.`,
            },
          ],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData?.error?.message || `Google Gemini HTTP ${response.status}`);
    }

    const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Resposta vazia da API REST do Google Gemini');
    }

    const parsed = cleanAndParseJSON(text);
    return {
      data: parsed,
      provider: 'Processado via Google Gemini (REST)',
      modelUsed: modelName,
      rawText: text,
    };
  }
}

/**
 * Unified AI Generation with Automatic Redundancy & Fallback
 * Primary: Google Gemini (gemini-1.5-flash)
 * Secondary: Groq (llama-3.3-70b-versatile -> openai/gpt-oss-120b)
 */
export async function generateMarketingAI({ systemPrompt, prompt }) {
  // 1. Tenta o motor primário (Google Gemini)
  try {
    console.log('[AI Provider] Executando motor primário: Google Gemini (gemini-1.5-flash)...');
    return await callGeminiAPI({ systemPrompt, prompt, modelName: 'gemini-1.5-flash' });
  } catch (geminiError) {
    console.warn(
      `[AI Provider] Motor primário Gemini indisponível ou com erro (${geminiError.message}). Acionando Fallback Groq imediato...`
    );

    // 2. Fallback automático para a Groq
    try {
      return await callGroqAPI({
        systemPrompt,
        prompt,
        preferredModel: 'llama-3.3-70b-versatile',
      });
    } catch (groqError) {
      console.error('[AI Provider] Ambos os motores falharam:', {
        geminiError: geminiError.message,
        groqError: groqError.message,
      });
      throw new Error(`Falha nos provedores de IA. Gemini: ${geminiError.message} | Groq: ${groqError.message}`);
    }
  }
}
