# MVP - Aluno | Sistema de Gestão de Presença Acadêmica

**Data:** 03/10/2025  
**Versão:** 1.0 - Minimum Viable Product  
**Prazo estimado:** 4-6 semanas (2-3 sprints)

---

## 🎯 Objetivo do MVP

Permitir que o **aluno** possa:
1. ✅ Registrar sua presença em aulas abertas
2. ✅ Visualizar sua frequência em tempo real
3. ✅ Acompanhar suas disciplinas
4. ✅ Receber alertas de baixa frequência

**Métrica de Sucesso:** 80% dos alunos conseguem registrar presença sem ajuda e visualizar sua frequência.

---

## 📋 Funcionalidades Essenciais

### 1. Autenticação
**Tempo: 3 dias**

#### 1.1 Login
- [ ] Tela de login (email + senha)
- [ ] Validação de credenciais
- [ ] Armazenamento de token JWT
- [ ] Logout
- [ ] "Esqueci minha senha" (básico - envio de email)

**Critérios de Aceitação:**
- Aluno consegue fazer login com credenciais válidas
- Token expira após 24h
- Mensagens de erro claras

**Telas:** 1 (LoginPage)

---

### 2. Dashboard do Aluno
**Tempo: 5 dias**

#### 2.1 Painel Principal
- [ ] Header com nome do aluno e foto (inicial)
- [ ] Card com taxa geral de presença (%)
- [ ] Lista de disciplinas matriculadas (nome, código)
- [ ] Indicador visual de status (verde/amarelo/vermelho)
- [ ] Botão "Registrar Presença" (destacado)

**Layout:**
```
┌─────────────────────────────────────┐
│ 👤 João Silva          [Sair]      │
├─────────────────────────────────────┤
│  📊 Minha Frequência Geral          │
│       94% ████████░░                │
├─────────────────────────────────────┤
│  🎓 Minhas Disciplinas (6)          │
│                                     │
│  ✅ Estrutura de Dados     92%     │
│  ✅ Banco de Dados I       88%     │
│  ⚠️  Prog. Orientada Obj.  73%     │
│  ✅ Cálculo II             95%     │
│  ✅ Algoritmos             90%     │
│  ❌ Física I               68%     │
│                                     │
│  [➕ Registrar Presença]            │
└─────────────────────────────────────┘
```

**Critérios de Aceitação:**
- Dashboard carrega em < 2s
- Disciplinas ordenadas por frequência (menor primeiro)
- Cores: Verde (≥75%), Amarelo (60-74%), Vermelho (<60%)

**Telas:** 1 (StudentDashboard)

---

### 3. Registro de Presença
**Tempo: 4 dias**

#### 3.1 Modal de Registro
- [ ] Botão "Registrar Presença" abre modal
- [ ] Lista de aulas abertas neste momento
- [ ] Campo para digitar código numérico (6 dígitos)
- [ ] Botão "Confirmar"
- [ ] Feedback visual (sucesso/erro)

#### 3.2 Validações
- [ ] Verificar se aula está aberta
- [ ] Verificar janela de tempo (não permitir fora do horário)
- [ ] Prevenir registro duplicado
- [ ] Mostrar erro claro (ex: "Aula fechada", "Código inválido")
    
**Fluxo:**
```
1. Aluno clica "Registrar Presença"
2. Modal abre mostrando aulas abertas
3. Aluno digita código de 6 dígitos
4. Sistema valida
5. Sucesso: "✅ Presença registrada em Estrutura de Dados!"
6. Erro: "❌ Código inválido ou aula fechada"
```

**Critérios de Aceitação:**
- Código de 6 dígitos (números)
- Validação imediata (< 1s)
- Modal fecha automaticamente após sucesso
- Frequência atualiza em tempo real

**Componentes:** 1 modal (PresenceRegistrationModal)

---

### 4. Detalhes da Disciplina
**Tempo: 4 dias**

#### 4.1 Visualização Individual
- [ ] Clicar em disciplina abre página de detalhes
- [ ] Header com nome, código, professor
- [ ] Porcentagem de frequência (destaque)
- [ ] Lista de aulas (data, status)
- [ ] Indicadores: ✅ Presente, ❌ Falta, ⏳ Justificada

