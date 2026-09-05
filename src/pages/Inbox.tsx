import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useMessaging } from '../context/MessagingContext';
import { ConversationList } from '../components/inbox/ConversationList';
import { MessagePanel } from '../components/inbox/MessagePanel';
import { CustomerPanel } from '../components/inbox/CustomerPanel';
import { EmptyState } from '../components/ui/EmptyState';

export const InboxPage: React.FC = () => {
  const {
    activeConversation,
    isCustomerDetailsOpen,
    setIsCustomerDetailsOpen,
    isMobileConversationOpen,
    setIsMobileConversationOpen,
  } = useMessaging();

  const handleMobileBack = () => {
    setIsMobileConversationOpen(false);
  };

  return (
    <div
      id="unified-inbox-page"
      className="flex-1 flex h-[calc(100vh-64px)] overflow-hidden bg-neutral-100 dark:bg-neutral-950 relative"
    >
      {/* Column 1: Conversation List (Left) */}
      <div
        className={`w-full lg:w-[350px] xl:w-[380px] h-full shrink-0 flex flex-col transition-all duration-200 ${
          isMobileConversationOpen ? 'hidden lg:flex' : 'flex'
        }`}
      >
        <ConversationList />
      </div>

      {/* Column 2: Message Conversation Panel (Middle) */}
      <div
        className={`flex-1 flex flex-col h-full min-w-0 transition-all duration-200 ${
          !isMobileConversationOpen ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {activeConversation ? (
          <MessagePanel
            conversation={activeConversation}
            onBackMobile={handleMobileBack}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-900">
            <EmptyState
              icon={MessageSquare}
              title="Select a conversation"
              description="Choose a customer from the left list to view their message history and reply."
            />
          </div>
        )}
      </div>

      {/* Column 3: Customer Details Panel (Right on Desktop, Drawer on Tablet/Mobile) */}
      {activeConversation && isCustomerDetailsOpen && (
        <>
          {/* Tablet & Mobile Slide-over backdrop */}
          <div
            className="fixed inset-0 z-40 bg-neutral-950/50 xl:hidden backdrop-blur-2xs"
            onClick={() => setIsCustomerDetailsOpen(false)}
          />

          {/* Customer Details Container */}
          <div
            className="fixed inset-y-0 right-0 z-50 w-[300px] sm:w-[320px] xl:static xl:z-auto xl:w-[300px] xl:flex h-full shrink-0 transition-transform duration-200 ease-in-out shadow-2xl xl:shadow-none"
          >
            <CustomerPanel
              conversation={activeConversation}
              onCloseMobile={() => setIsCustomerDetailsOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};
