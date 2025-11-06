/**
 * Brand Color System for AI Navigator
 * 
 * Primary: Teal - Trust, Intelligence, Innovation
 * Secondary: Purple - Creativity, Wisdom
 * Accent: Pink - Energy, Engagement
 */

export const brandColors = {
  // Primary Brand Colors
  primary: {
    teal: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6', // Main brand color
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
  },

  // Secondary Brand Colors
  secondary: {
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9f1239',
      900: '#831843',
    },
  },

  // Accent Colors
  accent: {
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },

  // Neutral Colors (optimized for light mode)
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    black: '#000000',
  },

  // Semantic Colors
  semantic: {
    success: {
      light: '#d1fae5',
      DEFAULT: '#10b981',
      dark: '#065f46',
    },
    warning: {
      light: '#fef3c7',
      DEFAULT: '#f59e0b',
      dark: '#92400e',
    },
    error: {
      light: '#fee2e2',
      DEFAULT: '#ef4444',
      dark: '#991b1b',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#1e40af',
    },
  },
}

// Gradient definitions
export const brandGradients = {
  primary: 'from-teal-500 via-teal-400 to-cyan-400',
  secondary: 'from-purple-500 via-purple-400 to-pink-400',
  accent: 'from-orange-400 via-pink-400 to-purple-500',
  hero: 'from-teal-50 via-purple-50 to-pink-50',
  heroDark: 'from-teal-950 via-purple-950 to-pink-950',
}

// Shadows optimized for light mode
export const brandShadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  teal: '0 10px 30px -5px rgb(20 184 166 / 0.3)',
  purple: '0 10px 30px -5px rgb(168 85 247 / 0.3)',
  pink: '0 10px 30px -5px rgb(236 72 153 / 0.3)',
}

// View-specific color mappings
export const viewColors = {
  'ai-agent': {
    primary: brandColors.secondary.purple[500],
    light: brandColors.secondary.purple[50],
    gradient: 'from-purple-500 to-indigo-500',
  },
  'overview': {
    primary: brandColors.primary.teal[500],
    light: brandColors.primary.teal[50],
    gradient: 'from-teal-500 to-cyan-500',
  },
  'sentiment': {
    primary: brandColors.secondary.purple[500],
    light: brandColors.secondary.purple[50],
    gradient: 'from-purple-500 to-pink-500',
  },
  'capability': {
    primary: brandColors.accent.blue[500],
    light: brandColors.accent.blue[50],
    gradient: 'from-blue-500 to-cyan-500',
  },
  'interventions': {
    primary: brandColors.accent.orange[500],
    light: brandColors.accent.orange[50],
    gradient: 'from-orange-500 to-amber-500',
  },
  'recommendations': {
    primary: brandColors.secondary.purple[600],
    light: brandColors.secondary.purple[50],
    gradient: 'from-purple-600 to-indigo-600',
  },
  'reports': {
    primary: brandColors.primary.teal[600],
    light: brandColors.primary.teal[50],
    gradient: 'from-teal-600 to-blue-600',
  },
}

