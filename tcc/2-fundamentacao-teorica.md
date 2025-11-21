# 2. Fundamentação Teórica

Este capítulo apresenta o embasamento teórico necessário para a compreensão do problema abordado e da solução proposta. A discussão é dividida em duas seções principais: os conceitos do domínio, que exploram a importância da gestão do tempo e da frequência no ensino superior; e as tecnologias utilizadas, que detalham as ferramentas e frameworks escolhidos para o desenvolvimento do sistema.

## 2.1 Conceitos do Domínio

### 2.1.1 Gestão do Tempo Instrucional e Fluxo Cognitivo
O tempo de aula é um dos recursos mais valiosos e escassos no ambiente educacional. A literatura pedagógica define "tempo instrucional" como o período efetivamente dedicado ao ensino e à aprendizagem, excluindo-se interrupções e tarefas administrativas. Em disciplinas de ensino superior, frequentemente estruturadas em blocos longos (ex: 1 hora e 45 minutos ou mais), a manutenção do fluxo cognitivo — o estado de atenção e engajamento dos estudantes — é crucial para a absorção de conteúdos densos.

Processos manuais de registro de frequência, como a tradicional chamada oral ou a circulação de listas de papel, representam uma interrupção significativa nesse fluxo. Além de consumirem minutos preciosos que poderiam ser dedicados ao conteúdo, essas pausas criam um "hiato de atenção", exigindo um esforço cognitivo adicional de professores e alunos para retomar o ritmo da aula. A automatização desse processo, portanto, não é apenas uma melhoria administrativa, mas uma intervenção pedagógica que visa maximizar o tempo útil de aula e preservar a continuidade do ensino.

### 2.1.2 Transformação Digital e Integridade de Dados
A transformação digital nas instituições de ensino envolve a substituição de processos analógicos, propensos a erros e fraudes, por sistemas digitais auditáveis. No contexto da frequência acadêmica, o método tradicional em papel apresenta vulnerabilidades críticas, como a possibilidade de um aluno assinar por outro (fraude) ou erros de transcrição por parte do professor.

Sistemas digitais permitem a implementação de mecanismos de validação (como senhas temporárias, geolocalização ou QR Codes) que aumentam a confiabilidade dos dados. Além disso, a digitalização permite o acesso à informação em tempo real. Enquanto listas de papel podem levar semanas para serem processadas pela secretaria, um sistema digital atualiza o banco de dados instantaneamente, permitindo uma gestão mais ágil.

### 2.1.3 Frequência como Indicador de Evasão
O registro de presença transcende a mera burocracia legal; ele é um dos principais indicadores preditivos de evasão escolar. Alunos que começam a faltar sistematicamente estão frequentemente sinalizando dificuldades acadêmicas ou pessoais. Em um sistema manual, esse padrão de ausência só é detectado tardiamente. Com uma solução tecnológica, coordenadores e professores podem visualizar gráficos e alertas de absenteísmo em tempo real, permitindo intervenções pedagógicas proativas para reter o estudante antes que o abandono se concretize.

### 2.1.4 Experiência do Usuário (UX) em Sistemas Acadêmicos
A Experiência do Usuário (UX) é um fator determinante para a adoção de novas tecnologias no ambiente educacional. Sistemas acadêmicos legados são frequentemente caracterizados por interfaces complexas, não responsivas e de difícil navegação, o que gera frustração e resistência por parte de professores e alunos.

Ao projetar uma solução moderna, é imperativo considerar a usabilidade como requisito não funcional prioritário. Isso envolve a criação de interfaces intuitivas, que minimizem o número de cliques para realizar uma tarefa (como registrar presença) e que sejam visualmente agradáveis. A aplicação de princípios de Design Centrado no Usuário garante que a tecnologia atue como uma facilitadora, e não como uma barreira adicional no processo educacional.

## 2.2 Tecnologias Utilizadas

A escolha das tecnologias para este projeto foi guiada pelos requisitos de portabilidade (acesso via dispositivos móveis), escalabilidade e robustez. A seguir, detalham-se as principais ferramentas adotadas.

### 2.2.1 Frontend: React, Vite e Abordagem Mobile-First
Para a interface do usuário, utilizou-se a biblioteca **React** (versão 19) em conjunto com a linguagem **TypeScript**. O React foi escolhido por sua arquitetura baseada em componentes e pelo uso do Virtual DOM, que otimiza a renderização de elementos na tela, garantindo alta performance mesmo em dispositivos móveis com hardware limitado. Além disso, o React destaca-se por sua ampla aceitação no mercado e por facilitar a manutenção do código, permitindo que mesmo desenvolvedores com menor tempo de experiência possam contribuir de forma produtiva e organizada. A construção do projeto foi realizada utilizando o **Vite**, uma ferramenta de build de nova geração que oferece um ambiente de desenvolvimento extremamente rápido e builds otimizados para produção.

Dada a premissa de que professores e alunos utilizarão o sistema predominantemente em smartphones dentro da sala de aula, adotou-se a filosofia **Mobile-First**. Para implementar layouts responsivos de forma ágil, utilizou-se o framework CSS **TailwindCSS** em conjunto com a biblioteca de componentes **DaisyUI**. A intenção principal do Tailwind é padronizar e facilitar a escrita de CSS, evitando a criação de folhas de estilo complexas e de difícil manutenção. Diferente de frameworks tradicionais que oferecem componentes rígidos, o Tailwind fornece classes utilitárias que permitem construir designs customizados e altamente adaptáveis. O DaisyUI complementa essa abordagem oferecendo componentes semânticos e acessíveis, acelerando o desenvolvimento da interface sem sacrificar a flexibilidade.

