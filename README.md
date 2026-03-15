## ✨ Funcionalidades Principais

* **Onboarding Inteligente:** Questionário inicial com 7 perguntas analisadas via IA para determinar o nível de ansiedade do usuário (1 a 3) e recomendar missões personalizadas.
* **Sistema de Missões Práticas:** Fluxo dividido em três fases: preparação (registro de crenças limitantes e ansiedade prévia), execução da missão no mundo real e reflexão final (aprendizado e ansiedade pós-missão).
* **Diário de Evidências:** Ferramenta que compara visualmente as previsões catastróficas do usuário com o resultado real, oferecendo a opção de gerar um feedback motivacional customizado via IA.
* **Gamificação:** Sistema de progressão engajador que inclui níveis, pontos de experiência (XP), "streaks" (ofensivas de dias consecutivos) e badges de conquista.
* **Comunidade:** Espaço seguro dividido em "Mission Pods" (grupos menores com mentores 'Anchors') e "Clusters" (toda a comunidade), incentivando o apoio mútuo através de interações.
* **Insights de Progresso:** Avaliação periódica do desenvolvimento do usuário, identificando padrões de evolução nas últimas missões.

## 🛠️ Tecnologias Utilizadas

### Frontend
A interface foi construída para ser fluida e responsiva, utilizando os padrões mais modernos do ecossistema React:
* **React 19** & **React Router Dom** (v7) para construção da UI e roteamento.
* **Tailwind CSS** para estilização utilitária e design system focado em tons de azul (`blue-100` a `blue-500`) e tipografia Inter/Manrope.
* **Shadcn UI (@radix-ui)** para componentes acessíveis e customizáveis (como Accordions, Dialogs, Sliders e Toasts).
* **Axios** para requisições HTTP e comunicação com a API.

### Backend
A API principal foi desenhada para ser rápida e lidar de forma eficiente com dados assíncronos e integrações de IA:
* **FastAPI** como framework web de alta performance.
* **Uvicorn** como servidor ASGI.
* **MongoDB (via Motor)** para o banco de dados NoSQL assíncrono, estruturado em coleções como `users`, `missions`, `evidences` e `community`.
* **Pydantic** para validação de dados robusta.
* **PyJWT** e **Passlib (bcrypt)** para sistema seguro de autenticação e hash de senhas.

### Inteligência Artificial
O núcleo inteligente do LinkUp é alimentado pela API do Google:
* **Gemini 3 Flash** (via `google-genai` e `google-generativeai`).
* Utilizado em 4 fluxos principais: Análise de Onboarding, Recomendação de Missões, Geração de Feedbacks para Evidências e Insights Gerais de Progresso.

## 🏗️ Estrutura do Projeto

O repositório é um monorepo que contém todo o ecossistema da aplicação:

```text
LinkUp/
├── backend/                      # API FastAPI + MongoDB
│   ├── server.py                 # Rotas principais (Auth, Usuário, Missões)
│   ├── seed_data.py              # Dados base para teste (15 missões, 15 posts)
│   └── requirements.txt          # Dependências Python
├── frontend/                     # Aplicação React
│   ├── public/                   # HTML base e assets
│   └── src/
│       ├── pages/                # Páginas (Login, Dashboard, MissionFlow, etc)
│       ├── components/ui/        # Componentes base Shadcn
│       ├── App.js                # Roteamento e contextos
│       └── App.css               # Estilizações avançadas (Glassmorphism, etc)
├── tests/                        # Testes automatizados (Pytest)
└── test_reports/                 # Relatórios de execução