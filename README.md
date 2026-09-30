# 🚀 Central de Marketing - SPA Moderna

Aplicação Single Page Application (SPA) desenvolvida com **React**, **Vite** e **Tailwind CSS**, projetada para orquestrar campanhas de marketing multidisciplinares de ponta a ponta.

---

## 🌟 Funcionalidades Principais

1. **Área de Comando & Topo**:
   - Cabeçalho moderno com status do sistema.
   - Textarea amplo para inserção e edição do tema da campanha ou postagem.
   - Sugestões rápidas de temas (presets).
   - Botão em destaque: **"🚀 Acionar Equipe de Marketing"** com animação sequencial.
   - Botão utilitário: **"Copiar Dossiê Completo"** de todos os 6 especialistas.

2. **Redundância de IA & Fallback Automático (Gemini ↔ Groq)**:
   - Camada unificada em `src/services/aiProvider.js`.
   - **Motor Primário**: Google Gemini (`gemini-1.5-flash`) via pacote oficial `@google/generative-ai`.
   - **Motor Secundário (Fallback Imediato)**: Em caso de cota, timeout ou indisponibilidade, aciona automaticamente a Groq Cloud (`llama-3.3-70b-versatile` / `openai/gpt-oss-120b`).
   - Rastreamento transparente de qual provedor gerou cada entregável.

3. **Diretriz Cultural Rígida de Kung Fu Tradicional Chinês**:
   - Proibição estrita de termos japoneses (*"Dojo"*, *"Kata"*, *"Katas"*, *"Sensei"*, *"Tatame"*).
   - Uso obrigatório e exclusivo da terminologia autêntica de Kung Fu:
     - **"Kwoon"** para a sala/espaço de treino.
     - **"Katis"** para as formas e sequências técnicas.
     - **"Sifu"** para o mestre/professor.
   - Auditoria e substituição compulsória pelo Revisor Textual (Etapa 3) com validação técnica em Português do Brasil.

4. **Integração com Supabase**:
   - Conexão configurada em `src/lib/supabase.js`.
   - Leitura do perfil da marca ativa (`brand_profile`).
   - Gravação automática da campanha completa e dados estruturados na tabela `campaign_history` ao finalizar a etapa 6.

5. **Histórico de Campanhas & Gestão (Drawer)**:
   - Botão **"📋 Ver Histórico"** no cabeçalho.
   - Listagem ordenada da mais recente para a mais antiga com data formatada e tema da campanha.
   - Carregamento instantâneo de qualquer campanha passada diretamente nos 6 cards e no campo de tema.
   - Exclusão com 1 clique (botão de lixeira) integrada ao Supabase.

6. **Barra de Progresso / Esteira Sequencial**:
   - Visualização horizontal com navegação 1 a 6:
     - `(1) Estratégia` → `(2) Redação` → `(3) Revisão` → `(4) Design` → `(5) QA` → `(6) Tráfego Pago`.
   - Indicadores visuais de status (Concluído, Em Andamento, Pendente).
   - Clique em qualquer etapa para rolar diretamente até o card correspondente.

3. **Painel de Resultados (6 Cards Especialistas)**:
   - **Card 1 - Estrategista de Conteúdo** (Dra. Helena Vasconcelos): Objetivo, formato recomendado e gancho (hook).
   - **Card 2 - Copywriter** (Lucas Menezes): Textos da arte, legenda para redes e chamada para ação (CTA).
   - **Card 3 - Revisor Textual** (Profª. Beatriz Alencar): Parecer técnico e texto final revisado no padrão culto PT-BR.
   - **Card 4 - Diretor de Arte** (Rodrigo Fontes): Paleta cromática, layout e prompt em inglês para IA de imagem.
   - **Card 5 - Controle de Qualidade** (Camila Siqueira): Checklist técnico de proporção e horários sugeridos de publicação.
   - **Card 6 - Gestor de Tráfego Pago** (Thiago Ramos): Público-alvo, raio geográfico, objetivo e orçamento diário mínimo.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** (SPA rápida com gerenciamento reativo de estado)
- **Vite** (Build tool ultrarrápido)
- **Tailwind CSS** (Design system responsivo e moderno no tema Dark Tech)
- **Lucide React** (Ícones modernos e leves)

---

## 🚀 Como Executar

### 1. Iniciar em modo de desenvolvimento:
```bash
npm run dev
```
Acesse no navegador: [http://localhost:3000](http://localhost:3000)

### 2. Gerar build de produção:
```bash
npm run build
```
