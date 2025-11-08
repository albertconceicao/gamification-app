# 🔐 Validações de Segurança - API v2.0

## ✅ Validações Implementadas

### Sistema de Validação de Eventos (Otimizado)

A API garante que **todas as operações** só podem ser realizadas se o evento estiver **cadastrado no banco de dados** e **ativo**.

**Abordagem Otimizada:** Como os usuários já estão vinculados a eventos (eventId obrigatório), validar apenas o evento é suficiente para garantir integridade dos dados, reduzindo custos de processamento.

---

## 🛡️ Middleware de Validação

### `validateEventExists`

Valida se o evento existe e está ativo antes de permitir operações.

**Usado em:**
- ✅ Listar ações de um evento
- ✅ Criar ação em um evento
- ✅ Registrar usuário em um evento

**Validações:**
```javascript
1. Verifica se eventId foi fornecido
2. Busca evento no banco de dados
3. Verifica se evento existe
4. Verifica se evento está ativo (isActive: true)
```

**Respostas de Erro:**

```json
// Evento não encontrado
{
  "success": false,
  "message": "Evento não encontrado no banco de dados",
  "tip": "Verifique se o ID do evento está correto"
}

// Evento inativo
{
  "success": false,
  "message": "Este evento não está ativo",
  "eventName": "Black Friday 2024",
  "tip": "Entre em contato com o administrador para ativar o evento"
}
```

---

## 📍 Validação Inline (Pontuação)

Para a rota de pontuação, a validação do evento é feita **inline** (dentro da própria rota) ao invés de usar middleware, otimizando o processamento.

**Rota:** `POST /api/users/:userId/actions/:actionId`

**Validações:**
```javascript
1. Busca usuário no banco de dados
2. Busca evento do usuário (via user.eventId)
3. Verifica se evento existe
4. Verifica se evento está ativo (isActive: true)
5. Continua com validações de ação
```

**Respostas de Erro:**

```json
// Usuário não encontrado
{
  "success": false,
  "message": "Usuário não encontrado"
}

// Evento não encontrado
{
  "success": false,
  "message": "Evento não encontrado no banco de dados",
  "tip": "O evento pode ter sido removido"
}

// Evento inativo
{
  "success": false,
  "message": "Este evento não está ativo",
  "eventName": "Black Friday 2024",
  "tip": "Não é possível realizar ações em eventos inativos"
}
```

---

## 🎯 Rotas Protegidas

### Ações

```http
# Listar ações - Requer evento ativo
GET /api/events/:eventId/actions
✅ Valida: Evento existe e está ativo

# Criar ação - Requer evento ativo
POST /api/events/:eventId/actions
✅ Valida: Evento existe e está ativo
```

### Usuários

```http
# Registrar usuário - Requer evento ativo
POST /api/events/:eventId/users
✅ Valida (middleware): Evento existe e está ativo

# Realizar ação - Validação inline otimizada
POST /api/users/:userId/actions/:actionId
✅ Valida (inline): Usuário existe
✅ Valida (inline): Evento do usuário existe e está ativo
✅ Valida (inline): Ação existe e está ativa
✅ Valida (inline): Ação pertence ao evento do usuário
✅ Valida (inline): Regra de allowMultiple
```

---

## 🔒 Cenários de Proteção

### Cenário 1: Evento Desativado

```javascript
// Admin desativa evento
PUT /api/events/event123
{ "isActive": false }

// Tentativa de registrar usuário
POST /api/events/event123/users
{ "name": "João", "email": "joao@email.com" }

// ❌ BLOQUEADO
{
  "success": false,
  "message": "Este evento não está ativo",
  "eventName": "Black Friday 2024"
}
```

### Cenário 2: Evento Removido

```javascript
// Admin remove evento
DELETE /api/events/event123

// Usuário tenta realizar ação
POST /api/users/user456/actions/action789

// ❌ BLOQUEADO
{
  "success": false,
  "message": "Evento do usuário não encontrado no banco de dados",
  "tip": "O evento pode ter sido removido"
}
```

### Cenário 3: ID de Evento Inválido

```javascript
// Tentativa com ID inexistente
POST /api/events/999999999999/users
{ "name": "João", "email": "joao@email.com" }

// ❌ BLOQUEADO
{
  "success": false,
  "message": "Evento não encontrado no banco de dados",
  "tip": "Verifique se o ID do evento está correto"
}
```

---

## ✅ Fluxo de Validação

### Registrar Usuário

```
1. Cliente → POST /api/events/:eventId/users
   ↓
2. Middleware validateEventExists
   ├─ Busca evento no DB
   ├─ Verifica se existe
   ├─ Verifica se está ativo
   └─ ✅ Passa para próximo
   ↓
3. Controller
   ├─ Valida nome e email
   ├─ Verifica duplicidade
   └─ Cria usuário
   ↓
4. Resposta → Usuário criado
```

### Realizar Ação (Validação Inline)

```
1. Cliente → POST /api/users/:userId/actions/:actionId
   ↓
2. Controller (validação inline)
   ├─ Busca usuário no DB
   ├─ Busca evento do usuário
   ├─ Verifica se evento existe
   ├─ Verifica se evento está ativo
   ├─ Busca ação
   ├─ Verifica se ação está ativa
   ├─ Verifica se ação pertence ao evento
   ├─ Verifica allowMultiple
   ├─ Registra no histórico
   └─ Adiciona pontos
   ↓
3. Resposta → Pontos adicionados
```

