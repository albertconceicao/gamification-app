#!/bin/bash

# Script para iniciar backend e frontend em desenvolvimento

echo "🚀 Iniciando Sistema de Gamificação..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se MongoDB está rodando
echo "🔍 Verificando MongoDB..."
if ! pgrep -x "mongod" > /dev/null && ! docker ps | grep -q mongo; then
    echo -e "${RED}❌ MongoDB não está rodando!${NC}"
    echo ""
    echo "Escolha uma opção:"
    echo "1) Iniciar MongoDB com Docker"
    echo "2) Continuar sem MongoDB (vai dar erro)"
    read -p "Opção: " mongo_option
    
    if [ "$mongo_option" = "1" ]; then
        echo -e "${BLUE}🐳 Iniciando MongoDB com Docker...${NC}"
        cd gamification-api && docker-compose up -d && cd ..
        sleep 3
    fi
fi

echo -e "${GREEN}✅ MongoDB OK${NC}"
echo ""

# Verificar se dependências estão instaladas
if [ ! -d "gamification-api/node_modules" ]; then
    echo -e "${BLUE}📦 Instalando dependências do backend...${NC}"
    cd gamification-api && pnpm install && cd ..
fi

if [ ! -d "gamification-frontend/node_modules" ]; then
    echo -e "${BLUE}📦 Instalando dependências do frontend...${NC}"
    cd gamification-frontend && pnpm install && cd ..
fi

# Verificar arquivos .env
if [ ! -f "gamification-api/.env" ]; then
    echo -e "${BLUE}⚙️  Criando .env do backend...${NC}"
    cp gamification-api/.env.example gamification-api/.env
fi

if [ ! -f "gamification-frontend/.env" ]; then
    echo -e "${BLUE}⚙️  Criando .env do frontend...${NC}"
    echo "VITE_API_URL=http://localhost:3000/api" > gamification-frontend/.env
fi

echo ""
echo -e "${GREEN}✅ Setup completo!${NC}"
echo ""
echo "🎯 Iniciando servidores..."
echo ""
echo -e "${BLUE}Backend:${NC} http://localhost:3000"
echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
echo ""
echo "Pressione Ctrl+C para parar todos os servidores"
echo ""

# Iniciar backend e frontend em paralelo
trap 'kill 0' EXIT

cd gamification-api && pnpm dev &
sleep 2
cd gamification-frontend && pnpm dev &

wait
