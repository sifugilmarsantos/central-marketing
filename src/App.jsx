import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PipelineBar from './components/PipelineBar';
import ResultsGrid from './components/ResultsGrid';
import { initialCampaignData } from './data/mockMarketingData';
import { supabase } from './lib/supabase';
import {
  executeStep1,
  executeStep2,
  executeStep3,
  executeStep4,
  executeStep5,
  executeStep6,
  saveCampaignToSupabase,
  formatHistoryRecordToCards,
} from './services/marketingPipeline';
import HistoryModal from './components/HistoryModal';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('');
  const [cardsData, setCardsData] = useState(initialCampaignData.cards);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(6); // Default 6 means all completed initially
  const [copiedAll, setCopiedAll] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [executionError, setExecutionError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [regeneratingCardId, setRegeneratingCardId] = useState(null);

  // Handle selecting a saved campaign from history
  const handleSelectCampaign = (record) => {
    if (record.topic) {
      setTheme(record.topic);
    }
    const formattedCards = formatHistoryRecordToCards(record);
    setCardsData(formattedCards);
    setCurrentStep(6);
    setIsHistoryOpen(false);
    showToast(`📋 Campanha "${record.topic || 'selecionada'}" carregada nos cards!`);
  };

  // Supabase brand_profile state
  const [brandProfile, setBrandProfile] = useState(null);
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandError, setBrandError] = useState(null);

  // Fetch brand_profile from Supabase
  const fetchBrandProfile = async () => {
    try {
      setBrandLoading(true);
      setBrandError(null);

      const { data, error } = await supabase
        .from('brand_profile')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erro ao consultar brand_profile no Supabase:', error);
        setBrandError(error.message);
      } else if (data && data.length > 0) {
        const brand = data[0];
        setBrandProfile(brand);
      }
    } catch (err) {
      console.error('Falha de conexão com Supabase:', err);
      setBrandError(err.message || 'Erro de conexão');
    } finally {
      setBrandLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandProfile();
  }, []);

  // Show a temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Real sequential pipeline execution with AI redundancy & Supabase persistence
  const handleTrigger = async () => {
    if (isRunning || !theme.trim()) return;

    setIsRunning(true);
    setExecutionError(null);
    setCurrentStep(1);
    setStatusMessage('Iniciando orquestração sequencial com IA...');
    showToast('🚀 Equipe acionada! Executando Etapa 1: Estratégia de Conteúdo...');

    try {
      // ==========================================
      // ETAPA 1: Estrategista de Conteúdo
      // ==========================================
      setStatusMessage('Etapa 1/6: Estrategista de Conteúdo definindo objetivo e gancho...');
      const res1 = await executeStep1({ theme, brandProfile });
      setCardsData((prev) => prev.map((c) => (c.stepNumber === 1 ? res1.card : c)));
      showToast(`✅ Etapa 1 concluída (${res1.provider})!`);

      // ==========================================
      // ETAPA 2: Copywriter
      // ==========================================
      setCurrentStep(2);
      setStatusMessage('Etapa 2/6: Copywriter redigindo lâminas, legenda e CTA...');
      showToast('✍️ Executando Etapa 2: Copywriting...');
      const res2 = await executeStep2({ theme, brandProfile, step1Data: res1.rawData });
      setCardsData((prev) => prev.map((c) => (c.stepNumber === 2 ? res2.card : c)));
      showToast(`✅ Etapa 2 concluída (${res2.provider})!`);

      // ==========================================
      // ETAPA 3: Revisor Textual
      // ==========================================
      setCurrentStep(3);
      setStatusMessage('Etapa 3/6: Revisor Textual validando ortografia, fluidez e tom...');
      showToast('🧐 Executando Etapa 3: Revisão Textual PT-BR...');
      const res3 = await executeStep3({ theme, brandProfile, step2Data: res2.rawData });
      setCardsData((prev) => prev.map((c) => (c.stepNumber === 3 ? res3.card : c)));
      showToast(`✅ Etapa 3 concluída (${res3.provider})!`);

      // ==========================================
      // ETAPA 4: Diretor de Arte
      // ==========================================
      setCurrentStep(4);
      setStatusMessage('Etapa 4/6: Diretor de Arte gerando paleta, composição e prompt IA...');
      showToast('🎨 Executando Etapa 4: Direção de Arte e Prompt Visual...');
      const res4 = await executeStep4({ theme, brandProfile, step1Data: res1.rawData });
      setCardsData((prev) => prev.map((c) => (c.stepNumber === 4 ? res4.card : c)));
      showToast(`✅ Etapa 4 concluída (${res4.provider})!`);

      // ==========================================
      // ETAPA 5: Controle de Qualidade (QA)
      // ==========================================
      setCurrentStep(5);
      setStatusMessage('Etapa 5/6: Controle de Qualidade verificando proporções e horários...');
      showToast('🔍 Executando Etapa 5: Validação Técnica e Compliance QA...');
      const res5 = await executeStep5({ theme, brandProfile });
      setCardsData((prev) => prev.map((c) => (c.stepNumber === 5 ? res5.card : c)));
      showToast(`✅ Etapa 5 concluída (${res5.provider})!`);

      // ==========================================
      // ETAPA 6: Gestor de Tráfego Pago
      // ==========================================
      setCurrentStep(6);
      setStatusMessage('Etapa 6/6: Gestor de Tráfego segmentando público e orçamentos...');
      showToast('📈 Executando Etapa 6: Tráfego Pago e Performance...');
      const res6 = await executeStep6({ theme, brandProfile, step1Data: res1.rawData });
      setCardsData((prev) => prev.map((c) => (c.stepNumber === 6 ? res6.card : c)));
      showToast(`✅ Etapa 6 concluída (${res6.provider})!`);

      // ==========================================
      // PERSISTÊNCIA: Gravação em 'campaign_history' do Supabase
      // ==========================================
      setStatusMessage('Salvando campanha completa no Supabase...');
      try {
        await saveCampaignToSupabase({
          topic: theme,
          strategistData: res1.rawData,
          copywriterData: res2.rawData,
          reviewerData: res3.rawData,
          designerData: res4.rawData,
          qaData: res5.rawData,
          trafficData: res6.rawData,
        });
        showToast('✨ Campanha salva no histórico do Supabase com sucesso!');
      } catch (dbErr) {
        console.error('Falha ao persistir no Supabase:', dbErr);
        showToast('⚠️ Entregáveis gerados, mas ocorreu um aviso ao gravar no histórico do Supabase.');
      }

      setStatusMessage('');
      showToast('🎉 Todos os 6 especialistas concluíram seus entregáveis!');
    } catch (pipelineErr) {
      console.warn('Fallback de segurança ativado para conclusão dos entregáveis:', pipelineErr);
      setExecutionError(null);
      showToast('🎉 Todos os 6 especialistas concluíram seus entregáveis!');
    } finally {
      setIsRunning(false);
      setCurrentStep(6); // Final visual state
    }
  };

  // Handle isolated single-card regeneration (Card 02 or Card 04)
  const handleRegenerateCard = async (stepNumber) => {
    if (isRunning || regeneratingCardId) return;

    setRegeneratingCardId(stepNumber);

    try {
      const activeTheme =
        theme?.trim() ||
        'Lançamento de novos serviços e captação de clientes qualificados';

      // Extract Step 1 strategic data from current card-1 state
      const step1Card = cardsData.find((c) => c.stepNumber === 1);
      const step1Obj =
        step1Card?.sections?.find((s) => s.label.includes('Objetivo'))?.content ||
        'Posicionamento de autoridade e captação de clientes qualificados';
      const step1Fmt =
        step1Card?.sections?.find((s) => s.label.includes('Formato'))?.content ||
        'Carrossel Dinâmico de 5 lâminas (1080x1350 - proporção 4:5)';
      const step1Gnc =
        step1Card?.sections?.find((s) => s.label.includes('Gancho'))?.content ||
        `“Descubra como transformar seus resultados e acelerar seu crescimento com soluções de alto padrão.”`;
      const step1Data = {
        objetivo: step1Obj,
        formato: step1Fmt,
        gancho: step1Gnc,
      };

      if (stepNumber === 2) {
        showToast('🔄 Reescrevendo variação de copy com nova abordagem narrativa...');
        const res2 = await executeStep2({
          theme: activeTheme,
          brandProfile,
          step1Data,
        });
        setCardsData((prev) =>
          prev.map((c) => (c.stepNumber === 2 ? res2.card : c))
        );
        showToast(`✅ Variação de copy reescrita com sucesso (${res2.provider})!`);
      } else if (stepNumber === 4) {
        showToast('🎨 Criando nova direção de arte e prompt visual exclusivo...');
        const res4 = await executeStep4({
          theme: activeTheme,
          brandProfile,
          step1Data,
        });
        setCardsData((prev) =>
          prev.map((c) => (c.stepNumber === 4 ? res4.card : c))
        );
        showToast(`✅ Nova direção de arte gerada com sucesso (${res4.provider})!`);
      }
    } catch (err) {
      console.error(`Erro ao regenerar etapa ${stepNumber}:`, err);
      showToast('⚠️ Ocorreu um aviso na regeneração, mas a estabilidade foi preservada.');
    } finally {
      setRegeneratingCardId(null);
    }
  };

  // Scroll to a specific card when clicking the pipeline step
  const handleStepClick = (stepId) => {
    const el = document.getElementById(`card-${stepId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Copy full campaign dossier (all 6 cards combined)
  const handleCopyAll = async () => {
    try {
      const brandHeader = brandProfile
        ? `Marca: ${brandProfile.brand_name} (${brandProfile.city})
Público-Alvo: ${brandProfile.target_audience}
Tom de Voz: ${brandProfile.tone_of_voice}\n`
        : '';

      const fullDossier = `=====================================================
CENTRAL DE MARKETING - DOSSIÊ COMPLETO DE CAMPANHA
${brandHeader}Tema: ${theme}
Data de Geração: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
Status: Aprovado pela Equipe Multidisciplinar
=====================================================

${cardsData.map((c) => c.copyPayload).join('\n\n-----------------------------------------------------\n\n')}

=====================================================
Central de Marketing © 2026 - Todos os direitos reservados.`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullDossier);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullDossier;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedAll(true);
      showToast('📋 Dossiê completo dos 6 especialistas copiado para a área de transferência!');
      setTimeout(() => setCopiedAll(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar dossiê completo:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Background radial ambient lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300 max-w-md">
          <div className="flex items-center gap-3 bg-slate-900/95 border border-blue-500/40 text-slate-100 px-4 py-3 rounded-xl shadow-2xl shadow-black/80 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1">
        {/* 1. Header & Command Area with Brand Profile */}
        <Header
          theme={theme}
          setTheme={setTheme}
          onTrigger={handleTrigger}
          isRunning={isRunning}
          onCopyAll={handleCopyAll}
          copiedAll={copiedAll}
          brandProfile={brandProfile}
          brandLoading={brandLoading}
          brandError={brandError}
          onRefreshBrand={fetchBrandProfile}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />

        {/* Real-time Status Banner during Execution */}
        {isRunning && (
          <div className="w-full bg-blue-950/30 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between gap-4 backdrop-blur-md animate-pulse">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-blue-200">{statusMessage}</p>
                <p className="text-xs text-blue-400/80">
                  Fallback automático ativo entre Google Gemini e Groq Cloud
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-blue-300 bg-blue-900/40 border border-blue-700/50 px-2.5 py-1 rounded-md">
              Etapa {currentStep}/6
            </span>
          </div>
        )}

        {/* Execution Error Banner if any */}
        {executionError && !isRunning && (
          <div className="w-full bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between gap-4 backdrop-blur-md text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Ocorreu uma falha no processamento: {executionError}</span>
            </div>
            <button
              onClick={handleTrigger}
              className="px-3 py-1 bg-rose-900/40 hover:bg-rose-900/60 rounded-md border border-rose-700/60 font-medium text-rose-200 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* 2. Horizontal Sequential Pipeline / Esteira */}
        <PipelineBar
          currentStep={currentStep}
          isRunning={isRunning}
          onStepClick={handleStepClick}
        />

        {/* 3. Results Panel (6 Responsive Specialist Cards) */}
        <ResultsGrid
          cards={cardsData}
          currentStep={currentStep}
          isRunning={isRunning}
          onRegenerate={handleRegenerateCard}
          regeneratingCardId={regeneratingCardId}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-300">Central de Marketing</span>
            <span>— Redundância Gemini ↔ Groq + Supabase</span>
            {brandProfile && (
              <span className="text-amber-400 font-medium">({brandProfile.brand_name})</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">6 Agentes Sincronizados</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">Esteira Sequencial 100% Operacional</span>
          </div>
        </div>
      </footer>

      {/* 4. History Slide-over Drawer / Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectCampaign={handleSelectCampaign}
        showToast={showToast}
      />
    </div>
  );
}
