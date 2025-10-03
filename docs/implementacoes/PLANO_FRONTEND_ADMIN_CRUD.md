# 📋 Plano de Implementação - Frontend Admin MVP

**Data:** 02/10/2025  
**Código:** `IMPL-20251002-1900-002`  
**Categoria:** Frontend / CRUD Admin  
**Prioridade:** 🔴 Crítico (MVP)

---

## 📊 Estado Atual

### ✅ Já Implementado

#### Páginas Existentes
- ✅ `DashboardPage.tsx` - Dashboard com role-based rendering
- ✅ `CoursesListPage.tsx` - Lista de cursos com CRUD
- ✅ `CourseFormPage.tsx` - Formulário de criação/edição de curso
- ✅ `CoursePage.tsx` - Detalhes do curso (?)
- ✅ `TurmasListPage.tsx` - Lista de turmas
- ✅ `LoginPage.tsx` - Autenticação

#### Componentes Existentes
- ✅ `AdminDashboard.tsx` - Dashboard do admin (mock data)
- ✅ `ProfessorDashboard.tsx` - Dashboard do professor (mock data)
- ✅ `StudentDashboard.tsx` - Dashboard do aluno (mock data)
- ✅ `card-system.css` - Sistema de design premium

#### Hooks e Services
- ✅ `useCourses()` - Hook para cursos
- ✅ `api.ts` - Cliente API configurado
- ✅ `useConfirmDialog()` - Diálogo de confirmação

---

## 🎯 Páginas CRUD Necessárias (MVP)

### 🔴 Prioridade CRÍTICA

#### 1. Usuários (Users)
**Status:** ❌ NÃO EXISTE

**Páginas necessárias:**
- [ ] `/admin/usuarios` - Lista de usuários
- [ ] `/admin/usuarios/novo` - Criar usuário
- [ ] `/admin/usuarios/:id/editar` - Editar usuário
- [ ] `/admin/usuarios/:id` - Detalhes do usuário (opcional)

**Funcionalidades:**
- Listar usuários com busca e filtros (por role, status)
- Criar usuário (nome, email, matrícula, senha, roles)
- Editar usuário
- Ativar/Desativar usuário (isActive)
- Atribuir/Remover roles
- Importação CSV (opcional, pode ser fase 2)

**Endpoints Backend:**
- ✅ `GET /usuarios` - Listar
- ✅ `POST /usuarios` - Criar
- ✅ `GET /usuarios/:id` - Buscar
- ✅ `PATCH /usuarios/:id` - Editar
- ✅ `DELETE /usuarios/:id` - Deletar

---

#### 2. Disciplinas (Subjects)
**Status:** ❌ NÃO EXISTE

**Páginas necessárias:**
- [ ] `/admin/disciplinas` - Lista de disciplinas
- [ ] `/admin/disciplinas/nova` - Criar disciplina
- [ ] `/admin/disciplinas/:id/editar` - Editar disciplina
- [ ] `/admin/disciplinas/:id` - Detalhes (opcional)

**Funcionalidades:**
- Listar disciplinas com busca
- Criar disciplina (código, nome, tipo, créditos, carga horária)
- Editar disciplina
- Deletar disciplina (verificar se tem turmas)
- Vincular a curso (via CurriculumSubject - opcional MVP)

**Endpoints Backend:**
- ✅ `GET /disciplinas` - Listar
- ✅ `POST /disciplinas` - Criar
- ✅ `GET /disciplinas/:id` - Buscar
- ✅ `PATCH /disciplinas/:id` - Editar
- ✅ `DELETE /disciplinas/:id` - Deletar

---

#### 3. Turmas (Classes) - AMPLIAR
**Status:** ⚠️ EXISTE MAS INCOMPLETO

**Páginas existentes:**
- ✅ `/turmas` - Lista de turmas

**Páginas necessárias:**
- [ ] `/admin/turmas/nova` - Criar turma
- [ ] `/admin/turmas/:id/editar` - Editar turma
- [ ] `/admin/turmas/:id` - Detalhes da turma
- [ ] `/admin/turmas/:id/alunos` - Gerenciar alunos da turma
- [ ] `/admin/turmas/:id/aulas` - Gerenciar aulas da turma

**Funcionalidades:**
- Listar turmas com filtros (semestre, ano, disciplina)
- Criar turma (código, ano, semestre, disciplina, professor)
- Editar turma
- Adicionar/Remover alunos
- Adicionar/Remover professores (múltiplos via UserClass)
- Listar aulas da turma
- Criar aulas para a turma

