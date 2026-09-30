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

/**
 * Call Groq API with fallback model support
 */
async function callGroqAPI({ systemPrompt, prompt, preferredModel = 'llama-3.3-70b-versatile' }) {
  if (!groqApiKey) {
    throw new Error('VITE_GROQ_API_KEY não configurada.');
  }

  const modelsToTry = [
    preferredModel,
    'openai/gpt-oss-120b',
    'qwen/qwen3.8-27b',
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[AI Provider] Tentando Groq com modelo '${model}'...`);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData?.error?.message || `Groq HTTP ${response.status}`);
      }

      const content = resData.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Resposta vazia do Groq');
      }

      const parsed = cleanAndParseJSON(content);
      return {
        data: parsed,
        provider: 'Processado via Groq Fallback',
        modelUsed: model,
        rawText: content,
      };
    } catch (err) {
      console.warn(`[AI Provider] Groq modelo '${model}' falhou:`, err.message);
      lastError = err;
      // Continue to next available Groq model
    }
  }

  throw lastError || new Error('Todos os modelos do Groq falharam.');
}

/**
 * Call Gemini API with timeout
 */
async function callGeminiAPI({ systemPrompt, prompt, modelName = 'gemini-1.5-flash' }) {
  if (!geminiApiKey) {
    throw new Error('VITE_GEMINI_API_KEY não configurada.');
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
    systemInstruction: `${systemPrompt || 'Você é um especialista em marketing.'} Responda estritamente em JSON válido.`,
  });

  // Timeout promise (10 seconds)
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout na requisição do Gemini (10s)')), 10000)
  );

  const requestPromise = model.generateContent(prompt);
  const result = await Promise.race([requestPromise, timeoutPromise]);
  const text = result.response.text();
  const parsed = cleanAndParseJSON(text);

  return {
    data: parsed,
    provider: 'Processado via Gemini',
    modelUsed: modelName,
    rawText: text,
  };
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
