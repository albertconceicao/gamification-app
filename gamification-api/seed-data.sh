#!/bin/bash

# Script para popular o banco com dados de exemplo

API_URL="http://localhost:3000/api"

echo "🌱 Populando banco de dados com dados de exemplo..."
echo ""

# Criar Evento
echo "📅 Criando evento..."
EVENT_RESPONSE=$(curl -s -X POST $API_URL/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Friday 2024",
    "description": "Campanha de pontos da Black Friday - Ganhe pontos e concorra a prêmios!",
    "startDate": "2024-11-01",
    "endDate": "2024-11-30",
    "isActive": true
  }')

EVENT_ID=$(echo $EVENT_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$EVENT_ID" ]; then
    echo "❌ Erro ao criar evento"
    echo $EVENT_RESPONSE
    exit 1
fi

echo "✅ Evento criado: $EVENT_ID"
echo ""

# Criar Ações
echo "🎯 Criando ações..."

echo "  → Realizar compra..."
curl -s -X POST $API_URL/events/$EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Realizar compra",
    "description": "Ganhe 100 pontos a cada compra realizada",
    "points": 100,
    "allowMultiple": true,
    "isActive": true
  }' > /dev/null

echo "  → Compartilhar nas redes..."
curl -s -X POST $API_URL/events/$EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Compartilhar nas redes sociais",
    "description": "Compartilhe nossa campanha e ganhe 50 pontos (apenas uma vez)",
    "points": 50,
    "allowMultiple": false,
    "isActive": true
  }' > /dev/null

echo "  → Indicar amigo..."
curl -s -X POST $API_URL/events/$EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Indicar um amigo",
    "description": "Indique amigos e ganhe 200 pontos por indicação",
    "points": 200,
    "allowMultiple": true,
    "isActive": true
  }' > /dev/null

echo "  → Avaliar produto..."
curl -s -X POST $API_URL/events/$EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Avaliar produto",
    "description": "Avalie produtos comprados e ganhe 30 pontos",
    "points": 30,
    "allowMultiple": true,
    "isActive": true
  }' > /dev/null

echo "  → Cadastrar newsletter..."
curl -s -X POST $API_URL/events/$EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cadastrar na newsletter",
    "description": "Cadastre-se na nossa newsletter e ganhe 25 pontos",
    "points": 25,
    "allowMultiple": false,
    "isActive": true
  }' > /dev/null

echo "✅ 5 ações criadas"
echo ""

# Criar usuários de exemplo
echo "👥 Criando usuários de exemplo..."

echo "  → João Silva..."
USER1_RESPONSE=$(curl -s -X POST $API_URL/events/$EVENT_ID/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com"
  }')
USER1_ID=$(echo $USER1_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

echo "  → Maria Santos..."
USER2_RESPONSE=$(curl -s -X POST $API_URL/events/$EVENT_ID/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com"
  }')
USER2_ID=$(echo $USER2_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

echo "  → Pedro Costa..."
curl -s -X POST $API_URL/events/$EVENT_ID/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Costa",
    "email": "pedro@example.com"
  }' > /dev/null

echo "✅ 3 usuários criados"
echo ""

# Buscar IDs das ações
echo "🔍 Buscando ações criadas..."
ACTIONS_RESPONSE=$(curl -s $API_URL/events/$EVENT_ID/actions)
ACTION1_ID=$(echo $ACTIONS_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
ACTION2_ID=$(echo $ACTIONS_RESPONSE | grep -o '"_id":"[^"]*' | head -2 | tail -1 | cut -d'"' -f4)

# Simular algumas ações dos usuários
if [ ! -z "$USER1_ID" ] && [ ! -z "$ACTION1_ID" ]; then
    echo "🎮 Simulando ações dos usuários..."
    
    # João faz algumas compras
    curl -s -X POST $API_URL/users/$USER1_ID/actions/$ACTION1_ID > /dev/null
    curl -s -X POST $API_URL/users/$USER1_ID/actions/$ACTION1_ID > /dev/null
    
    # Maria também faz compras
    if [ ! -z "$USER2_ID" ]; then
        curl -s -X POST $API_URL/users/$USER2_ID/actions/$ACTION1_ID > /dev/null
    fi
    
    echo "✅ Ações simuladas"
fi

echo ""
echo "🎉 Banco de dados populado com sucesso!"
echo ""
echo "📊 Resumo:"
echo "  • 1 evento criado"
echo "  • 5 ações configuradas"
echo "  • 3 usuários registrados"
echo "  • Algumas ações já realizadas"
echo ""
echo "🌐 Acesse o frontend em: http://localhost:5173"
echo "📡 API disponível em: http://localhost:3000"
echo ""
