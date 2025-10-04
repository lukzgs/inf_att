# MVP - Professor | Sistema de Gestão de Presença Acadêmica

**Data:** 03/10/2025  
**Versão:** 1.0 - Minimum Viable Product  
**Prazo estimado:** 6-8 semanas (3-4 sprints)

---

## 🎯 Objetivo do MVP

Permitir que o **professor** possa:
1. ✅ Abrir e fechar aulas (gerar código para alunos)
2. ✅ Ver quem está presente em tempo real
3. ✅ Registrar presença manualmente (chamada)
4. ✅ Visualizar frequência da turma
5. ✅ Gerar relatório básico de frequência

**Métrica de Sucesso:** Professor consegue controlar presença em < 5 minutos por aula (vs. 15-20 min no método manual).

---

## 📋 Funcionalidades Essenciais

### 1. Autenticação
**Tempo: 3 dias**

#### 1.1 Login
- [ ] Tela de login (email + senha)
- [ ] Validação de credenciais
- [ ] Armazenamento de token JWT
- [ ] Logout
- [ ] "Esqueci minha senha" (básico)

**Critérios de Aceitação:**
- Professor consegue fazer login
- Token expira após 24h
- Redirecionamento automático para dashboard

**Telas:** 1 (LoginPage - compartilhada)

---

### 2. Dashboard do Professor
**Tempo: 5 dias**

#### 2.1 Painel Principal
- [ ] Header com nome do professor
- [ ] Card com aulas de hoje
- [ ] Resumo de turmas (total de alunos, média de frequência)
- [ ] Lista de turmas ministradas
- [ ] Botão destacado "Abrir Aula"

**Layout:**
```
┌─────────────────────────────────────┐
│ 👨‍🏫 Prof. João Silva      [Sair]    │
├─────────────────────────────────────┐
│  📅 Aulas de Hoje                   │
│  • 10:30 - Estrutura de Dados (A)   │
│  • 14:00 - Banco de Dados (B)       │
├─────────────────────────────────────┤
│  📊 Minhas Turmas (3)               │
│                                     │
│  📚 Estrutura de Dados - Turma A    │
│     45 alunos | Freq. média: 92%   │
│     [Ver Turma] [Abrir Aula]       │
│                                     │
│  📚 Banco de Dados I - Turma B      │
│     38 alunos | Freq. média: 88%   │
│     [Ver Turma] [Abrir Aula]       │
│                                     │
│  📚 POO - Turma C                   │
│     42 alunos | Freq. média: 85%   │
│     [Ver Turma] [Abrir Aula]       │
└─────────────────────────────────────┘
```

**Critérios de Aceitação:**
- Dashboard carrega em < 2s
- Aulas de hoje destacadas
- Turmas ordenadas por horário

**Telas:** 1 (ProfessorDashboard)

---

### 3. Controle de Aula (Core do MVP)
**Tempo: 8 dias**

#### 3.1 Abrir Aula
- [ ] Botão "Abrir Aula" na turma
- [ ] Modal confirmando data/hora da aula
- [ ] Gerar código numérico de 6 dígitos (único)
- [ ] Exibir código em destaque (fonte grande)
- [ ] Copiar código com um clique
- [ ] Definir janela de tempo (ex: 20 min)

**Modal de Aula Aberta:**
```
┌─────────────────────────────────────┐
│ ✅ Aula Aberta!                     │
├─────────────────────────────────────┤
│  Estrutura de Dados - Turma A       │
│  01/10/2025 às 10:30               │
├─────────────────────────────────────┤
│  CÓDIGO DA AULA                     │
│                                     │
│      ╔══════════╗                  │
│      ║  742839  ║                  │
│      ╚══════════╝                  │
│                                     │
│  [📋 Copiar Código]                 │
├─────────────────────────────────────┤
│  ⏱️ Tempo restante: 18:45           │
│  👥 Presentes: 12 / 45              │
│                                     │
│  [Ver Lista em Tempo Real]          │
│  [❌ Fechar Aula]                   │
└─────────────────────────────────────┘
```

#### 3.2 Acompanhamento em Tempo Real
- [ ] Lista de alunos atualizando automaticamente
- [ ] Indicador visual (✅ presente, ⏳ aguardando)
- [ ] Contador de presentes / total
- [ ] Barra de progresso
- [ ] Scroll na lista

