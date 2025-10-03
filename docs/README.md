# 📚 Documentação do Sistema de Controle de Frequência

Bem-vindo à documentação centralizada do projeto **inf_att** (Sistema de Controle de Frequência Acadêmica).

---

## 📂 Estrutura da Documentação

```
docs/
├── README.md                          # Este arquivo
├── implementacoes/                    # 📋 Histórico de implementações
│   ├── README.md                      # Índice cronológico de todas as implementações
│   ├── IMPL-20251001-TRAT-*.md       # Tratamento de Erros
│   ├── IMPL-20251001-AUTH-*.md       # Sistema JWT com Refresh Tokens
│   └── IMPL-20251002-1740-001-*.md   # Controle de Aulas e Auditoria
│
└── [futuras pastas]
    ├── arquitetura/                   # Diagramas e decisões arquiteturais
    ├── api/                           # Documentação de endpoints
    └── guias/                         # Guias de desenvolvimento
```

---

## 🎯 Navegação Rápida

### Para Desenvolvedores

#### 📋 Implementações Recentes
Consulte o histórico completo em [`implementacoes/README.md`](./implementacoes/README.md)

**Últimas 3 implementações**:
1. **IMPL-20251002-1740-001** - Controle de Aulas e Auditoria de Presença (🔴 Crítico MVP)
2. **IMPL-20251001-AUTH** - Sistema de Autenticação JWT com Refresh Tokens
3. **IMPL-20251001-TRAT** - Tratamento de Erros Global

#### 🚀 Como começar?

1. **Primeira vez no projeto?**
   - Leia as implementações na ordem: TRAT → AUTH → Controle de Aulas
   - Entenda a arquitetura antes de modificar

2. **Precisa implementar algo novo?**
   - Consulte o padrão em `implementacoes/README.md`
   - Crie documento com código cronológico `IMPL-YYYYMMDD-HHmm-XXX`
   - Atualize o índice

3. **Encontrando bugs?**
   - Verifique o histórico de implementações relacionadas
   - Use o código de implementação para rastrear mudanças

---

## 📖 Documentos por Categoria

### 🔴 Backend

#### Infraestrutura
- [`IMPL-20251001-TRAT`](./implementacoes/IMPL-20251001-TRAT-tratamento-erros.md) - Sistema de tratamento de erros e logging

#### Autenticação & Segurança
- [`IMPL-20251001-AUTH`](./implementacoes/IMPL-20251001-AUTH-jwt-refresh.md) - JWT com Access e Refresh Tokens

#### Core Business Logic
- [`IMPL-20251002-1740-001`](./implementacoes/IMPL-20251002-1740-001-controle-aulas.md) - Controle de abertura/fechamento de aulas e auditoria de presença

#### Localização dos Arquivos Originais
Os arquivos de implementação também estão disponíveis em:
- Backend: `/backend/IMPLEMENTACAO_*.md`
- Frontend: `/frontend/RELATORIO_*.md` e `/frontend/NECESSIDADES_*.md`

---

## 🔍 Busca de Implementações

### Por Data
```bash
# Implementações de outubro de 2025
grep -r "IMPL-202510" docs/implementacoes/

# Implementações de um dia específico
grep -r "IMPL-20251002" docs/implementacoes/
```

### Por Categoria
```bash
# Autenticação
grep -r "AUTH" docs/implementacoes/

# Core Business
grep -r "Core Business" docs/implementacoes/
```

### Por Status
```bash
# Implementações concluídas
grep -r "✅ Concluído" docs/implementacoes/

# Em andamento
grep -r "🔄 Em Andamento" docs/implementacoes/
```

---

## 📝 Convenções e Padrões

### Nomenclatura de Arquivos

#### Implementações
```
IMPL-YYYYMMDD-HHmm-XXX-descricao-curta.md
│    │        │    │   │
│    │        │    │   └─ Descrição legível (kebab-case)
│    │        │    └───── Sequencial (001, 002, etc.)
│    │        └────────── Hora:Minuto (opcional para legado)
│    └─────────────────── Data (Ano/Mês/Dia)
└──────────────────────── Prefixo Implementation
```

**Exemplos**:
- ✅ `IMPL-20251002-1740-001-controle-aulas.md`
- ✅ `IMPL-20251001-AUTH-jwt-refresh.md`
- ✅ `IMPL-20251003-0915-002-crud-usuarios.md`

