# 📋 Relatório de Testes E2E - Sprint 3

**Data:** 04/10/2025  
**Responsável:** GitHub Copilot  
**Ambiente:** Docker (Frontend: http://localhost:8080 | Backend: http://localhost:3000)

---

## 🎯 Objetivo

Validar os fluxos completos da aplicação, incluindo:
- CRUD de todas as entidades
- Integrações entre módulos (Admin → Professor → Aluno)
- Novas features do Sprint 3
- Responsividade e acessibilidade
- Loading states e tratamento de erros

---

## ✅ Casos de Teste

### 1. 🔐 **Autenticação e Autorização**

#### TC-001: Login com credenciais válidas
- [ ] **Dado:** Usuário admin existe no sistema
- [ ] **Quando:** Faço login com credenciais corretas
- [ ] **Então:** Sou redirecionado para /dashboard
- [ ] **E:** Token JWT é armazenado no localStorage
- [ ] **E:** Header exibe informações do usuário

#### TC-002: Login com credenciais inválidas
- [ ] **Dado:** Credenciais incorretas
- [ ] **Quando:** Tento fazer login
- [ ] **Então:** Vejo mensagem de erro amigável
- [ ] **E:** Permaneço na página de login

#### TC-003: Proteção de rotas
- [ ] **Dado:** Não estou autenticado
- [ ] **Quando:** Tento acessar /dashboard diretamente
- [ ] **Então:** Sou redirecionado para /login

#### TC-004: Refresh token
- [ ] **Dado:** Estou autenticado
- [ ] **Quando:** O access token expira
- [ ] **Então:** Sistema renova automaticamente usando refresh token
- [ ] **E:** Não perco minha sessão

---

### 2. 👥 **CRUD de Usuários (Admin)**

#### TC-005: Criar novo professor
- [ ] **Dado:** Estou logado como admin
- [ ] **Quando:** Navego para /admin/usuarios/novo
- [ ] **E:** Preencho formulário com dados válidos (role: PROFESSOR)
- [ ] **E:** Clico em "Salvar"
- [ ] **Então:** Vejo toast de sucesso
- [ ] **E:** Sou redirecionado para lista de usuários
- [ ] **E:** Novo professor aparece na lista

#### TC-006: Editar usuário existente
- [ ] **Dado:** Um usuário existe na lista
- [ ] **Quando:** Clico em "Editar"
- [ ] **E:** Altero o nome
- [ ] **E:** Clico em "Salvar"
- [ ] **Então:** Vejo toast de sucesso
- [ ] **E:** Nome atualizado aparece na lista

#### TC-007: Deletar usuário
- [ ] **Dado:** Um usuário existe na lista
- [ ] **Quando:** Clico em "Deletar"
- [ ] **E:** Confirmo no dialog
- [ ] **Então:** Vejo toast de sucesso
- [ ] **E:** Usuário some da lista

#### TC-008: Validação de formulário de usuário
- [ ] **Dado:** Estou no formulário de novo usuário
- [ ] **Quando:** Deixo campos obrigatórios vazios
- [ ] **E:** Tento salvar
- [ ] **Então:** Vejo mensagens de erro nos campos

#### TC-009: Filtros e busca de usuários
- [ ] **Dado:** Existem vários usuários
- [ ] **Quando:** Digito nome na busca
- [ ] **Então:** Lista é filtrada em tempo real
- [ ] **Quando:** Seleciono filtro de role
- [ ] **Então:** Vejo apenas usuários daquela role

---

### 3. 📚 **CRUD de Disciplinas (Admin)**

#### TC-010: Criar nova disciplina
- [ ] **Dado:** Estou logado como admin
- [ ] **Quando:** Navego para /admin/disciplinas/novo
- [ ] **E:** Preencho código, nome, carga horária
- [ ] **E:** Clico em "Salvar"
- [ ] **Então:** Vejo toast de sucesso
- [ ] **E:** Disciplina aparece na lista

#### TC-011: Editar disciplina
- [ ] **Dado:** Uma disciplina existe
- [ ] **Quando:** Edito carga horária
- [ ] **E:** Salvo
- [ ] **Então:** Alteração é persistida

#### TC-012: Deletar disciplina
- [ ] **Dado:** Uma disciplina sem turmas vinculadas existe
- [ ] **Quando:** Deleto
- [ ] **Então:** Disciplina é removida com sucesso

#### TC-013: Filtros de disciplinas
- [ ] **Dado:** Existem disciplinas de vários tipos
- [ ] **Quando:** Filtro por tipo (obrigatória/optativa)
- [ ] **Então:** Vejo apenas disciplinas do tipo selecionado

---

### 4. 🎓 **CRUD de Turmas (Admin)**

#### TC-014: Criar turma usando formulário tradicional
- [ ] **Dado:** Existem disciplinas e professores cadastrados
- [ ] **Quando:** Navego para /admin/turmas/novo
- [ ] **E:** Preencho código, disciplina, ano, semestre, professor
- [ ] **E:** Salvo
- [ ] **Então:** Turma é criada com sucesso

#### TC-015: Criar turma usando ClassFormWizard
- [ ] **Dado:** Navego para /admin/turmas/wizard
- [ ] **Quando:** Passo 1 - Preencho informações básicas
- [ ] **E:** Clico "Próximo"
- [ ] **Então:** Avanço para Passo 2 (Professor)
- [ ] **Quando:** Seleciono um professor
- [ ] **E:** Clico "Próximo"
- [ ] **Então:** Avanço para Passo 3 (Alunos)
- [ ] **Quando:** Busco e seleciono 3 alunos
- [ ] **E:** Clico "Próximo"
- [ ] **Então:** Vejo resumo no Passo 4 (Revisar)
- [ ] **Quando:** Clico "Criar Turma"
- [ ] **Então:** Turma é criada com alunos já associados
- [ ] **E:** Sou redirecionado para detalhes da turma

#### TC-016: Validação wizard - não permite avançar sem dados
- [ ] **Dado:** Estou no wizard de turmas
- [ ] **Quando:** Tento clicar "Próximo" sem preencher campos obrigatórios
- [ ] **Então:** Vejo mensagem de erro
- [ ] **E:** Não avanço de passo

#### TC-017: Wizard - funcionalidade "Selecionar Todos" alunos
- [ ] **Dado:** Estou no Passo 3 do wizard (alunos)
- [ ] **Quando:** Clico "Selecionar Todos"
- [ ] **Então:** Todos os alunos são selecionados
- [ ] **Quando:** Clico "Limpar"
- [ ] **Então:** Todas as seleções são removidas

#### TC-018: Wizard - busca de alunos
- [ ] **Dado:** Estou no Passo 3 (alunos)
- [ ] **Quando:** Digito nome de um aluno na busca
- [ ] **Então:** Lista é filtrada em tempo real

#### TC-019: Editar turma
- [ ] **Dado:** Uma turma existe
- [ ] **Quando:** Edito o código
- [ ] **E:** Salvo
- [ ] **Então:** Alteração é persistida

#### TC-020: Adicionar alunos em turma existente
- [ ] **Dado:** Estou na página de detalhes da turma
- [ ] **Quando:** Clico "Adicionar Alunos"
- [ ] **E:** Seleciono novos alunos
- [ ] **E:** Confirmo
- [ ] **Então:** Alunos são adicionados
- [ ] **E:** Aparecem na lista da turma

#### TC-021: Filtros de turmas
- [ ] **Dado:** Existem turmas de vários semestres/anos
- [ ] **Quando:** Filtro por semestre
- [ ] **Então:** Vejo apenas turmas daquele semestre

---

### 5. 📖 **CRUD de Aulas (Professor)**

#### TC-022: Criar nova aula
- [ ] **Dado:** Estou logado como professor
- [ ] **Quando:** Navego para /professor/aulas/novo
- [ ] **E:** Seleciono turma, tipo, data, hora
- [ ] **E:** Salvo
- [ ] **Então:** Aula é criada

#### TC-023: Abrir aula para presença
- [ ] **Dado:** Uma aula existe e está fechada
- [ ] **Quando:** Clico "Abrir para Presença"
- [ ] **Então:** Código de 6 dígitos é gerado
- [ ] **E:** Timer de 5 minutos inicia
- [ ] **E:** Status muda para "Aberta"

#### TC-024: Fechar aula
- [ ] **Dado:** Aula está aberta
- [ ] **Quando:** Clico "Fechar Presença"
- [ ] **Então:** Status muda para "Fechada"
- [ ] **E:** Código não é mais exibido

#### TC-025: Registro manual de presença pelo professor
- [ ] **Dado:** Aula está aberta
- [ ] **Quando:** Abro formulário de presença manual
- [ ] **E:** Seleciono alunos presentes
- [ ] **E:** Clico "Marcar Todos" / "Desmarcar Todos"
- [ ] **E:** Salvo
- [ ] **Então:** Presenças são registradas

---

### 6. ✋ **Registro de Presença (Aluno)**

#### TC-026: Aluno registra presença com código válido
- [ ] **Dado:** Estou logado como aluno
- [ ] **E:** Uma aula está aberta com código válido
- [ ] **Quando:** Navego para minha disciplina
- [ ] **E:** Clico "Registrar Presença"
- [ ] **E:** Digito o código correto (6 dígitos)
- [ ] **E:** Confirmo
- [ ] **Então:** Vejo toast de sucesso
- [ ] **E:** Presença é registrada

#### TC-027: Aluno tenta registrar com código inválido
- [ ] **Dado:** Tento registrar presença
- [ ] **Quando:** Digito código errado
- [ ] **Então:** Vejo mensagem de erro
- [ ] **E:** Presença não é registrada

#### TC-028: Aluno tenta registrar após aula fechada
- [ ] **Dado:** Aula foi fechada
- [ ] **Quando:** Tento registrar presença
- [ ] **Então:** Vejo mensagem que aula não está mais disponível

#### TC-029: Visualização de frequência do aluno
- [ ] **Dado:** Tenho presenças registradas
- [ ] **Quando:** Acesso detalhes da disciplina
- [ ] **Então:** Vejo minha % de frequência
- [ ] **E:** Vejo badge (success/warning/danger) conforme %

---

### 7. 🆕 **Novas Features - Sprint 3**

#### TC-030: ProfilePage - Editar perfil
- [ ] **Dado:** Estou logado (qualquer role)
- [ ] **Quando:** Navego para /profile
- [ ] **E:** Edito meu nome
- [ ] **E:** Clico "Salvar Alterações"
- [ ] **Então:** Vejo toast de sucesso (mock - TODO API)
- [ ] **E:** Nome é atualizado localmente

#### TC-031: ProfilePage - Alterar senha
- [ ] **Dado:** Estou em /profile
- [ ] **Quando:** Preencho senha atual, nova senha, confirmação
- [ ] **E:** Clico "Alterar Senha"
- [ ] **Então:** Vejo toast de sucesso (mock - TODO API)

#### TC-032: ProfilePage - Validação de senha
- [ ] **Dado:** Estou alterando senha
- [ ] **Quando:** Nova senha < 6 caracteres
- [ ] **Então:** Vejo mensagem de erro

#### TC-033: ProfilePage - Confirmação de senha
- [ ] **Dado:** Estou alterando senha
- [ ] **Quando:** Confirmação não corresponde à nova senha
- [ ] **Então:** Vejo mensagem de erro

#### TC-034: NotificationCenter - Visualizar notificações
- [ ] **Dado:** Existem notificações (mock data)
- [ ] **Quando:** Clico no ícone de sino no header
- [ ] **Então:** Dropdown abre com lista de notificações
- [ ] **E:** Badge mostra contagem de não lidas (2)

#### TC-035: NotificationCenter - Marcar como lida
- [ ] **Dado:** Dropdown está aberto
- [ ] **Quando:** Clico em uma notificação não lida
- [ ] **Então:** Notificação é marcada como lida
- [ ] **E:** Contador diminui

#### TC-036: NotificationCenter - Marcar todas como lidas
- [ ] **Dado:** Existem notificações não lidas
- [ ] **Quando:** Clico "Marcar todas como lidas"
- [ ] **Então:** Todas ficam marcadas
- [ ] **E:** Badge desaparece

#### TC-037: NotificationCenter - Deletar notificação
- [ ] **Dado:** Uma notificação existe
- [ ] **Quando:** Clico no X para deletar
- [ ] **Então:** Notificação é removida da lista

#### TC-038: NotificationCenter - Responsividade mobile
- [ ] **Dado:** Estou em viewport mobile (< 640px)
- [ ] **Quando:** Abro notificações
- [ ] **Então:** Dropdown ocupa largura adequada (calc(100vw-2rem))
- [ ] **E:** Conteúdo não fica cortado

#### TC-039: StatisticsPage - Visualizar dashboard
- [ ] **Dado:** Estou logado como admin
- [ ] **Quando:** Navego para /statistics
- [ ] **Então:** Vejo 4 cards de estatísticas
- [ ] **E:** Vejo 3 gráficos (linha, barra, pizza)
- [ ] **E:** Vejo tabela de departamentos
- [ ] **E:** Vejo 3 cards de insights

#### TC-040: StatisticsPage - Filtros de período
- [ ] **Dado:** Estou em /statistics
- [ ] **Quando:** Seleciono "Última Semana"
- [ ] **Então:** Dados são filtrados (mock - TODO API)
- [ ] **Quando:** Seleciono "Último Mês"
- [ ] **Então:** Dados mudam

#### TC-041: StatisticsPage - Responsividade dos gráficos
- [ ] **Dado:** Estou em /statistics
- [ ] **Quando:** Redimensiono janela
- [ ] **Então:** Gráficos Recharts se adaptam responsivamente

---

### 8. 🎨 **UX e Loading States**

#### TC-042: Loading states em todas as páginas
- [ ] **Dado:** Navego entre rotas lazy-loaded
- [ ] **Quando:** Página está carregando
- [ ] **Então:** Vejo LoadingPage com mensagens aleatórias
- [ ] **E:** Spinner animado

#### TC-043: Skeletons em listas
- [ ] **Dado:** Estou carregando lista de usuários/turmas/etc
- [ ] **Quando:** Dados ainda estão sendo buscados
- [ ] **Então:** Vejo skeleton placeholders
- [ ] **E:** Transição suave para dados reais

#### TC-044: EmptyState quando não há dados
- [ ] **Dado:** Lista está vazia (sem resultados)
- [ ] **Quando:** Página carrega
- [ ] **Então:** Vejo EmptyState apropriado
- [ ] **E:** Mensagem clara e ilustração

#### TC-045: Toast notifications
- [ ] **Dado:** Qualquer ação CRUD
- [ ] **Quando:** Ação é bem-sucedida
- [ ] **Então:** Vejo toast de sucesso (verde)
- [ ] **Quando:** Ação falha
- [ ] **Então:** Vejo toast de erro (vermelho)

---

### 9. 🛡️ **Tratamento de Erros**

#### TC-046: ErrorBoundary - Erro em componente
- [ ] **Dado:** Um componente lança erro no render
- [ ] **Quando:** Erro ocorre
- [ ] **Então:** ErrorBoundary captura
- [ ] **E:** Vejo tela de erro amigável
- [ ] **E:** Botões "Recarregar" e "Ir para Início" funcionam

#### TC-047: 404 NotFoundPage
- [ ] **Dado:** Navego para rota inexistente (/rota-invalida)
- [ ] **Quando:** Página carrega
- [ ] **Então:** Vejo NotFoundPage com "404"
- [ ] **E:** Botões de navegação funcionam

#### TC-048: Erros de API (500, 401, 403)
- [ ] **Dado:** Backend retorna erro 500
- [ ] **Quando:** Faço requisição
- [ ] **Então:** Vejo toast com mensagem de erro apropriada
- [ ] **E:** Dados não são corrompidos

---

### 10. 📱 **Responsividade**

#### TC-049: Mobile (< 640px)
- [ ] **Dado:** Viewport em 375px (iPhone)
- [ ] **Quando:** Navego por todas as páginas
- [ ] **Então:** Layout se adapta corretamente
- [ ] **E:** Menu mobile funciona
- [ ] **E:** Tabelas têm scroll horizontal se necessário

#### TC-050: Tablet (640px - 1024px)
- [ ] **Dado:** Viewport em 768px (iPad)
- [ ] **Quando:** Navego por todas as páginas
- [ ] **Então:** Layout se adapta
- [ ] **E:** ClassFormWizard progress bar otimizado

#### TC-051: Desktop (> 1024px)
- [ ] **Dado:** Viewport em 1920px
- [ ] **Quando:** Navego por todas as páginas
- [ ] **Então:** Layout aproveita espaço
- [ ] **E:** Sidebar sempre visível

---

### 11. ♿ **Acessibilidade**

#### TC-052: Navegação por teclado
- [ ] **Dado:** Uso apenas teclado (Tab)
- [ ] **Quando:** Navego por formulários
- [ ] **Então:** Foco é visível em todos os elementos
- [ ] **E:** Ordem de tabulação faz sentido

#### TC-053: ARIA labels
- [ ] **Dado:** Uso screen reader
- [ ] **Quando:** Navego pela aplicação
- [ ] **Então:** Botões têm labels descritivos
- [ ] **E:** NotificationCenter anuncia estado aberto/fechado

#### TC-054: Contraste de cores
- [ ] **Dado:** Verifico contraste em DaisyUI themes
- [ ] **Quando:** Avalio visualmente
- [ ] **Então:** Texto é legível em todos os fundos

---

### 12. 🔄 **Fluxo Integrado Completo**

#### TC-055: Fluxo Admin → Professor → Aluno
- [ ] **ADMIN:** Login como admin
- [ ] **ADMIN:** Criar nova disciplina "Engenharia de Software"
- [ ] **ADMIN:** Criar professor "João Silva"
- [ ] **ADMIN:** Criar 5 alunos
- [ ] **ADMIN:** Criar turma usando wizard
- [ ] **ADMIN:** Associar professor + 5 alunos
- [ ] **Logout**
- [ ] **PROFESSOR:** Login como "João Silva"
- [ ] **PROFESSOR:** Ver minha turma no dashboard
- [ ] **PROFESSOR:** Criar nova aula
- [ ] **PROFESSOR:** Abrir aula para presença
- [ ] **PROFESSOR:** Copiar código de 6 dígitos
- [ ] **Logout**
- [ ] **ALUNO:** Login como um dos alunos criados
- [ ] **ALUNO:** Ver disciplina no dashboard
- [ ] **ALUNO:** Acessar detalhes da disciplina
- [ ] **ALUNO:** Registrar presença com código
- [ ] **ALUNO:** Ver frequência atualizada
- [ ] **PROFESSOR:** Login novamente
- [ ] **PROFESSOR:** Ver que aluno registrou presença
- [ ] **PROFESSOR:** Fechar aula

---

## 📊 Resumo de Execução

**Total de Casos de Teste:** 55  
**Executados:** 0  
**Passaram:** 0  
**Falharam:** 0  
**Bloqueados:** 0  

---

## 🐛 Bugs Encontrados

| ID | Severidade | Descrição | Status |
|----|------------|-----------|--------|
| - | - | - | - |

---

## 💡 Observações

- TODOs conhecidos (mock data):
  - NotificationCenter: API endpoints pendentes
  - StatisticsPage: Dados mock, aguardando endpoints reais
  - ProfilePage: Integração com API pendente

---

## ✅ Aprovação

- [ ] Todos os testes críticos passaram
- [ ] Bugs bloqueadores resolvidos
- [ ] Documentação atualizada
- [ ] Pronto para produção

**Assinatura:** ________________  
**Data:** __/__/____
