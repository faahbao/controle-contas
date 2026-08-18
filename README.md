# Controle de Contas

Sistema web para controle financeiro pessoal, com autenticacao, receitas, despesas, categorias, transacoes recorrentes parceladas, pagamento de despesas, visualizacao de parcelas futuras e relatorios em PDF.

## Tecnologias

### Backend
- Node.js
- Express
- Prisma ORM
- SQLite
- JSON Web Token
- bcrypt
- Joi
- Helmet
- CORS
- PDFKit

### Frontend
- React
- Vite
- Axios
- React Router
- CSS

## Funcionalidades

- Cadastro e login de usuarios com JWT
- Rotas protegidas por usuario autenticado
- Criacao, edicao e exclusao de transacoes
- Receitas e despesas separadas por tipo
- Categorias pre-definidas e categorias personalizadas
- Transacoes recorrentes diarias, semanais ou mensais
- Geracao automatica de parcelas
- Exclusao somente da parcela selecionada
- Exclusao da parcela selecionada e das parcelas futuras
- Marcacao de despesas como pagas ou pendentes
- Selecao de varias despesas para pagamento em lote
- Pagamento antecipado de parcelas futuras
- Visualizacao do mes selecionado ou de todas as parcelas
- Dashboard com receitas, despesas, saldo e grafico
- Geracao de relatorio PDF
- Interface responsiva

## Estrutura

```text
controle-contas/
|-- backend/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   `-- migrations/
|   |-- src/
|   |   |-- controllers/
|   |   |-- jobs/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- db.js
|   |   `-- server.js
|   |-- .env
|   `-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- contexts/
|   |   |-- pages/
|   |   |   |-- Login.jsx
|   |   |   `-- Dashboard.jsx
|   |   |-- services/
|   |   |-- styles/
|   |   `-- App.jsx
|   `-- package.json
|
|-- README.md
|-- API.md
|-- BACKEND.md
|-- FRONTEND.md
|-- FEATURES.md
|-- INSTALL.md
|-- QUICKSTART.md
|-- PROJECT_STRUCTURE.md
|-- CHANGELOG.md
|-- SUMMARY.md
|-- UPDATES_V1.1.md
`-- VISUAL_GUIDE.md
```

## Documentacao

- [INSTALL.md](./INSTALL.md) - Guia de instalacao
- [QUICKSTART.md](./QUICKSTART.md) - Inicio rapido
- [API.md](./API.md) - Documentacao da API
- [BACKEND.md](./BACKEND.md) - Detalhes do backend
- [FRONTEND.md](./FRONTEND.md) - Detalhes do frontend
- [FEATURES.md](./FEATURES.md) - Funcionalidades
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Estrutura do projeto

## Licenca

MIT