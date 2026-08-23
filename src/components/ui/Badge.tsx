import React from 'react';
import { Platform } from '../../types/messaging';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  size = 'md',
  showLabel = true,
}) => {
  const isFb = platform === 'facebook';

  if (isFb) {
    return (
      <span
        id={`platform-badge-fb-${size}`}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-colors ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[11px]'
            : 'px-2.5 py-1 text-xs'
        } bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 dark:bg-[#1877F2]/20 dark:text-[#4599FF] dark:border-[#1877F2]/30`}
      >
        <svg className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        {showLabel && <span>Messenger</span>}
      </span>
    );
  }

  return (
    <span
      id={`platform-badge-wa-${size}`}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-colors ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[11px]'
          : 'px-2.5 py-1 text-xs'
      } bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/20 dark:bg-[#25D366]/20 dark:text-[#2ee776] dark:border-[#25D366]/30`}
    >
      <svg className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.676.15-.201.3-.778.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.176-.3-.019-.462.132-.612.135-.135.301-.351.452-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.076-.15-.677-1.632-.928-2.235-.244-.588-.493-.508-.677-.517-.175-.009-.376-.01-.577-.01-.201 0-.527.076-.803.376s-1.054 1.029-1.054 2.508 1.079 2.91 1.23 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.378.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.702.25-1.304.176-1.43-.076-.125-.276-.2-.577-.35zM12.04 21.8a9.748 9.748 0 0 1-4.97-1.354l-.356-.211-3.697.97.986-3.602-.232-.37A9.742 9.742 0 0 1 2.296 12.04C2.296 6.67 6.67 2.296 12.04 2.296s9.744 4.374 9.744 9.744c0 5.37-4.37 9.76-9.744 9.76zm0-19.504C6.275 2.296 1.58 6.99 1.58 12.76c0 1.986.556 3.84 1.523 5.424L1.05 24.16l6.155-1.615a10.428 10.428 0 0 0 4.835 1.183c5.765 0 10.46-4.694 10.46-10.468 0-5.77-4.695-10.464-10.46-10.464z" />
      </svg>
      {showLabel && <span>WhatsApp</span>}
    </span>
  );
};

interface StatusBadgeProps {
  status: string;
  variant?: 'neutral' | 'success' | 'warning' | 'info' | 'purple';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'neutral' }) => {
  const variantStyles = {
    neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800/40',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variantStyles[variant]}`}
    >
      {status}
    </span>
  );
};
