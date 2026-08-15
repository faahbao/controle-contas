# 🔄 Histórico de Atualizaçªµes

## VersÆ£o 1.1 - Transaçªµes Recorrentes com Parcelas

**Data:** Agosto 2026

---

## ✨ Novas Funcionalidades

### 1. Campo de Parcelas no FormulÆ¡rio

**O que mudou:**
- Adicionado campo "Qtd. Parcelas" quando marca "Recorrente?"
- Input numÆ©rico (1-120 parcelas)
- SÆ¢ aparece se "Recorrente?" estiver marcado

**Arquivos alterados:**
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/styles/Dashboard.css`

---

### 2. Geraçª£o AutomÆ¡tica de Parcelas

**O que mudou:**
- Ao lançar transaçª£o recorrente com N parcelas, backend cria N transaçªµes
- Cada transaçª£o tem data automÆ¡tica (mŒs seguinte)
- Descriçª£o inclui nÆºmero da parcela: "Aluguel (1/5)", "Aluguel (2/5)", etc.

**Arquivos alterados:**
- `backend/src/server.js`
- `backend/prisma/schema.prisma`

---

### 3. Schema do Prisma Atualizado

**Novos campos:**
```prisma
parcelas     Int?     // quantidade total de parcelas
parcelaAtual Int?     // nÆºmero da parcela (1, 2, 3...)
```

**Arquivo:** `backend/prisma/schema.prisma`

---

### 4. Badge Visual de Parcelas

**O que mudou:**
- Transaçªµes recorrentes mostram badge: 🔄 mensal (2/5)
- Cor laranja para destacar
- Mostra frequŒncia e parcela atual/total

**Arquivos alterados:**
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/styles/Dashboard.css`

---

## 🐛 Correçªµes

### 1. Filtro de MŒs/Ano

**Problema:** Dashboard nÆ£o carregava ao filtrar por mŒs
**Soluçª£o:** Endpoint `/api/dashboard` implementado

**Arquivo:** `backend/src/server.js`

---

### 2. Envio de Dados do Frontend

**Problema:** Campo `recorrente` nÆ£o estava sendo enviado
**Soluçª£o:** Console.log adicionado para debug

**Arquivo:** `frontend/src/pages/Dashboard.jsx`

---

## 📝 Migraçªµes

### Migraçª£o 1: Adicionar campos de parcelas

```bash
npx prisma migrate dev --name add_parcelas
```

### Migraçª£o 2: Adicionar parcelaAtual

```bash
npx prisma migrate dev --name add_parcela_atual
```

---

## 🧪 Testes Realizados

✅ Criar transaçª£o recorrente de 5 parcelas
✅ Visualizar parcelas em meses diferentes
✅ Filtro por mŒs mostra parcela correta
✅ Ediçª£o de transaçª£o recorrente
✅ ExclusÆ£o de transaçª£o recorrente
✅ Badge visual aparece corretamente

---

## 📊 Exemplo de Uso

### CenÆ¡rio: Aluguel de 5 parcelas

**Passo 1:** UsuÆ¡rio acessa dashboard
**Passo 2:** Preenche formulÆ¡rio:
- Descriçª£o: Aluguel
- Valor: 1000
- Data: 15/08/2026
- Recorrente: Sim
- FrequŒncia: Mensal
- Parcelas: 5

**Passo 3:** Backend cria 5 transaçªµes:
- 15/08/2026: Aluguel (1/5)
- 15/09/2026: Aluguel (2/5)
- 15/10/2026: Aluguel (3/5)
- 15/11/2026: Aluguel (4/5)
- 15/12/2026: Aluguel (5/5)

**Passo 4:** UsuÆ¡rio filtra por setembro
**Resultado:** VŒ "Aluguel (2/5)" de R$ 1.000

---

## 🚀 Como Atualizar

### Backend

```bash
cd backend

# 1. Atualizar schema
# Editar prisma/schema.prisma

# 2. Rodar migraçªµes
npx prisma migrate dev --name add_parcelas
npx prisma migrate dev --name add_parcela_atual

# 3. Reiniciar servidor
npm run dev
```

### Frontend

```bash
cd frontend

# 1. Atualizar arquivos
# Substituir src/pages/Dashboard.jsx

# 2. Atualizar styles
# Adicionar CSS em src/styles/Dashboard.css

# 3. Recarregar navegador
# F5
```

---

## 📈 MÆ©tricas

- **Linhas de cÆ¢digo adicionadas:** ~200
- **Arquivos alterados:** 6
- **Novos endpoints:** 1 (/api/dashboard)
- **Novos campos no banco:** 2 (parcelas, parcelaAtual)

---

## 🔜 PrÆ¢ximas Atualizaçªµes (Planejadas)

- [ ] GrÆ¢ficos com Chart.js
- [ ] Notificaçªµes push
- [ ] Exportaçª£o em Excel
- [ ] Metas de economia
- [ ] Dashboard com insights

---

## 📝 Changelog Completo

### v1.1.0
- ✅ Transaçªµes recorrentes com parcelas
- ✅ Geraçª£o automÆ¡tica de parcelas
- ✅ Badge visual de parcelas
- ✅ Filtro por mŒs/ano corrigido
- ✅ Documentaçª£o atualizada

### v1.0.0
- ✅ Autenticaçª£o JWT
- ✅ CRUD de transaçªµes
- ✅ Dashboard bÆ¡sico
- ✅ Categorias
- ✅ RelatÆ¢rio PDF

---

**VersÆ£o atual:** 1.1.0
**Æºltima atualizaçª£o:** Agosto 2026