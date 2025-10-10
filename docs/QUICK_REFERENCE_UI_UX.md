# 📑 Quick Reference - Melhorias UI/UX

**Acesso Rápido:** Cheatsheet para consulta durante implementação

---

## 🎨 Paleta de Cores (DaisyUI Theme)

### Light Mode
```css
primary:         #1e3a8a  /* Azul acadêmico */
secondary:       #64748b  /* Cinza institucional */
accent:          #0ea5e9  /* Azul claro */
success:         #10b981  /* Verde */
warning:         #f59e0b  /* Amarelo */
error:           #ef4444  /* Vermelho */
info:            #3b82f6  /* Azul info */

base-100:        #ffffff  /* Fundo principal */
base-200:        #f8fafc  /* Fundo alternativo */
base-300:        #e2e8f0  /* Borders */
base-content:    #1e293b  /* Texto */
```

### Dark Mode
```css
primary:         #3b82f6
secondary:       #64748b
accent:          #0ea5e9

base-100:        #0f172a  /* Fundo escuro */
base-200:        #1e293b
base-300:        #334155
base-content:    #f1f5f9  /* Texto claro */
```

---

## 📝 Tipografia (Constants)

```tsx
import { TYPOGRAPHY } from '@/constants/typography';

// Display
<h1 className={TYPOGRAPHY.display.large}>   // 5xl/6xl, font-black
<h1 className={TYPOGRAPHY.display.medium}>  // 4xl/5xl, font-black
<h1 className={TYPOGRAPHY.display.small}>   // 3xl/4xl, font-bold

// Headings
<h1 className={TYPOGRAPHY.h1}>  // 3xl/4xl, font-bold
<h2 className={TYPOGRAPHY.h2}>  // 2xl/3xl, font-bold
<h3 className={TYPOGRAPHY.h3}>  // xl/2xl, font-semibold
<h4 className={TYPOGRAPHY.h4}>  // lg/xl, font-semibold
<h5 className={TYPOGRAPHY.h5}>  // base/lg, font-semibold

// Body
<p className={TYPOGRAPHY.bodyLarge}>  // text-lg
<p className={TYPOGRAPHY.body}>       // text-base
<p className={TYPOGRAPHY.bodySmall}>  // text-sm

// Captions
<span className={TYPOGRAPHY.caption}>      // text-sm + opacity-70
<span className={TYPOGRAPHY.captionSmall}> // text-xs + opacity-60
```

---

## 🧩 Componentes DaisyUI (Padronizados)

### Buttons
```tsx
// Variantes
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-outline">Outline</button>

// Tamanhos
<button className="btn btn-xs">XS</button>
<button className="btn btn-sm">Small</button>
<button className="btn btn-md">Medium</button>
<button className="btn btn-lg">Large</button>

// Estados
<button className="btn btn-primary" disabled>Disabled</button>
<button className="btn btn-primary">
  <span className="loading loading-spinner loading-sm" />
  Loading
</button>

// Com ícone
<button className="btn btn-primary gap-2">
  <FiSave /> Salvar
</button>
```

### Cards
```tsx
// Card básico
<div className="card bg-base-100 shadow-md border border-base-300">
  <div className="card-body">
    <h2 className="card-title">Título</h2>
    <p>Conteúdo</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Ação</button>
    </div>
  </div>
</div>

// Stat Card
<div className="stat-card-premium">
  <div className="flex items-center gap-4">
    <div className="stat-card-icon">
      <FiUsers />
    </div>
    <div>
      <div className="stat-card-value">128</div>
      <div className="stat-card-label">Usuários</div>
    </div>
  </div>
</div>
```

### Forms
```tsx
<div className="form-control">
  <label className="label">
    <span className="label-text">Email</span>
  </label>
  <input 
    type="email" 
    placeholder="email@example.com"
    className="input input-bordered w-full" 
  />
  <label className="label">
    <span className="label-text-alt">Helper text</span>
  </label>
</div>

// Com erro
<input 
  className="input input-bordered input-error w-full"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" className="text-error text-sm">
  Email inválido
</span>
```

### Loading
```tsx
// Spinner
<span className="loading loading-spinner loading-lg" />

// Skeleton
<div className="skeleton h-32 w-full" />
<div className="skeleton h-4 w-28" />
<div className="skeleton h-4 w-full" />
```

### Alerts
```tsx
<div className="alert alert-info">
  <svg>...</svg>
  <span>Info message</span>
</div>

<div className="alert alert-success">...</div>
<div className="alert alert-warning">...</div>
<div className="alert alert-error">...</div>
```

---

## 📐 Layouts Responsivos

### Grids
```tsx
// 1 → 2 → 3 colunas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// 1 → 2 → 4 colunas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

// Auto-fit (ajusta automaticamente)
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
```

### Flexbox
```tsx
// Stack horizontal → vertical
<div className="flex flex-col sm:flex-row gap-4">

// Center
<div className="flex items-center justify-center min-h-screen">

// Between
<div className="flex items-center justify-between">
```

### Container
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Conteúdo */}
</div>
```

---

## 🎭 Estados e Feedback

### Toast (Sonner)
```tsx
import { toast } from '@/lib/toast';

// Success
toast.success('Sucesso!', 'Operação completada');

// Error
toast.error('Erro!', 'Algo deu errado');

// Warning
toast.warning('Atenção!', 'Verifique os dados');

