# 🚀 Ponto de Partida - MVP Unificado | INF Attendance

**Data de Análise:** 03/10/2025  
**Status:** Infraestrutura Base Implementada  
**Progresso Estimado:** ~30% do MVP Total

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### 🔐 **1. Autenticação Completa (100%)**

#### Frontend
- ✅ **AuthContext** (`src/contexts/AuthContext.tsx`)
  - Login com token JWT
  - Logout
  - Validação de perfil
  - Persistência de token (localStorage)
  - Estado de carregamento
  - Interface `User` com `roles: string[]`

- ✅ **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
  - Proteção de rotas por autenticação
  - Proteção por roles (ADMIN, PROFESSOR, USER, STUDENT)
  - Redirecionamento automático

- ✅ **LoginPage** (`src/pages/LoginPage.tsx`)
  - Tela de login compartilhada
  - Validação de credenciais
  - Feedback de erros
  - Design responsivo

#### Backend
- ✅ **AuthService** (`src/auth/auth.service.ts`)
  - Login com validação de senha (bcrypt)
  - Geração de access_token (JWT)
  - Geração de refresh_token
  - Validação de usuários ativos
  - Retorno de roles do usuário

- ✅ **Schema Prisma**
  ```prisma
  enum RoleName {
    USER
    ADMIN
    PROFESSOR
  }
  
  model UserRole {
    userId Int
    roleId Int
    user   User @relation(...)
    role   Role @relation(...)
  }
  ```

**Status:** ✅ **100% Compartilhado** - Funciona para os 3 roles

---

### 🎨 **2. Design System (80%)**

#### Componentes UI Base
- ✅ **Button** (`src/components/common/Button.tsx`)
  - Baseado em DaisyUI + CVA
  - Variantes: primary, secondary, accent, ghost, outline, error, success, warning, info
  - Tamanhos: xs, sm, md, lg, wide, block, square, circle

- ✅ **StatCard** (`src/components/common/StatCard.tsx`)
  - Card de estatísticas com ícone
  - Usado nos 3 dashboards

- ✅ **EmptyState** (`src/components/common/EmptyState.tsx`)
  - Estado vazio com ícone e mensagem

- ✅ **Skeleton** (`src/components/common/Skeleton.tsx`)
  - Loading states

- ✅ **ConfirmDialog** (`src/components/common/ConfirmDialog.tsx`)
  - Modal de confirmação

- ✅ **Input** e **Label** (`src/components/common/`)
  - Inputs de formulário

#### Estilos Globais
- ✅ **TailwindCSS** configurado
- ✅ **DaisyUI** instalado e configurado
- ✅ **Design System Premium** (`src/styles/premium-design.css`)
  - Gradientes
  - Sombras
  - Animações
  - Card system

**Status:** ✅ **70% Implementado**

#### ❌ **Componentes UI Faltantes (30%):**

1. **Modal.tsx** - Modal base reutilizável
   - Overlay com backdrop
   - Fechamento com ESC
   - Fechamento clicando fora
   - Tamanhos (sm, md, lg, xl, full)
   - **Importância:** ALTA (usado em registro de presença, abrir aula, confirmações)

2. **Table.tsx** - Tabela com TanStack Table
   - Ordenação de colunas
   - Paginação
   - Busca/filtro
   - Seleção de linhas
   - **Importância:** MÉDIA (CRUDs já funcionam com tables simples)

3. **Badge.tsx** - Badge customizado
   - Variantes de cor
   - Tamanhos
   - Com ícone opcional
   - **Importância:** BAIXA (DaisyUI badge funciona, mas customizado seria melhor)

4. **Toast.tsx** - Sistema de notificações
   - **Status:** ✅ JÁ IMPLEMENTADO (Sonner configurado)

5. **Spinner.tsx** - Loading spinner customizado
   - **Status:** ✅ JÁ IMPLEMENTADO (DaisyUI loading)

---

### 🏗️ **3. Estrutura de Layout (100%)**

- ✅ **MainLayout** (`src/layouts/MainLayout.tsx`)
  - Sidebar responsiva (mobile + desktop)
  - Menu dinâmico por role
  - User card com avatar
  - Badge de role (Admin/Professor/Student)
  - Navegação com highlight ativo
  - Botão de logout

- ✅ **Navegação Condicional**
  ```tsx
  {user?.roles.includes('ADMIN') && (
    <NavItem to="/courses" icon={<FiBookOpen />} label="Cursos" />
  )}
  
  {user?.roles.includes('PROFESSOR') && (
    <NavItem to="/turmas" icon={<FiUsers />} label="Turmas" />
  )}
  ```

**Status:** ✅ **100% Implementado**

---

### 📊 **4. Dashboards (80%)**

#### Admin Dashboard
- ✅ **AdminDashboard** (`src/components/dashboard/AdminDashboard.tsx`)
  - Hero header
  - 6 cards de estatísticas (usuários, disciplinas, turmas, aulas hoje, etc)
  - Integração com hooks (useUsers, useSubjects, useClasses, useLessons, useAttendances)
  - Atalhos rápidos (criar usuário, turma, disciplina)
  - Lista de turmas recentes
  - Loading states

#### Professor Dashboard
- ✅ **ProfessorDashboard** (`src/components/dashboard/ProfessorDashboard.tsx`)
  - Hero header
  - Cards de estatísticas (turmas, aulas hoje, aulas próximas)
  - Lista de turmas do professor (filtrado por professor ID)
  - Aulas de hoje
  - Próximas 7 dias
  - Loading states

