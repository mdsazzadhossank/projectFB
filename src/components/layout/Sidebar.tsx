import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BarChart3,
  Plug,
  Settings,
  X,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { CURRENT_USER } from '../../data/mockData';
import { NavigationPage } from '../../types/messaging';

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    integrations,
    counts,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    setInboxFilter,
  } = useMessaging();

  const fbConnected = integrations.find((i) => i.platform === 'facebook')?.isConnected ?? true;
  const waConnected = integrations.find((i) => i.platform === 'whatsapp')?.isConnected ?? true;

  const mainNav = [
    {
      id: 'dashboard' as NavigationPage,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'inbox' as NavigationPage,
      label: 'Unified Inbox',
      icon: MessageSquare,
      badge: counts.unread > 0 ? counts.unread : null,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'contacts' as NavigationPage,
      label: 'Contacts',
      icon: Users,
      badge: null,
    },
    {
      id: 'analytics' as NavigationPage,
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
  ];

  const managementNav = [
    {
      id: 'integrations' as NavigationPage,
      label: 'Integrations',
      icon: Plug,
      badge: null,
    },
    {
      id: 'settings' as NavigationPage,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (page: NavigationPage) => {
    setActivePage(page);
    setIsMobileSidebarOpen(false);
  };

  const handleChannelClick = (channel: 'facebook' | 'whatsapp') => {
    setActivePage('inbox');
    setInboxFilter(channel);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 z-40 bg-neutral-950/60 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-[260px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Area */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm shadow-xs">
                <Zap className="w-4 h-4 fill-current text-blue-400 dark:text-blue-600" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white leading-none">
                  MessageHub
                </h1>
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  Unified Inbox
                </span>
              </div>
            </div>

            <button
              id="sidebar-mobile-close"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* Main Section */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Main
              </div>
              <nav className="space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white shadow-xs font-semibold'
                          : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400 dark:text-neutral-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-blue-500 text-white'
                              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Channels Section */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Channels
              </div>
              <div className="space-y-1">
                {/* Facebook Messenger */}
                <button
                  id="nav-channel-facebook"
                  onClick={() => handleChannelClick('facebook')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 flex items-center justify-center text-[#1877F2]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <span className="group-hover:text-neutral-900 dark:group-hover:text-white">Facebook Messenger</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        fbConnected ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-neutral-300 dark:bg-neutral-600'
                      }`}
                    />
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {counts.facebook}
                    </span>
                  </div>
                </button>

                {/* WhatsApp Business */}
                <button
                  id="nav-channel-whatsapp"
                  onClick={() => handleChannelClick('whatsapp')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 flex items-center justify-center text-[#25D366]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.676.15-.201.3-.778.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.176-.3-.019-.462.132-.612.135-.135.301-.351.452-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.076-.15-.677-1.632-.928-2.235-.244-.588-.493-.508-.677-.517-.175-.009-.376-.01-.577-.01-.201 0-.527.076-.803.376s-1.054 1.029-1.054 2.508 1.079 2.91 1.23 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.378.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.702.25-1.304.176-1.43-.076-.125-.276-.2-.577-.35zM12.04 21.8a9.748 9.748 0 0 1-4.97-1.354l-.356-.211-3.697.97.986-3.602-.232-.37A9.742 9.742 0 0 1 2.296 12.04C2.296 6.67 6.67 2.296 12.04 2.296s9.744 4.374 9.744 9.744c0 5.37-4.37 9.76-9.744 9.76zm0-19.504C6.275 2.296 1.58 6.99 1.58 12.76c0 1.986.556 3.84 1.523 5.424L1.05 24.16l6.155-1.615a10.428 10.428 0 0 0 4.835 1.183c5.765 0 10.46-4.694 10.46-10.468 0-5.77-4.695-10.464-10.46-10.464z" />
                      </svg>
                    </div>
                    <span className="group-hover:text-neutral-900 dark:group-hover:text-white">WhatsApp Business</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        waConnected ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-neutral-300 dark:bg-neutral-600'
                      }`}
                    />
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {counts.whatsapp}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Management Section */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Management
              </div>
              <nav className="space-y-1">
                {managementNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white shadow-xs font-semibold'
                          : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400 dark:text-neutral-400'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Profile Area */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
          <div
            id="sidebar-user-profile"
            className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            onClick={() => handleNavClick('settings')}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-black/5"
              />
              <div className="overflow-hidden text-left">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {CURRENT_USER.name}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {CURRENT_USER.email}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};
