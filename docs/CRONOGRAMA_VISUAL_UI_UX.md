# 📅 Cronograma Visual - Melhorias UI/UX

**Projeto:** INF Attendance - Unificação de Design System  
**Duração Total:** 4 semanas (20 dias úteis)  
**Período:** 07/10/2025 - 01/11/2025  
**Status:** 🔵 Planejamento

---

## 🗓️ Calendário Semanal

```
┌─────────────────────────────────────────────────────────────────────┐
│                        OUTUBRO/NOVEMBRO 2025                         │
├─────────────────────────────────────────────────────────────────────┤
│  SEG    TER    QUA    QUI    SEX    SÁB    DOM                      │
├─────────────────────────────────────────────────────────────────────┤
│  06     07*    08     09     10     11     12      ← SEMANA 1       │
│        🔴1.1  🔴1.1  🔴1.2  🔴1.2  🔴1.3           FUNDAÇÕES        │
│        Cores  Cores  Tipo   Tipo   Comp.                            │
│                                                                      │
│  13     14     15     16     17     18     19      ← SEMANA 2       │
│        🟡2.1  🟡2.1  🟡2.2  🟡2.2  🟡2.3           COMPONENTES      │
│        Pág.   Pág.   Cards  Cards  Feed.                            │
│                                                                      │
│  20     21     22     23     24     25     26      ← SEMANA 3       │
│        🟢3.1  🟢3.1  🟢3.2  🟢3.2  🟢3.3           RESPONSIVE+A11Y   │
│        Mobile Mobile A11y   A11y   Empty                            │
│                                                                      │
│  27     28     29     30     31     01     02      ← SEMANA 4       │
│        🔵4.1  🔵4.1  🔵4.2  🔵4.3  🔵4.4           VALIDAÇÃO        │
│        Cross  Cross  Audit  Docs   Deploy                           │
│                                                                      │
│  * Início: 07/10/2025 às 09:00                                      │
│  * Entrega: 01/11/2025 às 18:00                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Gantt Chart Simplificado

```
TAREFA                    │ S1  │ S2  │ S3  │ S4  │ STATUS
──────────────────────────┼─────┼─────┼─────┼─────┼─────────
1. FUNDAÇÕES              │     │     │     │     │
├─ 1.1 Cores & Tema       │█████│     │     │     │ 🔴 CRÍTICO
├─ 1.2 Tipografia         │  ███│██   │     │     │ 🔴 CRÍTICO
└─ 1.3 Componentes Base   │     │█    │     │     │ 🔴 CRÍTICO
                          │     │     │     │     │
2. COMPONENTES            │     │     │     │     │
├─ 2.1 Páginas Críticas   │     │████ │     │     │ 🟡 ALTA
├─ 2.2 Cards & Layouts    │     │  ███│██   │     │ 🟡 ALTA
└─ 2.3 Feedback Visual    │     │     │█    │     │ 🟡 ALTA
                          │     │     │     │     │
3. RESPONSIVIDADE         │     │     │     │     │
├─ 3.1 Mobile Adjustments │     │     │████ │     │ 🟢 MÉDIA
├─ 3.2 Acessibilidade     │     │     │  ███│██   │ 🟢 MÉDIA
└─ 3.3 Empty States       │     │     │     │█    │ 🟢 MÉDIA
                          │     │     │     │     │
4. VALIDAÇÃO              │     │     │     │     │
├─ 4.1 Cross-Browser      │     │     │     │████ │ 🔵 VALIDAÇÃO
├─ 4.2 Auditoria A11y     │     │     │     │  ██ │ 🔵 VALIDAÇÃO
├─ 4.3 Documentação       │     │     │     │   █ │ 🔵 DOC
└─ 4.4 Deploy             │     │     │     │    █│ 🔵 ENTREGA
──────────────────────────┴─────┴─────┴─────┴─────┴─────────
                          07/10 14/10 21/10 28/10
