# 2. Fundamentação Teórica

O presente capítulo destina-se a estabelecer o alicerce teórico que sustenta o desenvolvimento deste trabalho. A fundamentação divide-se em duas vertentes analíticas: primeiramente, examinam-se os conceitos do domínio, abordando a gestão temporal no ensino superior, a transformação digital dos processos acadêmicos e o impacto da frequência na retenção discente. Subsequentemente, discorre-se sobre o arcabouço tecnológico adotado, justificando a seleção de ferramentas e paradigmas de engenharia de software sob a ótica de requisitos não funcionais como escalabilidade, manutenibilidade e segurança.

## 2.1 Conceitos do Domínio

### 2.1.1 A Gestão do Tempo Instrucional e a Carga Cognitiva
A otimização do tempo em sala de aula é um tema recorrente na literatura educacional, sendo o "tempo instrucional" definido como o intervalo efetivamente alocado às atividades de ensino-aprendizagem, segregado de interrupções administrativas. No contexto do ensino superior, onde as disciplinas frequentemente demandam alta densidade de conteúdo, a continuidade do fluxo cognitivo é imperativa.

A persistência de métodos manuais para o registro de frequência — como a chamada nominal ou a circulação de listas físicas — acarreta uma fragmentação da atenção. Este hiato operacional não apenas subtrai tempo valioso da instrução, mas também impõe uma carga cognitiva extrínseca, exigindo de docentes e discentes um esforço de reengajamento para retomar a linha de raciocínio interrompida. A automatização deste processo, portanto, transcende a mera conveniência administrativa, configurando-se como uma estratégia pedagógica para maximizar a eficiência do tempo letivo.

### 2.1.2 Desmaterialização de Processos e Integridade da Informação
A transformação digital nas Instituições de Ensino Superior (IES) caracteriza-se pela migração de processos baseados em suporte físico para ecossistemas digitais auditáveis. A manutenção de registros em papel apresenta vulnerabilidades intrínsecas, tais como a suscetibilidade à deterioração física, erros de transcrição e a possibilidade de fraudes (e.g., a assinatura por terceiros), comprometendo a fidedignidade dos dados acadêmicos.

A implementação de sistemas informatizados introduz mecanismos robustos de validação e rastreabilidade. Tecnologias de autenticação digital asseguram a integridade da informação na origem, enquanto a persistência em bancos de dados relacionais garante a consistência e a disponibilidade imediata dos dados para os órgãos de gestão acadêmica, eliminando o *delay* inerente ao processamento manual de documentos físicos.

### 2.1.3 O Absenteísmo como Preditivo de Evasão
O monitoramento da assiduidade discente desempenha um papel estratégico na gestão da permanência estudantil. O absenteísmo crônico é amplamente reconhecido na literatura como um indicador antecedente de evasão, sinalizando precocemente dificuldades de ordem acadêmica ou socioemocional.

Sistemas de gestão tradicionais, devido à latência na compilação de dados manuais, frequentemente falham em fornecer diagnósticos em tempo hábil. Em contrapartida, soluções tecnológicas integradas permitem a análise de dados em tempo real, viabilizando a geração de alertas automáticos e dashboards analíticos. Tais ferramentas capacitam a coordenação pedagógica a realizar intervenções preventivas baseadas em dados (*data-driven decision making*), visando a mitigação dos índices de evasão.

### 2.1.4 Usabilidade e Experiência do Usuário (UX) em Ambientes Educacionais
A aceitação e a eficácia de sistemas de informação no ambiente educacional estão intrinsecamente ligadas à qualidade da Experiência do Usuário (UX). Sistemas legados, muitas vezes caracterizados por interfaces obsoletas e baixa responsividade, tendem a gerar atrito operacional e resistência por parte do corpo docente.

A engenharia de software moderna preconiza o Design Centrado no Usuário, onde a usabilidade é tratada como um requisito de qualidade essencial. A concepção de interfaces intuitivas e responsivas não apenas reduz a curva de aprendizado, mas também minimiza a carga de trabalho operacional, permitindo que a tecnologia atue como um facilitador transparente do processo educacional, e não como um obstáculo burocrático.

## 2.2 Tecnologias e Arquitetura de Software

A seleção do stack tecnológico para este projeto pautou-se em critérios rigorosos de engenharia de software, priorizando a portabilidade, a tipagem estática e a arquitetura baseada em componentes.

