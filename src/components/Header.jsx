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
import BrandProfile from './BrandProfile';

export default function Header({
  theme,
  setTheme,
  onTrigger,
  isRunning,
  onCopyAll,
  copiedAll,
  brandProfile,
  isBrandActive,
  onToggleActive,
  onSaveBrand,
  brandLoading,
  brandError,
  onRefreshBrand,
  onOpenHistory,
}) {
  const handleApplyBrandTheme = () => {
    if (brandProfile) {
      setTheme(
        `Campanha Institucional - ${brandProfile.brand_name} em ${brandProfile.city}: Atendimento de excelência, diferenciais exclusivos e captação de clientes qualificados`
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

      {/* Brand Profile Component (Multi-Empresas, ON/OFF Switch & Edição Direta) */}
      <BrandProfile
        brandProfile={brandProfile}
        isBrandActive={isBrandActive}
        onToggleActive={onToggleActive}
        onSaveBrand={onSaveBrand}
        onApplyBrandTheme={handleApplyBrandTheme}
        brandLoading={brandLoading}
        brandError={brandError}
        onRefreshBrand={onRefreshBrand}
      />

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
              placeholder="Ex: Pães artesanais de fermentação natural, Consultoria jurídica para médicos, Atendimento para terceira idade, Estética facial..."
              className="w-full rounded-xl bg-slate-950/80 border border-slate-750 p-4 text-slate-100 placeholder-slate-500 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-y min-h-[90px] shadow-inner"
            />
          </div>

          {/* Quick Preset Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Sugestões rápidas:</span>
            </div>
            {isBrandActive && brandProfile && (
              <button
                type="button"
                onClick={handleApplyBrandTheme}
                className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all truncate max-w-[320px] font-medium"
                title={`Campanha Institucional: ${brandProfile.brand_name}`}
              >
                🏢 {brandProfile.brand_name} ({brandProfile.city})
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
