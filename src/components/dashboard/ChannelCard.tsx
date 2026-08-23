import React from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { IntegrationChannel } from '../../types/messaging';
import { Button } from '../ui/Button';

interface ChannelCardProps {
  channel: IntegrationChannel;
  onManage: () => void;
  onSync: () => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onManage, onSync }) => {
  const isFb = channel.platform === 'facebook';

  return (
    <div
      id={`channel-card-${channel.platform}`}
      className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isFb
                ? 'bg-[#1877F2]/10 text-[#1877F2] dark:bg-[#1877F2]/20 dark:text-[#4599FF]'
                : 'bg-[#25D366]/10 text-[#128C7E] dark:bg-[#25D366]/20 dark:text-[#2ee776]'
            }`}
          >
            {isFb ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.676.15-.201.3-.778.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.176-.3-.019-.462.132-.612.135-.135.301-.351.452-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.076-.15-.677-1.632-.928-2.235-.244-.588-.493-.508-.677-.517-.175-.009-.376-.01-.577-.01-.201 0-.527.076-.803.376s-1.054 1.029-1.054 2.508 1.079 2.91 1.23 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.378.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.702.25-1.304.176-1.43-.076-.125-.276-.2-.577-.35zM12.04 21.8a9.748 9.748 0 0 1-4.97-1.354l-.356-.211-3.697.97.986-3.602-.232-.37A9.742 9.742 0 0 1 2.296 12.04C2.296 6.67 6.67 2.296 12.04 2.296s9.744 4.374 9.744 9.744c0 5.37-4.37 9.76-9.744 9.76zm0-19.504C6.275 2.296 1.58 6.99 1.58 12.76c0 1.986.556 3.84 1.523 5.424L1.05 24.16l6.155-1.615a10.428 10.428 0 0 0 4.835 1.183c5.765 0 10.46-4.694 10.46-10.468 0-5.77-4.695-10.464-10.46-10.464z" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">
              {channel.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 animate-pulse" />
                Connected
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                Sync {channel.lastSync}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onSync}
          className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title="Sync with Meta API"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80">
        <div>
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            {isFb ? 'Connected Page' : 'Business Account'}
          </span>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-1 truncate">
            {channel.accountName}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5 truncate">
            {channel.identifier}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            Messages Today
          </span>
          <p className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {channel.messagesToday.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Active polling
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Status: Operational (Webhook 200 OK)
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onManage}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Manage
        </Button>
      </div>
    </div>
  );
};
