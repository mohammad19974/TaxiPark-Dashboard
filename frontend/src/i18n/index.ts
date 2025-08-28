import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import heTranslations from './locales/he.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';

// Language configuration
export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  he: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
};

export const defaultLanguage = 'en';
export const supportedLanguages = Object.keys(languages);

// RTL languages
export const rtlLanguages = ['ar', 'he'];

// Check if language is RTL
export const isRTL = (language: string): boolean => {
  return rtlLanguages.includes(language);
};

// Get language direction
export const getLanguageDirection = (language: string): 'ltr' | 'rtl' => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // Fallback language
    fallbackLng: defaultLanguage,
    
    // Supported languages
    supportedLngs: supportedLanguages,
    
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',

    // Resources (inline translations)
    resources: {
      en: { translation: enTranslations },
      ar: { translation: arTranslations },
      he: { translation: heTranslations },
      fr: { translation: frTranslations },
      es: { translation: esTranslations },
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React options
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },

    // Backend options (for loading translations from files)
    backend: {
      loadPath: '/locales/{{lng}}.json',
      addPath: '/locales/{{lng}}.json',
    },

    // Namespace options
    defaultNS: 'translation',
    ns: ['translation'],

    // Key separator
    keySeparator: '.',
    
    // Nested separator
    nsSeparator: ':',

    // Return objects for nested keys
    returnObjects: true,
  });

// Language change handler
i18n.on('languageChanged', (lng) => {
  // Update document direction
  const direction = getLanguageDirection(lng);
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
  
  // Update CSS custom property for direction
  document.documentElement.style.setProperty('--text-direction', direction);
  
  // Store language preference
  localStorage.setItem('i18nextLng', lng);
});

// Set initial direction
const currentLanguage = i18n.language || defaultLanguage;
const initialDirection = getLanguageDirection(currentLanguage);
document.documentElement.dir = initialDirection;
document.documentElement.lang = currentLanguage;
document.documentElement.style.setProperty('--text-direction', initialDirection);

export default i18n;