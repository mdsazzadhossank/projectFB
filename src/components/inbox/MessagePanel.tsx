import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  MoreVertical,
  Pin,
  MailCheck,
  Archive,
  Info,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { Conversation } from '../../types/messaging';
import { Avatar } from '../ui/Avatar';
import { PlatformBadge } from '../ui/Badge';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';

interface MessagePanelProps {
  conversation: Conversation;
  onBackMobile?: () => void;
}

export const MessagePanel: React.FC<MessagePanelProps> = ({
  conversation,
  onBackMobile,
}) => {
  const {
    currentMessages,
    markAsUnread,
    togglePin,
    archiveConversation,
    isCustomerDetailsOpen,
    setIsCustomerDetailsOpen,
    showToast,
  } = useMessaging();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchQueryInChat, setSearchQueryInChat] = useState('');
  const [isSearchingChat, setIsSearchingChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const filteredChatMessages = searchQueryInChat.trim()
    ? currentMessages.filter((m) =>
        m.text.toLowerCase().includes(searchQueryInChat.toLowerCase())
      )
    : currentMessages;

  return (
    <div
      id="inbox-message-panel"
      className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-900 overflow-hidden relative"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button for mobile */}
          {onBackMobile && (
            <button
              onClick={onBackMobile}
              className="p-1.5 -ml-1 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg lg:hidden"
              title="Back to conversation list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Avatar
            src={conversation.customerAvatar}
            name={conversation.customerName}
            size="md"
            isOnline={conversation.isOnline}
            platform={conversation.platform}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                {conversation.customerName}
              </h3>
              <PlatformBadge platform={conversation.platform} size="sm" />
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {conversation.isOnline ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Now
                </span>
              ) : (
                <span>Last seen {conversation.lastSeen || 'recently'}</span>
              )}
              <span>•</span>
              <span className="truncate text-neutral-400 font-mono text-[11px]">
                {conversation.customerPhone || conversation.channelName}
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search inside chat button */}
          <button
            onClick={() => setIsSearchingChat(!isSearchingChat)}
            className={`p-2 rounded-lg transition-colors ${
              isSearchingChat
                ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Search in conversation"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Pin toggle */}
          <button
            onClick={() => togglePin(conversation.id)}
            className={`p-2 rounded-lg transition-colors ${
              conversation.isPinned
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={conversation.isPinned ? 'Unpin thread' : 'Pin thread'}
          >
            <Pin className="w-4 h-4" />
          </button>

          {/* Toggle Customer Info Panel */}
          <button
            onClick={() => setIsCustomerDetailsOpen(!isCustomerDetailsOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isCustomerDetailsOpen
                ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Customer Info"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* More options dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in zoom-in-95 duration-100"
                onClick={() => setShowMoreMenu(false)}
              >
                <button
                  onClick={() => markAsUnread(conversation.id)}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 text-neutral-700 dark:text-neutral-200"
                >
                  <MailCheck className="w-4 h-4 text-neutral-400" />
                  <span>Mark as unread</span>
                </button>
                <button
                  onClick={() => archiveConversation(conversation.id)}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 text-neutral-700 dark:text-neutral-200"
                >
                  <Archive className="w-4 h-4 text-neutral-400" />
                  <span>Archive conversation</span>
                </button>
                <div className="border-t border-neutral-100 dark:border-neutral-700 my-1" />
                <button
                  onClick={() => showToast('Conversation link copied', 'info')}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 text-neutral-700 dark:text-neutral-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-neutral-400" />
                  <span>Copy thread link</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-chat search bar overlay */}
      {isSearchingChat && (
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-800/90 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search within this conversation..."
            value={searchQueryInChat}
            onChange={(e) => setSearchQueryInChat(e.target.value)}
            autoFocus
            className="w-full text-xs bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          <button
            onClick={() => {
              setIsSearchingChat(false);
              setSearchQueryInChat('');
            }}
            className="text-xs text-neutral-400 hover:text-neutral-600 font-medium px-1"
          >
            Done
          </button>
        </div>
      )}

      {/* Message History Feed */}
      <div
        id="messages-scroll-area"
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 bg-neutral-50/50 dark:bg-neutral-950/40"
      >
        {/* Security & encryption watermark */}
        <div className="flex justify-center my-3">
          <div className="px-3 py-1 bg-neutral-200/60 dark:bg-neutral-800/80 rounded-full text-[11px] text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5 shadow-2xs">
            <span>
              Connected to {conversation.channelName} via Official Meta Cloud API
            </span>
          </div>
        </div>

        {/* Messages */}
        {filteredChatMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            platform={conversation.platform}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <MessageComposer conversationId={conversation.id} />
    </div>
  );
};
