# ⚡ Guia Rápido de Início

## Pré-requisitos

Você precisa ter **Node.js 16+** instalado.

Se não tiver:

1. Acesse https://nodejs.org/
2. Baixe a versão **LTS** (recomendada).
3. Execute o instalador e siga as instruções.

Para verificar a instalação:

```powershell
node --version
npm --version
```

---

## Instalação

### Windows

1. Abra o PowerShell na pasta do projeto:

```powershell
cd D:\Projetos\controle-contas
```

2. Execute o instalador:

```powershell
.\setup.bat
```

### Linux/Mac

1. Abra o terminal na pasta do projeto.

2. Execute:

```bash
bash setup.sh
```

---

## Executar o Projeto

O sistema possui duas partes:

* **Backend:** Node.js + Express + SQLite
* **Frontend:** React + Vite

É necessário manter **dois terminais abertos** enquanto estiver utilizando o sistema.

### Terminal 1 — Backend

```powershell
cd backend
npm run dev
```

O servidor será iniciado em:

```text
http://localhost:5000
```

Você deverá ver mensagens semelhantes a:

```text
Conectado ao SQLite
Banco de dados inicializado
Job de recorrências agendado
Servidor rodando em http://localhost:5000
```

### Terminal 2 — Frontend

Abra outro PowerShell:

```powershell
cd D:\Projetos\controle-contas\frontend
npm run dev
```

O Vite informará o endereço do sistema, normalmente:

```text
http://localhost:3000
```

Abra esse endereço no navegador.

---

# 🚀 Primeiros Passos

## 1. Dashboard

Ao abrir o sistema, o **Dashboard** apresenta o resumo financeiro.

Você poderá acompanhar:

* Total de receitas
* Total de despesas
* Saldo
* Resumo das movimentações
* Informações por período

---

## 2. Adicionar uma Receita

1. Clique em **Receitas** no menu lateral.
2. Escolha uma categoria.
3. Informe a descrição, se desejar.
4. Informe o valor.
5. Selecione a data.
6. Configure a recorrência, se necessário.
7. Clique em **Adicionar**.

As categorias padrão de receitas são:

* Adiantamento
* Salário
* Outras rendas

---

# 🏷️ Gerenciamento de Categorias

As categorias de receitas e despesas podem ser administradas diretamente pelas respectivas páginas.

## Adicionar categoria

Na página **Receitas** ou **Despesas**:

1. Localize a seção **Categoria**.
2. Clique em **+ Adicionar**.
3. Digite o nome da categoria.
4. Clique em **Adicionar**.

A nova categoria ficará disponível imediatamente no formulário de lançamento.

---

## Editar categoria

Para alterar o nome de uma categoria:

1. Selecione a categoria desejada.
2. Clique em **Editar**.
3. Altere o nome.
4. Confirme a alteração.

A alteração será aplicada à categoria existente.

---

## Remover categoria

Para remover uma categoria:

1. Selecione a categoria.
2. Clique em **Remover**.
3. Confirme a operação.

O sistema utiliza **remoção lógica**, ou seja, a categoria não é apagada fisicamente do banco de dados.

### Importante

Uma categoria que já esteja sendo utilizada por transações não poderá ser removida.

Isso evita que transações existentes fiquem sem uma categoria válida.

---

# 💸 Adicionar uma Despesa

1. Clique em **Despesas**.
2. Selecione uma categoria.
3. Informe a descrição, se desejar.
4. Informe o valor.
5. Selecione a data.
6. Marque **Recorrente (mensal)** quando necessário.
7. Clique em **Adicionar**.

As categorias padrão de despesas incluem:

* Cartão Itau
* Cartão PicPay
* Cartão Mercado Pago
* Cartão Pai
* Vivo Internet
* Vivo Celular Mãe
* Empréstimo Shopee
* Empréstimo MP
* Empréstimo Itau
* Empréstimo PicPay

Novas categorias também podem ser criadas conforme a necessidade.

---

# 🔄 Transações Recorrentes

Transações marcadas como recorrentes podem ser geradas automaticamente pelo sistema.

O backend possui um job que verifica diariamente as transações recorrentes.

O processo é executado às:

