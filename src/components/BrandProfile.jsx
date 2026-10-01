import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  Volume2,
  Palette,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Save,
  Briefcase,
  Layers,
  Globe,
  Check,
} from 'lucide-react';

// Exemplos pré-configurados de empresas para troca rápida com 1 clique
const BRAND_PRESETS = [
  {
    name: '🥖 Padaria Artesanal',
    data: {
      brand_name: 'Padaria Artesanal Forno & Raiz',
      niche: 'Panificação de Fermentação Natural & Gastronomia',
      city: 'Curitiba',
      target_audience: 'Famílias e apreciadores de pães rústicos de fermentação natural, confeitaria fina e café de origem.',
      tone_of_voice: 'Acolhedor, artesanal, sensorial e apaixonado por gastronomia autêntica.',
      primary_color: '#78350F',
      accent_color: '#D97706',
    },
  },
  {
    name: '⚖️ Advocacia & Médicos',
    data: {
      brand_name: 'Menezes & Associados Advocacia',
      niche: 'Direito Médico & Proteção Patrimonial',
      city: 'São Paulo',
      target_audience: 'Médicos, clínicas médicas e empresários do setor de saúde que buscam conformidade e segurança jurídica.',
      tone_of_voice: 'Solene, sofisticado, resolutivo, técnico e altamente confidencial.',
      primary_color: '#0F172A',
      accent_color: '#38BDF8',
    },
  },
  {
    name: '✨ Clínica de Estética',
    data: {
      brand_name: 'Lumière Estética & Skincare',
      niche: 'Estética Facial Avançada & Rejuvenescimento',
      city: 'Rio de Janeiro',
      target_audience: 'Mulheres e homens (28 a 65 anos) exigentes que buscam procedimentos estéticos naturais e de alta tecnologia.',
      tone_of_voice: 'Elegante, acolhedor, inspirador e focado na autoestima natural.',
      primary_color: '#831843',
      accent_color: '#F472B6',
    },
  },
  {
    name: '🚗 Mecânica de Precisão',
    data: {
      brand_name: 'Precision Auto Center',
      niche: 'Mecânica e Diagnóstico Automotivo Especializado',
      city: 'Belo Horizonte',
      target_audience: 'Proprietários de veículos nacionais e importados que exigem transparência, laudo técnico e peças originais.',
      tone_of_voice: 'Técnico, transparente, direto e com forte garantia de segurança.',
      primary_color: '#1E293B',
      accent_color: '#EF4444',
    },
  },
  {
    name: '🥋 Artes Marciais',
    data: {
      brand_name: 'Kwoon Fat Lai Kung Fu',
      niche: 'Artes Marciais Tradicionais & Disciplina',
      city: 'Londrina',
      target_audience: 'Crianças, adolescentes e adultos em busca de foco, disciplina, autodefesa e equilíbrio integral.',
      tone_of_voice: 'Disciplinado, tradicional, inspirador, acolhedor e focado no respeito.',
      primary_color: '#18181B',
      accent_color: '#F59E0B',
    },
  },
];

