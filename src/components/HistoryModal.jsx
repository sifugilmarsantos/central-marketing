import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchCampaignHistory,
  deleteCampaignFromSupabase,
} from '../services/marketingPipeline';

export default function HistoryModal({
  isOpen,
  onClose,
  onSelectCampaign,
  showToast,
}) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCampaignHistory();
      setCampaigns(data);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError(err.message || 'Erro ao consultar banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const handleDelete = async (e, id, topic) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      `Deseja realmente excluir a campanha:\n"${topic || 'Sem tema'}"?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteCampaignFromSupabase(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      if (showToast) {
        showToast('🗑️ Campanha excluída do histórico com sucesso.');
      }
    } catch (err) {
      console.error('Erro ao excluir campanha:', err);
      if (showToast) {
        showToast(`❌ Erro ao excluir: ${err.message}`);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden bg-black/70 backdrop-blur-sm transition-opacity">
      {/* Click outside to close */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div className="relative flex h-full w-full max-w-xl flex-col bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-5 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Histórico de Campanhas
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {campaigns.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Salvas na tabela <code className="text-slate-300 font-mono">campaign_history</code> do Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadHistory}
              disabled={loading}
              type="button"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Recarregar histórico"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-sm font-medium">Carregando campanhas do Supabase...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-300 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-rose-200">
                <AlertCircle className="w-4 h-4" />
                <span>Falha ao consultar banco</span>
              </div>
              <p>{error}</p>
              <button
                onClick={loadHistory}
                className="self-start underline hover:text-rose-100 font-medium mt-1"
              >
                Tentar novamente
              </button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                <History className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Nenhuma campanha salva ainda.
              </p>
              <p className="text-xs text-slate-500 max-w-xs">
                Insira um tema e clique em "🚀 Acionar Equipe de Marketing" para gerar e salvar a primeira campanha!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((item) => {
                const isDeleting = deletingId === item.id;
                const hasFullData =
                  item.strategist_data &&
                  item.copywriter_data &&
                  item.reviewer_data &&
                  item.designer_data;

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectCampaign(item)}
                    className="group relative rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-950/90 transition-all duration-200 p-4 cursor-pointer shadow-lg hover:shadow-blue-500/5 flex flex-col gap-2.5"
                  >
                    {/* Item Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
                        <span className="font-mono text-[11px]">
                          {formatDate(item.created_at)}
                        </span>
                        {hasFullData ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            6 Especialistas
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                            Parcial
                          </span>
                        )}
                      </div>

                      {/* Trash Delete Button */}
                      <button
                        onClick={(e) => handleDelete(e, item.id, item.topic)}
                        disabled={isDeleting}
                        type="button"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all flex-shrink-0"
                        title="Excluir campanha do banco de dados"
                      >
                        {isDeleting ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Campaign Topic / Theme */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                        {item.topic || 'Campanha sem tema definido'}
                      </h4>
                    </div>

                    {/* Preview details if available */}
                    {item.strategist_data?.objetivo && (
                      <p className="text-xs text-slate-400 line-clamp-1 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                        🎯 {item.strategist_data.objetivo}
                      </p>
                    )}

                    {/* Click CTA info */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[11px] text-slate-500 group-hover:text-blue-400">
                      <span>Clique para carregar nos cards</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-800/80 px-6 py-4 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>{campaigns.length} registro(s) encontrado(s)</span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
