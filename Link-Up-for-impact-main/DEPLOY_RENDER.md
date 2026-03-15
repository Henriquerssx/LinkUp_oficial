# 🚀 Guia Completo de Deploy do LinkUp na Render

## 📋 Pré-requisitos

### 1. Conta no MongoDB Atlas (Gratuito)
- Acesse: https://www.mongodb.com/cloud/atlas
- Crie uma conta gratuita
- Crie um cluster M0 (512MB grátis)

### 2. Conta na Render (Gratuito)
- Acesse: https://render.com
- Crie uma conta gratuita
- Conecte com seu GitHub/GitLab

### 3. Repositório Git
- Faça push do código para GitHub/GitLab
- Certifique-se de incluir todos os arquivos criados

---

## 📦 Arquivos Criados para Deploy

```
/app/
├── Dockerfile                    ✅ Multi-stage build
├── nginx.conf                    ✅ Configuração Nginx
├── supervisord.conf              ✅ Gerenciador de processos
├── entrypoint.sh                 ✅ Script de inicialização
├── render.yaml                   ✅ Configuração Render (opcional)
└── .dockerignore                 ✅ Arquivos a ignorar
```

---

## 🗄️ Passo 1: Configurar MongoDB Atlas

### 1.1 Criar Cluster
1. Faça login no MongoDB Atlas
2. Clique em **"Build a Database"**
3. Escolha **"M0 FREE"** (Shared)
4. Região: **us-east-1** (mais próxima da Render)
5. Nome do cluster: `linkup-cluster`
6. Clique em **"Create"**

### 1.2 Criar Database User
1. Vá em **"Database Access"** (menu lateral)
2. Clique em **"Add New Database User"**
3. Username: `linkup_user`
4. Password: `gere uma senha forte` (salve em local seguro!)
5. Database User Privileges: **"Read and write to any database"**
6. Clique em **"Add User"**

### 1.3 Configurar Network Access
1. Vá em **"Network Access"** (menu lateral)
2. Clique em **"Add IP Address"**
3. Clique em **"Allow Access from Anywhere"**
4. IP: `0.0.0.0/0` (será preenchido automaticamente)
5. Clique em **"Confirm"**

### 1.4 Obter Connection String
1. Vá em **"Database"** (menu lateral)
2. Clique em **"Connect"** no seu cluster
3. Escolha **"Connect your application"**
4. Driver: **Python** / Version: **3.12 or later**
5. Copie a connection string:

```
mongodb+srv://linkup_user:<password>@linkup-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Substitua** `<password>` pela senha real do usuário
7. **Salve** esta string - você vai precisar!

---

## 🚀 Passo 2: Deploy na Render

### Opção A: Deploy via Dashboard (Recomendado)

#### 2.1 Criar Web Service
1. Faça login na Render: https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub/GitLab
4. Selecione o repositório **linkup**

#### 2.2 Configurar Service
- **Name**: `linkup`
- **Region**: `Oregon (US West)` (mais barato)
- **Branch**: `main` ou `master`
- **Root Directory**: deixe vazio (raiz do projeto)
- **Environment**: **Docker**
- **Instance Type**: `Free` ou `Starter ($7/mês)`

#### 2.3 Configurar Variáveis de Ambiente
Clique em **"Advanced"** e adicione:

```bash
# MongoDB
MONGO_URL=mongodb+srv://linkup_user:SUA_SENHA@linkup-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=linkup_production

# JWT (deixe a Render gerar)
JWT_SECRET_KEY=[clique em "Generate" ao lado]

# IA (sua chave Emergent LLM)
EMERGENT_LLM_KEY=sk-emergent-eE12bE62f80B3Af310

# CORS
CORS_ORIGINS=*

# Frontend URL (será atualizada depois)
REACT_APP_BACKEND_URL=https://linkup.onrender.com

# Seed Database (true na primeira vez, depois false)
SEED_DATABASE=true

