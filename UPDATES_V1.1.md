# 📝 Alterações - Sistema de Parcelamento

**Data**: 13 de agosto de 2026  
**Versão**: 1.1  
**Mudanças**: Adicionado suporte a parcelamento (múltiplas parcelas com data de término)

## 🎯 Que foi Alterado?

### ✨ Novas Funcionalidades

**Frontend - Formulário**
- ✅ Novo campo "Com parcelas" (checkbox) para marcar se é parcelado
- ✅ Campo "Número de parcelas" aparece quando marcado
- ✅ Exibe período do parcelamento (data início até data término)
- ✅ Calcula automaticamente a data final baseado no número de parcelas

**Frontend - Tabela de Transações**
- ✅ Nova coluna "Parcelas" mostrando:
  - `-` se não for parcelado
  - `5x até 01/05/2026` se for parcelado
- ✅ Permite editar número de parcelas inline

**Backend - API**
- ✅ Aceita `num_parcelas` nas requisições POST (criar transação)
- ✅ Calcula `data_termino` automaticamente
- ✅ Armazena `parcela_numero` (qual parcela é)
- ✅ Rastreia `transacao_original_id` (link com transação mãe)

**Backend - Job de Recorrências**
- ✅ Gera apenas N parcelas (não infinitas)
- ✅ Respeita limite definido
- ✅ Para de gerar quando atinge o limite
- ✅ Log mostra `(2/5)` por exemplo

**Banco de Dados - Schema**
- ✅ Nova coluna: `num_parcelas` (INTEGER)
- ✅ Nova coluna: `data_termino` (TEXT)
- ✅ Nova coluna: `parcela_numero` (INTEGER)
- ✅ Nova coluna: `transacao_original_id` (INTEGER FK)

---

## 📊 Exemplo de Uso

### Antes (Recorrência Infinita)
```
Despesa: R$30.00
Data: 01/01/2026
Recorrente: Sim ✓
Tipo: Mensal

Resultado:
- 01/01/2026 - R$30.00
- 01/02/2026 - R$30.00
- 01/03/2026 - R$30.00
- ... (infinitamente)
```

### Depois (Parcelamento Limitado) ✨
```
Despesa: R$30.00
Data: 01/01/2026
Com parcelas: Sim ✓
Número de parcelas: 5

Resultado:
- 01/01/2026 - R$30.00 (Parcela 1/5)
- 01/02/2026 - R$30.00 (Parcela 2/5)
- 01/03/2026 - R$30.00 (Parcela 3/5)
- 01/04/2026 - R$30.00 (Parcela 4/5)
- 01/05/2026 - R$30.00 (Parcela 5/5) ← Para aqui!
```

---

## 🔄 Impacto em Dados Existentes

**Transações Antigas**:
- ✅ Continuam funcionando normalmente
- ✅ Coluna `num_parcelas` será `NULL` (considerado como 1 parcela)
- ✅ Coluna `data_termino` será `NULL`

**Nova Estrutura**:
- Se criar transação sem parcelas: `num_parcelas` = NULL
- Se criar com parcelas: `num_parcelas` = 5 (ou o valor escolhido)

---

## 📁 Arquivos Modificados

### Backend
```
backend/src/db.js
  └─ Schema: Adicionadas 4 novas colunas

backend/src/controllers/transacaoController.js
  ├─ criarTransacao()    - Aceita num_parcelas
  └─ atualizarTransacao() - Atualiza num_parcelas

backend/src/jobs/recurrenceJob.js
  └─ gerarRecorrenciasDoMes() - Respeita limite de parcelas
```

### Frontend
```
frontend/src/components/FormularioTransacao.jsx
  ├─ Novo campo: "Com parcelas" (checkbox)
  ├─ Novo campo: "Número de parcelas" (input)
  └─ Informação: Período de parcelamento (exibição)

frontend/src/components/ListaTransacoes.jsx
  ├─ Nova coluna: "Parcelas"
  └─ Edição inline de num_parcelas

frontend/src/styles/FormularioTransacao.css
  └─ Novo: .form-group.info-parcelas

frontend/src/styles/ListaTransacoes.css
  └─ Novo: .parcelas-cell
```

