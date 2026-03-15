#!/bin/bash
# ============================================
# Entrypoint Script para Iniciar Serviços
# ============================================

set -e  # Sair se qualquer comando falhar

echo "================================================"
echo "🚀 Iniciando LinkUp - Plataforma TCC"
echo "================================================"

# ============================================
# 1. Verificar Variáveis de Ambiente
# ============================================
echo "📋 Verificando variáveis de ambiente..."

# Variáveis obrigatórias
REQUIRED_VARS=(
    "MONGO_URL"
    "DB_NAME"
    "JWT_SECRET_KEY"
    "EMERGENT_LLM_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Erro: Variável de ambiente $var não está definida!"
        echo "   Configure no painel da Render antes de fazer deploy."
        exit 1
    fi
done

echo "✅ Variáveis de ambiente verificadas"

# ============================================
# 2. Criar arquivo .env do Backend (se não existir)
# ============================================
if [ ! -f /app/backend/.env ]; then
    echo "📝 Criando arquivo .env do backend..."
    cat > /app/backend/.env << EOF
MONGO_URL=${MONGO_URL}
DB_NAME=${DB_NAME}
CORS_ORIGINS=${CORS_ORIGINS:-*}
JWT_SECRET_KEY=${JWT_SECRET_KEY}
EMERGENT_LLM_KEY=${EMERGENT_LLM_KEY}
EOF
    echo "✅ Arquivo .env do backend criado"
fi

# ============================================
# 3. Popular Banco de Dados (se necessário)
# ============================================
echo "🌱 Verificando se precisa popular banco de dados..."

# Executar seed apenas se a variável SEED_DATABASE=true
if [ "${SEED_DATABASE}" = "true" ]; then
    echo "📦 Populando banco de dados com dados mockados..."
    cd /app/backend
    python seed_data.py || {
        echo "⚠️  Aviso: Erro ao popular banco. Continuando..."
    }
    cd /
    echo "✅ Banco de dados populado"
else
    echo "ℹ️  SEED_DATABASE não está configurado. Pulando seed."
fi

# ============================================
# 4. Configurar Nginx
# ============================================
echo "🔧 Configurando Nginx..."

# Testar configuração do Nginx
nginx -t || {
    echo "❌ Erro: Configuração do Nginx inválida!"
    exit 1
}

echo "✅ Configuração do Nginx válida"

# ============================================
# 5. Atualizar variáveis de ambiente no frontend build
# ============================================
# O frontend já foi buildado, mas podemos injetar variáveis em runtime
if [ -n "${REACT_APP_BACKEND_URL}" ]; then
    echo "🔗 Configurando URL do backend no frontend..."
    # Substituir placeholder se existir no build
    find /app/frontend/build -type f -name "*.js" -exec sed -i "s|REACT_APP_BACKEND_URL_PLACEHOLDER|${REACT_APP_BACKEND_URL}|g" {} \;
fi

# ============================================
# 6. Informações de Deploy
# ============================================
echo ""
echo "================================================"
echo "📊 Informações de Deploy"
echo "================================================"
echo "Backend: FastAPI + MongoDB"
echo "Frontend: React + Nginx"
echo "Porta Backend: 8000"
echo "Porta Frontend: 80"
echo "Workers Uvicorn: 2"
echo "================================================"
echo ""

# ============================================
# 7. Iniciar Supervisor (gerencia Nginx + Uvicorn)
# ============================================
echo "🚀 Iniciando serviços..."
echo ""

# Executar Supervisor em foreground
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