# Python
PYTHONUNBUFFERED=1
```

#### 2.4 Deploy
1. Clique em **"Create Web Service"**
2. Aguarde o build (5-10 minutos na primeira vez)
3. Acompanhe os logs em tempo real

#### 2.5 Atualizar URL do Frontend
1. Após deploy, copie a URL gerada: `https://linkup-xxxx.onrender.com`
2. Vá em **"Environment"** (menu lateral)
3. Edite `REACT_APP_BACKEND_URL`
4. Cole a URL copiada
5. Salve (vai fazer redeploy automático)

---

### Opção B: Deploy via render.yaml (Automático)

Se você incluiu o arquivo `render.yaml` no repositório:

1. Faça push do código para GitHub/GitLab
2. Vá para Render Dashboard
3. Clique em **"New +"** → **"Blueprint"**
4. Conecte seu repositório
5. Render detectará automaticamente o `render.yaml`
6. Configure apenas as variáveis de ambiente secretas:
   - `MONGO_URL`
   - `EMERGENT_LLM_KEY`
7. Clique em **"Apply"**

---

## ✅ Passo 3: Popular Banco de Dados

### 3.1 Primeira Vez (com seed)
- Certifique-se de que `SEED_DATABASE=true` está configurado
- O entrypoint vai popular automaticamente com:
  - 15 missões
  - 15 posts de comunidade (incluindo Anchor)
  - 3 evidências de exemplo

### 3.2 Verificar Logs
1. Na Render Dashboard, vá em **"Logs"**
2. Procure por:
```
🌱 Iniciando seed do banco de dados...
✅ 15 missões criadas (5 por nível)
✅ 15 posts da comunidade criados (1 Anchor + 14 posts)
✅ 3 evidências de exemplo criadas
✅ Seed completo!
```

### 3.3 Desabilitar Seed (após primeira vez)
1. Vá em **"Environment"** → Edite `SEED_DATABASE`
2. Mude para `false`
3. Salve (redeploy automático)

---

## 🔍 Passo 4: Testar Aplicação

### 4.1 Acessar Frontend
- URL: `https://linkup-xxxx.onrender.com`
- Deve carregar a página de Login

### 4.2 Testar Backend
- Health Check: `https://linkup-xxxx.onrender.com/health`
- Deve retornar: `healthy`

### 4.3 Criar Conta
1. Clique em "Criar conta"
2. Preencha os dados
3. Complete o onboarding (7 perguntas)
4. Verifique se a IA recomendou um nível

### 4.4 Completar Missão
1. No Dashboard, clique em "Iniciar Missão"
2. Complete as 3 fases
3. Verifique se XP foi atualizado
4. Vá em "Diário de Evidências"
5. Clique em "Obter Feedback"
6. Verifique se a IA gerou feedback

---

## 🐛 Troubleshooting

### Problema: Build Falhou

**Solução 1: Verificar Dockerfile**
```bash
# Testar localmente
docker build -t linkup-test .
docker run -p 80:80 -p 8000:8000 linkup-test
```

**Solução 2: Logs da Render**
- Vá em "Logs" no dashboard
- Procure por erros em vermelho
- Mensagens comuns:
  - `MONGO_URL not defined` → Adicione variável de ambiente
  - `Module not found` → Verifique requirements.txt ou package.json

### Problema: App não carrega

**Solução 1: Verificar Health Check**
```bash
curl https://linkup-xxxx.onrender.com/health
# Deve retornar: healthy
```

**Solução 2: Verificar Logs Backend**
- Procure por: `INFO:     Started server process`
- Se não aparecer: problema no Uvicorn

