# 📝 Changelog - v2.0.0

## 🎉 Novidades Principais

### Sistema de Eventos
- ✅ Criação e gerenciamento de múltiplos eventos independentes
- ✅ Cada evento pode ter suas próprias ações e usuários
- ✅ Controle de período (startDate, endDate)
- ✅ Ativação/desativação de eventos (isActive)
- ✅ Estatísticas por evento (total de ações, total de usuários)
- ✅ Ranking específico por evento

### Sistema de Ações Configuráveis
- ✅ Ações específicas por evento
- ✅ Pontuação customizada por ação
- ✅ Controle de repetição (`allowMultiple`)
  - `false`: Ação pode ser realizada apenas uma vez
  - `true`: Ação pode ser realizada múltiplas vezes
- ✅ Ativação/desativação de ações (isActive)
- ✅ CRUD completo de ações
- ✅ Estatísticas de uso por ação

### Sistema de Histórico
- ✅ Registro completo de todas as ações realizadas (UserAction)
- ✅ Rastreamento de quando cada ação foi realizada
- ✅ Histórico completo por usuário
- ✅ Pontos ganhos por ação registrados

### Validações Avançadas
- ✅ **Validação de Evento Ativo**: Todas as operações requerem evento cadastrado e ativo no DB
- ✅ **Middlewares de Segurança**: `validateEventExists` e `validateUserEvent`
- ✅ Validação de ação única/múltipla
- ✅ Verificação se ação pertence ao evento do usuário
- ✅ Verificação se ação está ativa
- ✅ Proteção contra deleção de dados com vínculos
- ✅ Email único por evento (permite mesmo email em eventos diferentes)
- ✅ **Bloqueio automático**: Eventos inativos não permitem novas operações

---

## 🗂️ Novos Models

### Event
```typescript
{
  name: string
  description?: string
  startDate: Date
  endDate?: Date
  isActive: boolean
}
```

### Action
```typescript
{
  eventId: ObjectId
  name: string
  description?: string
  points: number
  allowMultiple: boolean
  isActive: boolean
}
```

### UserAction (Histórico)
```typescript
{
  userId: ObjectId
  eventId: ObjectId
  actionId: ObjectId
  pointsEarned: number
  performedAt: Date
}
```

---

## 🛣️ Novos Endpoints

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `GET /api/events/:eventId` - Buscar evento
- `PUT /api/events/:eventId` - Atualizar evento
- `DELETE /api/events/:eventId` - Remover evento
- `GET /api/events/:eventId/ranking` - Ranking do evento

### Ações
- `GET /api/events/:eventId/actions` - Listar ações do evento
- `POST /api/events/:eventId/actions` - Criar ação
- `GET /api/actions/:actionId` - Buscar ação
- `PUT /api/actions/:actionId` - Atualizar ação
- `DELETE /api/actions/:actionId` - Remover ação

### Usuários (Atualizados)
- `POST /api/events/:eventId/users` - Registrar usuário no evento
- `GET /api/users/:userId` - Buscar usuário (agora com histórico)
- `GET /api/users/:userId/history` - Histórico completo de ações

### Pontuação (Atualizado)
- `POST /api/users/:userId/actions/:actionId` - Realizar ação (novo sistema)

---

## 🔄 Mudanças no Model User

### Adicionado
- `eventId: ObjectId` - Referência ao evento

### Modificado
- Email agora é único por evento (não globalmente)
- Índice composto: `{ eventId: 1, email: 1 }`

---

## 📋 Breaking Changes

### ⚠️ Endpoint de Registro Mudou
**Antes (v1.0):**
```http
POST /api/users
```

**Agora (v2.0):**
```http
POST /api/events/:eventId/users
```

### ⚠️ Endpoint de Pontuação Mudou
**Antes (v1.0):**
```http
POST /api/users/:userId/action
Body: { "points": 10, "actionType": "comment" }
```

**Agora (v2.0):**
```http
POST /api/users/:userId/actions/:actionId
Body: {} (pontos vêm da ação configurada)
```

### ⚠️ Estrutura de Dados
- Usuários agora precisam de `eventId`
- Pontos não são mais passados manualmente, vêm da ação configurada
- Sistema de tipos de ação (`actionTypes.ts`) foi substituído por ações no DB

---

## 📁 Novos Arquivos

### Models
- `src/models/Event.ts`
- `src/models/Action.ts`
- `src/models/UserAction.ts`

### Routes
- `src/routes/eventRoutes.ts`
- `src/routes/actionRoutes.ts`

### Documentação
- `API_V2_DOCUMENTATION.md` - Documentação completa da v2.0
- `QUICK_START_V2.md` - Guia rápido da v2.0
- `CHANGELOG_V2.md` - Este arquivo
- `requests-v2.http` - Exemplos de requisições v2.0
- `frontend-v2-example.js` - Exemplos de integração v2.0

---

## 🎯 Benefícios da v2.0

### Flexibilidade
- Crie quantos eventos quiser
- Configure ações específicas para cada evento
- Ajuste pontuação sem alterar código

### Controle
- Ative/desative ações dinamicamente
- Controle se ações podem ser repetidas
- Gerencie múltiplos eventos simultaneamente

### Rastreabilidade
- Histórico completo de ações
- Auditoria de pontuação
- Estatísticas detalhadas

### Escalabilidade
- Suporta múltiplos eventos concorrentes
- Mesmo usuário pode participar de vários eventos
- Isolamento de dados por evento

---

## 🔧 Compatibilidade

### Banco de Dados
- ⚠️ Requer migração de dados da v1.0
- Novos índices criados automaticamente
- Estrutura de User modificada (adiciona eventId)

### API
- ❌ Não é retrocompatível com v1.0
- Endpoints principais mudaram
- Estrutura de requisições diferente

---

## 📊 Comparação v1.0 vs v2.0

| Recurso | v1.0 | v2.0 |
|---------|------|------|
| Eventos | ❌ | ✅ |
| Ações Configuráveis | ❌ | ✅ |
| Controle de Repetição | ❌ | ✅ |
| Histórico de Ações | ❌ | ✅ |
| Múltiplos Eventos | ❌ | ✅ |
| Pontuação Dinâmica | ❌ | ✅ |
| CRUD de Ações | ❌ | ✅ |
| Ranking por Evento | ❌ | ✅ |

---

## 🚀 Próximos Passos Sugeridos

### v2.1 (Futuro)
- [ ] Autenticação JWT
- [ ] Permissões de administrador
- [ ] Webhooks para eventos
- [ ] Notificações

### v2.2 (Futuro)
- [ ] Sistema de badges/conquistas
- [ ] Níveis de usuário
- [ ] Recompensas por pontos
- [ ] Leaderboard por período

### v3.0 (Futuro)
- [ ] GraphQL API
- [ ] Real-time com WebSockets
- [ ] Analytics dashboard
- [ ] Exportação de dados

---

## 📞 Suporte

- **Documentação**: `API_V2_DOCUMENTATION.md`
- **Guia Rápido**: `QUICK_START_V2.md`
- **Exemplos**: `requests-v2.http` e `frontend-v2-example.js`

---

**Data de Lançamento:** Novembro 2024  
**Versão:** 2.0.0  
**Status:** ✅ Estável