**Lista em Tempo Real:**
```
┌─────────────────────────────────────┐
│ 📊 Presença em Tempo Real           │
│    12 / 45 alunos (27%)             │
│    ▓▓▓░░░░░░░░░░░░░░░░░░░░░         │
├─────────────────────────────────────┤
│  ✅ João Silva          10:32       │
│  ✅ Maria Santos        10:31       │
│  ✅ Pedro Oliveira      10:33       │
│  ✅ Ana Costa           10:30       │
│  ...                                │
│  ⏳ Carlos Souza      (aguardando)  │
│  ⏳ Fernanda Lima     (aguardando)  │
│  ...                                │
└─────────────────────────────────────┘
```

#### 3.3 Fechar Aula
- [ ] Botão "Fechar Aula"
- [ ] Confirmação (modal)
- [ ] Resumo final (X presentes, Y ausentes)
- [ ] Opção de registrar faltantes manualmente
- [ ] Atualizar banco de dados

**Confirmação de Fechamento:**
```
┌─────────────────────────────────────┐
│ ⚠️ Fechar Aula?                     │
├─────────────────────────────────────┤
│  Presentes: 38                      │
│  Ausentes: 7                        │
│                                     │
│  Deseja registrar presença manual   │
│  para os ausentes antes de fechar?  │
│                                     │
│  [Sim, Registrar] [Não, Fechar]    │
│  [Cancelar]                         │
└─────────────────────────────────────┘
```

**Critérios de Aceitação:**
- Código gerado é único e válido por 20 min
- Lista atualiza a cada 2-3 segundos (polling ou WebSocket)
- Fechar aula salva todos os dados corretamente
- Não permitir abrir 2 aulas simultâneas da mesma turma

**Componentes:** 
- OpenLessonModal
- RealTimeAttendanceList
- CloseLessonModal

---

### 4. Registro Manual de Presença
**Tempo: 5 dias**

#### 4.1 Chamada Manual
- [ ] Lista de todos os alunos da turma
- [ ] Checkbox ao lado de cada nome
- [ ] Botão "Marcar Todos" / "Desmarcar Todos"
- [ ] Busca rápida por nome
- [ ] Salvar alterações

**Interface de Chamada:**
```
┌─────────────────────────────────────┐
│ 📝 Registro Manual de Presença      │
├─────────────────────────────────────┤
│  [Marcar Todos] [Desmarcar Todos]   │
│  🔍 [Buscar aluno...]               │
├─────────────────────────────────────┤
│  ☑️ João Silva (2024001)            │
│  ☑️ Maria Santos (2024002)          │
│  ☐ Pedro Oliveira (2024003)        │
│  ☑️ Ana Costa (2024004)             │
│  ☐ Carlos Souza (2024005)          │
│  ...                                │
├─────────────────────────────────────┤
│  Total: 38 / 45 presentes           │
│                                     │
│  [Salvar] [Cancelar]                │
└─────────────────────────────────────┘
```

#### 4.2 Correção de Presença
- [ ] Editar presença de aula passada
- [ ] Mudar status (presente ↔ ausente)
- [ ] Campo obrigatório de justificativa
- [ ] Log de auditoria (quem alterou, quando)

**Modal de Edição:**
```
┌─────────────────────────────────────┐
│ ✏️ Editar Presença                  │
├─────────────────────────────────────┤
│  Aluno: João Silva                  │
│  Aula: 27/09/2025 10:30            │
│  Status atual: Ausente              │
│                                     │
│  ◉ Presente                         │
│  ○ Ausente                          │
│                                     │
│  Justificativa da alteração:        │
│  ┌─────────────────────────────┐   │
│  │ Aluno registrou presença    │   │
│  │ após aula fechada           │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Salvar] [Cancelar]                │
└─────────────────────────────────────┘
```

**Critérios de Aceitação:**
- Busca funciona em tempo real
- Marcar/Desmarcar todos funciona
- Não permitir edição sem justificativa
- Log de auditoria registra tudo

**Telas:** 1 (ManualAttendancePage)

---

