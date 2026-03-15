# 🏗️ Estrutura Completa do Projeto LinkUp

## 📁 Visão Geral da Arquitetura

```
LinkUp/
├── 📂 backend/                      # API FastAPI + MongoDB
├── 📂 frontend/                     # React Application
├── 📂 tests/                        # Testes automatizados
├── 📂 scripts/                      # Scripts utilitários
├── 📂 test_reports/                 # Relatórios de teste
└── 📄 README_COMPLETO.md            # Documentação completa
```

---

## 🔧 Backend (FastAPI + MongoDB + IA)

```
backend/
│
├── 📄 server.py                     # API Principal (580+ linhas)
│   ├── 🔐 Autenticação JWT
│   │   ├── POST /api/auth/register
│   │   └── POST /api/auth/login
│   │
│   ├── 👤 Usuário
│   │   ├── GET /api/user/profile
│   │   └── GET /api/user/analises
│   │
│   ├── 📝 Onboarding + IA
│   │   └── POST /api/onboarding (analisa 7 respostas)
│   │
│   ├── 🎯 Missões
│   │   ├── GET /api/missions
│   │   ├── GET /api/missions/daily
│   │   ├── GET /api/missions/recommended (IA)
│   │   └── POST /api/missions/complete
│   │
│   ├── 📊 Progresso
│   │   ├── GET /api/progress
│   │   └── GET /api/insights (IA - padrões)
│   │
│   ├── 📖 Evidências
│   │   ├── GET /api/evidence
│   │   └── POST /api/evidence/feedback (IA)
│   │
│   └── 👥 Comunidade
│       └── GET /api/community
│
├── 📄 seed_data.py                  # Dados mockados (300+ linhas)
│   ├── 15 missões (5 por nível)
│   ├── 15 posts de comunidade
│   │   ├── 1 Anchor (mentor)
│   │   └── 14 posts regulares
│   └── 3 evidências de exemplo
│
├── 📄 requirements.txt              # Dependências Python
│   ├── fastapi==0.110.1
│   ├── motor (MongoDB async)
│   ├── python-jose (JWT)
│   ├── passlib (hash de senha)
│   ├── emergentintegrations (IA)
│   └── 120+ dependências
│
└── 📄 .env                          # Variáveis de ambiente
    ├── MONGO_URL
    ├── DB_NAME
    ├── JWT_SECRET_KEY
    └── EMERGENT_LLM_KEY
```

---

## 🎨 Frontend (React 19 + Tailwind + Shadcn)

