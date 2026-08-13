# 🎮 Guia Visual de Navegação

## Interface Principal

```
┌─────────────────────────────────────────────────────────────────────┐
│                      💰 Controle de Contas                          │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                       │
│  📊 Dashboard│  [Página Inicial - Mostra Saldo e Gráficos]        │
│              │                                                       │
│  💵 Receitas │  [Gerenciar Receitas]                               │
│              │  • Formulário para adicionar receita                │
│  💸 Despesas │  • Filtros por categoria e recorrência             │
│              │  • Tabela com todas as receitas                    │
│ 📈 Relatórios│                                                      │
│              │  [Gerenciar Despesas]                               │
│ 📥 Exportar  │  • Formulário para adicionar despesa               │
│              │  • 10 categorias pré-configuradas                  │
│              │  • Filtros por categoria e recorrência             │
│              │  • Tabela com todas as despesas                    │
│              │                                                       │
│              │  [Relatórios]                                        │
│              │  • Selecione data início e fim                     │
│              │  • Visualize resumo de receitas/despesas           │
│              │  • Tabelas com detalhes de transações             │
│              │                                                       │
│              │  [Exportar]                                          │
│              │  • Configure filtros (opcional)                    │
│              │  • Exporte em CSV para Excel/Sheets                │
│              │  • Arquivo é baixado localmente                    │
│              │                                                       │
└──────────────┴──────────────────────────────────────────────────────┘
```

## Fluxo de Uso Típico

### Cenário 1: Adicionar uma Receita (Salário)

```
1. Clique em "💵 Receitas" no menu lateral
2. Você vê um formulário:
   ┌─ FORMULÁRIO RECEITA ────────────┐
   │ Categoria: [Salário ▼]         │
   │ Descrição: [Salário Agosto...]  │
   │ Valor (R$): [5000.00]           │
   │ Data: [2026-08-13]              │
   │ ☐ Recorrente (mensal)           │
   │ [Adicionar]                     │
   └─────────────────────────────────┘
3. Preencha os campos
4. Marque "Recorrente" se repete todo mês
5. Clique em "Adicionar"
6. Pronto! A receita aparece na tabela abaixo
```

### Cenário 2: Adicionar uma Despesa (Cartão)

```
1. Clique em "💸 Despesas" no menu lateral
2. Você vê um formulário:
   ┌─ FORMULÁRIO DESPESA ────────────┐
   │ Categoria: [Cartão Itau ▼]     │
   │ Descrição: [Compra supermercado]│
   │ Valor (R$): [125.50]            │
   │ Data: [2026-08-13]              │
   │ ☐ Recorrente (mensal)           │
   │ [Adicionar]                     │
   └─────────────────────────────────┘
3. Preencha os campos
4. Selecione uma das 10 categorias
5. Clique em "Adicionar"
6. A despesa aparece na tabela abaixo
```

### Cenário 3: Visualizar Dashboard

```
1. Clique em "📊 Dashboard" no menu
2. Você verá 3 cards:
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │  Receitas    │  │  Despesas    │  │    Saldo     │
   │  R$ 5000.00  │  │  R$ 2500.00  │  │  R$ 2500.00  │
   │  (verde)     │  │  (vermelho)  │  │  (azul/verde)│
   └──────────────┘  └──────────────┘  └──────────────┘

3. E 2 gráficos:
   ┌─ Receitas vs Despesas ─┐   ┌─ Receitas por Categoria ─┐
   │    Pizza Chart         │   │    Bar Chart             │
   │    Verde=Receitas      │   │    Salário: R$5000       │
   │    Vermelho=Despesas   │   │    Outros: R$0           │
   └────────────────────────┘   └──────────────────────────┘
```

### Cenário 4: Editar uma Transação

```
1. Na tabela de transações, clique no ícone ✎ (editar)
2. A linha se torna editável:
   ┌────────┬───────────┬──────────┬────────┬────────────┐
   │ Data   │ Categoria │ Descrição│ Valor  │ Ações      │
   ├────────┼───────────┼──────────┼────────┼────────────┤
   │[2026...│[Salário..│[Salário.│[5100..│[✓] [✕]    │ ← Editável
   └────────┴───────────┴──────────┴────────┴────────────┘
3. Faça as alterações nos campos
4. Clique em ✓ para salvar ou ✕ para cancelar
```

### Cenário 5: Deletar uma Transação

