# 🗺️ Mapa Completo da Documentação

Este arquivo lista **TODOS** os documentos disponíveis no projeto, organizados por localização e propósito.

**Total**: 24 arquivos markdown

---

## 📂 Raiz do Projeto (1 arquivo)

### `/README.md` ✨ ATUALIZADO
- **Propósito**: README principal do projeto
- **Conteúdo**: 
  - Visão geral do sistema
  - Links para documentação em `/docs/`
  - Como executar (backend, frontend, docker)
  - Tecnologias utilizadas
  - Status do projeto e roadmap
- **Público**: Novos desenvolvedores, visitantes do repositório
- **Link**: [README.md](../README.md)

---

## 📚 Documentação Centralizada (7 arquivos)

### `/docs/`

#### `/docs/README.md` ✨ NOVO
- **Propósito**: Hub principal de toda documentação
- **Conteúdo**:
  - Navegação por categoria
  - Busca de implementações
  - Convenções e padrões
  - Roadmap do projeto
  - Guia de contribuição
- **Público**: Todos os desenvolvedores
- **Link**: [docs/README.md](./README.md)

#### `/docs/ESTRUTURA.md` ✨ NOVO
- **Propósito**: Visualização da estrutura de organização
- **Conteúdo**:
  - Árvore de diretórios visual
  - Explicação da organização
  - Padrões de nomenclatura
  - Benefícios da estrutura
  - Checklist de manutenção
- **Público**: Desenvolvedores que precisam adicionar documentação
- **Link**: [docs/ESTRUTURA.md](./ESTRUTURA.md)

#### `/docs/GUIA_RAPIDO.md` ✨ NOVO
- **Propósito**: Guia rápido de uso da nova estrutura
- **Conteúdo**:
  - Resumo do que foi criado
  - Antes vs Depois
  - Como buscar documentação
  - Como adicionar nova implementação
  - Próximos passos
- **Público**: Desenvolvedores do dia-a-dia
- **Link**: [docs/GUIA_RAPIDO.md](./GUIA_RAPIDO.md)

#### `/docs/MAPA_DOCUMENTACAO.md` (Este arquivo) ✨ NOVO
- **Propósito**: Índice completo de TODOS os documentos
- **Conteúdo**: Lista de 24 arquivos markdown do projeto
- **Público**: Quem procura um documento específico

### `/docs/implementacoes/` (4 arquivos)

#### `/docs/implementacoes/README.md` ✨ NOVO
- **Propósito**: Índice cronológico de implementações
- **Conteúdo**:
  - Lista de implementações por data
  - Metadados (código, categoria, prioridade, status)
  - Estatísticas por categoria
  - Como buscar implementações
  - Próximas implementações planejadas
- **Público**: Desenvolvedores que precisam entender o histórico
- **Link**: [docs/implementacoes/README.md](./implementacoes/README.md)

#### `/docs/implementacoes/IMPL-20251001-TRAT-tratamento-erros.md` ✨ ORGANIZADO
- **Código**: `IMPL-20251001-TRAT`
- **Data**: ~Outubro 2025 (estimada)
- **Categoria**: Infraestrutura / Error Handling
- **Conteúdo**:
  - Exception Filter Global
  - Prisma Error Handler
  - Logger Service
  - Try-Catch em services
- **Arquivos**: 13.6 KB
- **Link**: [IMPL-20251001-TRAT](./implementacoes/IMPL-20251001-TRAT-tratamento-erros.md)

#### `/docs/implementacoes/IMPL-20251001-AUTH-jwt-refresh.md` ✨ ORGANIZADO
- **Código**: `IMPL-20251001-AUTH`
- **Data**: ~Outubro 2025 (estimada)
- **Categoria**: Autenticação / Segurança
- **Conteúdo**:
  - Sistema JWT completo
  - Access tokens (1h)
  - Refresh tokens (7d)
  - Armazenamento em banco
  - Endpoints de logout
- **Migration**: `20251001213638_add_refresh_token`
- **Arquivos**: 9.6 KB
- **Link**: [IMPL-20251001-AUTH](./implementacoes/IMPL-20251001-AUTH-jwt-refresh.md)

#### `/docs/implementacoes/IMPL-20251002-1740-001-controle-aulas.md` ✨ ORGANIZADO
- **Código**: `IMPL-20251002-1740-001`
- **Data**: 02/10/2025 às 17:40 (precisa)
- **Categoria**: Core Business Logic / MVP
- **Prioridade**: 🔴 Crítico
- **Conteúdo**:
  - Controle de abertura/fechamento de aulas
  - Campos: isOpen, openedAt, closedAt, openedBy
  - Auditoria de presença
  - Campos: editedBy, editReason, editedAt
  - Soft-delete de cursos (isActive)
  - Endpoints: PATCH /aulas/:id/open, PATCH /aulas/:id/close
- **Migration**: `20251002115054_add_lesson_controls_attendance_audit_course_active`
- **Arquivos**: 8.9 KB
- **Link**: [IMPL-20251002-1740-001](./implementacoes/IMPL-20251002-1740-001-controle-aulas.md)

---

## 🔴 Backend (9 arquivos)

