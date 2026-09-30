import React from 'react';
import {
  Rocket,
  Sparkles,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  Building2,
  MapPin,
  Users,
  Volume2,
  Palette,
  CheckCircle2,
  AlertCircle,
  Zap,
  History,
} from 'lucide-react';
import { sampleThemes } from '../data/mockMarketingData';

export default function Header({
  theme,
  setTheme,
  onTrigger,
  isRunning,
  onCopyAll,
  copiedAll,
  brandProfile,
  brandLoading,
  brandError,
  onRefreshBrand,
  onOpenHistory,
}) {
  const handleApplyBrandTheme = () => {
    if (brandProfile) {
      setTheme(
        `Campanha de Matrículas Abertas - ${brandProfile.brand_name} em ${brandProfile.city}: Turmas para crianças e adolescentes (disciplina e foco) e adultos (condicionamento e defesa pessoal)`
      );
    }
  };

  return (
    <header className="w-full flex flex-col gap-6">
      {/* Top Navbar Branding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Central de Marketing
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.4 Pro
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Orquestrador Multidisciplinar: Estratégia, Copywriting, Revisão, Design, QA e Tráfego Pago
            </p>
          </div>
        </div>

        {/* Global Utilities */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={onOpenHistory}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 hover:text-amber-200 border border-slate-700 hover:border-amber-500/40 transition-all shadow-sm active:scale-95"
            title="Visualizar histórico de campanhas salvas no Supabase"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span>📋 Ver Histórico</span>
          </button>

          <button
            onClick={onCopyAll}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-all shadow-sm active:scale-95"
            title="Copiar dossiê completo de todos os 6 especialistas"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Dossiê Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar Dossiê Completo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Brand Profile Banner (Supabase Data) */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/70 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Perfil da Marca (Supabase)
                  </span>
                  {brandLoading && (
                    <span className="flex items-center gap-1 text-[11px] text-blue-400 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Carregando dados...
                    </span>
                  )}
                  {brandProfile && !brandLoading && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Sincronizado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {brandProfile && (
              <button
                type="button"
                onClick={handleApplyBrandTheme}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all self-start sm:self-auto active:scale-95"
                title="Preencher o campo de campanha com os dados desta marca"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Usar Tema da Marca</span>
              </button>
            )}
          </div>

          {/* Brand Info Display */}
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
                <button
                  onClick={onRefreshBrand}
                  className="underline hover:text-rose-300 ml-2"
                >
                  Tentar novamente
                </button>
              )}
            </div>
          ) : brandProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1 text-xs">
              {/* Brand Name & City */}
              <div className="md:col-span-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Marca & Localização
                </span>
                <div className="mt-1">
                  <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                    {brandProfile.brand_name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-slate-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-medium">{brandProfile.city}</span>
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div className="md:col-span-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 flex flex-col">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] uppercase tracking-wider">Público-Alvo</span>
                </div>
                <p className="text-slate-300 leading-relaxed line-clamp-3">
                  {brandProfile.target_audience}
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
                    {brandProfile.tone_of_voice}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 mt-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-amber-400" />
                    Cores Institucionais:
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800"
                      title="Cor Primária"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-600"
                        style={{ backgroundColor: brandProfile.primary_color }}
                      />
                      <span className="text-[10px] font-mono text-slate-300">
                        {brandProfile.primary_color}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800"
                      title="Cor de Destaque"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-600"
                        style={{ backgroundColor: brandProfile.accent_color }}
                      />
                      <span className="text-[10px] font-mono text-slate-300">
                        {brandProfile.accent_color}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Nenhum perfil de marca encontrado no Supabase.</p>
          )}
        </div>
      </div>

      {/* Command Center Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 sm:p-6 border border-slate-800 shadow-2xl backdrop-blur-xl">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="campaign-theme"
              className="text-sm font-semibold text-slate-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Tema da Campanha ou Postagem</span>
              <span className="text-xs font-normal text-slate-400">
                (Descreva a ideia, objetivo ou produto)
              </span>
            </label>

            <span className="text-xs text-slate-400 font-mono">
              {theme.length} caracteres digitados
            </span>
          </div>

          {/* Wide Textarea */}
          <div className="relative group">
            <textarea
              id="campaign-theme"
              rows={3}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: Lançamento de uma nova campanha para artes marciais..."
              className="w-full rounded-xl bg-slate-950/80 border border-slate-750 p-4 text-slate-100 placeholder-slate-500 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-y min-h-[90px] shadow-inner"
            />
          </div>

          {/* Quick Preset Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Sugestões rápidas:</span>
            </div>
            {brandProfile && (
              <button
                type="button"
                onClick={handleApplyBrandTheme}
                className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all truncate max-w-[320px] font-medium"
                title="Campanha de Matrículas Fat Lai"
              >
                🥋 Matrículas: {brandProfile.brand_name} ({brandProfile.city})
              </button>
            )}
            {sampleThemes.map((preset, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => setTheme(preset)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 transition-all truncate max-w-[280px]"
                title={preset}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>6 agentes de marketing prontos para processar a esteira sequencial</span>
            </div>

            {/* Prominent Button: 🚀 Acionar Equipe de Marketing */}
            <button
              onClick={onTrigger}
              disabled={isRunning || !theme.trim()}
              type="button"
              className={`relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-300 shadow-xl overflow-hidden ${
                isRunning
                  ? 'bg-blue-800/60 text-blue-200 cursor-not-allowed border border-blue-600/40'
                  : !theme.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-400 text-white shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.99] border border-blue-400/30'
              }`}
            >
              {/* Shimmer animation */}
              {!isRunning && theme.trim() && (
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
              )}

              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-300" />
                  <span>Orquestrando Equipe...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🚀</span>
                  <span>Acionar Equipe de Marketing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