```

**Legenda:**
- `█` = Dia de trabalho ativo
- `🔴` = Prioridade CRÍTICA (bloqueante)
- `🟡` = Prioridade ALTA (importante)
- `🟢` = Prioridade MÉDIA (refinamento)
- `🔵` = Validação/Documentação

---

## 🎯 Marcos (Milestones)

```
┌────────────────────────────────────────────────────────────┐
│  M1: Design System Base Completo                          │
│  📅 11/10/2025 (Fim da Semana 1)                           │
│  ✅ Cores, tipografia e componentes base padronizados      │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│  M2: Páginas Principais Refatoradas                        │
│  📅 18/10/2025 (Fim da Semana 2)                           │
│  ✅ Login, Dashboard, Admin usando novo design             │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│  M3: Mobile & A11y Compliance                              │
│  📅 25/10/2025 (Fim da Semana 3)                           │
│  ✅ Funcional em 320px+, WCAG AA compliant                 │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│  M4: Produção com Lighthouse >90                           │
│  📅 01/11/2025 (Deploy Final)                              │
│  ✅ Deploy completo, documentado e monitorado              │
└────────────────────────────────────────────────────────────┘
```

---

## 📈 Progresso por Categoria

### Design Tokens (Semana 1)
```
Cores          [####################] 100% (Sprint 1.1)
Tipografia     [####################] 100% (Sprint 1.2)
Spacing        [####################] 100% (Sprint 1.2)
Shadows        [####################] 100% (Sprint 1.2)
Transitions    [####################] 100% (Sprint 1.2)
```

### Componentes (Semana 1-2)
```
Button         [####################] 100% (Sprint 1.3)
Input          [####################] 100% (Sprint 1.3)
Card           [####################] 100% (Sprint 1.3 + 2.2)
Typography     [####################] 100% (Sprint 1.2)
Table          [####################] 100% (Sprint 2.2)
Toast          [####################] 100% (Sprint 2.3)
Skeleton       [####################] 100% (Sprint 2.3)
EmptyState     [####################] 100% (Sprint 2.3 + 3.3)
```

### Páginas (Semana 2)
```
LoginPage            [####################] 100% (Sprint 2.1)
DashboardPage        [####################] 100% (Sprint 2.1)
AdminDashboard       [####################] 100% (Sprint 2.1)
ProfessorDashboard   [####################] 100% (Sprint 2.1)
StudentDashboard     [####################] 100% (Sprint 2.1)
CoursePages          [####################] 100% (Sprint 2.1)
```

### Responsividade (Semana 3)
```
320px (Mobile S)     [####################] 100% (Sprint 3.1)
640px (Mobile)       [####################] 100% (Sprint 3.1)
768px (Tablet)       [####################] 100% (Sprint 3.1)
1024px (Desktop)     [####################] 100% (Sprint 3.1)
1920px (Large)       [####################] 100% (Sprint 3.1)
```

### Acessibilidade (Semana 3-4)
```
ARIA Labels          [####################] 100% (Sprint 3.2)
Keyboard Nav         [####################] 100% (Sprint 3.2)
Focus States         [####################] 100% (Sprint 3.2)
Color Contrast       [####################] 100% (Sprint 3.2)
Screen Readers       [####################] 100% (Sprint 4.2)
```

### Qualidade (Semana 4)
```
Cross-Browser        [####################] 100% (Sprint 4.1)
Lighthouse Perf      [####################] 100% (Sprint 4.1)
Lighthouse A11y      [####################] 100% (Sprint 4.2)
Documentation        [####################] 100% (Sprint 4.3)
```

---

## 🔄 Fluxo de Trabalho Diário

### Template de Daily Standup
```
🌅 MORNING (09:00 - 09:15)
├─ Sprint atual: [Sprint X.Y]
├─ Tarefas do dia: [Lista de tarefas]
├─ Blockers: [Nenhum / Lista]
└─ Recursos necessários: [Nenhum / Lista]

🏗️ DESENVOLVIMENTO (09:15 - 17:00)
├─ Coding: [6h]
├─ Code Review: [1h]
├─ Testing: [1h]
└─ Documentation: [30min]

🌙 END OF DAY (17:00 - 17:30)
├─ Tarefas completadas: [Lista]
├─ PRs abertos: [Links]
├─ Blockers para amanhã: [Lista]
└─ Update no checklist: [✅/⬜]
```

---

## 📊 Distribuição de Esforço

### Por Semana (em horas)
```
┌──────────────────────────────────────────────────┐
│  SEMANA 1: 40h (5 dias × 8h)                     │
│  ████████████████ Desenvolvimento (60%) - 24h    │
│  ████████ Code Review (20%) - 8h                 │
│  ████ Testing (10%) - 4h                         │
│  ████ Documentação (10%) - 4h                    │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  SEMANA 2: 40h (5 dias × 8h)                     │
│  ██████████████████ Desenvolvimento (70%) - 28h  │
│  ██████ Code Review (15%) - 6h                   │
│  ████ Testing (10%) - 4h                         │
│  ██ Documentação (5%) - 2h                       │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  SEMANA 3: 40h (5 dias × 8h)                     │
│  ████████████ Desenvolvimento (50%) - 20h        │
│  ████ Code Review (10%) - 4h                     │
│  ████████████ Testing (30%) - 12h                │
│  ████ Documentação (10%) - 4h                    │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  SEMANA 4: 40h (5 dias × 8h)                     │
│  ████ Desenvolvimento (10%) - 4h                 │
│  ████ Code Review (10%) - 4h                     │
│  ████████████████ Testing (40%) - 16h            │
│  ████████████████ Documentação (40%) - 16h       │
└──────────────────────────────────────────────────┘
```

### Por Atividade (Total: 160h)
```
Desenvolvimento    ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 76h (47.5%)
Testing            ↓↓↓↓↓↓↓↓↓ 36h (22.5%)
Code Review        ↓↓↓↓↓ 22h (13.75%)
Documentação       ↓↓↓↓↓ 26h (16.25%)
```

---

## 🚦 Sistema de Semáforo

### Status por Sprint (atualizar diariamente)

```
┌─────────────────────────────────────────────────┐
│  Sprint 1.1: Cores & Tema                       │
│  Status: 🟢 ON TRACK                            │
│  Progresso: [████████──] 80%                    │
│  ETA: 08/10/2025                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Sprint 1.2: Tipografia                         │
│  Status: 🟢 ON TRACK                            │
│  Progresso: [──────────] 0%                     │
│  ETA: 10/10/2025                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Sprint 1.3: Componentes Base                   │
│  Status: ⚪ NOT STARTED                         │
│  Progresso: [──────────] 0%                     │
│  ETA: 11/10/2025                                │
└─────────────────────────────────────────────────┘
```

**Legenda:**
- 🟢 **ON TRACK** - No prazo, sem blockers
- 🟡 **AT RISK** - Pequenos atrasos ou blockers menores
- 🔴 **DELAYED** - Atrasado, requer atenção imediata
- ⚪ **NOT STARTED** - Ainda não iniciado

---

## 📋 Checklist Semanal (Quick Reference)

### ✅ Semana 1: Fundações
```
[ ] Sprint 1.1: Cores & Tema DaisyUI
    [ ] Paleta institucional definida
    [ ] Tema light configurado
    [ ] Tema dark configurado
    [ ] Contraste WCAG validado
    [ ] Documentação de cores

[ ] Sprint 1.2: Tipografia & Tokens
    [ ] constants/typography.ts criado
    [ ] Hierarquia definida (display, h1-h5, body)
    [ ] Design tokens consolidados
    [ ] Componentes de tipografia

[ ] Sprint 1.3: Componentes Base
    [ ] Button refatorado (DaisyUI only)
    [ ] Input refatorado
    [ ] Card unificado
    [ ] Testes unitários
```

### ✅ Semana 2: Componentes
```
[ ] Sprint 2.1: Páginas Críticas
    [ ] LoginPage refatorada
    [ ] DashboardPage refatorada
    [ ] AdminDashboard refatorada
    [ ] ProfessorDashboard refatorada
    [ ] StudentDashboard refatorada
    [ ] Screenshots antes/depois

[ ] Sprint 2.2: Cards & Layouts
    [ ] Card component definitivo
    [ ] ResponsiveTable implementada
    [ ] Grid utilities criados
    [ ] Testes em 5 breakpoints

[ ] Sprint 2.3: Feedback Visual
    [ ] lib/toast.ts criado
    [ ] Toasts em todas mutations
    [ ] Skeletons implementados
    [ ] EmptyState component
```

### ✅ Semana 3: Responsividade + A11y
```
[ ] Sprint 3.1: Mobile-First
    [ ] Sidebar mobile otimizada
    [ ] Padding/spacing ajustados
    [ ] Tabelas com scroll horizontal
    [ ] Testes em devices reais

[ ] Sprint 3.2: Acessibilidade
    [ ] ARIA labels adicionados
    [ ] Estados de foco visíveis
    [ ] Skip to content
    [ ] prefers-reduced-motion
    [ ] Navegação por teclado
    [ ] Auditoria axe DevTools

[ ] Sprint 3.3: Estados & Erros
    [ ] EmptyState library
    [ ] Error boundaries
    [ ] Mensagens de erro melhoradas
    [ ] ConfirmDialog component
```

### ✅ Semana 4: Validação
```
[ ] Sprint 4.1: Cross-Browser & Performance
    [ ] Testes em Chrome, Firefox, Safari, Edge
    [ ] Lighthouse audit (scores >90)
    [ ] Bundle size otimizado
    [ ] Core Web Vitals

[ ] Sprint 4.2: Auditoria A11y
    [ ] WCAG 2.1 Level AA compliance
    [ ] Testes com screen readers
    [ ] Relatório de conformidade

[ ] Sprint 4.3: Documentação
    [ ] DESIGN_SYSTEM_GUIDE.md atualizado
    [ ] /style-guide página criada
    [ ] Migration guide

[ ] Sprint 4.4: Deploy
    [ ] Code review final
    [ ] Testes de regressão
    [ ] Release notes
    [ ] Deploy para produção
```

---

## 🎯 Priorização de Tarefas

### Matriz de Eisenhower

```
┌─────────────────────────┬─────────────────────────┐
│  🔴 URGENTE + IMPORTANTE │  🟡 NÃO URGENTE + IMP   │
│  (Fazer Primeiro)        │  (Agendar)              │
├─────────────────────────┼─────────────────────────┤
│  • Cores & Tema (1.1)    │  • Acessibilidade (3.2) │
│  • Tipografia (1.2)      │  • Cross-browser (4.1)  │
│  • Componentes Base(1.3) │  • Documentação (4.3)   │
│  • Páginas Críticas(2.1) │                         │
├─────────────────────────┼─────────────────────────┤
│  🟢 URGENTE + NÃO IMP    │  ⚪ NÃO URGENTE + NÃO IMP│
│  (Delegar)               │  (Eliminar/Postergar)   │
├─────────────────────────┼─────────────────────────┤
│  • Feedback visual (2.3) │  • Storybook (opcional) │
│  • Mobile ajustes (3.1)  │  • A/B testing          │
│                          │  • Ilustrações SVG      │
└─────────────────────────┴─────────────────────────┘
```

---

## 🔔 Alertas e Notificações

### Lembretes Automáticos
```
📅 Toda Segunda 09:00
   └─ Weekly Planning Meeting

📅 Todo Dia 09:00
   └─ Daily Standup (15min)

📅 Toda Sexta 16:00
   └─ Weekly Retrospective

📅 Fim de cada Sprint
   └─ Sprint Demo & Review
   
📅 3 dias antes de cada Milestone
   └─ Pre-flight checklist
```

### Gates de Qualidade
```
⚠️ Antes de Sprint 2.1
   └─ Garantir Sprint 1.3 100% completo

⚠️ Antes de Sprint 3.2
   └─ Garantir mobile funcional (3.1)

⚠️ Antes de Sprint 4.4
   └─ Lighthouse scores >85 (soft limit)

⚠️ Antes de Deploy
   └─ Aprovação de stakeholders
```

---

## 📞 Comunicação

### Daily Updates
- **Canal:** #ui-ux-improvements (Slack/Discord)
- **Frequência:** Diária (fim do dia)
- **Formato:** 
  ```
  ✅ Hoje: [Lista de tarefas completadas]
  🏗️ Amanhã: [Lista de tarefas planejadas]
  🚧 Blockers: [Nenhum / Lista]
  ```

### Weekly Reports
- **Canal:** Email para stakeholders
- **Frequência:** Sexta-feira às 17:00
- **Formato:** 
  - Progresso da semana (%)
  - Milestones atingidos
  - Riscos identificados
  - Próximos passos

---

## 🎉 Celebrações e Marcos

```
🎈 Milestone 1 (11/10)
   └─ Pizza Friday! 🍕

🎈 Milestone 2 (18/10)
   └─ Team Happy Hour 🍺

🎈 Milestone 3 (25/10)
   └─ Team Lunch 🍔

🎈 Milestone 4 (01/11)
   └─ Launch Party! 🎊
```

---

**Criado em:** 07/10/2025  
**Última Atualização:** 07/10/2025  
**Próxima Revisão:** 14/10/2025

---

## 📥 Download e Exportação

Este cronograma está disponível em:
- ✅ Markdown (este arquivo)
- ✅ PDF (exportar via Pandoc)
- ✅ Google Sheets (importar tabelas)
- ✅ Trello/Jira (importar sprints)
- ✅ GitHub Projects (issues + milestones)

---

**Comando para exportar para PDF:**
```bash
pandoc CRONOGRAMA_VISUAL_UI_UX.md -o cronograma.pdf --pdf-engine=xelatex
```

**Comando para gerar issues do GitHub:**
```bash
# Script bash para criar issues automaticamente
# (Ver docs/scripts/create-github-issues.sh)
```

---