#### Student Dashboard
- ✅ **StudentDashboard** (`src/components/dashboard/StudentDashboard.tsx`)
  - Welcome header
  - Cards de estatísticas (disciplinas matriculadas, frequência, aulas próximas)
  - Lista de disciplinas (mockada - **TODO: integrar com API**)
  - Design mobile-first

#### Router Condicional
- ✅ **DashboardPage** (`src/pages/DashboardPage.tsx`)
  ```tsx
  const renderDashboard = () => {
    if (user.roles.includes('ADMIN')) return <AdminDashboard />;
    if (user.roles.includes('PROFESSOR')) return <ProfessorDashboard />;
    return <StudentDashboard />;
  };
  ```

**Status:** ✅ **80% Implementado** - StudentDashboard precisa integração com API

---

### 🔌 **5. API Client e Hooks (100%)**

#### API Client
- ✅ **Axios Instance** (`src/services/api.ts`)
  - Base URL configurável (VITE_API_URL)
  - Interceptor para JWT automático
  - Headers padrão

#### React Query Hooks
- ✅ **useUsers** (`src/hooks/useUsers.ts`)
  - Lista todos os usuários
  - Busca usuário por ID
  - Interfaces TypeScript (User, UserRole, CreateUserDto, UpdateUserDto)

- ✅ **useSubjects** (`src/hooks/useSubjects.ts`)
  - Lista disciplinas

- ✅ **useClasses** (`src/hooks/useClasses.ts`)
  - Lista turmas

- ✅ **useLessons** (`src/hooks/useLessons.ts`)
  - Lista aulas

- ✅ **useAttendances** (`src/hooks/useAttendances.ts`)
  - Lista presenças

- ✅ **useCursos** (`src/hooks/useCursos.ts`)
  - Lista cursos

**Status:** ✅ **100% Implementado** - Todos os hooks básicos prontos

---

### 🛠️ **6. CRUD Admin (90%)**

#### Páginas Implementadas
- ✅ **Usuários**
  - Lista (`src/pages/admin/usuarios/UsuariosListPage.tsx`)
  - Criar/Editar (`src/pages/admin/usuarios/UsuarioFormPage.tsx`)

- ✅ **Disciplinas**
  - Lista (`src/pages/admin/disciplinas/DisciplinasListPage.tsx`)
  - Criar/Editar (`src/pages/admin/disciplinas/DisciplinaFormPage.tsx`)

- ✅ **Turmas**
  - Lista (`src/pages/admin/turmas/TurmasListPage.tsx`)
  - Criar/Editar (`src/pages/admin/turmas/TurmaFormPage.tsx`)

- ✅ **Aulas**
  - Lista (`src/pages/admin/aulas/AulasListPage.tsx`)
  - Criar/Editar (`src/pages/admin/aulas/AulaFormPage.tsx`)

- ✅ **Presenças**
  - Lista (`src/pages/admin/presencas/PresencasListPage.tsx`)
  - Criar/Editar (`src/pages/admin/presencas/PresencaFormPage.tsx`)

#### Rotas Configuradas
```tsx
// Admin Routes - Usuários
<Route path="admin/usuarios" element={<UsuariosListPage />} />
<Route path="admin/usuarios/novo" element={<UsuarioFormPage />} />
<Route path="admin/usuarios/:id/editar" element={<UsuarioFormPage />} />

// ... (todas as rotas CRUD implementadas)
```

**Status:** ✅ **90% Implementado** - Falta apenas wizard de criação de turma

---

### 📦 **7. Backend Completo (100%)**

#### Estrutura
- ✅ **NestJS** com TypeScript
- ✅ **Prisma ORM** configurado
- ✅ **PostgreSQL** como database
- ✅ **JWT Authentication**
- ✅ **Refresh Tokens**

#### Módulos Implementados
- ✅ `/auth` - Autenticação (login, register, refresh)
- ✅ `/usuarios` - CRUD de usuários
- ✅ `/disciplinas` - CRUD de disciplinas
- ✅ `/turmas` - CRUD de turmas
- ✅ `/aulas` - CRUD de aulas (com controle de abertura/fechamento)
- ✅ `/presencas` - CRUD de presenças
- ✅ `/cursos` - CRUD de cursos
- ✅ `/health` - Health check

#### Schema Prisma
- ✅ User (com roles)
- ✅ Role (USER, ADMIN, PROFESSOR)
- ✅ UserRole (many-to-many)
- ✅ Subject (disciplinas)
- ✅ Class (turmas)
- ✅ UserClass (matriculas)
- ✅ Lesson (aulas com status: SCHEDULED, OPEN, CLOSED)
- ✅ Attendance (presenças)
- ✅ RefreshToken
- ✅ Curriculum
- ✅ Course

**Status:** ✅ **100% Implementado**

---

## ❌ O QUE FALTA IMPLEMENTAR (MVP)

### 🔴 **Prioridade ALTA (Sprint 1)**

#### 1. **Aluno - Registro de Presença**
- ❌ Modal de registro (`PresenceRegistrationModal.tsx`)
- ❌ Validação de código de 6 dígitos
- ❌ Integração com API `/presencas`
- ❌ Feedback visual (sucesso/erro)
- ❌ Atualização de frequência em tempo real

#### 2. **Aluno - Detalhes da Disciplina**
- ❌ Página de detalhes (`SubjectDetailPage.tsx`)
- ❌ Lista de aulas (presente/falta)
- ❌ Filtros (Todas / Só Faltas)
- ❌ Integração com API real