### 5. Visualização da Turma
**Tempo: 5 dias**

#### 5.1 Detalhes da Turma
- [ ] Lista de alunos com frequência individual
- [ ] Ordenar por: nome, frequência, matrícula
- [ ] Filtrar por: todos, em dia (≥75%), em risco (<75%)
- [ ] Indicadores visuais (cores)
- [ ] Busca por nome/matrícula

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Estrutura de Dados - Turma A     │
│   45 alunos | 25 aulas realizadas  │
├─────────────────────────────────────┤
│  📊 Frequência Média: 92%           │
│     38 em dia | 5 em risco | 2 críticos │
├─────────────────────────────────────┤
│  [Todos] [Em Dia] [Em Risco]       │
│  🔍 [Buscar aluno...]               │
├─────────────────────────────────────┤
│  ✅ João Silva          96% (24/25) │
│  ✅ Maria Santos        92% (23/25) │
│  ⚠️  Pedro Oliveira     72% (18/25) │
│  ✅ Ana Costa           100% (25/25)│
│  ❌ Carlos Souza        64% (16/25) │
│  ...                                │
├─────────────────────────────────────┤
│  [Exportar Relatório PDF]           │
└─────────────────────────────────────┘
```

#### 5.2 Detalhes do Aluno
- [ ] Clicar em aluno abre modal/página
- [ ] Histórico completo de aulas
- [ ] Lista de presenças/faltas
- [ ] Informações de contato (email)

**Critérios de Aceitação:**
- Lista carrega em < 2s
- Filtros funcionam instantaneamente
- Cores: Verde (≥75%), Amarelo (60-74%), Vermelho (<60%)

**Telas:** 1 (ClassDetailPage)

---

### 6. Relatório Básico de Frequência
**Tempo: 4 dias**

#### 6.1 Geração de Relatório
- [ ] Botão "Exportar Relatório" na página da turma
- [ ] Escolher formato: PDF
- [ ] Relatório com:
  - Nome da disciplina e turma
  - Lista de alunos (nome, matrícula, frequência)
  - Estatísticas gerais (média, mínimo, máximo)
  - Data de geração
- [ ] Download automático

**Conteúdo do Relatório (PDF):**
```
═══════════════════════════════════════════
      RELATÓRIO DE FREQUÊNCIA
═══════════════════════════════════════════

Disciplina: Estrutura de Dados
Turma: A
Professor: João Silva
Período: 2025/2
Total de aulas: 25

───────────────────────────────────────────
ESTATÍSTICAS GERAIS
───────────────────────────────────────────
Frequência média: 92%
Alunos em dia (≥75%): 38 (84%)
Alunos em risco (<75%): 7 (16%)

───────────────────────────────────────────
LISTA DE ALUNOS
───────────────────────────────────────────
Nome                    Matrícula    Freq.
───────────────────────────────────────────
João Silva              2024001      96%
Maria Santos            2024002      92%
Pedro Oliveira          2024003      72% ⚠️
Ana Costa               2024004      100%
...

