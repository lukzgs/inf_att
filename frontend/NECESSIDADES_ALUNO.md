# Necessidades do Aluno - Sistema de Gestão de Presença Acadêmica

**Data:** 03/10/2025  
**Contexto:** Sistema usado atualmente por um curso específico, com planos de expansão para todos os cursos da UFRGS

---

## 📋 Índice

1. [Dashboard e Visão Geral](#1-dashboard-e-visão-geral)
2. [Gestão de Disciplinas](#2-gestão-de-disciplinas)
3. [Registro de Presença](#3-registro-de-presença)
4. [Acompanhamento de Frequência](#4-acompanhamento-de-frequência)
5. [Justificativas de Faltas](#5-justificativas-de-faltas)
6. [Calendário e Horários](#6-calendário-e-horários)
7. [Perfil e Configurações](#7-perfil-e-configurações)
8. [Notificações e Alertas](#8-notificações-e-alertas)
9. [Histórico e Relatórios](#9-histórico-e-relatórios)
10. [Suporte e Ajuda](#10-suporte-e-ajuda)

---

## 1. Dashboard e Visão Geral

### 1.1 Painel Principal
- **Resumo de disciplinas** matriculadas no semestre atual
- **Taxa de presença geral** (porcentagem consolidada)
- **Próximas aulas** (agenda do dia/semana)
- **Alertas importantes** (baixa frequência, justificativas pendentes)
- **Ações rápidas** (registrar presença, ver horários, justificar falta)

### 1.2 Cards de Status
- **Disciplinas em risco** (frequência < 75%)
- **Aulas abertas** para registro de presença
- **Aulas da semana** (contagem e horários)
- **Créditos cursados** no semestre

### 1.3 Widgets Informativos
- **Gráfico de frequência** ao longo do semestre
- **Comparação com média da turma** (opcional)
- **Progresso de créditos** (realizados vs. planejados)
- **Indicadores visuais** (verde/amarelo/vermelho) por disciplina

---

## 2. Gestão de Disciplinas

### 2.1 Visualização de Disciplinas
- **Lista de disciplinas** matriculadas no semestre
- **Informações básicas** (código, nome, professor, créditos)
- **Horários e salas** de aula
- **Carga horária** total e realizada
- **Status de frequência** (porcentagem atual)

### 2.2 Detalhes por Disciplina
- **Página individual** para cada disciplina
- **Informações do professor** (nome, email, contato)
- **Ementa e conteúdo programático** (se disponível)
- **Calendário de aulas** (datas, horários, tópicos)
- **Lista de colegas** matriculados (opcional)

### 2.3 Filtros e Busca
- **Filtrar por status** (em dia, em risco, crítica)
- **Buscar por nome** ou código
- **Ordenar** (alfabético, frequência, dia da semana)
- **Visualização** em cards ou lista

### 2.4 Informações Acadêmicas
- **Pré-requisitos** da disciplina
- **Bibliografia recomendada**
- **Critérios de aprovação** (frequência + nota)
- **Observações** e avisos do professor

---

## 3. Registro de Presença

### 3.1 Check-in de Presença
- **Botão de "Registrar Presença"** visível e acessível
- **Lista de aulas abertas** no momento
- **Confirmação visual** de registro bem-sucedido
- **Histórico de check-ins** do dia

### 3.2 Métodos de Registro
- **QR Code** (escaneado via câmera do celular)
- **Código numérico** (digitado manualmente)
- **Geolocalização** (verificação de proximidade com a sala)
- **Bluetooth/NFC** (futuro - para identificação automática)

### 3.3 Validações e Restrições
- **Janela de tempo** para registro (ex: 10 min antes até 20 min após início)
- **Localização geográfica** (raio de X metros da sala)
- **Limite de tentativas** (prevenir fraudes)
- **Alertas de registro fora do horário** (com opção de justificar)

### 3.4 Feedback e Confirmação
- **Notificação imediata** de presença registrada
- **Resumo do dia** (quantas aulas, quais disciplinas)
- **Erro claro** se registro falhar (motivo e ação sugerida)
- **Histórico de tentativas** de registro

---

## 4. Acompanhamento de Frequência

### 4.1 Visão Individual por Disciplina
- **Porcentagem de presença** atual
- **Número de faltas** (justificadas e não justificadas)
- **Número de presenças** registradas
- **Total de aulas** realizadas até o momento
- **Previsão** de frequência final (se mantiver ritmo atual)

### 4.2 Indicadores Visuais
- **Barra de progresso** colorida (verde > 75%, amarelo 60-75%, vermelho < 60%)
- **Ícones de status** (✓ em dia, ⚠️ atenção, ❌ crítico)
- **Gráficos de linha** (frequência ao longo do tempo)
- **Comparação visual** entre disciplinas

### 4.3 Detalhamento de Aulas
- **Lista de todas as aulas** da disciplina
- **Status de cada aula** (presente, falta, justificada, aula não realizada)
- **Data e horário** de cada aula
- **Tópico/Conteúdo** abordado (se registrado pelo professor)
- **Filtrar por status** (só faltas, só presenças, etc.)

### 4.4 Alertas de Risco
- **Notificação automática** quando frequência cair abaixo de 80%
- **Alerta crítico** quando atingir limite mínimo (75%)
- **Sugestão de ação** (justificar faltas, não faltar mais X vezes)
- **Projeção** de quantas faltas ainda são permitidas

---

## 5. Justificativas de Faltas

### 5.1 Solicitação de Justificativa
- **Formulário de justificativa** de falta
- **Seleção da aula** a justificar
- **Tipo de justificativa** (atestado médico, luto, trabalho, outros)
- **Campo de texto** para descrição
- **Upload de documentos** (PDF, imagem de atestado)

### 5.2 Gestão de Justificativas
- **Lista de justificativas enviadas**
- **Status** (pendente, aprovada, rejeitada)
- **Histórico completo** (data de envio, análise, resposta)
- **Notificação** de aprovação/rejeição
- **Feedback do professor** (motivo de rejeição, se aplicável)

### 5.3 Prazos e Regras
- **Prazo para justificar** (ex: até 7 dias após a falta)
- **Tipos aceitos** de justificativa (definidos pela instituição)
- **Documentos obrigatórios** por tipo
- **Limite de justificativas** sem documento (se aplicável)

### 5.4 Documentação e Comprovantes
- **Visualizar documentos** anexados
- **Download de comprovantes** (em PDF)
- **Editar justificativa** enquanto pendente
- **Reenviar** se rejeitada (com correções)

---

## 6. Calendário e Horários

### 6.1 Calendário Pessoal
- **Visualização mensal/semanal/diária** de aulas
- **Horários de todas as disciplinas**
- **Aulas confirmadas** vs. canceladas
- **Reposições agendadas**
- **Eventos acadêmicos** (provas, feriados)

### 6.2 Agenda do Dia
- **Lista de aulas do dia** com horários
- **Sala/local** de cada aula
- **Professor responsável**
- **Status de check-in** (já registrou presença ou não)
- **Lembretes** (próxima aula em X minutos)

### 6.3 Visualização de Horários
- **Grade horária semanal** (tabela visual)
- **Código de cores** por disciplina
- **Conflitos de horário** (se houver)
- **Exportar para Google Calendar/Outlook**

### 6.4 Notificações de Agenda
- **Lembrete de aula** (15 min antes, configurável)
- **Alerta de aula cancelada**
- **Notificação de reposição** agendada
- **Mudança de sala** ou horário

---

## 7. Perfil e Configurações

### 7.1 Informações Pessoais
- **Visualizar dados** (nome, matrícula, email, curso)
- **Editar informações** (telefone, foto de perfil)
- **Alterar senha**
- **Verificar email** (confirmação)

### 7.2 Preferências de Notificação
- **Ativar/Desativar notificações** por tipo
- **Escolher canais** (email, push, SMS)
- **Horário preferido** para lembretes
- **Frequência** de resumos (diário, semanal)

### 7.3 Configurações de Privacidade
- **Visibilidade de dados** (para colegas, professores)
- **Compartilhamento de frequência** (com coordenação)
- **Consentimento de uso** de dados (LGPD)
- **Exportar dados pessoais** (direito de portabilidade)

### 7.4 Configurações de Acessibilidade
- **Modo escuro/claro**
- **Tamanho de fonte** (pequeno, médio, grande)
- **Contraste alto**
- **Leitura de tela** (compatibilidade)

---

## 8. Notificações e Alertas

### 8.1 Tipos de Notificação
- **Aula aberta** para registro de presença
- **Lembrete de aula** (X min antes)
- **Frequência baixa** (alerta de risco)
- **Justificativa aprovada/rejeitada**
- **Mudança de horário/sala**
- **Aula cancelada**
- **Mensagem do professor**

### 8.2 Central de Notificações
- **Lista de todas as notificações**
- **Marcar como lida/não lida**
- **Filtrar por tipo** ou disciplina
- **Limpar notificações antigas**
- **Histórico** (últimos 30 dias)

### 8.3 Configurações Granulares
- **Ativar/Desativar por tipo** de notificação
- **Escolher horário** (silenciar à noite)
- **Prioridade** (crítico, normal, informativo)
- **Som e vibração** (personalizar)

### 8.4 Resumos e Relatórios
- **Resumo semanal** de frequência
- **Resumo mensal** (enviado por email)
- **Alertas de final de semestre** (status final de frequência)
- **Lembrete de prazos** (justificativas pendentes)

---

## 9. Histórico e Relatórios

### 9.1 Histórico de Semestres
- **Visualizar semestres anteriores**
- **Frequência por disciplina** (histórico completo)
- **Estatísticas comparativas** (melhor/pior semestre)
- **Disciplinas cursadas** (com status final)

### 9.2 Relatórios Pessoais
- **Relatório de frequência** (por disciplina ou geral)
- **Exportar em PDF** (para coordenação, bolsas, etc.)
- **Certificado de frequência** (gerado automaticamente)
- **Histórico de justificativas** (aprovadas e rejeitadas)

### 9.3 Análises e Insights
- **Padrão de ausências** (dias da semana, horários)
- **Disciplinas com mais faltas** (identificar dificuldades)
- **Comparação com semestres anteriores**
- **Sugestões de melhoria** (baseado em dados)

### 9.4 Comprovantes
- **Comprovante de matrícula** (com disciplinas atuais)
- **Comprovante de frequência** (por disciplina)
- **Histórico acadêmico** (simplificado, foco em presença)
- **Download em PDF** ou impressão

---

## 10. Suporte e Ajuda

### 10.1 Central de Ajuda
- **FAQ** (perguntas frequentes)
- **Tutoriais em vídeo** (como usar o sistema)
- **Guias passo a passo** (registrar presença, justificar falta)
- **Busca por tópico** (problemas comuns)

### 10.2 Contato com Suporte
- **Formulário de contato** (dúvidas técnicas)
- **Chat** (se disponível)
- **Email de suporte** (tickets)
- **Telefone** (horário de atendimento)

### 10.3 Reportar Problemas
- **Reportar erro** no registro de presença
- **Solicitar correção** de dados
- **Contestar falta** (se registrou presença mas consta falta)
- **Feedback sobre o sistema** (sugestões)

### 10.4 Documentação e Políticas
- **Regras de frequência** da instituição
- **Política de justificativas**
- **Termos de uso** do sistema
- **Política de privacidade** (LGPD)
- **Changelog** (novidades e atualizações)

---

## 🎯 Funcionalidades Prioritárias

### ⭐ Essenciais (Fase 1 - MVP)
1. **Dashboard com resumo** de disciplinas e frequência
2. **Registro de presença** via QR Code ou código
3. **Visualização de frequência** por disciplina
4. **Calendário de aulas** (próximas e históricas)
5. **Alertas de baixa frequência**
6. **Lista de disciplinas** com detalhes básicos

### ⭐⭐ Importantes (Fase 2)
7. **Justificativas de faltas** com upload de documentos
8. **Notificações push** e lembretes
9. **Histórico de semestres** anteriores
10. **Relatórios exportáveis** (PDF)
11. **Detalhamento de aulas** (presença/falta por data)
12. **Configurações de perfil** e notificações

### ⭐⭐⭐ Desejáveis (Fase 3)
13. **Análises e insights** (padrões de ausência)
14. **Comparação com média da turma**
15. **Geolocalização** para validação de presença
16. **Exportar agenda** para calendários externos
17. **Chat/suporte integrado**
18. **Modo offline** (registrar presença sem internet)

### 🚀 Futuro (Fase 4)
19. **App mobile nativo** (iOS/Android)
20. **Gamificação** (badges, conquistas por frequência)
21. **Integração com outros sistemas** acadêmicos
22. **Reconhecimento facial** para registro de presença
23. **Assistente virtual** (chatbot com IA)
24. **Compartilhamento social** (conquistas, certificados)

---

## 📊 Fluxos de Uso Principais

### Fluxo 1: Registrar Presença em Aula
1. Aluno abre o app/sistema
2. Dashboard mostra aulas abertas
3. Clica em "Registrar Presença" na disciplina
4. Escaneia QR Code mostrado pelo professor ou digita código
5. Sistema valida (horário, localização, tentativas)
6. Confirmação visual de presença registrada
7. Atualização automática da frequência

### Fluxo 2: Consultar Frequência
1. Acessa menu "Minhas Disciplinas"
2. Clica em uma disciplina específica
3. Visualiza porcentagem de frequência
4. Vê lista de aulas (presente/falta/justificada)
5. Analisa gráfico de evolução
6. Exporta relatório se necessário

### Fluxo 3: Justificar Falta
1. Acessa "Minhas Disciplinas" > Disciplina específica
2. Clica na aula com falta
3. Seleciona "Justificar Falta"
4. Escolhe tipo de justificativa
5. Preenche descrição
6. Anexa documento comprobatório
7. Envia para análise do professor
8. Recebe notificação de aprovação/rejeição

### Fluxo 4: Verificar Próximas Aulas
1. Acessa dashboard ou calendário
2. Visualiza agenda do dia/semana
3. Vê horários, salas e professores
4. Ativa lembrete para aula específica
5. Recebe notificação antes da aula

---

## 💡 Princípios de UX/UI

### Simplicidade
- **Interface limpa** e intuitiva
- **Ações principais** sempre visíveis (registrar presença)
- **Máximo 3 cliques** para qualquer funcionalidade

### Feedback Instantâneo
- **Confirmações visuais** imediatas
- **Animações sutis** de sucesso/erro
- **Mensagens claras** e acionáveis

### Acessibilidade
- **Contraste adequado** (WCAG 2.1)
- **Tamanhos de toque** (mínimo 44x44px)
- **Leitores de tela** compatíveis
- **Navegação por teclado**

### Performance
- **Carregamento rápido** (< 2s)
- **Modo offline** para consultas
- **Cache inteligente** de dados
- **Otimização para mobile**

### Confiabilidade
- **Dados sempre sincronizados**
- **Backup automático** de registros
- **Tratamento de erros** robusto
- **Validações no frontend e backend**

---

## 📱 Considerações Mobile-First

### Prioridades Mobile
1. **App nativo** vs. PWA (avaliar)
2. **Scanner QR Code** nativo da câmera
3. **Notificações push** confiáveis
4. **Sincronização em background**
5. **Modo offline** para consultas

### Otimizações
- **Consumo mínimo de bateria**
- **Uso eficiente de dados** (mobile)
- **Cache agressivo** de imagens e dados
- **Compressão** de imagens e uploads

### Funcionalidades Específicas
- **Widget na tela inicial** (próximas aulas)
- **Atalhos rápidos** (registro de presença)
- **Integração com calendário** do dispositivo
- **Compartilhamento** de certificados

---

## 🔐 Segurança e Privacidade

### Autenticação
- **Login seguro** (email/senha ou SSO)
- **Autenticação em 2 fatores** (opcional)
- **Sessões com timeout** automático
- **Logout remoto** (em caso de perda de dispositivo)

### Privacidade de Dados
- **Dados pessoais** criptografados
- **Consentimento explícito** (LGPD)
- **Opt-out** de compartilhamento de dados
- **Anonimização** em estatísticas gerais

### Prevenção de Fraudes
- **Validação de localização** (GPS)
- **Limite de tentativas** de registro
- **Detecção de padrões suspeitos**
- **Bloqueio temporário** em caso de abuso

---

## 📈 Métricas de Sucesso

### Engajamento
- **Taxa de uso diário** (% de alunos que acessam)
- **Tempo médio por sessão**
- **Registros de presença** por dia/semana
- **Notificações abertas** (taxa de engajamento)

### Satisfação
- **NPS (Net Promoter Score)**
- **Avaliações na loja** (se app nativo)
- **Pesquisas de satisfação** (mensais)
- **Taxa de abandono** (churn)

### Performance
- **Tempo de carregamento** médio
- **Taxa de erro** em registros
- **Uptime** do sistema
- **Tempo de resposta** da API

### Impacto Acadêmico
- **Aumento na frequência** geral (comparado com métodos anteriores)
- **Redução de faltas injustificadas**
- **Taxa de aprovação** por frequência
- **Satisfação dos professores** (menos trabalho manual)

---

## 🎓 Casos de Uso Especiais

### Aluno com Dificuldades
- **Alertas proativos** (antes de atingir limite crítico)
- **Sugestões de justificativas** (templates)
- **Contato facilitado** com coordenação
- **Plano de recuperação** de frequência (se aplicável)

### Aluno Trabalhador
- **Justificativas de trabalho** aceitas (com comprovante)
- **Flexibilidade** em horários (se política permitir)
- **Notificações adaptadas** (horário comercial)

### Aluno com Deficiência
- **Acessibilidade total** (leitores de tela, contraste)
- **Registro assistido** (se necessário)
- **Adaptações** em validações (ex: geolocalização)

### Aluno Veterano
- **Acesso rápido** a histórico completo
- **Comparações** entre semestres
- **Exportação** de dados acadêmicos completos

---

## 🚀 Roadmap de Implementação

### Sprint 1-2 (MVP - 4 semanas)
- Dashboard básico
- Lista de disciplinas
- Registro de presença (QR Code)
- Visualização de frequência

### Sprint 3-4 (Core - 4 semanas)
- Calendário e horários
- Justificativas de faltas
- Notificações básicas
- Perfil e configurações

### Sprint 5-6 (Melhorias - 4 semanas)
- Relatórios e exportação
- Histórico de semestres
- Análises e insights
- Melhorias de UX

### Sprint 7-8 (Polimento - 4 semanas)
- App mobile (se aplicável)
- Otimizações de performance
- Testes com usuários reais
- Ajustes baseados em feedback

---

**Documento criado por:** GitHub Copilot  
**Data:** 03/10/2025  
**Versão:** 1.0  
**Baseado em:** Análise de necessidades do aluno universitário
