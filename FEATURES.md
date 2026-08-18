# Funcionalidades

## Autenticacao

- Cadastro de usuario com nome, email e senha
- Login com JWT
- Protecao de rotas no frontend
- Contexto de autenticacao (AuthContext)
- Logout com cleanup de token

## Transacoes

### Tipos

- **Receita** - Entradas de dinheiro
- **Despesa** - Saidas de dinheiro

### Campos

- Descricao
- Valor
- Tipo (receita/despesa)
- Categoria
- Data
- Recorrente (sim/nao)
- Frequencia (diaria, semanal, mensal)
- Parcelas (quantidade)

### Recorrente com Parcelas

**Como funciona:**

1. Usuario marca "Recorrente?"
2. Escolhe frequencia (ex: mensal)
3. Informa parcelas (ex: 5)
4. Sistema cria automaticamente 5 transacoes (uma por mes)

**Exemplo:**

Lancamento: Aluguel R$ 1.000 em 08/2026 (5 parcelas)

```text
08/2026: Aluguel (1/5)
09/2026: Aluguel (2/5)
10/2026: Aluguel (3/5)
11/2026: Aluguel (4/5)
12/2026: Aluguel (5/5)
```

## Pagamento de Despesas

### Individual

- Marcar/desmarcar despesa como paga
- Botao dedicado para cada despesa
- Somente despesas podem ser pagas (receitas nao exibem botao)

### Em Lote

- Selecao de varias despesas via checkbox
- Pagamento sequencial de todas as selecionadas
- Evita bloqueio do SQLite

### Pagamento Antecipado

- Visualizar todas as parcelas (meses futuros)
- Pagar parcelas de meses futuros antecipadamente
- Cada parcela mantem seu proprio status de pagamento

## Dashboard

### Cards

- Receitas do mes
- Despesas do mes
- Saldo (receitas - despesas)

### Grafico

- Barras horizontais comparando receitas vs despesas
- Porcentagem visual

### Filtros

- Mes (01-12)
- Ano (2024-2028)

## Categorias

### Pre-definidas

- **Receita:** Salario, Freelance, Investimentos, Outros
- **Despesa:** Alimentacao, Transporte, Moradia, Saude, Educacao, Lazer, Vestuario, Outros

### Personalizadas

- Usuario pode criar novas categorias
- Define tipo (receita ou despesa)

## Relatorios

- Geracao de PDF com resumo do mes
- Inclui: receitas, despesas, saldo e transacoes
- Filtro por mes/ano

## Edicao e Exclusao

- Editar transacoes existentes
- Excluir transacoes com confirmacao
- Modal de edicao com todos os campos
- Exclusao de parcela unica
- Exclusao de parcela selecionada e futuras

## Visualizacao de Parcelas

- Filtrar por mes especifico
- Visualizar todas as parcelas (sem filtro de mes)
- Identificar parcelas ja pagas
- Navegar entre meses futuros e passados

## Interface

- Design limpo e moderno
- Responsivo (funciona em mobile)
- Cores intuitivas (verde=receita, vermelho=despesa, azul=saldo)
- Badges para transacoes recorrentes
- Icones emojis para melhor UX
- Indicadores visuais de pagamento

## Seguranca

- Senhas com hash bcrypt
- Tokens JWT com expiracao
- Validacao de email e senha
- Protecao contra rotas nao autorizadas
- CORS configurado para origem especifica

## Banco de Dados

- SQLite local (arquivo unico)
- Sem necessidade de servidor externo
- Dados armazenados localmente
- Backup facil (copiar arquivo .db)