### 2.2.2 Backend: NestJS e Arquitetura Modular
O desenvolvimento da API (Application Programming Interface) foi realizado com **NestJS** (versão 11), um framework progressivo para Node.js. O NestJS foi selecionado por sua forte opinião sobre arquitetura, inspirada no Angular, incentivando o uso de padrões de projeto como Injeção de Dependência, Decorators e Modularidade.

A aplicação foi estruturada em módulos (ex: `AuthModule`, `AttendanceModule`, `ClassModule`), facilitando a manutenção, a escalabilidade e a testabilidade do código. O uso do TypeScript no backend garante a tipagem estática, reduzindo erros em tempo de execução. Além disso, o framework facilita a documentação da API através da integração com o **Swagger**, permitindo a geração automática de uma interface interativa para testar os endpoints, essencial para o desenvolvimento e consumo pelo frontend.

### 2.2.3 Banco de Dados: PostgreSQL e Prisma ORM
Para a persistência dos dados, optou-se pelo Sistema Gerenciador de Banco de Dados (SGBD) Relacional **PostgreSQL** (versão 18), reconhecido por sua robustez, conformidade com os padrões SQL e suporte a transações complexas (ACID).

A interação entre a aplicação e o banco de dados é mediada pelo **Prisma ORM** (Object-Relational Mapping). O Prisma moderniza o acesso ao banco de dados ao permitir que as consultas sejam escritas em TypeScript, de forma declarativa e type-safe. Isso oferece uma camada de segurança adicional, pois o Prisma valida as queries contra o esquema do banco de dados (`schema.prisma`) em tempo de compilação. O sistema de migrações do Prisma facilita o versionamento e a evolução do esquema do banco de dados ao longo do ciclo de vida do projeto.

### 2.2.4 Infraestrutura e Containerização
Para garantir a consistência entre os ambientes de desenvolvimento e produção, utilizou-se o **Docker**. Através do `docker-compose`, todos os serviços necessários para a aplicação (API, Banco de Dados, Frontend) são definidos como contêineres isolados. Isso elimina o problema clássico de "funciona na minha máquina", pois todas as dependências e versões são encapsuladas nas imagens dos contêineres, facilitando o deploy e a configuração do ambiente por outros desenvolvedores.

### 2.2.5 Segurança e Autenticação
A segurança é um pilar fundamental em sistemas acadêmicos. Para garantir a proteção dos dados e o controle de acesso, implementou-se um sistema de autenticação robusto utilizando **JWT (JSON Web Tokens)** e a biblioteca **Passport**. O fluxo de autenticação valida as credenciais do usuário e emite um token assinado digitalmente, que deve ser enviado em todas as requisições subsequentes para identificar o usuário e suas permissões.

Além disso, o sistema utiliza **Bcrypt** para o hash de senhas, garantindo que as credenciais dos usuários nunca sejam armazenadas em texto plano no banco de dados. O controle de acesso baseado em papéis (RBAC - Role-Based Access Control) assegura que apenas usuários autorizados (ex: Professores, Administradores) possam realizar ações sensíveis, como alterar registros de frequência ou cadastrar novas disciplinas.

### 2.2.6 Inteligência Artificial no Desenvolvimento
O desenvolvimento deste projeto beneficiou-se do uso intensivo de ferramentas de Inteligência Artificial Generativa para otimização da produtividade e resolução de problemas complexos. Foram utilizados modelos de linguagem avançados (LLMs) como **Gemini 2.5 Pro**, **Claude 3.5 Sonnet**, **Claude 3.5 Haiku** e **GPT Codex**.

Essas ferramentas atuaram como "assistentes de par" (Pair Programming), auxiliando na geração de *boilerplate* de código, na refatoração de funções para melhor performance, na escrita de testes unitários e na documentação técnica. O uso dessas IAs permitiu acelerar o ciclo de desenvolvimento, permitindo que o foco do trabalho se mantivesse na lógica de negócio e na arquitetura da solução, delegando tarefas repetitivas à automação inteligente.

### 2.2.7 Deploy e Computação em Nuvem
Para disponibilizar a aplicação em ambiente de produção, adotou-se uma estratégia de deploy baseada em serviços de nuvem modernos (PaaS - Platform as a Service), que simplificam a infraestrutura e garantem alta disponibilidade.

O **Frontend** foi hospedado na **Vercel**, plataforma otimizada para aplicações React e frameworks modernos, que oferece integração contínua (CI/CD) automática e uma rede de distribuição de conteúdo (CDN) global para garantir baixa latência no carregamento das páginas.

O **Backend** e o **Banco de Dados** foram implantados na **Railway**. A escolha da Railway se deve à sua facilidade de orquestração de microsserviços e suporte nativo a contêineres Docker. A plataforma gerencia automaticamente o provisionamento do banco de dados PostgreSQL e a execução da API NestJS, permitindo escalabilidade vertical conforme a demanda de uso do sistema aumenta.
