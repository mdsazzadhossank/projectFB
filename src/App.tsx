import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { MessagingProvider, useMessaging } from './context/MessagingContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/Dashboard';
import { InboxPage } from './pages/Inbox';
import { ContactsPage } from './pages/Contacts';
import { AnalyticsPage } from './pages/Analytics';
import { IntegrationsPage } from './pages/Integrations';
import { SettingsPage } from './pages/Settings';
import { FacebookConnectionModal } from './components/modals/FacebookConnectionModal';
import { WhatsAppConnectionModal } from './components/modals/WhatsAppConnectionModal';

const AppContent: React.FC = () => {
  const { activePage } = useMessaging();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'inbox':
        return <InboxPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <DashboardLayout>
      {renderActivePage()}
      <FacebookConnectionModal />
      <WhatsAppConnectionModal />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MessagingProvider>
        <AppContent />
      </MessagingProvider>
    </ThemeProvider>
  );
}
