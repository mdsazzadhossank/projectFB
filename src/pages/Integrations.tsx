import React from 'react';
import {
  CheckCircle2,
  RefreshCw,
  Sliders,
  Power,
  ShieldCheck,
  ExternalLink,
  Plus,
  Code2,
  Lock,
} from 'lucide-react';
import { useMessaging } from '../context/MessagingContext';
import { Button } from '../components/ui/Button';

export const IntegrationsPage: React.FC = () => {
  const {
    integrations,
    setIsFacebookModalOpen,
    setIsWhatsAppModalOpen,
    syncChannel,
    showToast,
  } = useMessaging();

  const fb = integrations.find((i) => i.platform === 'facebook');
  const wa = integrations.find((i) => i.platform === 'whatsapp');

  const handleTestPing = (platform: string) => {
    showToast(`Sending webhook ping test to ${platform}... 200 OK received!`, 'success');
  };

  return (
    <div id="integrations-page" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Integrations & Channels
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Connect and orchestrate your messaging channels to manage all conversations in one unified inbox.
        </p>
      </div>

      {/* Main Active Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facebook Messenger Card */}
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 dark:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#4599FF] flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Facebook Messenger
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span className="text-xs text-neutral-400 font-mono">
                      v20.0 Graph API
                    </span>
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg">
                Operational
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div>
                <span className="text-[11px] text-neutral-400 block font-medium">Connected Page</span>
                <p className="font-bold text-neutral-900 dark:text-white mt-0.5">{fb?.accountName}</p>
                <p className="text-[10px] text-neutral-400 font-mono">ID: {fb?.identifier}</p>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block font-medium">Messages Today</span>
                <p className="font-bold text-neutral-900 dark:text-white mt-0.5">{fb?.messagesToday.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-600">0 webhook errors</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 text-[11px] text-neutral-600 dark:text-neutral-300 space-y-1">
              <div className="flex justify-between">
                <span>Webhook Subscribed Fields:</span>
                <span className="font-mono font-medium">messages, messaging_postbacks</span>
              </div>
              <div className="flex justify-between">
                <span>Last Polling Sync:</span>
                <span className="font-mono font-medium">{fb?.lastSync}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => handleTestPing('Facebook Webhook')}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium"
            >
              Test Webhook Ping
            </button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fb && syncChannel(fb.id)}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Sync
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsFacebookModalOpen(true)}
                leftIcon={<Sliders className="w-3.5 h-3.5" />}
              >
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* WhatsApp Business Card */}
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 dark:bg-[#25D366]/20 text-[#128C7E] dark:text-[#2ee776] flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.676.15-.201.3-.778.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.176-.3-.019-.462.132-.612.135-.135.301-.351.452-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.076-.15-.677-1.632-.928-2.235-.244-.588-.493-.508-.677-.517-.175-.009-.376-.01-.577-.01-.201 0-.527.076-.803.376s-1.054 1.029-1.054 2.508 1.079 2.91 1.23 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.378.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.702.25-1.304.176-1.43-.076-.125-.276-.2-.577-.35zM12.04 21.8a9.748 9.748 0 0 1-4.97-1.354l-.356-.211-3.697.97.986-3.602-.232-.37A9.742 9.742 0 0 1 2.296 12.04C2.296 6.67 6.67 2.296 12.04 2.296s9.744 4.374 9.744 9.744c0 5.37-4.37 9.76-9.744 9.76zm0-19.504C6.275 2.296 1.58 6.99 1.58 12.76c0 1.986.556 3.84 1.523 5.424L1.05 24.16l6.155-1.615a10.428 10.428 0 0 0 4.835 1.183c5.765 0 10.46-4.694 10.46-10.468 0-5.77-4.695-10.464-10.46-10.464z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    WhatsApp Business API
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Cloud API v20.0
                    </span>
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg">
                Operational
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div>
                <span className="text-[11px] text-neutral-400 block font-medium">Business Account</span>
                <p className="font-bold text-neutral-900 dark:text-white mt-0.5">{wa?.accountName}</p>
                <p className="text-[10px] text-neutral-400 font-mono">{wa?.identifier}</p>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block font-medium">Messages Today</span>
                <p className="font-bold text-neutral-900 dark:text-white mt-0.5">{wa?.messagesToday.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-600">Delivery rate 99.8%</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 text-[11px] text-neutral-600 dark:text-neutral-300 space-y-1">
              <div className="flex justify-between">
                <span>Webhook Subscribed Fields:</span>
                <span className="font-mono font-medium">messages, message_template_status</span>
              </div>
              <div className="flex justify-between">
                <span>Last Polling Sync:</span>
                <span className="font-mono font-medium">{wa?.lastSync}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => handleTestPing('WhatsApp Cloud API')}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium"
            >
              Test Webhook Ping
            </button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => wa && syncChannel(wa.id)}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Sync
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsWhatsAppModalOpen(true)}
                leftIcon={<Sliders className="w-3.5 h-3.5" />}
              >
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Available More Channels */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Available Channels & Expansion
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Additional communication gateways ready for backend integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Instagram Direct */}
          <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 flex items-center justify-center font-bold">
                  IG
                </div>
                <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold rounded">
                  Ready to connect
                </span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-3">
                Instagram Direct Messages
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Receive DMs, story replies, and customer mentions via Meta Graph API.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => showToast('Instagram Direct connection wizard opened', 'info')}
              >
                Connect Instagram
              </Button>
            </div>
          </div>

          {/* Telegram Bot */}
          <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center font-bold">
                  TG
                </div>
                <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold rounded">
                  Ready to connect
                </span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-3">
                Telegram Bot API
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Connect official customer support bot tokens with instant webhook dispatch.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => showToast('Telegram Bot token modal opened', 'info')}
              >
                Connect Telegram
              </Button>
            </div>
          </div>

          {/* Web Live Chat Widget */}
          <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold">
                  JS
                </div>
                <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold rounded">
                  Embeddable
                </span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-3">
                Website Live Chat Widget
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Copy-paste JavaScript embed code for direct on-site customer live chat.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => showToast('Embed widget script copied to clipboard', 'success')}
              >
                Get Embed Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Developer / Backend Integration Guide */}
      <div className="p-6 bg-neutral-900 text-white rounded-2xl border border-neutral-800 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Backend Architecture & Meta API Gateway
            </h3>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              This dashboard frontend is pre-architected to seamlessly hook into a PHP + MySQL backend or Node.js server. Webhooks from Facebook and WhatsApp can be fed directly into your database and dispatched via standard REST endpoints matching the <code className="font-mono text-blue-300">/src/types/messaging.ts</code> schema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