### `/backend/`

#### `/backend/README.md`
- **Propósito**: Documentação do backend
- **Conteúdo**: Setup, estrutura, tecnologias

#### `/backend/INSTALL.md`
- **Propósito**: Guia de instalação
- **Conteúdo**: Passo a passo para configurar o ambiente

#### `/backend/ANALISE_SCHEMA_MVP.md`
- **Propósito**: Análise do schema Prisma vs. necessidades MVP
- **Conteúdo**:
  - Comparação completa
  - 3 mudanças críticas identificadas
  - Descoberta: backend 90% pronto
  - Exemplos de código
- **Arquivos**: 461 linhas
- **Relacionado**: Base para IMPL-20251002-1740-001

#### `/backend/RELATORIO_ANALISE_BACKEND.md`
- **Propósito**: Relatório de análise do backend
- **Conteúdo**: Estado atual, pontos fortes, melhorias

### Implementações Originais (mantidas para backward compatibility)

#### `/backend/IMPLEMENTACAO_TRATAMENTO_ERROS.md`
- **Original de**: `IMPL-20251001-TRAT`
- **Status**: Copiado para `/docs/implementacoes/`
- **Mantido para**: Backward compatibility

#### `/backend/IMPLEMENTACAO_JWT_REFRESH.md`
- **Original de**: `IMPL-20251001-AUTH`
- **Status**: Copiado para `/docs/implementacoes/`
- **Mantido para**: Backward compatibility

#### `/backend/IMPLEMENTACAO_CONTROLE_AULAS.md`
- **Original de**: `IMPL-20251002-1740-001`
- **Status**: Copiado para `/docs/implementacoes/`
- **Mantido para**: Backward compatibility

#### `/backend/INDICE_IMPLEMENTACOES.md`
- **Original de**: Índice cronológico
- **Status**: Copiado para `/docs/implementacoes/README.md`
- **Mantido para**: Backward compatibility

### Módulos

#### `/backend/src/health/README.md`
- **Propósito**: Documentação do módulo Health Check
- **Conteúdo**: Como usar o endpoint de health

---

## 🔵 Frontend (7 arquivos)

### `/frontend/`

#### `/frontend/README.md`
- **Propósito**: Documentação do frontend
- **Conteúdo**: Setup, estrutura, tecnologias

#### `/frontend/DESIGN_SYSTEM_GUIDE.md`
- **Propósito**: Guia do sistema de design
- **Conteúdo**:
  - Card system (premium-card, gradient-glow, etc.)
  - Cores e temas
  - Componentes reutilizáveis
  - Convenções de estilo

#### `/frontend/RELATORIO_ESTADO_ATUAL.md`
- **Propósito**: Análise do estado atual do frontend
- **Conteúdo**:
  - Componentes existentes
  - Páginas implementadas
  - O que falta fazer

#### `/frontend/RELATORIO_ANALISE_FRONTEND.md`
- **Propósito**: Análise técnica do frontend
- **Conteúdo**: Arquitetura, padrões, melhorias

#### `/frontend/RELATORIO_MELHORES_PRATICAS.md`
- **Propósito**: Guia de boas práticas
- **Conteúdo**:
  - Padrões React/TypeScript
  - Estrutura de componentes
  - Gerenciamento de estado
  - Performance

#### `/frontend/NECESSIDADES_ADMIN.md`
- **Propósito**: Requisitos completos do admin
- **Conteúdo**:
  - 120+ features listadas
  - 6 categorias principais
  - Funcionalidades avançadas

#### `/frontend/NECESSIDADES_ADMIN_MVP.md`
- **Propósito**: Requisitos simplificados para MVP
- **Conteúdo**:
  - ~20 features essenciais
  - Foco em registro rápido (<10s)
  - 5 sprints (8-12 semanas)
  - Prioridades claras

---

## 📊 Estatísticas por Categoria

| Categoria | Quantidade | % do Total |
|-----------|-----------|-----------|
| **Documentação Central** (`/docs/`) | 7 | 29% |
| **Backend** | 9 | 38% |
| **Frontend** | 7 | 29% |
| **Raiz** | 1 | 4% |
| **TOTAL** | **24** | **100%** |

### Por Tipo de Documento

| Tipo | Quantidade |
|------|-----------|
| README.md | 6 |
| Implementações | 6 (3 em docs + 3 originais) |
| Relatórios/Análises | 5 |
| Guias | 5 |
| Outros | 2 |

---

## 🔍 Como Encontrar um Documento

### Por Propósito

**Quero entender o projeto**:
1. `/README.md` (raiz)
2. `/docs/README.md`
3. `/docs/implementacoes/README.md`

**Quero ver implementações**:
1. `/docs/implementacoes/README.md` (índice)
2. `/docs/implementacoes/IMPL-*.md` (implementações específicas)

**Quero documentação de backend**:
1. `/backend/README.md` (overview)
2. `/backend/ANALISE_SCHEMA_MVP.md` (schema)
3. `/docs/implementacoes/IMPL-*.md` (histórico)

