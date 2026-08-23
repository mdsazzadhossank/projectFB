import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Zap,
  Calendar,
} from 'lucide-react';
import { useMessaging } from '../context/MessagingContext';
import { useTheme } from '../context/ThemeContext';
import { ANALYTICS_TREND_DATA, HOURLY_TRAFFIC_DATA } from '../data/mockData';

export const AnalyticsPage: React.FC = () => {
  const { kpis } = useMessaging();
  const { resolvedTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('7d');

  const isDark = resolvedTheme === 'dark';

  const channelDistributionData = [
    { name: 'Facebook Messenger', value: kpis.facebookMessages, color: '#1877F2' },
    { name: 'WhatsApp Business', value: kpis.whatsAppMessages, color: '#25D366' },
  ];

  const responseTimeData = [
    { day: 'Mon', minutes: 2.4, target: 3.0 },
    { day: 'Tue', minutes: 2.1, target: 3.0 },
    { day: 'Wed', minutes: 1.9, target: 3.0 },
    { day: 'Thu', minutes: 1.8, target: 3.0 },
    { day: 'Fri', minutes: 1.7, target: 3.0 },
    { day: 'Sat', minutes: 1.8, target: 3.0 },
    { day: 'Sun', minutes: 1.6, target: 3.0 },
  ];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-neutral-900 dark:bg-neutral-800 text-white rounded-xl shadow-xl border border-neutral-700 text-xs space-y-1">
          <p className="font-bold text-neutral-300">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="analytics-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Messaging Analytics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Cross-channel volume, SLA response rate, and customer traffic insights
          </p>
        </div>

        <div className="flex items-center bg-white dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
          ].map((range) => {
            const isActive = timeRange === range.id;
            return (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
            Total Messages
          </span>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {kpis.totalConversations.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +12.4%
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
            Incoming Messages
          </span>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {kpis.incomingToday.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">52.1% share</span>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
            Outgoing Messages
          </span>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {kpis.outgoingToday.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">47.9% share</span>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
            Response Rate
          </span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {kpis.responseRate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Optimal SLA</span>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
            Avg Response Time
          </span>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1 font-mono">
            {kpis.avgResponseTime}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">-24s faster</span>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
            Unread Pending
          </span>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {kpis.unreadMessages}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Inbox threads</span>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Conversations Over Time (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Conversations Over Time
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Daily incoming thread volume by channel
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#1877F2] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" /> Facebook
              </span>
              <span className="flex items-center gap-1.5 text-[#25D366] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" /> WhatsApp
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1877F2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1877F2" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25D366" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#25D366" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#f0f0f0'} />
                <XAxis
                  dataKey="date"
                  stroke={isDark ? '#737373' : '#a3a3a3'}
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke={isDark ? '#737373' : '#a3a3a3'}
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="facebook"
                  name="Facebook Messenger"
                  stroke="#1877F2"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFb)"
                />
                <Area
                  type="monotone"
                  dataKey="whatsapp"
                  name="WhatsApp Business"
                  stroke="#25D366"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWa)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Channel Distribution (1 Col) */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Channel Distribution
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Breakdown of total messaging traffic
            </p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-neutral-400 font-medium">Total</span>
              <span className="text-lg font-bold text-neutral-900 dark:text-white">
                {(kpis.facebookMessages + kpis.whatsAppMessages).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Facebook</span>
              </span>
              <span className="font-bold font-mono">
                {((kpis.facebookMessages / (kpis.facebookMessages + kpis.whatsAppMessages)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                <span className="font-medium text-neutral-700 dark:text-neutral-300">WhatsApp</span>
              </span>
              <span className="font-bold font-mono">
                {((kpis.whatsAppMessages / (kpis.facebookMessages + kpis.whatsAppMessages)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts: Response Times & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time by Day */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Average Response Time (Minutes)
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Speed of first agent response vs 3.0 min target SLA
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold rounded-md">
              Target: &lt; 3.0m
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#f0f0f0'} />
                <XAxis dataKey="day" stroke={isDark ? '#737373' : '#a3a3a3'} fontSize={11} />
                <YAxis stroke={isDark ? '#737373' : '#a3a3a3'} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" name="Response Time (min)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Messaging Hours */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Peak Traffic Hours
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Highest incoming message volume times (Dhaka BST)
              </p>
            </div>
            <span className="text-xs text-neutral-400 font-mono">Peak: 7 PM - 10 PM</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#f0f0f0'} />
                <XAxis dataKey="hour" stroke={isDark ? '#737373' : '#a3a3a3'} fontSize={11} />
                <YAxis stroke={isDark ? '#737373' : '#a3a3a3'} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="messages" name="Messages" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
