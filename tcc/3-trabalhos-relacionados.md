# 3. Trabalhos Relacionados

O mercado de tecnologia educacional e a literatura acadêmica oferecem um vasto leque de soluções que abordam, direta ou indiretamente, o problema do registro de frequência. Para contextualizar o desenvolvimento proposto neste trabalho, foram analisadas diferentes plataformas que representam as principais abordagens existentes: sistemas de gestão integrados (ERPs), plataformas de gestão de sala de aula e aplicativos dedicados.

## 3.1 Análise de Soluções de Mercado

### 3.1.1 TOTVS Educacional
O **TOTVS Educacional** é uma das soluções de *Enterprise Resource Planning* (ERP) mais robustas e difundidas no mercado brasileiro, voltada para a gestão completa de instituições de ensino, desde a educação básica até a superior. Nesta plataforma, o controle de frequência é um módulo integrado a um ecossistema que gerencia processos de matrícula, finanças, secretaria, avaliações e portais de comunicação. O registro da chamada é tipicamente realizado pelo docente através do "Portal do Professor", onde ele acessa o diário de classe digital e marca a presença dos alunos.

A principal vantagem desta abordagem é a **centralização da informação**. O dado de presença alimenta automaticamente outros setores, facilitando a emissão de relatórios consolidados e o cumprimento de exigências legais. Contudo, por ser parte de um sistema complexo e abrangente, o módulo de chamada pode carecer de agilidade e de interfaces mais modernas, mantendo, muitas vezes, um processo de marcação manual em um ambiente digital, sem explorar tecnologias como QR Code ou geolocalização para automatização.

### 3.1.2 Google Classroom
O **Google Classroom** é uma plataforma gratuita oferecida pelo Google que visa simplificar a criação, distribuição e avaliação de trabalhos e a comunicação em um ambiente de sala de aula virtual. O foco principal do Google Classroom é a gestão de atividades e o fluxo de comunicação entre professores e alunos, e não a gestão de presença. A plataforma não possui um recurso nativo e dedicado para o registro de frequência. Professores que utilizam a ferramenta para este fim recorrem a métodos adaptados, como a criação de uma "tarefa" ou "pergunta" diária que o aluno deve responder para confirmar sua presença.

A força do Google Classroom reside em sua **simplicidade, gratuidade e alta taxa de adoção**. No entanto, a ausência de uma funcionalidade específica para a gestão de frequência torna o processo improvisado, pouco seguro contra fraudes e inadequado para gerar dados estruturados e confiáveis que possam ser utilizados pela gestão acadêmica da instituição.

### 3.1.3 Jibble
O **Jibble** posiciona-se como um aplicativo especializado em controle de tempo e presença, sendo amplamente utilizado no mundo corporativo, mas com funcionalidades que se aplicam ao setor educacional. Diferente dos ERPs, o Jibble é focado exclusivamente na tarefa de registrar entradas e saídas. A plataforma oferece múltiplos métodos para o registro, incluindo quiosques compartilhados (tablets), reconhecimento facial, rastreamento por GPS com cercas virtuais (*geofencing*) e um aplicativo móvel para registro individual.

A especialização do Jibble resulta em uma solução **altamente eficiente e tecnologicamente avançada** para a tarefa de controle de presença. Seus métodos de verificação (facial e por GPS) oferecem alta segurança contra fraudes. A principal desvantagem, no entanto, é a sua natureza genérica e corporativa, o que pode dificultar a integração com os sistemas acadêmicos existentes e a adaptação de sua terminologia (ex: "funcionários" em vez de "alunos") e fluxos de trabalho à realidade de uma instituição de ensino.

### 3.1.4 Moodle
O **Moodle** (*Modular Object-Oriented Dynamic Learning Environment*) é um dos mais proeminentes sistemas de gestão de aprendizagem (*Learning Management System* - LMS) de código aberto do mundo, amplamente adotado por universidades. Sendo uma plataforma modular, suas funcionalidades são expansíveis através de *plugins*. Um dos *plugins* mais comuns é o "Módulo de Presença" (*Attendance module*), que permite aos professores configurar sessões de aula dentro de seus cursos. Para cada sessão, o docente pode registrar o status de cada aluno (Presente, Ausente, Atrasado, Justificado), e esses dados ficam armazenados e atrelados ao perfil do aluno dentro da disciplina.

A principal vantagem do Moodle é sua **flexibilidade e natureza *open-source***, que elimina custos de licenciamento e permite customizações. A integração da presença com o ambiente do curso é um ponto forte. Como desvantagem, a interface do Moodle é frequentemente percebida como menos intuitiva que a de soluções comerciais mais recentes, e a implementação e manutenção da plataforma exigem uma equipe técnica dedicada por parte da instituição. O processo de chamada, mesmo no ambiente digital, continua a ser predominantemente manual.

