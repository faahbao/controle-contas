# Controle de Contas

Sistema web para controle financeiro pessoal com autenticação JWT, receitas, despesas, categorias, transações recorrentes parceladas, controle de pagamento, parcelas futuras e relatórios em PDF.

## Stack

- Backend: Node.js, Express, Prisma ORM, SQLite, JWT, bcrypt, Joi, Helmet, CORS e PDFKit.
- Frontend: React, Vite, Axios, React Router DOM e CSS responsivo.

## Funcionalidades

- Cadastro, login e proteção de rotas.
- CRUD de receitas e despesas.
- Categorias predefinidas e personalizadas.
- Transações recorrentes diárias, semanais ou mensais.
- Geração automática de parcelas.
- Pagamento individual, em lote e antecipado.
- Visualização de parcelas futuras.
- Exclusão da parcela atual ou da parcela atual e posteriores.
- Dashboard com receitas, despesas, saldo, filtros e gráficos.
- Relatórios em PDF.
- Interface responsiva para desktop e dispositivos móveis.

## Estrutura

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
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── API.md
├── BACKEND.md
├── CHANGELOG.md
├── FEATURES.md
├── FRONTEND.md
├── INSTALL.md
├── PROJECT_STRUCTURE.md
├── QUICKSTART.md
├── SUMMARY.md
├── UPDATES_V1.1.md
└── VISUAL_GUIDE.md
```

## Instalação rápida

```powershell
cd D:\Projetos\controle-contas\backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Em outro terminal:

```powershell
cd D:\Projetos\controle-contas\frontend
npm install
npm run dev
```

Use as URLs exibidas pelos terminais. Em desenvolvimento, o backend costuma usar `http://localhost:3000` e o frontend `http://localhost:3001`, mas as portas podem ser alteradas pela configuração do projeto.

## Variáveis de ambiente

Backend:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="use-uma-chave-secreta-com-pelo-menos-32-caracteres"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

Frontend:

```env
VITE_API_URL="http://localhost:3000/api"
```

Não publique arquivos `.env` nem chaves reais.

## Cloudflare Tunnel

Para expor o backend local, a origem do tunnel deve apontar para a porta real do backend. Por exemplo:

```powershell
cloudflared tunnel --url http://127.0.0.1:3000
```

Use `127.0.0.1` em vez de `localhost` se o cloudflared tentar conectar via IPv6 (`::1`). Links `trycloudflare.com` podem mudar quando um quick tunnel é recriado; atualize a URL da API e a origem permitida no CORS quando necessário.

## Documentação

- [INSTALL.md](./INSTALL.md): instalação detalhada.
- [QUICKSTART.md](./QUICKSTART.md): início rápido.
- [API.md](./API.md): endpoints e autenticação.
- [BACKEND.md](./BACKEND.md): backend, banco e migrações.
- [FRONTEND.md](./FRONTEND.md): frontend e integração com a API.
- [FEATURES.md](./FEATURES.md): funcionalidades.
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md): estrutura do projeto.
- [VISUAL_GUIDE.md](./VISUAL_GUIDE.md): fluxo da interface.
- [CHANGELOG.md](./CHANGELOG.md): histórico de alterações.

## Licença

MIT.