```
1. Na tabela de transações, clique no ícone 🗑 (deletar)
2. Sistema pede confirmação:
   ┌─────────────────────────────────┐
   │ Tem certeza que deseja deletar?  │
   │ [OK] [Cancelar]                │
   └─────────────────────────────────┘
3. Clique "OK" para confirmar
4. A transação é removida do banco de dados
```

### Cenário 6: Filtrar Transações

```
1. Na página de Receitas ou Despesas, você vê filtros:
   ┌──────────────────────────────────┐
   │ [Todas as categorias ▼]          │
   │ [Todas ▼]  (recorrência)         │
   └──────────────────────────────────┘

2. Selecione uma categoria → lista atualiza automaticamente
3. Selecione "Apenas recorrentes" → mostra só recorrências
4. Limpe para ver tudo de novo
```

### Cenário 7: Gerar Relatório

```
1. Clique em "📈 Relatórios" no menu
2. Configure o período:
   ┌────────────────────────────────┐
   │ Data Início: [2026-08-01]     │
   │ Data Fim:    [2026-08-31]     │
   │ [Gerar Relatório]             │
   └────────────────────────────────┘

3. Você verá:
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │Receitas  │  │Despesas  │  │ Saldo    │
   │5 trans.  │  │12 trans. │  │-         │
   └──────────┘  └──────────┘  └──────────┘

4. E tabelas com detalhamento completo:
   ┌─────────────────────────────────────────┐
   │ Receitas Detalhadas                     │
   ├─────┬──────────┬────────┬────────────┤
   │Data │Categoria │Desc.   │Valor       │
   │01/08│Salário   │Agosto  │R$5000.00   │
   └─────┴──────────┴────────┴────────────┘
```

### Cenário 8: Exportar em CSV

```
1. Clique em "📥 Exportar" no menu
2. Configure filtros (opcional):
   ┌──────────────────────────┐
   │ Tipo: [Ambos ▼]         │
   │ Categoria: [_____]      │
   │ Data Início: [____]     │
   │ Data Fim: [____]        │
   │ Recorrência: [Ambas ▼]  │
   └──────────────────────────┘

3. Clique em "📥 Exportar CSV"
4. Arquivo "transacoes-2026-08-13.csv" é baixado
5. Abra no Excel ou Google Sheets
```

## Elementos de Interface

### Ícones Usados
```
💰  - Título do app
📊  - Dashboard
💵  - Receitas (positivo)
💸  - Despesas (negativo)
📈  - Relatórios
📥  - Exportar
✎   - Editar transação
🗑   - Deletar transação
✓   - Confirmar/Salvar
✕   - Cancelar/Fechar
🔄  - Recarregar/Reset
```

### Cores
```
Verde (#10b981)     → Receitas / Positivo / Sucesso
Vermelho (#ef4444)  → Despesas / Negativo / Erro
Azul (#2563eb)      → Ações / Links / Primário
Cinza (#6b7280)     → Secundário / Desabilitado
Laranja (#f59e0b)   → Aviso
```

### Estados dos Campos
```
Normal          → Borda cinza, fundo branco
Foco (digitando)→ Borda azul, sombra azul leve
Erro            → Borda vermelha, fundo rosa claro
Desabilitado    → Fundo cinzento, cursor "não-permitido"
```

## Atalhos de Teclado (Sugestões)

```
Tab              → Navegar entre campos
Enter            → Enviar formulário
Escape           → Fechar modal/cancelar
F5               → Recarregar página
Ctrl+S           → Salvar (futura melhoria)
```

## Fluxo de Dados

```
Usuário interage com UI (React)
         ↓
    Form é validado
         ↓
    Axios envia requisição HTTP
         ↓
    Backend (Express) processa
         ↓
    SQLite armazena dados
         ↓
    Backend responde com JSON
         ↓
    React atualiza a tela
         ↓
Usuário vê resultado
```

## Dicas de Uso

✅ **Faça**: Marcar transações recorrentes como "Recorrente"
✅ **Faça**: Usar nomes descritivos nas despesas
✅ **Faça**: Exportar dados mensalmente para backup

❌ **Evite**: Deletar transações antigas sem exportar antes
❌ **Evite**: Deixar descrição vazia (fica difícil lembrar)
❌ **Evite**: Erros de digitação em categorias

---

Aproveite o seu sistema de controle de contas! 🚀💰
