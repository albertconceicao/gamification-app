# 🎯 API de Pontuação v2.0

## Sistema Completo de Eventos e Gamificação

API REST desenvolvida com Node.js, Express, TypeScript e MongoDB para gerenciar **eventos**, **ações configuráveis** e **sistema de pontuação flexível**.

---

## ✨ Principais Recursos

### 🎪 Eventos
Crie e gerencie múltiplos eventos independentes, cada um com suas próprias regras e participantes.

### ⚡ Ações Configuráveis
Defina ações específicas para cada evento com pontuação personalizada e controle de repetição.

### 🏆 Sistema de Pontuação
Pontuação automática baseada em ações realizadas, com validações e histórico completo.

### 📊 Ranking e Estatísticas
Ranking em tempo real por evento e estatísticas detalhadas de uso.

---

## 🚀 Começar Agora

### 1. Instalar e Iniciar

```bash
npm install
npm run dev
```

### 2. Criar um Evento

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Friday 2024",
    "description": "Campanha de pontos"
  }'
```

### 3. Criar Ações

```bash
# Ação única (20 pontos)
curl -X POST http://localhost:3000/api/events/{eventId}/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Completar cadastro",
    "points": 20,
    "allowMultiple": false
  }'

# Ação múltipla (50 pontos)
curl -X POST http://localhost:3000/api/events/{eventId}/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Realizar compra",
    "points": 50,
    "allowMultiple": true
  }'
```

### 4. Registrar Usuário

```bash
curl -X POST http://localhost:3000/api/events/{eventId}/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com"
  }'
```

### 5. Usuário Realiza Ação

```bash
curl -X POST http://localhost:3000/api/users/{userId}/actions/{actionId}
```

### 6. Ver Ranking

```bash
curl http://localhost:3000/api/events/{eventId}/ranking
```

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| **QUICK_START_V2.md** | 🚀 Comece aqui! Guia rápido |
| **API_V2_DOCUMENTATION.md** | 📖 Documentação completa da API |
| **CHANGELOG_V2.md** | 📝 Mudanças e novidades da v2.0 |
| **requests-v2.http** | 🧪 Exemplos de requisições |
| **frontend-v2-example.js** | 💻 Exemplos de integração |

---

## 🎯 Casos de Uso

### E-commerce
```
Evento: Black Friday 2024
├─ Completar cadastro: 20 pts (única vez)
├─ Primeira compra: 100 pts (única vez)
├─ Compra > R$100: 50 pts (múltiplas)
├─ Avaliar produto: 15 pts (múltiplas)
└─ Indicar amigo: 30 pts (múltiplas)
```

### Evento/Conferência
```
Evento: Tech Summit 2024
├─ Check-in: 10 pts (única vez)
├─ Assistir palestra: 5 pts (múltiplas)
├─ Visitar estande: 2 pts (múltiplas)
├─ Networking: 3 pts (múltiplas)
└─ Preencher pesquisa: 20 pts (única vez)
```

### App/SaaS
```
Evento: Onboarding Challenge
├─ Completar perfil: 25 pts (única vez)
├─ Login diário: 5 pts (múltiplas)
├─ Convidar usuário: 50 pts (múltiplas)
├─ Usar feature: 10 pts (múltiplas)
└─ Deixar review: 30 pts (única vez)
```

---

## 🏗️ Arquitetura

```
┌─────────────┐
│   Evento    │
│ (Event)     │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
┌──────▼──────┐ ┌───▼────────┐
│   Ações     │ │  Usuários  │
│ (Actions)   │ │  (Users)   │
└──────┬──────┘ └─────┬──────┘
       │              │
       └──────┬───────┘
              │
       ┌──────▼──────────┐
       │  Histórico      │
       │ (UserActions)   │
       └─────────────────┘