#### 3. **Aluno - Alertas de Frequência**
- ❌ Componente `LowFrequencyAlert.tsx`
- ❌ Cálculo automático (< 80%)
- ❌ Banner no dashboard
- ❌ Cálculo de faltas permitidas

---

### 🟡 **Prioridade MÉDIA (Sprint 2)**

#### 4. **Professor - Abrir/Fechar Aula**
- ❌ Modal `OpenLessonModal.tsx`
- ❌ Gerar código de 6 dígitos
- ❌ Exibir código em destaque
- ❌ Copiar código com um clique
- ❌ Timer de 20 minutos
- ❌ Modal `CloseLessonModal.tsx`
- ❌ Confirmação de fechamento
- ❌ Resumo (X presentes, Y ausentes)

#### 5. **Professor - Lista em Tempo Real**
- ❌ Componente `RealTimeAttendanceList.tsx`
- ❌ Polling (3s) ou WebSocket
- ❌ Indicadores (✅ presente, ⏳ aguardando)
- ❌ Barra de progresso
- ❌ Contador (X / Y alunos)

#### 6. **Professor - Registro Manual**
- ❌ Página `ManualAttendancePage.tsx`
- ❌ Lista de alunos com checkboxes
- ❌ Busca rápida
- ❌ Marcar/Desmarcar todos
- ❌ Salvar alterações

---

### 🟢 **Prioridade BAIXA (Sprint 3)**

#### 7. **Professor - Relatório PDF**
- ❌ Botão "Exportar Relatório"
- ❌ Geração de PDF (jsPDF)
- ❌ Layout profissional
- ❌ Download automático

#### 8. **Admin - Wizard de Turma**
- ❌ Componente `ClassFormWizard.tsx`
- ❌ Passo 1: Informações básicas
- ❌ Passo 2: Associar professor
- ❌ Passo 3: Adicionar alunos
- ❌ Progresso visual (1/3, 2/3, 3/3)

#### 9. **Perfil Compartilhado**
- ❌ Página `ProfilePage.tsx`
- ❌ Ver/editar dados pessoais
- ❌ Alterar senha
- ❌ Avatar (inicial das letras)

---

## 📊 ANÁLISE DE COMPLETUDE

### Por Feature (dos MVPs)

| Feature | Aluno | Professor | Admin | Total |
|---------|-------|-----------|-------|-------|
| **Autenticação** | ✅ 100% | ✅ 100% | ✅ 100% | ✅ **100%** |
| **Dashboard** | ⚠️ 80% | ✅ 100% | ✅ 100% | ✅ **93%** |
| **Gestão de Presença** | ❌ 0% | ❌ 20% | ✅ 100% | ⚠️ **40%** |
| **Visualização** | ❌ 0% | ⚠️ 50% | ✅ 100% | ⚠️ **50%** |
| **Relatórios** | - | ❌ 0% | ⚠️ 50% | ⚠️ **25%** |
| **Perfil** | ❌ 0% | ❌ 0% | ❌ 0% | ❌ **0%** |
| **CRUD** | - | - | ✅ 90% | ✅ **90%** |

### Por Nível de Infraestrutura

| Nível | Status | Completude | O que falta |
|-------|--------|------------|-------------|
| **Nível 1: Backend & API** | ✅ Completo | **100%** | Nada |
| **Nível 2: Infraestrutura Frontend** | ⚠️ Parcial | **80%** | Ver detalhes abaixo ⬇️ |
| **Nível 3: Componentes UI Base** | ⚠️ Parcial | **70%** | Modal, Table, Badge |
| **Nível 4: Features Compartilhadas** | ⚠️ Parcial | **40%** | Utils, hooks específicos |
| **Nível 5: Features por Role** | ❌ Incompleto | **25%** | Aluno e Professor |

### Estimativa Geral
```
┌────────────────────────────────────────┐
│  PROGRESSO TOTAL DO MVP                │
├────────────────────────────────────────┤
│  ████████░░░░░░░░░░░░░░░░░░░░  35%    │
├────────────────────────────────────────┤
│  Backend:             ████████████  100%    │
│  Infraestrutura Base: ██████████░░   80%    │
│  Componentes UI:      ████████░░░░   70%    │
│  Utils Compartilhados: ████░░░░░░░░   40%    │
│  Admin Features:      ████████░░░░   70%    │
│  Prof Features:       ███░░░░░░░░░   25%    │
│  Aluno Features:      ██░░░░░░░░░░   15%    │
└────────────────────────────────────────┘
```

---

## 🔍 DETALHAMENTO: O QUE FALTA NA INFRAESTRUTURA (20%)

### **Nível 2: Infraestrutura Frontend - 80% ✅**

#### ✅ **O que JÁ ESTÁ (80%):**
1. ✅ **Vite + React + TypeScript** configurado
2. ✅ **TailwindCSS + DaisyUI** configurado
3. ✅ **React Router v6** com rotas protegidas
4. ✅ **React Query** (@tanstack/react-query) configurado
5. ✅ **Axios** com interceptors JWT
6. ✅ **Sonner** para toasts
7. ✅ **AuthContext** completo
8. ✅ **MainLayout** com sidebar responsiva
9. ✅ **ProtectedRoute** com validação de roles
10. ✅ **Design system premium** (gradientes, sombras, animações)

#### ❌ **O que FALTA (20%):**

