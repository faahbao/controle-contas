# Controle de Contas

Sistema web de controle financeiro pessoal com autenticacao, receitas, despesas, categorias, parcelas recorrentes, pagamento de contas e relatorios em PDF.

## Funcionalidades

- Cadastro e login com JWT
- Receitas e despesas
- Categorias pre-definidas e personalizadas
- Transacoes recorrentes diarias, semanais e mensais
- Geracao automatica de parcelas
- Edicao e exclusao de transacoes
- Exclusao de uma parcela ou das parcelas futuras
- Marcacao de despesas como pagas ou pendentes
- Pagamento de varias despesas selecionadas
- Pagamento antecipado de parcelas futuras
- Visualizacao do mes atual ou de todas as parcelas
- Dashboard com receitas, despesas, saldo e grafico
- Relatorio PDF por mes e ano

## Tecnologias

### Backend

- Node.js
- Express
- Prisma ORM
- SQLite
- JWT
- bcrypt
- Joi
- PDFKit

### Frontend

- React
- Vite
- Axios
- React Router
- CSS

## Inicio rapido

### Backend

```powershell
cd D:\Projetos\controle-contas\backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend

```powershell
cd D:\Projetos\controle-contas\frontend
npm install
npm run dev
```

Backend:

```text
http://localhost:3000
```

Frontend:

```text
http://localhost:3001
```

Use a porta exibida pelo Vite caso seja diferente.

## Configuracao

Crie ou atualize `backend/.env`:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="substitua-por-uma-chave-forte-com-32-caracteres-ou-mais"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

Nao publique o arquivo `.env` nem a chave JWT.

## Parcelas e pagamentos

Ao criar uma transacao recorrente com parcelas, o sistema gera uma transacao para cada parcela.

Exemplo: despesa mensal de 5 parcelas iniciada em agosto:

```text
Aluguel (1/5) - 18/08/2026
Aluguel (2/5) - 18/09/2026
Aluguel (3/5) - 18/10/2026
Aluguel (4/5) - 18/11/2026
Aluguel (5/5) - 18/12/2026
```

Na secao Transacoes:

1. Clique em `Ver todas as parcelas`.
2. Selecione despesas pendentes, inclusive parcelas futuras.
3. Clique em `Pagar selecionadas`.

Receitas nao podem ser marcadas como pagas. Cada parcela possui status de pagamento proprio.

## Documentacao

- [INSTALL.md](./INSTALL.md) - Instalacao e configuracao
- [API.md](./API.md) - Endpoints da API
- [BACKEND.md](./BACKEND.md) - Backend e banco de dados
- [FRONTEND.md](./FRONTEND.md) - Frontend e Dashboard
- [FEATURES.md](./FEATURES.md) - Funcionalidades
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Estrutura do projeto
- [CHANGELOG.md](./CHANGELOG.md) - Historico de alteracoes
- [QUICKSTART.md](./QUICKSTART.md) - Guia rapido

## Licenca

MIT