```text
00:01
```

Além disso, o sistema executa a verificação quando o backend é iniciado.

### Exemplo

Se você cadastrar:

```text
Categoria: Salário
Valor: R$ 3.000,00
Data: 01/09/2026
Recorrente: Sim
```

O sistema poderá gerar as próximas ocorrências mensais:

```text
01/10/2026
01/11/2026
01/12/2026
...
```

O comportamento também considera a quantidade de parcelas configurada na transação.

---

# ✏️ Editar uma Transação

Na lista de transações:

1. Localize a transação.
2. Clique no botão de **editar**.
3. Altere os dados desejados.
4. Salve a alteração.

---

# 🗑️ Excluir uma Transação

Na lista de transações:

1. Localize a transação.
2. Clique no botão de **excluir**.
3. Confirme a operação.

---

# 🔎 Filtros

As páginas de **Receitas** e **Despesas** permitem filtrar as movimentações.

É possível utilizar:

* Categoria
* Recorrência
* Período, quando disponível

Exemplo:

```text
Categoria: Salário
Recorrência: Apenas recorrentes
```

---

# 📊 Relatórios

Na área de relatórios:

1. Selecione a data inicial.
2. Selecione a data final.
3. Gere o relatório.

Utilize os relatórios para analisar suas movimentações dentro de um determinado período.

---

# 📤 Exportar Dados

Para exportar os dados:

1. Clique em **Exportar**.
2. Configure os filtros desejados.
3. Clique em **Exportar CSV**.
4. O arquivo será baixado no computador.

O CSV pode ser aberto no Excel, LibreOffice Calc ou outro programa compatível.

---

# 💾 Banco de Dados

O sistema utiliza **SQLite**.

O banco principal fica localizado em:

```text
database.sqlite
```

O arquivo contém os dados financeiros do sistema.

O banco é criado automaticamente quando o backend é iniciado pela primeira vez.

---

# 🗂️ Principais Tabelas

## `transactions`

Armazena as receitas e despesas.

Entre os principais campos estão:

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

## `categorias`

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

## `recurrence_log`

Controla as gerações automáticas de transações recorrentes para evitar duplicações.

---

# 🔌 API REST

## Transações

### Criar

```text
POST /api/receitas
```

### Listar

```text
GET /api/receitas
```

### Obter

```text
GET /api/receitas/:id
```

### Atualizar

```text
PUT /api/receitas/:id
```

### Excluir

```text
DELETE /api/receitas/:id
```

As mesmas rotas também são disponibilizadas através de:

```text
/api/despesas
```

---

## Categorias

### Listar categorias

```text
GET /api/categorias?tipo=receita
```

ou:

```text
GET /api/categorias?tipo=despesa
```

### Criar categoria

