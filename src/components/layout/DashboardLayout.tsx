import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex transition-colors duration-150">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px] min-h-screen">
        {/* Sticky Header */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 flex flex-col min-h-0 relative overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
};
