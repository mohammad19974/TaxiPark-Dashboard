import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguageDirection, isRTL } from '../../i18n';

interface DirectionContextType {
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  toggleDirection: () => void;
  setDirection: (direction: 'ltr' | 'rtl') => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export const useDirection = (): DirectionContextType => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
};

interface DirectionProviderProps {
  children: React.ReactNode;
}

export const DirectionProvider: React.FC<DirectionProviderProps> = ({ children }) => {
  const [direction, setDirectionState] = useState<'ltr' | 'rtl'>('ltr');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize and update direction when language changes
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('react-i18next').then(({ useTranslation }) => {
      // This is a workaround for the hook issue
      const getCurrentLanguage = () => {
        try {
          return localStorage.getItem('i18nextLng') || 'en';
        } catch {
          return 'en';
        }
      };

      const handleLanguageChange = (lng: string) => {
        const newDirection = getLanguageDirection(lng);
        setDirectionState(newDirection);
        updateDocumentDirection(newDirection);
      };

      // Set initial direction
      const currentLang = getCurrentLanguage();
      const initialDirection = getLanguageDirection(currentLang);
      setDirectionState(initialDirection);
      updateDocumentDirection(initialDirection);
      setIsInitialized(true);

      // Listen for storage changes (language changes)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'i18nextLng' && e.newValue) {
          handleLanguageChange(e.newValue);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    });
  }, []);

  const updateDocumentDirection = (dir: 'ltr' | 'rtl') => {
    // Update document direction
    document.documentElement.dir = dir;
    document.documentElement.setAttribute('data-direction', dir);
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--text-direction', dir);
    document.documentElement.style.setProperty('--start', dir === 'rtl' ? 'right' : 'left');
    document.documentElement.style.setProperty('--end', dir === 'rtl' ? 'left' : 'right');
    
    // Update body class for styling
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(dir);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('directionchange', { 
      detail: { direction: dir, isRTL: dir === 'rtl' } 
    }));
  };

  const toggleDirection = () => {
    const newDirection = direction === 'ltr' ? 'rtl' : 'ltr';
    setDirectionState(newDirection);
    updateDocumentDirection(newDirection);
  };

  const setDirection = (newDirection: 'ltr' | 'rtl') => {
    setDirectionState(newDirection);
    updateDocumentDirection(newDirection);
  };

  const contextValue: DirectionContextType = {
    direction,
    isRTL: direction === 'rtl',
    toggleDirection,
    setDirection,
  };

  return (
    <DirectionContext.Provider value={contextValue}>
      <div 
        className={`direction-provider ${direction}`} 
        dir={direction}
        data-direction={direction}
      >
        {children}
      </div>
    </DirectionContext.Provider>
  );
};

// Hook for components that need to respond to direction changes
export const useDirectionChange = (callback: (direction: 'ltr' | 'rtl', isRTL: boolean) => void) => {
  useEffect(() => {
    const handleDirectionChange = (event: CustomEvent) => {
      callback(event.detail.direction, event.detail.isRTL);
    };

    window.addEventListener('directionchange', handleDirectionChange as EventListener);
    
    return () => {
      window.removeEventListener('directionchange', handleDirectionChange as EventListener);
    };
  }, [callback]);
};

// Utility hook for RTL-aware positioning
export const useRTLAwarePosition = () => {
  const { direction, isRTL } = useDirection();
  
  return {
    direction,
    isRTL,
    start: isRTL ? 'right' : 'left',
    end: isRTL ? 'left' : 'right',
    marginStart: (value: string) => isRTL ? { marginRight: value } : { marginLeft: value },
    marginEnd: (value: string) => isRTL ? { marginLeft: value } : { marginRight: value },
    paddingStart: (value: string) => isRTL ? { paddingRight: value } : { paddingLeft: value },
    paddingEnd: (value: string) => isRTL ? { paddingLeft: value } : { paddingRight: value },
    textAlign: isRTL ? 'right' as const : 'left' as const,
    float: {
      start: isRTL ? 'right' as const : 'left' as const,
      end: isRTL ? 'left' as const : 'right' as const,
    },
  };
};

export default DirectionProvider;