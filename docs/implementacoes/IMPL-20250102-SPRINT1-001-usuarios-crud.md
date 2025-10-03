# IMPL-20250102-SPRINT1-001 - CRUD de Usuários (Admin MVP)

**Data:** 2025-01-02  
**Tipo:** Frontend - Sprint 1  
**Status:** ✅ Completo (Aguardando Testes)  
**Tempo Estimado:** 7-10 horas  
**Prioridade:** Alta - Fundação do Admin MVP  

---

## Contexto

Implementação do CRUD completo de usuários como primeira funcionalidade do Admin MVP. Os usuários são a entidade fundamental do sistema, necessária para:
- Gerenciar Classes (atribuir professores/alunos)
- Registrar Presenças (vincular usuários)
- Controle de acesso (roles ADMIN, PROFESSOR, USER/STUDENT)

Esta é a primeira de 5 sprints planejadas para completar o Admin MVP.

---

## Arquivos Criados

### 1. Hook React Query
**Arquivo:** `/frontend/src/hooks/useUsers.ts`

**Interfaces TypeScript:**
```typescript
User {
  id: number
  uniqueIdentifier: string
  name: string
  email: string
  isActive: boolean
  curriculumId: number | null
  roles: UserRole[]
}

UserRole {
  roleId: number
  role: { id: number, name: 'USER' | 'ADMIN' | 'PROFESSOR' }
}

CreateUserDto {
  uniqueIdentifier: string
  name: string
  email: string
  password: string
  isActive?: boolean
  curriculumId?: number
  roleIds?: number[]
}

UpdateUserDto {
  // Todos os campos opcionais
}
```

**Funções:**
- `fetchUsers()`: GET /usuarios
- `fetchUserById(id)`: GET /usuarios/:id
- `useUsers()`: Hook com React Query ('users' key)
- `useUser(id)`: Hook com React Query ('users', id key, enabled se id existe)

### 2. Página de Listagem
**Arquivo:** `/frontend/src/pages/admin/usuarios/UsuariosListPage.tsx`

**Funcionalidades:**
- ✅ Loading state com `ListPageSkeleton`
- ✅ Error state com `ErrorState` + retry
- ✅ Empty state com `EmptyListState` + ação criar
- ✅ Busca por nome, email ou matrícula
- ✅ Filtro por role (ALL/ADMIN/PROFESSOR/USER)
- ✅ Filtro por status (ALL/ACTIVE/INACTIVE)
- ✅ Tabela responsiva com colunas:
  - Status (badge Ativo/Inativo com ícones)
  - Nome
  - Email
  - Matrícula (font-mono)
  - Roles (badges coloridos: ADMIN=vermelho, PROFESSOR=amarelo, USER=azul)
  - Ações (Ativar/Desativar, Editar, Deletar)
- ✅ Confirmação para ações destrutivas (deletar, desativar)
- ✅ Toast notifications (sucesso/erro)
- ✅ Contador de resultados filtrados
- ✅ Botão "Novo Usuário" no header
- ✅ Integração com `useConfirmDialog`

### 3. Página de Formulário
**Arquivo:** `/frontend/src/pages/admin/usuarios/UsuarioFormPage.tsx`

**Funcionalidades:**
- ✅ React Hook Form com validação completa
- ✅ Modo criação (/admin/usuarios/novo)
- ✅ Modo edição (/admin/usuarios/:id/editar)
- ✅ Loading state durante fetch (modo edição)

**Campos do Formulário:**

**Seção 1: Informações Básicas**
- Matrícula/Identificador (required, min 3 chars)
- Nome Completo (required, min 3 chars)
- Email (required, pattern email)
- Senha (required em create, opcional em edit, min 6 chars)

**Seção 2: Informações Acadêmicas**
- Currículo (opcional, dropdown com curso + grade)

**Seção 3: Permissões (Roles)**
- Checkboxes múltiplos para roles
- Busca automática de roles disponíveis (GET /cargo)
- Badges coloridos por tipo de role

**Seção 4: Status**
- Toggle "Usuário Ativo" (isActive)
- Descrição: desativar sem deletar

**Ações:**
- Botão Salvar (loading spinner durante submit)
- Botão Cancelar (volta para lista)
- Toast de sucesso/erro
- Redirect para lista após salvar

**Validações:**
- Campos obrigatórios marcados
- Validação de email (regex)
- Validação de senha (min 6)
- Validação de matrícula (min 3)

