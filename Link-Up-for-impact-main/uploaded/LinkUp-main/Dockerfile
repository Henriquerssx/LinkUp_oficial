# ============================================
# STAGE 1: Build do Frontend (React + Tailwind)
# ============================================
FROM node:20-alpine AS frontend-builder

# Diretório de trabalho
WORKDIR /app/frontend

# Copiar package.json e yarn.lock para cache de dependências
COPY frontend/package.json frontend/yarn.lock ./

# Instalar dependências com yarn
RUN yarn install --frozen-lockfile --production=false

# Copiar código fonte do frontend
COPY frontend/ ./

# Build de produção do React
RUN yarn build

# ============================================
# STAGE 2: Build do Backend (Python + FastAPI)
# ============================================
# Usar Python 3.11 para compatibilidade com emergentintegrations
FROM python:3.11-slim AS backend-builder

WORKDIR /app/backend

# Dependências de sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt
COPY backend/requirements.txt ./

# Instalar dependências Python
# Se emergentintegrations for local ou privado, ajuste a linha abaixo
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fonte do backend
COPY backend/ ./

# ============================================
# STAGE 3: Imagem final (FastAPI + Nginx)
# ============================================
FROM python:3.11-slim

WORKDIR /app

# Instalar Nginx e Supervisor
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Criar diretórios
RUN mkdir -p /app/frontend/build /app/backend /var/log/supervisor

# ==========================
# Frontend
# ==========================
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# ==========================
# Backend
# ==========================
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin
COPY --from=backend-builder /app/backend /app/backend

WORKDIR /app/backend

# ==========================
# Variáveis de ambiente
# ==========================
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV HOST=0.0.0.0

# ==========================
# Supervisor
# ==========================
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ==========================
# Entrypoint
# ==========================
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expor portas
EXPOSE 80 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Iniciar entrypoint
ENTRYPOINT ["/entrypoint.sh"]