#### 4.2 Lista de Aulas
- [ ] Data e horário de cada aula
- [ ] Status (presente/falta/justificada)
- [ ] Ordenação (mais recente primeiro)
- [ ] Filtro simples (Todas / Só Faltas)

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Estrutura de Dados (INF01121)    │
│   Prof. João Silva                  │
├─────────────────────────────────────┤
│  📊 Frequência: 92%                 │
│     23 presenças / 25 aulas         │
├─────────────────────────────────────┤
│  📅 Aulas Realizadas                │
│                                     │
│  ✅ 01/10/2025 10:30 - Presente    │
│  ✅ 29/09/2025 10:30 - Presente    │
│  ❌ 27/09/2025 10:30 - Falta       │
│  ✅ 25/09/2025 10:30 - Presente    │
│  ...                                │
└─────────────────────────────────────┘
```

**Critérios de Aceitação:**
- Lista carrega em < 2s
- Scroll infinito (ou paginação)
- Indicadores visuais claros

**Telas:** 1 (SubjectDetailPage)

---

### 5. Alertas de Baixa Frequência
**Tempo: 2 dias**

#### 5.1 Notificações In-App
- [ ] Banner no topo quando frequência < 80%
- [ ] Mensagem clara: "⚠️ Atenção! Sua frequência em X está em Y%"
- [ ] Link para detalhes da disciplina
- [ ] Fechar banner (temporariamente)

#### 5.2 Cálculo Automático
- [ ] Atualizar após cada registro de presença
- [ ] Mostrar quantas faltas faltam para reprovar
- [ ] Exemplo: "Você pode faltar mais 2 vezes"

**Layout:**
```
┌─────────────────────────────────────┐
│ ⚠️ ATENÇÃO: Frequência Baixa!       │
│ Sua frequência em "Física I" está   │
│ em 68%. Você precisa de 75% para    │
│ aprovação. Não falte mais!          │
│                        [Entendi]    │
└─────────────────────────────────────┘
```

**Critérios de Aceitação:**
- Alerta aparece automaticamente quando < 80%
- Alerta crítico (vermelho) quando < 75%
- Cálculo correto de faltas permitidas

**Componentes:** 1 (LowFrequencyAlert)

---

### 6. Perfil Básico
**Tempo: 2 dias**

#### 6.1 Visualização de Dados
- [ ] Nome completo
- [ ] Matrícula
- [ ] Email
- [ ] Curso
- [ ] Foto de perfil (inicial das letras)

#### 6.2 Edição Limitada
- [ ] Alterar senha
- [ ] Logout

**Layout:**
```
┌─────────────────────────────────────┐
│ 👤 Meu Perfil                       │
├─────────────────────────────────────┤
│  [JS] João Silva                    │
│  📧 joao.silva@inf.ufrgs.br        │
│  🎓 Ciência da Computação           │
│  🆔 2024123456                      │
│                                     │
│  [Alterar Senha]                    │
│  [Sair da Conta]                    │
└─────────────────────────────────────┘
```

**Critérios de Aceitação:**
- Dados carregam do backend
- Alterar senha funciona com validação
- Logout limpa token e redireciona

**Telas:** 1 (ProfilePage)

---

## 📱 Navegação e Estrutura

### Menu Principal
```
┌─────────────────────────┐
│ INF Attendance          │
├─────────────────────────┤
│ 🏠 Dashboard            │
│ 📚 Minhas Disciplinas   │
│ 👤 Perfil               │
│ 🚪 Sair                 │
└─────────────────────────┘
```

### Rotas
- `/` → Login
- `/dashboard` → Dashboard do Aluno
- `/disciplinas` → Lista de Disciplinas (mesmo que dashboard no MVP)
- `/disciplinas/:id` → Detalhes da Disciplina
- `/perfil` → Perfil do Aluno

---

## 🎨 Design System Mínimo

### Cores
```css
--primary: #3B82F6      /* Azul - ações principais */
--success: #10B981      /* Verde - frequência boa (≥75%) */
--warning: #F59E0B      /* Amarelo - atenção (60-74%) */
--error: #EF4444        /* Vermelho - crítico (<60%) */
--gray-50: #F9FAFB      /* Background */
--gray-900: #111827     /* Texto principal */
```

### Componentes Reutilizáveis
1. **Button** (primary, secondary, ghost)
2. **Card** (container básico)
3. **Modal** (overlay + conteúdo centralizado)
4. **Alert** (success, warning, error)
5. **Badge** (status de frequência)

---

## 🛠️ Stack Técnico

### Frontend
- **Framework:** React 18 + TypeScript
- **Roteamento:** React Router v6
- **Estado:** React Query (cache de API)
- **Estilização:** TailwindCSS + DaisyUI
- **Formulários:** React Hook Form
- **Notificações:** Sonner (toast)

### API
- **Endpoints necessários:**
  ```
  POST   /auth/login
  POST   /auth/logout
  POST   /auth/forgot-password
  
  GET    /aluno/disciplinas
  GET    /aluno/disciplinas/:id
  GET    /aluno/frequencia
  
  POST   /presencas
  GET    /presencas/aulas-abertas
  
  GET    /aluno/perfil
  PATCH  /aluno/perfil/senha
  ```

---

## ✅ Checklist de Implementação

### Sprint 1 (2 semanas)
- [ ] Configuração do projeto (Vite + React + TS)
- [ ] Autenticação (login, logout, proteção de rotas)
- [ ] Dashboard básico (sem dados reais)
- [ ] Design system (cores, componentes básicos)
- [ ] Integração com API de autenticação

### Sprint 2 (2 semanas)
- [ ] Listar disciplinas no dashboard
- [ ] Calcular e exibir frequência
- [ ] Página de detalhes da disciplina
- [ ] Lista de aulas (presente/falta)
- [ ] Indicadores visuais (cores, ícones)

### Sprint 3 (2 semanas)
- [ ] Registro de presença (modal)
- [ ] Validação de código
- [ ] Feedback visual (success/error)
- [ ] Alertas de baixa frequência
- [ ] Perfil básico
- [ ] Testes com usuários reais

---

## 🧪 Testes e Validação

### Testes Funcionais (Manuais)
- [ ] Aluno consegue fazer login
- [ ] Dashboard mostra disciplinas corretas
- [ ] Frequência é calculada corretamente
- [ ] Registro de presença funciona
- [ ] Alertas aparecem quando necessário
- [ ] Logout funciona

### Testes de Usabilidade
- [ ] 5 alunos reais testam o sistema
- [ ] Tempo médio para registrar presença < 30s
- [ ] Taxa de erro < 10%
- [ ] Feedback qualitativo (o que melhorar)

### Critérios de Aceite do MVP
- ✅ 80% dos alunos conseguem usar sem ajuda
- ✅ 90% dos registros de presença são bem-sucedidos
- ✅ Dashboard carrega em < 2s
- ✅ Sistema funciona em mobile e desktop
- ✅ Zero bugs críticos (bloqueadores)

---

## 📊 Métricas de Sucesso

### Técnicas
- **Uptime:** > 99%
- **Tempo de resposta:** < 1s (90% das requisições)
- **Taxa de erro:** < 5%

### Negócio
- **Adoção:** 80% dos alunos usam no primeiro mês
- **Engajamento:** 50% acessam 3x/semana
- **Satisfação:** NPS > 50

### Acadêmicas
- **Aumento de frequência:** +5% vs. método anterior
- **Redução de faltas injustificadas:** -20%

---

## 🚫 Fora do Escopo (MVP)

### NÃO implementar agora:
- ❌ Justificativas de faltas (Fase 2)
- ❌ Calendário visual (Fase 2)
- ❌ Histórico de semestres anteriores (Fase 2)
- ❌ Notificações push (Fase 2)
- ❌ QR Code scanner (Fase 2 - MVP usa código numérico)
- ❌ Geolocalização (Fase 2)
- ❌ Exportação de relatórios (Fase 2)
- ❌ Comparação com média da turma (Fase 3)
- ❌ Gamificação (Fase 4)
- ❌ App mobile nativo (Fase 4)

---

## 🎯 Próximos Passos Pós-MVP

### Fase 2 (4-6 semanas)
1. Justificativas de faltas (upload de atestado)
2. QR Code scanner (câmera do celular)
3. Calendário de aulas
4. Notificações push
5. Histórico de semestres

### Fase 3 (4-6 semanas)
6. Relatórios exportáveis (PDF)
7. Análises e insights
8. Configurações de perfil avançadas
9. Comparação com turma

### Fase 4 (6-8 semanas)
10. App mobile nativo
11. Modo offline
12. Gamificação
13. Integrações externas

---

## 📝 Notas de Implementação

### Prioridades
1. **Funcionalidade > Beleza:** Foco em funcionar bem, não em ficar perfeito
2. **Mobile-first:** Maioria dos alunos usa celular
3. **Performance:** Carregamento rápido é crítico
4. **Simplicidade:** Interface intuitiva, sem treinamento

### Riscos e Mitigações
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| API lenta | Alto | Cache agressivo com React Query |
| Bugs em produção | Alto | Testes manuais rigorosos antes do deploy |
| Baixa adoção | Médio | Onboarding simples + tutorial rápido |
| Problemas de rede | Médio | Feedback claro de erro + retry automático |

---

**Tempo total estimado:** 6 semanas  
**Equipe:** 2 devs frontend + 1 designer (part-time)  
**Entrega:** MVP funcional para 1 turma piloto

---

**Documento criado por:** GitHub Copilot  
**Data:** 03/10/2025  
**Versão:** 1.0 - MVP
