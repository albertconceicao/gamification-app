#!/bin/bash

# Script para testar a API de Pontuação
# Execute: chmod +x test-api.sh && ./test-api.sh

API_URL="http://localhost:3000"

echo "🧪 Testando API de Pontuação..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Health Check
echo -e "${BLUE}1. Health Check${NC}"
curl -s $API_URL | jq '.'
echo ""

# 2. Registrar primeiro usuário
echo -e "${BLUE}2. Registrando primeiro usuário (João Silva)${NC}"
USER1=$(curl -s -X POST $API_URL/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com"}')
echo $USER1 | jq '.'
USER1_ID=$(echo $USER1 | jq -r '.data._id')
echo -e "${GREEN}ID do usuário 1: $USER1_ID${NC}"
echo ""

# 3. Registrar segundo usuário
echo -e "${BLUE}3. Registrando segundo usuário (Maria Santos)${NC}"
USER2=$(curl -s -X POST $API_URL/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria Santos", "email": "maria@example.com"}')
echo $USER2 | jq '.'
USER2_ID=$(echo $USER2 | jq -r '.data._id')
echo -e "${GREEN}ID do usuário 2: $USER2_ID${NC}"
echo ""

# 4. Adicionar pontos ao usuário 1
echo -e "${BLUE}4. Adicionando 10 pontos ao João (comentário)${NC}"
curl -s -X POST $API_URL/api/users/$USER1_ID/action \
  -H "Content-Type: application/json" \
  -d '{"points": 10, "actionType": "comment"}' | jq '.'
echo ""

# 5. Adicionar mais pontos ao usuário 1
echo -e "${BLUE}5. Adicionando 50 pontos ao João (compra)${NC}"
curl -s -X POST $API_URL/api/users/$USER1_ID/action \
  -H "Content-Type: application/json" \
  -d '{"points": 50, "actionType": "purchase"}' | jq '.'
echo ""

# 6. Adicionar pontos ao usuário 2
echo -e "${BLUE}6. Adicionando 25 pontos à Maria (indicação)${NC}"
curl -s -X POST $API_URL/api/users/$USER2_ID/action \
  -H "Content-Type: application/json" \
  -d '{"points": 25, "actionType": "referral"}' | jq '.'
echo ""

# 7. Buscar usuário específico
echo -e "${BLUE}7. Buscando dados do João${NC}"
curl -s $API_URL/api/users/$USER1_ID | jq '.'
echo ""

# 8. Listar ranking
echo -e "${BLUE}8. Ranking de usuários (ordenado por pontos)${NC}"
curl -s $API_URL/api/users | jq '.'
echo ""

echo -e "${GREEN}✅ Testes concluídos!${NC}"
echo ""
echo "📝 Resumo:"
echo "- João Silva: 60 pontos (10 + 50)"
echo "- Maria Santos: 25 pontos"
echo ""
echo "Para limpar os dados de teste, reinicie o MongoDB ou delete os documentos manualmente."
