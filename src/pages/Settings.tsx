import React, { useState } from 'react';
import {
  Building2,
  Bell,
  Users,
  Shield,
  Palette,
  Key,
  Clock,
  Check,
  Plus,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Zap,
} from 'lucide-react';
import { useMessaging } from '../context/MessagingContext';
import { useTheme } from '../context/ThemeContext';
import { TEAM_MEMBERS, CURRENT_USER } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';

export const SettingsPage: React.FC = () => {
  const { showToast } = useMessaging();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'team' | 'autoreply' | 'appearance' | 'api'>('general');

  // General state
  const [workspaceName, setWorkspaceName] = useState('Social Ads Studio');
  const [supportEmail, setSupportEmail] = useState('support@socialads.agency');
  const [timezone, setTimezone] = useState('Asia/Dhaka (GMT+6)');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [slaEscalation, setSlaEscalation] = useState(true);

  // Auto-reply state
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [autoReplyText, setAutoReplyText] = useState(
    'Assalamu Alaikum! Thanks for reaching out to Social Ads Studio. An agent will respond to your query within 2 minutes.'
  );

  // Team state
  const [teamList, setTeamList] = useState(TEAM_MEMBERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Agent' | 'Manager'>('Agent');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Workspace settings updated successfully', 'success');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      id: `usr_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
      status: 'active' as const,
    };

    setTeamList((prev) => [...prev, newMember]);
    setInviteEmail('');
    setIsInviteModalOpen(false);
    showToast(`Invitation sent to ${inviteEmail}`, 'success');
  };

  return (
    <div id="settings-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure notifications, team access roles, business hours & automated workflows
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {[
            { id: 'general', label: 'General & Workspace', icon: Building2 },
            { id: 'notifications', label: 'Notifications & SLA', icon: Bell },
            { id: 'autoreply', label: 'Auto-Replies & Hours', icon: Zap },
            { id: 'team', label: 'Team Members & Roles', icon: Users },
            { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
            { id: 'api', label: 'API Keys & Webhooks', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-xs">
          {/* 1. GENERAL TAB */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Workspace Identity
                </h3>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  General organizational settings and default locale for Dhaka timezone
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Primary Business Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Operating Timezone
                  </label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* 2. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Notification Triggers & Alerts
                </h3>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Manage incoming customer query alerts and team SLA warnings
                </p>
              </div>

              <div className="space-y-4 pt-2 divide-y divide-neutral-100 dark:divide-neutral-800">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">
                      Desktop Push Notifications
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      Receive popups when a new customer sends a Facebook or WhatsApp message
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={desktopNotifs}
                    onChange={(e) => setDesktopNotifs(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">
                      Audio Notification Chime
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      Play subtle chime tone on incoming message arrival
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">
                      SLA Escalation Alerts
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      Highlight conversations unanswered for more than 5 minutes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={slaEscalation}
                    onChange={(e) => setSlaEscalation(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => showToast('Notification preferences saved', 'success')}
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* 3. AUTO-REPLIES & HOURS */}
          {activeTab === 'autoreply' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Automated Greetings & Away Messages
                </h3>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Instantly acknowledge customer queries on first incoming message
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">
                      Enable First-Contact Instant Auto-Reply
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      Applies to both Facebook Messenger and WhatsApp Business channels
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReplyEnabled}
                    onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Auto-Reply Message Template
                  </label>
                  <textarea
                    rows={4}
                    value={autoReplyText}
                    onChange={(e) => setAutoReplyText(e.target.value)}
                    className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => showToast('Auto-reply workflows saved successfully', 'success')}
                >
                  Save Automation
                </Button>
              </div>
            </div>
          )}

          {/* 4. TEAM MEMBERS */}
          {activeTab === 'team' && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Team Members & RBAC Roles
                  </h3>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Assign inbox agents, supervisors, and platform administrators
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Invite Member
                </Button>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {teamList.map((member) => (
                  <div
                    key={member.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={member.avatar} name={member.name} size="md" />
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-neutral-400">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold rounded-md text-[11px]">
                        {member.role}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. APPEARANCE & THEME */}
          {activeTab === 'appearance' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Theme & Display Appearance
                </h3>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Customize the interface theme for high-contrast viewing comfort
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'light', label: 'Light Mode', icon: Sun },
                  { id: 'dark', label: 'Dark Mode', icon: Moon },
                  { id: 'system', label: 'System Match', icon: Monitor },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id as any);
                        showToast(`Theme updated to ${t.label}`, 'info');
                      }}
                      className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20'
                          : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. API KEYS & WEBHOOKS */}
          {activeTab === 'api' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  API Keys & Webhook Secret Tokens
                </h3>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Backend API secret endpoints for PHP / Node.js webhook listeners
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    API Master Gateway Secret
                  </label>
                  <input
                    type="password"
                    readOnly
                    value="mh_live_sec_9938104829104810294819"
                    className="w-full px-3 py-2 font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl select-all"
                  />
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-neutral-500 text-[11px] leading-relaxed border border-neutral-200 dark:border-neutral-700">
                  Provide this key in the <code className="font-mono text-neutral-800 dark:text-neutral-200">X-MessageHub-Secret</code> header when dispatching incoming webhooks from your custom PHP or Node.js backend.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        subtitle="Grant team members access to respond in Unified Inbox"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Member Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="colleague@agency.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Role & Permissions
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Agent">Agent (Inbox Reply & Contacts)</option>
              <option value="Manager">Manager (Inbox, Contacts & Analytics)</option>
              <option value="Admin">Admin (Full Access & Integrations)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
