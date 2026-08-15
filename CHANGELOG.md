# Changelog

Todas as mudancas importantes neste projeto estao documentadas neste arquivo.

O formato e baseado em [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] - 2026-08-15

### Adicionado
- Autenticacao de usuarios com JWT
- Registro e login de usuarios
- CRUD completo de transacoes (receitas/despesas)
- CRUD de categorias
- Dashboard com resumo financeiro
- Scripts de setup automatico (setup.bat, setup.sh)
- Scripts de inicializacao (start-all.bat, start-backend.bat, start-frontend.bat)
- Documentacao completa (README, QUICKSTART, PROJECT_STRUCTURE, etc.)

### Modificado
- Estrutura do projeto organizada em backend/frontend
- Migracao para TypeScript em todo o projeto
- Atualizacao do Prisma ORM para versao mais recente
- Melhorias na interface com TailwindCSS

### Corrigido
- Problemas de CORS entre frontend e backend
- Validacao de dados nos formularios
- Tratamento de erros na API

## [1.0.0] - 2026-01-01

### Adicionado
- Estrutura inicial do projeto
- Configuracao do backend com Node.js + Express
- Configuracao do frontend com React + Vite
- Banco de dados SQLite com Prisma ORM
- Sistema basico de transacoes
- Interface inicial em desenvolvimento

---

## Formato das Versoes

- **[Versao]** - Data
- **Adicionado** - Novas funcionalidades
- **Modificado** - Mudancas em funcionalidades existentes
- **Corrigido** - Correcao de bugs
- **Removido** - Funcionalidades removidas

## Links

- [1.1.0]: https://github.com/faahbao/controle-contas/releases/tag/v1.1.0
- [1.0.0]: https://github.com/faahbao/controle-contas/releases/tag/v1.0.0
