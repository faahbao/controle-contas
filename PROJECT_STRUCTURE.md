# Estrutura do Projeto

Visao detalhada da organizacao de arquivos e diretorios do projeto Controle de Contas.

## Visao Geral

```text
controle-contas/
├── backend/                 # API Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma    # Modelo de dados
│   │   └── migrations/      # Migracoes do banco
│   ├── src/
│   │   ├── controllers/     # Controladores de rotas
│   │   ├── jobs/            # Tarefas agendadas (se houver)
│   │   ├── middleware/      # Middlewares (auth, validacao)
│   │   ├── routes/          # Definicao de rotas
│   │   ├── db.js            # Conexao com banco
│   │   └── server.js        # Entry point do servidor
│   ├── .env                 # Variaveis de ambiente (nao commitar)
│   ├── .env.example         # Template de variaveis
│   └── package.json         # Dependencias backend
│
├── frontend/                # Aplicacao React + Vite
│   ├── src/
│   │   ├── contexts/        # Contextos React (AuthContext)
│   │   ├── pages/           # Paginas da aplicacao
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/        # Chamadas API (api.js)
│   │   ├── styles/          # Estilos CSS
│   │   │   ├── Login.css
│   │   │   └── Dashboard.css
│   │   └── App.jsx          # Componente raiz
│   ├── index.html           # HTML base
│   ├── package.json         # Dependencias frontend
│   └── vite.config.js       # Configuracao Vite
│
├── README.md                # Documentacao principal
├── INSTALL.md               # Guia de instalacao
├── QUICKSTART.md            # Guia rapido de inicio
├── API.md                   # Documentacao da API
├── BACKEND.md               # Detalhes do backend
├── FRONTEND.md              # Detalhes do frontend
├── FEATURES.md              # Funcionalidades
├── PROJECT_STRUCTURE.md     # Estrutura detalhada
├── CHANGELOG.md             # Historico de versoes
├── SUMMARY.md               # Resumo do projeto
├── UPDATES_V1.1.md          # Mudancas da versao 1.1 (historico)
└── VISUAL_GUIDE.md          # Guia visual da interface
```

## Backend

### Tecnologias

- **Node.js** 20+
- **Express** - Framework HTTP
- **Prisma ORM** - ORM type-safe
- **SQLite** - Banco de dados local
- **JWT** - Autenticacao
- **bcrypt** - Hash de senhas
- **Joi** - Validacao de dados
- **Helmet** - Seguranca HTTP
- **CORS** - Compartilhamento de recursos
- **PDFKit** - Geracao de PDF

### Estrutura de Pastas

```text
backend/src/
├── controllers/     # Handlers de rotas HTTP
├── middleware/      # Auth, validacao, error handling
├── routes/          # Definicao de endpoints
├── jobs/            # Tarefas agendadas (opcional)
├── db.js            # Conexao com banco de dados
└── server.js        # Configuracao e inicializacao
```

### Scripts Disponiveis

```json
{
  "dev": "node src/server.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio"
}
```

## Frontend

### Tecnologias

- **React** 18+
- **Vite** - Build tool
- **Axios** - Cliente HTTP
- **React Router DOM** - Roteamento
- **CSS3** - Estilizacao

### Estrutura de Pastas

```text
frontend/src/
├── contexts/        # Contextos React (AuthContext)
├── pages/           # Componentes de pagina
│   ├── Login.jsx
│   └── Dashboard.jsx
├── services/        # API client e chamadas
│   └── api.js
├── styles/          # Estilos CSS
│   ├── Login.css
│   └── Dashboard.css
├── App.jsx          # Componente raiz
└── main.jsx         # Ponto de entrada
```

### Scripts Disponiveis

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## Fluxo de Dados

```text
Usuario -> Frontend (React) -> API (Express) -> Prisma -> SQLite
         <- Resposta <-
```

## Variaveis de Ambiente

### Backend

| Variavel | Descricao | Exemplo |
|---|---|---|
| DATABASE_URL | URL do banco SQLite | file:./dev.db?connection_limit=1 |
| JWT_SECRET | Chave secreta JWT | sua-chave-secreta |
| PORT | Porta do servidor | 3000 |
| FRONTEND_URL | Origem do frontend | http://localhost:3001 |

### Frontend

| Variavel | Descricao | Exemplo |
|---|---|---|
| VITE_API_URL | URL da API backend | http://localhost:3000/api |

## Comandos de Desenvolvimento

### Iniciar projeto completo

```powershell
# Terminal 1 - Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Banco de Dados

### Resetar banco

```powershell
cd backend
npx prisma migrate dev --force-reset
npx prisma generate
```

### Visualizar dados

```powershell
cd backend
npx prisma studio
```

### Criar nova migracao

```powershell
cd backend
npx prisma migrate dev --name nome_da_migracao
npx prisma generate
```

## Padroes de Codigo

### Backend

- Controllers: `camelCase.js` (ex: `transacaoController.js`)
- Middleware: `camelCase.js` (ex: `authMiddleware.js`)
- Rotas: `camelCase.js` (ex: `transacaoRoutes.js`)

### Frontend

- Componentes: `PascalCase.jsx` (ex: `Dashboard.jsx`)
- Contextos: `PascalCase.jsx` (ex: `AuthContext.jsx`)
- Servicos: `camelCase.js` (ex: `api.js`)
- Estilos: `PascalCase.css` (ex: `Dashboard.css`)

---

Para mais detalhes, consulte [README.md](./README.md)