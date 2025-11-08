# ✅ Checklist de Integração Backend + Frontend

## 📋 Status Atual

### Backend (API)
- [x] Dependências instaladas (`pnpm install`)
- [x] Arquivo `.env` configurado
- [x] TypeScript configurado
- [x] Modelos criados (Event, Action, User, UserAction)
- [x] Rotas implementadas
- [x] Middlewares de validação
- [x] CORS habilitado
- [ ] MongoDB rodando
- [ ] Backend iniciado (`pnpm dev`)

### Frontend (React + TypeScript)
- [x] Dependências instaladas (`pnpm install`)
- [x] Arquivo `.env` criado
- [x] TypeScript configurado
- [x] Tipos da API definidos
- [x] Serviço de API tipado
- [x] Componentes criados
- [x] Tailwind CSS configurado
- [x] index.html atualizado para `.tsx`
- [ ] Frontend iniciado (`pnpm dev`)

### Integração
- [x] CORS configurado no backend
- [x] URL da API configurada no frontend
- [x] Tipos compartilhados entre back e front
- [ ] MongoDB conectado
- [ ] Backend e frontend rodando
- [ ] Teste de integração realizado

---

## 🚀 Próximos Passos

### 1. Iniciar MongoDB

Escolha uma opção:

**Opção A: Docker (Recomendado)**
```bash
cd gamification-api
docker-compose up -d
```

**Opção B: MongoDB Local**
```bash
mongod
```

**Opção C: MongoDB Atlas**
- Criar cluster em https://mongodb.com/cloud/atlas
- Atualizar `MONGODB_URI` no `.env`

### 2. Iniciar Backend

```bash
# Terminal 1
cd gamification-api
pnpm dev
```

Aguarde ver:
```
🚀 Servidor rodando na porta 3000
📍 http://localhost:3000
```

### 3. Iniciar Frontend

```bash
# Terminal 2
cd gamification-frontend
pnpm dev
```

Aguarde ver:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 4. Testar Integração

#### 4.1. Verificar Backend
Abra http://localhost:3000 - deve retornar JSON com informações da API

#### 4.2. Verificar Frontend
Abra http://localhost:5173 - deve carregar a interface

#### 4.3. Popular Dados
```bash
# Terminal 3
cd gamification-api
./seed-data.sh
```

#### 4.4. Testar Fluxo Completo
1. Acesse http://localhost:5173
2. Veja o evento "Black Friday 2024"
3. Clique no evento
4. Registre-se com nome e email
5. Veja as ações disponíveis
6. Realize algumas ações
7. Veja seus pontos aumentarem
8. Confira o ranking

---

## 🐛 Troubleshooting

### ❌ Erro: "Cannot connect to MongoDB"

**Causa:** MongoDB não está rodando

**Solução:**
```bash
# Se usando Docker:
cd gamification-api
docker-compose up -d

# Verificar:
docker ps | grep mongo
```

### ❌ Erro: "Network Error" no frontend

**Causa:** Backend não está rodando ou CORS não configurado

**Solução:**
1. Verificar se backend está em http://localhost:3000
2. Verificar `.env` do frontend:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
3. Reiniciar frontend após alterar `.env`

### ❌ Erro: "Port 3000 already in use"

**Solução:**
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar outra porta
# Editar gamification-api/.env
PORT=3001
```

### ❌ Avisos do Tailwind CSS

**Causa:** Normal - avisos do CSS processor

**Ação:** Ignorar - funciona normalmente

---

## 📊 Verificação Final

Marque quando concluir:

- [ ] MongoDB conectado e rodando
- [ ] Backend iniciado sem erros
- [ ] Frontend iniciado sem erros
- [ ] http://localhost:3000 retorna JSON
- [ ] http://localhost:5173 carrega interface
- [ ] Dados de exemplo criados
- [ ] Consegue ver eventos no frontend
- [ ] Consegue se registrar em um evento
- [ ] Consegue realizar ações
- [ ] Pontos são atualizados
- [ ] Ranking é exibido corretamente

---

## 🎉 Tudo Funcionando?

Se todos os itens acima estão marcados, parabéns! 🚀

### Próximos passos:
1. Explorar a interface
2. Criar seus próprios eventos
3. Configurar ações personalizadas
4. Customizar o design
5. Preparar para deploy

---

## 📚 Documentação

- **Setup Completo:** `SETUP_GUIDE.md`
- **API Docs:** `gamification-api/API_V2_DOCUMENTATION.md`
- **Frontend:** `gamification-frontend/README.md`
- **Changelog:** `gamification-api/CHANGELOG_V2.md`

---

**Versão:** 2.0.0  
**Status:** Pronto para desenvolvimento  
**Stack:** Node.js + TypeScript + React + MongoDB
