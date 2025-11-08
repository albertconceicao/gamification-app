# 📚 API v2.0 - Documentação Completa

## 🎯 Visão Geral

A API v2.0 introduz um sistema completo de **Eventos** e **Ações Configuráveis**, permitindo criar múltiplos eventos, cada um com suas próprias ações e regras de pontuação personalizadas.

### Principais Mudanças da v2.0

- ✅ **Eventos**: Crie e gerencie múltiplos eventos independentes
- ✅ **Ações Configuráveis**: Defina ações específicas para cada evento com pontuação customizada
- ✅ **Controle de Repetição**: Configure se uma ação pode ser realizada múltiplas vezes
- ✅ **Histórico Completo**: Rastreie todas as ações realizadas pelos usuários
- ✅ **Validações Avançadas**: Sistema robusto de validação e controle

---

## 📋 Estrutura de Dados

### Event (Evento)
```typescript
{
  _id: ObjectId,
  name: string,              // Nome do evento
  description?: string,      // Descrição opcional
  startDate: Date,           // Data de início
  endDate?: Date,            // Data de término (opcional)
  isActive: boolean,         // Se o evento está ativo
  createdAt: Date,
  updatedAt: Date
}
```

### Action (Ação)
```typescript
{
  _id: ObjectId,
  eventId: ObjectId,         // ID do evento
  name: string,              // Nome da ação
  description?: string,      // Descrição opcional
  points: number,            // Pontos que a ação vale
  allowMultiple: boolean,    // Se permite múltiplas execuções
  isActive: boolean,         // Se a ação está ativa
  createdAt: Date,
  updatedAt: Date
}
```

### User (Usuário)
```typescript
{
  _id: ObjectId,
  eventId: ObjectId,         // ID do evento
  name: string,
  email: string,             // Único por evento
  points: number,
  registeredAt: Date,
  lastAction?: Date
}
```

### UserAction (Histórico)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  eventId: ObjectId,
  actionId: ObjectId,
  pointsEarned: number,
  performedAt: Date
}
```

---

## 🛣️ Endpoints da API

### 1. Eventos

#### 📋 Listar Eventos
```http
GET /api/events
```

**Resposta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "event123",
      "name": "Black Friday 2024",
      "description": "Campanha de pontos da Black Friday",
      "startDate": "2024-11-01T00:00:00.000Z",
      "endDate": "2024-11-30T23:59:59.000Z",
      "isActive": true,
      "createdAt": "2024-10-15T10:00:00.000Z",
      "updatedAt": "2024-10-15T10:00:00.000Z"
    }
  ]
}
```

#### 🔍 Buscar Evento
```http
GET /api/events/:eventId
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "_id": "event123",
    "name": "Black Friday 2024",
    "description": "Campanha de pontos da Black Friday",
    "isActive": true,
    "stats": {
      "totalActions": 15,
      "totalUsers": 234
    }
  }
}
```

#### ➕ Criar Evento
```http
POST /api/events
```

**Body:**
```json
{
  "name": "Black Friday 2024",
  "description": "Campanha de pontos da Black Friday",
  "startDate": "2024-11-01T00:00:00.000Z",
  "endDate": "2024-11-30T23:59:59.000Z",
  "isActive": true
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Evento criado com sucesso",
  "data": { /* evento criado */ }
}
```

#### ✏️ Atualizar Evento
```http
PUT /api/events/:eventId
```

**Body:**
```json
{
  "name": "Black Friday 2024 - Atualizado",
  "isActive": false
}
```

#### 🗑️ Remover Evento
```http
DELETE /api/events/:eventId
```

**Nota:** Não é possível remover eventos com usuários ou ações vinculadas.

#### 🏆 Ranking do Evento
```http
GET /api/events/:eventId/ranking
```

**Resposta:**
```json
{
  "success": true,
  "event": {
    "id": "event123",
    "name": "Black Friday 2024"
  },
  "count": 234,
  "data": [
    {
      "_id": "user123",
      "name": "João Silva",
      "email": "joao@example.com",
      "points": 350,
      "lastAction": "2024-11-15T14:30:00.000Z"
    }
  ]
}
```

---

### 2. Ações

#### 📋 Listar Ações de um Evento
```http
GET /api/events/:eventId/actions
```

