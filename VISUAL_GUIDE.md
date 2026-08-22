# Guia Visual

## Login

1. Abra a URL do frontend.
2. Cadastre um usuário ou informe e-mail e senha.
3. Após a autenticação, o dashboard será exibido.

## Dashboard

A tela principal reúne:

```text
Cabeçalho
Filtros de mês e ano
Cards de receitas, despesas e saldo
Gráficos
Formulário de nova transação
Gerenciador de categorias
Lista de transações
Ações de pagamento e exclusão
```

## Nova transação

Preencha:

```text
Descrição
Valor
Data
Tipo
Categoria
```

Para criar parcelas:

1. Ative `Recorrente?`.
2. Escolha a frequência.
3. Informe a quantidade de parcelas.
4. Clique em adicionar.

## Lista de transações

Cada item pode mostrar:

```text
Descrição
Categoria
Data
Valor
Parcela atual/total
Editar
Excluir
```

Despesas também podem mostrar:

```text
Checkbox
Pagar ou Desmarcar
Badge Paga
```

Para parcelas, as ações podem ser:

```text
Excluir esta
Excluir futuras
```

A primeira remove somente a parcela atual. A segunda remove a parcela atual e as posteriores do mesmo grupo.

## Todas as parcelas

Ao selecionar `Ver todas as parcelas`:

- O filtro mensal deixa de limitar a lista.
- Parcelas futuras aparecem.
- Despesas futuras podem ser selecionadas.
- O pagamento antecipado fica disponível.

## Pagamento em lote

1. Selecione despesas pendentes.
2. Clique em `Pagar selecionadas`.
3. Aguarde as atualizações.
4. Confira o badge de pagamento.

## Relatório PDF

1. Selecione o mês e o ano.
2. Clique em `Gerar PDF`.
3. O navegador fará o download do arquivo.

## Responsividade

Em telas pequenas, filtros, ações e formulários ficam empilhados. Tabelas extensas usam rolagem horizontal dentro do próprio painel, sem aumentar a largura da página.