##### 1. **Utils Compartilhados (0%)** - CRÍTICO
```bash
# Criar: src/utils/
├── attendance/
│   ├── calculateFrequency.ts      # (presentes / total) * 100
│   ├── getFrequencyStatus.ts      # retorna 'success' | 'warning' | 'error'
│   ├── getFrequencyColor.ts       # retorna classe Tailwind
│   └── canRegisterAttendance.ts   # valida se pode registrar
├── date/
│   ├── formatDate.ts              # formata datas
│   ├── getTimeRemaining.ts        # calcula tempo restante
│   └── isWithinTimeWindow.ts      # valida janela de 20 min
├── validation/
│   ├── validateCode.ts            # valida código de 6 dígitos
│   └── validateEmail.ts           # valida email
└── format/
    ├── formatPercentage.ts        # 0.92 → "92%"
    └── formatName.ts              # "João Silva" → "JS"
```

**Impacto:** 🔴 **ALTO** - Esses utils são usados em TODOS os componentes de frequência

##### 2. **Hooks Compartilhados Específicos (0%)** - IMPORTANTE
```bash
# Criar: src/hooks/
├── useAttendance.ts               # Hook com lógica de presença
├── useFrequency.ts                # Hook com cálculo de frequência
├── useLesson.ts                   # Hook para aula específica
└── useRealTimeAttendance.ts       # Hook com polling para tempo real
```

**Impacto:** 🟡 **MÉDIO** - Facilita reuso, mas pode ser feito inline

##### 3. **Types Globais (30%)** - MÉDIO
```bash
# Melhorar: src/types/
├── index.ts                       # ✅ Já existe (parcial)
├── user.ts                        # ❌ Separar types de User
├── attendance.ts                  # ❌ Types de Attendance
├── lesson.ts                      # ❌ Types de Lesson
├── subject.ts                     # ❌ Types de Subject
└── common.ts                      # ❌ Types genéricos
```

**Impacto:** 🟢 **BAIXO** - Types já existem nos hooks, só precisa centralizar

##### 4. **Componentes UI Base (30%)** - IMPORTANTE
```bash
# src/components/ui/
├── Button.tsx          ✅ Pronto
├── Card.tsx           ⚠️  DaisyUI (poderia ter customizado)
├── Input.tsx           ✅ Pronto
├── Label.tsx           ✅ Pronto
├── Modal.tsx           ❌ FALTA (crítico)
├── Table.tsx           ❌ FALTA (médio)
├── Badge.tsx           ❌ FALTA (baixo)
├── Select.tsx          ⚠️  Básico (poderia melhorar)
├── Checkbox.tsx        ⚠️  DaisyUI (ok por enquanto)
└── Textarea.tsx        ⚠️  DaisyUI (ok por enquanto)
```

**Impacto:** 🟡 **MÉDIO** - Modal é crítico, resto pode usar DaisyUI

##### 5. **Error Handling Global (0%)** - IMPORTANTE
```bash
# Criar: src/contexts/
└── ErrorBoundary.tsx              # Captura erros React
# Melhorar: src/services/api.ts
└── Adicionar tratamento de erro global (interceptor)
```

**Impacto:** 🟡 **MÉDIO** - Melhora UX, mas não bloqueia MVP

##### 6. **Performance (0%)** - BAIXO
```bash
# Otimizações:
- React.lazy() para code splitting
- Memoização com useMemo/useCallback
- Virtualização de listas grandes (react-window)
```

**Impacto:** 🟢 **BAIXO** - Otimização prematura, fazer depois

---

## 🎯 ESTRATÉGIA RECOMENDADA

### **Economia de Tempo com Arquitetura Compartilhada**

| Abordagem | Tempo Total | Detalhes |
|-----------|-------------|----------|
| **Sem compartilhamento** | 20 semanas | 6 (Aluno) + 8 (Professor) + 6 (Admin) |
| **Com compartilhamento** | 7 semanas | 1 (fundação) + 6 (paralelo) |
| **Redução** | **~65%** | 13 semanas economizadas |

### Sprint 0 (1 semana) - **Fundação Compartilhada** ⚠️ *Já implementada parcialmente*
**Objetivo:** Setup completo e componentes base

**Tasks:**
- ✅ Setup Vite + React + TS (FEITO)
- ✅ TailwindCSS + DaisyUI (FEITO)
- ✅ API Client Axios + interceptors (FEITO)
- ✅ Autenticação multi-role (FEITO)
- ✅ Layout base + Sidebar (FEITO)
- ⚠️ Componentes compartilhados faltantes:
  - ❌ `FrequencyBadge.tsx` (badge com cor + %)
  - ❌ `FrequencyBar.tsx` (barra de progresso)
  - ❌ `SubjectCard.tsx` (card de disciplina)
  - ❌ `ClassCard.tsx` (card de turma)
  - ❌ `Table.tsx` (tabela reutilizável com TanStack Table)
  - ❌ `Modal.tsx` (modal base customizado)

**Status:** ✅ **80% Completo**

---

### Sprint 1 (2 semanas) - **Aluno MVP**
**Objetivo:** Aluno consegue registrar presença e ver frequência

**Tasks:**
1. ❌ Criar componentes compartilhados faltantes (acima)
2. ❌ Integrar StudentDashboard com API (listar disciplinas reais)
3. ❌ Criar `PresenceRegistrationModal.tsx`
4. ❌ Implementar validação de código (frontend + backend)
5. ❌ Criar `SubjectDetailPage.tsx`
6. ❌ Implementar `LowFrequencyAlert.tsx`
7. ❌ Atualizar frequência em tempo real

**Entregáveis:**
- ✅ Aluno vê suas disciplinas
- ✅ Aluno registra presença com código
- ✅ Aluno vê histórico de aulas
- ✅ Aluno recebe alertas de baixa frequência

---

### Sprint 2 (2 semanas) - **Professor MVP**
**Objetivo:** Professor abre aula, gera código, vê presença em tempo real

