/**
 * API layer: typed fetch helpers + DTO normalization.
 *
 * The PHP/MySQL backend returns snake_case rows that do not match the camelCase
 * domain types in `src/types/messaging.ts`. These helpers map raw rows onto the
 * typed models so components never see missing/mis-shaped fields.
 */
import axios from 'axios';
import {
  Conversation,
  Contact,
  IntegrationChannel,
  Message,
  Platform,
  CustomerNote,
  DeliveryStatus,
} from '../types/messaging';

export const API_BASE = '/api'; // relative path (Vite proxies /api -> PHP backend)

// Attach the shared API secret to every request when configured. When
// VITE_MESSAGEHUB_API_SECRET is empty (dev mode) the backend accepts requests
// without auth, so this is a no-op.
if (import.meta.env.VITE_MESSAGEHUB_API_SECRET) {
  axios.interceptors.request.use((config) => {
    config.headers['X-MessageHub-Secret'] = import.meta.env.VITE_MESSAGEHUB_API_SECRET;
    return config;
  });
}

/* ----------------------------- raw row types ----------------------------- */

export interface ConversationRow {
  id: string;
  contact_id?: string;
  customer_name?: string;
  customer_avatar?: string;
  customer_phone?: string;
  customer_email?: string;
  platform?: string;
  channel_name?: string;
  last_message?: string;
  last_message_timestamp?: string;
  unread_count?: number | string;
  status?: string;
  tags?: string | string[] | null;
  is_pinned?: number | boolish;
  is_online?: number | boolish;
}

export interface ContactRow {
  id: string;
  name?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  location?: string;
  platform?: string;
  channel_name?: string;
  tags?: string | string[] | null;
  notes?: string | Array<Record<string, unknown>> | null;
  created_at?: string;
  updated_at?: string;
}

export interface IntegrationRow {
  id?: string;
  platform?: string;
  account_name?: string;
  identifier?: string;
  is_connected?: number | boolish;
  webhook_status?: string;
  messages_today?: number | string;
  last_sync?: string;
}

export interface MessageRow {
  id: string;
  conversation_id?: string;
  sender?: string;
  sender_name?: string;
  text?: string;
  timestamp?: string;
  status?: string;
  attachment_type?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_size?: string;
}

type boolish = boolean | 0 | 1;

/* ------------------------------- utilities ------------------------------- */

const toPlatform = (p?: string): Platform => (p === 'whatsapp' ? 'whatsapp' : 'facebook');

const toBool = (v?: number | boolean | string | null): boolean =>
  v === true || v === 1 || v === '1' || v === 'true';

const toNumber = (v?: number | string | null): number => {
  if (typeof v === 'number') return v;
  const n = parseInt(String(v ?? '0'), 10);
  return Number.isFinite(n) ? n : 0;
};

const parseJson = (v?: string | string[] | Array<Record<string, unknown>> | null): any[] => {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  try {
    const parsed = JSON.parse(v as string);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const mapStatus = (s?: string): DeliveryStatus => {
  switch (s) {
    case 'sending':
    case 'sent':
    case 'delivered':
    case 'read':
      return s;
    default:
      return 'delivered';
  }
};

const toConversationStatus = (s?: string): Conversation['status'] => {
  if (s === 'archived' || s === 'pending' || s === 'active') return s;
  return 'active';
};

const toContactStatus = (s?: string): Contact['status'] => {
  if (s === 'VIP' || s === 'Lead' || s === 'Inactive') return s;
  return 'Active';
};

/* ------------------------------- normalizers ----------------------------- */

export function normalizeConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    contactId: row.contact_id || row.id,
    customerName: row.customer_name || 'Unknown Customer',
    customerAvatar: row.customer_avatar || '',
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    platform: toPlatform(row.platform),
    channelName: row.channel_name || (row.platform === 'whatsapp' ? 'WhatsApp Business' : 'Messenger'),
    lastMessage: row.last_message || '',
    lastMessageTimestamp: row.last_message_timestamp || 'Just now',
    lastMessageTimeAgo: row.last_message_timestamp || 'Just now',
    unreadCount: toNumber(row.unread_count),
    status: toConversationStatus(row.status),
    tags: parseJson(row.tags).map((t) => String(t)),
    isPinned: toBool(row.is_pinned),
    isOnline: toBool(row.is_online),
  };
}

