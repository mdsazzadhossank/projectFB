import React from 'react';
import {
  MessageSquare,
  MailCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useMessaging } from '../context/MessagingContext';
import { StatCard } from '../components/dashboard/StatCard';
import { ChannelCard } from '../components/dashboard/ChannelCard';
import { RecentConversations } from '../components/dashboard/RecentConversations';

export const DashboardPage: React.FC = () => {
  const {
    kpis,
    integrations,
    setActivePage,
    setIsFacebookModalOpen,
    setIsWhatsAppModalOpen,
    syncChannel,
  } = useMessaging();

  const fbIntegration = integrations.find((i) => i.platform === 'facebook');
  const waIntegration = integrations.find((i) => i.platform === 'whatsapp');

  return (
    <div id="dashboard-page" className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto w-full">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-900 dark:to-neutral-950 text-white border border-neutral-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[11px] font-semibold rounded-full border border-blue-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Real-time Polling
            </span>
            <span className="text-xs text-neutral-400">Response Rate: {kpis.responseRate}%</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Good evening, Rony
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Here's what's happening across your messaging channels today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-open-inbox-btn"
            onClick={() => setActivePage('inbox')}
            className="px-4 py-2 bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs rounded-xl shadow-xs transition-all duration-150 inline-flex items-center gap-2 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Unified Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Conversations"
            value={kpis.totalConversations}
            growth={kpis.totalConversationsGrowth}
            subtext="vs last month"
            icon={MessageSquare}
          />
          <StatCard
            title="Unread Messages"
            value={kpis.unreadMessages}
            growth={kpis.unreadMessagesGrowth}
            subtext="needs reply"
            icon={MailCheck}
          />
          <StatCard
            title="Facebook Messages"
            value={kpis.facebookMessages}
            growth={kpis.facebookMessagesGrowth}
            subtext="active threads"
            icon={TrendingUp}
            platform="facebook"
          />
          <StatCard
            title="WhatsApp Messages"
            value={kpis.whatsAppMessages}
            growth={kpis.whatsAppMessagesGrowth}
            subtext="business API"
            icon={TrendingUp}
            platform="whatsapp"
          />
        </div>
      </div>

      {/* Connected Channels Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Connected Channels
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Live Meta Graph API connection status and sync status
            </p>
          </div>
          <button
            onClick={() => setActivePage('integrations')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Channel settings &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {fbIntegration && (
            <ChannelCard
              channel={fbIntegration}
              onManage={() => setIsFacebookModalOpen(true)}
              onSync={() => syncChannel(fbIntegration.id)}
            />
          )}
          {waIntegration && (
            <ChannelCard
              channel={waIntegration}
              onManage={() => setIsWhatsAppModalOpen(true)}
              onSync={() => syncChannel(waIntegration.id)}
            />
          )}
        </div>
      </div>

      {/* Recent Conversations */}
      <div>
        <RecentConversations />
      </div>
    </div>
  );
};
