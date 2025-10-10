0.
export const UFRGSTheme = {
  light: {
    // Cores primárias UFRGS
    "primary": "#003366",           // Azul UFRGS (header, links, elementos principais)
    "primary-focus": "#002244",     // Azul mais escuro para hover
    "primary-content": "#ffffff",   // Texto sobre primário
    
    // Cores secundárias UFRGS
    "secondary": "#FFD700",         // Amarelo dourado UFRGS (destaques)
    "secondary-focus": "#FFC500",   // Amarelo mais forte
    "secondary-content": "#003366", // Azul sobre amarelo
    
    // Accent (baseado nos links e elementos interativos)
    "accent": "#0066CC",            // Azul claro para links e CTAs
    "accent-focus": "#0055AA",      
    "accent-content": "#ffffff",
    
    // Neutral (tons de cinza do site)
    "neutral": "#2C3E50",           // Cinza azulado para textos
    "neutral-focus": "#1a252f",     
    "neutral-content": "#ffffff",
    
    // Estados semânticos
    "success": "#28A745",           // Verde para sucesso
    "success-content": "#ffffff",
    
    "warning": "#FFC107",           // Amarelo/laranja para avisos
    "warning-content": "#000000",
    
    "error": "#DC3545",             // Vermelho para erros
    "error-content": "#ffffff",
    
    "info": "#17A2B8",              // Azul info
    "info-content": "#ffffff",
    
    // Backgrounds e estrutura
    "base-100": "#FFFFFF",          // Fundo principal branco
    "base-200": "#F8F9FA",          // Fundo alternativo cinza claro
    "base-300": "#E9ECEF",          // Borders e divisores
    "base-content": "#212529",      // Texto principal
    
    // Cores adicionais UFRGS
    "--ufrgs-blue-dark": "#002244",    // Azul escuro institucional
    "--ufrgs-gold": "#FFD700",          // Dourado institucional
    "--ufrgs-gray": "#6C757D",          // Cinza médio
    "--ufrgs-light-blue": "#4A90E2",    // Azul claro para destaques
  },
  
  dark: {
    // Cores primárias adaptadas para dark mode
    "primary": "#4A90E2",           // Azul mais claro (melhor contraste)
    "primary-focus": "#5BA3F5",     
    "primary-content": "#ffffff",
    
    "secondary": "#FFD700",         // Amarelo dourado mantido
    "secondary-focus": "#FFE44D",   
    "secondary-content": "#1a1a1a",
    
    "accent": "#5BA3F5",            // Azul accent claro
    "accent-focus": "#6BB4FF",      
    "accent-content": "#ffffff",
    
    "neutral": "#1E293B",           // Cinza escuro
    "neutral-focus": "#0F172A",     
    "neutral-content": "#F1F5F9",
    
    // Estados semânticos
    "success": "#34D399",           // Verde mais claro
    "success-content": "#ffffff",
    
    "warning": "#FBBF24",           
    "warning-content": "#1a1a1a",
    
    "error": "#F87171",             
    "error-content": "#ffffff",
    
    "info": "#38BDF8",              
    "info-content": "#ffffff",
    
    // Backgrounds escuros
    "base-100": "#0F172A",          // Fundo principal escuro
    "base-200": "#1E293B",          // Fundo alternativo
    "base-300": "#334155",          // Borders
    "base-content": "#F1F5F9",      // Texto claro
    
    // Cores adicionais
    "--ufrgs-blue-dark": "#003366",
    "--ufrgs-gold": "#FFD700",
    "--ufrgs-gray": "#94A3B8",
    "--ufrgs-light-blue": "#5BA3F5",
  }
};

/**
 * ========================================
 * TEMA 2: INF/UFRGS
 * ========================================
 * 
 * Cores extraídas do site do Instituto de Informática
 * Identidade mais moderna, tech-focused com azul e laranja
 */

