# Guia Visual

## Login

1. Abra o frontend.
2. Cadastre um usuario ou faca login.
3. Apos o login, o Dashboard sera exibido.

## Dashboard

O Dashboard possui:

```text
Cabecalho
Filtros de mes e ano
Cards de receitas, despesas e saldo
Grafico de receitas versus despesas
Formulario Nova Transacao
Formulario Nova Categoria
Secao Transacoes
```

## Nova transacao

Preencha:

```text
Descricao
Valor
Data
Tipo
Categoria
```

Para criar parcelas:

1. Marque `Recorrente?`.
2. Selecione diaria, semanal ou mensal.
3. Informe a quantidade de parcelas.
4. Clique em `Adicionar`.

## Lista de transacoes

Cada transacao exibe:

```text
Descricao
Categoria
Data
Valor
Botao de editar
Botao de excluir
```

Despesas tambem exibem:

```text
Checkbox de selecao
Pagar ou Desmarcar
Badge Paga quando aplicavel
```

Transacoes parceladas tambem exibem:

```text
Esta
Futuras
```

`Esta` exclui somente a parcela atual.

`Futuras` exclui a parcela atual e as posteriores.

## Todas as parcelas

No cabecalho da secao Transacoes existe o botao:

```text
Ver todas as parcelas
```

Ao clicar:

- Parcelas de meses futuros aparecem.
- O filtro mensal deixa de limitar a lista.
- Parcelas futuras podem ser selecionadas.
- O usuario pode pagar parcelas antecipadamente.

## Pagamento em lote

1. Clique em `Selecionar nao pagas` ou marque checkboxes individuais.
2. Clique em `Pagar X selecionadas`.
3. Aguarde a conclusao.
4. As despesas receberao o badge `Paga`.

## Relatorio PDF

1. Escolha mes e ano.
2. Clique em `Gerar PDF`.
3. O navegador baixa o relatorio do periodo selecionado.