### 2.2.1 Frontend: Paradigma Declarativo e Responsividade
Para a camada de apresentação, optou-se pela biblioteca **React** (versão 19) em consonância com a linguagem **TypeScript**. O React adota um paradigma declarativo e baseia-se no conceito de Virtual DOM para otimizar a renderização, assegurando alta performance em dispositivos com recursos limitados. Adicionalmente, sua ampla adoção pelo mercado e a curva de aprendizado favorável permitem que a manutenção do código seja realizada de forma eficiente, viabilizando a contribuição produtiva mesmo por desenvolvedores com diferentes níveis de senioridade. A utilização do TypeScript confere robustez ao desenvolvimento através da tipagem estática, mitigando erros em tempo de compilação e facilitando a manutenção de bases de código extensas.

Considerando a ubiquidade dos dispositivos móveis no ambiente acadêmico, o projeto seguiu a metodologia **Mobile-First**. A estilização foi implementada através do framework **TailwindCSS**, que utiliza uma abordagem *utility-first*. A intenção primordial desta escolha é a padronização e a simplificação da escrita de estilos, mitigando a complexidade inerente à manutenção de arquivos CSS tradicionais. Diferente de frameworks de componentes pré-fabricados, o Tailwind permite a construção de interfaces altamente customizáveis e responsivas diretamente no markup, reduzindo a redundância de código e agilizando o ciclo de desenvolvimento.

### 2.2.2 Backend: Arquitetura Modular com NestJS
A lógica de negócios e a API foram desenvolvidas sobre o framework **NestJS** (versão 11). O NestJS destaca-se por impor uma arquitetura modular e escalável, fortemente inspirada no Angular, promovendo o uso de Injeção de Dependência (DI) e Decorators.

Esta estrutura favorece o desacoplamento entre as camadas da aplicação (Controladores, Serviços e Repositórios), facilitando a testabilidade unitária e a manutenção evolutiva. A integração nativa com o **Swagger** permitiu a documentação automática da API seguindo o padrão OpenAPI, essencial para garantir a interoperabilidade e o contrato claro entre o frontend e o backend.

### 2.2.3 Persistência de Dados: Integridade e ORM
O armazenamento de dados é gerido pelo Sistema Gerenciador de Banco de Dados (SGBD) **PostgreSQL** (versão 18), escolhido por sua conformidade com as propriedades ACID (Atomicidade, Consistência, Isolamento e Durabilidade) e sua robustez no tratamento de relacionamentos complexos.

A camada de abstração de dados utiliza o **Prisma ORM**. Diferentemente de ORMs tradicionais baseados no padrão Active Record, o Prisma utiliza um modelo de dados declarativo (`schema.prisma`) e gera um cliente de banco de dados com tipagem segura (*type-safe*). Isso previne, em tempo de desenvolvimento, a construção de consultas inválidas e garante que a manipulação de dados na aplicação esteja estritamente alinhada com a estrutura do banco de dados.

### 2.2.4 Segurança da Informação e Controle de Acesso
A segurança da aplicação foi projetada seguindo o princípio do privilégio mínimo e defesa em profundidade. A autenticação de usuários é realizada via **JSON Web Tokens (JWT)**, um padrão de mercado para transmissão segura de informações entre partes como um objeto JSON.

Para a proteção de credenciais, utiliza-se o algoritmo de hash **Bcrypt**, assegurando que senhas não sejam armazenadas em texto claro. O controle de acesso (autorização) é implementado através de um modelo RBAC (*Role-Based Access Control*), garantindo que as operações críticas do sistema sejam restritas a perfis de usuário específicos (e.g., Administradores e Professores), preservando a integridade das regras de negócio.

### 2.2.5 Inteligência Artificial como Ferramenta de Engenharia
O ciclo de desenvolvimento deste projeto incorporou o uso de Modelos de Linguagem de Grande Escala (LLMs) — especificamente **Gemini 2.5 Pro**, **Claude 3.5 Sonnet** e **GPT Codex** — como ferramentas de apoio à engenharia de software.

Estas tecnologias foram empregadas na modalidade de *AI-Assisted Programming*, auxiliando na geração de *boilerplate*, na otimização de algoritmos e na elaboração de testes automatizados. O uso criterioso destas ferramentas permitiu uma elevação na produtividade e na qualidade do código, permitindo que o esforço intelectual humano fosse direcionado para a arquitetura da solução e para a resolução de problemas de domínio complexos.

### 2.2.6 Infraestrutura e Orquestração em Nuvem
A infraestrutura do projeto adota o paradigma de *Infrastructure as Code* (IaC) através do **Docker**, garantindo a reprodutibilidade do ambiente de execução via contêineres.

Para o ambiente de produção, utilizou-se uma estratégia de deploy em nuvem (PaaS). O frontend é servido pela **Vercel**, aproveitando sua rede global de Edge Network para baixa latência. O backend e o banco de dados são orquestrados pela plataforma **Railway**, que oferece escalabilidade vertical automática e gerenciamento simplificado de microsserviços, assegurando alta disponibilidade e resiliência operacional ao sistema.
