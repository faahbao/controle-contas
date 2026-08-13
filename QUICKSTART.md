# ⚡ Guia Rápido de Início

## Pré-requisitos

Você precisa ter **Node.js 16+** instalado. Se não tiver:

1. Acesse https://nodejs.org/
2. Baixe a versão **LTS** (recomendado)
3. Execute o instalador e siga as instruções

## Instalação Rápida

### Windows

1. Abra o PowerShell na pasta do projeto (`d:\Projetos\controle-contas`)
2. Execute:
   ```powershell
   .\setup.bat
   ```

### Linux/Mac

1. Abra o terminal na pasta do projeto
2. Execute:
   ```bash
   bash setup.sh
   ```

## Executar o Projeto

Após a instalação, você precisará abrir **2 terminais**:

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Você verá:
```
✅ Conectado ao SQLite
✅ Tabela transactions criada
✅ Tabela recurrence_log criada
📅 Job de recorrências agendado
🚀 Servidor rodando em http://localhost:5000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

O navegador abrirá automaticamente em `http://localhost:3000`

## Primeiros Passos

1. **Dashboard**: Visualize saldo e gráficos (estará vazio no início)

2. **Adicionar Receita**:
   - Clique em "Receitas" no menu lateral
   - Preencha categoria "Salário"
   - Digite valor e data
   - Clique em "Adicionar"

3. **Adicionar Despesa**:
   - Clique em "Despesas"
   - Selecione uma categoria (ex: "Cartão Itau")
   - Preencha valor e data
   - Marque "Recorrente (mensal)" se aplicável
   - Clique em "Adicionar"

4. **Ver Relatórios**:
   - Clique em "Relatórios"
   - Selecione data início e fim
   - Clique em "Gerar Relatório"

5. **Exportar Dados**:
   - Clique em "Exportar"
   - Configure filtros (opcional)
   - Clique em "Exportar CSV"
   - Arquivo será baixado no seu computador

## Dúvidas Comuns

**P: Posso deletar uma transação?**
R: Sim! Na lista de transações, clique no ícone 🗑 para deletar.

**P: Como editar uma transação?**
R: Clique no ícone ✎ para entrar em modo edição, faça as alterações e clique ✓ para salvar.

**P: As recorrências funcionam automaticamente?**
R: Sim! O backend verifica diariamente às 00:01 e gera automaticamente novas transações para o mês. Você pode forçar clicando no ícone 🔄 (quando implementado).

**P: Os dados são salvos localmente?**
R: Sim! Tudo fica em `database.sqlite` no diretório do projeto. Nenhum dado sai do seu computador.

**P: Posso usar offline?**
R: Depois que instalar, sim! Tanto frontend quanto backend rodam localmente sem necessidade de internet.

**P: Como faço backup dos dados?**
R: Copie o arquivo `database.sqlite` para outro lugar. Para restaurar, coloque-o novamente na pasta raiz.

## Atalhos úteis

- **Recarregar dados**: F5 no navegador
- **Parar servidor**: CTRL+C no terminal
- **Limpar console**: CTRL+L (Linux/Mac) ou `cls` (Windows)

## Próximas Melhorias

- [ ] Autenticação (usuário/senha)
- [ ] Sincronização com nuvem (Google Drive, Dropbox)
- [ ] App mobile
- [ ] Notificações de despesas recorrentes
- [ ] Categorias personalizáveis
- [ ] Integração com bancos (API)
- [ ] Gráficos mais avançados

## Suporte

Se tiver problemas:

1. Verifique se Node.js está instalado: `node --version`
2. Verifique se npm está instalado: `npm --version`
3. Limpe a cache: `rm -rf node_modules` em ambas as pastas (backend e frontend)
4. Reinstale: Execute `setup.bat` ou `setup.sh` novamente
5. Verifique se as portas 5000 e 3000 não estão em uso

Bom uso! 🚀
