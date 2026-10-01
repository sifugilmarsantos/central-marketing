import React, { useState } from 'react';
import {
  Compass,
  PenTool,
  SpellCheck,
  Palette,
  ShieldCheck,
  TrendingUp,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Users,
  Target,
  DollarSign,
  Quote,
  Eye,
  Layers,
  RefreshCw,
} from 'lucide-react';

const iconMap = {
  Compass: Compass,
  PenTool: PenTool,
  SpellCheck: SpellCheck,
  Palette: Palette,
  ShieldCheck: ShieldCheck,
  TrendingUp: TrendingUp,
};

export default function SpecialistCard({
  card,
  isActive,
  isProcessing,
  onRegenerate,
  isRegenerating,
}) {
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const IconComponent = iconMap[card.iconName] || Layers;

  const handleCopyPrompt = async (promptText) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(promptText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2400);
    } catch (err) {
      console.error('Falha ao copiar prompt:', err);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(card.copyPayload);
      } else {
        // Fallback for environments without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = card.copyPayload;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div
      id={`card-${card.stepNumber}`}
      className={`relative flex flex-col rounded-2xl bg-slate-900/90 border transition-all duration-300 backdrop-blur-xl shadow-xl overflow-hidden group ${
        isActive
          ? 'border-blue-400 ring-2 ring-blue-500/30 shadow-blue-500/10'
          : 'border-slate-800 hover:border-slate-700/80 hover:shadow-2xl hover:shadow-slate-950/60'
      }`}
    >
      {/* Top Accent Gradient Line */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${card.badgeColor}`} />

      {/* Card Header */}
      <div className="p-5 pb-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Specialist Icon Badge */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.badgeColor} text-white shadow-lg shadow-black/20 flex-shrink-0 group-hover:scale-105 transition-transform`}
            >
              <IconComponent className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  Etapa 0{card.stepNumber}
                </span>
                {card.aiProvider && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      card.aiProvider.includes('Gemini')
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    ⚡ {card.aiProvider}
                  </span>
                )}
                {isProcessing && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Processando...
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {card.role}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="font-medium text-slate-200">{card.specialistName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 hidden sm:inline">{card.specialistTitle}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end flex-shrink-0">
            {/* Quick Regeneration Button for Card 02 and Card 04 */}
            {onRegenerate && (card.stepNumber === 2 || card.stepNumber === 4) && (
              <button
                type="button"
                onClick={() => onRegenerate(card.stepNumber)}
                disabled={isRegenerating || isProcessing}
                title={
                  card.stepNumber === 2
                    ? 'Reescrever nova variação de copy para esta campanha'
                    : 'Recriar nova direção de arte e prompt visual para esta campanha'
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border shadow-sm ${
                  card.stepNumber === 2
                    ? 'bg-purple-600/20 hover:bg-purple-600/35 text-purple-200 border-purple-500/40 hover:border-purple-300'
                    : 'bg-amber-600/20 hover:bg-amber-600/35 text-amber-200 border-amber-500/40 hover:border-amber-300'
                } ${
                  isRegenerating
                    ? 'opacity-60 cursor-not-allowed'
                    : 'active:scale-95'
                }`}
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    {card.stepNumber === 2
                      ? '🔄 Reescrever Variação de Copy'
                      : '🔄 Recriar Nova Direção de Arte / Prompt'}
                  </>
                )}
              </button>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copiar dados deste especialista"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
                  <span>Copiar Conteúdo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-4 text-sm">
        {card.sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              {section.label}
            </span>

            {/* Render Section based on type */}
            {section.type === 'text' && (
              <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 whitespace-pre-line">
                {section.content}
              </p>
            )}

            {section.type === 'highlight' && (
              <div className="bg-blue-950/30 border border-blue-900/40 text-blue-200 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{section.content}</span>
              </div>
            )}

            {section.type === 'quote' && (
              <div className="relative bg-slate-950/60 border-l-4 border-indigo-500 p-3.5 rounded-r-xl border-y border-r border-slate-800/70">
                <Quote className="w-4 h-4 text-indigo-400/60 mb-1" />
                <p className="text-slate-200 font-medium italic text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            )}

            {section.type === 'list' && (
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 space-y-2">
                {section.content.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-2 text-xs leading-relaxed text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'cta' && (
              <div className="bg-purple-950/30 border border-purple-800/40 text-purple-200 p-3 rounded-xl font-medium text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>{section.content}</span>
              </div>
            )}

            {section.type === 'badge-text' && (
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 text-slate-300 text-xs leading-relaxed">
                {section.content}
              </div>
            )}

            {section.type === 'corrected-text' && (
              <div className="bg-emerald-950/20 border border-emerald-800/30 p-3.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Versão Final Aprovada em Português (Brasil)</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed italic bg-slate-900/60 p-2.5 rounded-lg border border-emerald-900/30">
                  "{section.content}"
                </p>
              </div>
            )}

            {section.type === 'list-checks' && (
              <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                {section.content.map((chk, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{chk}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'color-palette' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {section.content.map((col, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center gap-1.5 text-center"
                  >
                    <div className={`w-8 h-8 rounded-lg shadow-inner ${col.class}`} />
                    <span className="text-[11px] font-semibold text-slate-200 leading-tight">
                      {col.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{col.hex}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'code' && (
              <div className="relative group/code flex flex-col gap-2.5">
                <div className="relative">
                  <div className="bg-slate-950 p-3.5 pr-24 rounded-xl border border-amber-900/30 font-mono text-xs text-amber-200/90 leading-relaxed overflow-x-auto shadow-inner">
                    {section.content}
                  </div>
                  <span className="absolute top-2 right-2 text-[10px] bg-slate-800/90 text-amber-300/80 px-2 py-0.5 rounded border border-slate-700/60 font-mono">
                    Prompt IA
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(section.content)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                        <span className="text-emerald-400">✓ Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>📋 Copiar Prompt de Imagem</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {section.type === 'checklist' && (
              <div className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                {section.content.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start justify-between gap-2 text-xs border-b border-slate-800/40 pb-1.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span className="text-slate-300 font-medium">{item.label}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex-shrink-0">
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'schedule' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {section.content.map((sched, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex flex-col gap-1 text-center"
                  >
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-rose-300">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>{sched.time}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-200">{sched.day}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{sched.reason}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'geo-tag' && (
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex items-start gap-2.5 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{section.content}</span>
              </div>
            )}

            {section.type === 'budget-metrics' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex flex-col">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">Fase de Teste</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">{section.content.testPhase}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex flex-col">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">Fase de Escala</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{section.content.scalePhase}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex flex-col">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">CPL Estimado</span>
                  <span className="text-xs font-semibold text-slate-200 font-mono">{section.content.targetCPL}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex flex-col">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">ROAS Estimado</span>
                  <span className="text-xs font-semibold text-purple-300 font-mono">{section.content.roasExpected}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Card Footer status info */}
      <div className="px-5 py-3 border-t border-slate-800/60 bg-slate-950/30 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">
            {card.aiProvider ? `Entrega Validada (${card.aiProvider})` : 'Validado pelo Especialista'}
          </span>
        </span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors text-[11px] font-medium underline underline-offset-2"
        >
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}
