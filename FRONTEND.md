# Frontend

## Visão geral

O frontend é uma aplicação React com Vite. Ele apresenta autenticação, dashboard, receitas, despesas, categorias, parcelas e relatórios.

## Estrutura

```text
frontend/
├── src/
│   ├── components/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Receitas.jsx
│   │   ├── Despesas.jsx
│   │   └── Relatorios.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   ├── Receitas.css
│   │   └── Relatorios.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

Os nomes podem variar conforme a implementação atual; mantenha este documento alinhado aos arquivos existentes.

## Tecnologias

- React 18 ou superior.
- Vite.
- Axios.
- React Router DOM.
- CSS3 responsivo.

## Autenticação

O `AuthContext` controla usuário, token, login, cadastro e logout. O cliente HTTP deve enviar o token em rotas protegidas:

```http
Authorization: Bearer <token>
```

O token não deve ser incluído em URLs nem exibido em mensagens de erro.

## Dashboard

O dashboard apresenta:

- Receitas, despesas e saldo do período.
- Filtros por mês e ano.
- Gráficos de receitas e despesas.
- Formulário de transação.
- Lista de transações.
- Controles de edição, exclusão e pagamento.
- Acesso a parcelas futuras e relatório PDF.

## Transações

Para criar uma transação recorrente:

1. Preencha descrição, valor, data, tipo e categoria.
2. Ative a opção de recorrência.
3. Selecione a frequência.
4. Informe a quantidade de parcelas.
5. Salve a transação.

O backend criará os registros das parcelas.

## Pagamentos

- Despesas pendentes podem ser marcadas como pagas.
- O botão pode desfazer o pagamento.
- Checkboxes permitem pagamento em lote.
- Parcelas futuras podem ser exibidas e pagas antecipadamente.

## API

A URL deve vir de variável de ambiente:

```env
VITE_API_URL="http://localhost:3000/api"
```

Quando o sistema estiver atrás de Cloudflare Tunnel, use o domínio atual, sem reutilizar links temporários antigos. Reinicie o Vite após alterar variáveis `VITE_*`.

## Scripts

```powershell
npm install
npm run dev
npm run build
npm run preview
```

## Responsividade

A interface deve funcionar em telas pequenas. Os filtros e ações devem ocupar a largura disponível, enquanto tabelas extensas podem usar rolagem horizontal dentro de seu próprio contêiner.
