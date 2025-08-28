/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
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
        secondary: {
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
        danger: {
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
        border: '#e2e8f0',
        background: '#ffffff',
        foreground: '#0f172a',
        ring: '#3b82f6',
        // CSS custom properties for dynamic theming
        'theme-primary': 'var(--color-primary, #3b82f6)',
        'theme-primary-50': 'var(--color-primary-50, #eff6ff)',
        'theme-primary-100': 'var(--color-primary-100, #dbeafe)',
        'theme-primary-200': 'var(--color-primary-200, #bfdbfe)',
        'theme-primary-300': 'var(--color-primary-300, #93c5fd)',
        'theme-primary-400': 'var(--color-primary-400, #60a5fa)',
        'theme-primary-500': 'var(--color-primary-500, #3b82f6)',
        'theme-primary-600': 'var(--color-primary-600, #2563eb)',
        'theme-primary-700': 'var(--color-primary-700, #1d4ed8)',
        'theme-primary-800': 'var(--color-primary-800, #1e40af)',
        'theme-primary-900': 'var(--color-primary-900, #1e3a8a)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    // RTL support plugin
    function({ addUtilities, addVariant }) {
      // Add RTL/LTR variants
      addVariant('rtl', '[dir="rtl"] &');
      addVariant('ltr', '[dir="ltr"] &');
      
      // Add direction-aware utilities
      addUtilities({
        // Margin utilities
        '.ms-auto': {
          'margin-inline-start': 'auto',
        },
        '.me-auto': {
          'margin-inline-end': 'auto',
        },
        '.ms-0': {
          'margin-inline-start': '0',
        },
        '.me-0': {
          'margin-inline-end': '0',
        },
        '.ms-1': {
          'margin-inline-start': '0.25rem',
        },
        '.me-1': {
          'margin-inline-end': '0.25rem',
        },
        '.ms-2': {
          'margin-inline-start': '0.5rem',
        },
        '.me-2': {
          'margin-inline-end': '0.5rem',
        },
        '.ms-3': {
          'margin-inline-start': '0.75rem',
        },
        '.me-3': {
          'margin-inline-end': '0.75rem',
        },
        '.ms-4': {
          'margin-inline-start': '1rem',
        },
        '.me-4': {
          'margin-inline-end': '1rem',
        },
        '.ms-6': {
          'margin-inline-start': '1.5rem',
        },
        '.me-6': {
          'margin-inline-end': '1.5rem',
        },
        '.ms-8': {
          'margin-inline-start': '2rem',
        },
        '.me-8': {
          'margin-inline-end': '2rem',
        },
        
        // Padding utilities
        '.ps-0': {
          'padding-inline-start': '0',
        },
        '.pe-0': {
          'padding-inline-end': '0',
        },
        '.ps-1': {
          'padding-inline-start': '0.25rem',
        },
        '.pe-1': {
          'padding-inline-end': '0.25rem',
        },
        '.ps-2': {
          'padding-inline-start': '0.5rem',
        },
        '.pe-2': {
          'padding-inline-end': '0.5rem',
        },
        '.ps-3': {
          'padding-inline-start': '0.75rem',
        },
        '.pe-3': {
          'padding-inline-end': '0.75rem',
        },
        '.ps-4': {
          'padding-inline-start': '1rem',
        },
        '.pe-4': {
          'padding-inline-end': '1rem',
        },
        '.ps-6': {
          'padding-inline-start': '1.5rem',
        },
        '.pe-6': {
          'padding-inline-end': '1.5rem',
        },
        '.ps-8': {
          'padding-inline-start': '2rem',
        },
        '.pe-8': {
          'padding-inline-end': '2rem',
        },
        
        // Text alignment
        '.text-start': {
          'text-align': 'start',
        },
        '.text-end': {
          'text-align': 'end',
        },
        
        // Border utilities
        '.border-s': {
          'border-inline-start-width': '1px',
        },
        '.border-e': {
          'border-inline-end-width': '1px',
        },
        '.border-s-0': {
          'border-inline-start-width': '0',
        },
        '.border-e-0': {
          'border-inline-end-width': '0',
        },
        
        // Rounded corners
        '.rounded-s': {
          'border-start-start-radius': '0.25rem',
          'border-end-start-radius': '0.25rem',
        },
        '.rounded-e': {
          'border-start-end-radius': '0.25rem',
          'border-end-end-radius': '0.25rem',
        },
        '.rounded-s-lg': {
          'border-start-start-radius': '0.5rem',
          'border-end-start-radius': '0.5rem',
        },
        '.rounded-e-lg': {
          'border-start-end-radius': '0.5rem',
          'border-end-end-radius': '0.5rem',
        },
        
        // Position utilities
        '.start-0': {
          'inset-inline-start': '0',
        },
        '.end-0': {
          'inset-inline-end': '0',
        },
        '.start-auto': {
          'inset-inline-start': 'auto',
        },
        '.end-auto': {
          'inset-inline-end': 'auto',
        },
        
        // Transform utilities for RTL
        '.rtl\\:scale-x-flip': {
          '[dir="rtl"] &': {
            transform: 'scaleX(-1)',
          },
        },
        
        // Direction-aware flex utilities
        '.flex-row-reverse-rtl': {
          '[dir="rtl"] &': {
            'flex-direction': 'row-reverse',
          },
        },
      });
    },
  ],
}