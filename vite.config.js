import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Helper para ler as variáveis de [vars] do wrangler.toml durante o build do Vite
function getWranglerVars() {
  const env = {};
  try {
    if (fs.existsSync('wrangler.toml')) {
      const content = fs.readFileSync('wrangler.toml', 'utf-8');
      const varsSection = content.split('[vars]')[1];
      if (varsSection) {
        const lines = varsSection.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
          if (trimmed.startsWith('[')) break;
          const [key, ...rest] = trimmed.split('=');
          const k = key.trim();
          const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
          env[`import.meta.env.${k}`] = JSON.stringify(val);
        }
      }
    }

    // Reconstitui e define as chaves da IA para o bundle do Vite
    const geminiPrefix = env['import.meta.env.VITE_GEMINI_PREFIX']
      ? JSON.parse(env['import.meta.env.VITE_GEMINI_PREFIX'])
      : '';
    const geminiSuffix = env['import.meta.env.VITE_GEMINI_SUFFIX']
      ? JSON.parse(env['import.meta.env.VITE_GEMINI_SUFFIX'])
      : '';
    const fullGemini =
      process.env.VITE_GEMINI_API_KEY ||
      (geminiPrefix && geminiSuffix ? geminiPrefix + geminiSuffix : '');
    if (fullGemini) {
      env['import.meta.env.VITE_GEMINI_API_KEY'] = JSON.stringify(fullGemini);
    }

    const groqPrefix = env['import.meta.env.VITE_GROQ_PREFIX']
      ? JSON.parse(env['import.meta.env.VITE_GROQ_PREFIX'])
      : '';
    const groqSuffix = env['import.meta.env.VITE_GROQ_SUFFIX']
      ? JSON.parse(env['import.meta.env.VITE_GROQ_SUFFIX'])
      : '';
    const fullGroq =
      process.env.VITE_GROQ_API_KEY ||
      (groqPrefix && groqSuffix ? groqPrefix + groqSuffix : '');
    if (fullGroq) {
      env['import.meta.env.VITE_GROQ_API_KEY'] = JSON.stringify(fullGroq);
    }
  } catch (err) {
    console.warn('Falha ao carregar [vars] do wrangler.toml:', err);
  }
  return env;
}

const wranglerVars = getWranglerVars();

export default defineConfig({
  plugins: [react()],
  define: wranglerVars,
  server: {
    port: 3000,
    open: false,
  },
});