// Info
toast.info('Info', 'Informação importante');

// Loading
const toastId = toast.loading('Carregando...');
// ... operação
toast.success('Concluído!', { id: toastId });

// Promise
toast.promise(fetchData(), {
  loading: 'Carregando...',
  success: 'Dados carregados!',
  error: 'Erro ao carregar',
});
```

### Skeletons
```tsx
import { TableSkeleton, CardSkeleton } from '@/components/common/Skeletons';

{isLoading ? <TableSkeleton /> : <DataTable data={data} />}
{isLoading ? <CardSkeleton /> : <Card {...props} />}
```

### Empty States
```tsx
import { EmptyState } from '@/components/common/EmptyState';

<EmptyState
  icon={<FiInbox />}
  title="Nenhum curso encontrado"
  description="Comece criando seu primeiro curso"
  action={
    <button className="btn btn-primary">
      <FiPlus /> Criar Curso
    </button>
  }
/>
```

---

## ♿ Acessibilidade (A11y)

### ARIA Labels
```tsx
// Ícones sem texto
<FiUsers aria-label="Usuários" role="img" />

// Botões
<button aria-label="Fechar modal">
  <FiX />
</button>

// Forms
<input 
  aria-describedby="email-help"
  aria-invalid={!!errors.email}
  aria-required="true"
/>
<span id="email-help">Digite seu email</span>
```

### Focus States
```tsx
// Sempre visível
<button className="focus:outline-none focus:ring-4 focus:ring-primary/50">

// Focus-visible (só teclado)
<a className="focus-visible:ring-4 focus-visible:ring-primary/50">
```

### Skip to Content
```tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white"
>
  Pular para conteúdo principal
</a>

<main id="main-content">
  {/* Conteúdo */}
</main>
```

### Keyboard Navigation
```tsx
// Tab order
<input tabIndex={0} />
<button tabIndex={1} />
<a tabIndex={2} />

// Modal - trap focus
import { FocusTrap } from '@/components/common/FocusTrap';

<FocusTrap active={isOpen}>
  <div className="modal">...</div>
</FocusTrap>
```

---

## 📱 Breakpoints

```tsx
// Tailwind breakpoints
sm:  640px   // Mobile landscape
md:  768px   // Tablet
lg:  1024px  // Desktop
xl:  1280px  // Large desktop
2xl: 1536px  // Extra large

// Uso
<div className="text-sm sm:text-base lg:text-lg">
  Texto responsivo
</div>

<div className="p-4 sm:p-6 lg:p-8">
  Padding responsivo
</div>
```

---

## 🎨 Utilities Comuns

### Spacing
```tsx
// Padding
p-4    // 16px todos os lados
px-4   // 16px horizontal
py-4   // 16px vertical
pt-4   // 16px top

// Margin
m-4    // 16px todos os lados
mx-auto // Centralizar horizontal
-mt-4  // -16px top (negative)

// Gap (Flex/Grid)
gap-4   // 16px
gap-x-4 // 16px horizontal
gap-y-4 // 16px vertical
```

### Text
```tsx
// Truncate
truncate              // 1 linha com ellipsis
line-clamp-2          // 2 linhas
line-clamp-3          // 3 linhas

// Alignment
text-left
text-center
text-right

// Weight
font-normal    // 400
font-medium    // 500
font-semibold  // 600
font-bold      // 700
font-black     // 900
```

### Colors
```tsx
// Text
text-base-content           // Texto padrão
text-base-content/70        // 70% opacity
text-primary                // Cor primária
text-error                  // Cor de erro

// Background
bg-base-100                 // Fundo principal
bg-base-200                 // Fundo alternativo
bg-primary                  // Fundo primário
bg-primary/10               // 10% opacity
```

### Transitions
```tsx
transition-all duration-200
transition-colors duration-300
transition-transform duration-300

// Hover
hover:scale-105
hover:-translate-y-1
hover:shadow-xl
```

---

## 🚨 Anti-Patterns (EVITAR)

### ❌ NÃO FAZER
```tsx
// Cores hardcoded
<div className="bg-blue-500 text-white">

// Tailwind puro para componentes complexos
<button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">

// Mistura de sistemas
<div className="btn-premium card-shadow gradient-bg">

// Sem responsividade
<div className="p-8 text-2xl">

// Sem acessibilidade
<button><FiX /></button>  // Sem aria-label
```

### ✅ FAZER
```tsx
// DaisyUI colors
<div className="bg-primary text-primary-content">

// Componentes DaisyUI
<button className="btn btn-primary">

// Sistema unificado
<div className="btn btn-primary shadow-lg">

// Mobile-first
<div className="p-4 sm:p-6 lg:p-8 text-base sm:text-lg lg:text-xl">

// Acessível
<button aria-label="Fechar"><FiX /></button>
```

---

## 📚 Links Úteis

- **DaisyUI Docs:** https://daisyui.com/docs/
- **Tailwind Docs:** https://tailwindcss.com/docs
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **axe DevTools:** https://www.deque.com/axe/devtools/

---

## 🔧 Comandos Úteis

```bash
# Rodar dev server
npm run dev

# Build para produção
npm run build

# Lighthouse audit
npm run lighthouse

# Testes
npm run test

# Coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

---

**Última Atualização:** 07/10/2025  
**Versão:** 1.0