**Solução 3: Verificar Logs Nginx**
- Procure por: `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### Problema: API não responde

**Verificar:**
1. `REACT_APP_BACKEND_URL` está correto?
2. CORS está configurado? (`CORS_ORIGINS=*`)
3. Backend está rodando? (ver logs)

**Testar API diretamente:**
```bash
curl https://linkup-xxxx.onrender.com/api/missions
# Deve retornar: erro de autenticação (401) - isso é OK!
# Se retornar 404: API não está sendo encontrada
```

### Problema: MongoDB não conecta

**Verificar:**
1. Connection string está correta?
2. Senha do usuário está correta?
3. IP `0.0.0.0/0` está whitelisted no Atlas?
4. Database name está correto?

**Logs para procurar:**
```
pymongo.errors.ServerSelectionTimeoutError
# Significa: não conseguiu conectar ao MongoDB
```

### Problema: IA não funciona

**Verificar:**
1. `EMERGENT_LLM_KEY` está definida?
2. Key está correta?
3. Saldo da key está positivo?

**Testar:**
```bash
# Ver logs quando IA é chamada
# Procure por: "Erro ao gerar feedback: ..."
```

---

## 💰 Custos

### Render (Web Service)
- **Free Tier**: $0/mês
  - 750 horas/mês
  - Sleep após 15min de inatividade
  - 512MB RAM
  
- **Starter**: $7/mês
  - Sempre ativo
  - 512MB RAM
  - Recomendado para produção

- **Standard**: $25/mês
  - 2GB RAM
  - Para mais usuários

### MongoDB Atlas
- **M0 (Free)**: $0/mês
  - 512MB storage
  - Shared cluster
  - Suficiente para MVP
  
- **M10**: $57/mês
  - 10GB storage
  - Dedicated
  - Para produção

### Emergent LLM Key
- **Pay-as-you-go**
- ~$0.001 por análise/feedback
- Estimativa: $5-10/mês para 1000 usuários ativos

---

## 📊 Monitoramento

### Logs em Tempo Real
```bash
# Na Render Dashboard
1. Vá em seu web service
2. Clique em "Logs"
3. Logs aparecem em tempo real
```

### Métricas
```bash
# Na Render Dashboard
1. Vá em "Metrics"
2. Veja:
   - CPU usage
   - Memory usage
   - Response time
   - Request count
```

### Alertas
```bash
# Configurar na Render
1. Vá em "Settings" → "Alerts"
2. Configure alertas para:
   - Deploy falhou
   - Service down
   - Alto uso de CPU/memória
```

---

## 🔐 Segurança

### 1. Atualizar Secrets
```bash
# Após deploy inicial, mude:
- JWT_SECRET_KEY (gere nova)
- MongoDB password (crie novo usuário)
```

### 2. Configurar CORS Específico
```bash
# Ao invés de CORS_ORIGINS=*
CORS_ORIGINS=https://linkup-xxxx.onrender.com,https://seudominio.com
```

### 3. Habilitar HTTPS
- Render já fornece SSL/TLS gratuito
- Certificado renovado automaticamente

### 4. Rate Limiting (Adicionar depois)
```python
# No server.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
```

---

## 🚀 Próximos Passos

### 1. Domínio Customizado
1. Compre um domínio (ex: linkup.app)
2. Na Render: "Settings" → "Custom Domain"
3. Adicione seu domínio
4. Configure DNS conforme instruções

### 2. CI/CD Automático
- Já está configurado!
- Todo push no branch `main` → Deploy automático

### 3. Staging Environment
```bash
# Criar ambiente de teste
1. Duplicate service na Render
2. Nome: linkup-staging
3. Branch: develop
4. Usar banco de dados separado
```

### 4. Backup MongoDB
```bash
# No MongoDB Atlas
1. Vá em "Backup"
2. Configure backups automáticos
3. Retenção: 7 dias (gratuito)
```

---

## 📝 Checklist Final

Antes de considerar deploy completo:

- [ ] MongoDB Atlas configurado e conectado
- [ ] Render web service criado
- [ ] Todas variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Health check respondendo `/health`
- [ ] Frontend carrega na URL da Render
- [ ] Backend responde em `/api/missions`
- [ ] Registro de usuário funcionando
- [ ] Onboarding + IA funcionando
- [ ] Missões sendo completadas
- [ ] Feedback de IA sendo gerado
- [ ] Comunidade carregando posts
- [ ] SEED_DATABASE desabilitado após primeira vez
- [ ] Logs sem erros críticos

---

## 🎉 Deploy Completo!

Seu LinkUp está rodando em produção! 🚀

**URL**: https://linkup-xxxx.onrender.com

**Documentação**:
- Logs: Dashboard → Logs
- Métricas: Dashboard → Metrics
- Settings: Dashboard → Settings

**Suporte**:
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Discord Render: https://discord.gg/render

---

**LinkUp** - Transformando conexões, agora em produção! 💙