**Endpoints Backend:**
- ✅ `GET /turmas` - Listar
- ✅ `POST /turmas` - Criar
- ✅ `GET /turmas/:id` - Buscar
- ✅ `PATCH /turmas/:id` - Editar
- ✅ `DELETE /turmas/:id` - Deletar
- ⚠️ `POST /turmas/:id/alunos` - Adicionar aluno (verificar se existe)
- ⚠️ `DELETE /turmas/:id/alunos/:userId` - Remover aluno (verificar se existe)

---

#### 4. Aulas (Lessons)
**Status:** ❌ NÃO EXISTE

**Páginas necessárias:**
- [ ] `/admin/turmas/:id/aulas` - Lista de aulas da turma (pode ser na página de detalhes da turma)
- [ ] `/admin/turmas/:id/aulas/nova` - Criar aula
- [ ] `/admin/aulas/:id/editar` - Editar aula
- [ ] `/admin/aulas/:id` - Detalhes da aula + presença

**Funcionalidades:**
- Listar aulas de uma turma
- Criar aula (data, horário início/fim, nome, descrição)
- Editar aula
- Deletar aula
- **Abrir/Fechar aula** para registro (NOVO - backend pronto)
- Visualizar lista de presença
- Editar presença manualmente (com auditoria)

**Endpoints Backend:**
- ✅ `GET /aulas` - Listar
- ✅ `POST /aulas` - Criar
- ✅ `GET /aulas/:id` - Buscar
- ✅ `PATCH /aulas/:id` - Editar
- ✅ `DELETE /aulas/:id` - Deletar
- ✅ `PATCH /aulas/:id/open` - Abrir aula (NOVO)
- ✅ `PATCH /aulas/:id/close` - Fechar aula (NOVO)

---

### 🟡 Prioridade MÉDIA

#### 5. Presença (Attendance)
**Status:** ❌ NÃO EXISTE

**Páginas necessárias:**
- [ ] `/aulas/:id/presenca` - Visualizar e editar presença
- [ ] `/alunos/:id/frequencia` - Frequência do aluno
- [ ] `/professor/turmas/:id/presenca` - Professor registrar presença

**Funcionalidades:**
- Visualizar lista de presença da aula
- Editar presença individual (admin/professor)
- Justificar edição (editReason - NOVO backend)
- Aluno registrar própria presença (quando aula aberta)
- Ver histórico de edições (auditoria)

**Endpoints Backend:**
- ✅ `GET /presencas` - Listar (por aula)
- ✅ `POST /presencas` - Criar (aluno marca presença)
- ✅ `PATCH /presencas/:lessonId/:userId` - Editar (com auditoria)

---

## 📐 Padrão de Implementação

### Estrutura de Arquivos
```
frontend/src/
├── pages/
│   ├── admin/                           # 🆕 Criar pasta admin
│   │   ├── usuarios/
│   │   │   ├── UsuariosListPage.tsx    # Lista
│   │   │   ├── UsuarioFormPage.tsx     # Criar/Editar
│   │   │   └── UsuarioDetailPage.tsx   # Detalhes (opcional)
│   │   ├── disciplinas/
│   │   │   ├── DisciplinasListPage.tsx
│   │   │   └── DisciplinaFormPage.tsx
│   │   ├── turmas/
│   │   │   ├── TurmasListPage.tsx      # ✅ Já existe, mover
│   │   │   ├── TurmaFormPage.tsx       # 🆕 Criar
│   │   │   ├── TurmaDetailPage.tsx     # 🆕 Criar
│   │   │   └── TurmaAlunosPage.tsx     # 🆕 Gerenciar alunos
│   │   └── aulas/
│   │       ├── AulaFormPage.tsx
│   │       └── AulaDetailPage.tsx
│   ├── professor/                       # 🆕 Criar pasta professor
│   │   └── RegistrarPresencaPage.tsx
│   └── aluno/                           # 🆕 Criar pasta aluno
│       └── MarcarPresencaPage.tsx
├── components/
│   └── admin/                           # 🆕 Componentes específicos de admin
│       ├── UsuarioForm.tsx
│       ├── DisciplinaForm.tsx
│       ├── TurmaForm.tsx
│       └── PresencaList.tsx
└── hooks/
    ├── useUsers.ts                      # 🆕 Criar
    ├── useSubjects.ts                   # 🆕 Criar
    ├── useClasses.ts                    # 🆕 Criar
    └── useLessons.ts                    # 🆕 Criar
```

