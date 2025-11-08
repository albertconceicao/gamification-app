# 🚀 Guia de Deploy

Este guia mostra como fazer deploy da API em diferentes plataformas.

## 📦 Opções de Deploy

### 1. Railway (Recomendado - Grátis)

[Railway](https://railway.app/) oferece deploy gratuito com MongoDB incluído.

**Passos:**

1. Crie conta no Railway
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Conecte seu repositório
4. Adicione MongoDB:
   - Clique em "+ New"
   - Selecione "Database" → "Add MongoDB"
5. Configure variáveis de ambiente:
   - Vá em Settings → Variables
   - Adicione: `MONGODB_URI` (copie da aba MongoDB)
   - Adicione: `PORT` (Railway define automaticamente)
6. Deploy automático!

**Comando de build:**
```
npm run build
```

**Comando de start:**
```
npm start
```

---

### 2. Render (Grátis)

[Render](https://render.com/) oferece plano gratuito.

**Passos:**

1. Crie conta no Render
2. New → Web Service
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** points-api
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Adicione variáveis de ambiente:
   - `MONGODB_URI`: Use MongoDB Atlas (veja abaixo)
   - `PORT`: 3000
6. Create Web Service

---

### 3. Heroku

**Passos:**

1. Instale Heroku CLI:
```bash
brew install heroku/brew/heroku
```

2. Login:
```bash
heroku login
```

3. Crie app:
```bash
heroku create points-api
```

4. Adicione MongoDB (mLab):
```bash
heroku addons:create mongolab:sandbox
```

5. Deploy:
```bash
git push heroku main
```

6. Abra app:
```bash
heroku open
```

---

### 4. Vercel (Serverless)

**Nota:** Vercel é melhor para frontend, mas pode hospedar APIs serverless.

1. Instale Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

---

### 5. DigitalOcean App Platform

1. Crie conta no DigitalOcean
2. Apps → Create App
3. Conecte GitHub
4. Configure:
   - **Type:** Web Service
   - **Build Command:** `npm run build`
   - **Run Command:** `npm start`
5. Adicione MongoDB (Database)
6. Deploy

---

### 6. Docker + VPS

Se você tem um VPS (AWS, DigitalOcean, Linode, etc.):

1. Instale Docker no servidor:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

2. Clone repositório:
```bash
git clone seu-repositorio.git
cd seu-repositorio
```

3. Inicie com Docker Compose:
```bash
docker-compose up -d
```

4. Configure Nginx como reverse proxy (opcional):
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🗄️ MongoDB Cloud (MongoDB Atlas)

Para qualquer plataforma que não inclua MongoDB:

1. Crie conta gratuita em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie cluster (M0 - Free)
3. Configure acesso:
   - Database Access → Add User
   - Network Access → Add IP (0.0.0.0/0 para permitir todos)
4. Obtenha connection string:
   - Connect → Connect your application
   - Copie a URI
5. Atualize variável de ambiente:
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/points-db
```

---

## 🔐 Variáveis de Ambiente

Certifique-se de configurar estas variáveis em produção:

```env
PORT=3000
MONGODB_URI=sua-connection-string-mongodb
NODE_ENV=production
```

---

## ✅ Checklist Pré-Deploy

- [ ] Código commitado no Git
- [ ] `.env` no `.gitignore`
- [ ] MongoDB configurado (local ou Atlas)
- [ ] Variáveis de ambiente definidas
- [ ] Build testado localmente (`npm run build`)
- [ ] Testes passando (se houver)

---

## 🧪 Testar Deploy

Após deploy, teste os endpoints:

```bash
# Substitua pela URL do seu deploy
API_URL="https://sua-api.railway.app"

# Health check
curl $API_URL/

# Registrar usuário
curl -X POST $API_URL/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "email": "teste@example.com"}'

# Listar usuários
curl $API_URL/api/users
```

---

## 📊 Monitoramento

### Railway
- Logs em tempo real no dashboard
- Métricas de CPU/RAM

### Render
- Logs na aba "Logs"
- Métricas no dashboard

### Heroku
```bash
heroku logs --tail
```

---

## 🔄 Atualizações

### Git-based (Railway, Render, Heroku)
Simplesmente faça push para o repositório:
```bash
git add .
git commit -m "Update"
git push
```

Deploy automático será acionado!

### Docker
```bash
git pull
docker-compose down
docker-compose up -d --build
```

---

## 💰 Custos

| Plataforma | Plano Gratuito | Limitações |
|------------|----------------|------------|
| Railway | Sim | $5 crédito/mês |
| Render | Sim | Sleep após inatividade |
| Heroku | Sim (limitado) | 550h/mês |
| Vercel | Sim | Serverless limits |
| MongoDB Atlas | Sim | 512MB storage |

---

## 🆘 Troubleshooting

### Erro de conexão MongoDB
- Verifique se `MONGODB_URI` está correta
- Confirme que IP está liberado no Atlas
- Teste conexão local primeiro

### Porta já em uso
- Certifique-se que `PORT` está definido corretamente
- Plataformas como Railway definem PORT automaticamente

### Build falha
- Verifique logs de build
- Teste `npm run build` localmente
- Confirme que todas dependências estão no `package.json`

---

**Recomendação:** Para começar, use **Railway** ou **Render** + **MongoDB Atlas**. São gratuitos e fáceis de configurar!