**Tasks:**
1. ✅ Criar `OpenLessonModal.tsx`
2. ✅ Implementar geração de código (backend: `/aulas/:id/abrir`)
3. ✅ Criar `RealTimeAttendanceList.tsx` (polling 3s)
4. ✅ Criar `CloseLessonModal.tsx`
5. ✅ Implementar `ManualAttendancePage.tsx`
6. ✅ Integrar ProfessorDashboard com turmas reais

**Entregáveis:**
- ✅ Professor abre aula e gera código
- ✅ Professor vê lista de presentes em tempo real
- ✅ Professor fecha aula
- ✅ Professor faz chamada manual

---

### Sprint 3 (2 semanas) - **Polimento + Extras**
**Objetivo:** Finalizar features secundárias e testes

**Tasks:**
1. ✅ Criar `ProfilePage.tsx` (compartilhado)
2. ✅ Implementar geração de PDF (professor)
3. ✅ Criar wizard de turma (admin)
4. ✅ Testes com usuários reais
5. ✅ Correções de bugs
6. ✅ Otimizações de performance

**Entregáveis:**
- ✅ Perfil compartilhado funciona
- ✅ Professor exporta relatório PDF
- ✅ Admin cria turma com wizard intuitivo
- ✅ Sistema testado e validado

---

## 🏗️ REESTRUTURAÇÃO RECOMENDADA (Arquitetura por Features)

### **Estrutura Atual vs. Estrutura Ideal**

#### ❌ **Estrutura Atual** (por tipo de arquivo)
```
src/
├── components/
│   ├── common/
│   ├── dashboard/
│   └── layout/
├── pages/
│   └── admin/
├── hooks/
└── contexts/
```

#### ✅ **Estrutura Ideal** (por domínio/feature)
```
src/
├── features/              # Por domínio (não por role)
│   ├── auth/              # 100% compartilhado
│   │   ├── AuthContext.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── useAuth.ts
│   │
│   ├── profile/           # 100% compartilhado
│   │   ├── ProfilePage.tsx
│   │   ├── ChangePasswordModal.tsx
│   │   └── useProfile.ts
│   │
│   ├── attendance/        # Lógica compartilhada + 3 views
│   │   ├── utils/
│   │   │   ├── calculateFrequency.ts
│   │   │   ├── getFrequencyStatus.ts  # cores
│   │   │   └── validateCode.ts
│   │   ├── components/
│   │   │   ├── FrequencyBadge.tsx     # ✅ 92% verde
│   │   │   ├── FrequencyBar.tsx       # barra progresso
│   │   │   └── AttendanceList.tsx
│   │   ├── student/
│   │   │   ├── PresenceRegistrationModal.tsx
│   │   │   └── LowFrequencyAlert.tsx
│   │   ├── professor/
│   │   │   ├── OpenLessonModal.tsx
│   │   │   ├── RealTimeAttendanceList.tsx
│   │   │   └── ManualAttendancePage.tsx
│   │   └── admin/
│   │       └── AttendanceManagement.tsx
│   │
│   ├── subjects/          # Aluno + Professor
│   │   ├── components/
│   │   │   ├── SubjectCard.tsx        # Card genérico
│   │   │   └── SubjectList.tsx
│   │   ├── student/
│   │   │   └── SubjectDetailPage.tsx
│   │   └── professor/
│   │       └── SubjectManagement.tsx
│   │
│   ├── classes/           # Admin + Professor
│   │   ├── components/
│   │   │   ├── ClassCard.tsx
│   │   │   └── ClassList.tsx
│   │   ├── admin/
│   │   │   ├── ClassFormWizard.tsx
│   │   │   └── ClassManagement.tsx
│   │   └── professor/
│   │       └── MyClasses.tsx
│   │
│   └── users/             # Apenas Admin
│       ├── UserListPage.tsx
│       └── UserFormPage.tsx
│
├── components/            # UI compartilhada global
│   ├── ui/                # Design system
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   └── Input.tsx
│   └── layout/
│       ├── MainLayout.tsx
│       ├── Sidebar.tsx
│       └── Header.tsx
│
├── pages/                 # Apenas roteamento
│   ├── admin/
│   ├── professor/
│   └── student/
│
├── hooks/                 # Hooks compartilhados
│   ├── useAuth.ts
│   ├── useAttendance.ts
│   └── useFrequency.ts
│
├── api/                   # API client
│   └── client.ts
│
├── utils/                 # Helpers compartilhados
│   ├── calculateFrequency.ts
│   ├── formatDate.ts
│   └── validateCode.ts
│
└── types/                 # TypeScript types globais
    └── index.ts
```

### **Vantagens da Reestruturação:**
1. ✅ **Reuso de código**: Features compartilhadas em um lugar
2. ✅ **Manutenção**: Alterar "frequência" → tudo em `features/attendance/`
3. ✅ **Escalabilidade**: Fácil adicionar nova role
4. ✅ **Testes**: Testar feature completa de uma vez
5. ✅ **Onboarding**: Dev novo entende domínio, não tipo de arquivo

---

## � FLUXO COMPLETO DE INTEGRAÇÃO (Admin → Professor → Aluno)

### **1. Admin cria estrutura**
```
Admin cria disciplina → Ex: "Estrutura de Dados (CC301)"
Admin cria turma → Ex: "Turma A - 2025/2"
Admin associa professor → Ex: "João Silva"
Admin matricula alunos → Ex: 45 alunos selecionados
```

