# Controle de Contas Pessoais

Sistema completo de controle financeiro pessoal com backend em Node.js e frontend em React.

![Versao](https://img.shields.io/badge/versao-1.1.0-blue)
![Node](https://img.shields.io/badge/Node.js-20+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## Sobre

O **Controle de Contas** e uma aplicacao fullstack para gerenciamento de financas pessoais, permitindo o controle de receitas, despesas, categorias e visualizacao de relatorios financeiros.

## Funcionalidades

- Cadastro de receitas e despesas
- Organizacao por categorias
- Dashboard com resumo financeiro
- Historico de transacoes
- Autenticacao com JWT
- Interface responsiva
- Banco de dados SQLite

## Tecnologias

### Backend
- Node.js 20+
- TypeScript
- Express / Fastify
- Prisma ORM
- SQLite
- JWT (autenticacao)
- bcryptjs (hash de senhas)

### Frontend
- React 18+
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Axios

## Estrutura do Projeto

```
controle-contas/
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── prisma/
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── index.html
├── README.md
├── QUICKSTART.md
├── PROJECT_STRUCTURE.md
├── CHANGELOG.md
├── setup.bat / setup.sh
└── start-all.bat
```

## Pre-requisitos

- Node.js 20+
- npm ou yarn
- Git

## Instalacao

### Opcao 1: Script Automatico (Windows)

```bash
git clone https://github.com/faahbao/controle-contas.git
cd controle-contas
setup.bat
```

### Opcao 2: Script Automatico (Linux/Mac)

```bash
git clone https://github.com/faahbao/controle-contas.git
cd controle-contas
chmod +x setup.sh
./setup.sh
```

### Opcao 3: Instalacao Manual

```bash
git clone https://github.com/faahbao/controle-contas.git
cd controle-contas

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

## Configuracao

### Backend (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Como Rodar

### Iniciar tudo (Windows)

```bash
start-all.bat
```

### Iniciar separadamente

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

O frontend estara disponivel em `http://localhost:5173`

## API Endpoints

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | /api/auth/register | Registrar novo usuario |
| POST | /api/auth/login | Login |
| GET | /api/transactions | Listar transacoes |
| POST | /api/transactions | Criar transacao |
| PUT | /api/transactions/:id | Atualizar transacao |
| DELETE | /api/transactions/:id | Deletar transacao |
| GET | /api/categories | Listar categorias |

## Documentacao Adicional

- [QUICKSTART.md](./QUICKSTART.md) - Guia rapido de inicio
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Estrutura detalhada do projeto
- [CHANGELOG.md](./CHANGELOG.md) - Historico de versoes
- [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) - Guia visual da interface
- [SUMMARY.md](./SUMMARY.md) - Resumo do projeto

## Contribuicao

1. Faca um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudancas
4. Push para a branch
5. Abra um Pull Request

## Licenca

MIT

---

Desenvolvido por faahbao
