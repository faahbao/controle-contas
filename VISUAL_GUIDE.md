# Guia Visual da Interface

Referencia visual dos componentes e telas da aplicacao.

## Telas Principais

### 1. Login
- Campo de email
- Campo de senha
- Botao "Entrar"
- Link "Registrar-se"

### 2. Registro
- Campo de nome
- Campo de email
- Campo de senha
- Campo de confirmacao de senha
- Botao "Criar conta"

### 3. Dashboard
- Cards de resumo (Receitas, Despesas, Saldo)
- Grafico de distribuicao por categoria
- Lista de transacoes recentes
- Botao "Nova Transacao"

### 4. Transacoes
- Lista filtravel de transacoes
- Filtros por periodo e categoria
- Indicadores de receita (verde) e despesa (vermelho)
- Acoes de editar e excluir

### 5. Nova Transacao
- Campo de descricao
- Campo de valor
- Seletor de tipo (Receita/Despesa)
- Seletor de categoria
- Seletor de data
- Botao "Salvar"

### 6. Categorias
- Lista de categorias cadastradas
- Indicador de cor por categoria
- Botao "Nova Categoria"
- Acoes de editar e excluir

## Paleta de Cores

### Cores Principais

| Uso | Cor | Hex |
|-----|-----|-----|
| Primaria | Azul | #3B82F6 |
| Sucesso | Verde | #10B981 |
| Perigo | Vermelho | #EF4444 |
| Aviso | Amarelo | #F59E0B |

### Cores de Fundo

| Elemento | Cor |
|----------|-----|
| Fundo principal | #F3F4F6 |
| Cards | #FFFFFF |
| Sidebar | #1F2937 |

## Componentes

### Cards
- Bordas arredondadas (rounded-lg)
- Sombra suave (shadow-md)
- Padding generoso (p-6)

### Botoes
- Primario: Azul com hover mais escuro
- Secundario: Cinza com borda
- Perigo: Vermelho para acoes destrutivas

### Inputs
- Borda cinza clara
- Focus com anel azul
- Mensagens de erro em vermelho

## Responsividade

- **Desktop:** Layout completo com sidebar
- **Tablet:** Sidebar colapsavel
- **Mobile:** Menu hamburger e cards empilhados

## Iconografia

- **Biblioteca:** Heroicons ou Lucide
- **Estilo:** Outline para navegacao, Solid para acoes

---

Para mais detalhes tecnicos, consulte [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
