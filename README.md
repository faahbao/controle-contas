# 💰 Controle de Contas Pessoais

Sistema local full-stack para gerenciar receitas e despesas pessoais com suporte a transações recorrentes, filtros avançados, relatórios e exportação em CSV.

## 🎯 Funcionalidades

- ✅ Cadastro de receitas (Salário, Outros) e despesas (10 categorias predefinidas)
- ✅ Marcação de transações recorrentes (geração automática mensal)
- ✅ Dashboard com saldo total e gráficos
- ✅ Filtros por tipo, categoria, período e recorrência
- ✅ Edição e exclusão de transações
- ✅ Relatórios detalhados por período
- ✅ Exportação em CSV
- ✅ Persistência em SQLite (local, sem internet necessário)

## 🏗️ Arquitetura

```
controle-contas/
├── backend/                (Node.js + Express)
│   ├── src/
│   │   ├── db.js           (Inicialização SQLite)
│   │   ├── server.js       (Servidor Express)
│   │   ├── controllers/    (Lógica de negócio)
│   │   ├── routes/         (Rotas REST)
│   │   ├── jobs/           (Jobs agendados)
│   │   └── middleware/
│   ├── package.json
│   └── .env.example
│
├── frontend/               (React + Vite)
│   ├── src/
│   │   ├── components/     (Componentes reutilizáveis)
│   │   ├── pages/          (Páginas principais)
│   │   ├── services/       (Cliente HTTP)
│   │   ├── styles/         (CSS)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── database.sqlite         (Banco de dados local)
└── .gitignore
```

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 16+ e npm (ou yarn)
- SQLite3 (geralmente já vem instalado)

### Backend

```bash
# Entre na pasta backend
cd backend

# Copie o arquivo .env
cp .env.example .env

# Instale as dependências
npm install

# Inicie o servidor (desenvolvimento)
npm run dev

# Ou em produção
npm start
```

O backend estará rodando em `http://localhost:5000`

### Frontend

```bash
# Em outro terminal, entre na pasta frontend
cd frontend

# Copie o arquivo .env
cp .env.example .env

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará em `http://localhost:3000` (abre automaticamente no navegador)

## 📊 Categorias Predefinidas

### Receitas
- Salário
- Outros

### Despesas
- Cartão Itau
- Cartão PicPay
- Cartão Mercado Pago
- Vivo Internet
- Vivo Celular Mãe
- Empréstimo Shopee
- Empréstimo MP
- Empréstimo Itau
- Empréstimo PicPay
- Cartão Pai

## 🔄 Transações Recorrentes

Transações marcadas como recorrentes serão geradas automaticamente a cada mês. O sistema roda um job diariamente (00:01) verificando quais transações devem ser geradas.

**Exemplo**: Se você registrar um "Salário" recorrente em 01/09/2026, o sistema criará automaticamente:
- 01/10/2026
- 01/11/2026
- 01/12/2026
- ... e assim por diante

## 📁 Base de Dados

O banco SQLite é criado automaticamente em `database.sqlite` na raiz do projeto. Contém duas tabelas:

### `transactions`
- id, tipo, categoria, descricao, valor, data, recorrente, periodo_recorrencia, ativo, criado_em, atualizado_em

### `recurrence_log`
- Rastreia quais transações recorrentes já foram geradas para cada mês

## 🔌 API REST

### Receitas/Despesas
- `POST /api/receitas` - Criar receita
- `GET /api/receitas` - Listar receitas (com filtros)
- `GET /api/receitas/:id` - Obter receita
- `PUT /api/receitas/:id` - Atualizar receita
- `DELETE /api/receitas/:id` - Deletar receita

(Equivalentes para `/api/despesas`)

### Dashboard
- `GET /api/dashboard` - Saldo total, resumo por categoria

### Exportação
- `POST /api/export/csv` - Exportar em CSV

## 📤 Filtros Disponíveis

```javascript
// Query parameters para GET /api/receitas (ou despesas)
{
  tipo: 'receita' | 'despesa',
  categoria: 'Salário', // nome da categoria
  data_inicio: '2026-08-01', // formato YYYY-MM-DD
  data_fim: '2026-08-31',
  recorrente: true | false,
  page: 1, // paginação
  limit: 50 // itens por página
}
```

## 🐛 Troubleshooting

### Erro: "Banco de dados não encontrado"
- O banco é criado automaticamente. Se persistir, verifique permissões na pasta do projeto.

### Erro: "Porta 5000 já em uso"
- Mude a porta no `.env` do backend: `PORT=5001`

### CORS Error
- Verifique se o frontend está configurado com a URL correta do backend em `.env`

### Recorrências não estão sendo geradas
- Verifique se o backend está rodando (log deve mostrar "Job de recorrências agendado")
- Aguarde até 00:01 ou reinicie o backend para forçar execução imediata

## 🔐 Segurança (Futuro)

Este projeto é local e sem autenticação por padrão. Para expor em rede local ou internet:
- Adicionar autenticação (JWT)
- Usar HTTPS/TLS
- Configurar Cloudflare Tunnel (conforme necessário)

## 📝 Licença

MIT

## 👨‍💻 Autor

Criado em 2026 para gerenciamento pessoal de contas.
