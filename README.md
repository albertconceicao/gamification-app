# 🎮 Sistema de Gamificação Completo

Sistema completo de gamificação com API Node.js + TypeScript e Frontend React.js

## 📁 Estrutura do Projeto

```
features/
├── gamification-api/          # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/           # Configurações (MongoDB)
│   │   ├── models/           # Models (Event, Action, User, UserAction)
│   │   ├── routes/           # Rotas da API
│   │   ├── middlewares/      # Middlewares (validações)
│   │   └── server.ts         # Servidor principal
│   ├── package.json
│   └── README_V2.md          # Documentação completa da API
│
└── gamification-frontend/     # Frontend (React + Vite + Tailwind)
    ├── src/
    │   ├── components/       # Componentes React
    │   ├── services/         # Integração com API
    │   ├── App.jsx           # Componente principal
    │   └── main.jsx          # Entry point
    └── package.json
```

---

## 🚀 Como Executar

### Opção 1: Script Automático (Recomendado)

```bash
# Na raiz do projeto
./start-dev.sh
```

Este script vai:
- ✅ Verificar MongoDB
- ✅ Instalar dependências
- ✅ Criar arquivos .env
- ✅ Iniciar backend e frontend

### Opção 2: Manual

#### 1. Backend (API)

```bash
cd gamification-api

# Instalar dependências (já feito!)
pnpm install

# Configurar .env (já criado!)
# Verificar: cat .env

# Iniciar MongoDB (se necessário)
docker-compose up -d

# Iniciar em desenvolvimento
pnpm dev
```

A API estará rodando em: **http://localhost:3000**

#### 2. Frontend (React)

```bash
cd gamification-frontend

# Instalar dependências (já feito!)
pnpm install

# Verificar .env (já criado!)
# cat .env

# Iniciar em desenvolvimento
pnpm dev
```

O frontend estará rodando em: **http://localhost:5173**

### 3. Popular com Dados de Exemplo

```bash
# Com backend rodando, em outro terminal:
cd gamification-api
./seed-data.sh
```

Isso vai criar:
- 1 evento de exemplo
- 5 ações configuradas
- 3 usuários de teste
- Algumas ações já realizadas

---

## 🎯 Funcionalidades

### Backend (API)
- ✅ Gerenciamento de eventos
- ✅ Ações configuráveis por evento
- ✅ Sistema de pontuação flexível
- ✅ Controle de ações únicas/múltiplas
- ✅ Ranking em tempo real
- ✅ Histórico completo de ações
- ✅ Validações de segurança

### Frontend (React)
- ✅ Lista de eventos disponíveis
- ✅ Registro de usuários em eventos
- ✅ Dashboard do evento com ações
- ✅ Sistema de pontuação interativo
- ✅ Ranking em tempo real
- ✅ Interface moderna com Tailwind CSS
- ✅ Ícones com Lucide React

---

## 📖 Documentação

### API
- **Documentação Completa**: `gamification-api/API_V2_DOCUMENTATION.md`
- **Guia Rápido**: `gamification-api/QUICK_START_V2.md`
- **Changelog**: `gamification-api/CHANGELOG_V2.md`
- **Segurança**: `gamification-api/SECURITY_VALIDATIONS.md`

### Frontend
- Componentes React modulares
- Integração completa com API
- Design responsivo

---

## 🔧 Tecnologias

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Docker

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- Lucide React (ícones)

---

## 📡 Endpoints da API

```
# Eventos
GET    /api/events
POST   /api/events
GET    /api/events/:id
PUT    /api/events/:id
GET    /api/events/:id/ranking

# Ações
GET    /api/events/:eventId/actions
POST   /api/events/:eventId/actions
PUT    /api/actions/:id

# Usuários
POST   /api/events/:eventId/users
GET    /api/users/:id
GET    /api/users/:id/history

# Pontuação
POST   /api/users/:userId/actions/:actionId
```

---

## 🎨 Interface do Frontend

### Telas Principais

1. **Lista de Eventos**
   - Visualização de todos os eventos
   - Status (ativo/inativo)
   - Estatísticas (participantes, ações)

2. **Dashboard do Evento**
   - Formulário de registro
   - Ações disponíveis
   - Pontuação do usuário
   - Ranking em tempo real

3. **Painel Admin** (em desenvolvimento)
   - Gerenciamento de eventos
   - Configuração de ações
   - Estatísticas

---

## 🔐 Segurança

- ✅ Validação de eventos ativos no DB
- ✅ Controle de ações únicas/múltiplas
- ✅ Validação de dados
- ✅ CORS configurado
- ✅ Tratamento de erros

---

## 📝 Exemplo de Uso

### 1. Criar Evento (via API)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Friday 2024",
    "description": "Campanha de pontos",
    "isActive": true
  }'
```

### 2. Criar Ações (via API)
```bash
curl -X POST http://localhost:3000/api/events/{eventId}/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Realizar compra",
    "points": 50,
    "allowMultiple": true
  }'
```

### 3. Acessar Frontend
1. Abra http://localhost:5173
2. Selecione um evento
3. Registre-se
4. Realize ações e ganhe pontos!

---

## 🚀 Deploy

### Backend
Veja `gamification-api/DEPLOY.md` para instruções de deploy em:
- Railway
- Render
- Heroku
- Docker
- VPS

### Frontend
```bash
cd gamification-frontend
npm run build
# Deploy a pasta dist/ em qualquer serviço de hosting estático
# (Vercel, Netlify, GitHub Pages, etc.)
```

---

## 📞 Suporte

- **API**: Veja documentação em `gamification-api/`
- **Frontend**: Código comentado e componentizado

---

## 📝 Licença

ISC

---

**Versão:** 2.0.0  
**Status:** ✅ Pronto para uso  
**Stack:** Node.js + React + MongoDB
