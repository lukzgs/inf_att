# Implementação de JWT com Expiração e Refresh Tokens

## 📋 Metadados da Implementação

| Campo | Valor |
|-------|-------|
| **Código** | `IMPL-20251001-AUTH` |
| **Data** | ~Outubro 2025 (estimada, implementação anterior) |
| **Categoria** | Autenticação / Segurança |
| **Prioridade** | 🔴 Crítico |
| **Status** | ✅ Concluído |
| **Migration** | `20251001213638_add_refresh_token` |

## 📋 Resumo

Implementação completa de um sistema de autenticação JWT seguro com:
- ✅ **Access tokens** com expiração configurável (padrão: 1 hora)
- ✅ **Refresh tokens** para renovação sem novo login (padrão: 7 dias)
- ✅ Armazenamento de refresh tokens no banco de dados
- ✅ Possibilidade de revogar tokens (logout)
- ✅ Logout de todos os dispositivos
- ✅ Variáveis de ambiente para configuração

> 💡 **Nota**: Para ver o contexto histórico de todas as implementações, consulte `INDICE_IMPLEMENTACOES.md`

---

## 🔧 Alterações Realizadas

### 1. Variáveis de Ambiente

#### `.env.example` (NOVO)
```env
DATABASE_URL="postgresql://username:password@localhost:5433/database_name?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_REFRESH_EXPIRES_IN="7d"
```

#### `.env` (ATUALIZADO)
Adicionadas as novas variáveis de JWT.

### 2. Schema Prisma

#### Modelo RefreshToken (NOVO)
```prisma
model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@map("refresh_tokens")
}
```

#### Modelo User (ATUALIZADO)
Adicionada relação: `refreshTokens RefreshToken[]`

#### Migration
Criada migration: `20251001213638_add_refresh_token`

### 3. DTOs

#### `RefreshTokenDto` (NOVO)
```typescript
export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
```

### 4. AuthService

#### Métodos Novos/Atualizados:

**`login()`** - ATUALIZADO
- Agora retorna `access_token`, `refresh_token` e `expires_in`
- Access token gerado com expiração configurável
- Refresh token gerado e armazenado no banco

**`generateRefreshToken()`** - NOVO
- Gera token aleatório seguro (64 bytes)
- Armazena no banco com data de expiração
- Retorna o token para o cliente

**`calculateExpirationDate()`** - NOVO
- Converte strings como "7d", "1h", "30m" em datas
- Suporta dias (d), horas (h) e minutos (m)

**`refreshAccessToken()`** - NOVO
- Valida o refresh token
- Verifica se não está revogado ou expirado
- Verifica se usuário está ativo
- Gera novo access token
- Retorna novo access token com expiração

**`revokeRefreshToken()`** - NOVO
- Revoga um refresh token específico
- Usado no logout

**`revokeAllUserTokens()`** - NOVO
- Revoga todos os tokens de um usuário
- Usado para logout de todos os dispositivos

### 5. AuthController

#### Endpoints Novos:

**`POST /auth/refresh`**
- Renova o access token usando refresh token
- Body: `{ "refreshToken": "..." }`
- Response: `{ "access_token": "...", "expires_in": "1h" }`

**`POST /auth/logout`**
- Revoga o refresh token (logout de um dispositivo)
- Body: `{ "refreshToken": "..." }`
- Response: `{ "message": "Logout realizado com sucesso" }`

**`POST /auth/logout-all`** (🔒 Protegido)
- Revoga todos os refresh tokens do usuário
- Requer autenticação via JWT
- Response: `{ "message": "Logout de todos os dispositivos realizado com sucesso" }`

#### Endpoint Atualizado:

**`POST /auth/login`**
- Agora retorna também `refresh_token` e `expires_in`
- Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "a1b2c3d4e5f6...",
  "expires_in": "1h"
}
```

### 6. AuthModule

**JwtModule** - ATUALIZADO
- Configuração de `expiresIn` agora vem de variável de ambiente
- Usa `JWT_EXPIRES_IN` do ConfigService
- Fallback para "1h" se não configurado

---

## 🔐 Fluxo de Autenticação

### Login
```
Cliente → POST /auth/login
         { email, password }
       ↓
Servidor valida credenciais
       ↓
Gera access_token (exp: 1h)
Gera refresh_token (exp: 7d)
Salva refresh_token no BD
       ↓
Retorna ambos os tokens
```

### Renovação de Token
```
Cliente → POST /auth/refresh
         { refreshToken }
       ↓