#### Relatórios e Análises
```
RELATORIO-nome-do-relatorio.md
ANALISE-nome-da-analise.md
NECESSIDADES-contexto.md
```

### Estrutura Padrão de Documento de Implementação

Todo documento de implementação deve conter:

1. **Cabeçalho com Metadados**
   ```markdown
   ## 📋 Metadados da Implementação
   | Campo | Valor |
   |-------|-------|
   | **Código** | `IMPL-YYYYMMDD-HHmm-XXX` |
   | **Data** | DD/MM/YYYY às HH:MM |
   | **Categoria** | Categoria / Subcategoria |
   | **Prioridade** | 🔴/🟡/🟢 |
   | **Status** | ✅/🔄/⏳ |
   ```

2. **Resumo Executivo**
   - O que foi implementado
   - Por que foi necessário
   - Impacto no sistema

3. **Problema Original** (se aplicável)
   - Situação antes da implementação

4. **Solução Implementada**
   - Detalhes técnicos
   - Código relevante
   - Decisões arquiteturais

5. **Arquivos Modificados**
   - Lista completa com paths

6. **Endpoints/APIs** (se aplicável)
   - Novos endpoints criados
   - Modificações em endpoints existentes

7. **Migration** (se aplicável)
   - Nome da migration
   - Alterações no schema

8. **Dependências**
   - Outras implementações relacionadas
   - Bibliotecas adicionadas

9. **Próximos Passos**
   - O que falta fazer
   - Melhorias futuras

10. **Status Final**
    - Checklist de conclusão

---

## 🎨 Frontend

### Documentação Disponível
- **RELATORIO_ESTADO_ATUAL.md** - Análise do estado atual do frontend
- **RELATORIO_MELHORES_PRATICAS.md** - Guia de boas práticas React/TypeScript
- **DESIGN_SYSTEM_GUIDE.md** - Sistema de design e componentes
- **NECESSIDADES_ADMIN.md** - Requisitos completos do admin
- **NECESSIDADES_ADMIN_MVP.md** - Requisitos simplificados para MVP

---

## 🗺️ Roadmap do Projeto

### ✅ Fase 1 - Fundação (Concluída)
- [x] Tratamento de erros global
- [x] Autenticação JWT com refresh tokens
- [x] Controle de aulas e auditoria de presença

### 🔄 Fase 2 - MVP Core (Em Andamento)
- [ ] Frontend: Páginas CRUD (Usuários, Cursos, Disciplinas, Turmas)
- [ ] Frontend: Fluxo de registro de presença
- [ ] Backend: Validações de regras de negócio
- [ ] Testes E2E

### ⏳ Fase 3 - Melhorias (Planejada)
- [ ] Dashboard com gráficos
- [ ] Relatórios avançados
- [ ] Notificações por email
- [ ] Exportação de dados

---

## 🤝 Como Contribuir

### Adicionando Nova Implementação

1. **Crie o documento**:
   ```bash
   cd docs/implementacoes
   touch IMPL-$(date +%Y%m%d-%H%M)-XXX-sua-feature.md
   ```

2. **Use o template padrão** (veja estrutura acima)

3. **Atualize o README.md**:
   - Adicione entrada no índice cronológico
   - Atualize estatísticas
   - Adicione às próximas implementações se necessário

4. **Commit com mensagem descritiva**:
   ```bash
   git add docs/implementacoes/
   git commit -m "docs: adiciona IMPL-YYYYMMDD-HHmm-XXX - Sua Feature"
   ```

### Modificando Implementação Existente

- **NÃO** modifique documentos de implementação concluídos
- Crie um **novo documento** se for uma evolução/refatoração
- Referencie o código da implementação original

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| Total de Implementações | 3 |
| Backend | 3 |
| Frontend | 0 |
| Migrations | 3 |
| Endpoints Criados | ~15 |

**Última atualização**: 02/10/2025 às 17:50

---

## 📞 Suporte

- **Dúvidas sobre implementações?** Consulte o código da implementação no índice
- **Encontrou inconsistências?** Verifique a data da implementação vs. estado atual
- **Precisa de contexto histórico?** Leia os documentos em ordem cronológica

---

## 🔗 Links Úteis

### Documentação Externa
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Repositório
- [GitHub](https://github.com/lukzgs/inf_att) (se aplicável)

---

**Mantenha esta documentação atualizada! 📝**

Cada implementação é uma peça da história do projeto. Documente bem para facilitar manutenção e onboarding de novos desenvolvedores.
