import React from 'react';
import { Pin } from 'lucide-react';
import { Conversation } from '../../types/messaging';
import { Avatar } from '../ui/Avatar';
import { PlatformBadge } from '../ui/Badge';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  return (
    <div
      id={`conv-item-${conversation.id}`}
      onClick={onClick}
      className={`relative p-3.5 rounded-xl transition-all duration-150 cursor-pointer group select-none border ${
        isActive
          ? 'bg-neutral-100/90 dark:bg-neutral-800 border-neutral-300/80 dark:border-neutral-700 shadow-xs'
          : 'bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/40 border-transparent hover:border-neutral-200/60 dark:hover:border-neutral-800'
      }`}
    >
      {/* Active Left Indicator */}
      {isActive && (
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full" />
      )}

      <div className="flex items-start gap-3 min-w-0">
        <Avatar
          src={conversation.customerAvatar}
          name={conversation.customerName}
          size="md"
          isOnline={conversation.isOnline}
          platform={conversation.platform}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`text-xs font-bold truncate ${
                  isActive
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-800 dark:text-neutral-200'
                }`}
              >
                {conversation.customerName}
              </span>
              {conversation.isPinned && (
                <Pin className="w-2.5 h-2.5 text-neutral-400 fill-neutral-400 rotate-45 shrink-0" />
              )}
            </div>

            <span className="text-[10px] text-neutral-400 font-mono shrink-0 flex items-center gap-0.5">
              {conversation.lastMessageTimeAgo}
            </span>
          </div>

          <p
            className={`text-xs truncate ${
              conversation.unreadCount > 0
                ? 'font-bold text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {conversation.lastMessage}
          </p>

          <div className="flex items-center justify-between mt-2 pt-1">
            <div className="flex items-center gap-1.5">
              <PlatformBadge platform={conversation.platform} size="sm" showLabel={false} />
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate max-w-[110px]">
                {conversation.channelName}
              </span>
            </div>

            {conversation.unreadCount > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
