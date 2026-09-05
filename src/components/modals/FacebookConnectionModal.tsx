import React, { useState, useEffect } from 'react';
import {
  Facebook,
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

// Declare FB globally for TypeScript
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}

// Track SDK init explicitly. window.FB being defined does NOT mean FB.init ran —
// the SDK can be loaded but uninitialized, in which case FB.login() throws and
// leaves a spinner running forever.
let fbSdkInitialized = false;

/**
 * Idempotent SDK init. Safe to call on every login attempt.
 * Returns false when the script hasn't finished loading yet.
 */
function initFacebookSDK(): boolean {
  if (fbSdkInitialized) return true;
  if (!window.FB) return false;
  try {
    window.FB.init({
      appId: FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v20.0',
    });
    fbSdkInitialized = true;
    return true;
  } catch (e) {
    console.error('[facebook] FB.init failed:', e);
    return false;
  }
}

export const FacebookConnectionModal: React.FC = () => {
  const {
    isFacebookModalOpen,
    setIsFacebookModalOpen,
    integrations,
    updateIntegration,
    showToast,
  } = useMessaging();

  const fbIntegration = integrations.find((i) => i.platform === 'facebook');
  const isAlreadyConnected = fbIntegration?.isConnected === true;

  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [step, setStep] = useState<'login' | 'select_page'>('login');

  useEffect(() => {
    // The FB SDK auto-loader calls fbAsyncInit when ready. Register it as early
    // as possible; if the SDK already finished loading, initialize immediately.
    window.fbAsyncInit = function () {
      try {
        window.FB.init({
          appId: FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v20.0',
        });
        fbSdkInitialized = true;
      } catch (e) {
        console.error('[facebook] FB.init failed:', e);
      }
    };

    if (window.FB) {
      window.fbAsyncInit();
    }
  }, []);

  const handleFacebookLogin = () => {
    setIsLoading(true);

    if (!FACEBOOK_APP_ID) {
      setIsLoading(false);
      showToast('Facebook App ID is not configured. Set VITE_FACEBOOK_APP_ID in .env', 'error');
      return;
    }

    if (!initFacebookSDK()) {
      setIsLoading(false);
      showToast('Facebook SDK is still loading. Please try again in a moment.', 'error');
      return;
    }

    try {
      // NOTE: Request only pages_show_list at login. Page permissions like
      // pages_messaging are granted per-PAGE via the page token (from
      // /me/accounts), not via the user login dialog — passing them here
      // triggers "Invalid Scopes" unless the app has advanced access.
      window.FB.login((response: any) => {
        setIsLoading(false);

        if (response?.authResponse) {
          fetchUserPages(response.authResponse.accessToken);
        } else {
          const status = response?.status;
          showToast(
            status && status !== 'unknown' && status !== 'not_authorized'
              ? 'Facebook login failed. Check app is in Live mode and the domain is allowed.'
              : 'Facebook login was cancelled or failed.',
            'error'
          );
        }
      }, { scope: 'pages_show_list' });
    } catch (e) {
      console.error('[facebook] FB.login threw:', e);
      setIsLoading(false);
      showToast('Facebook SDK is not ready. Reload the page and try again.', 'error');
    }
  };

  const fetchUserPages = (accessToken: string) => {
    window.FB.api('/me/accounts', { access_token: accessToken }, (response: any) => {
      if (response && !response.error) {
        if (response.data.length === 0) {
          showToast('No Facebook Pages found for this account.', 'error');
        } else {
          setPages(response.data);
          setStep('select_page');
        }
      } else {
        const err = response?.error?.message || 'Unknown error';
        showToast(`Failed to fetch Facebook Pages: ${err}`, 'error');
      }
    });
  };

  const handleConnectPage = async (page: any) => {
    setIsLoading(true);

    try {
      // Persist to backend (best-effort — backend may be offline).
      await postIntegration({
        platform: 'facebook',
        identifier: page.id,
        account_name: page.name,
      });
    } catch (err) {
      console.error('Failed to save integration to backend', err);
    }

    if (fbIntegration) {
      updateIntegration(fbIntegration.id, {
        accountName: page.name,
        identifier: page.id,
        isConnected: true,
        webhookStatus: 'operational',
        lastSync: 'Just now',
      });
    }

    setIsLoading(false);
    setIsFacebookModalOpen(false);
    showToast(`Successfully connected to ${page.name}`, 'success');
  };

  return (
    <Modal
      isOpen={isFacebookModalOpen}
      onClose={() => setIsFacebookModalOpen(false)}
      title="Connect Facebook Page"
      subtitle="Connect directly with Facebook to manage your page messages"
    >
      <div className="space-y-5 text-sm">

        {/* Step 1: Login */}
        {step === 'login' && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mb-2">
              <Facebook className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                Link your Facebook Page
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto text-xs leading-relaxed">
                Allow MessageHub to read and reply to messages sent to your Facebook Page directly from this dashboard.
              </p>
            </div>

            <Button
              onClick={handleFacebookLogin}
              isLoading={isLoading}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center gap-2 py-2.5 mt-2 shadow-sm shadow-blue-500/20 transition-all"
            >
              <Facebook className="w-4 h-4" fill="currentColor" strokeWidth={0} />
              Continue with Facebook
            </Button>

            {isAlreadyConnected && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Currently connected to {fbIntegration?.accountName}
              </p>
            )}

            <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-4 justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure connection via Meta Graph API
            </div>
          </div>
        )}

        {/* Step 2: Select Page */}
        {step === 'select_page' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Select a Page to connect
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold">
                      {page.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white text-sm">{page.name}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">ID: {page.id}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConnectPage(page)}
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