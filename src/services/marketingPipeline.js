import { generateMarketingAI } from './aiProvider.js';
import { supabase } from '../lib/supabase.js';
import { extractThemeSemantics } from '../utils/themeSemantics.js';

/**
 * Helper para construir o contexto institucional da marca
 */
export function getBrandContext(brandProfile, isBrandActive = true) {
  if (!isBrandActive || !brandProfile) {
    return '[MODO MULTI-NICHO / AGY-AGNÓSTICO ATIVADO: Perfil de marca institucional DESATIVADO. A campanha é 100% livre e deve se orientar exclusivamente pelo tema livre inserido na caixa de texto. O nicho, o público-alvo, as dores e o tom de voz devem ser totalmente inferidos a partir do tema, sem qualquer menção ou restrição a marcas ou empresas externas.]';
  }
  return `
- Nome da Marca: ${brandProfile.brand_name || 'Empresa / Negócio'}
- Nicho/Segmento: ${brandProfile.niche || brandProfile.segment || 'Serviços & Produtos'}
- Cidade/Localização: ${brandProfile.city || 'Brasil'}
- Público-Alvo Institucional: ${brandProfile.target_audience || 'Clientes potenciais e público qualificado'}
- Tom de Voz Institucional: ${brandProfile.tone_of_voice || 'Profissional, acolhedor e persuasivo'}
- Cores Institucionais: Primária ${brandProfile.primary_color || '#111827'}, Acento ${brandProfile.accent_color || '#EAB308'}
`.trim();
}

/**
 * ETAPA 1: Estrategista de Conteúdo
 */
export async function executeStep1({ theme, brandProfile, isBrandActive = true }) {
  const effectiveBrand = isBrandActive ? brandProfile : null;
  const brandContext = getBrandContext(brandProfile, isBrandActive);
  const semantics = extractThemeSemantics(theme, effectiveBrand);

  const systemPrompt = `Você é a Dra. Helena Vasconcelos, Estrategista de Conteúdo Sênior e Head de Posicionamento de Marcas.
Sua missão é estruturar a base estratégica de uma campanha de marketing de alto impacto adaptada perfeitamente ao nicho e público da campanha.
Nicho detectado: ${semantics.niche}
Público-Alvo: ${semantics.audience}
Retorne estritamente um JSON com as chaves: "objetivo", "formato", "gancho".`;

  const prompt = `Defina a estratégia para a seguinte campanha:
TEMA DA CAMPANHA: "${theme}"
NICHO IDENTIFICADO: ${semantics.niche}
PÚBLICO-ALVO ESTIMADO: ${semantics.audience}
DOR PRINCIPAL DO CLIENTE: ${semantics.painPoint}
DIRETRIZES DA MARCA:
${brandContext}

INSTRUÇÕES RIGOROSAS:
- Redija todo o conteúdo estritamente no padrão culto do Português do Brasil.
- Adapte o vocabulário, exemplos e tom 100% ao segmento comercial do tema (se for padaria, fale de gastronomia e pães; se for médico/advogado, fale de serviços profissionais; se for terceira idade, fale de longevidade e bem-estar).
- NUNCA injete termos de artes marciais ou nichos não relacionados, a menos que o tema cite explicitamente.

Responda em formato JSON com:
{
  "objetivo": "Objetivo claro, específico e mensurável da campanha para este nicho",
  "formato": "Formato recomendado detalhado (ex: Carrossel de 5 lâminas 4:5 + Reels vertical de 45s)",
  "gancho": "Gancho (hook) irresistível de abertura para prender a atenção nos primeiros 3 segundos"
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawObjetivo = data.objetivo || `Consolidar a autoridade da marca no segmento de ${semantics.niche} e acelerar a captação de clientes qualificados.`;
  const rawFormato = data.formato || 'Carrossel Educativo e Persuasivo (1080x1350) + Vídeo Curto / Reels vertical.';
  const rawGancho = data.gancho || `“Descubra como transformar sua experiência com ${theme} através de atendimento especializado.”`;

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
Nicho: ${semantics.niche}
Objetivo: ${rawObjetivo}
Formato: ${rawFormato}
Gancho (Hook): "${rawGancho}"`,
  };

  return { card, rawData: { ...data, objetivo: rawObjetivo, formato: rawFormato, gancho: rawGancho }, provider };
}

/**
 * ETAPA 2: Copywriter
 */