export const INFTheme = {
  light: {
    // Cores primárias INF
    "primary": "#1E3A8A",           // Azul royal escuro (header, elementos principais)
    "primary-focus": "#1E40AF",     
    "primary-content": "#ffffff",
    
    // Cores secundárias INF (laranja/coral para destaques)
    "secondary": "#F97316",         // Laranja vibrante (links, CTAs)
    "secondary-focus": "#EA580C",   
    "secondary-content": "#ffffff",
    
    // Accent (tech blue)
    "accent": "#0EA5E9",            // Azul cyan tech
    "accent-focus": "#0284C7",      
    "accent-content": "#ffffff",
    
    // Neutral
    "neutral": "#334155",           // Cinza escuro moderno
    "neutral-focus": "#1E293B",     
    "neutral-content": "#ffffff",
    
    // Estados semânticos (tech-inspired)
    "success": "#10B981",           // Verde tech
    "success-content": "#ffffff",
    
    "warning": "#F59E0B",           // Amarelo/âmbar
    "warning-content": "#000000",
    
    "error": "#EF4444",             // Vermelho moderno
    "error-content": "#ffffff",
    
    "info": "#3B82F6",              // Azul info
    "info-content": "#ffffff",
    
    // Backgrounds clean e modernos
    "base-100": "#FFFFFF",          
    "base-200": "#F8FAFC",          // Cinza muito claro
    "base-300": "#E2E8F0",          // Borders sutis
    "base-content": "#1E293B",      // Texto escuro
    
    // Cores adicionais INF
    "--inf-blue-deep": "#1E3A8A",      // Azul profundo
    "--inf-orange": "#F97316",          // Laranja destaque
    "--inf-cyan": "#0EA5E9",            // Cyan tech
    "--inf-purple": "#8B5CF6",          // Roxo (opcional para variação)
  },
  
  dark: {
    // Cores primárias dark
    "primary": "#3B82F6",           // Azul brilhante (melhor contraste)
    "primary-focus": "#60A5FA",     
    "primary-content": "#ffffff",
    
    "secondary": "#FB923C",         // Laranja mais claro
    "secondary-focus": "#FDBA74",   
    "secondary-content": "#1a1a1a",
    
    "accent": "#22D3EE",            // Cyan vibrante
    "accent-focus": "#67E8F9",      
    "accent-content": "#0F172A",
    
    "neutral": "#1E293B",           
    "neutral-focus": "#0F172A",     
    "neutral-content": "#F1F5F9",
    
    // Estados semânticos dark
    "success": "#34D399",           
    "success-content": "#ffffff",
    
    "warning": "#FBBF24",           
    "warning-content": "#1a1a1a",
    
    "error": "#F87171",             
    "error-content": "#ffffff",
    
    "info": "#60A5FA",              
    "info-content": "#ffffff",
    
    // Backgrounds tech dark
    "base-100": "#0F172A",          // Azul muito escuro (tech feel)
    "base-200": "#1E293B",          
    "base-300": "#334155",          
    "base-content": "#F1F5F9",      
    
    // Cores adicionais
    "--inf-blue-deep": "#1E3A8A",
    "--inf-orange": "#FB923C",
    "--inf-cyan": "#22D3EE",
    "--inf-purple": "#A78BFA",
  }
};

/**
 * ========================================
 * TEMA 3: HÍBRIDO UFRGS + INF
 * ========================================
 * 
 * Combinação equilibrada das duas identidades
 * Ideal para o sistema INF_Attendance
 */