export function normalizeContact(row: ContactRow): Contact {
  const notes: CustomerNote[] = parseJson(row.notes).map((n, i) => ({
    id: String(n?.id ?? `note_${i}`),
    text: String(n?.text ?? ''),
    createdAt: String(n?.createdAt ?? row.created_at ?? ''),
    author: String(n?.author ?? 'Agent'),
  }));

  return {
    id: row.id,
    name: row.name || 'Unknown Customer',
    avatar: row.avatar || '',
    phone: row.phone || '',
    email: row.email || '',
    location: row.location || '',
    platform: toPlatform(row.platform),
    channelName: row.channel_name || (row.platform === 'whatsapp' ? 'WhatsApp Business' : 'Messenger'),
    tags: parseJson(row.tags).map((t) => String(t)),
    notes,
    startedAt: row.created_at || 'Today',
    lastConversationTime: 'Just now',
    lastConversationAgo: 'Just now',
    totalMessages: 0,
    status: toContactStatus(undefined),
    totalOrders: 0,
    lifetimeValue: '৳ 0',
  };
}

export function normalizeIntegration(row: IntegrationRow): IntegrationChannel {
  const platform = toPlatform(row.platform);
  return {
    id: row.id || `int_${platform}_${Date.now()}`,
    platform,
    name: platform === 'facebook' ? 'Facebook Messenger' : 'WhatsApp Business',
    accountName: row.account_name || `—`,
    identifier: row.identifier || '',
    isConnected: toBool(row.is_connected),
    lastSync: row.last_sync || 'Never',
    messagesToday: toNumber(row.messages_today),
    webhookStatus: row.webhook_status === 'operational' || row.webhook_status === 'degraded'
      ? row.webhook_status
      : 'offline',
  };
}

export function normalizeMessage(row: MessageRow): Message {
  const message: Message = {
    id: row.id,
    conversationId: row.conversation_id || '',
    sender: row.sender === 'agent' ? 'agent' : 'customer',
    senderName: row.sender_name || (row.sender === 'agent' ? 'Agent' : 'Customer'),
    text: row.text || '',
    timestamp: row.timestamp || '',
    status: mapStatus(row.status),
  };

  if (row.attachment_type && row.attachment_url) {
    message.attachment = {
      type: row.attachment_type === 'image' ? 'image' : 'file',
      url: row.attachment_url,
      name: row.attachment_name,
      size: row.attachment_size,
    };
  }

  return message;
}

/* -------------------------------- fetchers ------------------------------- */

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  error?: string;
}

async function getList<T>(endpoint: string, normalize: (row: any) => T): Promise<T[]> {
  try {
    const res = await axios.get<ApiEnvelope<any[]>>(`${API_BASE}/${endpoint}`);
    const payload = res.data;
    if (payload?.status === 'success' && Array.isArray(payload.data)) {
      return payload.data.map(normalize);
    }
    return [];
  } catch (err) {
    console.error(`[api] GET ${endpoint} failed:`, err);
    throw err;
  }
}

export const fetchConversations = () => getList('conversations.php', normalizeConversation);
export const fetchIntegrations = () => getList('integrations.php', normalizeIntegration);
export const fetchContacts = () => getList('contacts.php', normalizeContact);

export interface SendMessagePayload {
  id: string;
  text: string;
  timestamp: string;
}

export async function postMessage(
  conversationId: string,
  text: string
): Promise<SendMessagePayload> {
  const res = await axios.post<ApiEnvelope<SendMessagePayload>>(`${API_BASE}/messages.php`, {
    conversation_id: conversationId,
    text,
  });
  return res.data?.data ?? { id: '', text, timestamp: '' };
}

export async function postIntegration(payload: {
  platform: string;
  identifier: string;
  account_name?: string;
  access_token?: string | null;
}): Promise<void> {
  await axios.post(`${API_BASE}/integrations.php`, payload);
}