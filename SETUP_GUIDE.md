# 🚀 Guia de Setup - Sistema de Gamificação

Guia completo para rodar o backend e frontend integrados.

---

## 📋 Pré-requisitos

- **Node.js** 18+ instalado
- **MongoDB** rodando (local ou Docker)
- **pnpm** (ou npm/yarn)

---

## 🗄️ 1. Configurar MongoDB

### Opção A: MongoDB Local

Se você tem MongoDB instalado localmente:

```bash
# Iniciar MongoDB
mongod
```

### Opção B: Docker (Recomendado)

```bash
# Subir MongoDB com Docker Compose
cd gamification-api
docker-compose up -d

# Verificar se está rodando
docker ps
```

### Opção C: MongoDB Atlas (Cloud)

1. Crie uma conta em https://www.mongodb.com/cloud/atlas
2. Crie um cluster gratuito
3. Pegue a connection string
4. Use no `.env` do backend

---

## ⚙️ 2. Configurar Backend (API)

```bash
cd gamification-api

# Já instalado! ✅
# pnpm install

# Verificar se .env existe
cat .env

# Se não existir, criar:
cp .env.example .env

# Editar .env se necessário
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/points-db
```

### Iniciar Backend

```bash
# Modo desenvolvimento (com hot reload)
pnpm dev

# Ou modo produção
pnpm build
pnpm start
```

**Backend estará em:** http://localhost:3000

---

## 🎨 3. Configurar Frontend (React)

```bash
cd gamification-frontend

# Já instalado! ✅
# pnpm install

# Verificar se .env existe
cat .env

# Deve conter:
# VITE_API_URL=http://localhost:3000/api
```

### Iniciar Frontend

```bash
# Modo desenvolvimento
pnpm dev
```

**Frontend estará em:** http://localhost:5173

---

## ✅ 4. Testar Integração

### 4.1. Verificar Backend

Abra http://localhost:3000 no navegador. Deve retornar:

```json
{
  "success": true,
  "message": "API de Pontuação está funcionando!",
  "version": "2.0.0",
  "features": [...]
}
```

### 4.2. Testar Endpoints

```bash
# Listar eventos
curl http://localhost:3000/api/events

# Deve retornar:
# {"success":true,"data":[],"count":0}
```

### 4.3. Criar Evento de Teste

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Evento Teste",
    "description": "Primeiro evento para testar",
    "isActive": true
  }'
```

### 4.4. Acessar Frontend

1. Abra http://localhost:5173
2. Você deve ver a tela de eventos
3. O evento criado deve aparecer na lista

---

## 🎯 5. Fluxo Completo de Teste

### Passo 1: Criar Evento

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Friday 2024",
    "description": "Campanha de pontos da Black Friday",
    "startDate": "2024-11-01",
    "endDate": "2024-11-30",
    "isActive": true
  }'
```

Copie o `_id` retornado (exemplo: `673e1234567890abcdef1234`)

### Passo 2: Criar Ações

```bash
# Substitua {EVENT_ID} pelo ID do evento criado
EVENT_ID="673e1234567890abcdef1234"

# Ação 1: Realizar compra
curl -X POST http://localhost:3000/api/events/$EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Realizar compra",
    "description": "Ganhe pontos ao fazer uma compra",
    "points": 100,
    "allowMultiple": true,
    "isActive": true
  }'

# Ação 2: Compartilhar nas redes
curl -X POST http://localhost:3000/api/events/$EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Compartilhar nas redes sociais",
    "description": "Compartilhe e ganhe pontos",
    "points": 50,
    "allowMultiple": false,
    "isActive": true
  }'

# Ação 3: Indicar amigo
curl -X POST http://localhost:3000/api/events/$EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Indicar um amigo",
    "description": "Indique amigos e ganhe",
    "points": 200,
    "allowMultiple": true,
    "isActive": true
  }'
```

### Passo 3: Testar no Frontend

1. Acesse http://localhost:5173
2. Clique no evento "Black Friday 2024"
3. Registre-se com seu nome e email
4. Veja as 3 ações disponíveis
5. Clique em "Realizar" em cada ação
6. Veja seus pontos aumentarem
7. Confira o ranking

---

## 🐛 Troubleshooting

### Backend não inicia

**Erro:** `MongooseServerSelectionError`

**Solução:**
```bash
# Verificar se MongoDB está rodando
# Se usando Docker:
docker ps

# Se não estiver, iniciar:
docker-compose up -d

# Ou iniciar MongoDB local:
mongod
```

### Frontend não conecta com Backend

**Erro:** `Network Error` ou `CORS`

**Solução:**
1. Verificar se backend está rodando em http://localhost:3000
2. Verificar arquivo `.env` do frontend:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
3. Reiniciar o frontend após alterar `.env`

### Porta já em uso

**Erro:** `Port 3000 is already in use`

**Solução:**
```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar o processo
kill -9 <PID>

# Ou usar outra porta no .env
PORT=3001
```

---

## 📁 Estrutura de Pastas

```
features/
├── gamification-api/          # Backend
│   ├── .env                   # ✅ Configurado
│   ├── src/
│   └── package.json
│
├── gamification-frontend/     # Frontend
│   ├── .env                   # ✅ Configurado
│   ├── src/
│   └── package.json
│
└── SETUP_GUIDE.md            # Este arquivo
```

---

## 🎬 Comandos Rápidos

### Terminal 1 - Backend
```bash
cd gamification-api
pnpm dev
```

### Terminal 2 - Frontend
```bash
cd gamification-frontend
pnpm dev
```

### Terminal 3 - MongoDB (se usando Docker)
```bash
cd gamification-api
docker-compose up
```

---

## 🔗 URLs Importantes

- **Backend API:** http://localhost:3000
- **Frontend:** http://localhost:5173
- **API Docs:** Ver `gamification-api/API_V2_DOCUMENTATION.md`
- **Exemplos:** Ver `gamification-api/requests-v2.http`

---

## ✨ Próximos Passos

1. ✅ Backend rodando
2. ✅ Frontend rodando
3. ✅ MongoDB conectado
4. ✅ Integração funcionando
5. 🎯 Criar eventos e ações
6. 🎯 Testar fluxo completo
7. 🎯 Customizar interface
8. 🚀 Deploy em produção

---

**Versão:** 2.0.0  
**Status:** ✅ Pronto para uso  
**Stack:** Node.js + TypeScript + React + MongoDB
