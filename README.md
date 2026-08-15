# 💰 Sistema de Controle Financeiro

Sistema completo de controle financeiro com autenticaçª£o, transaçªµes recorrentes parceladas, dashboard interativo e geraçª£o de relatÆ¢rios em PDF.

## 🚀 Funcionalidades

- ✅ **Autenticaçª£o JWT** - Login seguro com tokens
- ✅ **Transaçªµes** - Receitas e despesas com categorias
- ✅ **Recorrente com Parcelas** - Lance uma vez, aparece em todos os meses
- ✅ **Dashboard** - GrÆ¢ficos de receitas vs despesas
- ✅ **Filtros** - Por mŒs e ano
- ✅ **RelatÆ¢rio PDF** - Exporte seus dados
- ✅ **Categorias** - Personalize suas categorias

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT para autenticaçª£o

### Frontend
- React
- CSS3
- Axios

## 📦 Instalaçª£o

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📖 Documentaçª£o Completa

- [BACKEND.md](./BACKEND.md) - Detalhes do backend
- [FRONTEND.md](./FRONTEND.md) - Detalhes do frontend
- [FEATURES.md](./FEATURES.md) - Todas as funcionalidades
- [API.md](./API.md) - Documentaçª£o da API
- [INSTALL.md](./INSTALL.md) - Guia de instalaçª£o

## 👨‍💻 Como usar

1. Façª£o login ou cadastre-se
2. Adicione transaçªµes (receitas/despesas)
3. Para recorrentes: marque "Recorrente?" e informe as parcelas
4. Filtre por mŒs para ver o que vence em cada perÆ¢odo
5. Gere relatÆ¢rios em PDF

## 📝 Exemplo: Transaçª£o Recorrente

Ao lançª§ar "Aluguel" de R$ 1.000 em 5 parcelas:
- MŒs 1: Aluguel (1/5)
- MŒs 2: Aluguel (2/5)
- MŒs 3: Aluguel (3/5)
- MŒs 4: Aluguel (4/5)
- MŒs 5: Aluguel (5/5)

## 📄 Licençª§a

MIT