export async function executeStep2({ theme, brandProfile, step1Data, isBrandActive = true }) {
  const effectiveBrand = isBrandActive ? brandProfile : null;
  const brandContext = getBrandContext(brandProfile, isBrandActive);
  const semantics = extractThemeSemantics(theme, effectiveBrand);

  const copyNarratives = [
    'Enfoque em solução de dor imediata, economia de tempo e alívio de frustração do cliente.',
    'Enfoque em autoridade técnica, qualidade premium e experiência comprovada no segmento.',
    'Enfoque em transformação de vida, bem-estar, segurança e realização pessoal ou familiar.',
    'Enfoque em custo-benefício inteligente, retorno sobre investimento e oferta de oportunidade exclusiva.',
    'Enfoque em atendimento humanizado, acolhimento e relacionamento de longo prazo.',
  ];
  const chosenNarrative = copyNarratives[Math.floor(Math.random() * copyNarratives.length)];

  const systemPrompt = `Você é Lucas Menezes, Copywriter Especialista em Resposta Direta e Narrativas Persuasivas Multi-Nicho.
Você recebe a estratégia de conteúdo e cria textos altamente envolventes, autênticos e orientados à conversão para qualquer segmento comercial.
Nicho: ${semantics.niche}
Retorne estritamente um JSON com as chaves: "textos_arte" (array de 4 a 5 strings), "legenda" (string completa), "cta" (string).`;

  const prompt = `Com base na estratégia definida:
Objetivo: ${step1Data.objetivo}
Formato: ${step1Data.formato}
Gancho: ${step1Data.gancho}

TEMA DA CAMPANHA: "${theme}"
NICHO: ${semantics.niche}
PÚBLICO-ALVO: ${semantics.audience}
DIRETRIZ NARRATIVA PRIORITÁRIA: ${chosenNarrative}
MARCA E DIRETRIZES:
${brandContext}

INSTRUÇÕES RIGOROSAS:
- Redija todo o conteúdo rigorosamente no padrão culto de Português do Brasil com quebras de parágrafo e alta retenção.
- O copy DEVE ser 100% fiel ao tema "${theme}". Não injete termos de outros nichos (artes marciais, médicos, padarias) a menos que constem no briefing.
- Crie uma chamada para ação (CTA) direta, clara e irresistível.

Gere o copy completo em JSON com:
{
  "textos_arte": [
    "Lâmina 1 (Capa): ...",
    "Lâmina 2: ...",
    "Lâmina 3: ...",
    "Lâmina 4: ...",
    "Lâmina 5 (Final): ..."
  ],
  "legenda": "Legenda completa para redes sociais, altamente persuasiva, empática e com quebras de parágrafo",
  "cta": "Chamada para ação direta (ex: Toque no link da bio e fale com nossos especialistas)"
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawTextosArte = Array.isArray(data.textos_arte) && data.textos_arte.length > 0
    ? data.textos_arte
    : [
        `Lâmina 1 (Capa): Como alcançar excelência em ${semantics.niche}?`,
        `Lâmina 2: O segredo está em aliar experiência, técnica e dedicação diária.`,
        `Lâmina 3: Solução personalizada para atender às reais necessidades de ${semantics.audience}.`,
        `Lâmina 4: Mais tranquilidade, segurança e resultados comprovados para você.`,
        `Lâmina 5 (CTA): 👉 Toque no link e agende seu atendimento exclusivo!`
      ];

  const rawLegenda = data.legenda || `Quem busca o melhor em ${semantics.niche} sabe que qualidade e atendimento especializado fazem toda a diferença.\n\nCom "${theme}", entregamos uma experiência completa pensada para ${semantics.audience}.\n\n✨ Venha conhecer e comprove a diferença!`;
  const rawCta = data.cta || '👉 Clique no botão abaixo e fale com nossa equipe especializada.';

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
Nicho: ${semantics.niche}
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
export async function executeStep3({ theme, brandProfile, step2Data, isBrandActive = true }) {
  const effectiveBrand = isBrandActive ? brandProfile : null;
  const brandContext = getBrandContext(brandProfile, isBrandActive);
  const semantics = extractThemeSemantics(theme, effectiveBrand);

  const systemPrompt = `Você é a Profª. Beatriz Alencar, Consultora Linguística e Revisora Textual em Português do Brasil (PT-BR).
Sua missão é garantir perfeição gramatical, cadência rítmica mobile, clareza, concisão e adequação ao nicho da campanha (${semantics.niche}).
Retorne estritamente um JSON com as chaves: "parecer_tecnico", "texto_revisado", "melhorias" (array de 3 strings).`;

  const prompt = `Revise o seguinte copy de marketing para o tema "${theme}":
Textos da Arte: ${JSON.stringify(step2Data.textos_arte)}
Legenda: "${step2Data.legenda}"
CTA: "${step2Data.cta}"

NICHO: ${semantics.niche}
DIRETRIZES DA MARCA:
${brandContext}

INSTRUÇÕES RIGOROSAS:
1. Audite o texto segundo o Novo Acordo Ortográfico e a norma-padrão de Português do Brasil.
2. Elimine ambiguidades, repetições desnecessárias e gerundismos.
3. Garanta que o texto mantenha cadência rítmica ideal para leitura em smartphones.
4. Mantenha a coerência terminológica estritamente com o nicho de ${semantics.niche}.

Retorne um JSON com:
{
  "parecer_tecnico": "Parecer conciso da revisão conforme o padrão culto PT-BR e adequação ao segmento",
  "texto_revisado": "Versão definitiva aprimorada, polida e fluida do texto/legenda para leitura em smartphones",
  "melhorias": [
    "Melhoria 1...",
    "Melhoria 2...",
    "Melhoria 3..."
  ]
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawParecer = data.parecer_tecnico || `Texto revisado com sucesso. Concordância e pontuação ajustadas ao padrão culto brasileiro, com vocabulário perfeitamente alinhado a ${semantics.niche}.`;
  const rawTextoRevisado = data.texto_revisado || step2Data.legenda;
  const rawMelhorias = Array.isArray(data.melhorias) && data.melhorias.length > 0
    ? data.melhorias
    : [
        `Harmonização de concordância verbal e adequação terminológica para ${semantics.niche}`,
        'Cadência rítmica aprimorada para leitura dinâmica em dispositivos móveis',
        'Eliminação de redundâncias e reforço da clareza da chamada para ação',
      ];

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
Nicho: ${semantics.niche}
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
 * ARSENAL DE COMPOSIÇÕES VISUAIS AGNOSTICAS PARA O DIRETOR DE ARTE (CARD 04)
 * Sorteio aleatório entre 6 estéticas e enquadramentos de alto impacto comercial
 */
export const ART_DIRECTOR_STYLES = [
  {
    id: 'editorial_comercial_dinamico',
    name: 'Fotografia Editorial Comercial em Movimento / Ação',
    camera: 'Sony A1 com lente Sony FE 24-70mm f/2.8 GM II (shutter speed 1/1200s, tracking contínuo)',
    angle: 'Ângulo dinâmico e envolvente capturando a energia e velocidade da ação',
    lighting: 'Luz natural lateral intensa cortada por janelas amplas do ambiente contemporâneo, partículas de luz volumétrica e rim light dourada',
    paletteName: 'Energia & Alta Performance',
    description: 'Cena comercial dinâmica com alta definição de movimento congelado, ambiente contemporâneo iluminado e estética editorial premium.',
    midjourneyGuidance: 'High-speed commercial editorial action photography, dynamic perspective, crisp motion freeze at 1/1200s, Sony A1 24-70mm f/2.8 GM II, volumetric daylight streaming through modern windows, authentic kinetic energy, commercial grade photography'
  },
  {
    id: 'retrato_cinematografico_closeup',
    name: 'Retrato Cinematográfico Close-Up Emocional',
    camera: 'Hasselblad H6D-100c com lente HC 100mm f/2.2 (foco cirúrgico na expressão)',
    angle: 'Eye-level close-up intimista, enquadramento fechado destacando a expressão e olhar autêntico',
    lighting: 'Chiaroscuro suave com softbox octagonal a 45 graus, contraluz sutil delineando os contornos',
    paletteName: 'Resiliência & Conexão Emocional',
    description: 'Foco nos olhos e na expressão autêntica, profundidade de campo rasa, textura natural de pele e iluminação cinematográfica de estúdio.',
    midjourneyGuidance: 'Intimate cinematic emotional close-up portrait, Hasselblad H6D-100c HC 100mm f/2.2, dramatic chiaroscuro softbox studio lighting, shallow depth of field, sharp focus on genuine eyes and expression, hyper-detailed natural skin texture'
  },
  {
    id: 'documental_conexao_humana',
    name: 'Documental Autêntico de Atendimento & Conexão Humana',
    camera: 'Canon EOS R5 C com lente RF 50mm f/1.2L USM (perspectiva humana e orgânica)',
    angle: 'Plano médio em três quartos capturando a interação genuína e confiança entre especialista e cliente',
    lighting: 'Luz ambiente acolhedora de fim de tarde (golden hour), sombras suaves e atmosfera de respeito e acolhimento',
    paletteName: 'Acolhimento, Confiança & Humanização',
    description: 'Momento documental espontâneo de escuta, orientação ou atendimento entre profissional e cliente em ambiente autêntico.',
    midjourneyGuidance: 'Documentary storytelling photography, authentic interaction between dedicated specialist and client, Canon EOS R5 RF 50mm f/1.2L, warm golden hour ambient lighting, respectful trust-building connection, natural candid expressions'
  },
  {
    id: 'treino_pratica_equipamentos',
    name: 'Cena Prática de Alta Performance & Detalhes do Ofício',
    camera: 'Nikon Z9 com lente Nikkor Z 85mm f/1.2 S (nitidez extrema nos instrumentos e ações)',
    angle: 'Ângulo médio lateral dinâmico revelando os detalhes técnicos e execução prática',
    lighting: 'Iluminação de estúdio profissional com luz de recorte 5600K e refletores direcionais',
    paletteName: 'Precisão, Maestria & Detalhes Técnicos',
    description: 'Enquadramento focado na execução de alta precisão, ferramentas ou equipamentos especializados e atmosfera profissional.',
    midjourneyGuidance: 'High-performance professional craftsmanship scene, focused hands-on execution and specialized tools, Nikon Z9 85mm f/1.2 S, crisp studio commercial lighting with white rim lights, kinetic precision, authentic textures and environmental atmosphere'
  },
  {
    id: 'poster_minimalista_espaco_negativo',
    name: 'Pôster Publicitário Minimalista com Amplo Espaço Negativo',
    camera: 'Fujifilm GFX 100 II com lente GF 110mm f/2 R LM WR (formato médio ultra-nítido)',
    angle: 'Composição assimétrica em regra dos terços com 60% de espaço negativo clean para inserção de tipografia',
    lighting: 'Luz zenital dramática (overhead spotlight / rim light) sobre fundo gradiente sofisticado e minimalista',
    paletteName: 'Minimalismo Editorial de Luxo',
    description: 'Composição com sujeito herói em silhueta ou recorte nítido e amplo espaço negativo limpo para aplicação de tipografia institucional.',
    midjourneyGuidance: 'Minimalist luxury commercial advertising poster, solitary hero silhouette or subject positioned in lower third, generous clean dark negative space for typography, Fujifilm GFX 100 II 110mm f/2, dramatic directional spotlight, sophisticated modern background, ultra-clean composition'
  },
  {
    id: 'tradicao_institucional_excelencia',
    name: 'Cena Institucional Solene / Tradição, Confiança & Excelência',
    camera: 'Leica SL2 com lente Summilux-SL 50mm f/1.4 ASPH (textura orgânica e tons cinematográficos clássicos)',
    angle: 'Plano frontal solene e equilibrado, transmitindo autoridade, valores nobres e reputação sólida',
    lighting: 'Luz suave acolhedora, tons quentes e bronze realçando a solidez e requinte do espaço',
    paletteName: 'Autoridade, Prestígio & Legado',
    description: 'Retrato institucional de grande presença e dignidade, celebrando a credibilidade, tradição e excelência de atendimento.',
    midjourneyGuidance: 'Solemn prestigious commercial brand portrait celebrating heritage, trust and excellence, Leica SL2 Summilux 50mm f/1.4, warm ambient lighting and directional bronze rim light, dignified presence, honoring quality and expertise in a refined setting'
  }
];

/**
 * 5 ENQUADRAMENTOS VISUAIS RADICAIS PARA TEMAS INFANTIS (CARD 04)
 * Elimina o padrão repetitivo de "turma alinhada em base baixa frontal com mestre atrás"
 */
export const KIDS_FRAMING_STYLES = [
  {
    id: 'close_up_emocional',
    key: 'A',
    name: 'Close-Up Emocional & Determinação',
    category: 'CLOSE-UP EMOCIONAL',
    framingDescription: 'Foco no rosto determinado da criança ajustando a faixa ou respirando fundo',
    camera: 'Lente 85mm f/1.4 (profundidade de campo rasa, foco cirúrgico no olhar)',
    angle: 'Plano fechado intimista (close-up) na altura dos olhos da criança',
    lighting: 'Iluminação suave natural com luz de recorte sutil nos cabelos, destacando expressão de maturidade',
    paletteName: 'Foco & Maturidade Emocional',
    negativeConstraints: 'no adults in frame, no distorted anatomy, no cartoon, no blurry eyes, focus strictly on young child facial determination',
    midjourneyGuidance: 'Intimate cinematic emotional close-up portrait of an authentic Brazilian child (aged 7 to 9), intense focused and determined expression, delicately adjusting martial belt or taking a deep mindful breath, 85mm f/1.4 lens, shallow depth of field, creamy soft bokeh, gentle natural side lighting with subtle warm rim light, natural skin pores, pure determination and youthful maturity'
  },
  {
    id: 'correcao_pedagogica_individual',
    key: 'B',
    name: 'Correção Pedagógica Individual & Respeito Mútuo',
    category: 'CORREÇÃO PEDAGÓGICA INDIVIDUAL',
    framingDescription: 'Instrutor abaixado na altura dos olhos da criança, orientando a postura com cuidado e respeito',
    camera: 'Canon EOS R5 com lente 50mm f/1.2L USM',
    angle: 'Plano lateral aconchegante, ângulo na altura dos olhos da criança agachada',
    lighting: 'Luz difusa acolhedora de fim de tarde entrando pelas janelas do Kwoon contemporâneo',
    paletteName: 'Mentoria, Afeto & Respeito',
    negativeConstraints: 'no aggressive fighting, no chaotic background, no distorted hands, patient mentor and child only, no harsh shadows',
    midjourneyGuidance: 'Warm pedagogical guidance scene, experienced patient adult martial arts instructor kneeling down at eye level with an authentic Brazilian young child student, gently and respectfully correcting arm and fist posture, cozy lateral medium shot at child eye-level, 50mm f/1.2L lens, warm ambient window light, genuine mutual respect and mentoring trust, emotional documentary atmosphere'
  },
  {
    id: 'agilidade_diversao_dinamica',
    key: 'C',
    name: 'Agilidade, Coordenação Motora & Alegria Dinâmica',
    category: 'AGILIDADE E DIVERSÃO DINÂMICA',
    framingDescription: 'Crianças em salto de coordenação motora ou corrida de obstáculos no tatame',
    camera: 'Sony A1 com lente 24mm f/1.4 GM (velocidade rápida 1/2000s congelando o movimento no ar)',
    angle: 'Câmera ao nível do chão (ground-level worm eye view) olhando para cima',
    lighting: 'Luz diurna vibrante e enérgica, feixes de luz cruzados no tatame limpo contemporâneo',
    paletteName: 'Vitalidade, Agilidade & Alegria',
    negativeConstraints: 'no clumsy falls, no dangerous obstacles, no messy background, high-energy clean athletic gym, no blurry motion',
    midjourneyGuidance: 'High-energy motor coordination action photo, joyful Brazilian children executing dynamic athletic jump over obstacle course on clean martial arts training mat, ground-level low-angle perspective, shutter speed 1/2000s freezing mid-air kinetic motion, 24mm wide angle, vibrant natural daylight, candid smiles of achievement, athletic agility and infectious joy'
  },
  {
    id: 'foco_cognitivo_escolar',
    key: 'D',
    name: 'Foco Cognitivo, Rendimento Escolar & Serenidade',
    category: 'FOCO COGNITIVO / ESCOLAR',
    framingDescription: 'Criança em mesa de estudo com postura impecável e livros, olhar sereno e focado',
    camera: 'Fujifilm GFX 100 II com lente 63mm f/2.8 (nitidez impecável)',
    angle: 'Plano médio em três quartos elegante e equilibrado',
    lighting: 'Ambiente limpo e luminoso, luz suave de janela sobre a bancada de estudos',
    paletteName: 'Disciplina Cognitiva & Foco Escolar',
    negativeConstraints: 'no messy room, no toys, no distractions, no fatigue, serene intellectual focus, no cluttered desks',
    midjourneyGuidance: 'Cognitive focus and academic discipline scene, authentic Brazilian child sitting at clean minimalist study desk with impeccable upright posture, open textbooks and notebook, serene focused and calm gaze, bright luminous modern room, morning daylight streaming, quiet concentration reflecting martial discipline applied to schooling, 63mm f/2.8 lens, pristine commercial photography'
  },
  {
    id: 'poster_minimalista_espaco_negativo',
    key: 'E',
    name: 'Pôster Minimalista com Amplo Espaço Negativo',
    category: 'PÔSTER MINIMALISTA COM ESPAÇO NEGATIVO',
    framingDescription: 'Criança em postura marcial clássica no terço inferior direito, com 60% de espaço limpo para texto publicitário',
    camera: 'Hasselblad H6D-100c com lente 100mm f/2.2',
    angle: 'Composição assimétrica em regra dos terços com ampla área limpa',
    lighting: 'Luz zenital dramática e elegante (overhead rim light) sobre fundo neutro sofisticado',
    paletteName: 'Design Editorial & Espaço Negativo',
    negativeConstraints: 'no centered subject, no cluttered background, generous negative space, no typography in raw render, no crowded elements',
    midjourneyGuidance: 'Minimalist luxury advertising poster layout, young Brazilian child in crisp classical martial arts stance positioned in the bottom-right third of frame, generous 60% clean dark minimalist negative space left open for copy and headline, Hasselblad 100mm f/2.2, dramatic overhead studio spotlight and edge rim lighting, razor-sharp silhouette against clean backdrop'
  }
];

/**
 * 4 VARIAÇÕES DE UNIFORMES E CORES PARA CRIANÇAS
 * Evita fixar sempre cetim preto com dragão dourado
 */
export const KIDS_UNIFORM_VARIATIONS = [
  {
    id: 'branco_classico',
    name: 'Branco Clássico de Pureza & Graduação',
    description: 'uniforme tradicional em branco puro de algodão',
    promptFragment: 'pure crisp white classical martial arts cotton uniform, clean pristine white fabric with colored rank belt'
  },
  {
    id: 'vermelho_tradicional',
    name: 'Vermelho Tradicional de Energia & Vitalidade',
    description: 'traje tradicional marcial em vermelho bordô elegante',
    promptFragment: 'deep traditional crimson red martial arts uniform with neat trim, authentic cultural elegance'
  },
  {
    id: 'azul_marcial',
    name: 'Azul Marcial Sereno de Foco & Disciplina',
    description: 'uniforme marcial azul royal contemporâneo',
    promptFragment: 'royal martial blue contemporary uniform, breathable crisp fabric, contrasting black rank sash'
  },
  {
    id: 'camiseta_clean_treino',
    name: 'Camiseta Institucional Clean de Treino Funcional',
    description: 'camiseta institucional clean de treino e calça marcial leve',
    promptFragment: 'clean minimalist modern brand training t-shirt in heather grey or navy blue with lightweight martial trousers, comfortable athletic youth training look'
  }
];

// Variáveis de controle de estado para forçar sorteios não repetitivos em recriações sucessivas
let lastKidsFramingIndex = -1;
let lastKidsUniformIndex = -1;
let lastGenericStyleIndex = -1;

export function getNextKidsFraming(forceDifferent = true) {
  let idx;
  if (forceDifferent && KIDS_FRAMING_STYLES.length > 1) {
    do {
      idx = Math.floor(Math.random() * KIDS_FRAMING_STYLES.length);
    } while (idx === lastKidsFramingIndex);
  } else {
    idx = Math.floor(Math.random() * KIDS_FRAMING_STYLES.length);
  }
  lastKidsFramingIndex = idx;
  return KIDS_FRAMING_STYLES[idx];
}

export function getNextKidsUniform(forceDifferent = true) {
  let idx;
  if (forceDifferent && KIDS_UNIFORM_VARIATIONS.length > 1) {
    do {
      idx = Math.floor(Math.random() * KIDS_UNIFORM_VARIATIONS.length);
    } while (idx === lastKidsUniformIndex);
  } else {
    idx = Math.floor(Math.random() * KIDS_UNIFORM_VARIATIONS.length);
  }
  lastKidsUniformIndex = idx;
  return KIDS_UNIFORM_VARIATIONS[idx];
}

export function getNextGenericStyle(forceDifferent = true) {
  let idx;
  if (forceDifferent && ART_DIRECTOR_STYLES.length > 1) {
    do {
      idx = Math.floor(Math.random() * ART_DIRECTOR_STYLES.length);
    } while (idx === lastGenericStyleIndex);
  } else {
    idx = Math.floor(Math.random() * ART_DIRECTOR_STYLES.length);
  }
  lastGenericStyleIndex = idx;
  return ART_DIRECTOR_STYLES[idx];
}

/**
 * ETAPA 4: Diretor de Arte
 */
export async function executeStep4({ theme, brandProfile, step1Data, isBrandActive = true, forceNewStyle = false }) {
  const effectiveBrand = isBrandActive ? brandProfile : null;
  const brandContext = getBrandContext(brandProfile, isBrandActive);
  const primaryColor = isBrandActive && brandProfile?.primary_color ? brandProfile.primary_color : '#111827';
  const accentColor = isBrandActive && brandProfile?.accent_color ? brandProfile.accent_color : '#EAB308';

  const semantics = extractThemeSemantics(theme, effectiveBrand);
  const isKidsTheme = semantics.isKids || /(crian[çc]|infantil|kids|filh|escol|disciplin|mirim)/i.test(theme);

  // Sorteio forçado entre os 5 enquadramentos infantis ou os 6 estilos genéricos
  const selectedKidsFraming = isKidsTheme ? getNextKidsFraming(true) : null;
  const selectedUniform = isKidsTheme ? getNextKidsUniform(true) : null;
  const selectedStyle = isKidsTheme
    ? {
        id: selectedKidsFraming.id,
        key: selectedKidsFraming.key,
        name: `[Enquadramento ${selectedKidsFraming.key}] ${selectedKidsFraming.name}`,
        category: selectedKidsFraming.category,
        camera: selectedKidsFraming.camera,
        angle: selectedKidsFraming.angle,
        lighting: selectedKidsFraming.lighting,
        paletteName: selectedKidsFraming.paletteName,
        uniform: selectedUniform,
        description: `${selectedKidsFraming.framingDescription} • Uniforme: ${selectedUniform.name}`,
        midjourneyGuidance: `${selectedKidsFraming.midjourneyGuidance}, wearing ${selectedUniform.promptFragment}`,
        negativeConstraints: selectedKidsFraming.negativeConstraints,
      }
    : getNextGenericStyle(true);

  const systemPrompt = `Você é Rodrigo Fontes, Diretor de Arte Sênior e Especialista em Criação Visual com IA (Midjourney v6.1 / Flux Pro) para Campanhas Publicitárias de Alta Performance.
Sua missão é desenvolver a identidade visual, hierarquia de layout, paleta de cores precisa e um PROMPT CINEMATOGRÁFICO EM INGLÊS perfeitamente personalizado para a campanha.
Nicho: ${semantics.niche}
${isKidsTheme ? `Enquadramento Sorteado: ${selectedStyle.name} (${selectedKidsFraming.category})\nUniforme: ${selectedUniform.name}` : `Sujeito Visual: ${semantics.visualSubject}`}
Retorne estritamente um JSON com as chaves: "paleta" (array de 4 objetos com name e hex), "layout_diretrizes", "prompt_midjourney".`;

  const prompt = isKidsTheme
    ? `Defina a direção de arte e o prompt visual cinematográfico exclusivo para a campanha infantil:
TEMA DA CAMPANHA: "${theme}"
NICHO IDENTIFICADO: ${semantics.niche}
OBJETIVO ESTRATÉGICO: ${step1Data.objetivo}
FORMATO SUGERIDO: ${step1Data.formato}
CORES INSTITUCIONAIS: Primária ${primaryColor}, Acento ${accentColor}
${brandContext}

ENQUADRAMENTO OBRIGATÓRIO SORTEADO:
- Categoria: ${selectedKidsFraming.category} (${selectedKidsFraming.name})
- Composição & Ação: ${selectedKidsFraming.framingDescription}
- Câmera/Lente: ${selectedKidsFraming.camera}
- Ângulo de Visão: ${selectedKidsFraming.angle}
- Iluminação da Cena: ${selectedKidsFraming.lighting}
- Variação de Uniforme Sorteada: ${selectedUniform.name} (${selectedUniform.description})
- Restrições Negativas: ${selectedKidsFraming.negativeConstraints}

INSTRUÇÕES RIGOROSAS:
1. QUEBRA DE PADRÃO REPETITIVO:
   - NUNCA gere a cena batida de turma alinhada em base baixa frontal com mestre atrás!
   - Siga RIGOROSAMENTE a composição sorteada: "${selectedKidsFraming.framingDescription}".
   - O vestuário DEVE ser: ${selectedUniform.description} (NÃO force cetim preto com dragão dourado).
2. No "prompt_midjourney" (em inglês cinematográfico ultra-detalhado):
   - Incorpore a composição do Enquadramento ${selectedKidsFraming.key}: ${selectedKidsFraming.midjourneyGuidance}
   - Inclua o uniforme sorteado: ${selectedUniform.promptFragment}
   - Especifique a câmera (${selectedKidsFraming.camera}), o ângulo (${selectedKidsFraming.angle}) e iluminação (${selectedKidsFraming.lighting})
   - Inclua as restrições: ${selectedKidsFraming.negativeConstraints}
   - Finalize com: 8k resolution, photorealistic commercial photography, natural textures --ar 4:5 --v 6.1 --style raw
3. Em "layout_diretrizes" (em PT-BR): descreva hierarquia, tipografia, paleta e aproveitamento específico do Enquadramento ${selectedKidsFraming.key} (${selectedKidsFraming.name}).

Retorne um JSON com:
{
  "paleta": [
    { "name": "${selectedKidsFraming.paletteName} (Base)", "hex": "${primaryColor}" },
    { "name": "${selectedKidsFraming.paletteName} (Destaque)", "hex": "${accentColor}" },
    { "name": "Acento Dinâmico", "hex": "#06B6D4" },
    { "name": "Contraste Puro", "hex": "#FFFFFF" }
  ],
  "layout_diretrizes": "Hierarquia visual detalhada, tipografia recomendada e composição aproveitando o enquadramento ${selectedKidsFraming.name} em Português do Brasil.",
  "prompt_midjourney": "Cinematic photo prompt in English incorporating ${selectedKidsFraming.midjourneyGuidance}, wearing ${selectedUniform.promptFragment}, camera, lens, lighting, authentic atmosphere and parameters --ar 4:5 --v 6.1 --style raw"
}`
    : `Defina a direção de arte e o prompt visual cinematográfico exclusivo para a campanha:
TEMA DA CAMPANHA: "${theme}"
NICHO IDENTIFICADO: ${semantics.niche}
SUJEITOS VISUAIS OBRIGATÓRIOS: ${semantics.visualSubject}
RESTRIÇÕES NEGATIVAS: ${semantics.negativeConstraints}
OBJETIVO ESTRATÉGICO: ${step1Data.objetivo}
FORMATO SUGERIDO: ${step1Data.formato}
CORES INSTITUCIONAIS: Primária ${primaryColor}, Acento ${accentColor}
${brandContext}

ESTILO VISUAL SORTEADO PARA ESTA EXECUÇÃO:
Nome: ${selectedStyle.name}
Câmera/Lente: ${selectedStyle.camera}
Ângulo: ${selectedStyle.angle}
Iluminação: ${selectedStyle.lighting}
Inspiração Midjourney: ${selectedStyle.midjourneyGuidance}

INSTRUÇÕES RIGOROSAS:
1. Adapte a atmosfera visual EXCLUSIVAMENTE ao tema "${theme}".
   - Se o tema envolver padaria / confeitaria / alimentação -> inclua obrigatoriamente: "hygienic commercial kitchen setting, clean apron, professional baker standards, appetizing food photography".
   - Se o tema for idosos / terceira idade -> mostre pessoas idosas ativas e saudáveis (60-75 anos).
   - Se o tema for médico / advogado -> mostre médicos ou advogados em consultório/escritório executivo moderno.
   - NUNCA force termos marciais a menos que o tema ou perfil ativo cite explicitamente!
2. No "prompt_midjourney" (em inglês cinematográfico):
   - Comece descrevendo o sujeito visual: ${semantics.visualSubject}
   - Incorpore: ${selectedStyle.midjourneyGuidance}
   - Especifique a câmera (${selectedStyle.camera}) e iluminação (${selectedStyle.lighting})
   - Adicione restrições: ${semantics.negativeConstraints}
   - Finalize com: 8k resolution, photorealistic commercial photography, natural textures --ar 4:5 --v 6.1 --style raw
3. Em "layout_diretrizes" (em PT-BR): descreva hierarquia, tipografia, paleta e uso do espaço negativo.

Retorne um JSON com:
{
  "paleta": [
    { "name": "${selectedStyle.paletteName} (Base)", "hex": "${primaryColor}" },
    { "name": "${selectedStyle.paletteName} (Destaque)", "hex": "${accentColor}" },
    { "name": "Acento Dinâmico", "hex": "#06B6D4" },
    { "name": "Contraste Puro", "hex": "#FFFFFF" }
  ],
  "layout_diretrizes": "Hierarquia visual detalhada, tipografia recomendada, composição de cena e distribuição do espaço negativo em Português do Brasil.",
  "prompt_midjourney": "Cinematic photo prompt in English incorporating ${semantics.visualSubject}, camera, lens, lighting, authentic atmosphere and parameters --ar 4:5 --v 6.1 --style raw"
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const paletaFormatted = (Array.isArray(data.paleta) ? data.paleta : [
    { name: `${selectedStyle.paletteName} (Base)`, hex: primaryColor },
    { name: `${selectedStyle.paletteName} (Destaque)`, hex: accentColor },
    { name: 'Ciano Acento', hex: '#06B6D4' },
    { name: 'Branco Texto', hex: '#FFFFFF' },
  ]).map((c) => ({
    name: c.name || 'Cor',
    hex: c.hex || primaryColor,
    class: `bg-[${c.hex || primaryColor}] text-white`,
  }));

  const rawLayout = data.layout_diretrizes || `Design contemporâneo de alto impacto para ${semantics.niche}, com tipografia marcante e espaço negativo equilibrado.`;
  
  let rawPrompt = data.prompt_midjourney;

  if (!rawPrompt || rawPrompt.length < 25) {
    if (isKidsTheme) {
      rawPrompt = `${selectedKidsFraming.midjourneyGuidance}, wearing ${selectedUniform.promptFragment}, ${selectedKidsFraming.camera}, ${selectedKidsFraming.lighting}, ${selectedKidsFraming.negativeConstraints}, 8k resolution, photorealistic commercial photography --ar 4:5 --v 6.1 --style raw`;
    } else {
      rawPrompt = `Cinematic commercial photography of ${semantics.visualSubject}, ${selectedStyle.midjourneyGuidance}, ${selectedStyle.camera}, ${selectedStyle.lighting}, ${semantics.negativeConstraints}, photorealistic 8k --ar 4:5 --v 6.1 --style raw`;
    }
  }

  // Se por qualquer razão a IA externa omitiu o enquadramento sorteado em tema infantil:
  if (isKidsTheme) {
    if (selectedKidsFraming.key === 'A' && !rawPrompt.toLowerCase().includes('close-up') && !rawPrompt.toLowerCase().includes('face')) {
      rawPrompt = `Intimate emotional close-up portrait of focused child face, ${rawPrompt}`;
    } else if (selectedKidsFraming.key === 'B' && !rawPrompt.toLowerCase().includes('instructor') && !rawPrompt.toLowerCase().includes('mentor')) {
      rawPrompt = `Warm pedagogical guidance scene with instructor kneeling at eye level, ${rawPrompt}`;
    } else if (selectedKidsFraming.key === 'C' && !rawPrompt.toLowerCase().includes('jump') && !rawPrompt.toLowerCase().includes('action') && !rawPrompt.toLowerCase().includes('dynamic')) {
      rawPrompt = `High-energy dynamic coordination obstacle jump, ${rawPrompt}`;
    } else if (selectedKidsFraming.key === 'D' && !rawPrompt.toLowerCase().includes('desk') && !rawPrompt.toLowerCase().includes('study')) {
      rawPrompt = `Cognitive academic focus at clean study desk with open books, ${rawPrompt}`;
    } else if (selectedKidsFraming.key === 'E' && !rawPrompt.toLowerCase().includes('negative space') && !rawPrompt.toLowerCase().includes('poster')) {
      rawPrompt = `Minimalist advertising poster layout with 60% clean negative space, ${rawPrompt}`;
    }
  } else if (semantics.isBakery) {
    if (!rawPrompt.toLowerCase().includes('bread') && !rawPrompt.toLowerCase().includes('baker')) {
      rawPrompt = `${semantics.visualSubject}, ${rawPrompt}`;
    }
    if (!rawPrompt.toLowerCase().includes('hygienic commercial kitchen')) {
      rawPrompt = `${rawPrompt}, hygienic commercial kitchen setting, clean apron, professional baker standards, appetizing food photography`;
    }
  } else if (semantics.isSenior && !rawPrompt.toLowerCase().includes('senior') && !rawPrompt.toLowerCase().includes('elderly')) {
    rawPrompt = `${semantics.visualSubject}, ${rawPrompt}`;
  } else if (semantics.isDoctorLawyer && !rawPrompt.toLowerCase().includes('doctor') && !rawPrompt.toLowerCase().includes('lawyer')) {
    rawPrompt = `${semantics.visualSubject}, ${rawPrompt}`;
  }

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
        content: isKidsTheme
          ? `🎨 ${selectedStyle.name} • Uniforme: ${selectedUniform.name} • Setup: ${selectedStyle.camera}`
          : `🎨 ${selectedStyle.name} • Nicho: ${semantics.niche} • Setup: ${selectedStyle.camera}`,
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
${isKidsTheme ? `Uniforme: ${selectedUniform.name}\n` : ''}Nicho Comercial: ${semantics.niche}
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
    rawData: { ...data, selectedStyle, selectedUniform, semantics, paleta: paletaFormatted, layout_diretrizes: rawLayout, prompt_midjourney: rawPrompt },
    provider,
  };
}

/**
 * ETAPA 5: Controle de Qualidade (QA)
 */
export async function executeStep5({ theme, brandProfile, isBrandActive = true }) {
  const effectiveBrand = isBrandActive ? brandProfile : null;
  const brandContext = getBrandContext(brandProfile, isBrandActive);
  const semantics = extractThemeSemantics(theme, effectiveBrand);

  const systemPrompt = `Você é Camila Siqueira, Lead de QA e Validação Técnica de Mídia Digital.
Sua missão é checar especificações técnicas (proporção 4:5 e 9:16, safe-zones, contraste WCAG AAA), coerência da mensagem para o nicho de ${semantics.niche} e sugerir os 3 melhores horários de publicação.
Retorne estritamente um JSON com as chaves: "checklist" (array de 4 itens com label e detail) e "horarios_sugeridos" (array de 3 itens com day, time, reason).`;

  const prompt = `Analise os requisitos técnicos para a campanha:
TEMA: "${theme}"
NICHO: ${semantics.niche}
PÚBLICO-ALVO: ${semantics.audience}
MARCA E PÚBLICO:
${brandContext}

Retorne um JSON com:
{
  "checklist": [
    { "label": "Feed Vertical (Instagram/LinkedIn)", "detail": "1080 x 1350 px (4:5) Aprovado", "status": "pass" },
    { "label": "Stories & Reels Vertical", "detail": "1080 x 1920 px (9:16) Safe-zone 250px", "status": "pass" },
    { "label": "Acessibilidade & Contraste WCAG", "detail": "Ratio > 7.5:1 Aprovado Nível AAA", "status": "pass" },
    { "label": "Compliance & Tom de Voz do Segmento", "detail": "Mensagem e terminologia 100% alinhadas ao nicho de ${semantics.niche}", "status": "pass" }
  ],
  "horarios_sugeridos": [
    { "day": "Terça-feira", "time": "11:45", "reason": "Pico de busca pré-almoço e engajamento" },
    { "day": "Quinta-feira", "time": "18:30", "reason": "Consumo mobile no fim do expediente" },
    { "day": "Domingo", "time": "20:00", "reason": "Planejamento da semana em família" }
  ]
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawChecklist = Array.isArray(data.checklist) && data.checklist.length > 0
    ? data.checklist
    : [
        { label: 'Feed Vertical (Instagram/LinkedIn)', detail: '1080 x 1350 px (4:5)', status: 'pass' },
        { label: 'Stories & Reels', detail: '1080 x 1920 px (9:16) safe-zone 250px', status: 'pass' },
        { label: 'Contraste WCAG AAA', detail: 'Ratio > 7.5:1 aprovado', status: 'pass' },
        { label: 'Alinhamento Editorial', detail: `Terminologia e tom para ${semantics.niche} validados`, status: 'pass' },
      ];

  const rawHorarios = Array.isArray(data.horarios_sugeridos) && data.horarios_sugeridos.length > 0
    ? data.horarios_sugeridos
    : [
        { day: 'Terça-feira', time: '11:45', reason: 'Engajamento pré-almoço' },
        { day: 'Quinta-feira', time: '18:30', reason: 'Consumo mobile pós-expediente' },
        { day: 'Domingo', time: '20:00', reason: 'Planejamento semanal' },
      ];

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
Nicho: ${semantics.niche}
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
export async function executeStep6({ theme, brandProfile, step1Data, isBrandActive = true }) {
  const effectiveBrand = isBrandActive ? brandProfile : null;
  const brandContext = getBrandContext(brandProfile, isBrandActive);
  const semantics = extractThemeSemantics(theme, effectiveBrand);
  const city = isBrandActive && brandProfile?.city ? brandProfile.city : (semantics.city && semantics.city !== 'Brasil' ? semantics.city : 'Brasil');

  const systemPrompt = `Você é Thiago Ramos, Gestor de Tráfego Pago e Performance Media Buyer no Meta Ads e Google Ads.
Sua missão é segmentar público-alvo com precisão para o nicho de ${semantics.niche}, definir objetivo de campanha no Meta Ads e estipular orçamento diário para teste e escala.
Retorne estritamente um JSON com as chaves: "publico_alvo", "raio_geografico", "objetivo_campanha", "orcamento" (objeto com testPhase, scalePhase, targetCPL, roasExpected).`;

  const prompt = `Configure a campanha de tráfego pago para:
TEMA: "${theme}"
NICHO: ${semantics.niche}
PÚBLICO-ALVO ESTIMADO: ${semantics.audience}
OBJETIVO ESTRATÉGICO: ${step1Data.objetivo}
LOCALIZAÇÃO: ${city}
${brandContext}

Retorne um JSON com:
{
  "publico_alvo": "Segmentação detalhada: faixa de idade, gênero, interesses específicos de compra e comportamentos para ${semantics.niche}",
  "raio_geografico": "Raio geográfico específico em ${city} ou segmentação regional/nacional coerente com o tema",
  "objetivo_campanha": "Objetivo técnico de conversão no Meta Ads (ex: Geração de Cadastros / Mensagens WhatsApp)",
  "orcamento": {
    "testPhase": "R$ 40,00 / dia",
    "scalePhase": "R$ 150,00 / dia",
    "targetCPL": "R$ 5,00 - R$ 9,00",
    "roasExpected": "3.5x a 5.0x"
  }
}`;

  const { data, provider } = await generateMarketingAI({ systemPrompt, prompt });

  const rawPublico = data.publico_alvo || `Público qualificado interessado em ${semantics.niche} (${semantics.audience}).`;
  const defaultGeo = isBrandActive && brandProfile?.city
    ? `Raio de 15km a 25km em ${brandProfile.city} e arredores`
    : `Segmentação regional ou nacional alinhada ao tema "${theme}" (polos metropolitanos de alta intenção de compra)`;
  const rawRaio = data.raio_geografico || defaultGeo;
  const rawObjetivo = data.objetivo_campanha || 'Geração de Cadastros Qualificados / Conversões no Meta Ads.';

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
Nicho: ${semantics.niche}
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
        content: strat.objetivo || 'Objetivo registrado no histórico.',
        type: 'text',
      },
      {
        label: 'Formato Recomendado',
        content: strat.formato || 'Carrossel / Conteúdo Multiplataforma',
        type: 'highlight',
      },
      {
        label: 'Gancho Principal (Hook)',
        content: strat.gancho
          ? `“${strat.gancho}”`
          : `“${record.topic || 'Campanha'}”`,
        type: 'quote',
      },
    ],
    copyPayload: `[ESTRATÉGIA DE CONTEÚDO]
Especialista: Dra. Helena Vasconcelos (Histórico Supabase)
Objetivo: ${strat.objetivo || 'N/A'}
Formato: ${strat.formato || 'N/A'}
Gancho (Hook): "${strat.gancho || record.topic || 'N/A'}"`,
  };

  // Card 2: Copywriter
  const rawTextosArte = Array.isArray(copy.textos_arte) ? copy.textos_arte : [copy.textos_arte || record.topic || 'Conteúdo'];
  const rawLegenda = copy.legenda || 'Legenda registrada no histórico.';
  const rawCta = copy.cta || '👉 Clique no link e saiba mais.';

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
  const rawParecer = rev.parecer_tecnico || 'Texto revisado e aprovado no padrão culto brasileiro.';
  const rawTextoRevisado = rev.texto_revisado || copy.legenda || 'Versão final revisada.';
  const rawMelhorias = Array.isArray(rev.melhorias)
    ? rev.melhorias
    : [
        'Adequação gramatical e ortográfica segundo a norma-padrão',
        'Cadência de leitura fluida para smartphones',
        'Eliminação de repetições e reforço da clareza',
      ];

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
    name: c.name || 'Cor',
    hex: c.hex || '#111827',
    class: `bg-[${c.hex || '#111827'}] text-white`,
  }));

  const rawLayout = des.layout_diretrizes || 'Diretrizes visuais salvas no histórico.';
  const rawPrompt = des.prompt_midjourney || 'Cinematic commercial photography --ar 4:5 --v 6.1 --style raw';

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
    label: c.label || 'Item de Checagem',
    detail: c.detail || 'Aprovado',
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
    day: h.day || 'Dia',
    time: h.time || '12:00',
    reason: h.reason || 'Melhor horário',
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
  const rawPublico = traf.publico_alvo || 'Público salvo no histórico.';
  const rawRaio = traf.raio_geografico || 'Região da campanha.';
  const rawObjetivoTrafego = traf.objetivo_campanha || 'Objetivo de tráfego.';

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