```

### Models

- **Event**: Eventos independentes
- **Action**: Ações configuráveis por evento
- **User**: Usuários participantes de eventos
- **UserAction**: Histórico de ações realizadas

---

## 🔑 Recursos Principais

### ✅ Controle Total
- Crie, edite e remova eventos
- Configure ações com pontuação personalizada
- Ative/desative ações dinamicamente
- Controle se ações podem ser repetidas

### ✅ Validações Automáticas
- Verifica se ação está ativa
- Valida se ação pertence ao evento
- Controla ações únicas/múltiplas
- Protege contra duplicação

### ✅ Rastreabilidade
- Histórico completo de ações
- Auditoria de pontuação
- Estatísticas por evento e ação
- Ranking em tempo real

### ✅ Flexibilidade
- Múltiplos eventos simultâneos
- Mesmo email em eventos diferentes
- Pontuação dinâmica
- Fácil integração

---

## 📡 Principais Endpoints

```http
# Eventos
POST   /api/events                        # Criar evento
GET    /api/events                        # Listar eventos
GET    /api/events/:id/ranking            # Ranking

# Ações
POST   /api/events/:eventId/actions       # Criar ação
GET    /api/events/:eventId/actions       # Listar ações
PUT    /api/actions/:id                   # Atualizar ação

# Usuários
POST   /api/events/:eventId/users         # Registrar usuário
GET    /api/users/:id                     # Buscar usuário
GET    /api/users/:id/history             # Histórico

# Pontuação
POST   /api/users/:userId/actions/:actionId  # Realizar ação
```

---

## 💡 Conceitos Importantes

### allowMultiple
- **false**: Ação pode ser realizada apenas **uma vez**
- **true**: Ação pode ser realizada **múltiplas vezes**

### isActive
- **true**: Ação está **ativa** e pode ser realizada
- **false**: Ação está **desativada**

### Email Único por Evento
O mesmo email pode participar de **diferentes eventos**, mas não pode se registrar **duas vezes no mesmo evento**.

---

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

---

## 📦 Estrutura do Projeto

```
src/
├── config/
│   └── database.ts          # Configuração MongoDB
├── models/
│   ├── Event.ts             # Model de Evento
│   ├── Action.ts            # Model de Ação
│   ├── User.ts              # Model de Usuário
│   └── UserAction.ts        # Model de Histórico
├── routes/
│   ├── eventRoutes.ts       # Rotas de eventos
│   ├── actionRoutes.ts      # Rotas de ações
│   └── userRoutes.ts        # Rotas de usuários
└── server.ts                # Servidor principal
```

---

## 🧪 Testar a API

### Opção 1: Arquivo HTTP (Recomendado)
1. Abra `requests-v2.http` no VS Code
2. Instale extensão "REST Client"
3. Clique em "Send Request"

### Opção 2: cURL
Veja exemplos em `QUICK_START_V2.md`

### Opção 3: Frontend
Veja exemplos em `frontend-v2-example.js`

---

## 🔄 Migração da v1.0

Se você estava usando a v1.0, principais mudanças:

1. **Endpoint de registro mudou**:
   - v1.0: `POST /api/users`
   - v2.0: `POST /api/events/:eventId/users`

2. **Endpoint de pontuação mudou**:
   - v1.0: `POST /api/users/:userId/action` + body com pontos
   - v2.0: `POST /api/users/:userId/actions/:actionId` (pontos vêm da ação)

3. **Estrutura de dados**:
   - Usuários agora precisam de `eventId`
   - Ações são configuradas no DB, não hardcoded

---

## 📊 Exemplo Completo

```javascript
// 1. Criar evento
const event = await createEvent('Black Friday 2024');

// 2. Criar ações
await createAction(event._id, 'Cadastro', 20, false);
await createAction(event._id, 'Compra', 50, true);

// 3. Registrar usuário
const user = await registerUser(event._id, 'João', 'joao@email.com');

// 4. Usuário realiza ações
await performAction(user._id, actionCadastroId);
await performAction(user._id, actionCompraId);

// 5. Ver ranking
const ranking = await getEventRanking(event._id);
```

---

## 🚀 Deploy

Veja `DEPLOY.md` para instruções de deploy em:
- Railway
- Render
- Heroku
- Docker
- VPS

---

## 📞 Suporte

- **Dúvidas?** Leia `API_V2_DOCUMENTATION.md`
- **Começar rápido?** Leia `QUICK_START_V2.md`
- **Exemplos?** Veja `requests-v2.http` e `frontend-v2-example.js`
- **Mudanças?** Leia `CHANGELOG_V2.md`

---

## 📝 Licença

ISC

---

**Versão:** 2.0.0  
**Status:** ✅ Pronto para produção  
**Última Atualização:** Novembro 2024

---

🎉 **Comece agora!** Execute `npm run dev` e abra `QUICK_START_V2.md`