### **2. Professor abre aula**
```
Professor acessa turma → Vê 45 alunos matriculados
Professor clica "Abrir Aula" → Sistema gera código 742839
Professor exibe código no projetor → Válido por 20 min
```

### **3. Aluno registra presença**
```
Aluno acessa app → Clica "Registrar Presença"
Aluno digita código 742839 → Sistema valida
Sistema registra presença → Atualiza frequência (92% → 93%)
```

### **4. Professor vê lista em tempo real**
```
Lista atualiza automaticamente → João Silva ✅ 10:32
Professor fecha aula após 20 min → 38 presentes, 7 ausentes
Sistema salva no banco → Frequência da turma atualizada
```

### **5. Admin vê estatísticas**
```
Dashboard admin → Frequência geral: 87%
Top 5 turmas com menor frequência → POO Turma C: 64%
Alerta de baixa frequência → 12 alunos em risco
```

---

## �🚀 PRÓXIMOS PASSOS IMEDIATOS

### **Fase 1: Componentes Compartilhados (2-3 dias)**

#### 1. **Criar FrequencyBadge.tsx**
```tsx
// src/components/ui/FrequencyBadge.tsx
interface FrequencyBadgeProps {
  percentage: number;
  showLabel?: boolean;
}

// Verde (≥75%), Amarelo (60-74%), Vermelho (<60%)
```

#### 2. **Criar FrequencyBar.tsx**
```tsx
// src/components/ui/FrequencyBar.tsx
interface FrequencyBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
}
```

#### 3. **Criar SubjectCard.tsx**
```tsx
// src/features/subjects/components/SubjectCard.tsx
// Card genérico usado por Aluno e Professor
```

#### 4. **Criar Table.tsx**
```tsx
// src/components/ui/Table.tsx
// Baseado em TanStack Table
// Usado em todos os CRUDs
```

---

## 📅 CRONOGRAMA ATUALIZADO (03/10/2025)

### ✅ **Week 0.5 - Infraestrutura Base (COMPLETA)** 
**Data:** 03/10/2025  
**Status:** ✅ **100% CONCLUÍDO**  
**Implementação:** `IMPL-20251003-INFRA-001`

**Entregáveis Completados:**
- ✅ Utils de Frequência (18 funções)
- ✅ Utils de Data (22 funções)
- ✅ Utils de Validação (18 funções)
- ✅ Utils de Formatação (17 funções)
- ✅ Componente Modal (3 variantes)
- ✅ Hooks Customizados (6 hooks)
- ✅ TypeScript aliases configurados
- ✅ Build sem erros validado
- ✅ Documentação completa

**Resultado:** Infraestrutura 80% → **100%** ✅

---

## 🚀 PRÓXIMOS PASSOS

### **Sprint 1 - Features do Aluno (2 semanas)**
**Início:** 04/10/2025  
**Término:** 18/10/2025  
**Objetivo:** Aluno consegue registrar presença e visualizar frequência

#### **Semana 1 (04-11 Out):**
1. ✅ Integrar StudentDashboard com API real
   - Usar `useClasses()` para disciplinas matriculadas
   - Usar `useFrequency()` para calcular frequência
   - Usar `useLessons()` para próximas aulas
   - **Reuso:** Hooks e utils já criados na Week 0.5

2. ✅ Criar PresenceRegistrationModal.tsx
   - Usar `Modal` component (já criado)
   - Usar `validatePresenceCode()` (já criado)
   - Usar `canRegisterAttendance()` (já criado)
   - Usar `formatTimeRemaining()` para countdown
   - Integrar com POST `/presencas`

3. ✅ Criar FrequencyBadge component
   - Usar `getFrequencyBadgeClass()` (já criado)
   - Usar `getFrequencyTextColor()` (já criado)
   - Exibir porcentagem com cores DaisyUI

#### **Semana 2 (11-18 Out):**
4. ✅ Criar SubjectDetailPage.tsx
   - Listar aulas (presente/falta)
   - Usar `FrequencyBadge` component
   - Filtros: Todas / Só Faltas
   - Usar `formatDate()` para datas

5. ✅ Implementar LowFrequencyAlert.tsx
   - Usar `needsFrequencyAlert()` (já criado)
   - Usar `calculateRemainingAbsences()` (já criado)
   - Banner no dashboard quando < 80%

6. ✅ Testes de integração
   - Testar fluxo completo de registro
   - Validar cálculos de frequência
   - Testar alertas

**Entregáveis Sprint 1:**
- ✅ Aluno vê suas disciplinas com frequência
- ✅ Aluno registra presença com código (20 min window)
- ✅ Aluno vê histórico de aulas
- ✅ Aluno recebe alertas de baixa frequência

**Tempo economizado:** ~30% usando infraestrutura da Week 0.5

---

### **Sprint 2 - Features do Professor (2 semanas)**
**Início:** 21/10/2025  
**Término:** 01/11/2025  
**Objetivo:** Professor abre aula, gera código, monitora presença em tempo real

#### **Semana 1 (21-28 Out):**
1. ✅ Criar OpenLessonModal.tsx
   - Usar `ConfirmModal` component (já criado)
   - Usar `generatePresenceCode()` (já criado)
   - Usar `formatPresenceCode()` para exibir: "123 456"
   - Exibir código em destaque com botão copiar
   - Integrar com POST `/aulas/:id/abrir`

2. ✅ Criar CloseLessonModal.tsx
   - Usar `ConfirmModal` component (já criado)
   - Mostrar resumo: X presentes, Y ausentes
   - Usar `formatPercentage()` (já criado)
   - Integrar com POST `/aulas/:id/fechar`

