import React, { useState, useRef, useEffect } from 'react';
import { Check, Palette, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../providers/DirectionProvider';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  showPresets?: boolean;
  showCustomInput?: boolean;
  showAccessibilityInfo?: boolean;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  showPresets = true,
  showCustomInput = true,
  showAccessibilityInfo = true,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const {
    currentTheme,
    setTheme,
    generateThemeFromColor,
    presetThemes,
    isValidColor,
    getContrastRatio,
    isAccessible,
  } = useTheme();

  const [customColor, setCustomColor] = useState(value || currentTheme.value);
  const [inputError, setInputError] = useState('');
  const [showColorInput, setShowColorInput] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Handle preset color selection
  const handlePresetSelect = (color: string) => {
    const selectedTheme = presetThemes.find(theme => theme.value === color);
    if (selectedTheme) {
      setTheme(selectedTheme);
      onChange?.(color);
      setCustomColor(color);
      setInputError('');
    }
  };

  // Handle custom color input
  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setInputError('');

    if (color && isValidColor(color)) {
      try {
        const customTheme = generateThemeFromColor(color);
        setTheme(customTheme);
        onChange?.(color);
      } catch (error) {
        setInputError('Invalid color format');
      }
    } else if (color) {
      setInputError('Please enter a valid hex color (e.g., #3b82f6)');
    }
  };

  // Handle color input blur
  const handleColorInputBlur = () => {
    if (customColor && !isValidColor(customColor)) {
      setInputError('Please enter a valid hex color (e.g., #3b82f6)');
    }
  };

  // Get accessibility info for a color
  const getAccessibilityInfo = (backgroundColor: string) => {
    const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
    const blackContrast = getContrastRatio(backgroundColor, '#000000');
    const whiteAccessible = isAccessible(backgroundColor, '#ffffff');
    const blackAccessible = isAccessible(backgroundColor, '#000000');

    return {
      whiteContrast: whiteContrast.toFixed(2),
      blackContrast: blackContrast.toFixed(2),
      whiteAccessible,
      blackAccessible,
      recommendedTextColor: whiteContrast > blackContrast ? '#ffffff' : '#000000',
    };
  };

  const accessibilityInfo = getAccessibilityInfo(customColor);

  // Focus color input when shown
  useEffect(() => {
    if (showColorInput && colorInputRef.current) {
      colorInputRef.current.focus();
    }
  }, [showColorInput]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preset Colors */}
      {showPresets && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {t('theme.selector.presets')}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {presetThemes.map((theme) => {
              const isSelected = currentTheme.value === theme.value;
              return (
                <button
                  key={theme.name}
                  onClick={() => handlePresetSelect(theme.value)}
                  className={`
                    relative w-12 h-12 rounded-lg border-2 transition-all duration-200
                    hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${
                      isSelected
                        ? 'border-gray-400 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  style={{ backgroundColor: theme.value }}
                  title={theme.name}
                  aria-label={`Select ${theme.name} theme`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check 
                        className="h-5 w-5" 
                        style={{ 
                          color: accessibilityInfo.recommendedTextColor 
                        }} 
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Color Input */}
      {showCustomInput && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              {t('theme.selector.custom')}
            </h3>
            <button
              onClick={() => setShowColorInput(!showColorInput)}
              className="
                flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-600 
                hover:text-blue-700 transition-colors
              "
            >
              <Palette className="h-3 w-3" />
              {showColorInput ? 'Hide' : 'Show'} Input
            </button>
          </div>

          {showColorInput && (
            <div className="space-y-3">
              <div className="flex gap-3">
                {/* Color Preview */}
                <div
                  className="w-12 h-10 rounded-md border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: isValidColor(customColor) ? customColor : '#f3f4f6' }}
                  title="Color preview"
                />

                {/* Color Input */}
                <div className="flex-1">
                  <input
                    ref={colorInputRef}
                    type="text"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    onBlur={handleColorInputBlur}
                    placeholder="#3b82f6"
                    className={`
                      w-full px-3 py-2 border rounded-md text-sm font-mono
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${
                        inputError
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300'
                      }
                    `}
                    aria-label="Custom color hex code"
                  />
                  {inputError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {inputError}
                    </p>
                  )}
                </div>
              </div>

              {/* HTML5 Color Picker */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={isValidColor(customColor) ? customColor : '#3b82f6'}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  title="Pick a color"
                />
                <span className="text-xs text-gray-500">
                  Or use the color picker
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accessibility Information */}
      {showAccessibilityInfo && isValidColor(customColor) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Accessibility Information
              </h4>
              <div className="space-y-2 text-xs text-blue-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium">White Text</div>
                    <div className="flex items-center gap-2">
                      <span>Contrast: {accessibilityInfo.whiteContrast}:1</span>
                      {accessibilityInfo.whiteAccessible ? (
                        <span className="text-green-600">✓ WCAG AA</span>
                      ) : (
                        <span className="text-red-600">✗ Below WCAG AA</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Black Text</div>
                    <div className="flex items-center gap-2">
                      <span>Contrast: {accessibilityInfo.blackContrast}:1</span>
                      {accessibilityInfo.blackAccessible ? (
                        <span className="text-green-600">✓ WCAG AA</span>
                      ) : (
                        <span className="text-red-600">✗ Below WCAG AA</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <div className="font-medium mb-1">Recommended Text Color:</div>
                  <div 
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: customColor,
                      color: accessibilityInfo.recommendedTextColor,
                    }}
                  >
                    {accessibilityInfo.recommendedTextColor === '#ffffff' ? 'White' : 'Black'} text
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {isValidColor(customColor) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {t('theme.selector.preview')}
          </h4>
          <div className="space-y-3">
            {/* Button Preview */}
            <div className="flex gap-3 flex-wrap">
              <button
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: customColor,
                  color: accessibilityInfo.recommendedTextColor,
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium border transition-colors"
                style={{
                  borderColor: customColor,
                  color: customColor,
                  backgroundColor: 'transparent',
                }}
              >
                Outline Button
              </button>
            </div>

            {/* Link Preview */}
            <div>
              <a
                href="#"
                className="text-sm font-medium hover:underline"
                style={{ color: customColor }}
                onClick={(e) => e.preventDefault()}
              >
                Sample Link Text
              </a>
            </div>

            {/* Badge Preview */}
            <div>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${customColor}20`,
                  color: customColor,
                }}
              >
                Sample Badge
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;