```text
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

```text
PUT /api/categorias/:id
```

Exemplo:

```json
{
  "nome": "Renda extra"
}
```

### Remover categoria

```text
DELETE /api/categorias/:id
```

A remoção é lógica.

---

## Dashboard

```text
GET /api/dashboard
```

---

## Exportação

```text
POST /api/export/csv
```

---

## Health Check

Para verificar se o backend está funcionando:

```text
GET /api/health
```

Resposta esperada:

```json
{
  "status": "OK"
}
```

---

# 🔍 Filtros de Transações

Exemplo de parâmetros:

```javascript
{
  tipo: 'receita',
  categoria: 'Salário',
  data_inicio: '2026-08-01',
  data_fim: '2026-08-31',
  recorrente: true,
  page: 1,
  limit: 50
}
```

Para despesas:

```javascript
{
  tipo: 'despesa',
  categoria: 'Cartão Itau',
  data_inicio: '2026-08-01',
  data_fim: '2026-08-31',
  recorrente: false,
  page: 1,
  limit: 50
}
```

---

# 🛠️ Solução de Problemas

## Erro: "Banco de dados não encontrado"

O banco é criado automaticamente pelo backend.

Verifique se:

```text
database.sqlite
```

está sendo criado na raiz do projeto.

Se necessário, reinicie o backend.

---

## Erro: "Porta 5000 já em uso"

Verifique qual processo está utilizando a porta:

```powershell
netstat -ano | findstr :5000
```

Você também pode alterar a porta no arquivo `.env`:

```text
PORT=5001
```

---

## Erro de conexão entre frontend e backend

Verifique se o backend está funcionando:

```text
http://localhost:5000/api/health
```

Também confira a configuração:

```text
frontend/.env
```

A URL padrão da API é:

```text
http://localhost:5000/api
```

---

## Site ficou em branco

Abra o console do navegador com:

```text
F12
```

Verifique a aba **Console**.

Erros como:

```text
does not provide an export named ...
```

normalmente indicam que o frontend está importando uma função que ainda não foi exportada em:

```text
frontend/src/services/api.js
```

Após corrigir o código, reinicie o servidor Vite:

```powershell
CTRL+C
npm run dev
```

---

## Categorias não aparecem

Verifique se o backend está funcionando e teste:

```powershell
Invoke-RestMethod "http://localhost:5000/api/categorias?tipo=receita"
```

Para despesas:

```powershell
Invoke-RestMethod "http://localhost:5000/api/categorias?tipo=despesa"
```

---

## Recorrências não estão sendo geradas

Verifique o console do backend.

Deve aparecer uma mensagem indicando que o job de recorrências foi agendado.

O sistema verifica as recorrências diariamente às:

```text
00:01
```

A verificação também é executada quando o backend é iniciado.

---

# 💾 Backup

O banco de dados principal é:

```text
database.sqlite
```

Para fazer um backup, simplesmente copie esse arquivo para outro local.

Exemplo:

```powershell
Copy-Item database.sqlite database.backup.sqlite
```

Para restaurar:

1. Pare o backend.
2. Faça uma cópia do banco atual.
3. Substitua `database.sqlite` pelo backup.
4. Inicie novamente o backend.

**Importante:** não versionar `database.sqlite` no Git.

O arquivo está configurado no `.gitignore`.

---

# ⌨️ Atalhos Úteis

| Ação                           | Atalho |
| ------------------------------ | ------ |
| Recarregar página              | F5     |
| Abrir ferramentas do navegador | F12    |
| Parar servidor                 | CTRL+C |
| Limpar console PowerShell      | `cls`  |

---

# 🔧 Desenvolvimento

Backend:

```powershell
cd backend
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
```

Após alterar arquivos do backend, normalmente é necessário reiniciar o servidor caso o ambiente não faça isso automaticamente.

Após alterações no frontend, o Vite normalmente atualiza a página automaticamente.

---

# 📌 Estrutura do Projeto

```text
controle-contas/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db.js
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── routes/
│   │   │   ├── categorias.js
│   │   │   ├── dashboard.js
│   │   │   ├── export.js
│   │   │   └── transacao.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Despesas.jsx
│   │   │   ├── Exportar.jsx
│   │   │   └── Receitas.jsx
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database.sqlite
├── README.md
├── quickstart.md
└── .gitignore
```

---

# 🚧 Próximas Melhorias

* [ ] Autenticação de usuário
* [ ] Sincronização com nuvem
* [ ] Aplicativo mobile
* [ ] Notificações de despesas recorrentes
* [ ] Gráficos mais avançados
* [ ] Integração com bancos
* [ ] Melhorias de relatórios
* [ ] Backup automático
* [ ] Configurações gerais do sistema

---

## 💡 Dica

Antes de fazer alterações importantes no projeto, faça um backup do banco:

```powershell
Copy-Item database.sqlite database.backup.sqlite
```

E depois confira o estado do Git:

```powershell
git status
```

Assim você consegue identificar facilmente quais arquivos foram alterados.

---

## Suporte

Em caso de problemas, verifique nesta ordem:

1. Node.js instalado:

   ```powershell
   node --version
   ```

2. npm instalado:

   ```powershell
   npm --version
   ```

3. Backend funcionando:

   ```text
   http://localhost:5000/api/health
   ```

4. Frontend funcionando:

   ```text
   http://localhost:3000
   ```

5. Portas 5000 e 3000 disponíveis.

6. Console do navegador (`F12`) em caso de erro no frontend.

7. Console do backend em caso de erro na API.

Bom uso! 🚀
