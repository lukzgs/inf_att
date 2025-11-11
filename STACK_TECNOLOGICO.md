# Stack Tecnológico - inf_att

Análise detalhista das tecnologias utilizadas em todas as camadas da aplicação.

---

## 📊 VISÃO GERAL

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
│  React 19 + TypeScript + Vite + TailwindCSS + DaisyUI       │
├─────────────────────────────────────────────────────────────┤
│                 API REST (HTTP/Axios)                       │
├─────────────────────────────────────────────────────────────┤
│                   BACKEND (NestJS)                          │
│  NestJS 11 + Express + Prisma ORM + TypeScript              │
├─────────────────────────────────────────────────────────────┤
│                    DATABASE (PostgreSQL)                    │
│       PostgreSQL 18 + Prisma Migrations                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE (INFRAESTRUTURA)

### PostgreSQL 18
- **Versão**: PostgreSQL 18 (Latest)
- **Timezone**: America/Sao_Paulo
- **Porta**: 5433 (local) → 5432 (container)
- **Credenciais**: user/password
- **Banco**: inf_att_db
- **Containerização**: Docker
- **Persistência**: Volume `pgdata` (armazenamento persistente)

### Schema Prisma
**Models Principais:**

| Model | Tabela SQL | Descrição |
|-------|-----------|-----------|
| User | usuarios | Usuários do sistema com roles |
| Role | cargo | Papéis: USER, ADMIN, PROFESSOR |
| UserRole | usuarios_cargos | Relação muitos-para-muitos User-Role |
| Course | cursos | Cursos (ex: Engenharia de Software) |
| Curriculum | grades_curriculares | Currículos de cursos |
| Subject | disciplinas | Disciplinas/matérias |
| CurriculumSubject | curriculo_disciplinas | Vínculo Currículo-Disciplina |
| Class | turmas | Turmas (instâncias de disciplinas) |
| Lesson | aulas | Aulas com data/hora e controle de abertura |
| UserClass | usuarios_turmas | Vínculo aluno/professor-turma |
| Attendance | presencas | Registro de presença com auditoria |
| RefreshToken | refresh_tokens | Tokens JWT refresh para autenticação |

### Campos Importantes
- **Lesson.date**: DATE (sem hora)
- **Lesson.startTime**: DATETIME (armazena HH:mm)
- **Lesson.endTime**: DATETIME (armazena HH:mm)
- **Attendance**: Suporta auditoria (editedBy, editedAt, editReason)
- **Timezone**: PostgreSQL configurado com `PGTZ=America/Sao_Paulo`

---

## 🔧 BACKEND (NestJS)

### Framework & Versão
- **NestJS**: 11.0.1
- **Node Runtime**: v22.10.7
- **TypeScript**: 5.7.3
- **Runtime**: Express (plataforma padrão)

### Dependências Principais

#### Core NestJS
```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/config": "^4.0.2",
  "@nestjs/schedule": "^6.0.1",
  "@nestjs/swagger": "^11.2.0",
  "@nestjs/mapped-types": "^2.1.0"
}
```

#### Banco de Dados & ORM
```json
{
  "@prisma/client": "^6.16.1",    // Prisma ORM
  "prisma": "^6.16.3"              // Prisma CLI
}
```

#### Autenticação & Segurança
```json
{
  "passport-jwt": "^4.0.1",         // Estratégia JWT
  "bcrypt": "^6.0.0",               // Hash de senhas
  "@types/passport-jwt": "^4.0.1"
}
```

#### Validação & Transformação
```json
{
  "class-validator": "^0.14.2",     // Validação via decoradores
  "class-transformer": "^0.5.1"     // Transformação de DTOs
}
```

#### Utilidades
```json
{
  "rxjs": "^7.8.1",                 // Programação reativa
  "reflect-metadata": "^0.2.2",     // Metadados para decoradores
  "glob": "^11.0.3",                // Pattern matching de arquivos
  "swagger-ui-express": "^5.0.1"   // Documentação Swagger
}
```

