# Guia de Estilo - Design System INF_ATT

## 📋 Índice
1. [Filosofia](#filosofia)
2. [Estrutura](#estrutura)
3. [Componentes](#componentes)
4. [Cores](#cores)
5. [Tipografia](#tipografia)
6. [Espaçamento](#espaçamento)
7. [Padrões de Uso](#padrões-de-uso)
8. [Convenções de Código](#convenções-de-código)

---

## 🎨 Filosofia

### Princípios

1. **DaisyUI First**: Use componentes DaisyUI como base sempre que possível
2. **Consistência**: Mesmo visual e comportamento em toda a aplicação
3. **Responsividade**: Mobile-first, adaptar para todas as telas
4. **Acessibilidade**: ARIA labels, keyboard navigation, contraste adequado
5. **Performance**: Componentes leves e otimizados

### Quando usar cada abordagem

```tsx
// ✅ PREFERIDO: DaisyUI puro
<button className="btn btn-primary">Salvar</button>

// ✅ BOM: DaisyUI + Tailwind para ajustes
<button className="btn btn-primary gap-2">
  <FiSave /> Salvar
</button>

// ⚠️ USAR COM MODERAÇÃO: Componente custom com CVA
<Button variant="primary" size="lg">Salvar</Button>

// ❌ EVITAR: Tailwind puro para componentes complexos
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Salvar
</button>
```

---

## 🏗️ Estrutura

### Organização de Arquivos

```
src/
├── components/
│   ├── common/          # Componentes reutilizáveis base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   └── StatCard.tsx
│   ├── layout/          # Componentes de layout
│   └── [feature]/       # Componentes específicos de features
├── constants/
│   └── design.ts        # Tokens de design centralizados
├── pages/               # Páginas da aplicação
├── layouts/             # Layouts de página
└── styles/
    └── globals.css      # Estilos globais e DaisyUI config
```

### Design Tokens (`src/constants/design.ts`)

Centralize todos os tokens de design:

```tsx
import { COLORS, COMPONENT_CLASSES, LAYOUTS, SPACING } from '@/constants/design';

// Uso em componentes
<div className={LAYOUTS.flexBetween}>
  <h1 className={COLORS.primary}>Título</h1>
</div>
```

---

## 🧩 Componentes

### Componentes DaisyUI

#### Button

```tsx
// Variantes
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-link">Link</button>

// Tamanhos
<button className="btn btn-xs">Extra Small</button>
<button className="btn btn-sm">Small</button>
<button className="btn btn-md">Medium (default)</button>
<button className="btn btn-lg">Large</button>

// Estados
<button className="btn btn-primary" disabled>Disabled</button>
<button className="btn btn-primary">
  <span className="loading loading-spinner"></span>
  Loading
</button>

// Larguras especiais
<button className="btn btn-wide">Wide</button>
<button className="btn btn-block">Block (full width)</button>

// Formas
<button className="btn btn-square">□</button>
<button className="btn btn-circle">○</button>
```

#### Input & Form

```tsx
// Form Control Structure
<div className="form-control">
  <label className="label">
    <span className="label-text">Label</span>
    <span className="label-text-alt">Alt label</span>
  </label>
  <input 
    type="text" 
    placeholder="Digite aqui" 
    className="input input-bordered w-full" 
  />
  <label className="label">
    <span className="label-text-alt">Helper text</span>
  </label>
</div>

// Input variants
<input className="input input-bordered" />
<input className="input input-bordered input-primary" />
<input className="input input-bordered input-error" />
<input className="input input-bordered input-sm" />
<input className="input input-bordered input-lg" />

// Textarea
<textarea className="textarea textarea-bordered"></textarea>

// Select
<select className="select select-bordered w-full">
  <option>Opção 1</option>
  <option>Opção 2</option>
</select>

// Checkbox
<input type="checkbox" className="checkbox" />
<input type="checkbox" className="checkbox checkbox-primary" />

// Radio
<input type="radio" className="radio" />
<input type="radio" className="radio radio-primary" />
```

#### Card

```tsx
// Card básico
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Conteúdo do card</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>

// Card com imagem
<div className="card bg-base-100 shadow-xl">
  <figure><img src="/image.jpg" alt="Alt text" /></figure>
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Conteúdo</p>
  </div>
</div>

// Card compacto
<div className="card bg-base-100 shadow-md border border-base-300">
  <div className="card-body p-4">
    <p>Conteúdo compacto</p>
  </div>
</div>
```

#### Alert

```tsx
// Alert types
<div className="alert">
  <span>Default alert</span>
</div>

<div className="alert alert-info">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  <span>Info alert</span>
</div>

<div className="alert alert-success">...</div>
<div className="alert alert-warning">...</div>
<div className="alert alert-error">...</div>
```

#### Loading

```tsx
// Loading spinner
<span className="loading loading-spinner"></span>
<span className="loading loading-spinner loading-xs"></span>
<span className="loading loading-spinner loading-sm"></span>
<span className="loading loading-spinner loading-md"></span>
<span className="loading loading-spinner loading-lg"></span>

// Loading dots
<span className="loading loading-dots"></span>

// Loading ring
<span className="loading loading-ring"></span>

// Loading ball
<span className="loading loading-ball"></span>
```

---

## 🎨 Cores

### Paleta DaisyUI

Use classes de cor do DaisyUI para garantir consistência com o tema:

```tsx
// Cores principais
bg-primary text-primary-content
bg-secondary text-secondary-content
bg-accent text-accent-content
bg-neutral text-neutral-content

// Estados
bg-info text-info-content
bg-success text-success-content
bg-warning text-warning-content
bg-error text-error-content

// Base colors (backgrounds)
bg-base-100  // Cor de fundo principal
bg-base-200  // Cor de fundo alternativa
bg-base-300  // Borders, dividers

// Text colors
text-base-content         // Texto principal
text-base-content/70      // Texto secundário (70% opacity)
text-base-content/50      // Texto terciário (50% opacity)
```

### Uso Prático

```tsx
// ✅ Correto
<div className="bg-primary text-primary-content">
  Conteúdo com cores consistentes
</div>

// ❌ Evitar
<div className="bg-blue-500 text-white">
  Cores hardcoded
</div>
```

---

## 📝 Tipografia

### Tamanhos Responsivos

```tsx
// Headings
<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
  Título Principal
</h1>

<h2 className="text-xl sm:text-2xl font-semibold">
  Subtítulo
</h2>

<h3 className="text-lg sm:text-xl font-medium">
  Seção
</h3>

// Body text
<p className="text-sm sm:text-base">Texto normal</p>
<p className="text-xs sm:text-sm">Texto pequeno</p>

// Helper text
<span className="text-xs text-base-content/60">Helper text</span>
```

### Peso e Estilo

```tsx
font-normal     // 400
font-medium     // 500
font-semibold   // 600
font-bold       // 700

truncate        // Texto em linha única com ellipsis
line-clamp-2    // Limita a 2 linhas
line-clamp-3    // Limita a 3 linhas
```

---

## 📏 Espaçamento

### Padding e Margin Responsivos

```tsx
// Padding
p-4 sm:p-6 lg:p-8         // Padding geral
px-4 sm:px-6              // Padding horizontal
py-4 sm:py-6              // Padding vertical

// Margin
mb-4 sm:mb-6              // Margin bottom
mt-4 sm:mt-6              // Margin top

// Gap (para Flexbox e Grid)
gap-4 sm:gap-6            // Gap geral
gap-x-4 gap-y-6           // Gap horizontal e vertical separados
```

### Espaçamento Padrão

```tsx
// Card body
<div className="card-body p-4 sm:p-6">  // Mobile: 16px, Desktop: 24px

// Container
<div className="p-4 sm:p-6 lg:p-8">    // Mobile: 16px, Tablet: 24px, Desktop: 32px

// Seções
<div className="space-y-4 sm:space-y-6"> // Espaço entre elementos
```

---

## 📐 Padrões de Uso

### Layouts Responsivos

#### Grid

```tsx
// 1 → 2 → 3 colunas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// 1 → 2 → 4 colunas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  ...
</div>
```

#### Flexbox

```tsx
// Stack horizontal/vertical responsivo
<div className="flex flex-col sm:flex-row gap-4">
  ...
</div>

// Alinhamento
<div className="flex items-center justify-between">
  <span>Esquerda</span>
  <button>Direita</button>
</div>

// Center
<div className="flex items-center justify-center min-h-screen">
  <div>Conteúdo centralizado</div>
</div>
```

### Tabelas Responsivas

```tsx
// Desktop: Table
<div className="hidden md:block overflow-x-auto">
  <table className="table w-full">
    <thead>
      <tr className="border-b border-base-300">
        <th className="bg-base-200">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-base-200/50">
        <td>Data</td>
      </tr>
    </tbody>
  </table>
</div>

// Mobile: Cards
<div className="md:hidden grid gap-4">
  <div className="card bg-base-100 border border-base-300 p-4">
    Card content
  </div>
</div>
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12 px-4">
  <div className="text-center max-w-sm">
    <div className="text-6xl mb-4">📚</div>
    <h3 className="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
    <p className="text-base-content/70 mb-6">
      Comece adicionando seu primeiro item.
    </p>
    <button className="btn btn-primary">
      <FiPlus size={18} />
      Adicionar Item
    </button>
  </div>
</div>
```

### Loading States

```tsx
// Full page loading
<div className="flex min-h-[50vh] items-center justify-center">
  <span className="loading loading-spinner loading-lg"></span>
</div>

// Inline loading
<button className="btn btn-primary" disabled>
  <span className="loading loading-spinner loading-sm"></span>
  Carregando...
</button>

// Button com loading integrado
<Button loading={isLoading}>Salvar</Button>
```

---

## 💻 Convenções de Código

### Nomenclatura

```tsx
// Componentes: PascalCase
Button.tsx
CourseForm.tsx
MainLayout.tsx

// Arquivos utilitários: camelCase
design.ts
utils.ts
api.ts

// Constantes: UPPER_SNAKE_CASE
export const API_BASE_URL = '...';
export const MAX_ITEMS = 100;
```

### Estrutura de Componentes

```tsx
// Template padrão para componentes

import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props aqui
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Component({ 
  variant = 'primary',
  size = 'md',
  className,
  ...props 
}: ComponentProps) {
  return (
    <div className={cn('base-classes', className)} {...props}>
      {/* Conteúdo */}
    </div>
  );
}

// Named export para maior flexibilidade
export default Component;
```

### Imports

```tsx
// Ordem de imports
import { useState } from 'react';                    // 1. React
import { useNavigate } from 'react-router-dom';     // 2. Libraries
import { FiSave } from 'react-icons/fi';            // 3. UI libs
import { Button } from '@/components/common/Button'; // 4. Components
import { useAuth } from '@/contexts/AuthContext';   // 5. Hooks/Context
import { COLORS } from '@/constants/design';         // 6. Constants
import type { User } from '@/types';                 // 7. Types
```

### TypeScript

```tsx
// Sempre tipar props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

// Usar type para unions simples
type Status = 'idle' | 'loading' | 'success' | 'error';

// Interface para objetos
interface User {
  id: number;
  name: string;
  email: string;
}
```

---

## ✅ Checklist

Antes de fazer commit:

- [ ] Usado componentes DaisyUI quando possível
- [ ] Classes responsivas implementadas (sm:, md:, lg:)
- [ ] Nenhuma cor hardcoded (usar classes DaisyUI)
- [ ] Loading states implementados
- [ ] Empty states implementados
- [ ] Erros tratados e exibidos
- [ ] Acessibilidade básica (labels, ARIA quando necessário)
- [ ] TypeScript sem erros
- [ ] Código formatado (Prettier)
- [ ] Imports organizados

---

## 📚 Referências

- [DaisyUI Components](https://daisyui.com/components/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query/latest)

---

**Última atualização**: 01/10/2025
**Versão**: 1.0.0
