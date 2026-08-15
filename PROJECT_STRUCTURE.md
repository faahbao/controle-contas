# Estrutura do Projeto

Visao detalhada da organizacao de arquivos e diretorios do projeto Controle de Contas.

## Visao Geral

```
controle-contas/
├── backend/                 # API Node.js + TypeScript
│   ├── src/                # Codigo fonte backend
│   │   ├── controllers/    # Controladores de rotas
│   │   ├── middleware/     # Middlewares (auth, validacao)
│   │   ├── routes/         # Definicao de rotas
│   │   ├── services/       # Logica de negocio
│   │   ├── repositories/   # Acesso a dados
│   │   └── index.ts        # Entry point
│   ├── prisma/             # Schema e migrations Prisma
│   │   └── schema.prisma   # Modelo de dados
│   ├── .env.example        # Template de variaveis
│   ├── .gitignore          # Ignorados do Git
│   ├── package.json        # Dependencias backend
│   ├── tsconfig.json       # Configuracao TypeScript
│   └── .env                # Variaveis ambiente (nao commitar)
│
├── frontend/               # Aplicacao React + Vite
│   ├── src/               # Codigo fonte frontend
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Paginas da aplicacao
│   │   ├── services/      # Chamadas API
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Hooks customizados
│   │   ├── types/         # Tipos TypeScript
│   │   ├── App.tsx        # Componente raiz
│   │   └── main.tsx       # Entry point
│   ├── public/            # Assets estaticos
│   ├── .env.example       # Template de variaveis
│   ├── index.html         # HTML base
│   ├── package.json       # Dependencias frontend
│   ├── tsconfig.json      # Configuracao TypeScript
│   ├── vite.config.js     # Configuracao Vite
│   ├── tailwind.config.js # Configuracao Tailwind
│   └── .env               # Variaveis ambiente (nao commitar)
│
├── .gitignore             # Ignorados do Git (raiz)
├── README.md              # Documentacao principal
├── QUICKSTART.md          # Guia rapido de inicio
├── CHANGELOG.md           # Historico de versoes
├── SUMMARY.md             # Resumo do projeto
├── VISUAL_GUIDE.md        # Guia visual da interface
├── UPDATES_V1.1.md        # Mudancas da versao 1.1
├── setup.bat              # Script setup Windows
├── setup.sh               # Script setup Linux/Mac
├── start-all.bat          # Inicia tudo (Windows)
├── start-backend.bat      # Inicia backend (Windows)
└── start-frontend.bat     # Inicia frontend (Windows)
```

## Backend

### Tecnologias

- **Node.js** 20+
- **TypeScript**
- **Express/Fastify** - Framework HTTP
- **Prisma ORM** - ORM type-safe
- **SQLite** - Banco de dados
- **JWT** - Autenticacao
- **bcryptjs** - Hash de senhas

### Estrutura de Pastas

```
backend/src/
├── controllers/     # Handlers de rotas HTTP
├── middleware/      # Auth, validacao, error handling
├── routes/          # Definicao de endpoints
├── services/        # Regras de negocio
├── repositories/    # Acesso ao banco de dados
└── index.ts         # Configuracao e inicializacao
```

### Scripts Disponiveis

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "prisma:generate": "prisma generate",
  "prisma:push": "prisma db push",
  "prisma:studio": "prisma studio"
}
```

## Frontend

### Tecnologias

- **React** 18+
- **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Estilizacao
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP

### Estrutura de Pastas

```
frontend/src/
├── components/    # Componentes reutilizaveis
├── pages/         # Componentes de pagina
├── services/      # API client e chamadas
├── contexts/      # Contextos React (auth, theme)
├── hooks/         # Hooks customizados
├── types/         # Tipos e interfaces TypeScript
├── utils/         # Funcoes utilitarias
├── App.tsx        # Componente raiz
└── main.tsx       # Ponto de entrada
```

### Scripts Disponiveis

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx"
}
```

## Fluxo de Dados

```
Usuario → Frontend (React) → API (Express) → Prisma → SQLite
         ↑                                        ↓
         └────────────── Resposta ────────────────┘
```

## Variaveis de Ambiente

### Backend

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| DATABASE_URL | URL do banco SQLite | file:./dev.db |
| JWT_SECRET | Chave secreta JWT | sua-chave-secreta |
| PORT | Porta do servidor | 3000 |

### Frontend

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| VITE_API_URL | URL da API backend | http://localhost:3000/api |

## Comandos de Desenvolvimento

### Iniciar projeto completo

```bash
# Windows
start-all.bat

# Linux/Mac (manual)
cd backend && npm run dev &
cd frontend && npm run dev
```

### Rodar separadamente

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Banco de Dados

### Resetar banco

```bash
cd backend
npx prisma db push --force-reset
npx prisma generate
```

### Visualizar dados

```bash
cd backend
npx prisma studio
```

## Padroes de Codigo

### Backend

- Controllers: `userController.ts`
- Services: `userService.ts`
- Repositories: `userRepository.ts`
- Middleware: `authMiddleware.ts`

### Frontend

- Componentes: `PascalCase.tsx` (ex: `UserList.tsx`)
- Hooks: `useCamelCase.ts` (ex: `useAuth.ts`)
- Utils: `camelCase.ts` (ex: `formatCurrency.ts`)

---

Para mais detalhes, consulte [README.md](./README.md)