### 4. Configuração de Rotas
**Arquivo:** `/frontend/src/App.tsx`

**Rotas Adicionadas:**
```tsx
<Route path="admin/usuarios" element={<UsuariosListPage />} />
<Route path="admin/usuarios/novo" element={<UsuarioFormPage />} />
<Route path="admin/usuarios/:id/editar" element={<UsuarioFormPage />} />
```

**Guard:** Rotas protegidas dentro de `ProtectedRoute` (requer autenticação)
**Nota:** Role guard específico (ADMIN) pode ser adicionado posteriormente

### 5. Links no Dashboard
**Arquivo:** `/frontend/src/components/dashboard/AdminDashboard.tsx`

**Cards Adicionados:**
- "Gerenciar Usuários" → /admin/usuarios (ícone FiUsers)
- "Adicionar Usuário" → /admin/usuarios/novo (ícone FiUserPlus)

---

## Integrações com Backend

### Endpoints Utilizados

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | /usuarios | Listar todos os usuários |
| GET | /usuarios/:id | Buscar usuário por ID (modo edição) |
| POST | /usuarios | Criar novo usuário |
| PATCH | /usuarios/:id | Atualizar usuário |
| DELETE | /usuarios/:id | Deletar usuário |
| GET | /cargo | Listar roles disponíveis |
| GET | /curriculo | Listar currículos (opcional) |

### Tipos de Resposta Esperados

**User (GET /usuarios/:id ou GET /usuarios):**
```json
{
  "id": 1,
  "uniqueIdentifier": "20241234567",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "isActive": true,
  "curriculumId": 2,
  "roles": [
    {
      "roleId": 3,
      "role": {
        "id": 3,
        "name": "USER"
      }
    }
  ]
}
```

**CreateUserDto (POST /usuarios):**
```json
{
  "uniqueIdentifier": "20241234567",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "isActive": true,
  "curriculumId": 2,
  "roleIds": [3]
}
```

**UpdateUserDto (PATCH /usuarios/:id):**
```json
{
  "name": "João Silva Santos",
  "email": "joao.novo@exemplo.com",
  "isActive": false,
  "roleIds": [2, 3]
}
```

---

## Padrões Utilizados

### Design System
- **Card System:** `premium-card`, `stat-card-premium`, `action-card`
- **Badges:** `badge-success`, `badge-error`, `badge-warning`, `badge-info`
- **Inputs:** `input input-bordered`, `select select-bordered`
- **Buttons:** `btn btn-primary`, `btn-ghost`, `btn-error`
- **Loading:** `loading loading-spinner`

### Componentes Compartilhados
- `ListPageSkeleton` - Loading skeleton para listas
- `ErrorState` - Estado de erro com retry
- `EmptyListState` - Estado vazio genérico
- `useConfirmDialog` - Hook para confirmações
- `Button` - Botão com variantes
- `toast` (sonner) - Notificações

### React Query
- Query keys: `['users']`, `['users', id]`
- Invalidate: `queryClient.invalidateQueries({ queryKey: ['users'] })`
- Enabled conditional: `enabled: !!id`

### React Hook Form
- Validação inline com `register()`
- Error handling com `errors.fieldName`
- Reset form com `reset(data)`
- Loading state com `isSubmitting`

---

## Testes Manuais Pendentes

**Checklist de Testes (Sprint 1 - Item 6):**

### Listagem
- [ ] Página carrega sem erros
- [ ] Loading skeleton aparece durante fetch
- [ ] Dados são exibidos corretamente na tabela
- [ ] Busca filtra por nome
- [ ] Busca filtra por email
- [ ] Busca filtra por matrícula
- [ ] Filtro por role funciona (ALL/ADMIN/PROFESSOR/USER)
- [ ] Filtro por status funciona (ALL/ACTIVE/INACTIVE)
- [ ] Contador de resultados atualiza corretamente
- [ ] Empty state aparece quando sem dados
- [ ] Error state aparece em caso de erro
- [ ] Retry no error state refaz requisição

### Criação
- [ ] Botão "Novo Usuário" redireciona corretamente
- [ ] Form carrega vazio
- [ ] Validação de matrícula (required, min 3)
- [ ] Validação de nome (required, min 3)
- [ ] Validação de email (required, pattern)
- [ ] Validação de senha (required, min 6)
- [ ] Dropdown de currículos carrega dados
- [ ] Checkboxes de roles carregam dados
- [ ] Toggle isActive funciona
- [ ] Criação com sucesso exibe toast
- [ ] Após criar, redireciona para lista
- [ ] Lista é atualizada (refetch)
- [ ] Erros de API exibem toast