---

## 🎯 Benefícios

### Segurança
- ✅ Impede operações em eventos inexistentes
- ✅ Impede operações em eventos desativados
- ✅ Valida integridade dos dados
- ✅ Protege contra IDs inválidos

### Controle
- ✅ Admin pode desativar evento a qualquer momento
- ✅ Usuários de eventos inativos não podem pontuar
- ✅ Novas ações só em eventos ativos
- ✅ Novos usuários só em eventos ativos

### Experiência
- ✅ Mensagens de erro claras
- ✅ Dicas para resolver problemas
- ✅ Informações contextuais (nome do evento)
- ✅ Feedback imediato

### Otimização de Custos
- ✅ **Validação inline** na rota de pontuação (sem overhead de middleware)
- ✅ **Apenas 1 middleware** para operações diretas em eventos
- ✅ **Redução de processamento**: Usuários já vinculados a eventos
- ✅ **Menos queries**: Validação otimizada e direcionada

---

## 📋 Checklist de Validações

### Antes de Criar Ação
- [ ] Evento existe no DB?
- [ ] Evento está ativo?

### Antes de Registrar Usuário
- [ ] Evento existe no DB?
- [ ] Evento está ativo?
- [ ] Email já existe neste evento?

### Antes de Realizar Ação
- [ ] Usuário existe no DB?
- [ ] Evento do usuário existe no DB?
- [ ] Evento do usuário está ativo?
- [ ] Ação existe no DB?
- [ ] Ação está ativa?
- [ ] Ação pertence ao evento do usuário?
- [ ] Se allowMultiple: false, já foi realizada?

---

## 🔧 Como Desativar um Evento

```bash
# Desativar evento (bloqueia novas operações)
PUT /api/events/:eventId
{
  "isActive": false
}

# Efeitos:
# ❌ Não pode criar novas ações
# ❌ Não pode registrar novos usuários
# ❌ Usuários existentes não podem pontuar
# ✅ Dados históricos preservados
# ✅ Ranking ainda acessível
```

---

## 🔄 Como Reativar um Evento

```bash
# Reativar evento
PUT /api/events/:eventId
{
  "isActive": true
}

# Efeitos:
# ✅ Pode criar novas ações
# ✅ Pode registrar novos usuários
# ✅ Usuários podem pontuar novamente
```

---

## 💡 Boas Práticas

### Para Administradores

1. **Desative ao invés de deletar**
   - Preserve dados históricos
   - Permite reativação futura
   - Mantém integridade referencial

2. **Comunique mudanças**
   - Avise usuários antes de desativar
   - Explique motivo da desativação
   - Informe data de reativação (se aplicável)

3. **Monitore eventos ativos**
   - Revise eventos periodicamente
   - Desative eventos expirados
   - Mantenha apenas eventos relevantes ativos

### Para Desenvolvedores

1. **Sempre valide eventos**
   - Use middlewares fornecidos
   - Não confie em IDs do cliente
   - Valide antes de operações críticas

2. **Trate erros adequadamente**
   - Mostre mensagens claras
   - Forneça contexto útil
   - Sugira ações corretivas

3. **Teste cenários de erro**
   - Evento inexistente
   - Evento desativado
   - IDs inválidos

---

## 📊 Exemplo Completo

```javascript
// 1. Criar evento
const event = await createEvent('Black Friday 2024');
// event._id = "event123"
// event.isActive = true

// 2. Criar ação (✅ Permitido - evento ativo)
await createAction(event._id, 'Compra', 50, true);

// 3. Registrar usuário (✅ Permitido - evento ativo)
const user = await registerUser(event._id, 'João', 'joao@email.com');

// 4. Usuário realiza ação (✅ Permitido - evento ativo)
await performAction(user._id, action._id);

// 5. Admin desativa evento
await updateEvent(event._id, { isActive: false });

// 6. Tentar registrar novo usuário (❌ BLOQUEADO)
await registerUser(event._id, 'Maria', 'maria@email.com');
// Erro: "Este evento não está ativo"

// 7. Usuário existente tenta pontuar (❌ BLOQUEADO)
await performAction(user._id, action._id);
// Erro: "O evento deste usuário não está mais ativo"

// 8. Admin reativa evento
await updateEvent(event._id, { isActive: true });

// 9. Operações funcionam novamente (✅ Permitido)
await performAction(user._id, action._id);
```

---

## 🎯 Resumo

### O que foi implementado:
- ✅ Middleware `validateEventExists` para operações diretas em eventos
- ✅ **Validação inline otimizada** para operações de pontuação
- ✅ Validação automática em todas as rotas críticas
- ✅ Mensagens de erro claras e contextuais
- ✅ Proteção contra eventos inexistentes ou inativos

### Garantias:
- ✅ **Ações só podem ser criadas em eventos ativos**
- ✅ **Usuários só podem ser registrados em eventos ativos**
- ✅ **Pontuação só funciona se evento do usuário está ativo**
- ✅ **Todas as operações validam existência no DB**

### Otimizações:
- ✅ **Custo reduzido**: Apenas 1 middleware + validação inline
- ✅ **Performance**: Validação direcionada sem overhead
- ✅ **Eficiência**: Usuários vinculados a eventos eliminam validações redundantes

---

**Versão:** 2.0.0  
**Status:** ✅ Implementado e Otimizado  
**Segurança:** 🔒 Máxima  
**Performance:** ⚡ Otimizada