```
frontend/
│
├── 📂 public/
│   └── index.html                   # HTML base
│
├── 📂 src/
│   │
│   ├── 📄 index.js                  # Entry point
│   ├── 📄 App.js                    # Roteamento principal (130 linhas)
│   │   ├── AuthContext
│   │   ├── Login/Logout
│   │   └── Rotas protegidas
│   │
│   ├── 📄 index.css                 # Estilos globais + animações
│   ├── 📄 App.css                   # Estilos customizados (112 linhas)
│   │   ├── .glass-card
│   │   ├── .mission-card
│   │   ├── .evidence-card
│   │   ├── .badge-glow
│   │   └── .progress-bar
│   │
│   ├── 📂 pages/                    # 8 Páginas principais
│   │   │
│   │   ├── 📄 Login.js              # Página de login (105 linhas)
│   │   │   ├── Formulário email/senha
│   │   │   ├── Validação
│   │   │   └── Integração JWT
│   │   │
│   │   ├── 📄 Register.js           # Registro de usuário (120 linhas)
│   │   │   ├── Formulário completo
│   │   │   ├── Validação de senha
│   │   │   └── Redirect para onboarding
│   │   │
│   │   ├── 📄 Onboarding.js         # 7 perguntas + IA (142 linhas)
│   │   │   ├── Progressão visual (1/7 → 7/7)
│   │   │   ├── 7 perguntas sobre ansiedade social
│   │   │   ├── Validação de campos
│   │   │   └── Análise de IA (nível recomendado)
│   │   │
│   │   ├── 📄 Dashboard.js          # Página principal (270 linhas)
│   │   │   ├── Header com nome + botões
│   │   │   ├── Missão Recomendada (IA)
│   │   │   ├── Aviso de Insights disponíveis
│   │   │   ├── Quick Actions (Evidências, Comunidade)
│   │   │   └── Sidebar de Progresso
│   │   │       ├── Nível atual
│   │   │       ├── Barra de XP
│   │   │       ├── Streak (ofensiva)
│   │   │       ├── Badges
│   │   │       └── Estatísticas
│   │   │
│   │   ├── 📄 MissionFlow.js        # Fluxo de missão (309 linhas)
│   │   │   ├── Indicador de progresso (3 fases)
│   │   │   ├── Fase 1: Antes da Missão
│   │   │   │   ├── Crença limitante
│   │   │   │   ├── Previsão catastrófica
│   │   │   │   └── Nível de ansiedade (slider)
│   │   │   ├── Fase 2: Durante a Missão
│   │   │   │   ├── Instruções da missão
│   │   │   │   └── Botão "Completei"
│   │   │   └── Fase 3: Após a Missão
│   │   │       ├── O que aconteceu (resultado real)
│   │   │       ├── Aprendizado
│   │   │       ├── Nível ansiedade pós
│   │   │       └── Cálculo de XP e badges
│   │   │
│   │   ├── 📄 Evidence.js           # Diário de Evidências (226 linhas)
│   │   │   ├── Lista de todas evidências
│   │   │   ├── Comparação visual:
│   │   │   │   ├── Crença limitante
│   │   │   │   ├── Previsão (vermelho) vs Realidade (verde)
│   │   │   │   ├── Redução de ansiedade
│   │   │   │   └── Delta Positivo
│   │   │   ├── Botão "Obter Feedback" (IA)
│   │   │   └── Display de feedback resumido
│   │   │
│   │   ├── 📄 Community.js          # Comunidade (180 linhas)
│   │   │   ├── Tabs: Mission Pods | Cluster
│   │   │   ├── Mission Pods (7 posts):
│   │   │   │   ├── 1 Anchor (badge especial)
│   │   │   │   └── 6 membros regulares
│   │   │   ├── Cluster (15 posts):
│   │   │   │   └── Toda comunidade LinkUp
│   │   │   └── Sistema de likes
│   │   │
│   │   └── 📄 Profile.js            # Perfil + Histórico (220 linhas)
│   │       ├── Info do usuário
│   │       ├── Análise inicial (onboarding)
│   │       ├── Histórico de análises de IA
│   │       ├── Insights de progresso
│   │       └── Timeline de evolução
│   │
│   ├── 📂 components/
│   │   └── 📂 ui/                   # Componentes Shadcn UI
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── textarea.jsx
│   │       ├── progress.jsx
│   │       ├── slider.jsx
│   │       ├── card.jsx
│   │       ├── toast.jsx
│   │       └── sonner.jsx (toasts)
│   │
│   ├── 📂 lib/
│   │   └── 📄 utils.js              # Utilitários (cn function)
│   │
│   └── 📂 hooks/
│       └── 📄 use-toast.js          # Hook de toasts (156 linhas)
│
├── 📄 package.json                  # Dependências NPM
│   ├── react: 19.0.0
│   ├── react-router-dom: 7.5.1
│   ├── axios: 1.8.4
│   ├── tailwindcss: 3.4.17
│   ├── lucide-react: 0.507.0 (ícones)
│   ├── date-fns: 4.1.0
│   ├── @radix-ui/* (Shadcn components)
│   └── 40+ dependências
│
├── 📄 tailwind.config.js            # Config Tailwind
│   ├── Cores personalizadas (azul)
│   ├── Fontes: Inter, Manrope
│   └── Plugins
│
├── 📄 postcss.config.js             # PostCSS setup
│
└── 📄 .env                          # Variáveis de ambiente
    └── REACT_APP_BACKEND_URL
```

---

## 🗄️ Estrutura do Banco de Dados (MongoDB)