Servidor valida refresh_token:
  - Existe no BD?
  - Não está revogado?
  - Não expirou?
  - Usuário ativo?
       ↓
Gera novo access_token
       ↓
Retorna novo access_token
```

### Logout
```
Cliente → POST /auth/logout
         { refreshToken }
       ↓
Servidor marca token como revogado
       ↓
Token não pode mais ser usado
```

---

## 📝 Como Usar

### 1. Frontend - Armazenar Tokens

```typescript
// Após login
const response = await api.post('/auth/login', { email, password });
localStorage.setItem('access_token', response.data.access_token);
localStorage.setItem('refresh_token', response.data.refresh_token);
```

### 2. Frontend - Interceptor para Refresh

```typescript
// Interceptor para renovar token expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await api.post('/auth/refresh', { refreshToken });
      
      localStorage.setItem('access_token', response.data.access_token);
      originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
      
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);
```

### 3. Frontend - Logout

```typescript
// Logout simples
const refreshToken = localStorage.getItem('refresh_token');
await api.post('/auth/logout', { refreshToken });
localStorage.clear();

// Logout de todos os dispositivos
await api.post('/auth/logout-all', {}, {
  headers: { Authorization: `Bearer ${access_token}` }
});
localStorage.clear();
```

---

## 🔒 Segurança

### Melhorias Implementadas

✅ **Access tokens com expiração curta** (1h)
- Reduz janela de exploração se token for roubado

✅ **Refresh tokens em banco de dados**
- Permite controle e revogação
- Auditoria de tokens ativos

✅ **Tokens únicos e aleatórios**
- Refresh tokens gerados com `crypto.randomBytes`
- 64 bytes = 512 bits de entropia

✅ **Validações múltiplas**
- Token existe?
- Token revogado?
- Token expirado?
- Usuário ativo?

✅ **Cascade delete**
- Se usuário for deletado, tokens são removidos automaticamente

✅ **Índice no userId**
- Otimiza queries de tokens por usuário

---

## ⚙️ Configuração Recomendada

### Desenvolvimento
```env
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
```

### Produção
```env
JWT_EXPIRES_IN="15m"  # Mais seguro
JWT_REFRESH_EXPIRES_IN="7d"
```

### Alta Segurança
```env
JWT_EXPIRES_IN="5m"
JWT_REFRESH_EXPIRES_IN="1d"
```

---

## 🧪 Testando

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

### 2. Acessar Recurso Protegido
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <access_token>"
```

### 3. Renovar Token
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

### 4. Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

---

## 📊 Estrutura do Banco de Dados

### Tabela `refresh_tokens`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK auto-increment |
| token | VARCHAR(128) | Token único (UNIQUE) |
| userId | INTEGER | FK para usuarios |
| expiresAt | TIMESTAMP | Data de expiração |
| isRevoked | BOOLEAN | Se foi revogado (default: false) |
| createdAt | TIMESTAMP | Data de criação |
| updatedAt | TIMESTAMP | Data de atualização |

**Índices:**
- `token` (UNIQUE)
- `userId` (INDEX para queries rápidas)

---

## 🚀 Próximos Passos (Opcionais)

### Melhorias Adicionais

1. **Rotação de Refresh Tokens**
   - Gerar novo refresh token a cada renovação
   - Invalidar o antigo automaticamente

2. **Rate Limiting**
   - Limitar tentativas de refresh
   - Prevenir abuso

3. **Device Tracking**
   - Armazenar informações do dispositivo
   - Permitir visualizar sessões ativas

4. **Email de Alerta**
   - Notificar login de novo dispositivo
   - Alertar sobre atividade suspeita

5. **Cleanup de Tokens Expirados**
   - Job cron para deletar tokens antigos
   - Manter banco limpo

---

## ✅ Problema Resolvido

### Antes
```typescript
// ❌ Token sem expiração
return {
  access_token: this.jwtService.sign(payload)
};
```

### Depois
```typescript
// ✅ Token com expiração configurável
const accessToken = this.jwtService.sign(payload, {
  expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
});

const refreshToken = await this.generateRefreshToken(user.id);

return {
  access_token: accessToken,
  refresh_token: refreshToken,
  expires_in: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
};
```

---

**Status**: ✅ **PROBLEMA CRÍTICO RESOLVIDO**

**Implementado por**: GitHub Copilot  
**Data**: 01/10/2025
