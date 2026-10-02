/**
 * Extração Semântica Agnóstica e Multi-Nicho do Tema da Campanha
 * Identifica o nicho comercial, público-alvo, dores, soluções e entidades visuais para Midjourney/Flux.
 */
export function extractThemeSemantics(theme = '', brandProfile = null) {
  const cleanTheme = (theme || '').trim();
  const lower = cleanTheme.toLowerCase();
  const targetAudienceBrand = brandProfile?.target_audience || '';
  const city = brandProfile?.city || 'Brasil';

  // 1. Detecção Semântica de Faixa Etária e Públicos Específicos
  const isSenior = /(idos[oa]s?|terceira\s+idade|melhor\s+idade|60\+|senior|seniors|geriatri)/i.test(lower);
  const isKids = /(crian[çc]as?|infantil|kids?|filhos?|escolar|pediatr|mirim)/i.test(lower);
  const isDoctorLawyer = /(m[ée]dic[oa]s?|doutor(a)?|advogad[oa]s?|jur[íi]dic|direito|advocacia|cl[íi]nica\s+m[ée]dica)/i.test(lower);
  const isBakery = /(padaria|panifica[çc][ãa]o|p[ãa]o|p[ãa]es|sourdough|confeitaria|fermenta[çc][ãa]o\s+natural|forno|bistr[ôo]|cafeteria)/i.test(lower);
  const isAesthetics = /(est[ée]tica|skincare|harmoniza[çc][ãa]o|beleza|spa|rejuvenescimento|dermatolog)/i.test(lower);
  const isMechanic = /(mec[âa]nic[ao]|oficina|automot|auto|ve[íi]cul|carros?|motor|revis[ãa]o)/i.test(lower);
  const isConstruction = /(constru[çc][ãa]o|engenharia|reforma|obras?|arquitet|imobili[áa]ri|im[óo]ve(is|l))/i.test(lower);
  const isMartialArts = /(kung\s*fu|artes?\s+marcia(l|is)|karat[ée]|jud[ôo]|jiu\s*jitsu|luta|muay\s*thai|boxe|capoeira|taekwondo)/i.test(lower);

  let niche = 'Serviços & Negócios';
  let audience = targetAudienceBrand || 'Clientes qualificados e consumidores do segmento';
  let painPoint = 'dificuldade em encontrar produtos e serviços de excelência com atendimento ágil e confiável';
  let solution = 'experiência superior, produtos e serviços de alto padrão e atendimento personalizado';
  let visualSubject = `professional specialists and satisfied clients engaged in authentic, dynamic activity representing ${cleanTheme || 'modern business excellence'}, natural expressions, contemporary setting`;
  let negativeConstraints = 'no distorted anatomy, no cartoonish artifacts, no plastic skin, no blurry details';

  if (isMartialArts && isKids) {
    niche = 'Kung Fu Infantil & Desenvolvimento Integral';
    audience = 'Mães e pais focados em foco escolar, respeito mútuo, disciplina e autoconfiança dos filhos';
    painPoint = 'tempo excessivo diante de telas, falta de concentração escolar, desmotivação e timidez';
    solution = 'treino marcial tradicional infantil que desenvolve postura, foco inabalável e respeito mútuo no tatame';
    visualSubject = 'authentic Brazilian children (aged 6 to 10 years old) in martial arts discipline, varied framings and attire';
    negativeConstraints = 'no distorted anatomy, no cartoonish artifacts, no plastic skin, no blurry details';
  } else if (isSenior) {
    niche = 'Saúde & Bem-Estar para Terceira Idade';
    audience = 'Homens e mulheres da terceira idade (60 a 75 anos) e familiares que priorizam longevidade e autonomia';
    painPoint = 'perda de vitalidade, dores articulares, sedentarismo e receio de perder a independência diária';
    solution = 'vitalidade renovada, fortalecimento com segurança, acolhimento e bem-estar integral na melhor idade';
    visualSubject = 'healthy senior practitioners / elderly people (aged 60-75) with radiant vitality, active movement, natural silver hair and warm confident smiles';
    negativeConstraints = 'no young children, no teenagers, focus exclusively on active vibrant seniors, no hospital beds';
  } else if (isDoctorLawyer) {
    niche = 'Serviços Profissionais & Executivos (Médicos / Advogados)';
    audience = 'Médicos, advogados, empresários e profissionais liberais que buscam alta performance, segurança jurídica ou alívio do estresse';
    painPoint = 'rotinas exaustivas, sobrecarga mental, insegurança regulatória e escassez de tempo para autocuidado';
    solution = 'assessoria especializada, soluções resolutivas de alto impacto, tranquilidade e equilíbrio de vida';
    visualSubject = 'professional doctor or lawyer in executive or functional setting, stress-relief and focused confidence, sophisticated contemporary attire';
    negativeConstraints = 'no disheveled appearance, no chaotic backgrounds, no cartoonish elements';
  } else if (isKids) {
    niche = 'Desenvolvimento Infantil & Atividades Educacionais';
    audience = 'Mães, pais e responsáveis comprometidos com o desenvolvimento cognitivo, motor e comportamental dos filhos';
    painPoint = 'tempo excessivo diante de telas, falta de concentração escolar, desmotivação e timidez';
    solution = 'metodologia dinâmica e acolhedora que desenvolve foco, autoconfiança, disciplina e respeito mútuo';
    visualSubject = 'young children (aged 6-10) with joyful, focused and authentic expressions engaged in enriching learning and dynamic activity';
    negativeConstraints = 'no adults, no bodybuilders, no teenage athletes, focus exclusively on young children';
  } else if (isBakery) {
    niche = 'Gastronomia Artesanal & Panificação';
    audience = 'Famílias, apreciadores de gastronomia artesanal e consumidores que buscam sabor autêntico e produtos frescos';
    painPoint = 'produtos ultraprocessados industriais, pães sem sabor ou crocância e falta de opções verdadeiramente artesanais';
    solution = 'pães de fermentação natural fresca, casca crocante dourada, miolo alveolado macio e ingredientes selecionados com amor';
    visualSubject = 'artisan baker in clean professional apron, fresh sourdough bread with golden crispy crust and open crumb, rustic bakery oven, hygienic commercial kitchen setting, clean apron, professional baker standards, appetizing food photography, warm natural morning light';
    negativeConstraints = 'no unhygienic conditions, no dirty surfaces, no factory machinery, no industrial packaging, no artificial plastic look';
  } else if (isAesthetics) {
    niche = 'Estética Avançada, Beleza & Bem-Estar';
    audience = 'Mulheres e homens exigentes que valorizam rejuvenescimento natural, autocuidado e sofisticação';
    painPoint = 'insegurança com a imagem, sinais visíveis de cansaço na pele e medo de procedimentos invasivos';
    solution = 'protocolos personalizados de alta tecnologia, resultados elegantes e recuperação imediata da autoestima';
    visualSubject = 'skilled aesthetician providing treatment to radiant client in serene luxury clinical spa, natural luminous glowing skin, minimalist serenity';
    negativeConstraints = 'no exaggerated unnatural surgery, no redness or distress, no cluttered environment';
  } else if (isMechanic) {
    niche = 'Serviços Automotivos & Mecânica de Precisão';
    audience = 'Motoristas e proprietários de veículos que exigem transparência, peças originais e segurança mecânica';
    painPoint = 'orçamentos opacos, surpresas na conta, peças de procedência duvidosa e atrasos na entrega';
    solution = 'diagnóstico computadorizado transparente, laudo técnico detalhado, garantia estendida e pontualidade';
    visualSubject = 'master automotive technician working in clean high-tech modern automotive workshop, precision diagnostic tools, polished engine bay';
    negativeConstraints = 'no messy dark grease, no chaotic clutter, no unsafe practices';
  } else if (isConstruction) {
    niche = 'Construção Civil, Arquitetura & Reformas';
    audience = 'Proprietários de imóveis, investidores e famílias realizando o sonho da construção ou reforma';
    painPoint = 'obras atrasadas, desperdício de materiais, orçamentos estourados e falta de gestão de equipe';
    solution = 'cronograma rigoroso, equipe especializada, acompanhamento digital e acabamento de alto padrão';
    visualSubject = 'lead architect or civil engineer reviewing architectural blueprints on contemporary modern building project, structural elegance';
    negativeConstraints = 'no dilapidated ruins, no unsafe workers, no blurry blueprints';
  } else if (isMartialArts) {
    niche = 'Artes Marciais, Condicionamento & Defesa Pessoal';
    audience = 'Praticantes de todas as idades que buscam autodefesa inteligente, disciplina mental e condicionamento físico';
    painPoint = 'estresse do dia a dia, vulnerabilidade física, sedentarismo e falta de autocontrole';
    solution = 'técnicas marciais autênticas, evolução gradual por mérito, saúde integral e ambiente respeitoso';
    visualSubject = 'dedicated martial arts practitioners in clean contemporary training hall (Kwoon), focused kinetic motion, authentic traditional Kung Fu uniforms, intense discipline and focus';
    negativeConstraints = 'no chaotic bar brawls, no blood or gore, no casual clothes, no fake hollywood caricatures';
  }

  return {
    theme: cleanTheme,
    niche,
    audience,
    painPoint,
    solution,
    visualSubject,
    negativeConstraints,
    city,
    isSenior,
    isKids,
    isDoctorLawyer,
    isBakery,
    isAesthetics,
    isMechanic,
    isConstruction,
    isMartialArts,
  };
}
