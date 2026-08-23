export type Platform = 'facebook' | 'whatsapp';

export type DeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Attachment {
  type: 'image' | 'file' | 'audio' | 'document';
  url: string;
  name?: string;
  size?: string;
  duration?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'agent' | 'customer';
  senderName?: string;
  text: string;
  timestamp: string; // ISO or formatted display time e.g. "10:24 PM"
  rawTimestamp?: string;
  status: DeliveryStatus;
  attachment?: Attachment;
  replyToId?: string;
}

export interface AssignedAgent {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface CustomerNote {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  customerName: string;
  customerAvatar: string;
  customerPhone?: string;
  customerEmail?: string;
  platform: Platform;
  channelName: string; // e.g. "Social Ads Expert" or "Social Ads Studio"
  lastMessage: string;
  lastMessageTimestamp: string;
  lastMessageTimeAgo: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'pending';
  assignedTo?: AssignedAgent;
  tags: string[];
  isOnline: boolean;
  lastSeen?: string;
  isPinned?: boolean;
  notes?: CustomerNote[];
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  location: string;
  platform: Platform;
  channelName: string;
  tags: string[];
  notes: CustomerNote[];
  startedAt: string;
  lastConversationTime: string;
  lastConversationAgo: string;
  totalMessages: number;
  status: 'Active' | 'Inactive' | 'VIP' | 'Lead';
  totalOrders?: number;
  lifetimeValue?: string;
}

export interface IntegrationChannel {
  id: string;
  platform: Platform;
  name: string;
  accountName: string;
  identifier: string; // Phone number or Page ID
  isConnected: boolean;
  lastSync: string;
  messagesToday: number;
  webhookStatus: 'operational' | 'degraded' | 'offline';
  connectedSince?: string;
  permissions?: string[];
}

export interface KPIStats {
  totalConversations: number;
  totalConversationsGrowth: number;
  unreadMessages: number;
  unreadMessagesGrowth: number;
  facebookMessages: number;
  facebookMessagesGrowth: number;
  whatsAppMessages: number;
  whatsAppMessagesGrowth: number;
  responseRate: number;
  avgResponseTime: string; // e.g. "1.8 min"
  incomingToday: number;
  outgoingToday: number;
}

export interface AnalyticsDataPoint {
  date: string;
  facebook: number;
  whatsapp: number;
  total: number;
}

export interface HourlyTraffic {
  hour: string;
  messages: number;
}

export interface QuickReplyTemplate {
  id: string;
  title: string;
  shortcut: string;
  text: string;
  category: 'Greetings' | 'Pricing' | 'Support' | 'Closing';
}

export type NavigationPage = 
  | 'dashboard'
  | 'inbox'
  | 'contacts'
  | 'analytics'
  | 'integrations'
  | 'settings';

export type InboxFilter = 'all' | 'facebook' | 'whatsapp' | 'unread' | 'vip' | 'assigned_me';
