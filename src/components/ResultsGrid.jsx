import React from 'react';
import SpecialistCard from './SpecialistCard';
import { Layers, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ResultsGrid({ cards, currentStep, isRunning }) {
  return (
    <section className="w-full flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Painel de Resultados dos Especialistas
            </h2>
            <p className="text-xs text-slate-400">
              Grade multidisciplinar sincronizada com dados validados para veiculação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            6 Especialistas Ativos
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            100% Revisado
          </span>
        </div>
      </div>

      {/* 6 Cards Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isActive = currentStep === card.stepNumber;
          const isProcessing = isRunning && currentStep === card.stepNumber;

          return (
            <SpecialistCard
              key={card.id}
              card={card}
              isActive={isActive}
              isProcessing={isProcessing}
            />
          );
        })}
      </div>
    </section>
  );
}
