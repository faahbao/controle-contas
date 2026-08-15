# 💰 Controle de Contas Pessoais

Sistema local full-stack para gerenciamento de receitas e despesas pessoais.

O sistema permite cadastrar receitas e despesas, controlar transações recorrentes e parceladas, acompanhar o saldo através de um dashboard, gerenciar categorias e exportar os dados para CSV.

---

## 🎯 Funcionalidades

### 💰 Receitas

* Cadastro de receitas.
* Categorias personalizáveis.
* Categorias iniciais:

  * Adiantamento
  * Salário
  * Outras rendas
* Adicionar novas categorias.
* Editar categorias existentes.
* Remover categorias.
* Filtro por categoria.
* Filtro por transações recorrentes.

### 💸 Despesas

* Cadastro de despesas.
* Categorias personalizáveis.
* Categorias iniciais:

  * Cartão Itau
  * Cartão PicPay
  * Cartão Mercado Pago
  * Vivo Internet
  * Vivo Celular Mãe
  * Empréstimo Shopee
  * Empréstimo MP
  * Empréstimo Itau
  * Empréstimo PicPay
  * Cartão Pai
* Adicionar novas categorias.
* Editar categorias existentes.
* Remover categorias.
* Filtro por categoria.
* Filtro por transações recorrentes.

### 🔄 Transações recorrentes

* Cadastro de receitas e despesas recorrentes.
* Recorrência mensal.
* Geração automática das próximas ocorrências.
* Job automático executado diariamente às 00:01.
* Registro das recorrências já processadas para evitar duplicidade.

### 🧾 Parcelamento

* Cadastro de transações parceladas.
* Definição da quantidade de parcelas.
* Controle do número da parcela.
* Identificação da transação original.
* Data de término do parcelamento.
* Geração automática das parcelas conforme configuração.

### 📊 Dashboard

O dashboard apresenta uma visão geral das finanças.

* Total de receitas.
* Total de despesas.
* Saldo.
* Gráfico de receitas x despesas.
* Receitas por categoria.
* Despesas por categoria.
* **Seletor de mês do ano corrente.**
* Visualização dos valores referentes ao mês selecionado.
* Visualização das parcelas correspondentes ao mês selecionado.

### 📋 Transações

* Listagem de transações.
* Cadastro.
* Edição.
* Exclusão.
* Filtros por categoria.
* Filtros por recorrência.
* Paginação.
* Controle de receitas e despesas.

### 📤 Exportação

* Exportação das transações para CSV.
* Aplicação de filtros na exportação.

### 🗄️ Banco de dados

* SQLite.
* Banco criado automaticamente.
* Migrações automáticas do schema.
* Sem necessidade de servidor de banco externo.

---

# 🏗️ Arquitetura

```text
controle-contas/
│
├── backend/                         # Node.js + Express
│   │
│   ├── src/
│   │   ├── controllers/             # Regras de negócio
│   │   ├── jobs/                    # Jobs automáticos
│   │   ├── middleware/              # Middlewares
│   │   ├── models/                  # Modelos
│   │   ├── routes/                  # Rotas REST
│   │   │   ├── categorias.js
│   │   │   ├── dashboard.js
│   │   │   ├── export.js
│   │   │   └── transacao.js
│   │   │
│   │   ├── db.js                    # SQLite e migrações
│   │   └── server.js                # Servidor Express
│   │
│   ├── package.json
│   └── .env.example
│
├── frontend/                        # React + Vite
│   │
│   ├── src/
│   │   ├── components/              # Componentes reutilizáveis
│   │   ├── pages/                   # Páginas
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Despesas.jsx
│   │   │   ├── Receitas.jsx
│   │   │   └── Exportar.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Comunicação com backend
│   │   │
│   │   ├── styles/                  # Arquivos CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── database.sqlite                   # Banco local
├── .gitignore
└── README.md
```

---

# 🚀 Como executar

## Pré-requisitos

* Node.js 16 ou superior.
* npm.
* SQLite3 é utilizado pelo projeto através da dependência do Node.js.

---

## Backend

Abra um terminal:

```powershell
cd D:\Projetos\controle-contas\backend
```

Instale as dependências:

```powershell
npm install
```

Configure o `.env` caso necessário:

```powershell
Copy-Item .env.example .env
```

Inicie o backend em modo desenvolvimento:

```powershell
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:5000
```

O endpoint de verificação está disponível em:

```text
http://localhost:5000/api/health
```

---

## Frontend

Abra outro terminal:

```powershell
cd D:\Projetos\controle-contas\frontend
```

Instale as dependências:

```powershell
npm install
```

Configure o `.env` caso necessário:

```powershell
Copy-Item .env.example .env
```

Inicie o frontend:

```powershell
npm run dev
```

O endereço exibido pelo Vite será utilizado para acessar o sistema.

---

# 🗂️ Gerenciamento de categorias

As categorias são armazenadas no banco de dados e são separadas por tipo:

```text
receita
despesa
```

É possível:

* Adicionar categoria.
* Editar categoria.
* Remover categoria.
* Listar somente categorias ativas.
* Evitar categorias duplicadas.
* Impedir a remoção de categorias que estejam sendo utilizadas por transações.

## Categorias iniciais

### Receitas

```text
Adiantamento
Salário
Outras rendas
```

### Despesas

```text
Cartão Itau
Cartão PicPay
Cartão Mercado Pago
Vivo Internet
Vivo Celular Mãe
Empréstimo Shopee
Empréstimo MP
Empréstimo Itau
Empréstimo PicPay
Cartão Pai
```

---

# 🔄 Transações recorrentes

As transações marcadas como recorrentes são processadas automaticamente pelo backend.

