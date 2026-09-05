import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Conversation,
  Contact,
  Message,
  IntegrationChannel,
  KPIStats,
  NavigationPage,
  InboxFilter,
  CustomerNote,
  Attachment
} from '../types/messaging';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_CONTACTS,
  INITIAL_MESSAGES,
  INITIAL_INTEGRATIONS,
  INITIAL_KPIS,
  CURRENT_USER
} from '../data/mockData';
import {
  fetchConversations,
  fetchIntegrations,
  fetchContacts,
  postMessage,
} from '../lib/api';
import Pusher from 'pusher-js';

// Configure via Vite env; fallbacks keep local development working out of the box.
const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || '95080c991cf04726bb73';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'ap2';

// Persist integration connection state so a page connect survives a reload even
// when the PHP backend isn't running yet. The server is still the source of truth
// whenever it responds with data.
const INTEGRATIONS_STORAGE_KEY = 'messagehub.integrations.v1';

function loadStoredIntegrations(): IntegrationChannel[] | null {
  try {
    const raw = localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as IntegrationChannel[]) : null;
  } catch {
    return null;
  }
}

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface MessagingContextType {
  // Navigation & Page State
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;

  // Conversations State
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  setActiveConversation: (id: string | null) => void;
  inboxFilter: InboxFilter;
  setInboxFilter: (filter: InboxFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Messages State
  messages: Record<string, Message[]>;
  currentMessages: Message[];
  sendMessage: (conversationId: string, text: string, attachment?: Attachment) => void;
  markAsRead: (conversationId: string) => void;
  markAsUnread: (conversationId: string) => void;
  togglePin: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;

  // Contacts State
  contacts: Contact[];
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  addCustomerNote: (contactId: string, noteText: string) => void;
  addCustomerTag: (contactId: string, tag: string) => void;
  removeCustomerTag: (contactId: string, tag: string) => void;
  addNewContact: (newContact: Partial<Contact>) => void;
  updateContact: (updated: Contact) => void;

  // Integrations State
  integrations: IntegrationChannel[];
  toggleIntegration: (id: string, state: boolean) => void;
  syncChannel: (id: string) => void;
  updateIntegration: (id: string, patch: Partial<IntegrationChannel>) => void;

  // UI & Drawer States
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isCustomerDetailsOpen: boolean;
  setIsCustomerDetailsOpen: (open: boolean) => void;
  isMobileConversationOpen: boolean;
  setIsMobileConversationOpen: (open: boolean) => void;

  // Modals
  isFacebookModalOpen: boolean;
  setIsFacebookModalOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  isNewContactModalOpen: boolean;
  setIsNewContactModalOpen: (open: boolean) => void;

  // KPIs & Stats
  kpis: KPIStats;

  // Toast notifications
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // Filter counts
  counts: {
    all: number;
    facebook: number;
    whatsapp: number;
    unread: number;
    vip: number;
  };
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');

  // Seed state with the rich mock data so the UI is never blank, then refresh
  // from the PHP backend when it is reachable (non-empty responses replace mocks).
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [integrations, setIntegrations] = useState<IntegrationChannel[]>(
    () => loadStoredIntegrations() ?? INITIAL_INTEGRATIONS
  );
  const [kpis, setKpis] = useState<KPIStats>(INITIAL_KPIS);

  const [inboxFilter, setInboxFilter] = useState<InboxFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Drawers & Modals
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState<boolean>(true);
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [isFacebookModalOpen, setIsFacebookModalOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  // Initial data load: refresh from PHP backend. On failure (or empty DB) we
  // keep the mock data so the app remains fully usable.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [convRes, intRes, contactRes] = await Promise.allSettled([
          fetchConversations(),
          fetchIntegrations(),
          fetchContacts(),
        ]);

        if (cancelled) return;

        const convsFulfilled = convRes.status === 'fulfilled';
        const intsFulfilled = intRes.status === 'fulfilled';
        const contactsFulfilled = contactRes.status === 'fulfilled';

        const convs = convsFulfilled ? convRes.value : [];
        const ints = intsFulfilled ? intRes.value : [];
        const cnts = contactsFulfilled ? contactRes.value : [];

        // Trust the backend whenever it answers — even an empty inbox is real
        // state. Mock data is ONLY a fallback when a fetch rejects (backend down).
        if (convsFulfilled) setConversations(convs);
        if (intsFulfilled) setIntegrations(ints);
        if (contactsFulfilled) setContacts(cnts);

        const anyFailure = convRes.status === 'rejected' || intRes.status === 'rejected' || contactRes.status === 'rejected';
        if (anyFailure) {
          showToast('Backend offline — showing demo data', 'info');
        }
      } catch (err) {
        // No-op fallback: mock data remains.
        console.error('Failed to sync with backend, using demo data.', err);
      }
    };

    load();

    // Pusher WebSocket Integration (real-time incoming messages)
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('chat');
    channel.bind('new-message', (data: any) => {
      if (cancelled || !data?.conversationId) return;
      const convId = data.conversationId;
      const platform = data.platform === 'whatsapp' ? 'whatsapp' : 'facebook';

      // Append message (dedupe by message id in case of Pusher re-delivery).
      setMessages((prev) => {
        const currentList = prev[convId] || [];
        if (currentList.some((m) => m.id === data.id)) return prev;
        return { ...prev, [convId]: [...currentList, data] };
      });

      setConversations((prev) => {
        if (prev.some((c) => c.id === convId)) {
          // Update existing conversation
          return prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  lastMessage: data.text,
                  lastMessageTimestamp: data.timestamp,
                  lastMessageTimeAgo: 'Just now',
                  unreadCount: (c.unreadCount || 0) + 1,
                }
              : c
          );
        }

        // Brand-new conversation from the webhook — create a row so it actually
        // shows up in the inbox (previously it was silently ignored).
        const newConv: Conversation = {
          id: convId,
          contactId: 'contact_' + (data.sender || convId),
          customerName: data.senderName || 'New Facebook Customer',
          customerAvatar: '',
          platform,
          channelName: platform === 'whatsapp' ? 'WhatsApp Business' : 'Messenger',
          lastMessage: data.text,
          lastMessageTimestamp: data.timestamp,
          lastMessageTimeAgo: 'Just now',
          unreadCount: 1,
          status: 'active',
          tags: [],
          isOnline: true,
        };
        return [newConv, ...prev];
      });

      showToast('New message received', 'info');
    });

    return () => {
      cancelled = true;
      pusher.unsubscribe('chat');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep integration connections (and the connected page name) after a reload.
  useEffect(() => {
    try {
      localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(integrations));
    } catch {
      // storage unavailable (private mode) — ignore
    }
  }, [integrations]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Current messages
  const currentMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messages[activeConversationId] || [];
  }, [messages, activeConversationId]);

  // Dynamic filter counts
  const counts = useMemo(() => {
    const all = conversations.length;
    const facebook = conversations.filter((c) => c.platform === 'facebook').length;
    const whatsapp = conversations.filter((c) => c.platform === 'whatsapp').length;
    const unread = conversations.filter((c) => c.unreadCount > 0).length;
    const vip = conversations.filter((c) => c.tags.includes('VIP')).length;
    return { all, facebook, whatsapp, unread, vip };
  }, [conversations]);

  // Mark conversation as read
  const markAsRead = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId && c.unreadCount > 0) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      })
    );
  };

  // Mark conversation as unread
  const markAsUnread = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return { ...c, unreadCount: Math.max(c.unreadCount, 1) };
        }
        return c;
      })
    );
    showToast('Conversation marked as unread', 'info');
  };

  // Toggle Pin
  const togglePin = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const nextState = !c.isPinned;
          showToast(nextState ? 'Conversation pinned' : 'Conversation unpinned', 'info');
          return { ...c, isPinned: nextState };
        }
        return c;
      })
    );
  };

  // Archive conversation
  const archiveConversation = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return { ...c, status: 'archived' as const };
        }
        return c;
      })
    );
    showToast('Conversation moved to archive', 'info');
  };

  // Select conversation
  const handleSetActiveConversation = (id: string | null) => {
    setActiveConversationId(id);
    if (id) {
      markAsRead(id);
      setIsMobileConversationOpen(true);
    }
  };

  // Send message
  const sendMessage = (conversationId: string, text: string, attachment?: Attachment) => {
    if (!text.trim() && !attachment) return;

    const timeNow = new Date();
    const formattedTime = timeNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      conversationId,
      sender: 'agent',
      senderName: CURRENT_USER.name,
      text: text.trim(),
      timestamp: formattedTime,
      status: 'delivered',
      attachment,
    };

    // Update messages map locally for instant feedback
    setMessages((prev) => {
      const existing = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: [...existing, newMsg],
      };
    });

    // Persist to PHP Backend API (best-effort; UI updates optimistically)
    postMessage(conversationId, text.trim())
      .catch((err) => {
        console.error('Failed to send message to backend', err);
        showToast('Failed to send message', 'error');
      });

    // Update conversation last message & timestamp
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text.trim() || (attachment ? `Sent an ${attachment.type}` : 'Sent an attachment'),
            lastMessageTimestamp: formattedTime,
            lastMessageTimeAgo: 'Just now',
            unreadCount: 0,
          };
        }
        return c;
      })
    );

    // Update KPIs
    setKpis((prev) => ({
      ...prev,
      outgoingToday: prev.outgoingToday + 1,
    }));

    showToast('Message delivered', 'success');
  };

  // Add customer note
  const addCustomerNote = (contactId: string, noteText: string) => {
    if (!noteText.trim()) return;

    const newNote: CustomerNote = {
      id: 'note_' + Date.now(),
      text: noteText.trim(),
      createdAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      author: CURRENT_USER.name,
    };

    setContacts((prev) =>
      prev.map((cnt) => {
        if (cnt.id === contactId) {
          return {
            ...cnt,
            notes: [newNote, ...(cnt.notes || [])],
          };
        }
        return cnt;
      })
    );

    // Also update notes in conversation if cached
    setConversations((prev) =>
      prev.map((c) => {
        if (c.contactId === contactId) {
          return {
            ...c,
            notes: [newNote, ...(c.notes || [])],
          };
        }
        return c;
      })
    );

    showToast('Note added to customer profile', 'success');
  };

  // Add customer tag
  const addCustomerTag = (contactId: string, tag: string) => {
    const cleanTag = tag.trim();
    if (!cleanTag) return;

    setContacts((prev) =>
      prev.map((cnt) => {
        if (cnt.id === contactId && !cnt.tags.includes(cleanTag)) {
          return { ...cnt, tags: [...cnt.tags, cleanTag] };
        }
        return cnt;
      })
    );

    setConversations((prev) =>
      prev.map((c) => {
        if (c.contactId === contactId && !c.tags.includes(cleanTag)) {
          return { ...c, tags: [...c.tags, cleanTag] };
        }
        return c;
      })
    );

    showToast(`Tag "${cleanTag}" added`, 'success');
  };

  // Remove customer tag
  const removeCustomerTag = (contactId: string, tag: string) => {
    setContacts((prev) =>
      prev.map((cnt) => {
        if (cnt.id === contactId) {
          return { ...cnt, tags: cnt.tags.filter((t) => t !== tag) };
        }
        return cnt;
      })
    );

    setConversations((prev) =>
      prev.map((c) => {
        if (c.contactId === contactId) {
          return { ...c, tags: c.tags.filter((t) => t !== tag) };
        }
        return c;
      })
    );

    showToast(`Tag removed`, 'info');
  };

  // Add new contact
  const addNewContact = (newContact: Partial<Contact>) => {
    const id = 'cnt_' + (contacts.length + 1).toString().padStart(2, '0');
    const created: Contact = {
      id,
      name: newContact.name || 'New Customer',
      avatar: newContact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phone: newContact.phone || '+880 1700-000000',
      email: newContact.email || 'customer@example.com',
      location: newContact.location || 'Dhaka, Bangladesh',
      platform: newContact.platform || 'facebook',
      channelName: newContact.platform === 'facebook' ? 'Social Ads Expert' : 'Social Ads Studio',
      tags: newContact.tags || ['Lead'],
      notes: [],
      startedAt: 'Today',
      lastConversationTime: 'Just now',
      lastConversationAgo: '0m',
      totalMessages: 1,
      status: 'Lead',
      totalOrders: 0,
      lifetimeValue: '৳ 0',
    };

    setContacts((prev) => [created, ...prev]);

    // Also create matching conversation
    const newConv: Conversation = {
      id: 'conv_' + (conversations.length + 1).toString().padStart(2, '0'),
      contactId: id,
      customerName: created.name,
      customerAvatar: created.avatar,
      customerPhone: created.phone,
      customerEmail: created.email,
      platform: created.platform,
      channelName: created.channelName,
      lastMessage: 'Conversation initiated',
      lastMessageTimestamp: 'Just now',
      lastMessageTimeAgo: 'Just now',
      unreadCount: 0,
      status: 'active',
      tags: created.tags,
      isOnline: true,
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    showToast(`Created contact "${created.name}"`, 'success');
  };

  const updateContact = (updated: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setConversations((prev) =>
      prev.map((c) => {
        if (c.contactId === updated.id) {
          return {
            ...c,
            customerName: updated.name,
            customerAvatar: updated.avatar,
            customerPhone: updated.phone,
            customerEmail: updated.email,
            tags: updated.tags,
          };
        }
        return c;
      })
    );
    if (selectedContact?.id === updated.id) {
      setSelectedContact(updated);
    }
    showToast(`Contact updated`, 'success');
  };

  // Toggle integration connection (local state only; meta calls go through modals + API)
  const toggleIntegration = (id: string, state: boolean) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            isConnected: state,
            lastSync: state ? 'Just now' : item.lastSync,
            webhookStatus: (state ? 'operational' : 'offline') as 'operational' | 'offline',
          };
          return updated;
        }
        return item;
      })
    );

    const target = integrations.find((i) => i.id === id);
    showToast(
      `${target?.name || 'Channel'} ${state ? 'successfully connected' : 'disconnected'}`,
      state ? 'success' : 'info'
    );
  };

  // Sync channel
  const syncChannel = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, lastSync: 'Just now', messagesToday: item.messagesToday + 5 };
        }
        return item;
      })
    );
    showToast('Channel synced with Meta Graph API', 'success');
  };

  // Merge partial updates into a single integration (used by connection modals)
  const updateIntegration = (id: string, patch: Partial<IntegrationChannel>) => {
    setIntegrations((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <MessagingContext.Provider
      value={{
        activePage,
        setActivePage,
        conversations,
        activeConversationId,
        activeConversation,
        setActiveConversation: handleSetActiveConversation,
        inboxFilter,
        setInboxFilter,
        searchQuery,
        setSearchQuery,
        messages,
        currentMessages,
        sendMessage,
        markAsRead,
        markAsUnread,
        togglePin,
        archiveConversation,
        contacts,
        selectedContact,
        setSelectedContact,
        addCustomerNote,
        addCustomerTag,
        removeCustomerTag,
        addNewContact,
        updateContact,
        integrations,
        toggleIntegration,
        syncChannel,
        updateIntegration,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isCustomerDetailsOpen,
        setIsCustomerDetailsOpen,
        isMobileConversationOpen,
        setIsMobileConversationOpen,
        isFacebookModalOpen,
        setIsFacebookModalOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        isNewContactModalOpen,
        setIsNewContactModalOpen,
        kpis,
        toasts,
        showToast,
        dismissToast,
        counts,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};