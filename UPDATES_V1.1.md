# Histórico de Atualizações

> O nome deste arquivo é histórico. As alterações mais recentes também devem ser registradas em `CHANGELOG.md`.

## Versão 1.3 — Pagamentos e parcelas futuras

### Status de pagamento

Foi adicionado o campo lógico `paga` às transações. Ele representa se uma despesa foi paga. Receitas não precisam desse status.

### Pagamento individual

Cada despesa pode ser marcada como paga ou voltar ao estado pendente. O status é independente por parcela.

### Pagamento em lote

O usuário pode selecionar diversas despesas e executar o pagamento em lote. As requisições devem ser processadas sequencialmente para reduzir bloqueios no SQLite.

### Parcelas futuras

A rota `GET /api/transacoes/todas` permite listar transações sem limitar o mês atual. Assim, parcelas futuras podem ser consultadas e pagas antecipadamente.

### Rotas relacionadas

```text
GET   /api/transacoes/todas
PATCH /api/transacoes/:id/pagamento
DELETE /api/transacoes/:id/futuras
```

### CORS e acesso externo

O backend deve aceitar os métodos realmente utilizados, incluindo `PATCH`, e permitir a origem atual do frontend. Links temporários de Cloudflare Tunnel podem mudar; quando isso ocorrer, atualize `VITE_API_URL` e a configuração de CORS e reinicie os serviços.

### SQLite e Prisma

A configuração recomendada para desenvolvimento é:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
```

Após alterar o schema:

```powershell
cd backend
npx prisma migrate dev --name descricao_da_mudanca
npx prisma generate
```

## Observação

Não confunda a versão do arquivo com a versão atual do sistema. Consulte `CHANGELOG.md` para o histórico completo.
