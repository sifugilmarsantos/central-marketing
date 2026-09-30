export const initialCampaignData = {
  theme: "Lançamento da plataforma Central de Marketing com IA para agências e PMEs",
  createdAt: "2026-09-29T09:45:00Z",
  status: "completed",
  pipelineSteps: [
    { id: 1, name: "Estratégia", role: "Estrategista de Conteúdo", status: "completed" },
    { id: 2, name: "Redação", role: "Copywriter", status: "completed" },
    { id: 3, name: "Revisão", role: "Revisor Textual", status: "completed" },
    { id: 4, name: "Design", role: "Diretor de Arte", status: "completed" },
    { id: 5, name: "QA", role: "Controle de Qualidade", status: "completed" },
    { id: 6, name: "Tráfego Pago", role: "Gestor de Tráfego", status: "completed" },
  ],
  cards: [
    {
      id: "card-1",
      stepNumber: 1,
      role: "Estrategista de Conteúdo",
      specialistName: "Dra. Helena Vasconcelos",
      specialistTitle: "Head de Estratégia & Posicionamento",
      specialistAvatar: "HV",
      badgeColor: "from-blue-500 to-indigo-600",
      accentBorder: "border-blue-500/40 hover:border-blue-400",
      iconName: "Compass",
      sections: [
        {
          label: "Objetivo Principal",
          content: "Posicionar a marca como referência em agilidade e inovação para marketing orientado a IA, gerando mais de 450 leads qualificados B2B (diretores e gestores) na primeira semana de lançamento.",
          type: "text",
        },
        {
          label: "Formato Recomendado",
          content: "Carrossel Dinâmico de 6 lâminas (1080x1350 - proporção 4:5 vertical) + Reel vertical de 45s com storytelling de dor e virada de chave.",
          type: "highlight",
        },
        {
          label: "Gancho Principal (Hook)",
          content: "“92% das empresas perdem até 4 horas diárias coordenando tarefas manuais que nossa central unificada resolve em 3 minutos. O seu time ainda trabalha como em 2018?”",
          type: "quote",
        },
      ],
      copyPayload: `[ESTRATÉGIA DE CONTEÚDO]
Especialista: Dra. Helena Vasconcelos
Objetivo: Posicionar a marca como referência em agilidade e inovação para marketing orientado a IA, gerando mais de 450 leads qualificados B2B na primeira semana.
Formato: Carrossel Dinâmico de 6 lâminas (1080x1350 - 4:5) + Reel de 45s.
Gancho (Hook): "92% das empresas perdem até 4 horas diárias coordenando tarefas manuais que nossa central unificada resolve em 3 minutos. O seu time ainda trabalha como em 2018?"`,
    },
    {
      id: "card-2",
      stepNumber: 2,
      role: "Copywriter",
      specialistName: "Lucas Menezes",
      specialistTitle: "Senior Direct-Response Copywriter",
      specialistAvatar: "LM",
      badgeColor: "from-purple-500 to-violet-600",
      accentBorder: "border-purple-500/40 hover:border-purple-400",
      iconName: "PenTool",
      sections: [
        {
          label: "Textos da Arte (Estrutura dos Criativos)",
          content: [
            "Lâmina 1 (Capa): Pare de gerenciar 7 ferramentas para postar 1 campanha.",
            "Lâmina 2: O problema não é falta de criatividade, é fricção operacional.",
            "Lâmina 3: Da ideia ao anúncio configurado em menos de 10 minutos.",
            "Lâmina 4: 6 especialistas síncronos trabalhando no seu projeto.",
            "Lâmina 5: Veja os números: +320% de produtividade e CPL reduzido.",
          ],
          type: "list",
        },
        {
          label: "Legenda Completa para Redes Sociais",
          content: "Se a sua equipe gasta mais tempo alinhando briefings e cobrando revisões do que gerando receita real, algo está errado.\n\nA Central de Marketing une inteligência artificial e os 6 pilares essenciais do marketing moderno numa esteira sequencial que não trava.\n\nVocê define a ideia central, e o sistema entrega: estratégia, textos validados, revisão ortográfica, direção visual, checklist técnico e segmentação de tráfego com orçamento otimizado.\n\nChega de ruído. É hora de escalar a sua comunicação com padrão de agência global.",
          type: "text",
        },
        {
          label: "Chamada para Ação (CTA)",
          content: "👉 Clique no botão abaixo e desbloqueie sua demonstração exclusiva com bônus de ativação imediata.",
          type: "cta",
        },
      ],
      copyPayload: `[COPYWRITING]
Especialista: Lucas Menezes
Textos da Arte:
- Lâmina 1: Pare de gerenciar 7 ferramentas para postar 1 campanha.
- Lâmina 2: O problema não é falta de criatividade, é fricção operacional.
- Lâmina 3: Da ideia ao anúncio configurado em menos de 10 minutos.
- Lâmina 4: 6 especialistas síncronos trabalhando no seu projeto.
- Lâmina 5: Veja os números: +320% de produtividade e CPL reduzido.

Legenda:
Se a sua equipe gasta mais tempo alinhando briefings e cobrando revisões do que gerando receita real, algo está errado. A Central de Marketing une inteligência artificial e os 6 pilares essenciais do marketing moderno numa esteira sequencial que não trava. Você define a ideia central, e o sistema entrega: estratégia, textos validados, revisão ortográfica, direção visual, checklist técnico e segmentação de tráfego com orçamento otimizado.

CTA: 👉 Clique no botão abaixo e desbloqueie sua demonstração exclusiva com bônus de ativação imediata.`,
    },
    {
      id: "card-3",
      stepNumber: 3,
      role: "Revisor Textual",
      specialistName: "Profª. Beatriz Alencar",
      specialistTitle: "Consultora Linguística & Revisora PT-BR",
      specialistAvatar: "BA",
      badgeColor: "from-emerald-500 to-teal-600",
      accentBorder: "border-emerald-500/40 hover:border-emerald-400",
      iconName: "SpellCheck",
      sections: [
        {
          label: "Parecer Linguístico & Padronização",
          content: "Texto adaptado ao padrão culto brasileiro contemporâneo (Novo Acordo Ortográfico). Eliminadas construções passivas e repetições fônicas. Cadência rítmica aprimorada para leitura mobile fluida.",
          type: "badge-text",
        },
        {
          label: "Texto Final Corrigido e Revisado (PT-BR)",
          content: "Se a sua equipe dedica mais tempo ao alinhamento de tarefas do que à geração de resultados comerciais, seu processo necessita de modernização. A Central de Marketing integra tecnologia preditiva às etapas cruciais de divulgação: da concepção estratégica ao tráfego direcionado, tudo organizado de forma ágil, consistente e profissional.",
          type: "corrected-text",
        },
        {
          label: "Destaques das Melhorias Aplicadas",
          content: [
            "Substituição de gírias e jargões dispersos por termos persuasivos claros.",
            "Pontuação ritmada para melhorar a retenção visual nos primeiros 3 segundos.",
            "Concordância verbal e nominal 100% harmonizada com as diretrizes da marca.",
          ],
          type: "list-checks",
        },
      ],
      copyPayload: `[REVISÃO TEXTUAL PT-BR]
Especialista: Profª. Beatriz Alencar
Status: Aprovado segundo o Novo Acordo Ortográfico
Texto Final Revisado:
"Se a sua equipe dedica mais tempo ao alinhamento de tarefas do que à geração de resultados comerciais, seu processo necessita de modernização. A Central de Marketing integra tecnologia preditiva às etapas cruciais de divulgação: da concepção estratégica ao tráfego direcionado, tudo organizado de forma ágil, consistente e profissional."
Observações: Cadência otimizada para leitura mobile sem ambiguidades.`,
    },
    {
      id: "card-4",
      stepNumber: 4,
      role: "Diretor de Arte",
      specialistName: "Rodrigo Fontes",
      specialistTitle: "Lead Art Director & Visual AI Specialist",
      specialistAvatar: "RF",
      badgeColor: "from-amber-500 to-orange-600",
      accentBorder: "border-amber-500/40 hover:border-amber-400",
      iconName: "Palette",
      sections: [
        {
          label: "Guia Cromático (Paleta de Cores)",
          content: [
            { name: "Navy Escuro (Base)", hex: "#0B1120", class: "bg-[#0B1120] text-white border border-slate-700" },
            { name: "Azul Elétrico (Foco)", hex: "#2563EB", class: "bg-[#2563EB] text-white" },
            { name: "Ciano Neon (Acento)", hex: "#06B6D4", class: "bg-[#06B6D4] text-slate-900" },
            { name: "Branco Puro (Texto)", hex: "#FFFFFF", class: "bg-white text-slate-900 border border-slate-300" },
          ],
          type: "color-palette",
        },
        {
          label: "Layout & Hierarquia Visual",
          content: "Layout dark-mode tecnológico com estética cyberpunk limpa. Tipografia Sans-Serif 'Inter/Plus Jakarta' em ultra-bold para títulos e regular para apoio. Textura com grid pontilhado sutil ao fundo e degradê radial suave azulado nos pontos de leitura prioritários.",
          type: "text",
        },
        {
          label: "Prompt em Inglês para IA de Imagem (Midjourney / Flux / DALL-E)",
          content: "Ultra-modern marketing command center interface floating in a sleek dark glass boardroom, glowing neon cyan and electric blue holographic campaign charts, high-end commercial tech photography, depth of field, dramatic cinematic lighting, clean composition, minimalist futuristic aesthetic, 8k resolution, photorealistic, Unreal Engine 5 octane render --ar 4:5 --v 6.1 --style raw",
          type: "code",
        },
      ],
      copyPayload: `[DIREÇÃO DE ARTE]
Especialista: Rodrigo Fontes
Cores:
- Navy Base: #0B1120
- Azul Elétrico: #2563EB
- Ciano Neon: #06B6D4
- Branco Puro: #FFFFFF
Layout: Dark tech minimalista, grid pontilhado, tipografia sans-serif bold de alto impacto.
Prompt para IA de Imagem:
Ultra-modern marketing command center interface floating in a sleek dark glass boardroom, glowing neon cyan and electric blue holographic campaign charts, high-end commercial tech photography, depth of field, dramatic cinematic lighting, clean composition, minimalist futuristic aesthetic, 8k resolution, photorealistic, Unreal Engine 5 octane render --ar 4:5 --v 6.1 --style raw`,
    },
    {
      id: "card-5",
      stepNumber: 5,
      role: "Controle de Qualidade",
      specialistName: "Camila Siqueira",
      specialistTitle: "QA & Compliance Lead",
      specialistAvatar: "CS",
      badgeColor: "from-rose-500 to-pink-600",
      accentBorder: "border-rose-500/40 hover:border-rose-400",
      iconName: "ShieldCheck",
      sections: [
        {
          label: "Checklist de Proporção & Boas Práticas",
          content: [
            { label: "Feed Vertical (Instagram / LinkedIn)", detail: "1080 x 1350 px (4:5)", status: "pass" },
            { label: "Stories & Reels", detail: "1080 x 1920 px (9:16) com safe-zone de 250px", status: "pass" },
            { label: "Contraste Acessibilidade (WCAG 2.1)", detail: "Ratio 8.4:1 (Aprovado Nível AAA)", status: "pass" },
            { label: "Taxa de Texto em Imagens Meta Ads", detail: "Menos de 18% da área visual (Ótima entrega)", status: "pass" },
          ],
          type: "checklist",
        },
        {
          label: "Horários Sugeridos para Postagem",
          content: [
            { day: "Terça-feira", time: "11:45", reason: "Pico de abertura corporativa e intervalo pré-almoço" },
            { day: "Quinta-feira", time: "18:20", reason: "Horário nobre de consumo mobile no trânsito/fim do expediente" },
            { day: "Domingo", time: "20:30", reason: "Planejamento semanal de executivos e donos de empresas" },
          ],
          type: "schedule",
        },
      ],
      copyPayload: `[CONTROLE DE QUALIDADE - QA]
Especialista: Camila Siqueira
Checklist Técnico:
- Feed Vertical: 1080 x 1350 px (4:5) [OK]
- Stories / Reels: 1080 x 1920 px (9:16) [OK]
- Safe-zones de 250px respeitadas: [OK]
- Contraste WCAG: 8.4:1 AAA [OK]
- Limite de texto em arte: < 18% [OK]

Horários Recomendados:
1. Terça-feira às 11:45 (Intervalo pré-almoço B2B)
2. Quinta-feira às 18:20 (Fim de expediente mobile)
3. Domingo às 20:30 (Planejamento semanal executivo)`,
    },
    {
      id: "card-6",
      stepNumber: 6,
      role: "Gestor de Tráfego Pago",
      specialistName: "Thiago Ramos",
      specialistTitle: "Performance Marketing & Media Buyer",
      specialistAvatar: "TR",
      badgeColor: "from-cyan-500 to-blue-600",
      accentBorder: "border-cyan-500/40 hover:border-cyan-400",
      iconName: "TrendingUp",
      sections: [
        {
          label: "Público-Alvo Segmentado",
          content: "Homens e Mulheres de 26 a 55 anos. Interesses: Empreendedorismo, Startups, Automação de Processos, Marketing Digital, Gestão Empresarial e Software SaaS. Cargos: Fundadores, Sócios, Diretores de Operações, CMOs e Gerentes de Marketing.",
          type: "text",
        },
        {
          label: "Raio Geográfico & Posicionamentos",
          content: "Brasil com priorização por capitais e centros metropolitanos (São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba, Porto Alegre, Brasília, Florianópolis e Recife). Posicionamentos prioritários: Instagram Reels, Instagram Feed e Feed de Notícias Mobile.",
          type: "geo-tag",
        },
        {
          label: "Objetivo de Campanha",
          content: "Conversões / Geração de Cadastros Qualificados (Meta Pixel evento 'Lead' com formulário instantâneo de alta intenção e webhook direto para CRM).",
          type: "badge-text",
        },
        {
          label: "Orçamento Diário Mínimo Sugerido",
          content: {
            testPhase: "R$ 65,00 / dia",
            scalePhase: "R$ 220,00 / dia",
            targetCPL: "R$ 6,50 - R$ 9,80",
            roasExpected: "3.8x a 5.2x",
          },
          type: "budget-metrics",
        },
      ],
      copyPayload: `[TRÁFEGO PAGO]
Especialista: Thiago Ramos
Público: 26 a 55 anos, Empreendedores, CMOs, Gestores de Marketing, Sócios de PMEs.
Raio Geográfico: Principais capitais do Brasil (SP, RJ, BH, CWB, POA, BSB, FLN, REC).
Objetivo: Geração de Cadastros Qualificados (Leads para CRM).
Orçamento Mínimo Diário:
- Fase de Teste / Aprendizado: R$ 65,00 / dia
- Fase de Escala: R$ 220,00 / dia
- CPL Meta: R$ 6,50 - R$ 9,80
- ROAS Esperado: 3.8x a 5.2x`,
    },
  ],
};

export const sampleThemes = [
  "Lançamento da plataforma Central de Marketing com IA para agências e PMEs",
  "Campanha de Black Friday com oferta antecipada e 40% de desconto em planos anuais",
  "Captação de clientes de alto padrão para consultoria de transformação digital",
  "Semana do Empreendedor: Workshop online gratuito sobre automação de vendas",
];