O job de recorrência:

```text
Executado diariamente às 00:01
```

Além do horário agendado, o processamento também é iniciado quando o backend é iniciado.

O sistema utiliza a tabela `recurrence_log` para controlar quais recorrências já foram geradas e evitar duplicações.

---

# 🧾 Parcelamentos

O sistema permite cadastrar transações parceladas.

São controlados:

* Número total de parcelas.
* Número da parcela atual.
* Data de término.
* Identificação da transação original.
* Valor de cada parcela.
* Data de cada parcela.

As parcelas podem ser visualizadas no dashboard conforme o mês selecionado.

---

# 📊 Dashboard

O dashboard permite selecionar um mês do **ano corrente** para consultar os dados financeiros daquele período.

São apresentados:

### Resumo

```text
Receitas
Despesas
Saldo
```

### Gráficos

```text
Receitas x Despesas
Receitas por categoria
Despesas por categoria
```

### Filtro mensal

O usuário pode selecionar o mês desejado do ano corrente e visualizar os valores correspondentes às transações e parcelas daquele mês.

---

# 🔌 API REST

## Transações

### Criar

```http
POST /api/receitas
```

### Listar

```http
GET /api/receitas
```

### Obter uma transação

```http
GET /api/receitas/:id
```

### Atualizar

```http
PUT /api/receitas/:id
```

### Excluir

```http
DELETE /api/receitas/:id
```

As mesmas rotas podem ser utilizadas através de:

```http
/api/despesas
```

---

## Categorias

### Listar categorias

```http
GET /api/categorias
```

Filtro por tipo:

```http
GET /api/categorias?tipo=receita
```

ou:

```http
GET /api/categorias?tipo=despesa
```

### Criar categoria

```http
POST /api/categorias
```

Exemplo:

```json
{
  "tipo": "receita",
  "nome": "Freelance"
}
```

### Editar categoria

```http
PUT /api/categorias/:id
```

Exemplo:

```json
{
  "nome": "Salário Mensal"
}
```

### Remover categoria

```http
DELETE /api/categorias/:id
```

A remoção é lógica: a categoria fica inativa no banco.

---

## Dashboard

```http
GET /api/dashboard
```

O dashboard aceita parâmetros relacionados ao período selecionado.

---

## Exportação

```http
POST /api/export/csv
```

---

# 🔎 Filtros de transações

Exemplo:

```javascript
{
  tipo: "receita",
  categoria: "Salário",
  data_inicio: "2026-08-01",
  data_fim: "2026-08-31",
  recorrente: true,
  page: 1,
  limit: 50
}
```

Parâmetros disponíveis:

| Parâmetro     | Descrição               |
| ------------- | ----------------------- |
| `tipo`        | `receita` ou `despesa`  |
| `categoria`   | Nome da categoria       |
| `data_inicio` | Data inicial            |
| `data_fim`    | Data final              |
| `recorrente`  | `true` ou `false`       |
| `page`        | Página                  |
| `limit`       | Quantidade de registros |

---

# 🗄️ Banco de dados

O banco SQLite é criado automaticamente na raiz do projeto:

```text
database.sqlite
```

Principais tabelas:

### `transactions`

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
data_termino
parcela_numero
transacao_original_id
ativo
criado_em
atualizado_em
```

### `categorias`

Armazena as categorias de receitas e despesas.

Principais campos:

```text
id
tipo
nome
ativo
criado_em
atualizado_em
```

### `recurrence_log`

Controla as recorrências já processadas.

Principais campos:

```text
id
transaction_id
mes
ano
gerada_em
```

---

# 🛠️ Troubleshooting

## Erro: `EADDRINUSE: address already in use :::5000`

A porta 5000 já está sendo utilizada por outro processo.

No PowerShell:

```powershell
netstat -ano | findstr :5000
```

Identifique o PID e finalize o processo, se necessário:

```powershell
taskkill /PID NUMERO_DO_PID /F
```

Depois inicie novamente o backend.

---

## Erro: banco de dados não encontrado

O banco é criado automaticamente pelo backend.

Verifique se o arquivo existe na raiz:

```text
database.sqlite
```

---

## Erro de CORS

Verifique se o frontend está utilizando a URL correta do backend no `.env`.

Por padrão:

```text
http://localhost:5000/api
```

---

## Recorrências não estão sendo geradas

Verifique se o backend está executando.

No console deve aparecer:

```text
Job de recorrências agendado (diariamente às 00:01)
```

O processamento também é executado na inicialização do backend.

---

# 🔐 Segurança

O projeto atualmente é destinado ao uso local e não possui autenticação por padrão.

Caso futuramente seja necessário disponibilizá-lo em uma rede ou na internet, recomenda-se implementar:

* Autenticação.
* Autorização.
* JWT ou sessão segura.
* HTTPS/TLS.
* Controle de acesso.
* Proteção das APIs.
* Backup automatizado do banco de dados.

---

# 📌 Status do projeto

O projeto está em desenvolvimento ativo.

Funcionalidades atualmente implementadas:

* [x] Receitas
* [x] Despesas
* [x] Parcelamento
* [x] Transações recorrentes
* [x] Dashboard
* [x] Dashboard mensal
* [x] Gráficos
* [x] Filtros
* [x] Gerenciamento de categorias
* [x] Adicionar categoria
* [x] Editar categoria
* [x] Remover categoria
* [x] Proteção contra categorias duplicadas
* [x] SQLite
* [x] Exportação CSV
* [x] API REST

---

# 📄 Licença

MIT

---

# 👨‍💻 Autor

Criado em 2026 para gerenciamento pessoal de contas.

**Projeto:** `controle-contas`
