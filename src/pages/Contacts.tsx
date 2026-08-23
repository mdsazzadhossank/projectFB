import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Users,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Tag,
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
  Edit2,
  Trash2,
  Download,
  Filter,
} from 'lucide-react';
import { useMessaging } from '../context/MessagingContext';
import { Contact, Platform } from '../types/messaging';
import { Avatar } from '../components/ui/Avatar';
import { PlatformBadge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';

export const ContactsPage: React.FC = () => {
  const {
    contacts,
    addNewContact,
    updateContact,
    setActivePage,
    setActiveConversation,
    conversations,
    showToast,
    isNewContactModalOpen,
    setIsNewContactModalOpen,
  } = useMessaging();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'facebook' | 'whatsapp' | 'vip' | 'lead'>('all');
  const [selectedContactForView, setSelectedContactForView] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form states for Add Contact
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+880 1');
  const [newEmail, setNewEmail] = useState('');
  const [newLocation, setNewLocation] = useState('Dhaka, Bangladesh');
  const [newPlatform, setNewPlatform] = useState<Platform>('facebook');
  const [newTag, setNewTag] = useState('Lead');

  const filteredContacts = useMemo(() => {
    return contacts.filter((cnt) => {
      if (filterTab === 'facebook' && cnt.platform !== 'facebook') return false;
      if (filterTab === 'whatsapp' && cnt.platform !== 'whatsapp') return false;
      if (filterTab === 'vip' && !cnt.tags.includes('VIP')) return false;
      if (filterTab === 'lead' && cnt.status !== 'Lead') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          cnt.name.toLowerCase().includes(q) ||
          cnt.phone.toLowerCase().includes(q) ||
          cnt.email.toLowerCase().includes(q) ||
          cnt.location.toLowerCase().includes(q) ||
          cnt.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [contacts, filterTab, searchQuery]);

  const handleOpenConversation = (contact: Contact) => {
    const existingConv = conversations.find((c) => c.contactId === contact.id);
    if (existingConv) {
      setActiveConversation(existingConv.id);
    }
    setActivePage('inbox');
  };

  const handleCreateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addNewContact({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      location: newLocation.trim(),
      platform: newPlatform,
      tags: [newTag],
    });

    setNewName('');
    setNewPhone('+880 1');
    setNewEmail('');
    setIsNewContactModalOpen(false);
  };

  const handleExportCSV = () => {
    showToast('Exported 20 contacts to CSV format', 'success');
  };

  return (
    <div id="contacts-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Contacts CRM
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your multichannel customer relationships, order history & notes
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewContactModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email, location or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All', count: contacts.length },
            { id: 'facebook', label: 'Facebook', count: contacts.filter((c) => c.platform === 'facebook').length },
            { id: 'whatsapp', label: 'WhatsApp', count: contacts.filter((c) => c.platform === 'whatsapp').length },
            { id: 'vip', label: 'VIP', count: contacts.filter((c) => c.tags.includes('VIP')).length },
            { id: 'lead', label: 'Leads', count: contacts.filter((c) => c.status === 'Lead').length },
          ].map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-900'
                      : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4 hidden md:table-cell">Last Active</th>
                <th className="py-3 px-4 hidden lg:table-cell">Messages</th>
                <th className="py-3 px-4 hidden xl:table-cell">LTV</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((cnt) => (
                  <tr
                    key={cnt.id}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedContactForView(cnt)}
                  >
                    {/* Contact Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={cnt.avatar}
                          name={cnt.name}
                          size="md"
                          platform={cnt.platform}
                        />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {cnt.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate max-w-[150px]">
                            {cnt.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="py-3.5 px-4">
                      <PlatformBadge platform={cnt.platform} size="sm" />
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono font-medium text-neutral-700 dark:text-neutral-300">
                      {cnt.phone}
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-neutral-500 dark:text-neutral-400">
                      <span className="font-mono">{cnt.lastConversationTime}</span>
                      <span className="text-[10px] text-neutral-400 block">
                        ({cnt.lastConversationAgo} ago)
                      </span>
                    </td>

                    {/* Messages */}
                    <td className="py-3.5 px-4 hidden lg:table-cell font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                      {cnt.totalMessages} msgs
                    </td>

                    {/* LTV */}
                    <td className="py-3.5 px-4 hidden xl:table-cell font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {cnt.lifetimeValue || '৳ 0'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge
                        status={cnt.status}
                        variant={
                          cnt.status === 'VIP'
                            ? 'purple'
                            : cnt.status === 'Active'
                            ? 'success'
                            : 'neutral'
                        }
                      />
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenConversation(cnt)}
                          title="Open in Inbox"
                          className="text-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12">
                    <EmptyState
                      icon={Users}
                      title="No contacts found"
                      description="No contacts matched your search query or selected filter."
                      actionLabel={searchQuery ? 'Clear Search' : undefined}
                      onAction={searchQuery ? () => setSearchQuery('') : undefined}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Contact Modal */}
      <Modal
        isOpen={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        title="Add New Customer Contact"
        subtitle="Create a new profile across Facebook Messenger or WhatsApp Business"
      >
        <form onSubmit={handleCreateContactSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tanvir Hasan"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Channel
              </label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="facebook">Facebook Messenger</option>
                <option value="whatsapp">WhatsApp Business</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Initial Tag
              </label>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Lead">Lead</option>
                <option value="VIP">VIP</option>
                <option value="Returning Customer">Returning Customer</option>
                <option value="Wholesale">Wholesale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Phone Number (Bangladesh Format)
            </label>
            <input
              type="text"
              placeholder="+880 1712-345678"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full px-3 py-2 font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="customer@company.bd"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              City / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Gulshan-2, Dhaka"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewContactModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Contact Detail Modal */}
      {selectedContactForView && (
        <Modal
          isOpen={!!selectedContactForView}
          onClose={() => setSelectedContactForView(null)}
          title="Customer Profile Details"
          subtitle={`CRM Record #${selectedContactForView.id}`}
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
              <Avatar
                src={selectedContactForView.avatar}
                name={selectedContactForView.name}
                size="xl"
                platform={selectedContactForView.platform}
              />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  {selectedContactForView.name}
                </h4>
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={selectedContactForView.platform} size="sm" />
                  <StatusBadge
                    status={selectedContactForView.status}
                    variant={selectedContactForView.status === 'VIP' ? 'purple' : 'success'}
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  {selectedContactForView.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
                <span className="text-[10px] text-neutral-400 block font-medium">Lifetime Value</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedContactForView.lifetimeValue || '৳ 0'}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
                <span className="text-[10px] text-neutral-400 block font-medium">Completed Orders</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
                  {selectedContactForView.totalOrders || 0} Orders
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                Contact Information
              </span>
              <div className="space-y-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Phone:</span>
                  <span className="font-mono font-semibold">{selectedContactForView.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Email:</span>
                  <span className="font-medium">{selectedContactForView.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Location:</span>
                  <span className="font-medium">{selectedContactForView.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Connected Channel:</span>
                  <span className="font-medium">{selectedContactForView.channelName}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedContactForView(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleOpenConversation(selectedContactForView);
                  setSelectedContactForView(null);
                }}
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              >
                Open in Inbox
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
