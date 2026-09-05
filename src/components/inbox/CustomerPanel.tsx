import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Plus,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { Conversation, Contact } from '../../types/messaging';
import { Avatar } from '../ui/Avatar';
import { PlatformBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CustomerPanelProps {
  conversation: Conversation;
  onCloseMobile?: () => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({
  conversation,
  onCloseMobile,
}) => {
  const {
    contacts,
    addCustomerNote,
    addCustomerTag,
    removeCustomerTag,
    showToast,
    setIsCustomerDetailsOpen,
  } = useMessaging();

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Find linked contact or fallback to conversation data
  const contact: Contact | undefined = contacts.find(
    (c) => c.id === conversation.contactId
  );

  const phone = contact?.phone || conversation.customerPhone || '+880 1712-345678';
  const email = contact?.email || conversation.customerEmail || 'customer@example.com';
  const location = contact?.location || 'Dhaka, Bangladesh';
  const startedAt = contact?.startedAt || 'Aug 21, 2026';
  const totalMessages = contact?.totalMessages || 42;
  const status = contact?.status || 'Active';
  const tags = contact?.tags || conversation.tags;
  const notes = contact?.notes || conversation.notes || [];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && contact) {
      addCustomerTag(contact.id, newTagInput.trim());
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteInput.trim() && contact) {
      addCustomerNote(contact.id, noteInput.trim());
      setNoteInput('');
      setIsAddingNote(false);
    }
  };

  return (
    <div
      id="customer-details-panel"
      className="flex flex-col h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto select-none"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          Customer Details
        </h3>
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            setIsCustomerDetailsOpen(false);
          }}
          className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6 flex-1">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={conversation.customerAvatar}
            name={conversation.customerName}
            size="xl"
            isOnline={conversation.isOnline}
            platform={conversation.platform}
          />
          <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-3">
            {conversation.customerName}
          </h4>
          <div className="mt-1.5 flex items-center gap-1.5">
            <PlatformBadge platform={conversation.platform} size="sm" />
            <StatusBadge status={status} variant={status === 'VIP' ? 'purple' : 'success'} />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            Contact Information
          </span>

          <div className="space-y-2.5 text-xs">
            {/* Phone */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 group">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-neutral-400 block font-medium">Phone</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                    {phone}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(phone, 'Phone number')}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md"
                title="Copy phone"
              >
                {copiedField === 'Phone number' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 group">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-neutral-400 block font-medium">Email</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                    {email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(email, 'Email address')}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md"
                title="Copy email"
              >
                {copiedField === 'Email address' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">Location</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Metrics */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            Conversation
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
              <span className="text-[10px] text-neutral-400 block font-medium">Started</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                {startedAt}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
              <span className="text-[10px] text-neutral-400 block font-medium">Total Messages</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                {totalMessages} msgs
              </span>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Tags
            </span>
            <button
              onClick={() => setIsAddingTag(true)}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>Add Tag</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
              >
                <span>{tag}</span>
                {contact && (
                  <button
                    onClick={() => removeCustomerTag(contact.id, tag)}
                    className="text-neutral-400 hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isAddingTag && (
            <form onSubmit={handleAddTagSubmit} className="flex items-center gap-1.5 mt-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Tag name (e.g. VIP)"
                autoFocus
                className="flex-1 px-2 py-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Button type="submit" size="sm" variant="primary">
                Save
              </Button>
              <button
                type="button"
                onClick={() => setIsAddingTag(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 text-xs"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Customer Notes */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Notes
            </span>
            <button
              onClick={() => setIsAddingNote(true)}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>Add Note</span>
            </button>
          </div>

          {notes.length > 0 ? (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-xs space-y-1"
                >
                  <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    "{note.text}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 pt-1 font-mono">
                    <span>{note.author}</span>
                    <span>{note.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic">No notes recorded yet.</p>
          )}

          {isAddingNote && (
            <form onSubmit={handleAddNoteSubmit} className="space-y-2 mt-2">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Type customer note or deal preference..."
                rows={2}
                autoFocus
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-700"
                >
                  Cancel
                </button>
                <Button type="submit" size="sm" variant="primary">
                  Save Note
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