### Edição
- [ ] Botão "Editar" redireciona corretamente
- [ ] Form carrega dados existentes
- [ ] Campos são pré-preenchidos
- [ ] Senha não é obrigatória em edição
- [ ] Roles são marcados corretamente
- [ ] Currículo é selecionado corretamente
- [ ] Status (isActive) é marcado corretamente
- [ ] Atualização com sucesso exibe toast
- [ ] Após atualizar, redireciona para lista
- [ ] Lista é atualizada (refetch)
- [ ] Erros de API exibem toast

### Ações
- [ ] Botão "Ativar" exibe confirmação
- [ ] Ativar usuário funciona e exibe toast
- [ ] Botão "Desativar" exibe confirmação
- [ ] Desativar usuário funciona e exibe toast
- [ ] Botão "Deletar" exibe confirmação
- [ ] Deletar usuário funciona e exibe toast
- [ ] Lista é atualizada após cada ação

### Navegação
- [ ] Link no AdminDashboard "Gerenciar Usuários" funciona
- [ ] Link no AdminDashboard "Adicionar Usuário" funciona
- [ ] Botão "Cancelar" no form volta para lista

### Responsividade
- [ ] Tabela responsiva em mobile
- [ ] Filtros responsivos em mobile
- [ ] Form responsivo em mobile
- [ ] Cards do dashboard responsivos

---

## Próximos Passos (Sprint 2 - Disciplinas)

**Estimativa:** 3-4 horas

1. Criar `useSubjects.ts` hook
2. Criar `DisciplinasListPage.tsx` (código, nome, tipo, créditos, carga horária)
3. Criar `DisciplinaFormPage.tsx` com validação
4. Adicionar rotas no App.tsx
5. Adicionar links no AdminDashboard
6. Testar CRUD completo

**Vantagem:** Padrão já estabelecido com Users, implementação será mais rápida.

---

## Observações

### Decisões Técnicas
- **useUsers hook:** Centraliza lógica de fetching, facilita reuso
- **React Hook Form:** Validação robusta com menos código
- **Confirmação de ações:** UX melhor para ações destrutivas
- **Badges coloridos:** Diferenciação visual clara de roles
- **Toggle isActive:** Soft delete permite desativar sem perder dados

### Melhorias Futuras
- [ ] Adicionar paginação (se lista crescer muito)
- [ ] Adicionar ordenação por colunas
- [ ] Adicionar filtros avançados (por currículo, data de criação)
- [ ] Adicionar upload de foto de perfil
- [ ] Adicionar histórico de alterações (audit log)
- [ ] Adicionar role guard específico (apenas ADMIN acessa)
- [ ] Adicionar testes automatizados (unit + e2e)

### Alinhamento com MVP
- ✅ Requisito 1.1: CRUD de Usuários
- ✅ Requisito 1.2: Atribuição de Roles (ADMIN, PROFESSOR, USER)
- ✅ Requisito 1.3: Ativação/Desativação de Usuários

---

## Integração com Schema

**Modelo Prisma utilizado:**
```prisma
model User {
  id               Int          @id @default(autoincrement())
  uniqueIdentifier String       @unique
  name             String
  email            String       @unique
  password         String
  isActive         Boolean      @default(true)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
  curriculumId     Int?
  
  curriculum       Curriculum?  @relation(fields: [curriculumId], references: [id])
  roles            UserRole[]
  // ... outras relações
}
```

**Relações consideradas:**
- ✅ User → Curriculum (opcional)
- ✅ User → UserRole[] (múltiplos roles)
- ⏳ User → UserClass[] (próxima sprint)
- ⏳ User → Attendance[] (próxima sprint)

---

## Conclusão

Sprint 1 (CRUD de Usuários) está **100% implementada no código** e aguardando testes manuais. Todos os arquivos foram criados sem erros de TypeScript, rotas foram configuradas, e integração com backend está pronta.

**Status:**
- Backend: ✅ Endpoints testados e funcionais
- Frontend: ✅ Código completo sem erros
- Testes: ⏳ Pendente execução manual (Sprint 1 - Item 6)

**Próximo passo:** Executar checklist de testes manuais ou avançar para Sprint 2 (Disciplinas) se testes forem realizados posteriormente.
