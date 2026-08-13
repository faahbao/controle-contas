# 📋 Estrutura do Projeto - Guia Completo

## Arquivos Criados

```
d:\Projetos\controle-contas\
│
├── 📄 README.md                      ← Documentação principal
├── 📄 QUICKSTART.md                  ← Guia rápido de início
├── 📄 PROJECT_STRUCTURE.md           ← Este arquivo
├── 📄 .gitignore                     ← Arquivos a ignorar no Git
├── 📄 setup.bat                      ← Setup automático (Windows)
├── 📄 setup.sh                       ← Setup automático (Linux/Mac)
│
├── 📁 backend/
│   ├── 📄 package.json               ← Dependências do backend
│   ├── 📄 .env                       ← Variáveis de ambiente
│   ├── 📄 .env.example               ← Exemplo de .env
│   │
│   └── 📁 src/
│       ├── 📄 server.js              ← Servidor Express principal
│       ├── 📄 db.js                  ← Configuração SQLite
│       │
│       ├── 📁 controllers/
│       │   └── 📄 transacaoController.js  ← Lógica de transações
│       │
│       ├── 📁 routes/
│       │   ├── 📄 transacao.js       ← Rotas de receitas/despesas
│       │   ├── 📄 dashboard.js       ← Rota de dashboard
│       │   └── 📄 export.js          ← Rota de exportação CSV
│       │
│       ├── 📁 jobs/
│       │   └── 📄 recurrenceJob.js   ← Job de recorrências automáticas
│       │
│       └── 📁 middleware/
│           └── (para futura expansão)
│
├── 📁 frontend/
│   ├── 📄 package.json               ← Dependências do frontend
│   ├── 📄 .env                       ← Variáveis de ambiente
│   ├── 📄 .env.example               ← Exemplo de .env
│   ├── 📄 index.html                 ← HTML raiz
│   ├── 📄 vite.config.js             ← Configuração Vite
│   │
│   └── 📁 src/
│       ├── 📄 main.jsx               ← Entry point React
│       ├── 📄 App.jsx                ← Componente raiz
│       │
│       ├── 📁 components/
│       │   ├── 📄 Sidebar.jsx        ← Menu lateral
│       │   ├── 📄 FormularioTransacao.jsx  ← Formulário reutilizável
│       │   └── 📄 ListaTransacoes.jsx     ← Tabela de transações
│       │
│       ├── 📁 pages/
│       │   ├── 📄 Dashboard.jsx      ← Página dashboard com gráficos
│       │   ├── 📄 Receitas.jsx       ← Página de receitas
│       │   ├── 📄 Despesas.jsx       ← Página de despesas
│       │   ├── 📄 Relatorios.jsx     ← Página de relatórios
│       │   └── 📄 Exportar.jsx       ← Página de exportação
│       │
│       ├── 📁 services/
│       │   └── 📄 api.js             ← Cliente HTTP (Axios)
│       │
│       ├── 📁 styles/
│       │   ├── 📄 App.css            ← Estilos principais
│       │   ├── 📄 Sidebar.css        ← Estilos da sidebar
│       │   ├── 📄 FormularioTransacao.css
│       │   ├── 📄 ListaTransacoes.css
│       │   ├── 📄 Dashboard.css
│       │   ├── 📄 Receitas.css
│       │   ├── 📄 Despesas.css
│       │   ├── 📄 Relatorios.css
│       │   └── 📄 Exportar.css
│       │
│       └── 📁 hooks/
│           └── (para futura expansão - hooks customizados)
│
└── 📁 node_modules/                  ← Dependências (criado após npm install)
    ├── express
    ├── sqlite3
    ├── cors
    ├── dotenv
    ├── node-schedule
    ├── react
    ├── react-dom
    ├── react-router-dom
    ├── axios
    ├── recharts
    ├── papaparse
    ├── vite
    └── ... (muitas outras)

📦 database.sqlite                    ← Banco SQLite (criado automaticamente)
```

## 📊 Tecnologias Utilizadas

### Backend
- **Express.js** - Framework web
- **SQLite3** - Banco de dados relacional
- **node-schedule** - Agendador de jobs
- **CORS** - Controle de requisições cross-origin
- **dotenv** - Variáveis de ambiente

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool rápido
- **React Router** - Roteamento SPA
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos interativos
- **Papaparse** - Processamento CSV (futuro)

