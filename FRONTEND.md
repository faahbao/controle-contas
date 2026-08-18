# Frontend

## Stack

- React
- Vite
- Axios
- React Router
- CSS

## Arquivos principais

```text
frontend/src/pages/Dashboard.jsx
frontend/src/pages/Login.jsx
frontend/src/contexts/AuthContext.jsx
frontend/src/services/api.js
frontend/src/styles/Dashboard.css
```

## Dashboard

O arquivo `Dashboard.jsx` possui:

- Filtro mensal e anual
- Cards de resumo
- Grafico
- Formulario de transacao
- Formulario de categoria
- Lista de transacoes
- Modal de edicao
- Exclusao de parcelas
- Pagamento individual
- Pagamento em lote
- Visualizacao de todas as parcelas futuras
- Geracao de PDF

## Pagamentos

O botao `Pagar` aparece somente para transacoes do tipo `despesa`.

Despesas pagas:

- Recebem o badge `Paga`
- Exibem botao `Desmarcar`
- Nao podem ser selecionadas no pagamento em lote

Receitas:

- Nao exibem botao de pagamento
- Nao exibem checkbox de selecao

## Pagamento de varias parcelas

Na secao Transacoes:

- O botao `Selecionar nao pagas` seleciona despesas pendentes.
- O botao `Pagar X selecionadas` atualiza as despesas selecionadas.
- As atualizacoes sao feitas uma por vez para evitar timeout no SQLite.

## Parcelas futuras

O botao `Ver todas as parcelas` fica no cabecalho da secao Transacoes.

Quando ativado:

- Chama `GET /transacoes/todas`
- Mostra parcelas passadas, atuais e futuras
- Permite selecionar e pagar parcelas futuras

## API Axios

O arquivo `frontend/src/services/api.js` deve apontar para o backend:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})
```

O token JWT deve ser enviado automaticamente no header:

```http
Authorization: Bearer <token>
```

## Executar

```powershell
cd D:\Projetos\controle-contas\frontend
npm install
npm run dev
```

Se o navegador mantiver uma versao antiga, use:

```text
Ctrl + F5
```