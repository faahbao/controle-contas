# Testando a Autenticacao

Guia rapido para testar as novas rotas de autenticacao.

## 1. Instalar dependencias

No terminal, na pasta do backend:

```bash
cd backend
npm install
```

Isso vai instalar `jsonwebtoken` e `bcryptjs`.

## 2. Configurar .env

Copie o .env.example para .env:

```bash
cp .env.example .env
```

Edite o .env se necessario:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-jwt-aqui"
PORT=3000
```

## 3. Rodar o servidor

```bash
npm run dev
```

Voce deve ver:
```
✅ Tabela "users" criada com sucesso
🚀 Servidor rodando em http://localhost:3000
```

## 4. Testar Registro

### Usando cURL:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@teste.com","senha":"123456"}'
```

### Usando Insomnia/Postman:

- **Method:** POST
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "nome": "Teste",
  "email": "teste@teste.com",
  "senha": "123456"
}
```

### Resposta esperada:

```json
{
  "message": "Usuario registrado com sucesso",
  "user": {
    "id": 1,
    "nome": "Teste",
    "email": "teste@teste.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Guarde o token!** Voce vai precisar dele para as rotas protegidas.

## 5. Testar Login

### Usando cURL:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","senha":"123456"}'
```

### Resposta esperada:

```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "nome": "Teste",
    "email": "teste@teste.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 6. Testar Rota Protegida (/api/auth/me)

Agora use o token que voce recebeu:

### Usando cURL:

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

Substitua `SEU_TOKEN_AQUI` pelo token que voce recebeu no login/registro.

### Resposta esperada:

```json
{
  "user": {
    "id": 1,
    "nome": "Teste",
    "email": "teste@teste.com",
    "created_at": "2026-08-15T12:00:00.000Z"
  }
}
```

## 7. Testar Erros

### Token invalido:

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer token-invalido"
```

Resposta:
```json
{
  "error": "Token invalido ou expirado"
}
```

### Sem token:

```bash
curl -X GET http://localhost:3000/api/auth/me
```

Resposta:
```json
{
  "error": "Token nao fornecido"
}
```

## 8. Testar Validacao

### Email invalido:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"email-invalido","senha":"123456"}'
```

Resposta:
```json
{
  "error": "Email invalido"
}
```

### Senha curta:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste2@teste.com","senha":"123"}'
```

Resposta:
```json
{
  "error": "Senha deve ter no minimo 6 caracteres"
}
```

### Email duplicado:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@teste.com","senha":"123456"}'
```

Resposta:
```json
{
  "error": "Email ja cadastrado"
}
```

## Endpoints Disponiveis

| Metodo | Endpoint | Descricao | Autenticado? |
|--------|----------|-----------|--------------|
| POST | /api/auth/register | Registrar usuario | Nao |
| POST | /api/auth/login | Login | Nao |
| GET | /api/auth/me | Dados do usuario | Sim |

## Proximos Passos

Agora que a autenticacao esta funcionando, voce pode:

1. **Proteger outras rotas** - Adicionar o middleware `authMiddleware` nas rotas de transacoes, categorias, etc.
2. **Criar frontend** - Implementar telas de login e registro no React
3. **Armazenar token** - Usar localStorage ou contexto React para guardar o token
4. **Enviar token** - Incluir header `Authorization: Bearer <token>` em todas as requisicoes

## Exemplo de Uso no Frontend

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, senha })
});

const data = await response.json();

// Salvar token
localStorage.setItem('token', data.token);

// Usar em requisicoes protegidas
const meResponse = await fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

Precisa de ajuda? Abra uma issue no GitHub!
