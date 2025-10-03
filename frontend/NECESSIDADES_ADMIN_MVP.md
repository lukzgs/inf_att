# Necessidades do Administrador - MVP Simplificado
## Sistema de Registro de Presença Acadêmica

**Data:** 02/10/2025  
**Foco:** Sistema simples para alunos registrarem presença rapidamente  
**Contexto:** Um curso da UFRGS, com possibilidade de expansão futura

---

## 🎯 Objetivo Principal

**Permitir que alunos marquem presença em aula de forma rápida e professores acompanhem a frequência.**

---

## 📋 Funcionalidades Essenciais (MVP)

### 1. Gestão de Usuários Básica

#### 1.1 CRUD de Usuários
- ✅ **Criar usuários** manualmente (admin, professor, aluno)
- ✅ **Editar informações básicas** (nome, email, matrícula)
- ✅ **Ativar/Desativar contas**
- ✅ **Visualizar lista de usuários** com busca simples
- ⚠️ **Importação CSV** (opcional, mas recomendado)

#### 1.2 Gerenciamento de Roles
- ✅ **Atribuir roles** (ADMIN, PROFESSOR, STUDENT)
- ✅ **Visualizar quem tem cada role**
- ❌ Roles customizadas (não necessário no MVP)

---

### 2. Gestão Acadêmica Simplificada

#### 2.1 Cursos
- ✅ **CRUD de cursos** (nome, código)
- ✅ **Listar cursos ativos**
- ❌ Grade curricular detalhada (não necessário agora)

#### 2.2 Disciplinas
- ✅ **CRUD de disciplinas** (código, nome, carga horária)
- ✅ **Vincular disciplinas a um curso**
- ❌ Pré-requisitos (adicionar depois se necessário)

#### 2.3 Turmas
- ✅ **Criar turmas** (disciplina, professor, semestre, ano)
- ✅ **Adicionar/Remover alunos** da turma
- ✅ **Visualizar lista de alunos** por turma
- ⚠️ **Clonar turmas** de semestre anterior (útil, mas não crítico)
- ❌ Alocação de salas (não necessário)
- ❌ Conflitos de horário (pode adicionar depois)

#### 2.4 Aulas
- ✅ **Criar aulas** (data, horário início/fim)
- ✅ **Abrir/Fechar aula** para registro de presença
- ✅ **Listar aulas** de uma turma
- ❌ Conteúdo programático (não necessário)
- ❌ Reposições complexas (só criar nova aula)

#### 2.5 Registro de Presença
- ✅ **Aluno registra sua própria presença** (via código/QR/link)
- ✅ **Professor registra presença manualmente** (se necessário)
- ✅ **Visualizar lista de presença** por aula
- ✅ **Editar presença** (admin/professor) com justificativa
- ❌ Justificativas de falta elaboradas (simplificar)

---

### 3. Dashboard e Visualizações

#### 3.1 Dashboard do Admin
- ✅ **Estatísticas básicas** (total de usuários, turmas ativas, cursos)
- ✅ **Ações rápidas** (criar usuário, criar turma, ver todas as turmas)
- ❌ Gráficos complexos (adicionar gradualmente)

#### 3.2 Dashboard do Professor
- ✅ **Minhas turmas**
- ✅ **Próximas aulas**
- ✅ **Registrar presença rapidamente**
- ✅ **Ver frequência da turma**

#### 3.3 Dashboard do Aluno
- ✅ **Minhas disciplinas**
- ✅ **Minha frequência** (porcentagem por disciplina)
- ✅ **Próximas aulas**
- ✅ **Marcar presença** (quando aula estiver aberta)

---

### 4. Relatórios Simples

- ✅ **Relatório de frequência por turma** (lista com %)
- ✅ **Relatório individual do aluno** (frequência em cada disciplina)
- ✅ **Exportar para Excel/CSV**
- ❌ Relatórios complexos (análise preditiva, etc.)

---

### 5. Configurações Básicas

- ✅ **Definir porcentagem mínima de presença** (ex: 75%)
- ✅ **Configurar semestre atual** (ano, semestre)
- ❌ Calendário acadêmico completo (não essencial)
- ❌ Notificações automáticas (pode adicionar depois)

