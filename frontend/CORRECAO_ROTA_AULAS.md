# Correção: Erro 404 na Rota de Aulas

## 🐛 Problema Identificado

### Sintoma
Ao atualizar a página de detalhes da turma, o carregamento demorava e apareciam **3 erros 404** no backend:

```
[Nest] 200  - 10/06/2025, 10:05:13 PM   ERROR [HttpExceptionFilter] 
GET /turmas/1/aulas - Status: 404 - Message: "Cannot GET /turmas/1/aulas"
```

### Causa Raiz

O frontend estava fazendo **duas chamadas de API**:
1. ✅ `GET /turmas/:id` - **Existe** e retorna turma + aulas + alunos
2. ❌ `GET /turmas/:id/aulas` - **NÃO EXISTE** no backend

O hook `useLessonsByClass` estava tentando buscar aulas em uma rota que não foi implementada no backend, causando:
- **3 tentativas** de requisição (retry automático do React Query)
- **Delay no carregamento** aguardando timeout das requisições
- **Erros 404** no log do backend

## 🔧 Solução Implementada

### 1. Atualização da Interface `Class`

Adicionado o campo `lessons` na interface em `/frontend/src/hooks/useClasses.ts`:

```typescript
export interface Class {
  id: number;
  code: string;
  year: number;
  semester: number;
  subjectId: number;
  subject?: { /* ... */ };
  users?: UserClass[];
  lessons?: {  // ← NOVO CAMPO
    id: number;
    name?: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    classId: number;
    isOpen: boolean;
    openedAt?: string;
    closedAt?: string;
    openedBy?: number;
    hasAttendancePassword?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}
```

### 2. Refatoração do `ClassDetailPage.tsx`

**ANTES** (2 requisições):
```typescript
// Chamada 1: Buscar turma
const { data: classData, isLoading: isLoadingClass } = useClass(classId);

// Chamada 2: Buscar aulas (ROTA INEXISTENTE!)
const { data: lessonsData, isLoading: isLoadingLessons } = useLessonsByClass(classId);
```

**DEPOIS** (1 requisição):
```typescript
// UMA ÚNICA CHAMADA: Carrega turma com aulas e alunos
const { data: classData, isLoading: isLoadingClass } = useClass(classId);

// Extract lessons from class data
const lessonsData = classData?.lessons || [];
const isLoadingLessons = isLoadingClass;
```

### 3. Backend já estava correto

O backend em `/backend/src/core_entities/turmas/turmas.service.ts` já retornava as aulas:

```typescript
async findOne(id: number) {
  const turma = await this.prisma.class.findUnique({
    where: { id },
    include: {
      subject: true,
      users: { /* ... */ },
      lessons: true,  // ← JÁ INCLUÍA AS AULAS!
    },
  });
  return turma;
}
```

## ✅ Resultado

### Performance Melhorada
- **Antes**: 2 requisições (1 com sucesso + 1 falhando 3x)
- **Depois**: 1 requisição única
- **Redução**: ~70% menos chamadas de rede

### Erros Eliminados
- ✅ Sem mais erros 404 no backend
- ✅ Sem retries desnecessários
- ✅ Carregamento mais rápido e limpo

### Carregamento Otimizado
```
Agora:
GET /turmas/1 → Retorna tudo de uma vez
├─ Class data
├─ Subject info
├─ Users (students + professors)
└─ Lessons (todas as aulas)
   
Total: 1 requisição HTTP
```

## 🎯 Lições Aprendidas

1. **Sempre verificar as rotas do backend** antes de criar hooks de API
2. **Aproveitar includes do Prisma** - uma query bem feita retorna tudo que você precisa
3. **Evitar requisições desnecessárias** - use os dados que já foram carregados
4. **React Query faz retry automático** - erros 404 podem aparecer múltiplas vezes

## 📝 Arquivos Modificados

- ✅ `/frontend/src/hooks/useClasses.ts` - Interface atualizada
- ✅ `/frontend/src/features/professor/classes/ClassDetailPage.tsx` - Removido hook duplicado
- 🔄 Backend permaneceu inalterado (já estava correto)

---

**Data**: 06/10/2025  
**Status**: ✅ Resolvido e testado
