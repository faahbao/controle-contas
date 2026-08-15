# 📋 Estrutura do Projeto - Guia Completo

## Visão Geral

O **Controle de Contas Pessoais** é uma aplicação full-stack local para gerenciamento de receitas, despesas, categorias e transações recorrentes.

A aplicação é dividida em:

* **Backend:** Node.js + Express + SQLite
* **Frontend:** React + Vite
* **Banco de dados:** SQLite
* **Comunicação:** API REST utilizando Axios

---

## 📁 Estrutura Atual do Projeto

```text
controle-contas/
│
├── 📄 README.md
├── 📄 quickstart.md
├── 📄 project_structure.md
├── 📄 .gitignore
├── 📄 setup.bat
├── 📄 setup.sh
│
├── 📁 backend/
│   ├── 📄 package.json
│   ├── 📄 package-lock.json
│   ├── 📄 .env
│   ├── 📄 .env.example
│   │
│   └── 📁 src/
│       ├── 📄 server.js
│       ├── 📄 db.js
│       │
│       ├── 📁 controllers/
│       │   ├── 📄 transacaoController.js
│       │   └── 📄 transacaoController.backup.js
│       │
│       ├── 📁 routes/
│       │   ├── 📄 transacao.js
│       │   ├── 📄 categorias.js
│       │   ├── 📄 dashboard.js
│       │   ├── 📄 dashboard.backup.js
│       │   └── 📄 export.js
│       │
│       ├── 📁 jobs/
│       │   └── 📄 recurrenceJob.js
│       │
│       └── 📁 middleware/
│
├── 📁 frontend/
│   ├── 📄 package.json
│   ├── 📄 package-lock.json
│   ├── 📄 .env
│   ├── 📄 .env.example
│   ├── 📄 index.html
│   └── 📄 vite.config.js
│
│   └── 📁 src/
│       ├── 📄 main.jsx
│       ├── 📄 App.jsx
│       │
│       ├── 📁 components/
│       │   ├── 📄 Sidebar.jsx
│       │   ├── 📄 FormularioTransacao.jsx
│       │   └── 📄 ListaTransacoes.jsx
│       │
│       ├── 📁 pages/
│       │   ├── 📄 Dashboard.jsx
│       │   ├── 📄 Receitas.jsx
│       │   ├── 📄 Despesas.jsx
│       │   ├── 📄 Relatorios.jsx
│       │   └── 📄 Exportar.jsx
│       │
│       ├── 📁 services/
│       │   └── 📄 api.js
│       │
│       ├── 📁 styles/
│       │   ├── 📄 App.css
│       │   ├── 📄 Sidebar.css
│       │   ├── 📄 FormularioTransacao.css
│       │   ├── 📄 ListaTransacoes.css
│       │   ├── 📄 Dashboard.css
│       │   ├── 📄 Receitas.css
│       │   ├── 📄 Despesas.css
│       │   ├── 📄 Relatorios.css
│       │   └── 📄 Exportar.css
│       │
│       └── 📁 hooks/
│
└── 📄 database.sqlite
```

---

# 🖥️ Backend

O backend é responsável pela API REST, regras de negócio, banco de dados e geração automática das transações recorrentes.

## `backend/src/server.js`

Arquivo principal do servidor Express.

Responsabilidades:

* Inicializar o Express
* Configurar CORS
* Carregar variáveis de ambiente
* Inicializar o banco SQLite
* Registrar as rotas da API
* Inicializar o job de recorrências
* Disponibilizar o endpoint de Health Check

Principais rotas:

```text
/api/receitas
/api/despesas
/api/categorias
/api/dashboard
/api/export
/api/health
```

---

## `backend/src/db.js`

Responsável pela conexão e inicialização do SQLite.

Também disponibiliza funções auxiliares utilizadas pelo backend:

```javascript
dbRun()
dbGet()
dbAll()
```

O banco utilizado pela aplicação é:

```text
database.sqlite
```

---

# 🎯 Controllers

## `backend/src/controllers/transacaoController.js`

Contém a lógica relacionada às transações.

Responsabilidades:

* Criar transações
* Listar transações
* Obter uma transação
* Atualizar transações
* Excluir transações
* Processar transações recorrentes
* Processar parcelamentos
* Validar dados recebidos pela API

---

# 🛣️ Rotas

## `backend/src/routes/transacao.js`

Define as operações REST relacionadas às transações.

```text
POST   /
GET    /
GET    /:id
PUT    /:id
DELETE /:id
```

As rotas são utilizadas para receitas e despesas.

---

## `backend/src/routes/categorias.js`

