# 🎨 Gamification Frontend

Frontend React.js + TypeScript para o Sistema de Gamificação

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones modernos

## 📦 Instalação

```bash
npm install
```

## 🎮 Como Executar

### Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:5173

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Estrutura

```
src/
├── components/          # Componentes React
│   ├── EventList.jsx       # Lista de eventos
│   ├── EventDashboard.jsx  # Dashboard do evento
│   ├── RegistrationForm.jsx # Formulário de registro
│   ├── ActionCard.jsx      # Card de ação
│   ├── Ranking.jsx         # Ranking de usuários
│   └── AdminPanel.jsx      # Painel admin
│
├── services/            # Integração com API
│   └── api.js              # Serviço de API
│
├── App.jsx              # Componente principal
├── main.jsx             # Entry point
└── index.css            # Estilos globais
```

## 🎯 Funcionalidades

### Usuário
- ✅ Visualizar eventos disponíveis
- ✅ Registrar-se em eventos
- ✅ Ver ações disponíveis
- ✅ Realizar ações e ganhar pontos
- ✅ Ver ranking em tempo real
- ✅ Acompanhar própria pontuação

### Interface
- ✅ Design moderno e responsivo
- ✅ Feedback visual de ações
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Navegação intuitiva

## 🔌 Integração com API

O frontend se comunica com a API através do serviço `src/services/api.js`:

```javascript
import { getEvents, registerUser, performAction } from './services/api'

// Buscar eventos
const events = await getEvents()

// Registrar usuário
const user = await registerUser(eventId, { name, email })

// Realizar ação
const result = await performAction(userId, actionId)
```

## 🎨 Componentes

### EventList
Lista todos os eventos disponíveis com informações básicas.

### EventDashboard
Dashboard principal do evento com:
- Formulário de registro
- Ações disponíveis
- Pontuação do usuário
- Ranking

### ActionCard
Card individual de ação com:
- Nome e descrição
- Pontos
- Botão para realizar
- Indicador de repetição

### Ranking
Exibição do ranking com:
- Posições
- Medalhas para top 3
- Destaque do usuário atual

## 🔐 Autenticação

O sistema usa localStorage para manter o usuário logado:

```javascript
// Salvar usuário
localStorage.setItem('currentUser', JSON.stringify(user))

// Recuperar usuário
const user = JSON.parse(localStorage.getItem('currentUser'))

// Logout
localStorage.removeItem('currentUser')
```

## 📱 Responsividade

O frontend é totalmente responsivo usando Tailwind CSS:
- Mobile first
- Breakpoints: sm, md, lg
- Grid adaptativo

## 🎨 Customização

### Cores
Edite `tailwind.config.js` para customizar o tema:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    },
  },
}
```

### Componentes
Todos os componentes são modulares e podem ser facilmente customizados.

## 🚀 Deploy

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Deploy a pasta dist/
```

## 📝 Próximas Melhorias

- [ ] Painel administrativo completo
- [ ] Gráficos e estatísticas
- [ ] Notificações em tempo real
- [ ] Modo escuro
- [ ] Internacionalização (i18n)
- [ ] PWA (Progressive Web App)

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se que a API está configurada com CORS habilitado.

### API não responde
Verifique se a API está rodando em http://localhost:3000

### Tailwind não funciona
Execute `npm install` novamente para garantir que todas as dependências estão instaladas.

---

**Versão:** 1.0.0  
**Framework:** React + Vite  
**UI:** Tailwind CSS
