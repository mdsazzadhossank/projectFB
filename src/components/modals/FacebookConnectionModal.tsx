import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const FacebookConnectionModal: React.FC = () => {
  const {
    isFacebookModalOpen,
    setIsFacebookModalOpen,
    integrations,
    updateIntegration,
    showToast,
  } = useMessaging();

  const fbIntegration = integrations.find((i) => i.platform === 'facebook');

  const [pageName, setPageName] = useState(fbIntegration?.accountName || 'Social Ads Expert');
  const [pageId, setPageId] = useState(fbIntegration?.identifier || '104829104857');
  const [copiedToken, setCopiedToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const webhookUrl = 'https://api.messagehub.io/v1/webhooks/facebook';
  const verifyToken = 'msg_meta_verify_token_984728';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (fbIntegration) {
        updateIntegration(fbIntegration.id, {
          accountName: pageName,
          identifier: pageId,
          status: 'connected',
          lastSync: 'Just now',
        });
      }
      setIsSaving(false);
      setIsFacebookModalOpen(false);
      showToast('Facebook Page settings verified & saved successfully', 'success');
    }, 800);
  };

  return (
    <Modal
      isOpen={isFacebookModalOpen}
      onClose={() => setIsFacebookModalOpen(false)}
      title="Facebook Messenger Integration"
      subtitle="Configure Meta Graph API credentials and Webhook callbacks"
    >
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Meta verification banner */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-blue-900 dark:text-blue-200">
              Meta Graph API v20.0
            </p>
            <p className="text-blue-700 dark:text-blue-300 text-[11px] leading-relaxed">
              Ensure your Meta App has approved permissions for <code className="font-mono font-bold bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">pages_messaging</code> and <code className="font-mono font-bold bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">pages_manage_metadata</code>.
            </p>
          </div>
        </div>

        {/* Facebook Page Details */}
        <div>
          <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Facebook Page Name
          </label>
          <input
            type="text"
            required
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Facebook Page ID
          </label>
          <input
            type="text"
            required
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            className="w-full px-3 py-2 font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Webhook Configuration Section */}
        <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Webhook Callback URL & Token
          </span>

          <div>
            <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Callback URL (Paste into Meta App Dashboard)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="flex-1 px-3 py-2 font-mono text-[11px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-600 dark:text-neutral-400 select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(webhookUrl)}
                className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-xl"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Verify Token
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={verifyToken}
                className="flex-1 px-3 py-2 font-mono text-[11px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-600 dark:text-neutral-400 select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(verifyToken)}
                className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-xl"
                title="Copy Token"
              >
                {copiedToken ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Connection Active
          </span>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFacebookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              Verify & Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
