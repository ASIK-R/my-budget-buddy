// Modern theme configuration for the expense tracker app
export const theme = {
  // Enhanced color palette with brand colors and modern gradients
  colors: {
    // Brand colors from our design system
    primary: {
      50: '#FFFDEE',
      100: '#FFF9D6',
      200: '#FFF5BE',
      300: '#FFF1A6',
      400: '#FFED8E',
      500: '#E3EF26', // Bright yellow-green - primary color
      600: '#B0B81D',
      700: '#7D8114',
      800: '#4A4A0B',
      900: '#171302',
    },
    secondary: {
      50: '#E2FBCE',
      100: '#CAF3B6',
      200: '#B2EB9E',
      300: '#9AD386',
      400: '#82BB6E',
      500: '#076653', // Dark teal - secondary color
      600: '#054D3F',
      700: '#04342B',
      800: '#021B17',
      900: '#000203',
    },
    brand: {
      dark: '#0C342C',
      accent: '#076653',
      text: '#06231D',
    },
    accent: {
      // Modern accent colors for highlights
      blue: '#3b82f6', // Modern blue
      purple: '#8b5cf6', // Vibrant violet
      pink: '#ec4899', // Vibrant pink
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    background: {
      light: '#f8fafc', // Softer white with slight blue tint for better contrast
      dark: '#0f172a', // Charcoal for dark mode
    },
    
    // Enhanced text colors for better readability
    text: {
      primary: {
        light: '#06231D',    // Primary text in light mode
        dark: '#f8fafc',     // Primary text in dark mode
      },
      secondary: {
        light: '#334155',    // Secondary text in light mode
        dark: '#e2e8f0',     // Secondary text in dark mode
      },
      tertiary: {
        light: '#64748b',    // Tertiary text in light mode
        dark: '#94a3b8',     // Tertiary text in dark mode
      },
      disabled: {
        light: '#94a3b8',    // Disabled text in light mode
        dark: '#64748b',     // Disabled text in dark mode
      },
    },
    
    // Enhanced status colors
    status: {
      success: {
        light: '#16a34a',
        dark: '#4ade80',
      },
      warning: {
        light: '#d97706',
        dark: '#fbbf24',
      },
      error: {
        light: '#dc2626',
        dark: '#f87171',
      },
    },
  },

  // Typography system
  typography: {
    fontFamily: {
      sans: ['Inter', 'Poppins', 'Nunito Sans', 'sans-serif'],
      heading: ['Inter', 'Poppins', 'Nunito Sans', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Spacing system
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Border radius system - More consistent shapes
  borderRadius: {
    none: '0',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows with optimized neumorphism effect for both themes
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    neumorphism: {
      light: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff', // Balanced neumorphism for light theme
      dark: '6px 6px 12px #0a0f1a, -6px -6px 12px #14203a', // Balanced neumorphism for dark theme
    },
  },

  // Transitions and animations
  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },

  // Z-index system
  zIndex: {
    auto: 'auto',
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default theme;
