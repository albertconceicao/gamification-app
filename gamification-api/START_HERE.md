# 👋 Comece Aqui!

## ✅ Projeto Criado com Sucesso!

Sua API de Pontuação está pronta para uso. Aqui está tudo que você precisa saber:

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| **README.md** | Documentação completa da API |
| **QUICK_START.md** | Guia rápido para começar |
| **PROJECT_SUMMARY.md** | Resumo do projeto e estrutura |
| **DEPLOY.md** | Guia de deploy em produção |
| **START_HERE.md** | Este arquivo |

---

## 🚀 Primeiros Passos

### 1. Instalar dependências (✅ Já feito!)

```bash
npm install
```

### 2. Configurar MongoDB

Você tem 3 opções:

#### Opção A: MongoDB Local (Mais rápido para testar)
```bash
# Instalar MongoDB (macOS)
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community
```

#### Opção B: MongoDB Atlas (Cloud - Grátis)
1. Acesse https://www.mongodb.com/cloud/atlas
2. Crie conta gratuita
3. Crie cluster M0 (free)
4. Copie connection string
5. Cole no arquivo `.env`

#### Opção C: Docker (Mais fácil)
```bash
docker-compose up -d
```

### 3. Iniciar servidor

```bash
npm run dev
```

Você verá:
```
✅ MongoDB conectado com sucesso
🚀 Servidor rodando na porta 3000
📍 http://localhost:3000
```

### 4. Testar API

Abra outro terminal e execute:

```bash
# Teste rápido
curl http://localhost:3000/

# Ou execute o script de testes completo
./test-api.sh
```

---

## 🎯 O que a API faz?

1. **Registra usuários** que se cadastram no seu site
2. **Adiciona pontos** quando usuários realizam ações
3. **Mostra ranking** de usuários por pontuação

---

## 📡 Endpoints Principais

```bash
# 1. Registrar usuário
POST /api/users
Body: { "name": "João", "email": "joao@email.com" }

# 2. Adicionar pontos
POST /api/users/{userId}/action
Body: { "points": 10, "actionType": "comment" }

# 3. Ver ranking
GET /api/users
```

---

## 🧪 Testar Agora

### Opção 1: Script Automático
```bash
./test-api.sh
```

### Opção 2: Arquivo HTTP (VS Code)
1. Instale extensão "REST Client"
2. Abra `requests.http`
3. Clique em "Send Request"

### Opção 3: cURL Manual
```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "email": "teste@email.com"}'

# Copie o _id retornado e use abaixo
curl -X POST http://localhost:3000/api/users/SEU_USER_ID/action \
  -H "Content-Type: application/json" \
  -d '{"points": 10, "actionType": "comment"}'

# Ver ranking
curl http://localhost:3000/api/users
```

---

## 🎨 Integrar com Frontend

Veja exemplos completos em `frontend-example.js`:

```javascript
// Registrar usuário
const user = await fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'João', email: 'joao@email.com' })
});

// Adicionar pontos
await fetch(`http://localhost:3000/api/users/${userId}/action`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ points: 5, actionType: 'comment' })
});
```

---

## 📁 Estrutura do Projeto

```
features/
├── src/
│   ├── config/database.ts       # Conexão MongoDB
│   ├── models/User.ts           # Schema do usuário
│   ├── routes/userRoutes.ts     # Rotas da API
│   ├── types/actionTypes.ts     # Tipos de ações
│   └── server.ts                # Servidor principal
│
├── .env                         # Suas configurações
├── package.json                 # Dependências
├── README.md                    # Documentação completa
└── QUICK_START.md               # Guia rápido
```

---

## 💡 Tipos de Ação Sugeridos

Veja `src/types/actionTypes.ts`:

- **VISIT** (1 pt) - Visitar site
- **LIKE** (2 pts) - Curtir
- **COMMENT** (5 pts) - Comentar
- **SHARE** (10 pts) - Compartilhar
- **REVIEW** (15 pts) - Avaliar
- **REFERRAL** (25 pts) - Indicar amigo
- **PURCHASE** (50 pts) - Comprar

Você pode personalizar conforme necessário!

---

## 🐛 Problemas Comuns

### MongoDB não conecta
```bash
# Verifique se está rodando
brew services list | grep mongodb

# Ou inicie manualmente
mongod
```

### Porta 3000 em uso
Mude no arquivo `.env`:
```env
PORT=3001
```

### Dependências faltando
```bash
npm install
```

---

## 🚀 Próximos Passos

1. ✅ **Testar localmente** (você está aqui!)
2. 📱 **Integrar com seu frontend**
3. 🔐 **Adicionar autenticação** (JWT)
4. 🚀 **Fazer deploy** (veja DEPLOY.md)
5. 📊 **Adicionar analytics**

---

## 📞 Arquivos de Ajuda

- **Dúvidas sobre API?** → Leia `README.md`
- **Como começar rápido?** → Leia `QUICK_START.md`
- **Estrutura do projeto?** → Leia `PROJECT_SUMMARY.md`
- **Como fazer deploy?** → Leia `DEPLOY.md`
- **Exemplos de código?** → Veja `frontend-example.js`
- **Testar endpoints?** → Use `requests.http` ou `test-api.sh`

---

## ✨ Comandos Úteis

```bash
# Desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start

# Com Docker
docker-compose up -d

# Testar API
./test-api.sh
```

---

## 🎉 Tudo Pronto!

Sua API está funcionando! Agora você pode:

1. Testar os endpoints
2. Integrar com seu frontend
3. Personalizar as ações e pontos
4. Fazer deploy em produção

**Dica:** Comece testando com `./test-api.sh` para ver tudo funcionando!

---

**Precisa de ajuda?** Consulte os arquivos de documentação listados acima. Cada um tem informações detalhadas sobre diferentes aspectos do projeto.

**Boa sorte! 🚀**
