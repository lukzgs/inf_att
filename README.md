# inf_att - Sistema de Controle de Frequência Acadêmica

Sistema completo de controle de presença para instituições de ensino, desenvolvido com NestJS (backend) e React (frontend).

---

## 📚 Documentação

A documentação completa do projeto está organizada em `/docs/`:

- **[📋 Implementações](./docs/implementacoes/README.md)** - Histórico cronológico de todas as implementações
- **[📖 Documentação Geral](./docs/README.md)** - Visão geral, arquitetura e guias

### Implementações Recentes
- **IMPL-20251002-1740-001** - Controle de Aulas e Auditoria de Presença
- **IMPL-20251001-AUTH** - Sistema JWT com Refresh Tokens
- **IMPL-20251001-TRAT** - Tratamento de Erros Global

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Docker (opcional)

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Com Docker
```bash
docker-compose up
```

---

## 📂 Estrutura do Projeto

```
inf_att/
├── docs/                          # 📚 Documentação centralizada
│   ├── README.md                  # Visão geral da documentação
│   └── implementacoes/            # Histórico de implementações
│       ├── README.md              # Índice cronológico
│       ├── IMPL-*-TRAT-*.md      # Tratamento de erros
│       ├── IMPL-*-AUTH-*.md      # Autenticação JWT
│       └── IMPL-*-controle-*.md  # Controle de aulas
│
├── backend/                       # 🔴 API NestJS
│   ├── prisma/                    # Schema e migrations
│   ├── src/                       # Código fonte
│   └── [arquivos de implementação] # Docs originais
│
├── frontend/                      # 🔵 App React
│   ├── src/                       # Código fonte
│   └── [arquivos de análise]     # Docs de frontend
│
└── docker-compose.yml             # 🐳 Configuração Docker
```

---

## 🔧 Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação de API

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **DaisyUI** - Componentes

---

## 📊 Status do Projeto

### ✅ Concluído
- Sistema de autenticação JWT
- Controle de abertura/fechamento de aulas
- Auditoria de presença
- Tratamento de erros global
- Dashboards por tipo de usuário (Admin, Professor, Aluno)

### 🔄 Em Andamento
- Páginas CRUD (frontend)
- Fluxo de registro de presença
- Testes E2E

### ⏳ Planejado
- Relatórios avançados
- Notificações
- Exportação de dados

---

## 📖 Para Desenvolvedores

### Primeira vez no projeto?
1. Leia a [documentação principal](./docs/README.md)
2. Consulte o [índice de implementações](./docs/implementacoes/README.md)
3. Leia as implementações na ordem: TRAT → AUTH → Controle de Aulas

### Implementando algo novo?
1. Consulte o padrão de documentação em `docs/implementacoes/README.md`
2. Crie documento com código cronológico `IMPL-YYYYMMDD-HHmm-XXX`
3. Atualize o índice

---

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Leia a documentação em `/docs/`
2. Siga os padrões estabelecidos nas implementações anteriores
3. Documente suas mudanças no formato `IMPL-*`
4. Atualize o índice de implementações

---

## 📄 Licença

[Definir licença]

---

**Última atualização**: 02/10/2025
