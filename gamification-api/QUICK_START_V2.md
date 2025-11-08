# 🚀 Guia Rápido - API v2.0

## O que mudou?

A v2.0 introduz **Eventos** e **Ações Configuráveis**:

- ✅ Crie múltiplos eventos independentes
- ✅ Configure ações específicas para cada evento
- ✅ Defina pontuação personalizada por ação
- ✅ Controle se ações podem ser repetidas
- ✅ Histórico completo de ações dos usuários

---

## 🎯 Fluxo Básico

```
1. Criar Evento
   ↓
2. Criar Ações para o Evento
   ↓
3. Registrar Usuários no Evento
   ↓
4. Usuários Realizam Ações
   ↓
5. Ver Ranking
```

---

## 📝 Exemplo Prático

### 1. Iniciar servidor

```bash
npm run dev
```

### 2. Criar um evento

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Friday 2024",
    "description": "Campanha de pontos",
    "isActive": true
  }'
```

**Copie o `_id` retornado** → Este é o `EVENT_ID`

### 3. Criar ações para o evento

```bash
# Ação 1: Cadastro (única vez, 20 pontos)
curl -X POST http://localhost:3000/api/events/EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Completar cadastro",
    "points": 20,
    "allowMultiple": false
  }'

# Ação 2: Compra (múltiplas vezes, 50 pontos)
curl -X POST http://localhost:3000/api/events/EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Realizar compra",
    "points": 50,
    "allowMultiple": true
  }'

# Ação 3: Compartilhar (única vez, 10 pontos)
curl -X POST http://localhost:3000/api/events/EVENT_ID/actions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Compartilhar nas redes",
    "points": 10,
    "allowMultiple": false
  }'
```

**Copie os `_id` das ações** → Estes são os `ACTION_ID`

### 4. Registrar usuário no evento

```bash
curl -X POST http://localhost:3000/api/events/EVENT_ID/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com"
  }'
```

**Copie o `_id` do usuário** → Este é o `USER_ID`

### 5. Usuário realiza ações

```bash
# Completar cadastro
curl -X POST http://localhost:3000/api/users/USER_ID/actions/ACTION_ID_CADASTRO

# Realizar primeira compra
curl -X POST http://localhost:3000/api/users/USER_ID/actions/ACTION_ID_COMPRA

# Compartilhar
curl -X POST http://localhost:3000/api/users/USER_ID/actions/ACTION_ID_COMPARTILHAR

# Realizar segunda compra (funciona pois allowMultiple: true)
curl -X POST http://localhost:3000/api/users/USER_ID/actions/ACTION_ID_COMPRA
```

### 6. Ver ranking

```bash
curl http://localhost:3000/api/events/EVENT_ID/ranking
```

---

## 🎮 Usando o arquivo HTTP

1. Abra `requests-v2.http` no VS Code
2. Instale a extensão "REST Client"
3. Siga o fluxo completo de teste no final do arquivo
4. Clique em "Send Request" em cada etapa

---

## 📊 Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **Eventos** |
| POST | `/api/events` | Criar evento |
| GET | `/api/events` | Listar eventos |
| GET | `/api/events/:id` | Buscar evento |
| PUT | `/api/events/:id` | Atualizar evento |
| DELETE | `/api/events/:id` | Remover evento |
| GET | `/api/events/:id/ranking` | Ranking do evento |
| **Ações** |
| POST | `/api/events/:eventId/actions` | Criar ação |
| GET | `/api/events/:eventId/actions` | Listar ações |
| GET | `/api/actions/:id` | Buscar ação |
| PUT | `/api/actions/:id` | Atualizar ação |
| DELETE | `/api/actions/:id` | Remover ação |
| **Usuários** |
| POST | `/api/events/:eventId/users` | Registrar usuário |
| GET | `/api/users/:id` | Buscar usuário |
| GET | `/api/users/:id/history` | Histórico do usuário |
| **Pontuação** |
| POST | `/api/users/:userId/actions/:actionId` | Realizar ação |

---

## 💡 Conceitos Importantes

### allowMultiple

- **`false`**: Usuário só pode realizar a ação **uma vez**
  - Exemplo: Completar cadastro, Compartilhar nas redes
  
- **`true`**: Usuário pode realizar a ação **múltiplas vezes**
  - Exemplo: Fazer compras, Avaliar produtos

### isActive

- **`true`**: Ação está ativa e pode ser realizada
- **`false`**: Ação está desativada (não pode ser realizada)

### Email Único por Evento

O mesmo email pode participar de **diferentes eventos**, mas não pode se registrar **duas vezes no mesmo evento**.

---

## 🔧 Gerenciar Ações

### Atualizar pontuação de uma ação

```bash
curl -X PUT http://localhost:3000/api/actions/ACTION_ID \
  -H "Content-Type: application/json" \
  -d '{"points": 100}'
```

### Desativar uma ação

```bash
curl -X PUT http://localhost:3000/api/actions/ACTION_ID \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

### Permitir múltiplas execuções

```bash
curl -X PUT http://localhost:3000/api/actions/ACTION_ID \
  -H "Content-Type: application/json" \
  -d '{"allowMultiple": true}'
```

---

## 📖 Documentação Completa

- **API v2.0**: `API_V2_DOCUMENTATION.md`
- **Exemplos Frontend**: `frontend-v2-example.js`
- **Requisições HTTP**: `requests-v2.http`

---

## 🎯 Casos de Uso

### E-commerce
```javascript
Evento: "Black Friday 2024"
Ações:
  - Cadastro: 20 pts (única vez)
  - Compra > R$100: 50 pts (múltiplas)
  - Avaliação: 15 pts (múltiplas)
  - Indicação: 30 pts (múltiplas)
```

### Evento/Conferência
```javascript
Evento: "Tech Summit 2024"
Ações:
  - Check-in: 10 pts (única vez)
  - Assistir palestra: 5 pts (múltiplas)
  - Visitar estande: 2 pts (múltiplas)
  - Preencher pesquisa: 20 pts (única vez)
```

### App/SaaS
```javascript
Evento: "Onboarding Challenge"
Ações:
  - Completar perfil: 25 pts (única vez)
  - Login diário: 5 pts (múltiplas)
  - Convidar usuário: 50 pts (múltiplas)
  - Usar feature: 10 pts (múltiplas)
```

---

## ⚡ Dicas

1. **Teste com requests-v2.http**: Mais fácil que cURL
2. **Salve os IDs**: Anote EVENT_ID, ACTION_IDs e USER_ID
3. **Use isActive**: Desative ações ao invés de deletar
4. **Histórico**: Use `/users/:id/history` para debug
5. **Ranking**: Use `/events/:id/ranking` para leaderboard

---

**Pronto para começar! 🚀**

Execute `npm run dev` e abra `requests-v2.http` para testar!
