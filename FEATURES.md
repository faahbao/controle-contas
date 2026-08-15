# ⭐ Funcionalidades

## 🔐 Autenticaçª£o

- Cadastro de usuÆ¡rio com nome, email e senha
- Login com JWT
- Proteçª£o de rotas no frontend
- Contexto de autenticaçª£o (AuthContext)

## 💰 Transaçªµes

### Tipos
- **Receita** - Entradas de dinheiro
- **Despesa** - SaÆ¢das de dinheiro

### Campos
- Descriçª£o
- Valor
- Tipo (receita/despesa)
- Categoria
- Data
- Recorrente (sim/nÆ£o)
- FrequŒncia (diÆ¡ria, semanal, mensal)
- Parcelas (quantidade)

### Recorrente com Parcelas

**Como funciona:**
1. UsuÆ¡rio marca "Recorrente?"
2. Escolhe frequŒncia (ex: mensal)
3. Informa parcelas (ex: 5)
4. Sistema cria automaticamente 5 transaçªµes (uma por mŒs)

**Exemplo:**
- Lançª§amento: Aluguel R$ 1.000 em 08/2026 (5 parcelas)
- 08/2026: Aluguel (1/5)
- 09/2026: Aluguel (2/5)
- 10/2026: Aluguel (3/5)
- 11/2026: Aluguel (4/5)
- 12/2026: Aluguel (5/5)

## 📊 Dashboard

### Cards
- Receitas do mŒs
- Despesas do mŒs
- Saldo (receitas - despesas)

### GrÆ¢fico
- Barras horizontais comparando receitas vs despesas
- Porcentagem visual

### Filtros
- MŒs (01-12)
- Ano (2024-2028)

## 📁 Categorias

### PrÆ©-definidas
- **Receita:** SalÆ¡rio, Freelance, Investimentos, Outros
- **Despesa:** Alimentaçª£o, Transporte, Moradia, SaÆºde, Educaçª£o, Lazer, VestuÆ¡rio, Outros

### Personalizadas
- UsuÆ¡rio pode criar novas categorias
- Define tipo (receita ou despesa)

## 📄 RelatÆ¢rios

- Geraçª£o de PDF com resumo do mŒs
- Inclui: receitas, despesas, saldo e transaçªµes
- Filtro por mŒs/ano

## ✏️ Ediçª£o e ExclusÆ£o

- Editar transaçªµes existentes
- Excluir transaçªµes com confirmaçª£o
- Modal de ediçª£o com todos os campos

## 🎨 Interface

- Design limpo e moderno
- Responsivo (funciona em mobile)
- Cores intuitivas (verde=receita, vermelho=despesa)
- Badges para transaçªµes recorrentes
- Æcones emojis para melhor UX