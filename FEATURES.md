# Funcionalidades

## Autenticacao

- Cadastro de usuario
- Login com JWT
- Rotas protegidas
- Logout
- Senhas armazenadas com hash bcrypt

## Transacoes

- Criacao de receitas
- Criacao de despesas
- Edicao de transacoes
- Exclusao de transacoes
- Filtro por mes e ano
- Categorias pre-definidas
- Categorias personalizadas

## Parcelas recorrentes

- Frequencia diaria
- Frequencia semanal
- Frequencia mensal
- Quantidade de parcelas entre 1 e 120
- Geracao automatica de uma transacao para cada parcela
- Identificacao visual da parcela atual e total
- Grupo de parcelas pelo campo `grupoParcelasId`

Exemplo:

```text
Compra (1/3)
Compra (2/3)
Compra (3/3)
```

## Exclusao de parcelas

Para transacoes parceladas, o usuario pode:

- Excluir somente a parcela selecionada
- Excluir a parcela selecionada e todas as futuras

Parcelas anteriores permanecem no historico.

## Pagamentos

- Apenas despesas exibem o botao `Pagar`
- Despesas pagas recebem status `paga: true`
- Despesas pagas podem voltar para pendente
- Despesas pagas recebem badge visual
- Receitas nao possuem status de pagamento
- Checkboxes permitem selecionar varias despesas pendentes
- O botao `Pagar selecionadas` paga varias parcelas
- Pagamento em lote ocorre de forma sequencial para evitar bloqueio do SQLite

## Pagamento antecipado

O botao `Ver todas as parcelas` permite visualizar transacoes de meses futuros.

Fluxo:

1. Clique em `Ver todas as parcelas`
2. Selecione parcelas pendentes de meses futuros
3. Clique em `Pagar selecionadas`
4. Cada parcela e marcada como paga individualmente

## Dashboard

- Card de receitas
- Card de despesas
- Card de saldo
- Grafico de receitas versus despesas
- Filtro por mes
- Filtro por ano

## Relatorios

- Geracao de PDF
- Resumo de receitas, despesas e saldo
- Lista de transacoes do periodo
- Status de pagamento para despesas