### Template de Página Lista
Seguir o padrão de `CoursesListPage.tsx`:
- ✅ Loading state (ListPageSkeleton)
- ✅ Error state (ErrorState com retry)
- ✅ Empty state (EmptyListState)
- ✅ Busca e filtros
- ✅ Ações (Criar, Editar, Deletar)
- ✅ Confirm Dialog para deleções
- ✅ Toast notifications
- ✅ Responsive (mobile-first)

### Template de Formulário
Seguir o padrão de `CourseFormPage.tsx`:
- ✅ React Hook Form para validação
- ✅ Estados de loading
- ✅ Feedback de erro
- ✅ Cancelar e Voltar
- ✅ Toast de sucesso
- ✅ Redirect após salvar

---

## 🚀 Ordem de Implementação Sugerida

### Sprint 1: Fundação (Esta Sprint)
**Objetivo:** CRUD completo de usuários e disciplinas

1. **Usuários** (4-6 horas)
   - [ ] Hook `useUsers()`
   - [ ] `UsuariosListPage.tsx`
   - [ ] `UsuarioFormPage.tsx`
   - [ ] Rotas no React Router
   - [ ] Links no AdminDashboard

2. **Disciplinas** (3-4 horas)
   - [ ] Hook `useSubjects()`
   - [ ] `DisciplinasListPage.tsx`
   - [ ] `DisciplinaFormPage.tsx`
   - [ ] Rotas e links

### Sprint 2: Turmas Completas
**Objetivo:** CRUD de turmas com gestão de alunos

3. **Turmas** (6-8 horas)
   - [ ] Hook `useClasses()`
   - [ ] Mover `TurmasListPage.tsx` para `/admin/turmas/`
   - [ ] `TurmaFormPage.tsx`
   - [ ] `TurmaDetailPage.tsx`
   - [ ] `TurmaAlunosPage.tsx` (adicionar/remover alunos)
   - [ ] Integrar com backend

### Sprint 3: Aulas e Controle
**Objetivo:** CRUD de aulas com abertura/fechamento

4. **Aulas** (6-8 horas)
   - [ ] Hook `useLessons()`
   - [ ] `AulaFormPage.tsx`
   - [ ] `AulaDetailPage.tsx`
   - [ ] Botões "Abrir Aula" / "Fechar Aula"
   - [ ] Integrar com novos endpoints do backend

### Sprint 4: Presença
**Objetivo:** Fluxo completo de registro de presença

5. **Registro de Presença** (8-10 horas)
   - [ ] `RegistrarPresencaPage.tsx` (professor)
   - [ ] `MarcarPresencaPage.tsx` (aluno)
   - [ ] `PresencaList.tsx` (componente de lista)
   - [ ] Edição de presença com auditoria
   - [ ] Validação: só marcar se `lesson.isOpen === true`

### Sprint 5: Polimento
6. **Melhorias** (4-6 horas)
   - [ ] Aplicar card-system.css em todas as páginas
   - [ ] Dashboards com dados reais (remover mock)
   - [ ] Relatórios básicos (exportar CSV)
   - [ ] Testes E2E básicos

---

## 📊 Estimativa Total

| Sprint | Horas | Itens |
|--------|-------|-------|
| Sprint 1 | 7-10h | Usuários + Disciplinas |
| Sprint 2 | 6-8h | Turmas completas |
| Sprint 3 | 6-8h | Aulas com controle |
| Sprint 4 | 8-10h | Presença |
| Sprint 5 | 4-6h | Polimento |
| **TOTAL** | **31-42h** | **~15 páginas** |

**Tempo real estimado:** 1-2 semanas (com 1 dev full-time)

---

## 🎯 Próxima Ação IMEDIATA

Começar pelo **Sprint 1 - Item 1: Usuários**

### Checklist Inicial
- [ ] Criar pasta `/frontend/src/pages/admin/usuarios/`
- [ ] Criar hook `useUsers.ts`
- [ ] Implementar `UsuariosListPage.tsx` (seguir padrão CoursesListPage)
- [ ] Implementar `UsuarioFormPage.tsx` (seguir padrão CourseFormPage)
- [ ] Adicionar rotas no React Router
- [ ] Adicionar links no AdminDashboard
- [ ] Testar CRUD completo

---

**Documento criado em:** 02/10/2025 às 19:00  
**Status:** 📋 Planejamento completo  
**Pronto para:** Implementação Sprint 1
