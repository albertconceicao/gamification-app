# 🏆 Ranking Embedável - Guia de Uso

## 📍 URL Base

```
http://localhost:5173/embed/ranking/{EVENT_ID}
```

Substitua `{EVENT_ID}` pelo ID do evento que você quer exibir o ranking.

---

## 🎨 Parâmetros de Customização (Query String)

Você pode personalizar a aparência e comportamento do ranking usando parâmetros na URL:

### **limit** (número)
Quantidade de participantes a exibir (padrão: 10)

```
?limit=20
```

### **theme** (light | dark | custom)
Tema visual do ranking (padrão: light)

```
?theme=dark
```

- **light**: Fundo branco, ideal para sites claros
- **dark**: Fundo escuro, ideal para sites com tema dark
- **custom**: Fundo transparente, se adapta ao site

### **showEmail** (true | false)
Exibir ou ocultar emails dos participantes (padrão: true)

```
?showEmail=false
```

### **refresh** (número em segundos)
Atualização automática do ranking (padrão: 0 = desativado)

```
?refresh=30
```

### **title** (texto)
Título personalizado do ranking (padrão: "Ranking")

```
?title=Top%20Vendedores
```

---

## 📋 Exemplos de URLs Completas

### Exemplo 1: Ranking básico (top 10)
```
http://localhost:5173/embed/ranking/673e5a1b2c4d5e6f7a8b9c0d
```

### Exemplo 2: Top 20 com tema escuro
```
http://localhost:5173/embed/ranking/673e5a1b2c4d5e6f7a8b9c0d?limit=20&theme=dark
```

### Exemplo 3: Top 50 sem emails
```
http://localhost:5173/embed/ranking/673e5a1b2c4d5e6f7a8b9c0d?limit=50&showEmail=false
```

### Exemplo 4: Atualização automática a cada 30 segundos
```
http://localhost:5173/embed/ranking/673e5a1b2c4d5e6f7a8b9c0d?refresh=30
```

### Exemplo 5: Configuração completa
```
http://localhost:5173/embed/ranking/673e5a1b2c4d5e6f7a8b9c0d?limit=15&theme=custom&showEmail=false&refresh=60&title=Ranking%20Black%20Friday
```

---

## 🌐 Código HTML para Iframe

### Básico
```html
<iframe 
  src="http://localhost:5173/embed/ranking/SEU_EVENT_ID"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="auto"
></iframe>
```

### Com parâmetros customizados
```html
<iframe 
  src="http://localhost:5173/embed/ranking/SEU_EVENT_ID?limit=20&theme=custom&showEmail=false&refresh=30"
  width="100%"
  height="800"
  frameborder="0"
  scrolling="auto"
  style="border: none; border-radius: 8px;"
></iframe>
```

### Responsivo
```html
<div style="position: relative; padding-bottom: 75%; height: 0; overflow: hidden;">
  <iframe 
    src="http://localhost:5173/embed/ranking/SEU_EVENT_ID?theme=custom"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    scrolling="auto"
  ></iframe>
</div>
```

---

## 🎯 Como Obter o Event ID

1. Acesse o painel administrativo
2. Na lista de eventos, o ID está disponível na URL ou nos dados do evento
3. Você também pode obtê-lo via API: `GET /api/events`

Exemplo de resposta da API:
```json
{
  "data": [
    {
      "_id": "673e5a1b2c4d5e6f7a8b9c0d",  ← Este é o Event ID
      "name": "Black Friday 2024",
      ...
    }
  ]
}
```

---

## 🚀 Instalação e Execução

### 1. Instalar dependências
```bash
cd gamification-frontend
pnpm install
```

### 2. Iniciar servidor de desenvolvimento
```bash
pnpm dev
```

### 3. Acessar a URL do ranking
```
http://localhost:5173/embed/ranking/{EVENT_ID}
```

---

## 🎨 Temas Disponíveis

### Light (Padrão)
- Fundo branco
- Texto escuro
- Ideal para sites com fundo claro

### Dark
- Fundo escuro (#111827)
- Texto claro
- Ideal para sites com tema dark

### Custom
- Fundo transparente
- Se adapta ao background do site
- Ideal para integração perfeita

---

## 📊 Recursos Visuais

✅ **Top 3 Destacado**
- 🥇 1º Lugar: Troféu dourado + coroa + fundo gradiente
- 🥈 2º Lugar: Medalha de prata + fundo gradiente
- 🥉 3º Lugar: Medalha de bronze + fundo gradiente

✅ **Atualização Automática**
- Indicador visual quando ativo
- Atualização silenciosa em background

✅ **Responsivo**
- Adapta-se a diferentes tamanhos de tela
- Mobile-friendly

✅ **Performance**
- Carregamento rápido
- Atualização otimizada

---

## 🔧 Troubleshooting

### Ranking não carrega
- Verifique se o Event ID está correto
- Confirme que a API está rodando
- Verifique a URL da API no arquivo `.env`

### Iframe não aparece
- Verifique as configurações de CORS da API
- Teste a URL diretamente no navegador primeiro

### Atualização automática não funciona
- Certifique-se de que o parâmetro `refresh` está em segundos
- Valor mínimo recomendado: 10 segundos

---

## 📝 Notas de Produção

Quando for para produção, substitua:

```
http://localhost:5173
```

Por:

```
https://seu-dominio.com
```

Exemplo:
```html
<iframe 
  src="https://gamification.seusite.com/embed/ranking/673e5a1b2c4d5e6f7a8b9c0d?limit=20&theme=custom"
  width="100%"
  height="600"
  frameborder="0"
></iframe>
```
