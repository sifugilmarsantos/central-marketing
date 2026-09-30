import React from 'react';
import {
  Compass,
  PenTool,
  SpellCheck,
  Palette,
  ShieldCheck,
  TrendingUp,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const steps = [
  { id: 1, number: '1', title: 'Estratégia', role: 'Estrategista', icon: Compass, color: 'blue' },
  { id: 2, number: '2', title: 'Redação', role: 'Copywriter', icon: PenTool, color: 'purple' },
  { id: 3, number: '3', title: 'Revisão', role: 'Revisor PT-BR', icon: SpellCheck, color: 'emerald' },
  { id: 4, number: '4', title: 'Design', role: 'Diretor de Arte', icon: Palette, color: 'amber' },
  { id: 5, number: '5', title: 'QA', role: 'Controle de Qualidade', icon: ShieldCheck, color: 'rose' },
  { id: 6, number: '6', title: 'Tráfego Pago', role: 'Gestor de Tráfego', icon: TrendingUp, color: 'cyan' },
];

export default function PipelineBar({ currentStep, isRunning, onStepClick }) {
  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Esteira de Produção Sequencial
            </span>
            {isRunning && (
              <span className="text-xs font-semibold text-amber-400 animate-pulse flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Executando Etapa {currentStep} de 6...
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Fluxo da Equipe de Especialistas
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            Concluído
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-sm shadow-blue-500/50" />
            Em Andamento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            Próximo
          </span>
        </div>
      </div>

      {/* Steps Horizontal Track */}
      <div className="overflow-x-auto pb-2 -mb-2">
        <div className="min-w-[720px] flex items-center justify-between relative px-2">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-6 h-0.5 bg-slate-800 -z-0" />

          {/* Active progress fill line */}
          <div
            className="absolute left-6 top-6 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 -z-0 transition-all duration-500"
            style={{
              width: isRunning
                ? `${((Math.max(currentStep - 1, 0)) / (steps.length - 1)) * 100}%`
                : '100%',
            }}
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = !isRunning || currentStep > step.id;
            const isCurrent = isRunning && currentStep === step.id;
            const isPending = isRunning && currentStep < step.id;

            return (
              <button
                key={step.id}
                onClick={() => onStepClick && onStepClick(step.id)}
                type="button"
                className="group relative z-10 flex flex-col items-center focus:outline-none transition-transform hover:-translate-y-0.5 text-center"
              >
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 font-bold text-sm shadow-lg ${
                    isCompleted
                      ? 'bg-slate-900 border-2 border-emerald-500 text-emerald-400 shadow-emerald-500/20 group-hover:scale-110'
                      : isCurrent
                      ? 'bg-blue-600 border-2 border-blue-400 text-white ring-4 ring-blue-500/30 scale-110 animate-bounce'
                      : 'bg-slate-900 border-2 border-slate-700 text-slate-400 group-hover:border-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Details */}
                <div className="mt-2.5 flex flex-col items-center">
                  <span
                    className={`text-xs font-bold transition-colors ${
                      isCompleted
                        ? 'text-emerald-300'
                        : isCurrent
                        ? 'text-blue-400 font-extrabold'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    ({step.number}) {step.title}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {step.role}
                  </span>
                </div>

                {/* Pulse indicator for current */}
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