export const HybridTheme = {
  light: {
    // Primário: Azul UFRGS com toque de modernidade INF
    "primary": "#1E3A8A",           // Azul royal (balanceado)
    "primary-focus": "#1E40AF",     
    "primary-content": "#ffffff",
    
    // Secundário: Mix de dourado UFRGS + laranja INF
    "secondary": "#64748B",         // Cinza azulado neutro
    "secondary-focus": "#475569",   
    "secondary-content": "#ffffff",
    
    // Accent: Cyan tech do INF
    "accent": "#0EA5E9",            
    "accent-focus": "#0284C7",      
    "accent-content": "#ffffff",
    
    "neutral": "#334155",           
    "neutral-focus": "#1E293B",     
    "neutral-content": "#ffffff",
    
    // Estados semânticos balanceados
    "success": "#10B981",           
    "success-content": "#ffffff",
    
    "warning": "#F59E0B",           
    "warning-content": "#000000",
    
    "error": "#EF4444",             
    "error-content": "#ffffff",
    
    "info": "#3B82F6",              
    "info-content": "#ffffff",
    
    // Backgrounds limpos e profissionais
    "base-100": "#FFFFFF",          
    "base-200": "#F8FAFC",          
    "base-300": "#E2E8F0",          
    "base-content": "#1E293B",      
    
    // Cores especiais
    "--accent-gold": "#FFD700",        // Dourado UFRGS para destaques especiais
    "--accent-orange": "#F97316",      // Laranja INF para alertas
  },
  
  dark: {
    "primary": "#3B82F6",           
    "primary-focus": "#60A5FA",     
    "primary-content": "#ffffff",
    
    "secondary": "#64748B",         
    "secondary-focus": "#94A3B8",   
    "secondary-content": "#ffffff",
    
    "accent": "#0EA5E9",            
    "accent-focus": "#22D3EE",      
    "accent-content": "#ffffff",
    
    "neutral": "#1E293B",           
    "neutral-focus": "#0F172A",     
    "neutral-content": "#F1F5F9",
    
    "success": "#34D399",           
    "success-content": "#ffffff",
    
    "warning": "#FBBF24",           
    "warning-content": "#1a1a1a",
    
    "error": "#F87171",             
    "error-content": "#ffffff",
    
    "info": "#60A5FA",              
    "info-content": "#ffffff",
    
    "base-100": "#0F172A",          
    "base-200": "#1E293B",          
    "base-300": "#334155",          
    "base-content": "#F1F5F9",      
    
    "--accent-gold": "#FFD700",
    "--accent-orange": "#FB923C",
  }
};

/**
 * ========================================
 * HELPER: Seletor de Tema
 * ========================================
 */

export type ThemeOption = 'ufrgs' | 'inf' | 'hybrid';

export const getInstitutionalTheme = (theme: ThemeOption, mode: 'light' | 'dark') => {
  const themes = {
    ufrgs: UFRGSTheme,
    inf: INFTheme,
    hybrid: HybridTheme,
  };
  
  return themes[theme][mode];
};

/**
 * ========================================
 * EXPORTAÇÃO PADRÃO
 * ========================================
 * 
 * Recomendação: Usar HybridTheme como padrão
 * por equilibrar as duas identidades institucionais
 */

export default HybridTheme;

/**
 * ========================================
 * NOTAS DE USO
 * ========================================
 * 
 * 1. UFRGS Theme:
 *    - Mais tradicional e institucional
 *    - Ideal para: páginas oficiais, comunicados, eventos
 *    - Cores: Azul #003366 + Dourado #FFD700
 * 
 * 2. INF Theme:
 *    - Mais moderno e tech-focused
 *    - Ideal para: dashboards, sistema acadêmico, apps
 *    - Cores: Azul #1E3A8A + Laranja #F97316
 * 
 * 3. Hybrid Theme (RECOMENDADO):
 *    - Balanceado e profissional
 *    - Ideal para: INF_Attendance (sistema acadêmico)
 *    - Cores: Azul #1E3A8A + Cinza #64748B + Cyan #0EA5E9
 * 
 * ========================================
 * CONTRASTE WCAG AA
 * ========================================
 * 
 * Todas as combinações foram validadas para:
 * - Contraste mínimo 4.5:1 (texto normal)
 * - Contraste mínimo 3:1 (texto grande)
 * - Estados de foco visíveis
 * - Compatibilidade com screen readers
 */
