/**
 * Design System Constants
 * 
 * Centraliza todos os tokens de design para garantir consistência
 * visual em toda a aplicação.
 */

/**
 * Breakpoints do Tailwind CSS (para referência)
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Espaçamentos padrão (baseado em Tailwind)
 */
export const SPACING = {
  xs: 'p-2',    // 8px
  sm: 'p-4',    // 16px
  md: 'p-6',    // 24px
  lg: 'p-8',    // 32px
  xl: 'p-12',   // 48px
} as const;

/**
 * Tamanhos de fonte responsivos
 */
export const FONT_SIZES = {
  xs: 'text-xs',                      // 12px
  sm: 'text-sm',                      // 14px
  base: 'text-base',                  // 16px
  lg: 'text-lg',                      // 18px
  xl: 'text-xl sm:text-2xl',          // 20px → 24px
  '2xl': 'text-2xl sm:text-3xl',      // 24px → 30px
  '3xl': 'text-2xl sm:text-3xl md:text-4xl', // 24px → 30px → 36px
} as const;

/**
 * Cores baseadas no DaisyUI
 * Usar classes DaisyUI em vez de valores customizados
 */
export const COLORS = {
  // Cores principais
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
  neutral: 'bg-neutral text-neutral-content',
  
  // Estados
  info: 'bg-info text-info-content',
  success: 'bg-success text-success-content',
  warning: 'bg-warning text-warning-content',
  error: 'bg-error text-error-content',
  
  // Base colors
  base100: 'bg-base-100',
  base200: 'bg-base-200',
  base300: 'bg-base-300',
  
  // Text colors
  baseContent: 'text-base-content',
  baseContentMuted: 'text-base-content/70',
  baseContentSubtle: 'text-base-content/50',
} as const;

/**
 * Classes de componentes DaisyUI reutilizáveis
 */
export const COMPONENT_CLASSES = {
  // Card
  card: 'card bg-base-100 shadow-md border border-base-300',
  cardBody: 'card-body',
  cardTitle: 'card-title',
  
  // Button (DaisyUI base)
  btn: 'btn',
  btnPrimary: 'btn btn-primary',
  btnSecondary: 'btn btn-secondary',
  btnGhost: 'btn btn-ghost',
  btnOutline: 'btn btn-outline',
  btnError: 'btn btn-error',
  
  // Form
  formControl: 'form-control',
  label: 'label',
  labelText: 'label-text',
  input: 'input input-bordered w-full',
  textarea: 'textarea textarea-bordered w-full',
  select: 'select select-bordered w-full',
  
  // Alert
  alert: 'alert',
  alertInfo: 'alert alert-info',
  alertSuccess: 'alert alert-success',
  alertWarning: 'alert alert-warning',
  alertError: 'alert alert-error',
  
  // Loading
  loading: 'loading loading-spinner',
  loadingSm: 'loading loading-spinner loading-sm',
  loadingMd: 'loading loading-spinner loading-md',
  loadingLg: 'loading loading-spinner loading-lg',
} as const;

/**
 * Layouts responsivos comuns
 */
export const LAYOUTS = {
  // Container
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  
  // Grid responsivo
  gridResponsive1: 'grid grid-cols-1 gap-4 sm:gap-6',
  gridResponsive2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
  gridResponsive3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  gridResponsive4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6',
  
  // Flex
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',
} as const;

/**
 * Shadows e borders
 */
export const DECORATIONS = {
  shadow: 'shadow-md',
  shadowLg: 'shadow-lg',
  border: 'border border-base-300',
  borderTop: 'border-t border-base-300',
  borderBottom: 'border-b border-base-300',
  rounded: 'rounded-lg',
  roundedFull: 'rounded-full',
} as const;

/**
 * Transições
 */
export const TRANSITIONS = {
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-300 ease-in-out',
  all: 'transition-all duration-200',
  shadow: 'transition-shadow duration-200',
} as const;

/**
 * Estados hover
 */
export const HOVER_STATES = {
  card: 'hover:shadow-lg transition-shadow',
  button: 'hover:scale-105 transition-transform',
  link: 'hover:underline',
  bg: 'hover:bg-base-200 transition-colors',
} as const;

/**
 * Utilitários comuns
 */
export const UTILS = {
  truncate: 'truncate',
  lineClamp2: 'line-clamp-2',
  lineClamp3: 'line-clamp-3',
  srOnly: 'sr-only',
  hideScrollbar: 'scrollbar-hide',
} as const;

/**
 * Helper function para combinar classes de forma segura
 * Usa a função cn do utils, mas com sugestões de tipos
 */
export const combineClasses = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};