**Resposta:**
```json
{
  "success": true,
  "event": {
    "id": "event123",
    "name": "Black Friday 2024"
  },
  "count": 5,
  "data": [
    {
      "_id": "action123",
      "eventId": "event123",
      "name": "Compra acima de R$ 100",
      "description": "Realizar uma compra acima de R$ 100",
      "points": 50,
      "allowMultiple": true,
      "isActive": true
    }
  ]
}
```

#### 🔍 Buscar Ação
```http
GET /api/actions/:actionId
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "_id": "action123",
    "name": "Compra acima de R$ 100",
    "points": 50,
    "allowMultiple": true,
    "stats": {
      "timesPerformed": 1523
    }
  }
}
```

#### ➕ Criar Ação
```http
POST /api/events/:eventId/actions
```

**Body:**
```json
{
  "name": "Compartilhar nas redes sociais",
  "description": "Compartilhar a campanha no Instagram ou Facebook",
  "points": 10,
  "allowMultiple": false,
  "isActive": true
}
```

**Campos:**
- `name` (obrigatório): Nome da ação
- `description` (opcional): Descrição da ação
- `points` (obrigatório): Pontos que a ação vale (≥ 0)
- `allowMultiple` (padrão: false): Se permite múltiplas execuções
- `isActive` (padrão: true): Se a ação está ativa

**Resposta:**
```json
{
  "success": true,
  "message": "Ação criada com sucesso",
  "data": { /* ação criada */ }
}
```

#### ✏️ Atualizar Ação
```http
PUT /api/actions/:actionId
```

**Body:**
```json
{
  "points": 15,
  "allowMultiple": true,
  "isActive": false
}
```

#### 🗑️ Remover Ação
```http
DELETE /api/actions/:actionId
```

**Nota:** Não é possível remover ações que já foram realizadas por usuários.

---

### 3. Usuários

#### 📋 Listar Usuários
```http
GET /api/users
```

Lista todos os usuários de todos os eventos.

#### ➕ Registrar Usuário em um Evento
```http
POST /api/events/:eventId/users
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "_id": "user123",
    "eventId": "event123",
    "name": "João Silva",
    "email": "joao@example.com",
    "points": 0,
    "registeredAt": "2024-11-15T10:00:00.000Z"
  }
}
```

**Nota:** O mesmo email pode ser usado em eventos diferentes, mas não no mesmo evento.

#### 🔍 Buscar Usuário
```http
GET /api/users/:userId
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "_id": "user123",
    "eventId": {
      "_id": "event123",
      "name": "Black Friday 2024"
    },
    "name": "João Silva",
    "email": "joao@example.com",
    "points": 150,
    "recentActions": [
      {
        "_id": "ua123",
        "actionId": {
          "name": "Compra acima de R$ 100",
          "points": 50
        },
        "pointsEarned": 50,
        "performedAt": "2024-11-15T14:30:00.000Z"
      }
    ]
  }
}
```

#### 📜 Histórico de Ações do Usuário
```http
GET /api/users/:userId/history
```

**Resposta:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "name": "João Silva",
    "totalPoints": 150
  },
  "count": 8,
  "data": [
    {
      "_id": "ua123",
      "actionId": {
        "name": "Compra acima de R$ 100",
        "points": 50,
        "description": "Realizar uma compra acima de R$ 100"
      },
      "pointsEarned": 50,
      "performedAt": "2024-11-15T14:30:00.000Z"
    }
  ]
}
```

---

### 4. Pontuação

#### ⭐ Usuário Realiza uma Ação
```http
POST /api/users/:userId/actions/:actionId
```

**Validações Automáticas:**
- ✅ Verifica se usuário existe
- ✅ Verifica se ação existe e está ativa
- ✅ Verifica se ação pertence ao evento do usuário
- ✅ Verifica se ação permite múltiplas execuções
- ✅ Registra no histórico
- ✅ Adiciona pontos ao usuário

**Resposta (Sucesso):**
```json
{
  "success": true,
  "message": "50 ponto(s) adicionado(s) com sucesso",
  "data": {
    "userId": "user123",
    "name": "João Silva",
    "action": {
      "id": "action123",
      "name": "Compra acima de R$ 100",
      "points": 50
    },
    "totalPoints": 200,
    "pointsAdded": 50
  }
}
```

**Resposta (Ação já realizada - allowMultiple: false):**
```json
{
  "success": false,
  "message": "Você já realizou esta ação e ela não permite múltiplas execuções"
}
```

---

## 🎯 Fluxo de Uso Completo

### 1. Criar um Evento
```bash
POST /api/events
{
  "name": "Black Friday 2024",
  "description": "Campanha de pontos",
  "startDate": "2024-11-01T00:00:00.000Z",
  "endDate": "2024-11-30T23:59:59.000Z"
}
```

### 2. Criar Ações para o Evento
```bash
# Ação 1: Cadastro (única vez)
POST /api/events/{eventId}/actions
{
  "name": "Completar cadastro",
  "points": 20,
  "allowMultiple": false
}