3. ✅ Criar RealTimeAttendanceList.tsx
   - Usar `useRealTimeAttendance()` hook (já criado)
   - Polling automático a cada 3s
   - Usar `formatNameToInitials()` para avatares (já criado)
   - Usar `FrequencyBadge` para porcentagem da turma
   - Progress bar com `getFrequencyProgressClass()` (já criado)

#### **Semana 2 (28 Out - 01 Nov):**
4. ✅ Criar ManualAttendancePage.tsx
   - Lista de alunos com checkboxes
   - Busca rápida
   - Marcar/Desmarcar todos
   - Usar `formatNameToDisplay()` (já criado)
   - POST `/presencas` (múltiplas)

5. ✅ Implementar timer de 20 minutos
   - Usar `getTimeRemaining()` (já criado)
   - Usar `formatTimeRemaining()` para countdown
   - Usar `isTimeExpired()` para validar
   - Auto-fechar aula quando expirar

6. ✅ Integrar ProfessorDashboard
   - Listar turmas do professor
   - Aulas de hoje com botão "Abrir Aula"
   - Estatísticas usando `useFrequency()`

**Entregáveis Sprint 2:**
- ✅ Professor abre aula e gera código
- ✅ Professor vê lista atualizada em tempo real (3s)
- ✅ Professor fecha aula após 20 min
- ✅ Professor faz chamada manual se necessário
- ✅ Timer visual de 20 minutos

**Tempo economizado:** ~35% usando infraestrutura + hooks

---

### **Sprint 3 - Polimento e Extras (1.5 semanas)**
**Início:** 04/11/2025  
**Término:** 14/11/2025  
**Objetivo:** Finalizar features secundárias e preparar para produção

#### **Semana 1 (04-08 Nov):**
1. ✅ Criar ProfilePage.tsx (compartilhado)
   - Ver/editar dados pessoais
   - Alterar senha
   - Avatar com iniciais usando `formatNameToInitials()`
   - Usar `validateEmail()`, `validateRequired()` (já criados)

2. ✅ Implementar geração de PDF (professor)
   - Botão "Exportar Relatório"
   - Usar jsPDF
   - Layout profissional com logo
   - Dados: turma, frequência, presentes/ausentes

3. ✅ Criar wizard de turma (admin)
   - Componente `ClassFormWizard.tsx`
   - Passo 1: Informações básicas
   - Passo 2: Associar professor
   - Passo 3: Adicionar alunos (busca + seleção múltipla)

#### **Semana 2 (11-14 Nov):**
4. ✅ Testes com usuários reais
   - Admin cria turma completa
   - Professor abre aula e gera código
   - Alunos registram presença
   - Validar fluxo end-to-end

5. ✅ Correções de bugs
   - Lista de issues identificadas
   - Priorizar críticos
   - Testes de regressão

6. ✅ Otimizações de performance
   - Code splitting com React.lazy()
   - Memoização com useMemo/useCallback (já usado nos hooks)
   - Lazy load de modais

**Entregáveis Sprint 3:**
- ✅ Perfil compartilhado funcional para os 3 roles
- ✅ Professor exporta relatório PDF
- ✅ Admin cria turma com wizard intuitivo
- ✅ Sistema testado e validado
- ✅ Performance otimizada

---

## 📊 CRONOGRAMA RESUMIDO

| Sprint | Período | Duração | Foco | Status |
|--------|---------|---------|------|--------|
| **Week 0.5** | 03 Out | 1 dia | Infraestrutura Base | ✅ **COMPLETO** |
| **Sprint 1** | 04-18 Out | 2 semanas | Features Aluno | ⏳ **PRÓXIMO** |
| **Sprint 2** | 21 Out - 01 Nov | 2 semanas | Features Professor | 📅 Planejado |
| **Sprint 3** | 04-14 Nov | 1.5 semanas | Polimento + Extras | 📅 Planejado |
| **TOTAL** | 03 Out - 14 Nov | **5.5 semanas** | MVP Completo | 18% Completo |

### Timeline Visual
```
Outubro 2025          │ Novembro 2025
─────────────────────┼──────────────────
03 ████ Week 0.5 ✅  │
04-18 ████████ Sprint 1 (Aluno)        │
   21-01 ████████ Sprint 2 (Professor) │
      04-14 ██████ Sprint 3 (Polish)   │
                     │     14 🎉 LAUNCH
```

---

## 🎯 COMPARAÇÃO: ANTES vs DEPOIS da Week 0.5

### **ANTES (Estado em 03/10 - 08:00)**
```
Infraestrutura: 80%
- Utils: 0%                    ❌
- Componentes compartilhados: 30%  ⚠️
- Hooks específicos: 0%        ❌
- Modal base: 0%               ❌
```

**Tempo estimado para Sprint 1:** 3 semanas (muita implementação de base)

### **DEPOIS (Estado em 03/10 - 18:00)**
```
Infraestrutura: 100% ✅
- Utils: 100% (75 funções)     ✅
- Componentes compartilhados: 100%  ✅
- Hooks específicos: 100%      ✅
- Modal base: 100%             ✅
```

**Tempo estimado para Sprint 1:** 2 semanas (apenas features)

### **Economia de Tempo**
- Sprint 1: **3 semanas → 2 semanas** (-33%)
- Sprint 2: **3 semanas → 2 semanas** (-33%)
- Sprint 3: **2 semanas → 1.5 semanas** (-25%)
- **TOTAL: 8 semanas → 5.5 semanas** (**-31% de tempo**)

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS (Sprint 1 - Dia 1)