Responsável pelo gerenciamento das categorias.

### Listar categorias

```text
GET /api/categorias
```

Também permite filtrar pelo tipo:

```text
GET /api/categorias?tipo=receita
GET /api/categorias?tipo=despesa
```

### Criar categoria

```text
POST /api/categorias
```

Exemplo:

```json
{
  "tipo": "despesa",
  "nome": "Mercado"
}
```

### Editar categoria

```text
PUT /api/categorias/:id
```

Exemplo:

```json
{
  "nome": "Supermercado"
}
```

### Remover categoria

```text
DELETE /api/categorias/:id
```

A remoção é feita de forma lógica. A categoria permanece no banco, mas fica marcada como inativa.

---

## `backend/src/routes/dashboard.js`

Responsável pelos dados utilizados no Dashboard.

Fornece informações como:

* Total de receitas
* Total de despesas
* Saldo
* Resumo financeiro
* Dados agrupados por categoria
* Filtros por período

Endpoint:

```text
GET /api/dashboard
```

---

## `backend/src/routes/export.js`

Responsável pela exportação dos dados.

Endpoint:

```text
POST /api/export/csv
```

---

# 🔄 Jobs Automáticos

## `backend/src/jobs/recurrenceJob.js`

Responsável pelas transações recorrentes.

O sistema verifica automaticamente as transações recorrentes e cria as próximas ocorrências.

O job:

* Executa imediatamente quando o backend inicia
* É agendado diariamente
* Verifica as recorrências do mês
* Evita gerar a mesma recorrência duas vezes
* Respeita o número de parcelas configurado
* Registra as recorrências processadas

Horário programado:

```text
00:01
```

---

# 🌐 Frontend

O frontend utiliza:

* React
* React Router
* Vite
* Axios
* Recharts

---

# 🧩 Componentes

## `Sidebar.jsx`

Menu lateral da aplicação.

Responsável pela navegação entre:

* Dashboard
* Receitas
* Despesas
* Relatórios
* Exportação

---

## `FormularioTransacao.jsx`

Formulário reutilizável para cadastro de receitas e despesas.

Possui suporte a:

* Categoria
* Descrição
* Valor
* Data
* Recorrência
* Parcelamento

---

## `ListaTransacoes.jsx`

Responsável pela exibição das transações.

Permite:

* Visualizar transações
* Editar transações
* Excluir transações
* Salvar alterações

---

# 📄 Páginas

## `Dashboard.jsx`

Página principal com visão geral das contas.

Apresenta:

* Receitas
* Despesas
* Saldo
* Gráficos
* Resumos financeiros

---

## `Receitas.jsx`

Gerenciamento das receitas.

Possui:

* Cadastro de receitas
* Listagem
* Filtros
* Edição
* Exclusão
* Categorias personalizadas
* Adição de categorias
* Edição de categorias
* Remoção de categorias

---

## `Despesas.jsx`

Gerenciamento das despesas.

Possui:

* Cadastro de despesas
* Listagem
* Filtros
* Edição
* Exclusão
* Categorias personalizadas
* Adição de categorias
* Edição de categorias
* Remoção de categorias

---

## `Relatorios.jsx`

Responsável pelos relatórios financeiros.

Permite selecionar períodos e analisar as movimentações.

---

## `Exportar.jsx`

Responsável pela exportação dos dados em CSV.

---

# 🔌 Serviço da API

## `frontend/src/services/api.js`

Centraliza a comunicação do React com o backend utilizando Axios.

Principais funções:

### Transações

```javascript
criarTransacao()
listarTransacoes()
obterTransacao()
atualizarTransacao()
deletarTransacao()
```

### Dashboard

```javascript
obterDashboard()
```

### Exportação

```javascript
exportarCSV()
```

### Categorias

```javascript
listarCategorias()
criarCategoria()
atualizarCategoria()
removerCategoria()
```

---

# 🗄️ Banco de Dados

O sistema utiliza SQLite através do arquivo:

```text
database.sqlite
```

O banco é criado automaticamente pelo backend.

## Tabela `transactions`

Armazena receitas e despesas.

Principais campos:

```text
id
tipo
categoria
descricao
valor
data
recorrente
periodo_recorrencia
num_parcelas
parcela_numero
data_termino
transacao_original_id
ativo
criado_em
atualizado_em
```

---

## Tabela `categorias`

Armazena as categorias utilizadas nas receitas e despesas.

Campos principais:

```text
id
tipo
nome
ativo
criado_em
atualizado_em
```

O campo `tipo` aceita:

```text
receita
despesa
```

