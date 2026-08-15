# 📋 Resumo do Projeto

## 💰 Sistema de Controle Financeiro

Sistema fullstack para gestão financeira pessoal com foco em transaçªµes recorrentes parceladas.

---

## 🎯 Objetivo Principal

Permitir que usuÆ¡rios lancem despesas recorrentes (como aluguel, financiamento, etc.) uma Æ║nica vez, e o sistema distribui automaticamente as parcelas nos meses seguintes.

---

## ✨ Funcionalidades Principais

### 1. Autenticaçª£o
- Cadastro e login com JWT
- Proteçª£o de rotas

### 2. Transaçªµes
- Receitas e despesas
- Categorias personalizÆ¡veis
- **Recorrente com parcelas** (feature principal)

### 3. Dashboard
- Cards com totais do mŒs
- GrÆ¢fico receitas vs despesas
- Filtro por mŒs/ano

### 4. RelatÆ¢rios
- Exportaçª£o em PDF

---

## 🏗️ Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ──────▶ │    Backend   │ ──────▶ │  PostgreSQL │
│   (React)   │  HTTP   │ (Express.js) │  Prisma │   (Dados)   │
└─────────────┘         └──────────────┘         └─────────────┘
```

---

## 📁 Estrutura de Arquivos

```
finance/
├── README.md
├── BACKEND.md
├── FRONTEND.md
├── FEATURES.md
├── INSTALL.md
├── API.md
├── SUMMARY.md
├── UPDATES.md
└── VISUAL_GUIDE.md
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       └── server.js
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   └── Dashboard.jsx
        └── styles/
            └── Dashboard.css
```

---

## 🚀 Destaques

### Transaçª£o Recorrente com Parcelas

**Problema resolvido:** UsuÆ¡rio nÆ£o precisa lançar manualmente a mesma despesa todo mŒs.

**Soluçª£o:**
1. UsuÆ¡rio lança "Aluguel - R$ 1.000 - 5 parcelas" em agosto
2. Backend cria automaticamente 5 transaçªµes
3. Cada transaçª£o aparece no mŒs correto
4. Badge visual identifica: 🔄 mensal (2/5)

**Tecnologias:**
- Frontend: React + CSS3
- Backend: Node.js + Express + Prisma
- Banco: PostgreSQL

---

## 📊 Status

✅ Autenticaçª£o JWT
✅ CRUD de transaçªµes
✅ Transaçªµes recorrentes com parcelas
✅ Dashboard com filtros
✅ Categorias
✅ RelatÆ¢rio PDF
✅ Documentaçª£o completa

---

## 👨‍💻 Stack Completo

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React, CSS3, Axios |
| Backend | Node.js, Express |
| ORM | Prisma |
| Banco | PostgreSQL |
| Auth | JWT |
| PDF | PDFKit |

---

## 📝 PrÆ¢ximos Passos (SugestÆµes)

- [ ] GrÆ¢ficos mais avançª§ados (Chart.js)
- [ ] Notificaçªµes de vencimento
- [ ] Metas de economia
- [ ] Integraçª£o com banco
- [ ] App mobile

---

## 📄 Licençª§a

MIT