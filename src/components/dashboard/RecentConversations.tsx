import React from 'react';
import { ArrowRight, MessageSquare, Clock } from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { Avatar } from '../ui/Avatar';
import { PlatformBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const RecentConversations: React.FC = () => {
  const {
    conversations,
    setActiveConversation,
    setActivePage,
  } = useMessaging();

  const recentList = conversations.slice(0, 6);

  const handleOpenConversation = (id: string) => {
    setActiveConversation(id);
    setActivePage('inbox');
  };

  return (
    <div
      id="recent-conversations-section"
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Recent Conversations
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Incoming queries across Facebook Messenger & WhatsApp Business
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActivePage('inbox')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View all conversations
        </Button>
      </div>

      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
        {recentList.map((conv) => {
          return (
            <div
              key={conv.id}
              id={`recent-conv-${conv.id}`}
              onClick={() => handleOpenConversation(conv.id)}
              className="p-4 sm:px-5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors duration-150 cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Avatar
                  src={conv.customerAvatar}
                  name={conv.customerName}
                  size="md"
                  isOnline={conv.isOnline}
                  platform={conv.platform}
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {conv.customerName}
                    </span>
                    {conv.tags.slice(0, 1).map((t) => (
                      <span
                        key={t}
                        className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-xs sm:max-w-md md:max-w-lg mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:block">
                  <PlatformBadge platform={conv.platform} size="sm" />
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 inline" />
                    {conv.lastMessageTimeAgo}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="mt-1 px-1.5 py-0.2 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-neutral-50/50 dark:bg-neutral-800/20 text-center border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={() => setActivePage('inbox')}
          className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Open Unified Inbox ({conversations.length} total active threads)</span>
        </button>
      </div>
    </div>
  );
};
