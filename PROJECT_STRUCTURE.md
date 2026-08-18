# Estrutura do Projeto

```text
controle-contas/
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   |-- src/
|   |   |-- controllers/
|   |   |-- jobs/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- db.js
|   |   `-- server.js
|   |-- .env
|   |-- package.json
|   `-- dev.db
|
|-- frontend/
|   |-- src/
|   |   |-- contexts/
|   |   |   `-- AuthContext.jsx
|   |   |-- pages/
|   |   |   |-- Dashboard.jsx
|   |   |   `-- Login.jsx
|   |   |-- services/
|   |   |   `-- api.js
|   |   |-- styles/
|   |   |   |-- Dashboard.css
|   |   |   `-- Login.css
|   |   `-- App.jsx
|   |-- package.json
|   `-- vite.config.js
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

## Backend

### `backend/src/server.js`

Servidor Express e rotas da API.

### `backend/prisma/schema.prisma`

Modelo Prisma para:

- User
- Transacao
- Categoria

### `backend/.env`

Variaveis de ambiente e URL SQLite.

## Frontend

### `frontend/src/pages/Dashboard.jsx`

Tela principal do sistema.

Inclui:

- Formulario de transacao
- Parcelas
- Pagamentos
- Visualizacao de todas as parcelas
- Dashboard
- Relatorio PDF

### `frontend/src/services/api.js`

Cliente Axios para chamadas ao backend.

### `frontend/src/contexts/AuthContext.jsx`

Controle de autenticacao, token e usuario logado.

### `frontend/src/styles/Dashboard.css`

Estilos da tela principal, botoes, lista de transacoes, status pago e layout responsivo.