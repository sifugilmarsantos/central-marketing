import { generateMarketingAI } from './aiProvider.js';
import { supabase } from '../lib/supabase.js';

/**
 * Diretriz Rígida de Vocabulário e Estilo Cultural (Kung Fu Tradicional Chinês)
 */
export const CULTURAL_VOCABULARY_GUIDELINE = `
DIRETRIZ RÍGIDA DE VOCABULÁRIO E ESTILO CULTURAL (KUNG FU TRADICIONAL CHINÊS):
1. É ESTRITAMENTE PROIBIDO o uso de termos japoneses (como "Dojo", "Kata", "Katas", "Sensei", "Kimono", "Tatame").
2. Utilize EXCLUSIVAMENTE a terminologia tradicional do Kung Fu chinês:
   - "Kwoon" para o espaço/sala/academia de treino (NUNCA use "Dojo").
   - "Katis" (ou "Kati") para as formas/sequências de movimentos e técnicas (NUNCA use "Kata" ou "Katas").
   - "Sifu" para o mestre/professor/orientador (NUNCA use "Sensei").
3. Mantenha todas as respostas rigorosamente no padrão culto de Português do Brasil (PT-BR).
`.trim();

/**
 * Função utilitária de sanitização e garantia de conformidade terminológica
 */
export function sanitizeKungFuTerms(text) {
  if (!text) return text;
  if (typeof text !== 'string') return text;
  return text
    .replace(/\bdojos\b/gi, (match) => (match[0] === 'D' ? 'Kwoons' : 'kwoons'))
    .replace(/\bdojo\b/gi, (match) => (match[0] === 'D' ? 'Kwoon' : 'kwoon'))
    .replace(/\bkatas\b/gi, (match) => (match[0] === 'K' ? 'Katis' : 'katis'))
    .replace(/\bkata\b/gi, (match) => (match[0] === 'K' ? 'Kati' : 'kati'))
    .replace(/\bsenseis\b/gi, (match) => (match[0] === 'S' ? 'Sifus' : 'sifus'))
    .replace(/\bsensei\b/gi, (match) => (match[0] === 'S' ? 'Sifu' : 'sifu'))
    .replace(/\btatames\b/gi, (match) => (match[0] === 'T' ? 'Kwoons' : 'kwoons'))
    .replace(/\btatame\b/gi, (match) => (match[0] === 'T' ? 'Kwoon' : 'kwoon'));
}

/**
 * Helper to build brand context string for prompts
 */
function getBrandContext(brandProfile) {
  const brandDetails = !brandProfile
    ? 'Marca Geral / Escola de Artes Marciais Tradicionais'
    : `
- Nome da Marca: ${brandProfile.brand_name || 'N/A'}
- Cidade/Localização: ${brandProfile.city || 'N/A'}
- Público-Alvo Institucional: ${brandProfile.target_audience || 'N/A'}
- Tom de Voz Institucional: ${brandProfile.tone_of_voice || 'N/A'}
- Cores Institucionais: Primária ${brandProfile.primary_color || '#111827'}, Acento ${brandProfile.accent_color || '#EAB308'}
`.trim();

  return `${brandDetails}\n\n${CULTURAL_VOCABULARY_GUIDELINE}`;
}

/**
 * ETAPA 1: Estrategista de Conteúdo
 */
