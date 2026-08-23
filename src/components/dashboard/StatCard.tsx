import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  growth: number;
  subtext: string;
  icon: LucideIcon;
  platform?: 'facebook' | 'whatsapp';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  growth,
  subtext,
  icon: Icon,
  platform,
}) => {
  const isFb = platform === 'facebook';
  const isWa = platform === 'whatsapp';

  const iconBg = isFb
    ? 'bg-[#1877F2]/10 text-[#1877F2] dark:bg-[#1877F2]/20 dark:text-[#4599FF]'
    : isWa
    ? 'bg-[#25D366]/10 text-[#128C7E] dark:bg-[#25D366]/20 dark:text-[#2ee776]'
    : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';

  return (
    <div
      id={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4 stroke-[2]" />
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +{growth}%
          </span>
          <span className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">
            {subtext}
          </span>
        </div>
      </div>
    </div>
  );
};
