# 📦 Instalaçª£o

## PrÆ©-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

## Backend

### 1. Instalar dependŒncias

```bash
cd backend
npm install
```

### 2. Configurar .env

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance?schema=public"
JWT_SECRET="sua-chave-secreta"
PORT=3000
```

### 3. Rodar migraçªµes

```bash
npx prisma migrate dev
```

### 4. Iniciar servidor

```bash
npm run dev
```

## Frontend

### 1. Instalar dependŒncias

```bash
cd frontend
npm install
```

### 2. Configurar API

Edite `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})
```

### 3. Iniciar desenvolvimento

```bash
npm run dev
```

## 🎉 Pronto!

Acesse: http://localhost:5173

## 🐛 Problemas comuns

### Erro no Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

### Erro de CORS
Verifique se o backend estÆ¡ rodando na porta 3000

### Erro de banco
Verifique se o PostgreSQL estÆ¡ rodando e o DATABASE_URL estÆ¡ correto