export async function executeStep1({ theme, brandProfile }) {
  const brandContext = getBrandContext(brandProfile);

  const systemPrompt = `Você é a Dra. Helena Vasconcelos, Estrategista de Conteúdo Sênior e Head de Posicionamento.
Sua missão é estruturar a base estratégica de uma campanha de marketing de alto impacto.
Você deve retornar estritamente um JSON com as chaves: "objetivo", "formato", "gancho".

${CULTURAL_VOCABULARY_GUIDELINE}`;

  const prompt = `Defina a estratégia para a seguinte campanha:
TEMA DA CAMPANHA: "${theme}"

DIRETRIZES DA MARCA E CULTURAIS:
${brandContext}

ATENÇÃO RIGOROSA:
- Use exclusivamente terminologia chinesa de Kung Fu ("Kwoon" para sala/espaço de treino, "Katis" para formas/técnicas, "Sifu" para o mestre).
- É TERMINANTEMENTE PROIBIDO usar "Dojo", "Kata" ou "Sensei".
- Redija estritamente no padrão culto do Português do Brasil.

Responda em formato JSON com:
{
  "objetivo": "Objetivo claro, específico e mensurável da campanha",
  "formato": "Formato recomendado detalhado (ex: Carrossel de 5 lâminas 4:5 + Reels vertical de 45s)",
  "gancho": "Gancho (hook) irresistível de abertura para reter a atenção nos primeiros 3 segundos"
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawObjetivo = sanitizeKungFuTerms(data.objetivo) || 'Posicionar a marca e acelerar a captação de alunos.';
  const rawFormato = sanitizeKungFuTerms(data.formato) || 'Carrossel Educativo (1080x1350) + Vídeo Curto.';
  const rawGancho = sanitizeKungFuTerms(data.gancho) || theme;

  const card = {
    id: 'card-1',
    stepNumber: 1,
    role: 'Estrategista de Conteúdo',
    specialistName: 'Dra. Helena Vasconcelos',
    specialistTitle: 'Head de Estratégia & Posicionamento',
    specialistAvatar: 'HV',
    badgeColor: 'from-blue-500 to-indigo-600',
    accentBorder: 'border-blue-500/40 hover:border-blue-400',
    iconName: 'Compass',
    aiProvider: provider,
    sections: [
      {
        label: 'Objetivo Principal',
        content: rawObjetivo,
        type: 'text',
      },
      {
        label: 'Formato Recomendado',
        content: rawFormato,
        type: 'highlight',
      },
      {
        label: 'Gancho Principal (Hook)',
        content: `“${rawGancho}”`,
        type: 'quote',
      },
    ],
    copyPayload: `[ESTRATÉGIA DE CONTEÚDO]
Especialista: Dra. Helena Vasconcelos (${provider})
Objetivo: ${rawObjetivo}
Formato: ${rawFormato}
Gancho (Hook): "${rawGancho}"`,
  };

  return { card, rawData: { ...data, objetivo: rawObjetivo, formato: rawFormato, gancho: rawGancho }, provider };
}

/**
 * ETAPA 2: Copywriter
 */
export async function executeStep2({ theme, brandProfile, step1Data }) {
  const brandContext = getBrandContext(brandProfile);

  const copyNarratives = [
    'Enfoque em transformação pessoal, autoconfiança sólida e superação da timidez.',
    'Enfoque em desenvolvimento infantil, foco nos estudos e disciplina sem rigidez punitiva.',
    'Enfoque em descompressão, saúde mental, condicionamento físico e alívio do estresse.',
    'Enfoque em autodefesa inteligente, autocontrole emocional e postura preventiva.',
    'Enfoque na tradição autêntica do Kung Fu, linhagem marcial e mentoria direta do Sifu no Kwoon.',
  ];
  const chosenNarrative = copyNarratives[Math.floor(Math.random() * copyNarratives.length)];

  const systemPrompt = `Você é Lucas Menezes, Copywriter Especialista em Resposta Direta e Narrativas Persuasivas.
Você recebe a estratégia de conteúdo e cria textos altamente envolventes, autênticos e orientados à conversão.
Retorne estritamente um JSON com as chaves: "textos_arte" (array de 4 a 5 strings), "legenda" (string completa), "cta" (string).

${CULTURAL_VOCABULARY_GUIDELINE}`;

  const prompt = `Com base na estratégia definida:
Objetivo: ${step1Data.objetivo}
Formato: ${step1Data.formato}
Gancho: ${step1Data.gancho}

TEMA: "${theme}"
DIRETRIZ NARRATIVA PRIORITÁRIA PARA ESTA VARIAÇÃO: ${chosenNarrative}
MARCA E DIRETRIZES:
${brandContext}

ATENÇÃO RIGOROSA DE VOCABULÁRIO:
- Use exclusivamente a terminologia do Kung Fu tradicional chinês: "Kwoon" (espaço/sala de treino), "Katis" (formas/sequências) e "Sifu" (mestre/professor).
- É ESTRITAMENTE PROIBIDO usar termos japoneses como "Dojo", "Kata", "Katas" ou "Sensei".
- Redija todo o conteúdo rigorosamente no padrão culto de Português do Brasil com quebras de parágrafo e alta retenção.

Gere o copy completo em JSON com:
{
  "textos_arte": [
    "Lâmina 1 (Capa): ...",
    "Lâmina 2: ...",
    "Lâmina 3: ...",
    "Lâmina 4: ...",
    "Lâmina 5: ..."
  ],
  "legenda": "Legenda completa para redes sociais, persuasiva, com quebras de parágrafo e tom acolhedor/disciplinado",
  "cta": "Chamada para ação direta (ex: Toque no link da bio e garanta sua aula experimental gratuita)"
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawTextosArte = (Array.isArray(data.textos_arte) ? data.textos_arte : [data.textos_arte || theme]).map(
    (t) => sanitizeKungFuTerms(t)
  );
  const rawLegenda = sanitizeKungFuTerms(data.legenda) || 'Legenda gerada pela IA.';
  const rawCta = sanitizeKungFuTerms(data.cta) || '👉 Clique no botão abaixo e fale com nossa equipe.';

  const card = {
    id: 'card-2',
    stepNumber: 2,
    role: 'Copywriter',
    specialistName: 'Lucas Menezes',
    specialistTitle: 'Senior Direct-Response Copywriter',
    specialistAvatar: 'LM',
    badgeColor: 'from-purple-500 to-violet-600',
    accentBorder: 'border-purple-500/40 hover:border-purple-400',
    iconName: 'PenTool',
    aiProvider: provider,
    sections: [
      {
        label: 'Textos da Arte (Estrutura dos Criativos)',
        content: rawTextosArte,
        type: 'list',
      },
      {
        label: 'Legenda Completa para Redes Sociais',
        content: rawLegenda,
        type: 'text',
      },
      {
        label: 'Chamada para Ação (CTA)',
        content: rawCta,
        type: 'cta',
      },
    ],
    copyPayload: `[COPYWRITING]
Especialista: Lucas Menezes (${provider})
Textos da Arte:
${rawTextosArte.map((t) => `- ${t}`).join('\n')}

Legenda:
${rawLegenda}

CTA: ${rawCta}`,
  };

  return {
    card,
    rawData: { ...data, textos_arte: rawTextosArte, legenda: rawLegenda, cta: rawCta },
    provider,
  };
}

/**
 * ETAPA 3: Revisor Textual
 */
export async function executeStep3({ theme, brandProfile, step2Data }) {
  const brandContext = getBrandContext(brandProfile);

  const systemPrompt = `Você é a Profª. Beatriz Alencar, Consultora Linguística e Revisora Textual em Português do Brasil (PT-BR).
Sua missão é garantir perfeição gramatical, cadência rítmica mobile, clareza e eliminar gerundismos e redundâncias.
Você DEVE auditar e substituir compulsoriamente qualquer menção acidental a termos japoneses (como "Dojo", "Kata", "Katas", "Sensei", "Kimono", "Tatame") pela terminologia tradicional correta do Kung Fu chinês ("Kwoon", "Kati/Katis", "Sifu").
Retorne estritamente um JSON com as chaves: "parecer_tecnico", "texto_revisado", "melhorias" (array de 3 strings).

${CULTURAL_VOCABULARY_GUIDELINE}`;

  const prompt = `Revise o seguinte copy de marketing:
Textos da Arte: ${JSON.stringify(step2Data.textos_arte)}
Legenda: "${step2Data.legenda}"
CTA: "${step2Data.cta}"

DIRETRIZES DA MARCA:
${brandContext}

REGRA COMPULSÓRIA DE AUDITORIA CULTURAL E TERMINOLÓGICA:
1. Audite rigorosamente todo o texto e SUBSTITUA COMPULSORIAMENTE qualquer menção acidental a termos japoneses:
   - Substitua "Dojo" por "Kwoon"
   - Substitua "Kata" ou "Katas" por "Kati" ou "Katis"
   - Substitua "Sensei" por "Sifu"
   - Substitua "Tatame" por "Kwoon" ou "sala de treino"
2. É ESTRITAMENTE PROIBIDO manter qualquer termo japonês no texto revisado.
3. No "parecer_tecnico" e nas "melhorias", aponte formalmente a validação e adequação à terminologia tradicional do Kung Fu chinês.
4. Mantenha todo o texto formatado rigorosamente no padrão de Português do Brasil.

Retorne um JSON com:
{
  "parecer_tecnico": "Parecer conciso da revisão conforme o Novo Acordo Ortográfico, padrão PT-BR e validação da terminologia de Kung Fu (Kwoon, Katis, Sifu)",
  "texto_revisado": "Versão definitiva aprimorada, polida e fluida do texto/legenda para leitura em smartphones, sem nenhum termo japonês",
  "melhorias": [
    "Melhoria 1...",
    "Melhoria 2...",
    "Melhoria 3..."
  ]
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawParecer = sanitizeKungFuTerms(data.parecer_tecnico) || 'Texto revisado e auditado conforme o padrão culto brasileiro e terminologia de Kung Fu.';
  const rawTextoRevisado = sanitizeKungFuTerms(data.texto_revisado) || sanitizeKungFuTerms(step2Data.legenda);
  const rawMelhorias = (Array.isArray(data.melhorias) ? data.melhorias : [
    'Substituição e auditoria para terminologia tradicional de Kung Fu (Kwoon, Katis, Sifu)',
    'Harmonização de concordância verbal e cadência rítmica mobile',
    'Eliminação de ambiguidades e reforço do tom de voz acolhedor e disciplinado'
  ]).map((m) => sanitizeKungFuTerms(m));

  const card = {
    id: 'card-3',
    stepNumber: 3,
    role: 'Revisor Textual',
    specialistName: 'Profª. Beatriz Alencar',
    specialistTitle: 'Consultora Linguística & Revisora PT-BR',
    specialistAvatar: 'BA',
    badgeColor: 'from-emerald-500 to-teal-600',
    accentBorder: 'border-emerald-500/40 hover:border-emerald-400',
    iconName: 'SpellCheck',
    aiProvider: provider,
    sections: [
      {
        label: 'Parecer Linguístico & Padronização',
        content: rawParecer,
        type: 'badge-text',
      },
      {
        label: 'Texto Final Corrigido e Revisado (PT-BR)',
        content: rawTextoRevisado,
        type: 'corrected-text',
      },
      {
        label: 'Destaques das Melhorias Aplicadas',
        content: rawMelhorias,
        type: 'list-checks',
      },
    ],
    copyPayload: `[REVISÃO TEXTUAL PT-BR]
Especialista: Profª. Beatriz Alencar (${provider})
Parecer: ${rawParecer}

Texto Final Revisado:
"${rawTextoRevisado}"

Melhorias:
${rawMelhorias.map((m) => `✓ ${m}`).join('\n')}`,
  };

  return {
    card,
    rawData: { ...data, parecer_tecnico: rawParecer, texto_revisado: rawTextoRevisado, melhorias: rawMelhorias },
    provider,
  };
}

/**
 * ARSENAL DE ESTILOS VISUAIS PARA O DIRETOR DE ARTE (CARD 04)
 * Sorteio aleatório entre 6 direções estritamente distintas para garantir não-repetição
 */
export const ART_DIRECTOR_STYLES = [
  {
    id: 'editorial_esportivo_movimento',
    name: 'Fotografia Editorial Esportiva em Movimento Rápido',
    camera: 'Sony A1 com lente Sony FE 24-70mm f/2.8 GM II (shutter speed 1/1200s, tracking contínuo)',
    angle: 'Ângulo dinâmico e baixo (low-angle Dutch tilt) capturando a impulsão e velocidade',
    lighting: 'Luz natural lateral intensa cortada por janelas amplas do Kwoon contemporâneo, partículas de magnésio iluminadas em rim light dourada',
    paletteName: 'Energia & Alta Performance',
    description: 'Ação dinâmica em Kwoon contemporâneo com piso emborrachado preto fosco, praticante em salto ou chute giratório perfeitamente alinhado, foco congelado em altíssima definição no estilo Nike/Red Bull Sports Photography.',
    midjourneyGuidance: 'High-speed action sports editorial photography, dynamic low angle Dutch tilt, crisp motion freeze at 1/1200s, Sony A1 24-70mm f/2.8 GM II, volumetric daylight streaming through modern martial arts Kwoon windows, authentic Kung Fu uniform, athletic intensity, golden rim light'
  },
  {
    id: 'retrato_cinematografico_closeup',
    name: 'Retrato Cinematográfico Close-Up Emocional',
    camera: 'Hasselblad H6D-100c com lente HC 100mm f/2.2 (foco cravado na íris)',
    angle: 'Eye-level close-up dramático e intimista, enquadramento fechado destacando a expressão facial',
    lighting: 'Chiaroscuro suave com softbox octagonal de 120cm a 45 graus, contraluz sutil delineando os ombros e fios de cabelo',
    paletteName: 'Resiliência & Determinação Emocional',
    description: 'Foco cirúrgico na determinação dos olhos do praticante/criança, microgotas de suor realistas refletindo luz tênue, faixa amarrada na cintura ou mãos enfaixadas, expressando superação e confiança inabalável.',
    midjourneyGuidance: 'Intimate cinematic emotional close-up portrait, Hasselblad H6D-100c HC 100mm f/2.2, dramatic chiaroscuro studio softbox lighting, shallow depth of field, sharp focus on intense determined eyes, subtle perspiration on brow, authentic traditional Chinese Kung Fu discipline, hyper-detailed skin texture'
  },
  {
    id: 'documental_postural_sifu',
    name: 'Documental Autêntico / Correção Postural Guiada pelo Sifu',
    camera: 'Canon EOS R5 C com lente RF 50mm f/1.2L USM (perspectiva humana e orgânica)',
    angle: 'Plano médio em três quartos (three-quarter medium shot), capturando a conexão mestre-discípulo',
    lighting: 'Luz ambiente acolhedora e difusa de final de tarde (golden hour), sombras suaves e atmosfera de respeito e acolhimento',
    paletteName: 'Tradição, Sabedoria & Linhagem',
    description: 'Cena documental autêntica de ensino tradicional: o Sifu experiente e paciente ajustando a postura de punho ou base (Ma Bu) de uma criança no Kwoon, transmitindo segurança, disciplina e carinho pedagógico.',
    midjourneyGuidance: 'Documentary storytelling photography, authentic Chinese Kung Fu Kwoon, experienced revered Sifu gently guiding and correcting a young student horse stance Ma Bu posture, Canon EOS R5 RF 50mm f/1.2L, warm golden hour ambient lighting, respectful master-disciple connection, natural candid expressions'
  },
  {
    id: 'treino_equipamentos_intensidade',
    name: 'Treino Prático de Alta Intensidade com Equipamentos',
    camera: 'Nikon Z9 com lente Nikkor Z 85mm f/1.2 S (nitidez extrema nos pontos de impacto)',
    angle: 'Ângulo médio lateral dinâmico, revelando a biomecânica do golpe contra o alvo',
    lighting: 'Iluminação esportiva de alta precisão com dois refletores LED em contra-eixo e luz de recorte branca 5600K',
    paletteName: 'Foco, Impacto & Agilidade Motora',
    description: 'Praticante em treino explosivo com manoplas de foco, saco de areia pesado ou bastão infantil (Gun), demonstrando coordenação motora refinada, reflexos rápidos e vigor físico contagiante no centro de treinamento.',
    midjourneyGuidance: 'High-intensity martial arts training session, striking focus mitts and sandbags in a modern Chinese Kung Fu gym, dynamic impact frame, Nikon Z9 85mm f/1.2 S, crisp sports studio lighting with white rim lights, kinetic energy, authentic technique and agile footwork'
  },
  {
    id: 'poster_minimalista_espaco_negativo',
    name: 'Pôster Publicitário Minimalista com Amplo Espaço Negativo',
    camera: 'Fujifilm GFX 100 II com lente GF 110mm f/2 R LM WR (formato médio ultra-nítido)',
    angle: 'Composição assimétrica em regra dos terços com 60% de espaço negativo clean para inserção de títulos e logos',
    lighting: 'Luz zenital dramática (overhead spotlight / rim light) sobre fundo gradiente escuro e minimalista',
    paletteName: 'Minimalismo Editorial de Luxo',
    description: 'Silhueta elegante e perfeitamente escupida de uma base marcial clássica (ex: Gong Bu ou Xie Bu), posicionada no terço inferior direito, com espaço generoso e limpo para diagramação e tipografia institucional.',
    midjourneyGuidance: 'Minimalist luxury commercial sports advertising poster, solitary martial artist performing sharp Kung Fu stance silhouette, generous clean dark negative space for typography, Fujifilm GFX 100 II 110mm f/2, dramatic single overhead spotlight, sophisticated dark gradient background, ultra-clean composition'
  },
  {
    id: 'tradicao_solene_saudacao',
    name: 'Tradição Marcial Solene / Saudação Bingbu Li & Baishi',
    camera: 'Leica SL2 com lente Summilux-SL 50mm f/1.4 ASPH (textura orgânica e tons cinematográficos)',
    angle: 'Plano frontal solene e simétrico, transmitindo solenidade, código moral e linhagem marcial',
    lighting: 'Luz suave de lanternas e painéis reflexivos, tons quentes de âmbar e bronze realçando os detalhes do uniforme',
    paletteName: 'Honra, Código Marcial & Reverência',
    description: 'O ritual solene da saudação tradicional de Kung Fu (Bingbu Li: punho direito cerrado contra a palma esquerda espalmada em sinal de respeito mútuo), olhar sereno e focado, honrando o código Wude e os valores do Kwoon.',
    midjourneyGuidance: 'Solemn traditional Chinese martial arts salute Bingbu Li, closed right fist meeting open left palm in reverence, Leica SL2 Summilux 50mm f/1.4, warm amber lanterns and directional bronze rim light, dignified gaze, honoring the ancient Wude martial code in a refined authentic Kwoon'
  }
];

/**
 * ETAPA 4: Diretor de Arte
 */
export async function executeStep4({ theme, brandProfile, step1Data }) {
  const brandContext = getBrandContext(brandProfile);
  const primaryColor = brandProfile?.primary_color || '#111827';
  const accentColor = brandProfile?.accent_color || '#EAB308';

  // Sorteio dinâmico estrito de um dos 6 estilos visuais para variação radical
  const selectedStyle = ART_DIRECTOR_STYLES[Math.floor(Math.random() * ART_DIRECTOR_STYLES.length)];

  const systemPrompt = `Você é Rodrigo Fontes, Diretor de Arte Sênior e Especialista em Criação Visual com IA (Midjourney v6.1 / Flux Pro) para Campanhas Publicitárias de Alta Performance.
Sua missão é desenvolver a identidade visual, hierarquia de layout, paleta de cores precisa e um PROMPT CINEMATOGRÁFICO EM INGLÊS dinâmico, hiper-realista e estritamente personalizado para a campanha.

DIRETRIZES FUNDAMENTAIS DO DIRETOR DE ARTE:
1. DINAMISMO OBRIGATÓRIO E PROIBIÇÃO ESTRITA DE REPETIÇÃO:
   - Você NUNCA deve sugerir o mesmo cenário ou o estilo clichê e genérico de "crianças em templo antigo", monges em montanhas ou orientalismo caricato dos anos 70/80.
   - O prompt gerado para a IA de Imagem DEVE SEGUIR ESTREITAMENTE O ESTILO VISUAL SORTEADO PARA ESTA EXECUÇÃO:
     * ESTILO VISUAL SORTEADO: "${selectedStyle.name}"
     * CÂMERA & LENTE OBRIGATÓRIA: ${selectedStyle.camera}
     * ENQUADRAMENTO & ÂNGULO: ${selectedStyle.angle}
     * ILUMINAÇÃO RECOMENDADA: ${selectedStyle.lighting}
     * CONCEITO DE CENA: ${selectedStyle.description}
     * DIRETRIZ MIDJOURNEY: ${selectedStyle.midjourneyGuidance}

2. ESPECIFICAÇÕES TÉCNICAS OBRIGATÓRIAS NO PROMPT MIDJOURNEY / FLUX:
   - Especifique a câmera, lente e ângulo indicados acima.
   - Cenário: Kwoon contemporâneo profissional ou centro de treinamento autêntico de Kung Fu chinês.
   - Parâmetros técnicos obrigatórios no final do prompt: "--ar 4:5 --v 6.1 --style raw".

3. CONFORMIDADE CULTURAL KUNG FU:
   - Use rigorosamente "Kwoon" (ou traditional Chinese martial arts training hall) para o espaço de treino, "Sifu" para o mestre e "Katis" para as formas.
   - É TERMINANTEMENTE PROIBIDO usar termos japoneses como "Dojo", "Kata" ou "Sensei" em qualquer parte da resposta.

Retorne estritamente um JSON com as chaves: "paleta" (array de 4 objetos com name e hex), "layout_diretrizes", "prompt_midjourney".

${CULTURAL_VOCABULARY_GUIDELINE}`;

  const prompt = `Defina a direção de arte e o prompt visual cinematográfico exclusivo para a campanha:
TEMA DA CAMPANHA: "${theme}"
OBJETIVO ESTRATÉGICO: ${step1Data.objetivo}
FORMATO SUGERIDO: ${step1Data.formato}
GANCHO (HOOK): "${step1Data.gancho}"
CORES INSTITUCIONAIS: Primária ${primaryColor}, Acento ${accentColor}
${brandContext}

ESTILO VISUAL OBRIGATÓRIO PARA ESTA VARIAÇÃO:
Nome: ${selectedStyle.name}
Câmera/Lente: ${selectedStyle.camera}
Ângulo: ${selectedStyle.angle}
Iluminação: ${selectedStyle.lighting}
Inspiração Midjourney: ${selectedStyle.midjourneyGuidance}

INSTRUÇÕES RIGOROSAS:
1. Adapte a atmosfera visual EXCLUSIVAMENTE ao tema "${theme}" e ao estilo sorteado "${selectedStyle.name}". NUNCA repita templos antigos ou orientalismo caricato.
2. No "prompt_midjourney" (redigido em inglês cinematográfico e detalhado):
   - Incorpore: ${selectedStyle.midjourneyGuidance}
   - Especifique: ${selectedStyle.camera}, ${selectedStyle.lighting}
   - Detalhe a ação, postura corporal precisa e expressão autêntica no Kwoon.
   - Finalize com: 8k resolution, photorealistic commercial sports photography, natural skin texture --ar 4:5 --v 6.1 --style raw
3. Em "layout_diretrizes" (em Português do Brasil): descreva a hierarquia visual, tipografia sugerida, paleta e uso estratégico do espaço negativo.

Retorne um JSON com:
{
  "paleta": [
    { "name": "${selectedStyle.paletteName} (Base)", "hex": "${primaryColor}" },
    { "name": "${selectedStyle.paletteName} (Destaque)", "hex": "${accentColor}" },
    { "name": "Acento Dinâmico", "hex": "#06B6D4" },
    { "name": "Contraste Puro", "hex": "#FFFFFF" }
  ],
  "layout_diretrizes": "Hierarquia visual detalhada, tipografia recomendada, composição de cena e distribuição do espaço negativo em Português do Brasil.",
  "prompt_midjourney": "Cinematic photo prompt in English incorporating ${selectedStyle.name}, camera, lens, lighting, authentic action and parameters --ar 4:5 --v 6.1 --style raw"
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const paletaFormatted = (Array.isArray(data.paleta) ? data.paleta : [
    { name: `${selectedStyle.paletteName} (Base)`, hex: primaryColor },
    { name: `${selectedStyle.paletteName} (Destaque)`, hex: accentColor },
    { name: 'Ciano Acento', hex: '#06B6D4' },
    { name: 'Branco Texto', hex: '#FFFFFF' },
  ]).map((c) => ({
    name: sanitizeKungFuTerms(c.name),
    hex: c.hex,
    class: `bg-[${c.hex}] text-white`,
  }));

  const rawLayout = sanitizeKungFuTerms(data.layout_diretrizes) || 'Design contemporâneo de alto contraste com tipografia marcante e espaço negativo equilibrado.';
  const rawPrompt =
    sanitizeKungFuTerms(data.prompt_midjourney) ||
    `${selectedStyle.midjourneyGuidance}, authentic martial artists in modern Kwoon, ${selectedStyle.camera}, ${selectedStyle.lighting}, photorealistic 8k --ar 4:5 --v 6.1 --style raw`;

  const card = {
    id: 'card-4',
    stepNumber: 4,
    role: 'Diretor de Arte',
    specialistName: 'Rodrigo Fontes',
    specialistTitle: 'Lead Art Director & Visual AI Specialist',
    specialistAvatar: 'RF',
    badgeColor: 'from-amber-500 to-orange-600',
    accentBorder: 'border-amber-500/40 hover:border-amber-400',
    iconName: 'Palette',
    aiProvider: provider,
    sections: [
      {
        label: 'Direção Visual Sorteada (Variabilidade Ativa)',
        content: `🎨 ${selectedStyle.name} • Setup: ${selectedStyle.camera}`,
        type: 'highlight',
      },
      {
        label: 'Guia Cromático (Paleta de Cores)',
        content: paletaFormatted,
        type: 'color-palette',
      },
      {
        label: 'Layout & Hierarquia Visual',
        content: rawLayout,
        type: 'text',
      },
      {
        label: 'Prompt em Inglês para IA de Imagem (Midjourney / Flux)',
        content: rawPrompt,
        type: 'code',
      },
    ],
    copyPayload: `[DIREÇÃO DE ARTE]
Especialista: Rodrigo Fontes (${provider})
Estilo Visual: ${selectedStyle.name}
Setup Técnico: ${selectedStyle.camera} | ${selectedStyle.angle}

Cores:
${paletaFormatted.map((p) => `- ${p.name}: ${p.hex}`).join('\n')}

Diretrizes de Layout:
${rawLayout}

Prompt para IA de Imagem:
${rawPrompt}`,
  };

  return {
    card,
    rawData: { ...data, selectedStyle, paleta: paletaFormatted, layout_diretrizes: rawLayout, prompt_midjourney: rawPrompt },
    provider,
  };
}

/**
 * ETAPA 5: Controle de Qualidade (QA)
 */
export async function executeStep5({ theme, brandProfile }) {
  const brandContext = getBrandContext(brandProfile);

  const systemPrompt = `Você é Camila Siqueira, Lead de QA e Validação Técnica de Mídia Digital.
Sua missão é checar especificações técnicas (proporção 4:5 e 9:16, safe-zones, contraste), auditar conformidade cultural com a tradição do Kung Fu e sugerir os 3 melhores horários de publicação.
Retorne estritamente um JSON com as chaves: "checklist" (array de 4 itens com label e detail) e "horarios_sugeridos" (array de 3 itens com day, time, reason).

${CULTURAL_VOCABULARY_GUIDELINE}`;

  const prompt = `Analise os requisitos técnicos para a campanha:
TEMA: "${theme}"
MARCA E PÚBLICO:
${brandContext}

DIRETRIZ DE QA CULTURAL E TÉCNICO:
- Valide conformidade absoluta com o padrão culto PT-BR.
- Audite para garantir ausência total de termos japoneses ("Dojo", "Kata", "Sensei") e presença da terminologia correta de Kung Fu ("Kwoon", "Katis", "Sifu").
- No checklist, inclua a conformidade cultural e terminológica.

Retorne um JSON com:
{
  "checklist": [
    { "label": "Feed Vertical (Instagram/LinkedIn)", "detail": "1080 x 1350 px (4:5) Aprovado", "status": "pass" },
    { "label": "Stories & Reels Vertical", "detail": "1080 x 1920 px (9:16) Safe-zone 250px", "status": "pass" },
    { "label": "Acessibilidade & Contraste WCAG", "detail": "Ratio > 7.5:1 Aprovado AAA", "status": "pass" },
    { "label": "Auditoria Terminológica Kung Fu", "detail": "100% de termos chineses (Kwoon, Sifu, Katis) aprovados", "status": "pass" }
  ],
  "horarios_sugeridos": [
    { "day": "Terça-feira", "time": "11:45", "reason": "Pico de busca pré-almoço e engajamento" },
    { "day": "Quinta-feira", "time": "18:30", "reason": "Consumo mobile no fim do expediente" },
    { "day": "Domingo", "time": "20:00", "reason": "Planejamento da semana em família" }
  ]
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawChecklist = (Array.isArray(data.checklist) ? data.checklist : [
    { label: 'Feed Vertical (Instagram/LinkedIn)', detail: '1080 x 1350 px (4:5)', status: 'pass' },
    { label: 'Stories & Reels', detail: '1080 x 1920 px (9:16) safe-zone 250px', status: 'pass' },
    { label: 'Contraste WCAG AAA', detail: 'Ratio 8.0:1 aprovado', status: 'pass' },
    { label: 'Auditoria Cultural Kung Fu', detail: 'Terminologia Kwoon/Sifu/Katis validada', status: 'pass' },
  ]).map((item) => ({
    label: sanitizeKungFuTerms(item.label),
    detail: sanitizeKungFuTerms(item.detail),
    status: item.status || 'pass',
  }));

  const rawHorarios = (Array.isArray(data.horarios_sugeridos) ? data.horarios_sugeridos : [
    { day: 'Terça-feira', time: '11:45', reason: 'Engajamento pré-almoço' },
    { day: 'Quinta-feira', time: '18:30', reason: 'Consumo mobile pós-expediente' },
    { day: 'Domingo', time: '20:00', reason: 'Planejamento semanal' },
  ]).map((h) => ({
    day: sanitizeKungFuTerms(h.day),
    time: h.time,
    reason: sanitizeKungFuTerms(h.reason),
  }));

  const card = {
    id: 'card-5',
    stepNumber: 5,
    role: 'Controle de Qualidade',
    specialistName: 'Camila Siqueira',
    specialistTitle: 'QA & Compliance Lead',
    specialistAvatar: 'CS',
    badgeColor: 'from-rose-500 to-pink-600',
    accentBorder: 'border-rose-500/40 hover:border-rose-400',
    iconName: 'ShieldCheck',
    aiProvider: provider,
    sections: [
      {
        label: 'Checklist de Proporção & Boas Práticas',
        content: rawChecklist,
        type: 'checklist',
      },
      {
        label: 'Horários Sugeridos para Postagem',
        content: rawHorarios,
        type: 'schedule',
      },
    ],
    copyPayload: `[CONTROLE DE QUALIDADE - QA]
Especialista: Camila Siqueira (${provider})
Checklist:
${rawChecklist.map((c) => `- ${c.label}: ${c.detail}`).join('\n')}

Horários Recomendados:
${rawHorarios.map((h) => `${h.day} às ${h.time} (${h.reason})`).join('\n')}`,
  };

  return {
    card,
    rawData: { ...data, checklist: rawChecklist, horarios_sugeridos: rawHorarios },
    provider,
  };
}

/**
 * ETAPA 6: Gestor de Tráfego Pago
 */
export async function executeStep6({ theme, brandProfile, step1Data }) {
  const brandContext = getBrandContext(brandProfile);
  const city = brandProfile?.city || 'Brasil (Grandes Capitais)';

  const systemPrompt = `Você é Thiago Ramos, Gestor de Tráfego Pago e Performance Media Buyer no Meta Ads e Google Ads.
Sua missão é segmentar público-alvo geolocalizado com precisão, definir objetivo no Meta Ads e estipular orçamento diário mínimo para teste e escala.
Retorne estritamente um JSON com as chaves: "publico_alvo", "raio_geografico", "objetivo_campanha", "orcamento" (objeto com testPhase, scalePhase, targetCPL, roasExpected).

${CULTURAL_VOCABULARY_GUIDELINE}`;

  const prompt = `Configure a campanha de tráfego pago para:
TEMA: "${theme}"
OBJETIVO ESTRATÉGICO: ${step1Data.objetivo}
LOCALIZAÇÃO DA MARCA: ${city}
${brandContext}

DIRETRIZES DE TRÁFEGO E VOCABULÁRIO:
- Respeite estritamente o vocabulário tradicional do Kung Fu ("Kwoon", "Katis", "Sifu" - proibido "Dojo", "Kata" ou "Sensei").
- Redija todas as descrições de público, objetivos e orçamentos rigorosamente em Português do Brasil.

Retorne um JSON com:
{
  "publico_alvo": "Segmentação detalhada: idades, gênero, interesses específicos e comportamentos em Português do Brasil",
  "raio_geografico": "Raio geográfico específico em ${city} e arredores estratégicos",
  "objetivo_campanha": "Objetivo técnico de conversão no Meta Ads (ex: Geração de Cadastros com formulário instantâneo ou Mensagens para WhatsApp)",
  "orcamento": {
    "testPhase": "R$ 40,00 / dia",
    "scalePhase": "R$ 150,00 / dia",
    "targetCPL": "R$ 5,00 - R$ 9,00",
    "roasExpected": "3.5x a 5.0x"
  }
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawPublico = sanitizeKungFuTerms(data.publico_alvo) || 'Público local qualificado para conversão.';
  const rawRaio = sanitizeKungFuTerms(data.raio_geografico) || city;
  const rawObjetivo = sanitizeKungFuTerms(data.objetivo_campanha) || 'Geração de Cadastros (Leads Qualificados) no Meta Ads.';

  const card = {
    id: 'card-6',
    stepNumber: 6,
    role: 'Gestor de Tráfego Pago',
    specialistName: 'Thiago Ramos',
    specialistTitle: 'Performance Marketing & Media Buyer',
    specialistAvatar: 'TR',
    badgeColor: 'from-cyan-500 to-blue-600',
    accentBorder: 'border-cyan-500/40 hover:border-cyan-400',
    iconName: 'TrendingUp',
    aiProvider: provider,
    sections: [
      {
        label: 'Público-Alvo Segmentado',
        content: rawPublico,
        type: 'text',
      },
      {
        label: 'Raio Geográfico & Posicionamentos',
        content: rawRaio,
        type: 'geo-tag',
      },
      {
        label: 'Objetivo de Campanha',
        content: rawObjetivo,
        type: 'badge-text',
      },
      {
        label: 'Orçamento Diário Mínimo Sugerido',
        content: data.orcamento || {
          testPhase: 'R$ 45,00 / dia',
          scalePhase: 'R$ 160,00 / dia',
          targetCPL: 'R$ 5,00 - R$ 9,00',
          roasExpected: '3.5x a 5.0x',
        },
        type: 'budget-metrics',
      },
    ],
    copyPayload: `[TRÁFEGO PAGO]
Especialista: Thiago Ramos (${provider})
Público: ${rawPublico}
Geografia: ${rawRaio}
Objetivo: ${rawObjetivo}
Orçamento Teste: ${data.orcamento?.testPhase || 'R$ 45,00 / dia'}
Orçamento Escala: ${data.orcamento?.scalePhase || 'R$ 160,00 / dia'}
CPL Estimado: ${data.orcamento?.targetCPL || 'R$ 5,00 - R$ 9,00'}`,
  };

  return {
    card,
    rawData: { ...data, publico_alvo: rawPublico, raio_geografico: rawRaio, objetivo_campanha: rawObjetivo },
    provider,
  };
}

/**
 * Salva a campanha gerada na tabela 'campaign_history' do Supabase
 */
export async function saveCampaignToSupabase({
  topic,
  strategistData,
  copywriterData,
  reviewerData,
  designerData,
  qaData,
  trafficData,
}) {
  try {
    const { data, error } = await supabase
      .from('campaign_history')
      .insert([
        {
          topic,
          strategist_data: strategistData,
          copywriter_data: copywriterData,
          reviewer_data: reviewerData,
          designer_data: designerData,
          qa_data: qaData,
          traffic_data: trafficData,
        },
      ])
      .select();

    if (error) {
      console.error('[Supabase] Erro ao gravar em campaign_history:', error);
      throw error;
    }

    console.log('[Supabase] Campanha salva em campaign_history com sucesso:', data);
    return data;
  } catch (err) {
    console.error('[Supabase] Falha ao persistir campanha:', err);
    throw err;
  }
}

/**
 * Busca todo o histórico de campanhas do Supabase
 */
export async function fetchCampaignHistory() {
  const { data, error } = await supabase
    .from('campaign_history')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Erro ao buscar campaign_history:', error);
    throw error;
  }

  return data || [];
}

/**
 * Exclui uma campanha do histórico do Supabase
 */
export async function deleteCampaignFromSupabase(id) {
  const { error } = await supabase
    .from('campaign_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Erro ao excluir campanha:', error);
    throw error;
  }

  return true;
}

/**
 * Converte um registro de 'campaign_history' para a lista de 6 cards renderizáveis
 */
export function formatHistoryRecordToCards(record) {
  const strat = record.strategist_data || {};
  const copy = record.copywriter_data || {};
  const rev = record.reviewer_data || {};
  const des = record.designer_data || {};
  const qa = record.qa_data || {};
  const traf = record.traffic_data || {};

  // Card 1: Estrategista de Conteúdo
  const card1 = {
    id: 'card-1',
    stepNumber: 1,
    role: 'Estrategista de Conteúdo',
    specialistName: 'Dra. Helena Vasconcelos',
    specialistTitle: 'Head de Estratégia & Posicionamento',
    specialistAvatar: 'HV',
    badgeColor: 'from-blue-500 to-indigo-600',
    accentBorder: 'border-blue-500/40 hover:border-blue-400',
    iconName: 'Compass',
    aiProvider: 'Histórico Supabase',
    sections: [
      {
        label: 'Objetivo Principal',
        content: sanitizeKungFuTerms(strat.objetivo) || 'Objetivo registrado no histórico.',
        type: 'text',
      },
      {
        label: 'Formato Recomendado',
        content: sanitizeKungFuTerms(strat.formato) || 'Carrossel / Conteúdo Multiplataforma',
        type: 'highlight',
      },
      {
        label: 'Gancho Principal (Hook)',
        content: strat.gancho
          ? `“${sanitizeKungFuTerms(strat.gancho)}”`
          : `“${sanitizeKungFuTerms(record.topic)}”`,
        type: 'quote',
      },
    ],
    copyPayload: `[ESTRATÉGIA DE CONTEÚDO]
Especialista: Dra. Helena Vasconcelos (Histórico Supabase)
Objetivo: ${sanitizeKungFuTerms(strat.objetivo) || 'N/A'}
Formato: ${sanitizeKungFuTerms(strat.formato) || 'N/A'}
Gancho (Hook): "${sanitizeKungFuTerms(strat.gancho || record.topic)}"`,
  };

  // Card 2: Copywriter
  const rawTextosArte = (
    Array.isArray(copy.textos_arte) ? copy.textos_arte : [copy.textos_arte || record.topic]
  ).map((t) => sanitizeKungFuTerms(t));
  const rawLegenda = sanitizeKungFuTerms(copy.legenda) || 'Legenda registrada no histórico.';
  const rawCta = sanitizeKungFuTerms(copy.cta) || '👉 Clique no link da bio e saiba mais.';

  const card2 = {
    id: 'card-2',
    stepNumber: 2,
    role: 'Copywriter',
    specialistName: 'Lucas Menezes',
    specialistTitle: 'Senior Direct-Response Copywriter',
    specialistAvatar: 'LM',
    badgeColor: 'from-purple-500 to-violet-600',
    accentBorder: 'border-purple-500/40 hover:border-purple-400',
    iconName: 'PenTool',
    aiProvider: 'Histórico Supabase',
    sections: [
      {
        label: 'Textos da Arte (Estrutura dos Criativos)',
        content: rawTextosArte,
        type: 'list',
      },
      {
        label: 'Legenda Completa para Redes Sociais',
        content: rawLegenda,
        type: 'text',
      },
      {
        label: 'Chamada para Ação (CTA)',
        content: rawCta,
        type: 'cta',
      },
    ],
    copyPayload: `[COPYWRITING]
Especialista: Lucas Menezes (Histórico Supabase)
Textos da Arte:
${rawTextosArte.map((t) => `- ${t}`).join('\n')}

Legenda:
${rawLegenda}

CTA: ${rawCta}`,
  };

  // Card 3: Revisor Textual
  const rawParecer =
    sanitizeKungFuTerms(rev.parecer_tecnico) || 'Texto revisado e aprovado no padrão culto brasileiro.';
  const rawTextoRevisado =
    sanitizeKungFuTerms(rev.texto_revisado) || sanitizeKungFuTerms(copy.legenda) || 'Versão final revisada.';
  const rawMelhorias = (
    Array.isArray(rev.melhorias)
      ? rev.melhorias
      : [
          'Auditoria e harmonização terminológica do Kung Fu (Kwoon, Katis, Sifu)',
          'Cadência de leitura mobile',
          'Eliminação de repetições',
        ]
  ).map((m) => sanitizeKungFuTerms(m));

  const card3 = {
    id: 'card-3',
    stepNumber: 3,
    role: 'Revisor Textual',
    specialistName: 'Profª. Beatriz Alencar',
    specialistTitle: 'Consultora Linguística & Revisora PT-BR',
    specialistAvatar: 'BA',
    badgeColor: 'from-emerald-500 to-teal-600',
    accentBorder: 'border-emerald-500/40 hover:border-emerald-400',
    iconName: 'SpellCheck',
    aiProvider: 'Histórico Supabase',
    sections: [
      {
        label: 'Parecer Linguístico & Padronização',
        content: rawParecer,
        type: 'badge-text',
      },
      {
        label: 'Texto Final Corrigido e Revisado (PT-BR)',
        content: rawTextoRevisado,
        type: 'corrected-text',
      },
      {
        label: 'Destaques das Melhorias Aplicadas',
        content: rawMelhorias,
        type: 'list-checks',
      },
    ],
    copyPayload: `[REVISÃO TEXTUAL PT-BR]
Especialista: Profª. Beatriz Alencar (Histórico Supabase)
Parecer: ${rawParecer}

Texto Final Revisado:
"${rawTextoRevisado}"

Melhorias:
${rawMelhorias.map((m) => `✓ ${m}`).join('\n')}`,
  };

  // Card 4: Diretor de Arte
  const paletaFormatted = (
    Array.isArray(des.paleta)
      ? des.paleta
      : [
          { name: 'Base Primária', hex: '#111827' },
          { name: 'Destaque', hex: '#EAB308' },
          { name: 'Acento', hex: '#06B6D4' },
          { name: 'Texto Neutro', hex: '#FFFFFF' },
        ]
  ).map((c) => ({
    name: sanitizeKungFuTerms(c.name || 'Cor'),
    hex: c.hex || '#111827',
    class: `bg-[${c.hex || '#111827'}] text-white`,
  }));

  const rawLayout = sanitizeKungFuTerms(des.layout_diretrizes) || 'Diretrizes visuais salvas no histórico.';
  const rawPrompt =
    sanitizeKungFuTerms(des.prompt_midjourney) ||
    'Cinematic commercial photography of authentic Chinese Kung Fu Kwoon --ar 4:5 --v 6.1';

  const card4 = {
    id: 'card-4',
    stepNumber: 4,
    role: 'Diretor de Arte',
    specialistName: 'Rodrigo Fontes',
    specialistTitle: 'Lead Art Director & Visual AI Specialist',
    specialistAvatar: 'RF',
    badgeColor: 'from-amber-500 to-orange-600',
    accentBorder: 'border-amber-500/40 hover:border-amber-400',
    iconName: 'Palette',
    aiProvider: 'Histórico Supabase',
    sections: [
      {
        label: 'Guia Cromático (Paleta de Cores)',
        content: paletaFormatted,
        type: 'color-palette',
      },
      {
        label: 'Layout & Hierarquia Visual',
        content: rawLayout,
        type: 'text',
      },
      {
        label: 'Prompt em Inglês para IA de Imagem (Midjourney / Flux)',
        content: rawPrompt,
        type: 'code',
      },
    ],
    copyPayload: `[DIREÇÃO DE ARTE]
Especialista: Rodrigo Fontes (Histórico Supabase)
Cores:
${paletaFormatted.map((p) => `- ${p.name}: ${p.hex}`).join('\n')}

Diretrizes de Layout:
${rawLayout}

Prompt para IA de Imagem:
${rawPrompt}`,
  };

  // Card 5: QA
  const rawChecklist = (
    Array.isArray(qa.checklist)
      ? qa.checklist
      : [
          { label: 'Feed Vertical (Instagram/LinkedIn)', detail: '1080 x 1350 px (4:5)', status: 'pass' },
          { label: 'Stories & Reels', detail: '1080 x 1920 px (9:16)', status: 'pass' },
        ]
  ).map((c) => ({
    label: sanitizeKungFuTerms(c.label),
    detail: sanitizeKungFuTerms(c.detail),
    status: c.status || 'pass',
  }));

  const rawHorarios = (
    Array.isArray(qa.horarios_sugeridos)
      ? qa.horarios_sugeridos
      : [
          { day: 'Terça-feira', time: '11:45', reason: 'Pico de engajamento' },
          { day: 'Quinta-feira', time: '18:30', reason: 'Mobile pós-expediente' },
        ]
  ).map((h) => ({
    day: sanitizeKungFuTerms(h.day),
    time: h.time,
    reason: sanitizeKungFuTerms(h.reason),
  }));

  const card5 = {
    id: 'card-5',
    stepNumber: 5,
    role: 'Controle de Qualidade',
    specialistName: 'Camila Siqueira',
    specialistTitle: 'QA & Compliance Lead',
    specialistAvatar: 'CS',
    badgeColor: 'from-rose-500 to-pink-600',
    accentBorder: 'border-rose-500/40 hover:border-rose-400',
    iconName: 'ShieldCheck',
    aiProvider: 'Histórico Supabase',
    sections: [
      {
        label: 'Checklist de Proporção & Boas Práticas',
        content: rawChecklist,
        type: 'checklist',
      },
      {
        label: 'Horários Sugeridos para Postagem',
        content: rawHorarios,
        type: 'schedule',
      },
    ],
    copyPayload: `[CONTROLE DE QUALIDADE - QA]
Especialista: Camila Siqueira (Histórico Supabase)
Checklist:
${rawChecklist.map((c) => `- ${c.label}: ${c.detail}`).join('\n')}

Horários Recomendados:
${rawHorarios.map((h) => `${h.day} às ${h.time} (${h.reason})`).join('\n')}`,
  };

  // Card 6: Tráfego Pago
  const rawPublico = sanitizeKungFuTerms(traf.publico_alvo) || 'Público salvo no histórico.';
  const rawRaio = sanitizeKungFuTerms(traf.raio_geografico) || 'Região da campanha.';
  const rawObjetivoTrafego = sanitizeKungFuTerms(traf.objetivo_campanha) || 'Objetivo de tráfego.';

  const card6 = {
    id: 'card-6',
    stepNumber: 6,
    role: 'Gestor de Tráfego Pago',
    specialistName: 'Thiago Ramos',
    specialistTitle: 'Performance Marketing & Media Buyer',
    specialistAvatar: 'TR',
    badgeColor: 'from-cyan-500 to-blue-600',
    accentBorder: 'border-cyan-500/40 hover:border-cyan-400',
    iconName: 'TrendingUp',
    aiProvider: 'Histórico Supabase',
    sections: [
      {
        label: 'Público-Alvo Segmentado',
        content: rawPublico,
        type: 'text',
      },
      {
        label: 'Raio Geográfico & Posicionamentos',
        content: rawRaio,
        type: 'geo-tag',
      },
      {
        label: 'Objetivo de Campanha',
        content: rawObjetivoTrafego,
        type: 'badge-text',
      },
      {
        label: 'Orçamento Diário Mínimo Sugerido',
        content: traf.orcamento || {
          testPhase: 'R$ 40,00 / dia',
          scalePhase: 'R$ 150,00 / dia',
          targetCPL: 'R$ 5,00 - R$ 9,00',
          roasExpected: '3.5x a 5.0x',
        },
        type: 'budget-metrics',
      },
    ],
    copyPayload: `[TRÁFEGO PAGO]
Especialista: Thiago Ramos (Histórico Supabase)
Público: ${rawPublico}
Geografia: ${rawRaio}
Objetivo: ${rawObjetivoTrafego}
Orçamento Teste: ${traf.orcamento?.testPhase || ''}
Orçamento Escala: ${traf.orcamento?.scalePhase || ''}`,
  };

  return [card1, card2, card3, card4, card5, card6];
}