# Ação 2: Compra (múltiplas vezes)
POST /api/events/{eventId}/actions
{
  "name": "Realizar compra",
  "points": 50,
  "allowMultiple": true
}

# Ação 3: Compartilhamento (única vez)
POST /api/events/{eventId}/actions
{
  "name": "Compartilhar nas redes",
  "points": 10,
  "allowMultiple": false
}
```

### 3. Registrar Usuário no Evento
```bash
POST /api/events/{eventId}/users
{
  "name": "João Silva",
  "email": "joao@example.com"
}
```

### 4. Usuário Realiza Ações
```bash
# Completar cadastro
POST /api/users/{userId}/actions/{actionId_cadastro}

# Realizar primeira compra
POST /api/users/{userId}/actions/{actionId_compra}

# Compartilhar
POST /api/users/{userId}/actions/{actionId_compartilhar}

# Realizar segunda compra (permitido pois allowMultiple: true)
POST /api/users/{userId}/actions/{actionId_compra}
```

### 5. Ver Ranking
```bash
GET /api/events/{eventId}/ranking
```

---

## 💡 Casos de Uso

### E-commerce
```javascript
// Ações típicas:
- Cadastro completo: 20 pts (única vez)
- Primeira compra: 100 pts (única vez)
- Compra acima de R$ 100: 50 pts (múltiplas)
- Avaliação de produto: 15 pts (múltiplas)
- Indicação de amigo: 30 pts (múltiplas)
```

### Eventos/Conferências
```javascript
// Ações típicas:
- Check-in no evento: 10 pts (única vez)
- Participar de palestra: 5 pts (múltiplas)
- Visitar estande: 2 pts (múltiplas)
- Networking (trocar contato): 3 pts (múltiplas)
- Preencher pesquisa: 20 pts (única vez)
```

### Aplicativo/SaaS
```javascript
// Ações típicas:
- Completar perfil: 25 pts (única vez)
- Login diário: 5 pts (múltiplas)
- Convidar usuário: 50 pts (múltiplas)
- Usar feature premium: 10 pts (múltiplas)
- Deixar review: 30 pts (única vez)
```

---

## 🔐 Regras de Negócio

### Eventos
- ✅ Podem ter múltiplas ações
- ✅ Podem ter múltiplos usuários
- ✅ Não podem ser deletados se tiverem dados vinculados
- ✅ Podem ser desativados (isActive: false)

### Ações
- ✅ Pertencem a um único evento
- ✅ Pontuação mínima: 0
- ✅ `allowMultiple: false` = usuário só pode realizar uma vez
- ✅ `allowMultiple: true` = usuário pode realizar múltiplas vezes
- ✅ Não podem ser deletadas se já foram realizadas
- ✅ Podem ser desativadas (isActive: false)

### Usuários
- ✅ Pertencem a um único evento
- ✅ Email único por evento (pode repetir em eventos diferentes)
- ✅ Pontos acumulados automaticamente
- ✅ Histórico completo de ações

### Pontuação
- ✅ Validação automática de regras
- ✅ Registro em histórico (UserAction)
- ✅ Atualização automática de pontos do usuário
- ✅ Controle de ações únicas/múltiplas

---

## 📊 Exemplos de Integração

Veja o arquivo `frontend-v2-example.js` para exemplos completos de integração com frontend.

---

## 🔄 Migração da v1.0

Se você estava usando a v1.0, veja o guia de migração em `MIGRATION_GUIDE.md`.

---

## 📝 Notas Importantes

1. **Email Único por Evento**: O mesmo email pode participar de múltiplos eventos
2. **Ações Desativadas**: Ações com `isActive: false` não podem ser executadas
3. **Histórico Permanente**: Ações realizadas ficam registradas permanentemente
4. **Validação Rigorosa**: Sistema valida todas as regras antes de adicionar pontos

---

**Versão:** 2.0.0  
**Última Atualização:** Novembro 2024
