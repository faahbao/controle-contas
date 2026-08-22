# Estrutura do Projeto

```text
controle-contas/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── db.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── API.md
├── BACKEND.md
├── CHANGELOG.md
├── FEATURES.md
├── FRONTEND.md
├── INSTALL.md
├── QUICKSTART.md
├── README.md
├── SUMMARY.md
├── UPDATES_V1.1.md
└── VISUAL_GUIDE.md
```

## Responsabilidades

### Backend

- `controllers/`: lógica dos handlers HTTP.
- `middleware/`: autenticação, validação e tratamento comum.
- `routes/`: definição de endpoints.
- `jobs/`: tarefas agendadas, quando utilizadas.
- `db.js`: conexão ou cliente do banco.
- `server.js`: configuração e inicialização do Express.
- `prisma/`: schema e migrações.

### Frontend

- `contexts/`: estado compartilhado, incluindo autenticação.
- `pages/`: telas da aplicação.
- `components/`: componentes reutilizáveis.
- `services/`: cliente HTTP e chamadas da API.
- `styles/`: folhas de estilo por tela ou componente.
- `App.jsx`: rotas e composição principal.
- `main.jsx`: ponto de entrada.

## Fluxo de dados

```text
Usuário → React/Vite → Axios → API Express → Prisma → SQLite
Usuário ← React/Vite ← Resposta da API
```

## Padrões

- Componentes React: `PascalCase.jsx`.
- Contextos: `PascalCase.jsx`.
- Serviços e utilitários: `camelCase.js`.
- Estilos: nome correspondente ao componente, como `Dashboard.css`.
- Variáveis de ambiente: somente em `.env`, nunca em código versionado.

## Portas e URLs

Os valores dependem da configuração local. A referência documentada é:

| Serviço | Valor padrão |
|---|---|
| Backend | `http://localhost:3000` |
| API | `http://localhost:3000/api` |
| Frontend | URL exibida pelo Vite, frequentemente `http://localhost:3001` |

Sempre considere a porta exibida no terminal como fonte de verdade.