## 🗄️ Banco de Dados

### Schema SQLite

#### Tabela: `transactions`
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT CHECK(tipo IN ('receita', 'despesa')),
  categoria TEXT,
  descricao TEXT,
  valor REAL,
  data TEXT (YYYY-MM-DD),
  recorrente BOOLEAN (0=false, 1=true),
  periodo_recorrencia TEXT ('mensal'),
  ativo BOOLEAN,
  criado_em TEXT (TIMESTAMP),
  atualizado_em TEXT (TIMESTAMP)
)
```

#### Tabela: `recurrence_log`
```sql
CREATE TABLE recurrence_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER (FK),
  mes INTEGER,
  ano INTEGER,
  gerada_em TEXT,
  UNIQUE(transaction_id, mes, ano)
)
```

## 🔄 Fluxo de Requisições

```
Frontend (React)
    │
    ├─────────────────► API Service (Axios)
    │                      │
    │                      └─────────────────► Backend (Express)
    │                                             │
    │                                             ├─► Controller
    │                                             │       │
    │                                             │       └─► Database (SQLite)
    │                                             │
    │                                             └─► Response (JSON)
    │
    └─────────────────► Re-render UI
```

## 📡 Endpoints Disponíveis

### Transações
- `POST   /api/receitas`           - Criar receita
- `GET    /api/receitas`           - Listar receitas
- `GET    /api/receitas/:id`       - Obter receita
- `PUT    /api/receitas/:id`       - Atualizar receita
- `DELETE /api/receitas/:id`       - Deletar receita
- (Equivalentes para `/api/despesas`)

### Dashboard
- `GET    /api/dashboard`          - Resumo financeiro

### Exportação
- `POST   /api/export/csv`         - Exportar em CSV

### Health Check
- `GET    /api/health`             - Status do servidor

## 🎨 Palette de Cores

```css
--primary-color: #2563eb      (Azul)
--secondary-color: #6b7280    (Cinza)
--success-color: #10b981      (Verde)
--error-color: #ef4444        (Vermelho)
--warning-color: #f59e0b      (Laranja)
```

## 🚀 Scripts Disponíveis

### Backend
```bash
npm run dev      # Iniciar com nodemon (recarrega automático)
npm start        # Iniciar em produção
```

### Frontend
```bash
npm run dev      # Iniciar servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Visualizar build
```

## 🔒 Segurança

Atualmente:
- ✅ CORS habilitado
- ✅ Validação básica de entrada
- ❌ Sem autenticação
- ❌ Sem rate limiting
- ❌ Sem HTTPS

Para expandir:
1. Adicionar JWT ou OAuth
2. Implementar validação com `joi` ou `zod`
3. Adicionar rate limiting com `express-rate-limit`
4. Configurar HTTPS em produção

## 📈 Escalabilidade Futura

1. **Database**: Migrar para PostgreSQL para melhor performance
2. **Auth**: Implementar autenticação multi-usuário
3. **Sync**: Sincronizar dados com nuvem
4. **Mobile**: Criar apps React Native ou Flutter
5. **Analytics**: Dashboard de análise avançada
6. **Integration**: APIs de bancos e fintech
7. **Reports**: Geração de PDF e planilhas

## ✅ Checklist de Implementação

- [x] Estrutura de pastas criada
- [x] Backend (Express + SQLite) configurado
- [x] Frontend (React + Vite) configurado
- [x] Controllers e rotas implementados
- [x] Componentes React criados
- [x] Estilos CSS aplicados
- [x] Job de recorrências implementado
- [x] Documentação criada
- [x] Scripts de setup criados
- [ ] Testes unitários (futuro)
- [ ] Testes de integração (futuro)
- [ ] Deployment (futuro)

## 📞 Contato e Suporte

Para problemas, verifique:
1. `README.md` - Documentação completa
2. `QUICKSTART.md` - Guia de início rápido
3. Terminal/Console do navegador (F12) - Erros específicos
4. Logs do backend - Verificar erros de servidor

---

Projeto criado em 2026 | © Controle de Contas Pessoais
