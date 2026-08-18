# Historico de Atualizacoes

## Versao 1.3 - Pagamentos e parcelas futuras

Data: Agosto de 2026

## Novas funcionalidades

### Status de pagamento

Foi adicionado o campo:

```prisma
paga Boolean @default(false)
```

O campo representa se uma despesa foi paga.

### Pagamento individual

Cada despesa exibe:

```text
Pagar
```

Depois de paga, o botao se torna:

```text
Desmarcar
```

Receitas nao possuem status de pagamento.

### Pagamento em lote

O usuario pode selecionar varias despesas pendentes e clicar em:

```text
Pagar selecionadas
```

As requisicoes sao enviadas em sequencia para evitar bloqueios no SQLite.

### Parcelas futuras

Foi adicionada a rota:

```text
GET /api/transacoes/todas
```

Ela permite ao frontend exibir parcelas de todos os meses.

O botao:

```text
Ver todas as parcelas
```

permite selecionar e pagar parcelas futuras antecipadamente.

### Nova rota de pagamento

```text
PATCH /api/transacoes/:id/pagamento
```

Body:

```json
{
  "paga": true
}
```

### Exclusao de parcelas

Continuam disponiveis:

- Excluir somente esta parcela.
- Excluir esta parcela e as futuras.

## Ajustes tecnicos

### CORS

O backend passou a permitir PATCH:

```javascript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
```

### SQLite

A URL recomendada para o banco:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
```

### Prisma

Apos editar o schema:

```powershell
npx prisma migrate dev --name add_paga_field
npx prisma generate
```