### Dependências Dev
```json
{
  "@nestjs/cli": "^11.0.0",
  "@nestjs/schematics": "^11.0.0",
  "@nestjs/testing": "^11.0.1",
  "jest": "^30.0.0",
  "ts-jest": "^29.4.1",
  "ts-node": "^10.9.2",
  "@types/jest": "^30.0.0",
  "supertest": "^7.0.0",            // Testes HTTP
  "eslint": "^9.18.0",
  "prettier": "^3.4.2",
  "@typescript-eslint/eslint-plugin": "^8.20.0"
}
```

### Arquitetura
- **Pattern**: MVC com Modules, Controllers, Services
- **API**: REST com Swagger/OpenAPI
- **Autenticação**: JWT (access token + refresh token)
- **Autorização**: Roles (USER, ADMIN, PROFESSOR)
- **Validação**: class-validator com DTOs
- **ORM**: Prisma (com migrations automáticas)

### Scripts
```bash
npm run start          # Execução normal
npm run start:dev      # Watch mode
npm run start:debug    # Debug mode
npm run start:prod     # Produção
npm run build          # Build TypeScript
npm run test           # Testes Jest
npm run test:e2e       # Testes E2E
npm run lint           # ESLint + Auto-fix
npm run seed           # Seed database
npm run studio         # Prisma Studio GUI
```

---

## ⚛️ FRONTEND (React + Vite)

### Framework & Versão
- **React**: 19.1.1
- **TypeScript**: ~5.8.3
- **Vite**: 7.1.2 (bundler)
- **Node**: v22.x

### Dependências Principais

#### UI & Componentes
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.1",     // Roteamento
  "react-icons": "^5.5.0",           // Ícones SVG
  "daisyui": "^5.1.14",              // Componentes UI
  "tailwindcss": "^3.4.17"           // Utility CSS
}
```

#### Formulários & Validação
```json
{
  "react-hook-form": "^7.63.0",      // Gerenciamento de forms
  "@hookform/resolvers": "^5.2.2",   // Resolvers para validação
  "zod": "^4.1.11",                  // Validação com schemas
  "class-variance-authority": "^0.7.1", // Variantes CSS
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-slot": "^1.2.3"
}
```

#### Data & Requisições
```json
{
  "@tanstack/react-query": "^5.89.0", // Cache & estado de dados
  "axios": "^1.12.2",                 // Cliente HTTP
  "react-datepicker": "^8.7.0",       // Seletor de data
  "@types/react-datepicker": "^6.2.0"
}
```

#### Visualização & Relatórios
```json
{
  "recharts": "^3.2.1",               // Gráficos
  "jspdf": "^3.0.3",                  // Geração de PDFs
  "sonner": "^2.0.7"                  // Notificações Toast
}
```

#### Utilidades
```json
{
  "clsx": "^2.1.1",                   // Concatenação de classes
  "tailwind-merge": "^3.3.1",         // Merge classes TailwindCSS
  "tailwindcss-animate": "^1.0.7"     // Animações Tailwind
}
```

### Dependências Dev
```json
{
  "@vitejs/plugin-react-swc": "^4.0.0", // SWC transpiler (rápido)
  "@types/node": "^24.6.2",
  "@types/react": "^19.1.10",
  "@types/react-dom": "^19.1.7",
  "autoprefixer": "^10.4.21",         // PostCSS
  "postcss": "^8.5.6",                // Processador CSS
  "eslint": "^9.33.0",
  "typescript": "~5.8.3"
}
```

### Stack CSS
- **TailwindCSS 3.4.17**: Utility-first CSS framework
- **DaisyUI 5.1.14**: Componentes built-in para Tailwind
- **PostCSS 8.5.6**: Processador CSS
- **Autoprefixer**: Prefixos automáticos

### Arquitetura
- **Type**: Module (ES6)
- **Build**: Vite com SWC (transpilação rápida)
- **Bundler**: Vite (muito mais rápido que Webpack)
- **Roteamento**: React Router v7
- **Estado**: React Query (TanStack Query)
- **Formulários**: React Hook Form + Zod
- **Estilo**: TailwindCSS + DaisyUI

### Scripts
```bash
npm run dev      # Servidor dev na porta 5173
npm run build    # Build otimizado para produção
npm run preview  # Preview do build
npm run lint     # ESLint
```

---

## 🐳 INFRAESTRUTURA (Docker)

### Docker Compose
```yaml
Services:
  ├─ backend (NestJS)
  │  └─ Porta 3000 → 3000
  │  └─ Build: ./backend/Dockerfile
  │  └─ Watch Mode habilitado
  │
  ├─ frontend (React/Vite)
  │  └─ Porta 5173 → 8080 (local)
  │  └─ Build: ./frontend/Dockerfile (multi-stage)
  │  └─ Dev Server
  │
  └─ db (PostgreSQL)
     └─ Porta 5432 → 5433 (local)
     └─ Timezone: America/Sao_Paulo
     └─ Volume persistente: pgdata
