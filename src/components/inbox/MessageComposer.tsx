import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Zap,
  FileText,
  X,
} from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { QUICK_REPLY_TEMPLATES } from '../../data/mockData';
import { Attachment } from '../../types/messaging';

interface MessageComposerProps {
  conversationId: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ conversationId }) => {
  const { sendMessage } = useMessaging();
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['👍', '👋', '❤️', '😊', '🔥', '🎉', '✅', '🙏', '💯', '✨', '🚀', '💼'];

  // Handle auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleSend = () => {
    if (!inputText.trim() && !selectedAttachment) return;

    sendMessage(conversationId, inputText, selectedAttachment || undefined);
    setInputText('');
    setSelectedAttachment(null);
    setShowEmojiPicker(false);
    setShowQuickReplies(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const insertQuickReply = (text: string) => {
    setInputText(text);
    setShowQuickReplies(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith('image/');
      setSelectedAttachment({
        type: isImg ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
      });
    }
  };

  return (
    <div
      id="message-composer-container"
      className="p-3 sm:p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shrink-0 relative"
    >
      {/* Selected Attachment preview banner */}
      {selectedAttachment && (
        <div className="mb-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-between gap-2 text-xs border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="font-medium truncate">{selectedAttachment.name}</span>
            <span className="text-neutral-400 font-mono text-[10px]">
              ({selectedAttachment.size})
            </span>
          </div>
          <button
            onClick={() => setSelectedAttachment(null)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Popovers: Emoji Picker & Quick Replies */}
      {showEmojiPicker && (
        <div
          id="composer-emoji-popover"
          className="absolute bottom-16 left-4 z-20 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl flex gap-1.5 flex-wrap max-w-xs animate-in zoom-in-95 duration-100"
        >
          {emojis.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => insertEmoji(em)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-transform hover:scale-110"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {showQuickReplies && (
        <div
          id="composer-quick-replies-popover"
          className="absolute bottom-16 left-4 z-20 w-80 max-h-72 overflow-y-auto bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl p-2 space-y-1 animate-in zoom-in-95 duration-100"
        >
          <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Quick Canned Replies
          </div>
          {QUICK_REPLY_TEMPLATES.map((qr) => (
            <button
              key={qr.id}
              type="button"
              onClick={() => insertQuickReply(qr.text)}
              className="w-full text-left p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white">
                <span>{qr.title}</span>
                <span className="text-[10px] font-mono text-blue-500 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                  {qr.shortcut}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                {qr.text}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Input container */}
      <div className="flex items-end gap-2 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/80 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        {/* Left Toolbar actions */}
        <div className="flex items-center gap-1 pb-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Attach file or image"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowQuickReplies(false);
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Insert emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowQuickReplies(!showQuickReplies);
              setShowEmojiPicker(false);
            }}
            className="p-1.5 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
            title="Insert quick response template"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          id="message-composer-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (or use /shortcuts)"
          rows={1}
          className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none resize-none max-h-32 py-1.5 px-1 leading-relaxed"
        />

        {/* Send button */}
        <button
          id="composer-send-button"
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() && !selectedAttachment}
          className="p-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-95 shadow-xs shrink-0 cursor-pointer"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between px-1 mt-1.5 text-[10px] text-neutral-400 dark:text-neutral-500">
        <span>Press <kbd className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 py-0.2 rounded border border-neutral-200 dark:border-neutral-700">Enter</kbd> to send</span>
        <span><kbd className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 py-0.2 rounded border border-neutral-200 dark:border-neutral-700">Shift+Enter</kbd> for newline</span>
      </div>
    </div>
  );
};
