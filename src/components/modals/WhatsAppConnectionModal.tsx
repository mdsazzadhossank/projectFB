import React, { useState, useEffect } from 'react';
import {
  Phone,
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { postIntegration } from '../../lib/api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

// Set VITE_FACEBOOK_APP_ID in .env with your real Meta app id.
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';

export const WhatsAppConnectionModal: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    integrations,
    updateIntegration,
    showToast,
  } = useMessaging();

  const waIntegration = integrations.find((i) => i.platform === 'whatsapp');
  const isAlreadyConnected = waIntegration?.isConnected === true;

  const [isLoading, setIsLoading] = useState(false);
  const [wabaAccounts, setWabaAccounts] = useState<any[]>([]);
  const [step, setStep] = useState<'login' | 'select_account'>('login');

  useEffect(() => {
    // Initialize FB SDK if not already initialized
    if (window.FB && !window.fbAsyncInit) return; // already initialized

    if (!window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v20.0'
        });
      };
    }
  }, []);

  const handleWhatsAppLogin = () => {
    setIsLoading(true);

    if (!FACEBOOK_APP_ID) {
      setIsLoading(false);
      showToast('Facebook App ID is not configured. Set VITE_FACEBOOK_APP_ID in .env', 'error');
      return;
    }

    if (!window.FB) {
      showToast('Facebook SDK is still loading. Please try again in a moment.', 'error');
      setIsLoading(false);
      return;
    }

    // Login requesting WhatsApp Business Management permissions
    window.FB.login((response: any) => {
      if (response.authResponse) {
        fetchWabaAccounts(response.authResponse.accessToken);
      } else {
        setIsLoading(false);
        showToast('Facebook login was cancelled or failed.', 'error');
      }
    }, { scope: 'whatsapp_business_management,whatsapp_business_messaging' });
  };

  const fetchWabaAccounts = (_accessToken: string) => {
    // Note: In a real implementation, you would query /me/businesses and then
    // the waba accounts via the Meta Graph API. This demo simulates the list.
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setWabaAccounts([
        { id: '948271049281', name: 'Social Ads Studio WABA', phone: '+880 1700-123456' },
        { id: '182739182371', name: 'Support Line', phone: '+880 1800-654321' }
      ]);
      setStep('select_account');
    }, 1000);
  };

  const handleConnectAccount = (account: any) => {
    setIsLoading(true);

    setTimeout(() => {
      if (waIntegration) {
        updateIntegration(waIntegration.id, {
          accountName: account.name,
          identifier: account.phone,
          isConnected: true,
          webhookStatus: 'operational',
          lastSync: 'Just now',
        });
      }

      // Persist the connection to the backend (best-effort)
      postIntegration({
        platform: 'whatsapp',
        identifier: account.phone,
        account_name: account.name,
      }).catch((err) => {
        console.error('Failed to save integration to backend', err);
      });

      setIsLoading(false);
      setIsWhatsAppModalOpen(false);
      showToast(`Successfully connected WhatsApp Business: ${account.name}`, 'success');
    }, 800);
  };

  return (
    <Modal
      isOpen={isWhatsAppModalOpen}
      onClose={() => setIsWhatsAppModalOpen(false)}
      title="Connect WhatsApp Business"
      subtitle="Connect directly with Meta to manage your WhatsApp Business API"
    >
      <div className="space-y-5 text-sm">

        {/* Step 1: Login */}
        {step === 'login' && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 rounded-full flex items-center justify-center mb-2">
              <Phone className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                Link your WhatsApp Business
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto text-xs leading-relaxed">
                Connect via Meta Embedded Signup to manage your WhatsApp conversations seamlessly.
              </p>
            </div>

            <Button
              onClick={handleWhatsAppLogin}
              isLoading={isLoading}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center gap-2 py-2.5 mt-2 shadow-sm shadow-blue-500/20 transition-all"
            >
              Continue with Facebook
            </Button>

            {isAlreadyConnected && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Currently connected to {waIntegration?.accountName}
              </p>
            )}

            <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-4 justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure connection via Official WhatsApp Cloud API
            </div>
          </div>
        )}

        {/* Step 2: Select Account */}
        {step === 'select_account' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Select a WhatsApp Business Account
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {wabaAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 font-bold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white text-sm">{account.name}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">WABA ID: {account.id}</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{account.phone}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConnectAccount(account)}
                    disabled={isLoading}
                    className="gap-1"
                  >
                    Connect <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep('login')}
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};