import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { languages, supportedLanguages } from '../../i18n';
import { useDirection } from '../providers/DirectionProvider';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'icon-only';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'default',
  showFlag = true,
  showNativeName = true,
  className = '',
}) => {
  const { i18n, t } = useTranslation();
  const { isRTL } = useDirection();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLanguage = i18n.language || 'en';
  const currentLangConfig = languages[currentLanguage as keyof typeof languages];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const renderLanguageOption = (langCode: string, isSelected: boolean = false) => {
    const langConfig = languages[langCode as keyof typeof languages];
    if (!langConfig) return null;

    return (
      <button
        key={langCode}
        onClick={() => handleLanguageChange(langCode)}
        className={`
          w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors
          hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
          ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
          ${isRTL ? 'text-right' : 'text-left'}
        `}
        role="menuitem"
        tabIndex={-1}
      >
        {showFlag && (
          <span className="text-lg leading-none" role="img" aria-label={langConfig.name}>
            {langConfig.flag}
          </span>
        )}
        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="font-medium">{langConfig.name}</div>
          {showNativeName && langConfig.nativeName !== langConfig.name && (
            <div className="text-xs text-gray-500">{langConfig.nativeName}</div>
          )}
        </div>
        {isSelected && (
          <Check className={`h-4 w-4 text-blue-600 ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
        )}
      </button>
    );
  };

  if (variant === 'icon-only') {
    return (
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="
            p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors
          "
          aria-label={t('language.selector.title')}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {showFlag && currentLangConfig ? (
            <span className="text-lg" role="img" aria-label={currentLangConfig.name}>
              {currentLangConfig.flag}
            </span>
          ) : (
            <Globe className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`
              absolute top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50
              ${isRTL ? 'right-0' : 'left-0'}
            `}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-1">
              {supportedLanguages.map((langCode) =>
                renderLanguageOption(langCode, langCode === currentLanguage)
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="
            flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white 
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors text-sm
          "
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {showFlag && currentLangConfig && (
            <span className="text-base" role="img" aria-label={currentLangConfig.name}>
              {currentLangConfig.flag}
            </span>
          )}
          <span className="font-medium">{currentLanguage.toUpperCase()}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`
              absolute top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50
              ${isRTL ? 'right-0' : 'left-0'}
            `}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-1">
              {supportedLanguages.map((langCode) =>
                renderLanguageOption(langCode, langCode === currentLanguage)
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="
          flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors
        "
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {showFlag && currentLangConfig && (
          <span className="text-xl" role="img" aria-label={currentLangConfig.name}>
            {currentLangConfig.flag}
          </span>
        )}
        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="font-medium text-gray-900">{currentLangConfig?.name || 'English'}</div>
          {showNativeName && currentLangConfig && currentLangConfig.nativeName !== currentLangConfig.name && (
            <div className="text-sm text-gray-500">{currentLangConfig.nativeName}</div>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50
            max-h-64 overflow-y-auto
          "
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
              {t('language.selector.available')}
            </div>
            {supportedLanguages.map((langCode) =>
              renderLanguageOption(langCode, langCode === currentLanguage)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;