import React from 'react';
import { Check, CheckCheck, FileText, Download } from 'lucide-react';
import { Message, Platform } from '../../types/messaging';

interface MessageBubbleProps {
  message: Message;
  platform: Platform;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, platform }) => {
  const isAgent = message.sender === 'agent';
  const isFb = platform === 'facebook';

  return (
    <div
      id={`msg-bubble-${message.id}`}
      className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'} mb-3 max-w-[85%] sm:max-w-[75%] ${
        isAgent ? 'ml-auto' : 'mr-auto'
      }`}
    >
      {/* Sender label if in group or explicit */}
      {!isAgent && message.senderName && (
        <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 mb-1 px-1">
          {message.senderName}
        </span>
      )}

      {/* Bubble Container */}
      <div
        className={`relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all shadow-xs ${
          isAgent
            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-br-xs'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-xs border border-neutral-200/50 dark:border-neutral-700/50'
        }`}
      >
        {/* Attachment rendering */}
        {message.attachment && (
          <div className="mb-2 p-2.5 rounded-xl bg-black/10 dark:bg-black/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate">{message.attachment.name || 'Document'}</p>
                <span className="text-[10px] opacity-75 font-mono">{message.attachment.size || '120 KB'}</span>
              </div>
            </div>
            <a
              href={message.attachment.url}
              download
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Message Text */}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>

        {/* Timestamp & Status indicators */}
        <div
          className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-mono select-none ${
            isAgent
              ? 'text-neutral-300 dark:text-neutral-500'
              : 'text-neutral-400 dark:text-neutral-500'
          }`}
        >
          <span>{message.timestamp}</span>

          {isAgent && (
            <span className="inline-flex items-center" title={`Status: ${message.status}`}>
              {message.status === 'read' ? (
                <CheckCheck className={`w-3.5 h-3.5 ${isFb ? 'text-[#4599FF]' : 'text-[#25D366]'}`} />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3.5 h-3.5 opacity-70" />
              ) : (
                <Check className="w-3.5 h-3.5 opacity-60" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
