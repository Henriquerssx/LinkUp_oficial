# LinkUp - Plataforma de Prática de Conexão Humana

## 📋 Sobre o Projeto

LinkUp é uma plataforma SaaS baseada em Terapia Cognitivo-Comportamental (TCC) focada na recalibração de crenças limitantes sobre interação social através de missões de exposição gradual no mundo real.

## 🏗️ Arquitetura

### Backend (FastAPI + MongoDB)
- **Framework**: FastAPI 0.110.1
- **Banco de Dados**: MongoDB (Motor - async driver)
- **Autenticação**: JWT (python-jose)
- **Criptografia**: Bcrypt (passlib)

### Frontend (React 19)
- **Framework**: React 19.0.0
- **Roteamento**: React Router DOM 7.5.1
- **UI Components**: Shadcn UI (Radix UI)
- **Estilização**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.8.4
- **Ícones**: Lucide React 0.507.0

## 📁 Estrutura de Pastas

```
linkup/
├── backend/
│   ├── .env                    # Variáveis de ambiente
│   ├── server.py               # API FastAPI principal
│   ├── seed_data.py           # Script de dados mockados
│   └── requirements.txt        # Dependências Python
│
└── frontend/
    ├── package.json            # Dependências NPM
    ├── tailwind.config.js      # Config Tailwind
    ├── postcss.config.js       # Config PostCSS
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js            # Entry point
        ├── App.js              # App principal
        ├── App.css             # Estilos customizados
        ├── index.css           # Estilos globais
        ├── lib/
        │   └── utils.js        # Utilitários
        ├── hooks/
        │   └── use-toast.js    # Hook de toast
        ├── pages/
        │   ├── Login.js        # Página de login
        │   ├── Register.js     # Página de registro
        │   ├── Onboarding.js   # Onboarding 3 perguntas
        │   ├── Dashboard.js    # Dashboard principal
        │   ├── MissionFlow.js  # Fluxo de missão (3 fases)
        │   ├── Evidence.js     # Diário de evidências
        │   └── Community.js    # Comunidade
        └── components/
            └── ui/             # Componentes Shadcn UI
```

## 🚀 Como Rodar Localmente

### Backend

1. **Instalar dependências:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configurar .env:**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="linkup_db"
CORS_ORIGINS="*"
JWT_SECRET_KEY="sua-chave-secreta-aqui"
```

3. **Popular banco de dados:**
```bash
python seed_data.py
```

4. **Rodar servidor:**
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend

1. **Instalar dependências:**
```bash
cd frontend
yarn install
```

2. **Configurar .env:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

3. **Rodar aplicação:**
```bash
yarn start
```

A aplicação estará disponível em `http://localhost:3000`

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Login
- `GET /api/user/profile` - Perfil do usuário (protegido)

### Onboarding
- `POST /api/onboarding` - Salvar respostas do onboarding (protegido)

### Missões
- `GET /api/missions` - Listar todas as missões (protegido)
- `GET /api/missions/daily` - Missão do dia (protegido)
- `POST /api/missions/complete` - Completar missão (protegido)

### Progresso
- `GET /api/progress` - Dados de progresso do usuário (protegido)

### Evidências
- `GET /api/evidence` - Diário de evidências (protegido)

### Comunidade
- `GET /api/community` - Posts da comunidade (protegido)

## 🎨 Design System

### Paleta de Cores
- **Azul Principal**: `#3B82F6` (blue-500)
- **Azul Claro**: `#DBEAFE` (blue-100)
- **Azul Médio**: `#60A5FA` (blue-400)
- **Background**: Gradiente de `#EFF6FF` → `#DBEAFE` → `#BFDBFE`

### Tipografia
- **Headings**: Manrope (600, 700, 800)
- **Body**: Inter (300, 400, 500, 600, 700)

### Componentes Customizados
- `.glass-card` - Cards com efeito glass-morphism
- `.mission-card` - Cards de missão com hover effect
- `.evidence-card` - Cards de evidência com gradiente
- `.badge-glow` - Badges com animação de brilho

## 🎯 Funcionalidades Principais

### 1. Autenticação
- Sistema de registro e login com JWT
- Persistência de sessão no localStorage
- Rotas protegidas

### 2. Onboarding
- Fluxo de 3 perguntas para personalização
- Progressão visual entre etapas
- Validação de campos

### 3. Dashboard
- Visão geral do progresso (nível, XP, streak)
- Missão do dia destacada
- Acesso rápido a Evidências e Comunidade
- Gamificação (badges, níveis)

### 4. Fluxo de Missão (3 Fases)
- **Fase 1 (Antes)**: Identificar crenças limitantes e previsões
- **Fase 2 (Durante)**: Instruções para execução
- **Fase 3 (Depois)**: Registro do resultado real e aprendizado

### 5. Diário de Evidências
- Comparação visual: Previsão vs Realidade
- Delta Positivo calculado automaticamente
- Redução de ansiedade visualizada
- Aprendizados documentados

### 6. Comunidade
- Posts de conquistas de outros usuários
- Sistema de likes
- Inspiração através de prova social

## 📊 Sistema de Gamificação

### Níveis (6 Total)
1. **Interações Cotidianas** (Nível 1)
2. **Conversas Casuais** (Nível 2)
3. **Expandindo o Círculo** (Nível 3)
4. **Vulnerabilidade Autêntica** (Nível 4)
5. **Liderança Social** (Nível 5)
6. **Maestria de Conexão** (Nível 6)

### Sistema de XP
- XP necessário por nível: `nivel_atual × 100`
- Cada missão dá XP baseado na dificuldade
- Subida de nível adiciona badge automaticamente

### Streak
- Contador de dias consecutivos
- Incentiva prática diária
- Reset ao pular um dia

## 🧪 Dados Mockados

O script `seed_data.py` cria:
- **16 missões** distribuídas em 6 níveis
- **7 posts** de comunidade
- **3 evidências** de exemplo

## 🔐 Segurança

- Senhas hasheadas com Bcrypt
- Tokens JWT com expiração de 30 dias
- Validação de email com EmailStr (Pydantic)
- CORS configurado
- Rotas protegidas com Bearer token

## 📱 Responsividade

- Design mobile-first
- Breakpoints Tailwind (sm, md, lg)
- Layout adaptativo para todas as telas

## 🚧 Próximos Passos

1. **Notificações Push** para lembretes de missões
2. **Gráficos de progresso** temporal no Dashboard
3. **Reflexão semanal** para consolidar aprendizados
4. **Comentários** em posts da comunidade
5. **Missões personalizadas por IA** baseadas no histórico

## 📄 Licença

Projeto desenvolvido para uso educacional e demonstração.

## 👨‍💻 Desenvolvido com

- FastAPI
- React 19
- MongoDB
- Tailwind CSS
- Shadcn UI

---

**LinkUp** - Transformando conexões, um passo de cada vez. 💙
