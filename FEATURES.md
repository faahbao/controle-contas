# Funcionalidades

## Autenticação

- Cadastro e login de usuários.
- Tokens JWT.
- Proteção de rotas.
- Contexto de autenticação no frontend.
- Logout e limpeza do token.

## Transações

- Receitas e despesas.
- Descrição, valor, tipo, categoria e data.
- Categorias predefinidas e personalizadas.
- Filtros por tipo, categoria, mês e ano.
- Criação, edição e exclusão.

## Recorrência e parcelas

A opção recorrente permite gerar lançamentos diários, semanais ou mensais. O sistema agrupa as parcelas por `grupoParcelasId` e identifica cada uma com `parcelaAtual` e `parcelas`.

Exemplo:

```text
08/2026: Aluguel (1/5)
09/2026: Aluguel (2/5)
10/2026: Aluguel (3/5)
11/2026: Aluguel (4/5)
12/2026: Aluguel (5/5)
```

## Pagamentos

- Marcação individual de despesas como pagas.
- Desmarcação de uma despesa.
- Seleção de várias despesas para pagamento em lote.
- Pagamento antecipado de parcelas futuras.
- Status independente por parcela.
- Receitas não usam o status de pagamento.

## Dashboard

- Cards de receitas, despesas e saldo.
- Gráficos comparativos.
- Filtros por mês e ano.
- Lista de transações.
- Ações de editar, excluir e pagar.

## Categorias

- Categorias iniciais para receitas e despesas.
- Cadastro de categorias personalizadas.
- Tipo da categoria associado à receita ou despesa.

## Relatórios

- Geração de PDF.
- Resumo do período.
- Receitas, despesas, saldo e transações.
- Filtros por mês e ano.

## Interface

- Layout responsivo.
- Navegação por menu lateral.
- Cards e indicadores por tipo.
- Badges para recorrência e pagamentos.
- Tabelas com rolagem horizontal em telas pequenas.

## Dados e segurança

- Dados armazenados em SQLite local.
- Senhas protegidas com hash.
- JWT para autenticação.
- Validação de entrada.
- CORS configurado para origens autorizadas.
- Arquivo `.env` fora do controle de versão.
