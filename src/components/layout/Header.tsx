import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  HelpCircle,
  Sun,
  Moon,
  CheckCircle2,
  X,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { useTheme } from '../../context/ThemeContext';
import { CURRENT_USER } from '../../data/mockData';

export const Header: React.FC = () => {
  const {
    activePage,
    setIsMobileSidebarOpen,
    counts,
    setActivePage,
    setActiveConversation,
  } = useMessaging();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const getPageInfo = () => {
    switch (activePage) {
      case 'dashboard':
        return {
          title: 'Good evening, Rony',
          subtitle: "Here's what's happening across your messaging channels today.",
        };
      case 'inbox':
        return {
          title: 'Unified Inbox',
          subtitle: 'Manage all customer conversations from one place',
        };
      case 'contacts':
        return {
          title: 'Contacts CRM',
          subtitle: 'Search, filter and organize customer relationships across channels',
        };
      case 'analytics':
        return {
          title: 'Messaging Analytics',
          subtitle: 'Real-time performance metrics and cross-platform message volume',
        };
      case 'integrations':
        return {
          title: 'Integrations',
          subtitle: 'Connect your messaging channels to manage conversations from one inbox.',
        };
      case 'settings':
        return {
          title: 'Workspace Settings',
          subtitle: 'Configure channel webhooks, automated responses, and team permissions',
        };
      default:
        return {
          title: 'MessageHub',
          subtitle: 'Unified Messaging Dashboard',
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-7 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors"
    >
      {/* Left side: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          id="header-sidebar-toggle"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 -ml-1 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-tight tracking-tight">
            {pageInfo.title}
          </h2>
          <p className="hidden sm:block text-xs text-neutral-500 dark:text-neutral-400">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: System status, Actions & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System status pill */}
        <div
          id="system-status-indicator"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-full text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>All systems operational</span>
        </div>

        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </button>

        {/* Help button */}
        <button
          id="header-help-btn"
          onClick={() => setShowHelpModal(true)}
          className="hidden sm:flex p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title="Quick Help & Architecture"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {counts.unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-neutral-900" />
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-dropdown-menu"
              className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Live Alerts
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold rounded-full">
                    {counts.unread} unread
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-64 overflow-y-auto">
                <div
                  className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setActivePage('inbox');
                    setActiveConversation('conv_01');
                    setShowNotifications(false);
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Rafi Ahmed (Messenger)
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        "Is this premium marketing package still available?"
                      </p>
                      <span className="text-[10px] text-neutral-400 mt-1 inline-block">
                        2 mins ago
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setActivePage('inbox');
                    setActiveConversation('conv_02');
                    setShowNotifications(false);
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Rahim Ahmed (WhatsApp)
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        "I want to place an order for the 30-day campaign..."
                      </p>
                      <span className="text-[10px] text-neutral-400 mt-1 inline-block">
                        5 mins ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50/50 dark:bg-neutral-800/20">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Meta Webhook Sync Successful
                      </p>
                      <span className="text-[10px] text-neutral-400">
                        All channels reporting 0 dropped events
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 px-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => {
                    setActivePage('inbox');
                    setShowNotifications(false);
                  }}
                  className="w-full text-center py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all in Unified Inbox
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar chip */}
        <div
          onClick={() => setActivePage('settings')}
          className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800 cursor-pointer"
        >
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-black/5"
          />
          <span className="hidden xl:block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            {CURRENT_USER.name}
          </span>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  MessageHub Architecture & Overview
                </h3>
                <p className="text-xs text-neutral-500">
                  Commercial-grade Unified Messaging Frontend
                </p>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>
                This frontend is architected as a modular Single-Page Application (SPA) designed to interface with Facebook Messenger and WhatsApp Business Cloud APIs or a custom PHP/Node.js backend.
              </p>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-1.5 border border-neutral-200/60 dark:border-neutral-700/60">
                <p className="font-semibold text-neutral-900 dark:text-white">
                  Key Capabilities Built:
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-300">
                  <li>3-Column Unified Inbox with dynamic channel filters</li>
                  <li>Live mock message delivery with instant customer reply simulation</li>
                  <li>Customer CRM drawer with notes, tags, order history & location</li>
                  <li>Analytics with Recharts line/bar distributions</li>
                  <li>Full dark/light theme support & mobile responsive drawers</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