```
MongoDB: linkup_database
│
├── 📊 users                         # Coleção de usuários
│   └── Documento:
│       ├── id: string (UUID)
│       ├── nome: string
│       ├── email: string
│       ├── password: string (hash bcrypt)
│       ├── nivel_atual: int (1-3)
│       ├── nivel_recomendado: int (IA)
│       ├── xp_atual: int
│       ├── xp_proximo_nivel: int
│       ├── streak: int (dias consecutivos)
│       ├── badges: array[string]
│       ├── analise_inicial: object (IA)
│       ├── ultimo_acesso: datetime
│       └── criado_em: datetime
│
├── 📊 onboarding                    # Respostas do onboarding
│   └── Documento:
│       ├── user_id: string
│       ├── respostas: object (7 perguntas)
│       └── criado_em: datetime
│
├── 📊 missions                      # Missões disponíveis
│   └── Documento:
│       ├── id: string (UUID)
│       ├── titulo: string
│       ├── descricao: string
│       ├── nivel: int (1-3)
│       ├── categoria: string
│       ├── xp_recompensa: int
│       └── dificuldade: string
│
├── 📊 evidences                     # Diário de evidências
│   └── Documento:
│       ├── id: string (UUID)
│       ├── user_id: string
│       ├── mission_id: string
│       ├── mission_titulo: string
│       ├── crenca_antes: string
│       ├── previsao: string
│       ├── resultado_real: string
│       ├── delta_positivo: string
│       ├── nivel_ansiedade_antes: int (1-10)
│       ├── nivel_ansiedade_depois: int (1-10)
│       ├── aprendizado: string
│       ├── feedback_ia: string (opcional)
│       └── data: datetime
│
├── 📊 analises_ia                   # Histórico de análises
│   └── Documento:
│       ├── id: string (UUID)
│       ├── user_id: string
│       ├── tipo: string (onboarding | insights)
│       ├── analise: object
│       │   ├── nivel: int (se onboarding)
│       │   ├── justificativa: string
│       │   ├── pontos_principais: array
│       │   ├── padroes_identificados: array
│       │   ├── progresso_geral: string
│       │   ├── proximos_passos: array
│       │   └── mensagem_motivacional: string
│       └── data: datetime
│
└── 📊 community                     # Posts da comunidade
    └── Documento:
        ├── id: string (UUID)
        ├── tipo: string (anchor | regular)
        ├── user_nome: string
        ├── mission_titulo: string
        ├── conquista: string
        ├── data: datetime
        └── likes: int
```

---

## 🤖 Integração com IA (Gemini 3 Flash)

```
Fluxos de IA:
│
├── 🧠 Análise de Onboarding
│   ├── Input: 7 respostas do questionário
│   ├── Processamento: Gemini analisa padrão de ansiedade
│   └── Output: JSON (60 palavras)
│       ├── nivel: 1-3
│       ├── justificativa: 2 frases
│       └── pontos_principais: 3 itens
│
├── 🎯 Recomendação de Missão
│   ├── Input: Histórico + nível + ansiedade
│   ├── Processamento: IA seleciona melhor próxima missão
│   └── Output: Missão ideal para progressão
│
├── 💬 Feedback de Evidência
│   ├── Input: Previsão vs Resultado + Redução ansiedade
│   ├── Processamento: Gemini gera feedback motivacional
│   └── Output: 50 palavras estruturadas
│       ├── Reconhecimento (1 linha)
│       ├── Delta positivo (1 linha)
│       └── Próximo passo (1 linha)
│
└── 📊 Insights de Progresso
    ├── Input: Últimas 3 missões + estatísticas
    ├── Processamento: IA identifica padrões
    └── Output: JSON (80 palavras)
        ├── padroes_identificados: 3 itens
        ├── progresso_geral: 1 frase
        ├── proximos_passos: 2 ações
        └── mensagem_motivacional: 1 frase
```

---

## 🎨 Sistema de Design

```
Design System:
│
├── 🎨 Paleta de Cores
│   ├── Primária: Azul #3B82F6 (blue-500)
│   ├── Secundária: Azul Claro #DBEAFE (blue-100)
│   ├── Accent: Azul Médio #60A5FA (blue-400)
│   ├── Background: Gradiente azul claro
│   └── Especiais:
│       ├── Anchor: Amarelo/Laranja
│       ├── Sucesso: Verde
│       ├── Erro: Vermelho
│       └── IA: Roxo/Azul
│
├── ✍️ Tipografia
│   ├── Headings: Manrope (600, 700, 800)
│   └── Body: Inter (300, 400, 500, 600, 700)
│
├── 📐 Componentes
│   ├── Cards:
│   │   ├── .glass-card (glass-morphism)
│   │   ├── .mission-card (hover effect)
│   │   └── .evidence-card (gradiente)
│   │
│   ├── Botões:
│   │   ├── Primary (gradiente azul)
│   │   ├── Secondary (outline)
│   │   └── Ghost
│   │
│   ├── Progress:
│   │   ├── Barra de XP (gradiente)
│   │   ├── Streak (flame icon)
│   │   └── Badges (glow effect)
│   │
│   └── Animações:
│       ├── fadeIn (entrada)
│       ├── slideUp (cards)
│       ├── pulse-subtle (badges)
│       └── hover transitions
│
└── 📱 Responsividade
    ├── Mobile: < 640px
    ├── Tablet: 640px - 1024px
    └── Desktop: > 1024px
```

