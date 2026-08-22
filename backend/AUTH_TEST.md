# Teste de Autenticação

Este guia testa cadastro, login e acesso a uma rota protegida.

## Pré-requisitos

Inicie o backend e confirme a porta usada. Os exemplos abaixo usam `3000`.

```powershell
cd backend
npm install
npm run dev
```

Configure o `backend/.env`:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="chave-secreta-de-teste-com-pelo-menos-32-caracteres"
PORT=3000
```

## Cadastro

A documentação principal usa `/cadastro`. Se o backend tiver registrado `/register`, substitua o caminho nos exemplos.

```powershell
curl.exe -X POST http://localhost:3000/api/auth/cadastro `
  -H "Content-Type: application/json" `
  -d '{"nome":"Teste","email":"teste@teste.com","senha":"123456"}'
```

Resposta esperada: um token e os dados públicos do usuário. Nunca armazene nem compartilhe a senha ou o token em documentação.

## Login

```powershell
curl.exe -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"teste@teste.com","senha":"123456"}'
```

Copie o token somente para o teste local.

## Rota protegida

```powershell
curl.exe -X GET http://localhost:3000/api/auth/me `
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

Substitua `SEU_TOKEN_AQUI` pelo token retornado no login.

## Casos de erro

Token ausente ou inválido deve resultar em `401`:

```powershell
curl.exe -X GET http://localhost:3000/api/auth/me
```

Também teste e-mail inválido, senha curta e e-mail duplicado. A resposta pode variar conforme o middleware, mas deve indicar erro de validação ou conflito.

## Teste via frontend

1. Abra a URL exibida pelo Vite.
2. Crie uma conta.
3. Faça login.
4. Confira no DevTools se as requisições protegidas enviam o header `Authorization`.
5. Confirme que o token não aparece na URL.

## Cloudflare Tunnel

Para testar externamente, configure o frontend com a URL atual da API e mantenha o backend ativo. Um quick tunnel pode mudar de domínio; atualize `VITE_API_URL`, CORS e reinicie o frontend quando isso ocorrer.