**Quero documentação de frontend**:
1. `/frontend/README.md` (overview)
2. `/frontend/DESIGN_SYSTEM_GUIDE.md` (design)
3. `/frontend/NECESSIDADES_ADMIN_MVP.md` (requisitos)

### Por Data/Código

**Implementações cronológicas**:
```bash
# Todas implementações
ls -lh docs/implementacoes/IMPL-*

# Por data específica
ls docs/implementacoes/IMPL-20251002*

# Por categoria
ls docs/implementacoes/*AUTH*
ls docs/implementacoes/*TRAT*
```

### Por Palavra-chave

```bash
# Buscar "JWT" em toda documentação
grep -r "JWT" docs/

# Buscar "auditoria"
grep -r "auditoria" docs/

# Buscar "MVP"
grep -r "MVP" frontend/
```

---

## 📝 Ordem de Leitura Recomendada

### Para Novos Desenvolvedores

1. **Visão Geral**:
   - `/README.md` - Entender o projeto
   - `/docs/README.md` - Estrutura de documentação
   - `/docs/GUIA_RAPIDO.md` - Como navegar

2. **Backend**:
   - `/backend/README.md` - Setup
   - `/docs/implementacoes/IMPL-20251001-TRAT-*.md` - Tratamento de erros
   - `/docs/implementacoes/IMPL-20251001-AUTH-*.md` - Autenticação
   - `/docs/implementacoes/IMPL-20251002-1740-001-*.md` - Controle de aulas
   - `/backend/ANALISE_SCHEMA_MVP.md` - Schema do banco

3. **Frontend**:
   - `/frontend/README.md` - Setup
   - `/frontend/DESIGN_SYSTEM_GUIDE.md` - Design system
   - `/frontend/NECESSIDADES_ADMIN_MVP.md` - Requisitos MVP
   - `/frontend/RELATORIO_MELHORES_PRATICAS.md` - Boas práticas

### Para Quem Vai Implementar

1. **Entender o histórico**:
   - `/docs/implementacoes/README.md` - Índice cronológico
   - Ler implementações relacionadas na ordem

2. **Entender requisitos**:
   - `/frontend/NECESSIDADES_ADMIN_MVP.md` - MVP
   - `/backend/ANALISE_SCHEMA_MVP.md` - Mudanças no banco

3. **Seguir padrões**:
   - `/docs/ESTRUTURA.md` - Organização
   - `/frontend/RELATORIO_MELHORES_PRATICAS.md` - Código
   - Implementações anteriores - Referência

---

## 🆕 Documentos Criados Recentemente

### 02/10/2025 (Hoje)

| Arquivo | Hora | Tamanho | Status |
|---------|------|---------|--------|
| `/docs/README.md` | ~18:00 | 8.1 KB | ✨ Novo |
| `/docs/ESTRUTURA.md` | ~18:05 | Médio | ✨ Novo |
| `/docs/GUIA_RAPIDO.md` | ~18:10 | Grande | ✨ Novo |
| `/docs/MAPA_DOCUMENTACAO.md` | ~18:15 | Este arquivo | ✨ Novo |
| `/docs/implementacoes/README.md` | ~18:00 | 6.6 KB | ✨ Novo |
| `/docs/implementacoes/IMPL-20251002-1740-001-*.md` | 17:40 | 8.9 KB | ✨ Implementação |

### Arquivos Organizados

| Arquivo Original | Novo Local | Status |
|-----------------|-----------|--------|
| `backend/IMPLEMENTACAO_TRATAMENTO_ERROS.md` | `docs/implementacoes/IMPL-20251001-TRAT-*.md` | ✨ Copiado |
| `backend/IMPLEMENTACAO_JWT_REFRESH.md` | `docs/implementacoes/IMPL-20251001-AUTH-*.md` | ✨ Copiado |
| `backend/IMPLEMENTACAO_CONTROLE_AULAS.md` | `docs/implementacoes/IMPL-20251002-1740-001-*.md` | ✨ Copiado |
| `backend/INDICE_IMPLEMENTACOES.md` | `docs/implementacoes/README.md` | ✨ Copiado |

---

## 🔄 Manutenção deste Mapa

**Atualizar quando**:
- [ ] Novo arquivo markdown criado
- [ ] Arquivo renomeado ou movido
- [ ] Nova pasta de documentação criada
- [ ] Implementação concluída

**Como atualizar**:
```bash
# 1. Listar todos os .md
find . -type f -name "*.md" ! -path "*/node_modules/*" | sort

# 2. Adicionar à lista apropriada neste arquivo

# 3. Atualizar estatísticas

# 4. Atualizar data de "Última atualização"
```

---

## 🔗 Links Rápidos

- [README Principal](../README.md)
- [Hub de Documentação](./README.md)
- [Índice de Implementações](./implementacoes/README.md)
- [Guia Rápido](./GUIA_RAPIDO.md)
- [Estrutura de Organização](./ESTRUTURA.md)
- [Última Implementação](./implementacoes/IMPL-20251002-1740-001-controle-aulas.md)

---

**Criado em**: 02/10/2025 às 18:15  
**Total de documentos**: 24 arquivos markdown  
**Última atualização**: 02/10/2025 às 18:15
