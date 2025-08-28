import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ThemeColor {
  name: string;
  value: string;
  shades: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

interface ThemeContextType {
  currentTheme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  resetTheme: () => void;
  generateThemeFromColor: (color: string) => ThemeColor;
  presetThemes: ThemeColor[];
  isValidColor: (color: string) => boolean;
  getContrastRatio: (color1: string, color2: string) => number;
  isAccessible: (backgroundColor: string, textColor: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility functions for color manipulation
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

// Generate color shades from a base color
const generateColorShades = (baseColor: string): ThemeColor['shades'] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) {
    throw new Error('Invalid color format');
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shades: ThemeColor['shades'] = {} as ThemeColor['shades'];

  // Generate shades with different lightness values
  const lightnessValues = {
    50: 95,
    100: 90,
    200: 80,
    300: 70,
    400: 60,
    500: hsl.l, // Base color
    600: Math.max(hsl.l - 10, 20),
    700: Math.max(hsl.l - 20, 15),
    800: Math.max(hsl.l - 30, 10),
    900: Math.max(hsl.l - 40, 5),
  };

  Object.entries(lightnessValues).forEach(([shade, lightness]) => {
    const adjustedHsl = { ...hsl, l: lightness };
    const adjustedRgb = hslToRgb(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
    shades[shade as keyof ThemeColor['shades']] = rgbToHex(
      adjustedRgb.r,
      adjustedRgb.g,
      adjustedRgb.b
    );
  });

  return shades;
};

// Calculate relative luminance
const getRelativeLuminance = (color: string): number => {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Calculate contrast ratio between two colors
const calculateContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

// Validate color format
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Preset theme colors
const presetThemes: ThemeColor[] = [
  {
    name: 'Blue',
    value: '#3b82f6',
    shades: generateColorShades('#3b82f6'),
  },
  {
    name: 'Green',
    value: '#10b981',
    shades: generateColorShades('#10b981'),
  },
  {
    name: 'Purple',
    value: '#8b5cf6',
    shades: generateColorShades('#8b5cf6'),
  },
  {
    name: 'Red',
    value: '#ef4444',
    shades: generateColorShades('#ef4444'),
  },
  {
    name: 'Orange',
    value: '#f97316',
    shades: generateColorShades('#f97316'),
  },
  {
    name: 'Pink',
    value: '#ec4899',
    shades: generateColorShades('#ec4899'),
  },
  {
    name: 'Indigo',
    value: '#6366f1',
    shades: generateColorShades('#6366f1'),
  },
  {
    name: 'Teal',
    value: '#14b8a6',
    shades: generateColorShades('#14b8a6'),
  },
];

// Default theme (Blue)
const defaultTheme = presetThemes[0];

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch {
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  // Apply theme to CSS custom properties
  const applyTheme = useCallback((theme: ThemeColor) => {
    const root = document.documentElement;
    
    // Set primary color and its shades
    root.style.setProperty('--color-primary', theme.value);
    Object.entries(theme.shades).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, color);
    });

    // Save to localStorage
    localStorage.setItem('app-theme', JSON.stringify(theme));
  }, []);

  // Set theme
  const setTheme = useCallback(
    (theme: ThemeColor) => {
      setCurrentTheme(theme);
      applyTheme(theme);
    },
    [applyTheme]
  );

  // Reset to default theme
  const resetTheme = useCallback(() => {
    setTheme(defaultTheme);
  }, [setTheme]);

  // Generate theme from color
  const generateThemeFromColor = useCallback((color: string): ThemeColor => {
    if (!isValidHexColor(color)) {
      throw new Error('Invalid color format. Please use hex format (#RRGGBB)');
    }

    return {
      name: 'Custom',
      value: color,
      shades: generateColorShades(color),
    };
  }, []);

  // Validate color
  const isValidColor = useCallback((color: string): boolean => {
    return isValidHexColor(color);
  }, []);

  // Get contrast ratio
  const getContrastRatio = useCallback((color1: string, color2: string): number => {
    return calculateContrastRatio(color1, color2);
  }, []);

  // Check accessibility
  const isAccessible = useCallback(
    (backgroundColor: string, textColor: string): boolean => {
      const ratio = calculateContrastRatio(backgroundColor, textColor);
      return ratio >= 4.5; // WCAG AA standard
    },
    []
  );

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  const contextValue: ThemeContextType = {
    currentTheme,
    setTheme,
    resetTheme,
    generateThemeFromColor,
    presetThemes,
    isValidColor,
    getContrastRatio,
    isAccessible,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;