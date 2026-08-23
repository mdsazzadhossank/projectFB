import React, { useMemo } from 'react';
import { Search, Filter, MessageSquareDashed, SlidersHorizontal, Plus } from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { InboxFilter } from '../../types/messaging';
import { ConversationItem } from './ConversationItem';
import { EmptyState } from '../ui/EmptyState';

export const ConversationList: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    inboxFilter,
    setInboxFilter,
    searchQuery,
    setSearchQuery,
    counts,
    setIsNewContactModalOpen,
  } = useMessaging();

  const filterTabs: { id: InboxFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'facebook', label: 'Facebook', count: counts.facebook },
    { id: 'whatsapp', label: 'WhatsApp', count: counts.whatsapp },
    { id: 'unread', label: 'Unread', count: counts.unread },
  ];

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // Filter by channel/status
      if (inboxFilter === 'facebook' && c.platform !== 'facebook') return false;
      if (inboxFilter === 'whatsapp' && c.platform !== 'whatsapp') return false;
      if (inboxFilter === 'unread' && c.unreadCount === 0) return false;
      if (inboxFilter === 'vip' && !c.tags.includes('VIP')) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = c.customerName.toLowerCase().includes(query);
        const matchesMessage = c.lastMessage.toLowerCase().includes(query);
        const matchesPhone = c.customerPhone?.toLowerCase().includes(query) ?? false;
        const matchesTags = c.tags.some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesMessage || matchesPhone || matchesTags;
      }

      return true;
    });
  }, [conversations, inboxFilter, searchQuery]);

  return (
    <div
      id="inbox-conversation-list"
      className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 select-none"
    >
      {/* Top Header & Search */}
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Inbox
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full">
              {filteredConversations.length}
            </span>
          </div>

          <button
            onClick={() => setIsNewContactModalOpen(true)}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Start new thread"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            id="inbox-search-input"
            type="text"
            placeholder="Search conversations, names, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = inboxFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                onClick={() => setInboxFilter(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-900'
                      : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation List Body */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeConversationId === conv.id}
              onClick={() => setActiveConversation(conv.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={MessageSquareDashed}
            title="No conversations found"
            description={
              searchQuery
                ? `No results matching "${searchQuery}". Try a different keyword.`
                : 'No conversations in this filter category.'
            }
            actionLabel={searchQuery ? 'Clear Search' : undefined}
            onAction={searchQuery ? () => setSearchQuery('') : undefined}
          />
        )}
      </div>
    </div>
  );
};
