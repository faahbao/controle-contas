# 🎨 Guia Visual do Sistema

## 📱 VisÆ£o Geral

Este guia mostra como o sistema se parece e como navegar.

---

## 🔐 Tela de Login

```
┌─────────────────────────────────┐
│                                 │
│     💰 Controle Financeiro      │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Email                    │  │
│  │  [joao@email.com]         │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Senha                    │  │
│  │  [********]               │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │       ENTRAR              │  │
│  └───────────────────────────┘  │
│                                 │
│  NÆ£o tem conta? Cadastre-se    │
│                                 │
└─────────────────────────────────┘
```

**Cores:**
- Fundo: Gradiente azul (#667eea → #764ba2)
- Cards: Branco (#ffffff)
- BotÆ£o: Azul (#667eea)

---

## 📊 Dashboard Principal

```
┌────────────────────────────────────────────────────┐
│  💰 Controle de Contas        OlÆ¡, JoÆ£o   [Sair]  │
├────────────────────────────────────────────────────┤
│                                                    │
│  MŒs: [Agosto ▼]  Ano: [2026 ▼]  [📄 Gerar PDF]  │
│                                                    │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│  │ Receitas   │ │ Despesas   │ │ Saldo      │    │
│  │ R$ 5.000   │ │ R$ 3.000   │ │ R$ 2.000   │    │
│  │ 💚         │ │ ❤️         │ │ 💙         │    │
│  └────────────┘ └────────────┘ └────────────┘    │
│                                                    │
│  📊 Receitas vs Despesas                          │
│  ┌──────────────────────────────────────────┐    │
│  │ Receitas: ████████████████████ R$ 5.000  │    │
│  │ Despesas: ██████████████ R$ 3.000        │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ➕ Nova Transaçª£o                                │
│  ┌──────────────────────────────────────────┐    │
│  │ [Descriçª£o] [Valor] [Data]              │    │
│  │ [Tipo: Despesa▼] [Categoria▼]            │    │
│  │ ☑ Recorrente?                            │    │
│  │ [FrequŒncia: Mensal▼] [Parcelas: 5]     │    │
│  │ [Adicionar]                              │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  📋 Transaçªµes                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ Aluguel (2/5) 🔄 mensal                  │    │
│  │ Moradia         15/09/2026               │    │
│  │                        - R$ 1.000 [✏️][🗑️]│    │
│  ├──────────────────────────────────────────┤    │
│  │ SalÆ¡rio                                 │    │
│  │ SalÆ¡rio          10/09/2026             │    │
│  │                        + R$ 5.000 [✏️][🗑️]│    │
│  └──────────────────────────────────────────┘    │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Cores:**
- Receitas: Verde (#27ae60)
- Despesas: Vermelho (#e74c3c)
- Saldo: Azul (#3498db)
- Badge Recorrente: Laranja (#f39c12)

---

## 🏷️ Badges e Æcones

### Tipos de Transaçª£o

| Tipo | Æcone | Cor |
|------|--------|-----|
| Receita | ➕ ou + | Verde |
| Despesa | ➖ ou - | Vermelho |

### Status

| Status | Badge | Cor |
|--------|-------|-----|
| Recorrente | 🔄 mensal (2/5) | Laranja |
| Ænica | (nenhum) | - |

### Açªµes

| AçÆ£o | Æcone |
|-------|--------|
| Editar | ✏️ |
| Excluir | 🗑️ |
| Adicionar | ➕ |
| PDF | 📄 |
| GrÆ¢fico | 📊 |

---

## 📝 FormulÆ¡rio de Transaçª£o

### Modo Normal

```
┌─────────────────────────────────┐
│  ➕ Nova Transaçª£o             │
│                                 │
│  Descriçª£o: [Aluguel       ]   │
│  Valor: [1000.00]               │
│  Data: [15/08/2026]             │
│  Tipo: [Despesa ▼]              │
│  Categoria: [Moradia ▼]         │
│  ☐ Recorrente?                  │
│                                 │
│  [Adicionar]                    │
└─────────────────────────────────┘
```

### Modo Recorrente

```
┌─────────────────────────────────┐
│  ➕ Nova Transaçª£o             │
│                                 │
│  Descriçª£o: [Aluguel       ]   │
│  Valor: [1000.00]               │
│  Data: [15/08/2026]             │
│  Tipo: [Despesa ▼]              │
│  Categoria: [Moradia ▼]         │
│  ☑ Recorrente?                  │
│  FrequŒncia: [Mensal ▼]         │
│  Parcelas: [5]                  │
│                                 │
│  [Adicionar]                    │
└─────────────────────────────────┘
```

---

## 📋 Lista de Transaçªµes

### Transaçª£o Ænica

```
┌────────────────────────────────────┐
│  SalÆ¡rio                         │
│  SalÆ¡rio      10/08/2026         │
│                  + R$ 5.000 [✏️][🗑️]│
└────────────────────────────────────┘
```

### Transaçª£o Recorrente

```
┌────────────────────────────────────┐
│  Aluguel (2/5) 🔄 mensal          │
│  Moradia     15/09/2026           │
│                  - R$ 1.000 [✏️][🗑️]│
└────────────────────────────────────┘
```

---

## 🎨 Paleta de Cores

### Cores Principais

| Cor | Hex | Uso |
|-----|-----|-----|
| Azul Principal | #667eea | BotÆµes, links |
| Azul Escuro | #764ba2 | Gradientes |
| Verde | #27ae60 | Receitas, sucesso |
| Vermelho | #e74c3c | Despesas, erro |
| Laranja | #f39c12 | Recorrente, alertas |
| Cinza | #ecf0f1 | Fundos, bordas |

### Cores de Fundo

| Elemento | Cor |
|----------|-----|
| PÆ¡gina | #f5f6fa |
| Cards | #ffffff |
| Header | #667eea |

---

## 📱 Responsividade

### Desktop (> 1024px)
- Layout com sidebar
- Cards em linha (3 colunas)
- GrÆ¢fico grande

### Tablet (768px - 1024px)
- Layout compacto
- Cards em 2 colunas
- GrÆ¢fico mÆ©dio

### Mobile (< 768px)
- Menu hamburger
- Cards em 1 coluna
- GrÆ¢fico pequeno
- FormulÆ¡rio em tela cheia

---

## 🔍 Estados Visuais

### Loading

```
┌─────────────────────────────────┐
│                                 │
│         Carregando...           │
│         ⏳                        │
│                                 │
└─────────────────────────────────┘
```

### Vazio (sem transaçªµes)

```
┌─────────────────────────────────┐
│  📋 Transaçªµes                  │
│                                 │
│  Nenhuma transaçª£o cadastrada.  │
│  Adicione uma acima!            │
│                                 │
└─────────────────────────────────┘
```

### Erro

```
┌─────────────────────────────────┐
│  ⚠️ Erro ao carregar dados     │
│  Tente novamente mais tarde     │
└─────────────────────────────────┘
```

### Sucesso

```
┌─────────────────────────────────┐
│  ✅ 5 parcelas criadas com     │
│     sucesso!                    │
└─────────────────────────────────┘
```

---

## 🎯 Fluxo de Uso

### 1. Primeiro Acesso

```
Login → Dashboard → Ver transaçªµes (vazio)
```

### 2. Adicionar Transaçª£o Ænica

```
Dashboard → Preencher formulÆ¡rio → Adicionar → Ver na lista
```

### 3. Adicionar Transaçª£o Recorrente

```
Dashboard → Preencher formulÆ¡rio → Marcar "Recorrente?" → 
Informar parcelas → Adicionar → Ver parcelas nos meses seguintes
```

### 4. Filtrar por MŒs

```
Dashboard → Selecionar mŒs → Ver transaçªµes do mŒs
```

### 5. Gerar PDF

```
Dashboard → Selecionar mŒs → Clicar "Gerar PDF" → Download
```

---

## 📊 Exemplo Real

### CenÆ¡rio: UsuÆ¡rio com aluguel de 5 parcelas

**Agosto 2026:**
```
┌────────────────────────────────────┐
│  Aluguel (1/5) 🔄 mensal          │
│  - R$ 1.000                       │
└────────────────────────────────────┘
```

**Setembro 2026:**
```
┌────────────────────────────────────┐
│  Aluguel (2/5) 🔄 mensal          │
│  - R$ 1.000                       │
└────────────────────────────────────┘
```

**Outubro 2026:**
```
┌────────────────────────────────────┐
│  Aluguel (3/5) 🔄 mensal          │
│  - R$ 1.000                       │
└────────────────────────────────────┘
```

---

**Guia visual completo!** 🎨