---

## 🔄 Fluxo de Dados Completo

```
Fluxo do Usuário:
│
1️⃣  REGISTRO
    └── POST /api/auth/register
        └── Cria user + token JWT
            └── Redirect → Onboarding

2️⃣  ONBOARDING
    └── 7 perguntas sobre ansiedade social
        └── POST /api/onboarding
            └── IA analisa → Recomenda nível (1-3)
                └── Salva em user.nivel_recomendado
                    └── Salva em analises_ia
                        └── Redirect → Dashboard

3️⃣  DASHBOARD
    └── GET /api/progress (XP, streak, badges)
    └── GET /api/missions/recommended (IA seleciona)
    └── Verifica se tem insights (≥2 missões)
        └── Se sim: mostra aviso → Profile

4️⃣  MISSÃO
    └── Inicia missão
        └── Fase 1: Registra crença + previsão
            └── Fase 2: Executa no mundo real
                └── Fase 3: Registra resultado real
                    └── POST /api/missions/complete
                        └── Cria evidence
                            └── Atualiza XP/nível/streak
                                └── Redirect → Dashboard

5️⃣  EVIDÊNCIAS
    └── GET /api/evidence (lista todas)
    └── Visualiza comparação previsão vs realidade
    └── POST /api/evidence/feedback (IA)
        └── Gera feedback motivacional
            └── Salva em evidence.feedback_ia

6️⃣  PERFIL
    └── GET /api/user/profile
    └── GET /api/user/analises (histórico)
    └── GET /api/insights (se ≥2 missões)
        └── IA analisa padrões
            └── Salva em analises_ia
                └── Exibe insights

7️⃣  COMUNIDADE
    └── GET /api/community
        └── Tab Mission Pods: 7 posts (1 Anchor)
        └── Tab Cluster: 15 posts (todos)
```

---

## 📊 Métricas e KPIs

```
Sistema de Gamificação:
│
├── 🏆 Níveis (3 total)
│   ├── Nível 3: Ansiedade Social Severa
│   ├── Nível 2: Ansiedade Social Moderada
│   └── Nível 1: Ansiedade Social Leve
│
├── ⭐ XP (Experiência)
│   ├── Por missão: 15-50 XP
│   ├── Por nível: 100 XP
│   └── Progressão: XP × nível
│
├── 🔥 Streak (Ofensiva)
│   ├── Dias consecutivos com missões
│   └── Reset ao pular 1 dia
│
├── 🎖️ Badges
│   ├── Por subida de nível
│   └── Conquistas especiais
│
└── 📈 Estatísticas
    ├── Total de missões
    ├── Total de evidências
    ├── Redução média de ansiedade
    └── Taxa de conclusão
```

---

## 🚀 Resumo Técnico

**Total de Arquivos:** 50+

**Linhas de Código:**
- Backend: ~580 linhas (server.py) + 300 linhas (seed)
- Frontend: ~1,900 linhas (8 páginas)
- Componentes UI: 15+ componentes Shadcn
- Estilos: ~250 linhas

**APIs:** 16 endpoints REST
**Integrações IA:** 4 fluxos Gemini
**Coleções MongoDB:** 6 coleções
**Missões:** 15 (5 por nível)
**Posts Comunidade:** 15 (1 Anchor + 14 regulares)

**Stack Completo:**
- Backend: FastAPI + MongoDB + Gemini IA
- Frontend: React 19 + Tailwind + Shadcn
- Auth: JWT (python-jose + bcrypt)
- Deploy: Emergent (Kubernetes)

---

## 📝 Arquivos de Documentação

```
Documentação:
├── README_COMPLETO.md               # Guia completo do projeto
├── TODOS_OS_ARQUIVOS.md             # Lista de todos arquivos
├── ESTRUTURA_PROJETO.md             # Este arquivo
└── test_reports/                    # Relatórios de testes
    └── iteration_*.json
```

---

**LinkUp** - Estrutura completa mapeada! 🎯