───────────────────────────────────────────
Gerado em: 03/10/2025 às 14:35
```

**Critérios de Aceitação:**
- PDF gerado em < 5s
- Dados corretos e atualizados
- Layout legível e profissional
- Nome do arquivo: `frequencia_turma-a_2025-10-03.pdf`

**Biblioteca:** jsPDF ou similar

---

### 7. Lista de Aulas Realizadas
**Tempo: 3 dias**

#### 7.1 Histórico de Aulas
- [ ] Lista de todas as aulas da turma
- [ ] Data, horário, status (realizada/cancelada)
- [ ] Número de presentes/total
- [ ] Clicar abre detalhes (lista de presentes)

**Layout:**
```
┌─────────────────────────────────────┐
│ 📅 Aulas Realizadas (25)            │
├─────────────────────────────────────┤
│  ✅ 01/10/2025 10:30                │
│     38 / 45 presentes (84%)         │
│     [Ver Detalhes]                  │
│                                     │
│  ✅ 29/09/2025 10:30                │
│     42 / 45 presentes (93%)         │
│     [Ver Detalhes]                  │
│                                     │
│  ❌ 27/09/2025 10:30 (Cancelada)    │
│     Motivo: Feriado                 │
│                                     │
│  ✅ 25/09/2025 10:30                │
│     40 / 45 presentes (89%)         │
│     [Ver Detalhes]                  │
│  ...                                │
└─────────────────────────────────────┘
```

**Critérios de Aceitação:**
- Ordenação (mais recente primeiro)
- Indicador visual de aula cancelada
- Detalhes mostram lista completa de presentes/ausentes

**Componentes:** LessonHistoryList

---

## 📱 Navegação e Estrutura

### Menu Principal
```
┌─────────────────────────┐
│ INF Attendance          │
├─────────────────────────┤
│ 🏠 Dashboard            │
│ 📚 Minhas Turmas        │
│ 📊 Relatórios (futuro)  │
│ 👤 Perfil               │
│ 🚪 Sair                 │
└─────────────────────────┘
```

### Rotas
- `/professor/dashboard` → Dashboard do Professor
- `/professor/turmas` → Lista de Turmas (mesma que dashboard no MVP)
- `/professor/turmas/:id` → Detalhes da Turma
- `/professor/turmas/:id/aula/abrir` → Abrir Aula (modal)
- `/professor/turmas/:id/chamada` → Registro Manual
- `/perfil` → Perfil do Professor

---

## 🎨 Design System Mínimo

### Cores (mesmas do aluno)
```css
--primary: #3B82F6      /* Azul - ações principais */
--success: #10B981      /* Verde - frequência boa */
--warning: #F59E0B      /* Amarelo - atenção */
--error: #EF4444        /* Vermelho - crítico */
--info: #06B6D4         /* Azul claro - informativo */
```

### Componentes Reutilizáveis
1. **Button** (primary, secondary, danger)
2. **Card** (container)
3. **Modal** (abrir aula, fechar aula, edição)
4. **Table** (lista de alunos)
5. **Badge** (status de frequência)
6. **Progress Bar** (% de presença)

---

## 🛠️ Stack Técnico

### Frontend
- **Framework:** React 18 + TypeScript
- **Roteamento:** React Router v6
- **Estado:** React Query + Context API
- **Estilização:** TailwindCSS + DaisyUI
- **Formulários:** React Hook Form
- **Notificações:** Sonner
- **PDF:** jsPDF ou react-pdf

### Real-Time
- **Opção 1:** Polling (a cada 3s) - mais simples
- **Opção 2:** WebSocket (ideal, mais complexo)

### API
- **Endpoints necessários:**
  ```
  GET    /professor/turmas
  GET    /professor/turmas/:id
  GET    /professor/turmas/:id/alunos
  GET    /professor/turmas/:id/aulas
  
  POST   /aulas/abrir             # Abre aula, retorna código
  POST   /aulas/:id/fechar        # Fecha aula
  GET    /aulas/:id/presencas     # Lista em tempo real
  
  POST   /presencas               # Registro manual
  PATCH  /presencas/:id           # Editar presença
  
  GET    /relatorios/turma/:id    # Dados para PDF
  ```

---

## ✅ Checklist de Implementação

### Sprint 1 (2 semanas)
- [ ] Autenticação (compartilhada com aluno)
- [ ] Dashboard do professor
- [ ] Lista de turmas
- [ ] Detalhes da turma (lista de alunos)
- [ ] Integração com API

### Sprint 2 (2 semanas)
- [ ] Abrir aula (gerar código)
- [ ] Lista em tempo real (polling)
- [ ] Fechar aula
- [ ] Validação de código no backend

### Sprint 3 (2 semanas)
- [ ] Registro manual de presença
- [ ] Edição de presença (com auditoria)
- [ ] Histórico de aulas
- [ ] Filtros e busca

### Sprint 4 (2 semanas)
- [ ] Geração de relatório PDF
- [ ] Indicadores visuais (cores, gráficos)
- [ ] Otimizações de performance
- [ ] Testes com professores reais

---

## 🧪 Testes e Validação

### Testes Funcionais (Manuais)
- [ ] Professor consegue abrir aula
- [ ] Código gerado funciona para alunos
- [ ] Lista atualiza em tempo real
- [ ] Fechar aula salva corretamente
- [ ] Registro manual funciona
- [ ] Edição de presença com auditoria
- [ ] Relatório PDF gerado corretamente

### Testes de Usabilidade
- [ ] 3 professores reais testam
- [ ] Tempo para abrir aula < 30s
- [ ] Tempo total de controle < 5 min
- [ ] Feedback qualitativo

### Critérios de Aceite do MVP
- ✅ Professor controla presença em < 5 min
- ✅ 95% dos alunos conseguem registrar sem erro
- ✅ Lista em tempo real atualiza corretamente
- ✅ Relatório PDF gerado sem erros
- ✅ Zero bugs críticos

---

## 📊 Métricas de Sucesso

### Eficiência
- **Tempo de controle:** < 5 min (vs. 15-20 min manual)
- **Redução de trabalho:** 70%
- **Taxa de erro:** < 5%

### Técnicas
- **Uptime:** > 99%
- **Tempo de resposta:** < 1s
- **Atualização real-time:** < 3s

### Adoção
- **Professores usando:** 80% no primeiro mês
- **Satisfação:** NPS > 60
- **Preferência vs. manual:** > 90%

---

## 🚫 Fora do Escopo (MVP)

### NÃO implementar agora:
- ❌ Justificativas de faltas (aluno envia, professor aprova) - Fase 2
- ❌ QR Code (usar código numérico no MVP) - Fase 2
- ❌ Geolocalização - Fase 2
- ❌ Comunicação com alunos (mensagens) - Fase 2
- ❌ Calendário visual - Fase 2
- ❌ Planejamento de aulas - Fase 2
- ❌ Relatórios avançados (gráficos) - Fase 3
- ❌ Análises preditivas - Fase 3
- ❌ Gestão de conteúdo - Fase 3
- ❌ App mobile - Fase 4
- ❌ Integração Moodle - Fase 4

---

## 🎯 Próximos Passos Pós-MVP

### Fase 2 (4-6 semanas)
1. QR Code (gerar e escanear)
2. Gestão de justificativas (aprovar/rejeitar)
3. Notificações automáticas
4. Calendário de aulas
5. Comunicação básica com alunos

### Fase 3 (4-6 semanas)
6. Relatórios avançados (gráficos, análises)
7. Planejamento de semestre
8. Comparação entre turmas
9. Configurações avançadas

### Fase 4 (6-8 semanas)
10. App mobile
11. Reconhecimento facial
12. Integração com Moodle
13. Assistente IA

---

## 📝 Notas de Implementação

### Prioridades
1. **Confiabilidade > Recursos:** Sistema deve funcionar sempre
2. **Simplicidade > Complexidade:** Fácil de usar em sala de aula
3. **Performance:** Real-time não pode travar
4. **Desktop-first:** Professor usa em sala (projetor/notebook)

### Decisões Técnicas
- **Polling vs WebSocket:** Começar com polling (3s), migrar para WS se necessário
- **PDF Server-side vs Client-side:** Client-side (jsPDF) para não sobrecarregar backend
- **Cache agressivo:** React Query com staleTime de 5 min para turmas

### Riscos e Mitigações
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Real-time lento | Alto | Polling otimizado + cache |
| Código duplicado | Médio | Validação única no backend |
| PDF pesado | Baixo | Limitar a 100 alunos por turma no MVP |
| Rede instável | Médio | Retry automático + feedback claro |

---

## 🔗 Integração com MVP do Aluno

### Fluxo Completo
1. **Professor abre aula** → Sistema gera código
2. **Professor exibe código** (projetor/quadro)
3. **Alunos digitam código** no app
4. **Sistema valida** e registra presença
5. **Professor vê lista** atualizando em tempo real
6. **Professor fecha aula** quando todos registraram
7. **Sistema salva** e notifica ausentes (futuro)

### Sincronização
- Professor e aluno veem **mesmos dados**
- Atualização **em tempo real** (3s de delay máximo)
- **Consistência** garantida pelo backend

---

**Tempo total estimado:** 8 semanas  
**Equipe:** 2 devs frontend + 1 dev backend + 1 designer (part-time)  
**Entrega:** MVP funcional para 3 turmas piloto

---

**Documento criado por:** GitHub Copilot  
**Data:** 03/10/2025  
**Versão:** 1.0 - MVP