---

### 6. Segurança Essencial

- ✅ **Autenticação JWT** (já implementado)
- ✅ **Roles e permissões básicas** (já implementado)
- ✅ **Logs de ações críticas** (quem editou presença, etc.)
- ❌ 2FA (não necessário no MVP)
- ❌ Auditoria completa (simplificar)

---

## 🚀 Fluxo de Uso Ideal

### Fluxo do Aluno (Principal)
1. **Login** no sistema
2. **Ver dashboard** com disciplinas e frequência atual
3. **Aula começa** → Professor abre a aula para registro
4. **Aluno clica** "Registrar Presença" (ou escaneia QR code)
5. **Presença registrada** ✅
6. **Aluno visualiza** sua frequência atualizada

### Fluxo do Professor
1. **Login** no sistema
2. **Ver dashboard** com próximas aulas
3. **Antes da aula** → Abrir aula para registro
4. **Durante/Após aula** → Ver quem registrou presença
5. **Fechar aula** (opcional, pode ter tempo limite automático)
6. **Visualizar relatório** de frequência da turma

### Fluxo do Admin
1. **Login** no sistema
2. **Dashboard** com visão geral (usuários, turmas, cursos)
3. **Criar/Editar** usuários, cursos, disciplinas, turmas
4. **Visualizar relatórios** gerais
5. **Corrigir presenças** quando necessário (com justificativa)

---

## 📊 Estrutura de Dados Simplificada

### Entidades Principais
```
User (Usuário)
├── id, name, email, matricula
├── isActive
└── roles[] (ADMIN, PROFESSOR, STUDENT)

Course (Curso)
├── id, name, code
└── isActive

Subject (Disciplina)
├── id, name, code, workload
└── courseId

Class (Turma)
├── id, code, year, semester
├── subjectId, professorId
└── students[] (many-to-many com User)

Lesson (Aula)
├── id, date, startTime, endTime
├── classId
├── isOpen (permite registro de presença)
└── closedAt

Attendance (Presença)
├── id, userId, lessonId
├── present (boolean)
├── registeredAt
└── editedBy, editReason (se foi corrigida)
```

---

## 🎯 Prioridade de Implementação

### Sprint 1 - Core (2-3 semanas)
1. ✅ CRUD de Usuários (com roles)
2. ✅ CRUD de Cursos
3. ✅ CRUD de Disciplinas
4. ✅ CRUD de Turmas (com vínculo aluno-turma)

### Sprint 2 - Presença (2-3 semanas)
5. ✅ CRUD de Aulas
6. ✅ Sistema de registro de presença (aluno)
7. ✅ Abrir/Fechar aula (professor)
8. ✅ Visualizar lista de presença por aula

### Sprint 3 - Dashboards (2 semanas)
9. ✅ Dashboard Admin (estatísticas + ações rápidas)
10. ✅ Dashboard Professor (turmas + próximas aulas)
11. ✅ Dashboard Aluno (disciplinas + frequência)

### Sprint 4 - Relatórios (1-2 semanas)
12. ✅ Relatório de frequência por turma
13. ✅ Relatório individual do aluno
14. ✅ Exportação CSV/Excel

### Sprint 5 - Polimento (1-2 semanas)
15. ✅ Edição de presença (admin/professor)
16. ✅ Logs de auditoria básicos
17. ✅ Configurações globais (% mínima, semestre atual)
18. ✅ Melhorias de UX e responsividade

**Total Estimado:** 8-12 semanas (2-3 meses) para MVP funcional

---

## 🔮 Funcionalidades Futuras (Backlog)

### Fase 2 - Melhorias (após MVP validado)
- **QR Code** para registro de presença (mais rápido)
- **Notificações** (email quando frequência < 75%)
- **Importação CSV** de alunos e disciplinas
- **Justificativas de falta** (aluno envia, professor aprova)
- **Gráficos** de frequência no dashboard
- **Clonagem de turmas** de semestre anterior
- **Histórico completo** de alterações (auditoria)