---

## 🚀 Como Usar

### Criar Despesa Parcelada

1. Clique em **"💸 Despesas"**
2. Preencha:
   - **Categoria**: Cartão Itau
   - **Descrição**: Compra parcelada
   - **Valor (R$)**: 150.00
   - **Data**: 01/01/2026
3. Marque: **✓ Com parcelas**
4. **Número de parcelas**: 5
5. Verá no formulário:
   ```
   De: 01/01/2026
   Até: 01/05/2026
   ```
6. Clique em **"Adicionar"**

### Resultado

A tabela mostrará:
```
Data        | Categoria    | Descrição          | Valor    | Parcelas
01/01/2026  | Cartão Itau  | Compra parcelada   | -R$150   | 5x até 01/05/2026
```

E no backend, serão criadas 5 transações:
- 01/01/2026 (parcela 1/5)
- 01/02/2026 (parcela 2/5) ← gerada automaticamente
- 01/03/2026 (parcela 3/5) ← gerada automaticamente
- 01/04/2026 (parcela 4/5) ← gerada automaticamente
- 01/05/2026 (parcela 5/5) ← gerada automaticamente

---

## 🔧 Detalhes Técnicos

### API Payload - Criar Transação Parcelada

```json
POST /api/receitas

{
  "tipo": "despesa",
  "categoria": "Cartão Itau",
  "descricao": "Compra parcelada",
  "valor": 150.00,
  "data": "2026-01-01",
  "recorrente": true,
  "num_parcelas": 5
}
```

### Response

```json
{
  "id": 1,
  "message": "Transação criada com sucesso (5 parcelas)",
  "num_parcelas": 5,
  "data_termino": "2026-05-01"
}
```

### Banco de Dados - Estrutura

```sql
-- Transação original (mãe)
INSERT INTO transactions VALUES (
  id = 1,
  tipo = 'despesa',
  categoria = 'Cartão Itau',
  valor = 150.00,
  data = '2026-01-01',
  recorrente = 1,
  num_parcelas = 5,              -- Novo!
  data_termino = '2026-05-01',  -- Novo!
  parcela_numero = 1,            -- Novo! (parcela 1/5)
  transacao_original_id = NULL   -- Novo! (ela é a original)
);

-- Parcelas geradas automaticamente
INSERT INTO transactions VALUES (
  id = 2,
  transacao_original_id = 1,     -- Link com original
  parcela_numero = 2,            -- Esta é a parcela 2/5
  data = '2026-02-01'            -- Mês seguinte
);
-- ... etc para parcelas 3, 4, 5
```

---

## ✅ Checklist de Testes

- [ ] Criar despesa com 3 parcelas
- [ ] Verificar se aparecem 3 linhas na tabela
- [ ] Verificar coluna "Parcelas" mostra "3x até 01/03/2026"
- [ ] Criar receita sem parcelas (checkbox desmarcado)
- [ ] Verificar coluna "Parcelas" mostra "-"
- [ ] Editar parcelas inline
- [ ] Deletar uma parcela (verifica se funciona)
- [ ] Exportar CSV com parcelas
- [ ] Gerar relatório com parcelas
- [ ] Reiniciar backend (verifica se job respeita limites)

---

## 🐛 Possíveis Problemas

### Banco SQLite existente
**Problema**: Se tinha dados antigos, o schema não será atualizado automaticamente

**Solução**:
1. Parar o backend
2. Deletar `database.sqlite`
3. Reiniciar backend (recriará com novo schema)

### Transações antigas não mostram parcelas
**Problema**: Transações criadas antes desta atualização terão `num_parcelas = NULL`

**Solução**: Isso é esperado. Apenas transações novas terão parcelamento

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique se o banco foi recriado
2. Verifique se o backend reiniciou com sucesso
3. Limpe cache do navegador (F5 ou Ctrl+Shift+R)
4. Verifique console do navegador (F12) para erros

---

**Versão**: 1.1  
**Status**: ✅ Pronto para uso  
**Data da atualização**: 13 de agosto de 2026
