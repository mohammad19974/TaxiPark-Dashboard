import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

const avatarSizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl',
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  fallback,
  showFallback = false,
  className,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const shouldShowFallback = !src || imageError || showFallback;
  const initials = name ? getInitials(name) : '';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden',
        avatarSizes[size],
        className
      )}
      {...props}
    >
      {!shouldShowFallback && (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="h-full w-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {shouldShowFallback && (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600">
          {fallback || (
            initials ? (
              <span className="font-medium">{initials}</span>
            ) : (
              <User className="h-1/2 w-1/2" />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;