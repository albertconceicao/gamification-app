# API de Pontuação

API REST desenvolvida com Node.js, Express, TypeScript e MongoDB para gerenciar usuários e sistema de pontuação.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset JavaScript com tipagem
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/points-db
```

3. Certifique-se de que o MongoDB está rodando:

```bash
# Se estiver usando MongoDB local
mongod
```

## 🎮 Como usar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

### Com Docker

```bash
# Iniciar API + MongoDB
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📡 Endpoints da API

### 1. Health Check

```http
GET /
```

Verifica se a API está funcionando.

**Resposta:**
```json
{
  "success": true,
  "message": "API de Pontuação está funcionando!",
  "version": "1.0.0"
}
```

### 2. Listar todos os usuários

```http
GET /api/users
```

Retorna todos os usuários registrados, ordenados por pontuação (maior para menor).

**Resposta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "João Silva",
      "email": "joao@example.com",
      "points": 150,
      "registeredAt": "2024-01-15T10:30:00.000Z",
      "lastAction": "2024-01-20T14:25:00.000Z"
    }
  ]
}
```

### 3. Registrar novo usuário

```http
POST /api/users
```

**Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Maria Santos",
    "email": "maria@example.com",
    "points": 0,
    "registeredAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Adicionar pontos (quando usuário realiza ação)

```http
POST /api/users/:userId/action
```

**Parâmetros:**
- `userId` - ID do usuário (na URL)

**Body (opcional):**
```json
{
  "points": 10,
  "actionType": "comment"
}
```

Se não informar `points`, será adicionado 1 ponto por padrão.

**Resposta:**
```json
{
  "success": true,
  "message": "10 ponto(s) adicionado(s) com sucesso",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "totalPoints": 160,
    "pointsAdded": 10,
    "actionType": "comment"
  }
}
```

### 5. Buscar usuário específico

```http
GET /api/users/:userId
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@example.com",
    "points": 160,
    "registeredAt": "2024-01-15T10:30:00.000Z",
    "lastAction": "2024-01-20T14:25:00.000Z"
  }
}
```

## 🎯 Exemplos de uso

### Registrar um usuário

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com"
  }'
```

### Adicionar pontos quando usuário comenta

```bash
curl -X POST http://localhost:3000/api/users/507f1f77bcf86cd799439011/action \
  -H "Content-Type: application/json" \
  -d '{
    "points": 5,
    "actionType": "comment"
  }'
```

### Listar ranking de usuários

```bash
curl http://localhost:3000/api/users
```

## 📁 Estrutura do projeto

```
.
├── src/
│   ├── config/
│   │   └── database.ts      # Configuração do MongoDB
│   ├── models/
│   │   └── User.ts          # Model do usuário
│   ├── routes/
│   │   └── userRoutes.ts    # Rotas da API
│   └── server.ts            # Servidor Express
├── .env                     # Variáveis de ambiente (não versionado)
├── .env.example             # Exemplo de variáveis
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Segurança

- Emails são armazenados em lowercase
- Validação de dados obrigatórios
- Verificação de duplicidade de email
- Tratamento de erros em todas as rotas

## 📝 Licença

ISC
