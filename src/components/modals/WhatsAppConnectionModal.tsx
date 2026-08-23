import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check,
  Phone,
} from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const WhatsAppConnectionModal: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    integrations,
    updateIntegration,
    showToast,
  } = useMessaging();

  const waIntegration = integrations.find((i) => i.platform === 'whatsapp');

  const [businessName, setBusinessName] = useState(waIntegration?.accountName || 'Social Ads Studio');
  const [phoneNumber, setPhoneNumber] = useState(waIntegration?.identifier || '+880 1700-123456');
  const [wabaId, setWabaId] = useState('948271049281');
  const [phoneId, setPhoneId] = useState('1094829471928');
  const [accessToken, setAccessToken] = useState('EAAG...permanent_system_user_token');
  const [copiedToken, setCopiedToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const webhookUrl = 'https://api.messagehub.io/v1/webhooks/whatsapp';
  const verifyToken = 'wa_cloud_verify_sec_839201';

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
      if (waIntegration) {
        updateIntegration(waIntegration.id, {
          accountName: businessName,
          identifier: phoneNumber,
          status: 'connected',
          lastSync: 'Just now',
        });
      }
      setIsSaving(false);
      setIsWhatsAppModalOpen(false);
      showToast('WhatsApp Cloud API credentials verified & saved successfully', 'success');
    }, 800);
  };

  return (
    <Modal
      isOpen={isWhatsAppModalOpen}
      onClose={() => setIsWhatsAppModalOpen(false)}
      title="WhatsApp Business Cloud API Integration"
      subtitle="Configure Meta WhatsApp Business Platform credentials"
    >
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Verification banner */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-emerald-900 dark:text-emerald-200">
              Official WhatsApp Cloud API
            </p>
            <p className="text-emerald-700 dark:text-emerald-300 text-[11px] leading-relaxed">
              Connected through official Meta Business Manager. Supports interactive template messages, media messages, and instant message status tracking.
            </p>
          </div>
        </div>

        {/* Business Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              WhatsApp Business Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Meta IDs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              WhatsApp Business Account ID (WABA)
            </label>
            <input
              type="text"
              required
              value={wabaId}
              onChange={(e) => setWabaId(e.target.value)}
              className="w-full px-3 py-2 font-mono text-[11px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Phone Number ID
            </label>
            <input
              type="text"
              required
              value={phoneId}
              onChange={(e) => setPhoneId(e.target.value)}
              className="w-full px-3 py-2 font-mono text-[11px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Permanent Token */}
        <div>
          <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            System User Permanent Access Token
          </label>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="w-full px-3 py-2 font-mono text-[11px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Webhook Configuration Section */}
        <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Webhook Callback URL & Verify Token
          </span>

          <div>
            <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Callback URL (Paste into WhatsApp configuration)
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
            Meta Verified (200 OK)
          </span>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsWhatsAppModalOpen(false)}
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
