# Correção de Logs 401 na Inicialização

## Problema Identificado

Ao abrir a aplicação, mensagens de erro 401 apareciam nos logs do backend:
```
inf_att-backend | [Nest] 200  - ERROR [HttpExceptionFilter] GET /auth/profile - Status: 401 - Message: "Unauthorized"
```

Essas mensagens apareciam **duplicadas** mesmo sem tentativa de login.

## Causa Raiz

### Frontend (AuthContext)
1. O `AuthContext` executa um `useEffect` na inicialização que tenta validar tokens do `localStorage`
2. Se existir um token antigo/inválido, faz requisição para `/auth/profile`
3. A requisição falha com 401 (esperado)
4. Em modo desenvolvimento (React StrictMode), o effect é executado **duas vezes**, causando logs duplicados

### Backend (HttpExceptionFilter)
1. O filtro global logava **todos** os erros HTTP como `ERROR`
2. Erros 401 são esperados e normais (usuário não autenticado)
3. Logs desnecessários poluíam o console

## Solução Implementada

### 1. Frontend - AuthContext (`/frontend/src/contexts/AuthContext.tsx`)

**Antes:**
```typescript
catch (error) {
  console.error('Failed to fetch profile with stored token:', error);
  localStorage.removeItem('authToken');
  setUser(null);
}
```

**Depois:**
```typescript
catch (error) {
  // Token inválido ou expirado - limpar silenciosamente
  // (401 é esperado quando não há sessão válida)
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
  setUser(null);
}
```

**Mudanças:**
- ✅ Removido `console.error` - erro 401 é esperado
- ✅ Adicionado `delete api.defaults.headers.common['Authorization']` para limpar headers
- ✅ Comentário explicativo sobre o comportamento esperado

### 2. Backend - HttpExceptionFilter (`/backend/src/common/filters/http-exception.filter.ts`)

**Antes:**
```typescript
// Log do erro
this.logger.error(
  `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
);
```

**Depois:**
```typescript
// Log do erro (não logar 401 como ERROR - é esperado para auth)
if (status === HttpStatus.UNAUTHORIZED) {
  this.logger.warn(
    `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
  );
} else if (status >= 500) {
  // Erros 5xx são críticos
  this.logger.error(
    `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
  );
} else {
  // Outros erros 4xx são apenas warnings
  this.logger.warn(
    `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
  );
}
```

**Mudanças:**
- ✅ Erros 401 agora são `WARN` (não `ERROR`)
- ✅ Apenas erros 5xx são logados como `ERROR` (são críticos)
- ✅ Outros erros 4xx são `WARN` (erros do cliente, não do servidor)

## Resultado

### Antes
- ❌ Logs de erro poluíam o console na inicialização
- ❌ Difícil distinguir erros reais de comportamento esperado
- ❌ Duplicação de mensagens por StrictMode

### Depois
- ✅ Logs limpos na inicialização
- ✅ Apenas warnings para 401 (esperado)
- ✅ Errors reservados para problemas reais (5xx)
- ✅ Melhor separação de níveis de log

## Por que as mensagens eram duplicadas?

O React 18+ em modo desenvolvimento (StrictMode) executa effects **duas vezes** para detectar bugs de sincronização. Isso é intencional e normal:

```tsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

Em produção, effects são executados apenas uma vez.

## Comportamento Esperado

### Ao abrir a aplicação (sem token)
- ✅ Nenhum log de erro
- ✅ Carregamento silencioso

### Ao abrir a aplicação (com token inválido)
- ✅ `WARN` no backend (não `ERROR`)
- ✅ Frontend limpa automaticamente
- ✅ Usuário redirecionado para login

### Ao fazer login com credenciais inválidas
- ✅ `WARN` apropriado (erro 4xx)
- ✅ Mensagem amigável para o usuário

### Em caso de erro do servidor
- ✅ `ERROR` no log (5xx)
- ✅ Rastreamento completo do problema

## Referências

- [React StrictMode](https://react.dev/reference/react/StrictMode)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)

---

**Data:** 15/10/2025
**Arquivos modificados:**
- `/frontend/src/contexts/AuthContext.tsx`
- `/backend/src/common/filters/http-exception.filter.ts`
