# 🎨 Design de Aulas em Cards - Proposta Visual

## Visão Geral
Aplicar o mesmo padrão premium de cards usado nas turmas para as aulas, mantendo consistência visual e melhorando a experiência do usuário.

## Estrutura de um Lesson Card

```
┌─────────────────────────────────────────────────────────────────┐
│ [Icon] Título Aula                              [Menu Vertical] │ ← Header com gradiente
├─────────────────────────────────────────────────────────────────┤
│ TURMA • DISCIPLINA (metadata)                                   │
│                                                                 │
│ Descrição da aula (se houver, com line-clamp-2)                │
│                                                                 │
│ 15 jan • 08:00 - 09:30                    [Badge: Concluída]   │
└─────────────────────────────────────────────────────────────────┘
```

## Estados Visuais

### 1️⃣ Em Andamento (Aberta)
- Background: Gradiente primary/10 → primary/5
- Icon: FiBookOpen em badge primary
- Badge: "Em andamento" com cor primary
- Status: Aula aberta para registro de presença

### 2️⃣ Concluída
- Background: Gradiente success/10 → success/5
- Icon: FiCheckCircle em badge success
- Badge: "Concluída" com cor success
- Status: Aula já passou e foi finalizada

### 3️⃣ Agendada
- Background: Gradiente warning/10 → warning/5
- Icon: FiClock em badge warning
- Badge: "Agendada" com cor warning
- Status: Aula ainda não iniciou

### 4️⃣ Padrão (Dark mode)
- Background: Gradiente gray-100 → gray-50
- Dark: base-300 → base-200
- Icon: FiClock cinza
- Badge: Cinza 200/50

## Menu Dropdown (Desktop)

```
┌─────────────────────┐
│ ✎ Editar           │
│ 🔓 Abrir (admin)   │
│ 🔒 Fechar (admin)  │
│ 🗑️  Deletar        │
└─────────────────────┘
```

**Aparece:**
- No hover do card
- Clicando no ícone ⋮ (FiMoreVertical)

## Grid Layout

### Desktop (lg:)
- 3 colunas (grid-cols-3) com gap-6
- Cards responsivas com hover effects

### Tablet (md:)
- 2 colunas (grid-cols-2) com gap-5
- Ajuste de padding

### Mobile (sm:)
- 1 coluna (grid-cols-1) com gap-4
- Cards full-width com padding reduzido
- Clique no card abre detalhes em modal

## Interações

### Desktop
- Hover: Shadow aumenta, menu dropdown aparece
- Click no card: Abre modal de detalhes
- Menu dropdown: Editar, Abrir, Fechar, Deletar
- Escape: Fecha o menu

### Mobile
- Tap no card: Abre modal de detalhes
- Menu dropdown: Desliza para lado ou aparece abaixo
- Full viewport: Melhor visualização

## Componentes

### LessonCard.tsx ✅ (Criado)
- Props: lesson, callbacks (onEdit, onDelete, onOpen, onClose, onView)
- Estados: menu dropdown
- Responsividade: Mobile-first
- Dark mode: Completo

### ClassDetailPage.tsx 
**Mudanças:**
- Substituir list-card-item por grid de LessonCard
- Manter filtros (all/finished/scheduled)
- Manter checkbox para seleção múltipla
- Manter delete confirmação

### AulasListPage.tsx
**Mudanças:**
- Remover tabela, usar grid de cards
- Manter filtros (status, data, busca)
- Manter contador de resultados
- Menu de ações no dropdown do card

## CSS Classes

```
Estrutura:
- Container: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6
- Card: rounded-xl border hover:shadow-md transition-all
- Header: border-b px-4 py-4 sm:px-6 sm:py-5
- Body: px-4 py-4 sm:px-6 sm:py-5
- Icon: w-5 h-5 (mobile) / w-6 h-6 (desktop)
- Badge: text-xs font-medium px-2.5 py-1 rounded-full
```

## Variações de Callback

```typescript
// Professor na classe
- onView: Abre modal de presença
- onEdit: Edita aula (se for criador)
- onDelete: Deleta aula

// Admin na lista de aulas
- onView: Abre modal de presença
- onEdit: Edita aula
- onDelete: Deleta aula
- onOpen: Abre para presença
- onClose: Fecha presença
```

## Benefícios

✅ **Consistência Visual**: Mesmo padrão de turmas
✅ **Melhor Espaço**: Cards ocupam melhor o espaço horizontal
✅ **Mobile First**: Adapta bem a telas menores
✅ **Acessibilidade**: Menu mais claro, sem sobrecarregar cards
✅ **Interatividade**: Hover states melhoram feedback
✅ **Escalabilidade**: Fácil adicionar novos campos

## Próximos Passos

1. ✅ Criar componente LessonCard
2. ⏳ Integrar em ClassDetailPage.tsx
3. ⏳ Integrar em AulasListPage.tsx
4. ⏳ Testar responsividade em mobile/tablet/desktop
5. ⏳ Testes e2e para interações
6. ⏳ Merge na branch principal

---

**Deseja que eu proceda com a implementação?**