export default function BrandProfile({
  brandProfile,
  isBrandActive,
  onToggleActive,
  onSaveBrand,
  onApplyBrandTheme,
  brandLoading,
  brandError,
  onRefreshBrand,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: '',
    niche: '',
    city: '',
    target_audience: '',
    tone_of_voice: '',
    primary_color: '#111827',
    accent_color: '#EAB308',
  });
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Open modal and pre-populate with current brand
  const handleOpenModal = () => {
    if (brandProfile) {
      setFormData({
        brand_name: brandProfile.brand_name || '',
        niche: brandProfile.niche || brandProfile.segment || '',
        city: brandProfile.city || '',
        target_audience: brandProfile.target_audience || '',
        tone_of_voice: brandProfile.tone_of_voice || '',
        primary_color: brandProfile.primary_color || '#111827',
        accent_color: brandProfile.accent_color || '#EAB308',
      });
    }
    setIsModalOpen(true);
  };

  // Quick preset click
  const handleApplyPreset = (preset) => {
    setFormData({
      ...formData,
      ...preset.data,
    });
  };

  // Submit modal form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brand_name.trim()) return;

    await onSaveBrand({
      ...(brandProfile || {}),
      ...formData,
    });

    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      setIsModalOpen(false);
    }, 900);
  };

  return (
    <>
      {/* Brand Profile Container */}
      <div className={`relative rounded-2xl border transition-all duration-300 shadow-xl backdrop-blur-xl p-4 sm:p-5 ${
        isBrandActive
          ? 'bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-amber-500/30'
          : 'bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-950 border-slate-800/80 opacity-95'
      }`}>
        <div className="flex flex-col gap-3.5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                isBrandActive
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
              }`}>
                {isBrandActive ? <Building2 className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Perfil da Marca (Multi-Empresas)
                  </span>

                  {brandLoading && (
                    <span className="flex items-center gap-1 text-[11px] text-blue-400 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Carregando...
                    </span>
                  )}

                  {/* Switch Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                      isBrandActive
                        ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                        : 'text-slate-400 bg-slate-800/70 border-slate-700/80'
                    }`}
                  >
                    {isBrandActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Perfil Ativo na Esteira
                      </>
                    ) : (
                      <>
                        <Layers className="w-3 h-3 text-blue-400" />
                        Modo Neutro Multi-Nicho
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: ON/OFF Switch + Editar Perfil + Usar Tema */}
            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              {/* ON / OFF Switch */}
              <div className="flex items-center gap-2 bg-slate-950/70 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <span className="text-xs font-medium text-slate-300">
                  Ativar Perfil:
                </span>
                <button
                  type="button"
                  onClick={() => onToggleActive(!isBrandActive)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isBrandActive ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                  title={isBrandActive ? 'Desativar perfil institucional e entrar no Modo Multi-Nicho Livre' : 'Ativar perfil institucional desta marca'}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      isBrandActive ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                    isBrandActive
                      ? 'bg-emerald-500/20 text-emerald-300 font-mono'
                      : 'bg-slate-800 text-slate-400 font-mono'
                  }`}
                >
                  {isBrandActive ? 'ON' : 'OFF'}
                </span>
              </div>

              {/* Edit / Change Brand Button */}
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-all active:scale-95 shadow-sm"
                title="Editar informações da empresa ou selecionar outro segmento comercial"
              >
                <Settings className="w-3.5 h-3.5 text-blue-400" />
                <span>⚙️ Editar Perfil / Trocar Marca</span>
              </button>

              {/* Quick Fill Button (only when brand is active) */}
              {isBrandActive && brandProfile && (
                <button
                  type="button"
                  onClick={onApplyBrandTheme}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all active:scale-95 shadow-sm"
                  title="Preencher o campo de tema com a campanha institucional desta marca"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Usar Tema da Marca</span>
                </button>
              )}
            </div>
          </div>

          {/* Body Content: Active vs Inactive State */}
          {brandLoading ? (
            <div className="animate-pulse space-y-2 py-2">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-3 bg-slate-800/60 rounded w-2/3" />
            </div>
          ) : brandError ? (
            <div className="flex items-center justify-between text-xs text-rose-400 bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Erro ao carregar dados do Supabase: {brandError}</span>
              </div>
              {onRefreshBrand && (
                <button onClick={onRefreshBrand} className="underline hover:text-rose-300 ml-2">
                  Tentar novamente
                </button>
              )}
            </div>
          ) : !isBrandActive ? (
            /* OFF STATE: Neutral / Multi-Niche Mode */
            <div className="bg-slate-950/60 rounded-xl border border-blue-900/30 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">
                    Modo Multi-Nicho Livre Ativado (Zero Amarras Institucionais)
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                    Nenhum dado fixo de empresa é enviado para a esteira de IA. Estratégia, redação, direção de arte e tráfego serão 100% inferidos a partir do tema digitado (ex: padaria, estética, medicina, advocacia, terceira idade, etc.).
                  </p>
                </div>
              </div>

              {brandProfile && (
                <div className="text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 whitespace-nowrap self-stretch sm:self-auto text-center sm:text-left">
                  Marca em standby:{' '}
                  <span className="font-medium text-slate-300">{brandProfile.brand_name}</span>
                </div>
              )}
            </div>
          ) : brandProfile ? (
            /* ON STATE: Active Brand Profile */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1 text-xs">
              {/* Brand Name, Niche & City */}
              <div className="md:col-span-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Marca & Localização
                  </span>
                  <div className="mt-1">
                    <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                      {brandProfile.brand_name}
                    </h4>
                    {brandProfile.niche && (
                      <span className="text-[11px] text-blue-400 font-medium block mt-0.5">
                        {brandProfile.niche}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 mt-2 pt-2 border-t border-slate-850">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-medium">{brandProfile.city || 'Brasil'}</span>
                </div>
              </div>

              {/* Target Audience */}
              <div className="md:col-span-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 flex flex-col">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] uppercase tracking-wider">Público-Alvo</span>
                </div>
                <p className="text-slate-300 leading-relaxed line-clamp-3">
                  {brandProfile.target_audience || 'Clientes potenciais e público qualificado'}
                </p>
              </div>

              {/* Tone of voice & Colors */}
              <div className="md:col-span-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px] uppercase tracking-wider">Tom de Voz</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed line-clamp-2">
                    {brandProfile.tone_of_voice || 'Profissional, persuasivo e acolhedor'}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 mt-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-amber-400" />
                    Cores da Marca:
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800"
                      title="Cor Primária"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-600"
                        style={{ backgroundColor: brandProfile.primary_color || '#111827' }}
                      />
                      <span className="text-[10px] font-mono text-slate-300">
                        {brandProfile.primary_color || '#111827'}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800"
                      title="Cor de Destaque"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-600"
                        style={{ backgroundColor: brandProfile.accent_color || '#EAB308' }}
                      />
                      <span className="text-[10px] font-mono text-slate-300">
                        {brandProfile.accent_color || '#EAB308'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-1">
              Nenhuma marca configurada. Clique em "⚙️ Editar Perfil" para cadastrar sua empresa.
            </p>
          )}
        </div>
      </div>

      {/* Modal: Editar Perfil / Trocar Empresa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Configurar Perfil da Marca / Trocar Empresa
                  </h3>
                  <p className="text-xs text-slate-400">
                    Altere os dados da empresa ativa ou clique em um modelo pronto para testar
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets Bar */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Troca rápida por modelos prontos (1 clique):
              </span>
              <div className="flex flex-wrap gap-2">
                {BRAND_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-blue-500/50 transition-all active:scale-95"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Brand Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Nome da Empresa / Marca *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand_name}
                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                    placeholder="Ex: Padaria Artesanal Forno & Raiz"
                    className="w-full rounded-xl bg-slate-950 border border-slate-750 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Cidade / Localização *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Curitiba"
                    className="w-full rounded-xl bg-slate-950 border border-slate-750 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Niche / Segment */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Nicho / Segmento de Atuação</label>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="Ex: Gastronomia e Panificação de Fermentação Natural"
                  className="w-full rounded-xl bg-slate-950 border border-slate-750 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Target Audience */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Público-Alvo Institucional</label>
                <textarea
                  rows={2}
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="Ex: Famílias, apreciadores de boa culinária e profissionais que buscam café e pão artesanal."
                  className="w-full rounded-xl bg-slate-950 border border-slate-750 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                />
              </div>

              {/* Tone of Voice */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Tom de Voz da Comunicação</label>
                <input
                  type="text"
                  value={formData.tone_of_voice}
                  onChange={(e) => setFormData({ ...formData, tone_of_voice: e.target.value })}
                  placeholder="Ex: Acolhedor, sensorial, apaixonado e com excelência de atendimento"
                  className="w-full rounded-xl bg-slate-950 border border-slate-750 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Brand Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Cor Primária (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1 rounded-xl bg-slate-950 border border-slate-750 p-2 text-white font-mono uppercase text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Cor de Destaque / Acento (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="flex-1 rounded-xl bg-slate-950 border border-slate-750 p-2 text-white font-mono uppercase text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 transition-all"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/30 active:scale-95"
                >
                  {saveSuccessNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      Salvo com Sucesso!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
