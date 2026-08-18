# Frontend - Documentacao

## Estrutura

```text
frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── Login.css
│   │   └── Dashboard.css
│   └── App.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Tecnologias

- React 18+
- Vite
- Axios
- React Router DOM
- CSS3

## Componentes Principais

### Dashboard.jsx

Funcionalidades:

- Cards com receitas, despesas e saldo
- Grafico de barras (receitas vs despesas)
- Filtro por mes/ano
- Formulario de nova transacao
- Lista de transacoes com edicao/exclusao
- Transacoes recorrentes com parcelas
- Modal de edicao
- Botao para gerar PDF
- Visualizacao de parcelas futuras
- Pagamento de despesas (individual e em lote)
- Pagamento antecipado de parcelas futuras
- Exclusao de parcela unica ou futuras

### Login.jsx

Funcionalidades:

- Login com email/senha
- Cadastro de novo usuario
- Integracao com AuthContext

## Estilizacao

- CSS3 puro
- Design responsivo
- Cards coloridos por tipo (verde=receita, vermelho=despesa, azul=saldo)
- Badges para transacoes recorrentes
- Indicadores visuais de pagamento

## Como rodar

```powershell
# Instalar dependencias
npm install

# Iniciar desenvolvimento
npm run dev

# Build de producao
npm run build

# Preview de producao
npm run preview
```

## Exemplo: Adicionar transacao recorrente

1. Preencha descricao, valor, data
2. Selecione tipo (receita/despesa) e categoria
3. Marque "Recorrente?"
4. Escolha frequencia (diaria, semanal, mensal)
5. Informe quantidade de parcelas (ex: 12)
6. Clique em "Adicionar"

**Resultado:** Transacoes criadas automaticamente para cada mes

## Pagamento de despesas

### Individual

1. Na lista de transacoes, localize a despesa
2. Clique no botao de pagamento
3. A despesa e marcada como paga
4. Para desfazer, clique novamente

### Em lote

1. Acesse a secao de transacoes
2. Marque os checkboxes das despesas desejadas
3. Clique em "Pagar selecionadas"
4. O frontend atualiza cada parcela sequencialmente

## Pagamento antecipado

Para pagar parcelas futuras:

1. Clique em "Ver todas as parcelas"
2. O frontend chama `GET /api/transacoes/todas`
3. Localize as parcelas dos meses futuros
4. Selecione as desejadas
5. Clique em "Pagar selecionadas"

## Visualizacao de parcelas

- **Mes selecionado:** Mostra apenas as transacoes do mes filtrado
- **Todas as parcelas:** Mostra todas as transacoes, incluindo futuras

## Exclusao de parcelas

- **Excluir esta:** Remove somente a parcela clicada
- **Excluir futuras:** Remove a parcela clicada e todas as posteriores

## Fluxo de dados

```text
Usuario -> Frontend (React) -> API (Express) -> Prisma -> SQLite
         <- Resposta <-
```

## Variaveis de ambiente

### Frontend (.env)

| Variavel | Descricao | Exemplo |
|---|---|---|
| VITE_API_URL | URL da API backend | http://localhost:3000/api |

## Integracao com AuthContext

O `AuthContext` gerencia:

- Estado de autenticacao
- Token JWT
- Dados do usuario logado
- Logout com cleanup de token

Todas as chamadas API incluem automaticamente o token no header:

```http
Authorization: Bearer <token>
```