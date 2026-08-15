# 🎨 Frontend - Controle Financeiro

## 📁 Estrutura

```
frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── Login.css
│   │   └── Dashboard.css
│   └── App.jsx
├── package.json
└── vite.config.js
```

## 🧩 Componentes Principais

### Dashboard.jsx

Funcionalidades:
- ✅ Cards com receitas, despesas e saldo
- ✅ GrÆ¢fico de barras (receitas vs despesas)
- ✅ Filtro por mŒs/ano
- ✅ FormulÆ¢rio de nova transaçª£o
- ✅ Lista de transaçªµes com ediçª£o/exclusÆ£o
- ✅ Transaçªµes recorrentes com parcelas
- ✅ Modal de ediçª£o
- ✅ BotÆ£o para gerar PDF

### Login.jsx

Funcionalidades:
- ✅ Login com email/senha
- ✅ Cadastro de novo usuÆ¡rio
- ✅ Integraçª£o com AuthContext

## 🎨 Estilizaçª£o

- CSS3 puro
- Design responsivo
- Cards coloridos por tipo (verde=receita, vermelho=despesa, azul=saldo)
- Badges para transaçªµes recorrentes

## 🚀 Como rodar

```bash
# Instalar dependŒncias
npm install

# Iniciar desenvolvimento
npm run dev
```

## 📝 Exemplo: Adicionar transaçª£o recorrente

1. Preencha descriçª£o, valor, data
2. Selecione tipo (receita/despesa) e categoria
3. Marque "Recorrente?"
4. Escolha frequŒncia (diÆ¡ria, semanal, mensal)
5. Informe quantidade de parcelas (ex: 12)
6. Clique em "Adicionar"

**Resultado:** Transaçªµes criadas automaticamente para cada mŒs!