```

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://user:password@db:5432/inf_att_db?schema=public
PGTZ=America/Sao_Paulo
```

---

## 📦 RESUMO DE VERSÕES CRÍTICAS

| Tecnologia | Versão | Tipo |
|-----------|--------|------|
| Node.js | 22.x | Runtime |
| TypeScript | 5.7-5.8 | Linguagem |
| NestJS | 11.0 | Backend Framework |
| React | 19.1 | Frontend Framework |
| Vite | 7.1 | Bundler |
| Prisma | 6.16 | ORM |
| PostgreSQL | 18 | Database |
| TailwindCSS | 3.4 | CSS Framework |
| Jest | 30.0 | Testing |
| ESLint | 9.18 | Linting |

---

## 🔐 AUTENTICAÇÃO & SEGURANÇA

### Backend
- **JWT**: @nestjs/jwt com Passport strategy
- **Senhas**: Bcrypt (hash com salt)
- **Refresh Tokens**: Stored em DB com revogação
- **CORS**: Configurável via @nestjs/config
- **Validação**: class-validator com DTOs

### Frontend
- **Token Storage**: localStorage (access + refresh)
- **Interceptors**: Axios para auto-refresh de tokens
- **Context API**: AuthContext para estado global
- **Routes**: Protected routes com verificação de roles

---

## 🧪 TESTES

### Backend
- **Framework**: Jest 30.0
- **E2E**: supertest 7.0
- **Coverage**: Built-in Jest coverage
- **Scripts**: 
  - `npm run test` - Unit tests
  - `npm run test:e2e` - E2E tests
  - `npm run test:cov` - Com coverage

### Frontend
- **Framework**: Não configurado (sem package.json com test runner)

---

## 📈 PERFORMANCE

### Frontend Otimizações
- **SWC Transpiler**: ~10x mais rápido que Babel
- **Vite**: Hot Module Replacement (HMR) rápido
- **React Query**: Caching inteligente de dados
- **Tree-shaking**: Remoção de código não utilizado
- **Lazy Loading**: Code splitting automático

### Backend Otimizações
- **NestJS**: Compilação TypeScript otimizada
- **Prisma**: Geração automática de queries eficientes
- **Class-validator**: Validação decoradores (zero runtime)
- **rxjs**: Programação reativa para melhor throughput

---

## 📝 CONCLUSÃO

Esta é uma **aplicação moderna e profissional** com:
- ✅ Stack atualizado (Node 22, React 19, NestJS 11)
- ✅ Type-safe em toda a aplicação (TypeScript)
- ✅ Arquitetura escalável (NestJS modules, Prisma ORM)
- ✅ Interface moderna (React 19 + Tailwind + DaisyUI)
- ✅ Performance otimizada (Vite + SWC)
- ✅ Infraestrutura containerizada (Docker)
- ✅ Segurança implementada (JWT, Bcrypt, validação)
- ✅ Testes automatizados (Jest, supertest)
