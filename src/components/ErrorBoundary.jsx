import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Erro ao limpar storage:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900/90 border border-rose-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Falha na Execução da Aplicação
              </h2>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Ocorreu um erro inesperado ao renderizar a Central de Marketing. O diagnóstico detalhado está abaixo:
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto mb-6 max-h-48 leading-relaxed">
              {this.state.error?.toString() || 'Erro desconhecido'}
            </div>

            {this.state.errorInfo?.componentStack && (
              <details className="mb-6 text-xs text-slate-400 cursor-pointer">
                <summary className="hover:text-slate-200 font-medium mb-2">
                  Ver detalhes técnicos da pilha (Stack Trace)
                </summary>
                <pre className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-[11px] overflow-x-auto text-slate-300">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={this.handleReload}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/30"
              >
                🔄 Recarregar Página
              </button>
              <button
                onClick={this.handleReset}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors border border-slate-700"
              >
                🧹 Limpar Cache & Reiniciar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
