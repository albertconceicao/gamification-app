# 🚀 Guia Rápido de Início

## 1️⃣ Instalar dependências (já feito!)

```bash
npm install
```

## 2️⃣ Configurar MongoDB

### Opção A: MongoDB Local

Certifique-se de que o MongoDB está instalado e rodando:

```bash
# Iniciar MongoDB
mongod

# Ou com Homebrew no macOS
brew services start mongodb-community
```

### Opção B: MongoDB Atlas (Cloud)

1. Crie uma conta gratuita em https://www.mongodb.com/cloud/atlas
2. Crie um cluster
3. Obtenha a string de conexão
4. Atualize o arquivo `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/points-db
```

## 3️⃣ Iniciar o servidor

### Modo desenvolvimento (com hot reload):

```bash
npm run dev
```

### Modo produção:

```bash
npm run build
npm start
```

## 4️⃣ Testar a API

### Usando curl:

```bash
# 1. Verificar se está funcionando
curl http://localhost:3000/

# 2. Registrar um usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com"}'

# 3. Listar usuários (copie o _id do usuário)
curl http://localhost:3000/api/users

# 4. Adicionar pontos (substitua USER_ID pelo _id copiado)
curl -X POST http://localhost:3000/api/users/USER_ID/action \
  -H "Content-Type: application/json" \
  -d '{"points": 10, "actionType": "comment"}'

# 5. Ver ranking atualizado
curl http://localhost:3000/api/users
```

### Usando o arquivo requests.http:

Se você usa VS Code com a extensão REST Client:

1. Abra o arquivo `requests.http`
2. Clique em "Send Request" acima de cada requisição
3. Substitua os IDs conforme necessário

## 5️⃣ Endpoints disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Health check |
| GET | `/api/users` | Lista todos os usuários |
| POST | `/api/users` | Registra novo usuário |
| GET | `/api/users/:userId` | Busca usuário específico |
| POST | `/api/users/:userId/action` | Adiciona pontos ao usuário |

## 📊 Exemplos de tipos de ação

Veja o arquivo `src/types/actionTypes.ts` para tipos de ação sugeridos:

- **VISIT** (1 ponto) - Visitar o site
- **COMMENT** (5 pontos) - Fazer um comentário
- **LIKE** (2 pontos) - Curtir conteúdo
- **SHARE** (10 pontos) - Compartilhar conteúdo
- **PURCHASE** (50 pontos) - Realizar uma compra
- **REFERRAL** (25 pontos) - Indicar um amigo

## 🔍 Verificar logs

O servidor mostrará:
- ✅ Conexão com MongoDB
- 🚀 Servidor rodando
- 📍 URL de acesso

## ❓ Problemas comuns

### MongoDB não conecta

```bash
# Verifique se o MongoDB está rodando
ps aux | grep mongod

# Ou tente iniciar manualmente
mongod --dbpath /usr/local/var/mongodb
```

### Porta 3000 já em uso

Altere a porta no arquivo `.env`:

```env
PORT=3001
```

## 🎯 Próximos passos

1. Integre a API com seu frontend
2. Adicione autenticação (JWT)
3. Implemente middleware de validação
4. Adicione testes automatizados
5. Configure CI/CD

---

**Pronto!** Sua API está funcionando! 🎉
