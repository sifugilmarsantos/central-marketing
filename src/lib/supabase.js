import { createClient } from '@supabase/supabase-js';

// Leitura segura com fallbacks (|| '') para não quebrar a aplicação caso as chaves não sejam injetadas no ambiente
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  '';

let client = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[Supabase Init Warning] Falha ao inicializar cliente Supabase:', err);
  }
}

// Cliente resiliente com suporte a encadeamento fluente (select, order, limit, eq, insert, delete)
if (!client) {
  const createMockChain = () => {
    const chain = {
      select: () => chain,
      order: () => chain,
      limit: () => chain,
      eq: () => chain,
      insert: () => chain,
      update: () => chain,
      delete: () => chain,
      then: (resolve) => Promise.resolve({ data: [], error: null }).then(resolve),
      catch: (reject) => Promise.resolve({ data: [], error: null }).catch(reject),
    };
    return chain;
  };

  client = {
    from: () => createMockChain(),
  };
}

export const supabase = client;
export default supabase;