As categorias podem ser:

* Criadas
* Editadas
* Removidas
* Filtradas por tipo

A remoção é lógica através do campo:

```text
ativo = 0
```

---

## Tabela `recurrence_log`

Controla as recorrências já processadas.

Campos:

```text
id
transaction_id
mes
ano
gerada_em
```

Existe uma restrição para evitar que a mesma transação seja gerada duas vezes para o mesmo mês.

---

# 🔄 Fluxo da Aplicação

```text
                    ┌─────────────────────┐
                    │      React/Vite     │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ Axios
                               ▼
                    ┌─────────────────────┐
                    │    API REST         │
                    │    Express.js       │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          Transações       Categorias      Dashboard
                │              │              │
                └──────────────┼──────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       SQLite        │
                    │  database.sqlite    │
                    └─────────────────────┘
                               ▲
                               │
                    ┌──────────┴──────────┐
                    │  recurrenceJob.js   │
                    │ Recorrências mensais│
                    └─────────────────────┘
```

---

# 🌐 Endpoints da API

## Transações

```text
POST   /api/receitas
GET    /api/receitas
GET    /api/receitas/:id
PUT    /api/receitas/:id
DELETE /api/receitas/:id

POST   /api/despesas
GET    /api/despesas
GET    /api/despesas/:id
PUT    /api/despesas/:id
DELETE /api/despesas/:id
```

## Categorias

```text
GET    /api/categorias
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id
```

## Dashboard

```text
GET    /api/dashboard
```

## Exportação

```text
POST   /api/export/csv
```

## Health Check

```text
GET    /api/health
```

---

# 🛠️ Tecnologias

## Backend

| Tecnologia    | Utilização                   |
| ------------- | ---------------------------- |
| Node.js       | Runtime                      |
| Express       | API REST                     |
| SQLite3       | Banco de dados               |
| node-schedule | Agendamento de recorrências  |
| Axios         | Comunicação HTTP             |
| CORS          | Comunicação frontend/backend |
| dotenv        | Variáveis de ambiente        |

## Frontend

| Tecnologia   | Utilização              |
| ------------ | ----------------------- |
| React 18     | Interface               |
| Vite         | Desenvolvimento e build |
| React Router | Navegação               |
| Axios        | Comunicação com API     |
| Recharts     | Gráficos                |

---

# 📦 Dependências

As dependências são instaladas separadamente.

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

A pasta `node_modules` não deve ser versionada no Git.

---

# ▶️ Scripts

## Backend

```bash
npm run dev
```

Executa o servidor em modo de desenvolvimento.

```bash
npm start
```

Executa o servidor normalmente.

---

## Frontend

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera o build de produção.

```bash
npm run preview
```

Executa uma prévia do build.

---

# 🔐 Segurança Atual

O projeto atualmente é destinado ao uso local.

Possui:

* ✅ Validação básica dos dados
* ✅ CORS
* ✅ Banco local SQLite
* ✅ API REST

Ainda não possui:

* ❌ Autenticação de usuários
* ❌ JWT
* ❌ HTTPS
* ❌ Rate limiting
* ❌ Controle multiusuário

---

# 🚀 Melhorias Futuras

Possíveis evoluções:

* [ ] Autenticação de usuários
* [ ] Controle multiusuário
* [ ] Backup automático
* [ ] Sincronização em nuvem
* [ ] Aplicativo mobile
* [ ] Notificações
* [ ] Gráficos avançados
* [ ] Integração bancária
* [ ] Importação de extratos
* [ ] Relatórios em PDF
* [ ] Testes automatizados
* [ ] Deploy em servidor

---

# ✅ Status Atual

* [x] Backend Express configurado
* [x] Banco SQLite configurado
* [x] CRUD de receitas
* [x] CRUD de despesas
* [x] Dashboard
* [x] Relatórios
* [x] Exportação CSV
* [x] Transações recorrentes
* [x] Parcelamento de transações
* [x] CRUD de categorias
* [x] Adição de categorias pela interface
* [x] Edição de categorias pela interface
* [x] Remoção de categorias pela interface
* [x] Filtros por categoria
* [x] Documentação do projeto
* [ ] Testes automatizados
* [ ] Autenticação
* [ ] Deploy

---

## 📚 Documentação Relacionada

Para entender e executar o projeto:

* `README.md` — documentação geral
* `quickstart.md` — guia rápido para executar o sistema
* `project_structure.md` — estrutura técnica do projeto

---

**Projeto Controle de Contas Pessoais**

Criado em 2026 para gerenciamento pessoal de receitas e despesas.
