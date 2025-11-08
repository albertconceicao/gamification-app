# Dockerfile para API de Pontuação

# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY src ./src

# Build da aplicação
RUN npm run build

# Estágio 2: Produção
FROM node:18-alpine

WORKDIR /app

# Copiar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar build do estágio anterior
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Usuário não-root para segurança
USER node

# Comando para iniciar
CMD ["node", "dist/server.js"]
