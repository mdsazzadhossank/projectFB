import React from 'react';
import { Platform } from '../../types/messaging';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  platform?: Platform;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isOnline,
  platform,
  className = '',
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const badgeOffset = {
    xs: '-bottom-0.5 -right-0.5 w-2 h-2',
    sm: '-bottom-0.5 -right-0.5 w-2.5 h-2.5',
    md: 'bottom-0 right-0 w-3 h-3',
    lg: 'bottom-0 right-0 w-3.5 h-3.5',
    xl: 'bottom-0.5 right-0.5 w-4 h-4',
  };

  const platformBadgeOffset = {
    xs: '-top-1 -right-1 w-3 h-3',
    sm: '-top-1 -right-1 w-3.5 h-3.5',
    md: '-top-1 -right-1 w-4 h-4',
    lg: '-top-1.5 -right-1.5 w-5 h-5',
    xl: '-top-1.5 -right-1.5 w-6 h-6',
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeStyles[size]} rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10`}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Online indicator */}
      {isOnline !== undefined && (
        <span
          className={`absolute ${badgeOffset[size]} rounded-full ring-2 ring-white dark:ring-neutral-900 ${
            isOnline ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'
          }`}
        />
      )}

      {/* Platform mini badge */}
      {platform && (
        <div
          className={`absolute ${platformBadgeOffset[size]} rounded-full p-0.5 flex items-center justify-center ring-2 ring-white dark:ring-neutral-900 ${
            platform === 'facebook'
              ? 'bg-[#1877F2] text-white'
              : 'bg-[#25D366] text-white'
          }`}
          title={platform === 'facebook' ? 'Facebook Messenger' : 'WhatsApp'}
        >
          {platform === 'facebook' ? (
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          ) : (
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.676.15-.201.3-.778.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.176-.3-.019-.462.132-.612.135-.135.301-.351.452-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.076-.15-.677-1.632-.928-2.235-.244-.588-.493-.508-.677-.517-.175-.009-.376-.01-.577-.01-.201 0-.527.076-.803.376s-1.054 1.029-1.054 2.508 1.079 2.91 1.23 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.378.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.702.25-1.304.176-1.43-.076-.125-.276-.2-.577-.35zM12.04 21.8a9.748 9.748 0 0 1-4.97-1.354l-.356-.211-3.697.97.986-3.602-.232-.37A9.742 9.742 0 0 1 2.296 12.04C2.296 6.67 6.67 2.296 12.04 2.296s9.744 4.374 9.744 9.744c0 5.37-4.37 9.76-9.744 9.76zm0-19.504C6.275 2.296 1.58 6.99 1.58 12.76c0 1.986.556 3.84 1.523 5.424L1.05 24.16l6.155-1.615a10.428 10.428 0 0 0 4.835 1.183c5.765 0 10.46-4.694 10.46-10.468 0-5.77-4.695-10.464-10.46-10.464z" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};