### 3.1.5 Additio
O **Additio** (e seu concorrente similar, **TeacherKit**) representa a categoria de aplicativos de "diário de classe digital" ou "planner do professor", projetados especificamente para o educador individual. Esta ferramenta funciona como um assistente pessoal para o professor, centralizando em um único aplicativo o planejamento de aulas, o gerenciamento de notas, o registro de comportamento e o controle de frequência. A interface é otimizada para dispositivos móveis, permitindo que o professor realize a chamada de forma rápida diretamente de seu smartphone ou tablet.

O grande diferencial desta abordagem é o seu **foco total na experiência do professor**. Toda a aplicação é construída para simplificar e organizar o trabalho docente. No entanto, sua principal limitação é funcionar como uma **solução isolada (*silo*)**. Os dados inseridos no Additio não são, por padrão, integrados aos sistemas centrais da instituição (como o ERP acadêmico), o que pode exigir que o professor realize um trabalho duplicado de exportar e reinserir as informações de frequência no sistema oficial.

## 3.2 Discussão Comparativa

A análise das plataformas TOTVS Educacional, Moodle, Google Workspace for Education, Additio App e Jibble revela que a escolha de uma tecnologia para o ambiente educacional transcende a mera comparação de funcionalidades. Cada solução representa um arquétipo com uma filosofia de design, um modelo de custo e um impacto pedagógico distintos, refletindo a tensão fundamental entre a gestão centralizada (*top-down*) e a autonomia pedagógica (*bottom-up*).

O TOTVS Educacional personifica o arquétipo do sistema de gestão integrada (ERP), cuja filosofia é a da centralização e da eficiência operacional. Projetado para ser o sistema nervoso da instituição, ele integra processos acadêmicos, financeiros e administrativos em uma única plataforma. Em oposição direta, o Moodle representa o arquétipo do ambiente virtual de aprendizagem (LMS) de código aberto, fundamentado em uma filosofia *bottom-up* que prioriza a autonomia docente. O Google Workspace for Education constitui um terceiro arquétipo: o do ecossistema integrado, cuja proposta de valor reside na simplicidade e usabilidade. Finalmente, o Additio App e o Jibble emergem como arquétipos de ferramentas especializadas (*point solutions*), que ilustram o fenômeno do *Shadow IT*, surgindo para preencher lacunas funcionais deixadas pelos sistemas maiores.

Em síntese, a escolha entre essas plataformas é um exercício de alinhamento estratégico. O TOTVS Educacional atende à necessidade de controle e eficiência gerencial; o Moodle, à busca por liberdade e customização pedagógica; e o Google Classroom, à demanda por simplicidade e conveniência. As ferramentas especializadas, por sua vez, demonstram que a realidade tecnológica das instituições é, e provavelmente continuará sendo, um ecossistema fragmentado.

## 3.3 Comparativo com a Solução Proposta

Diante do cenário analisado, a solução desenvolvida neste trabalho busca preencher uma lacuna específica: oferecer a agilidade e a experiência de usuário (UX) de aplicativos focados no professor (como o Additio), mas com a estrutura de dados e a capacidade de integração de sistemas institucionais (como o TOTVS ou Moodle).

A Tabela 1 apresenta um comparativo direto entre as características das soluções analisadas e o sistema proposto, avaliando critérios técnicos e de usabilidade.

**Tabela 1: Matriz Comparativa de Funcionalidades e Características**

| Critério | TOTVS (ERP) | Moodle (LMS) | Google Class. | Jibble | Additio | **Sistema Proposto** |
| **Plataforma Mobile** | Adaptada (Web) | Responsiva | Nativa | Nativa | Nativa | **Mobile-First (PWA)** |
| **Foco na Usabilidade** | Baixo | Médio | Alto | Alto | Alto | **Alto** |
| **Integração de Dados** | Alta | Alta | Média | Baixa | Baixa | **Alta** |
| **Contexto Educacional** | Sim | Sim | Sim | Não | Sim | **Sim** |
| **Validação de Segurança** | Manual | Manual | Nenhuma | Alta (Bio/GPS) | Manual | **Média (Token)** |
| **Modelo de Custo** | Alto | Médio | Gratuito | Pago | Pago | **Open Source** |

### Diferenciais da Solução Proposta

1.  **Abordagem Mobile-First Real:** Diferente de ERPs que apenas adaptam telas de desktop para o celular, o sistema proposto foi desenhado desde o início para ser operado em telas pequenas, reconhecendo que o professor fará a chamada em pé, na sala de aula, usando o smartphone.
2.  **Foco na Tarefa (Task-Driven):** Enquanto o Moodle e o TOTVS possuem centenas de menus, a solução proposta foca na tarefa crítica: registrar presença com o mínimo de cliques possível, reduzindo o tempo gasto em sala.
3.  **Arquitetura para Integração:** Ao contrário do Additio, que isola os dados no aparelho do professor, a solução foi construída com uma API RESTful robusta (NestJS), permitindo que, no futuro, ela funcione como um "satélite" especializado que envia os dados de presença para o ERP central da universidade, unindo a agilidade da ponta com a centralização da gestão.