### Fase 3 - Expansão Multi-Curso
- **Hierarquia** Instituto > Departamento > Curso
- **Role "Coordenador"** com permissões intermediárias
- **Isolamento de dados** por curso
- **Disciplinas compartilhadas** entre cursos
- **Assistente de onboarding** para novos cursos

### Fase 4 - Integrações
- **SSO** da universidade
- **API REST** para integrações externas
- **Exportação para sistema de notas** da UFRGS
- **Sincronização com Moodle/Google Classroom**

---

## 💡 Decisões de Design Simplificadas

### O que NÃO fazer agora
❌ **Sistema de tickets/suporte** → Usar email simples  
❌ **Calendário acadêmico completo** → Só semestre atual  
❌ **Backup automático** → Backup manual por enquanto  
❌ **Análise preditiva** → Relatórios simples bastam  
❌ **Notificações push** → Email basta inicialmente  
❌ **Pré-requisitos de disciplinas** → Adicionar se necessário  
❌ **Alocação de salas** → Professor informa manualmente  
❌ **Conflitos de horário** → Detectar visualmente depois  

### O que priorizar
✅ **Velocidade** → Aluno marca presença em < 10 segundos  
✅ **Simplicidade** → Interface clara e objetiva  
✅ **Confiabilidade** → Presença registrada não pode ser perdida  
✅ **Relatórios básicos** → Professor vê frequência facilmente  
✅ **Responsividade** → Funciona bem em mobile  

---

## 📱 Requisitos de UX

### Para o Aluno
- 🎯 **Marcar presença deve ser RÁPIDO** (máximo 3 cliques)
- 🎯 **Ver frequência atual** de forma clara (%)
- 🎯 **Saber se está em risco** (< 75% → alerta vermelho)
- 🎯 **Mobile-first** (maioria vai usar celular)

### Para o Professor
- 🎯 **Abrir aula** com 1-2 cliques
- 🎯 **Ver quem está presente** em tempo real
- 🎯 **Gerar relatório** de frequência facilmente
- 🎯 **Corrigir presença** quando necessário (aluno esqueceu de marcar)

### Para o Admin
- 🎯 **Criar turmas rapidamente** (no início do semestre)
- 🎯 **Visualizar estatísticas gerais** (quantos usuários, turmas, etc.)
- 🎯 **Resolver problemas** (editar presenças, gerenciar usuários)

---

## ✅ Critérios de Sucesso do MVP

1. **Aluno consegue marcar presença em < 10 segundos**
2. **Professor consegue ver frequência da turma em tempo real**
3. **Admin consegue criar turma completa em < 5 minutos**
4. **Relatórios exportados são precisos e legíveis**
5. **Sistema funciona bem em mobile (80% dos acessos)**
6. **Sem bugs críticos** (presença perdida, login quebrado, etc.)

---

## 🎨 Melhorias de Design Necessárias

### Baseado no feedback atual
1. **Dashboards mais informativos** (menos "empty states")
2. **Cards com dados reais** (não apenas mockados)
3. **Navegação mais clara** (menos cliques para ações comuns)
4. **Feedback visual** (toasts estão bons, mas podem melhorar)
5. **Estados de loading** (skeletons enquanto carrega dados)
6. **Empty states úteis** (com CTAs claros)

---

## 📝 Próximos Passos Imediatos

### Agora (Hoje/Esta Semana)
1. **Revisar AdminDashboard** com dados/ações reais (não mockados)
2. **Implementar páginas de CRUD** (Users, Courses, Subjects, Classes)
3. **Aplicar design system** consistente em todas as páginas
4. **Melhorar navegação** (sidebar com links corretos)

### Próxima Sprint
5. **Implementar fluxo de presença** (criar aula, abrir, registrar)
6. **Criar página de relatórios** básicos
7. **Testar com usuários reais** (coordenador, professores, alunos)
8. **Iterar baseado no feedback**

---

**Documento criado por:** GitHub Copilot  
**Data:** 02/10/2025  
**Versão:** 2.0 - MVP Simplificado  
**Estimativa Total:** 2-3 meses para MVP funcional
