# 4. Modelagem e Arquitetura

Este capítulo detalha o planejamento técnico do sistema, traduzindo os objetivos definidos na introdução em especificações técnicas concretas. A seção abrange o levantamento de requisitos funcionais e não funcionais, a definição da arquitetura de software e a modelagem de dados que sustenta a aplicação.

## 4.1 Requisitos do Sistema

A definição dos requisitos foi realizada com base na análise das necessidades dos três principais atores do sistema: Administradores, Professores e Alunos.

### 4.1.1 Requisitos Funcionais (RF)

Os Requisitos Funcionais descrevem os comportamentos e funções específicas que o sistema deve prover.

*   **[RF01] Autenticação e Autorização:** O sistema deve permitir o login de usuários via e-mail e senha, utilizando tokens JWT para manter a sessão segura. Deve haver diferenciação de permissões entre Administradores, Professores e Alunos.
*   **[RF02] Gestão de Estrutura Acadêmica:** O sistema deve permitir o cadastro e gerenciamento de Cursos, Grades Curriculares e Disciplinas (ex: Engenharia de Software, Cálculo I).
*   **[RF03] Gestão de Turmas:** O sistema deve permitir a criação de Turmas (ofertas de disciplinas em um período) e a matrícula de alunos e professores nessas turmas.
*   **[RF04] Gestão de Aulas:** O Professor deve ser capaz de criar Aulas (sessões) para uma Turma, definindo data, horário e conteúdo.
*   **[RF05] Registro de Presença:** O sistema deve permitir que a presença seja registrada. O Professor pode registrar manualmente ou abrir uma "janela de chamada" para que os alunos registrem sua própria presença.
*   **[RF06] Visualização de Histórico:** Alunos devem poder visualizar seu percentual de frequência em tempo real. Professores devem ter acesso a relatórios de presença de toda a turma.

### 4.1.2 Requisitos Não Funcionais (RNF)

Os Requisitos Não Funcionais definem critérios de qualidade e restrições técnicas.

*   **[RNF01] Responsividade (Mobile-First):** A interface deve ser otimizada primariamente para dispositivos móveis, garantindo usabilidade em telas de smartphones (360px+).
*   **[RNF02] Desempenho:** O tempo de resposta da API para operações críticas (como registrar presença) não deve exceder 500ms em condições normais de rede.
*   **[RNF03] Segurança:** As senhas devem ser armazenadas com criptografia forte (hash). A comunicação deve ser protegida via HTTPS.
*   **[RNF04] Disponibilidade:** O sistema deve estar disponível 24/7, utilizando infraestrutura em nuvem escalável.

### 4.1.3 Histórias de Usuário

Para guiar o desenvolvimento ágil, os requisitos foram traduzidos em Histórias de Usuário:

1.  *"Como **Professor**, eu quero **abrir a chamada pelo meu celular**, para que eu não perca tempo passando uma lista de papel."*
2.  *"Como **Aluno**, eu quero **ver quantas faltas eu tenho**, para que eu possa gerenciar minha frequência e evitar reprovação."*
3.  *"Como **Coordenador**, eu quero **cadastrar as disciplinas do semestre**, para que os professores possam criar suas turmas."*

## 4.2 Arquitetura do Sistema

A arquitetura do sistema segue o padrão de **Microsserviços Monolíticos (Modular Monolith)**, onde a aplicação é implantada como uma unidade, mas internamente é segregada em módulos independentes, facilitando uma futura migração para microsserviços reais se necessário.

A comunicação segue o fluxo:
1.  **Cliente (Frontend):** Aplicação React (SPA/PWA) rodando no navegador do usuário.
2.  **API Gateway / Controller:** O NestJS recebe as requisições HTTP, valida os dados (DTOs) e a autenticação (Guards).
3.  **Service Layer:** A camada de serviço executa a regra de negócio (ex: verificar se o aluno já tem presença na data).
4.  **Data Access Layer:** O Prisma ORM traduz as operações para SQL e consulta o banco de dados.
5.  **Banco de Dados:** PostgreSQL armazena os dados de forma relacional.

A estrutura modular do Backend (`AppModule`) organiza o código em domínios funcionais:
*   `AuthModule`: Autenticação e Tokens.
*   `PresencasModule`: Lógica de registro de frequência.
*   `TurmasModule`: Gestão de turmas e matrículas.
*   `AulasModule`: Gestão de sessões de aula.

## 4.3 Modelagem de Dados

O banco de dados foi modelado utilizando a abordagem relacional para garantir a integridade dos dados acadêmicos. O Diagrama Entidade-Relacionamento (DER) é representado pelas seguintes entidades principais, definidas no esquema do Prisma:

*   **User (Usuário):** Entidade central que armazena dados de login e perfil. Relaciona-se com `Role` para definir permissões.
*   **Course (Curso):** Representa o curso de graduação (ex: Ciência da Computação).
*   **Curriculum (Grade):** Conjunto de disciplinas que compõem um curso.
*   **Subject (Disciplina):** A matéria em si (ex: Algoritmos).
*   **Class (Turma):** A oferta de uma disciplina em um semestre específico. Relaciona-se com `User` (Professores e Alunos).
*   **Lesson (Aula):** Uma sessão específica de uma turma em uma data.
*   **Attendance (Presença):** O registro de que um `User` esteve presente em uma `Lesson`.

O relacionamento mais crítico é o de **Attendance**, que conecta um Aluno (`User`) a uma Aula (`Lesson`), contendo metadados como horário do registro e status.

## 4.4 Prototipação

Antes da implementação, foram desenvolvidos protótipos de alta fidelidade focados na experiência móvel. O design priorizou elementos de interface grandes (touch-friendly) e fluxos de navegação simplificados.

A tela principal do Professor ("Dashboard") foi projetada para exibir, em primeiro plano, as aulas do dia atual, com um botão de ação proeminente para "Iniciar Chamada". Para o Aluno, a prioridade visual foi dada ao indicador de status de presença da aula corrente e ao gráfico de frequência acumulada.
