import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-neutral-200/80 dark:bg-neutral-800 rounded-md ${className}`}
    />
  );
};

export const ConversationListSkeleton: React.FC = () => {
  return (
    <div className="p-3 space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="w-24 h-3.5" />
              <Skeleton className="w-10 h-3" />
            </div>
            <Skeleton className="w-44 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const MessagePanelSkeleton: React.FC = () => {
  return (
    <div className="flex-1 p-6 space-y-4 flex flex-col justify-end">
      <div className="flex gap-3 max-w-[70%]">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <Skeleton className="w-56 h-12 rounded-2xl" />
      </div>
      <div className="flex gap-3 max-w-[70%] self-end flex-row-reverse">
        <Skeleton className="w-48 h-10 rounded-2xl" />
      </div>
      <div className="flex gap-3 max-w-[70%]">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <Skeleton className="w-64 h-16 rounded-2xl" />
      </div>
      <div className="flex gap-3 max-w-[70%] self-end flex-row-reverse">
        <Skeleton className="w-60 h-14 rounded-2xl" />
      </div>
    </div>
  );
};