### **Segunda, 04/10/2025 - Manhã**

#### **Tarefa 1: Integrar StudentDashboard com API real (4h)**
```tsx
// src/components/dashboard/StudentDashboard.tsx
// Substituir mocks por hooks reais:
const { data: classes } = useClasses(); // Lista disciplinas
const { data: lessons } = useLessons(); // Próximas aulas
```

**Checklist:**
- [ ] Substituir dados mockados por hooks
- [ ] Usar `useFrequency()` para calcular porcentagens
- [ ] Usar `formatPercentage()` para exibição
- [ ] Testar com dados reais do backend

#### **Tarefa 2: Criar FrequencyBadge.tsx (2h)**
```tsx
// src/components/ui/FrequencyBadge.tsx
import { getFrequencyBadgeClass, getFrequencyTextColor } from '@/utils/attendance';

// Componente simples: badge colorido com porcentagem
```

**Checklist:**
- [ ] Criar component básico
- [ ] Integrar utils de frequência
- [ ] Testar com vários cenários (90%, 75%, 60%, 50%)
- [ ] Adicionar tooltip opcional

#### **Tarefa 3: Iniciar PresenceRegistrationModal.tsx (2h)**
```tsx
// src/features/attendance/student/PresenceRegistrationModal.tsx
import { Modal } from '@/components/ui/Modal';
import { validatePresenceCode } from '@/utils/validation';

// Modal para o aluno inserir código de 6 dígitos
```

**Checklist:**
- [ ] Criar estrutura básica do modal
- [ ] Input de código (máscara 6 dígitos)
- [ ] Validação com `validatePresenceCode()`
- [ ] Timer com `getTimeRemaining()`

---

### **Segunda, 04/10/2025 - Tarde**

#### **Tarefa 4: Finalizar PresenceRegistrationModal (3h)**
- [ ] Integrar POST `/presencas`
- [ ] Tratamento de erros
- [ ] Loading state usando `LoadingModal`
- [ ] Sucesso: mostrar confirmação
- [ ] Erro: código inválido / tempo expirado

#### **Tarefa 5: Testar fluxo completo (1h)**
- [ ] Abrir aula no backend (via Postman/Insomnia)
- [ ] Registrar presença pelo frontend
- [ ] Verificar no dashboard se frequência atualiza
- [ ] Validar timer de 20 minutos

---

## 📝 NOTAS IMPORTANTES

### Decisões Técnicas Já Tomadas
1. ✅ **Um único projeto React** (não separar por role)
2. ✅ **Roteamento condicional** por role
3. ✅ **Design System compartilhado** (DaisyUI + Tailwind)
4. ✅ **React Query** para cache e estado de servidor
5. ✅ **Polling (3s)** para tempo real (não WebSocket no MVP)
6. ✅ **Código numérico de 6 dígitos** (não QR Code no MVP)

### Arquitetura Atual
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          ✅ (80% pronto)
│   │   ├── dashboard/       ✅ (90% pronto)
│   │   ├── layout/          ✅ (vazio - mover MainLayout?)
│   │   ├── student/         ❌ (criar)
│   │   ├── professor/       ❌ (criar)
│   │   └── admin/           ⚠️ (parcial)
│   ├── pages/
│   │   ├── admin/           ✅ (90% pronto)
│   │   ├── student/         ❌ (criar)
│   │   └── professor/       ❌ (criar)
│   ├── hooks/               ✅ (100% pronto)
│   ├── contexts/            ✅ (100% pronto)
│   ├── layouts/             ✅ (100% pronto)
│   └── services/            ✅ (100% pronto)
```

### Backend Endpoints Disponíveis
```
✅ POST   /auth/login
✅ POST   /auth/register
✅ POST   /auth/refresh
✅ GET    /auth/profile

✅ GET    /usuarios
✅ POST   /usuarios
✅ GET    /usuarios/:id
✅ PATCH  /usuarios/:id
✅ DELETE /usuarios/:id

✅ GET    /disciplinas
✅ POST   /disciplinas
✅ GET    /disciplinas/:id
✅ PATCH  /disciplinas/:id
✅ DELETE /disciplinas/:id

✅ GET    /turmas
✅ POST   /turmas
✅ GET    /turmas/:id
✅ PATCH  /turmas/:id
✅ DELETE /turmas/:id

✅ GET    /aulas
✅ POST   /aulas
✅ GET    /aulas/:id
✅ PATCH  /aulas/:id
✅ DELETE /aulas/:id
⚠️  POST  /aulas/:id/abrir    (existe mas precisa validar)
⚠️  POST  /aulas/:id/fechar   (existe mas precisa validar)

✅ GET    /presencas
✅ POST   /presencas
✅ GET    /presencas/:lessonId/:userId
✅ PATCH  /presencas/:lessonId/:userId
✅ DELETE /presencas/:lessonId/:userId
```

---

## 🎉 CONCLUSÃO

**Estamos em excelente posição!**

✅ **Backend 100% pronto**  
✅ **Infraestrutura frontend sólida**  
✅ **Design system estabelecido**  
✅ **Autenticação multi-role funcionando**  
✅ **Admin CRUD quase completo**

**Faltam principalmente:**
- Features de Aluno (registro de presença, detalhes)
- Features de Professor (abrir aula, tempo real, manual)
- Perfil compartilhado
- Polimentos e testes

**Tempo estimado restante:** 4-6 semanas (3 sprints) para MVP completo.

---

**Documento gerado por:** GitHub Copilot  
**Data:** 03/10/2025  
**Versão:** 1.0 - Análise do Ponto de Partida
