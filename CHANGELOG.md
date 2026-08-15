# Changelog

Todas as mudancas importantes neste projeto estao documentadas neste arquivo.

O formato e baseado em [Keep a Changelog](https://keepachangelog.com/).

## [1.2.0] - 2026-08-15

### Adicionado
- **Autenticacao completa com JWT**
  - Registro de usuarios com validacao de email e senha
  - Login com geracao de token JWT
  - Middleware de protecao de rotas
  - Rota /api/auth/me para dados do usuario logado
- **Frontend React com autenticacao**
  - AuthContext para gerenciamento de estado
  - Telas de Login e Registro
  - Dashboard com resumo financeiro
  - Logout com cleanup de token
  - Rotas protegidas no frontend
  - Axios com interceptors para token automatico
- **Protecao de todas as rotas da API**
  - /api/transacoes - CRUD completo protegido
  - /api/categorias - CRUD completo protegido
  - /api/dashboard - Dashboard protegido por usuario
- **Banco de dados**
  - Tabela users criada automaticamente
  - Relacionamento user_id em transacoes e categorias
- **Documentacao**
  - AUTH_TEST.md com guia completo de testes

### Modificado
- **Backend**
  - package.json com jsonwebtoken e bcryptjs
  - server.js inicializa banco automaticamente
  - Todas as rotas agora exigem autenticacao
- **Frontend**
  - App.jsx com rotas e AuthProvider
  - API service com interceptors de token

### Seguranca
- Senhas com hash bcrypt
- Tokens JWT com expiracao de 7 dias
- Validacao de email e senha
- Protecao contra rotas nao autorizadas

## [1.1.0] - 2026-08-15

### Adicionado
- Autenticacao de usuarios com JWT
- Registro e login de usuarios
- CRUD completo de transacoes
- CRUD de categorias
- Dashboard com resumo financeiro
- Scripts de setup automatico
- Documentacao completa

### Modificado
- Estrutura organizada em backend/frontend
- Migracao para TypeScript
- Melhorias com TailwindCSS

### Corrigido
- Problemas de CORS
- Validacao de dados

## [1.0.0] - 2026-01-01

### Adicionado
- Estrutura inicial
- Backend Node.js + Express
- Frontend React + Vite
- SQLite + Prisma ORM

---

## Formato
- **[Versao]** - Data
- **Adicionado** - Novas funcionalidades
- **Modificado** - Mudancas
- **Corrigido** - Bugs
- **Seguranca** - Melhorias
