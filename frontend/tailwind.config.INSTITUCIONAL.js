/**
 * CONFIGURAÇÃO TAILWIND COM TEMAS INSTITUCIONAIS
 * 
 * Este arquivo mostra como configurar o tailwind.config.js
 * para usar os temas extraídos dos sites da UFRGS
 */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      // Cores customizadas CSS variables (mantém flexibilidade)
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('daisyui')],
  
  // ========================================
  // CONFIGURAÇÃO DAISYUI COM TEMAS INSTITUCIONAIS
  // ========================================
  daisyui: {
    themes: [
      {
        // ====================================
        // TEMA 1: UFRGS LIGHT
        // ====================================
        'ufrgs-light': {
          'primary': '#003366',
          'primary-focus': '#002244',
          'primary-content': '#ffffff',
          
          'secondary': '#FFD700',
          'secondary-focus': '#FFC500',
          'secondary-content': '#003366',
          
          'accent': '#0066CC',
          'accent-focus': '#0055AA',
          'accent-content': '#ffffff',
          
          'neutral': '#2C3E50',
          'neutral-focus': '#1a252f',
          'neutral-content': '#ffffff',
          
          'base-100': '#FFFFFF',
          'base-200': '#F8F9FA',
          'base-300': '#E9ECEF',
          'base-content': '#212529',
          
          'info': '#17A2B8',
          'info-content': '#ffffff',
          
          'success': '#28A745',
          'success-content': '#ffffff',
          
          'warning': '#FFC107',
          'warning-content': '#000000',
          
          'error': '#DC3545',
          'error-content': '#ffffff',
          
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
        
        // ====================================
        // TEMA 2: UFRGS DARK
        // ====================================
        'ufrgs-dark': {
          'primary': '#4A90E2',
          'primary-focus': '#5BA3F5',
          'primary-content': '#ffffff',
          
          'secondary': '#FFD700',
          'secondary-focus': '#FFE44D',
          'secondary-content': '#1a1a1a',
          
          'accent': '#5BA3F5',
          'accent-focus': '#6BB4FF',
          'accent-content': '#ffffff',
          
          'neutral': '#1E293B',
          'neutral-focus': '#0F172A',
          'neutral-content': '#F1F5F9',
          
          'base-100': '#0F172A',
          'base-200': '#1E293B',
          'base-300': '#334155',
          'base-content': '#F1F5F9',
          
          'info': '#38BDF8',
          'info-content': '#ffffff',
          
          'success': '#34D399',
          'success-content': '#ffffff',
          
          'warning': '#FBBF24',
          'warning-content': '#1a1a1a',
          
          'error': '#F87171',
          'error-content': '#ffffff',
          
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
        
        // ====================================
        // TEMA 3: INF LIGHT
        // ====================================
        'inf-light': {
          'primary': '#1E3A8A',
          'primary-focus': '#1E40AF',
          'primary-content': '#ffffff',
          
          'secondary': '#F97316',
          'secondary-focus': '#EA580C',
          'secondary-content': '#ffffff',
          
          'accent': '#0EA5E9',
          'accent-focus': '#0284C7',
          'accent-content': '#ffffff',
          
          'neutral': '#334155',
          'neutral-focus': '#1E293B',
          'neutral-content': '#ffffff',
          
          'base-100': '#FFFFFF',
          'base-200': '#F8FAFC',
          'base-300': '#E2E8F0',
          'base-content': '#1E293B',
          
          'info': '#3B82F6',
          'info-content': '#ffffff',
          
          'success': '#10B981',
          'success-content': '#ffffff',
          
          'warning': '#F59E0B',
          'warning-content': '#000000',
          
          'error': '#EF4444',
          'error-content': '#ffffff',
          
          '--rounded-box': '1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
        
        // ====================================
        // TEMA 4: INF DARK
        // ====================================
        'inf-dark': {
          'primary': '#3B82F6',
          'primary-focus': '#60A5FA',
          'primary-content': '#ffffff',
          
          'secondary': '#FB923C',
          'secondary-focus': '#FDBA74',
          'secondary-content': '#1a1a1a',
          
          'accent': '#22D3EE',
          'accent-focus': '#67E8F9',
          'accent-content': '#0F172A',
          
          'neutral': '#1E293B',
          'neutral-focus': '#0F172A',
          'neutral-content': '#F1F5F9',
          
          'base-100': '#0F172A',
          'base-200': '#1E293B',
          'base-300': '#334155',
          'base-content': '#F1F5F9',
          
          'info': '#60A5FA',
          'info-content': '#ffffff',
          
          'success': '#34D399',
          'success-content': '#ffffff',
          
          'warning': '#FBBF24',
          'warning-content': '#1a1a1a',
          
          'error': '#F87171',
          'error-content': '#ffffff',
          
          '--rounded-box': '1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
        
        // ====================================
        // TEMA 5: HYBRID LIGHT (RECOMENDADO)
        // ====================================
        'hybrid-light': {
          'primary': '#1E3A8A',
          'primary-focus': '#1E40AF',
          'primary-content': '#ffffff',
          
          'secondary': '#64748B',
          'secondary-focus': '#475569',
          'secondary-content': '#ffffff',
          
          'accent': '#0EA5E9',
          'accent-focus': '#0284C7',
          'accent-content': '#ffffff',
          
          'neutral': '#334155',
          'neutral-focus': '#1E293B',
          'neutral-content': '#ffffff',
          
          'base-100': '#FFFFFF',
          'base-200': '#F8FAFC',
          'base-300': '#E2E8F0',
          'base-content': '#1E293B',
          
          'info': '#3B82F6',
          'info-content': '#ffffff',
          
          'success': '#10B981',
          'success-content': '#ffffff',
          
          'warning': '#F59E0B',
          'warning-content': '#000000',
          
          'error': '#EF4444',
          'error-content': '#ffffff',
          
          '--rounded-box': '1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
        
        // ====================================
        // TEMA 6: HYBRID DARK (RECOMENDADO)
        // ====================================
        'hybrid-dark': {
          'primary': '#3B82F6',
          'primary-focus': '#60A5FA',
          'primary-content': '#ffffff',
          
          'secondary': '#64748B',
          'secondary-focus': '#94A3B8',
          'secondary-content': '#ffffff',
          
          'accent': '#0EA5E9',
          'accent-focus': '#22D3EE',
          'accent-content': '#ffffff',
          
          'neutral': '#1E293B',
          'neutral-focus': '#0F172A',
          'neutral-content': '#F1F5F9',
          
          'base-100': '#0F172A',
          'base-200': '#1E293B',
          'base-300': '#334155',
          'base-content': '#F1F5F9',
          
          'info': '#60A5FA',
          'info-content': '#ffffff',
          
          'success': '#34D399',
          'success-content': '#ffffff',
          
          'warning': '#FBBF24',
          'warning-content': '#1a1a1a',
          
          'error': '#F87171',
          'error-content': '#ffffff',
          
          '--rounded-box': '1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
      },
    ],
    darkTheme: 'hybrid-dark', // Tema padrão para dark mode
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};
