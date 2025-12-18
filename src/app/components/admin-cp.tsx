import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Users,
  User,
  Ban,
  DollarSign,
  Settings,
  Wrench,
  Languages,
  Plug,
  Server,
  ChevronRight,
  Clock,
  Edit,
  TrendingUp,
  Plus,
  Search,
  Palette,
  Newspaper,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AdminSiteEditor } from './admin-site-editor';
import { AdminMusicPlaylist } from './admin-music-playlist';
import { AdminSocialLinks } from './admin-social-links';
import { AdminPlugins } from './admin-plugins';
import { AdminActivePlugins } from './admin-active-plugins';
import { AdminPublishNews } from './admin-publish-news';
import { AccountSearch } from './admincp/account-search';
import { ModuleNotConfigured } from './admincp/module-not-configured';
import { ModuleStatusBadge } from './admincp/module-status-badge';
import { moduleConfig } from '../data/admincp-state';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  color?: string; // Cor específica para cada seção
  subItems?: { id: string; label: string; hidden?: boolean }[];
}

const sidebarMenu: SidebarItem[] = [
  {
    id: 'news',
    label: 'News Management',
    icon: Newspaper,
    color: 'sky', // Azul claro
    subItems: [
      { id: 'addnews', label: 'Publish' },
      { id: 'managenews', label: 'Edit / Delete' },
    ]
  },
  {
    id: 'account',
    label: 'Account',
    icon: Users,
    color: 'emerald', // Verde claro
    subItems: [
      { id: 'searchaccount', label: 'Search' },
      { id: 'accountsfromip', label: 'Find Accounts from IP' },
      { id: 'onlineaccounts', label: 'Online Accounts' },
      { id: 'newregistrations', label: 'New Registrations' },
      { id: 'accountinfo', label: '', hidden: true },
    ]
  },
  {
    id: 'character',
    label: 'Character',
    icon: User,
    color: 'violet', // Roxo claro
    subItems: [
      { id: 'searchcharacter', label: 'Search' },
      { id: 'editcharacter', label: '', hidden: true },
    ]
  },
  {
    id: 'bans',
    label: 'Bans',
    icon: Ban,
    color: 'rose', // Rosa/vermelho claro
    subItems: [
      { id: 'searchban', label: 'Search' },
      { id: 'banaccount', label: 'Ban Account' },
      { id: 'latestbans', label: 'Latest Bans' },
      { id: 'blockedips', label: 'Blocked IPs' },
    ]
  },
  {
    id: 'credits',
    label: 'Credits',
    icon: DollarSign,
    color: 'amber', // Amarelo/dourado claro
    subItems: [
      { id: 'creditsconfigs', label: 'Credit Configurations' },
      { id: 'creditsmanager', label: 'Credit Manager' },
      { id: 'latestpaypal', label: 'PayPal Donations' },
      { id: 'topvotes', label: 'Top Voters' },
    ]
  },
  {
    id: 'siteeditor',
    label: 'Site Editor',
    icon: Palette,
    color: 'indigo', // Índigo claro
    subItems: [
      { id: 'site_editor', label: 'Design Editor' },
      { id: 'admincp_access', label: 'AdminCP Access' },
      { id: 'connection_settings', label: 'Connection Settings' },
      { id: 'website_settings', label: 'Website Settings' },
      { id: 'modules_manager', label: 'Modules Manager' },
      { id: 'navbar', label: 'Navigation Menu' },
      { id: 'usercp', label: 'UserCP Menu' },
      { id: 'music_playlist', label: 'Music Playlist' },
      { id: 'social_links', label: 'Social Links' },
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Wrench,
    color: 'cyan', // Ciano claro
    subItems: [
      { id: 'cachemanager', label: 'Cache Manager' },
      { id: 'cronmanager', label: 'Cron Job Manager' },
    ]
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: Languages,
    color: 'lime', // Verde-limão claro
    subItems: [
      { id: 'phrases', label: 'Phrase List' },
    ]
  },
  {
    id: 'plugins',
    label: 'Plugins',
    icon: Plug,
    color: 'fuchsia', // Fúcsia claro
    subItems: [
      { id: 'plugins', label: 'Plugins Manager' },
      { id: 'active_plugins', label: 'Active Plugins' },
    ]
  },
];

// Mock data for dashboard
const dashboardStats = [
  { label: 'Total Accounts', value: '1,234', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/20', border: 'border-blue-500/50' },
  { label: 'Online Players', value: '156', icon: User, color: 'text-green-500', bg: 'bg-green-500/20', border: 'border-green-500/50' },
  { label: 'Total Characters', value: '2,847', icon: Shield, color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
  { label: 'Active Bans', value: '23', icon: Ban, color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500/50' },
];

const recentActivity = [
  { user: 'Admin1', action: 'Banned account', target: 'CheatUser123', time: '5 mins ago', type: 'ban' },
  { user: 'Admin2', action: 'Published news', target: 'New Event Announcement', time: '15 mins ago', type: 'news' },
  { user: 'Admin1', action: 'Edited character', target: 'WarriorPro', time: '1 hour ago', type: 'edit' },
  { user: 'Admin3', action: 'Added credits', target: 'PlayerX', time: '2 hours ago', type: 'credits' },
];

// Background image for AdminCP
const heroImage = 'https://images.unsplash.com/photo-1692897403215-9718cae64dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMGNhc3RsZXxlbnwxfHx8fDE3NjU5Mzc5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080';

export function AdminCP() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('news');

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'siteeditor':
        return <AdminSiteEditor />;
      case 'music_playlist':
        return <AdminMusicPlaylist />;
      case 'social_links':
        return <AdminSocialLinks />;
      case 'searchaccount':
        return <SearchAccountContent />;
      case 'onlineaccounts':
        return <OnlineAccountsContent />;
      case 'searchcharacter':
        return <SearchCharacterContent />;
      case 'banaccount':
        return <BanAccountContent />;
      case 'addnews':
        return <AdminPublishNews />;
      case 'plugins':
        return <AdminPlugins />;
      case 'active_plugins':
        return <AdminActivePlugins />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/95 z-10" />
        <img
          src={heroImage}
          alt="Admin Background"
          className="w-full h-full object-cover object-center opacity-30"
        />
      </div>

      <div className="relative z-20 flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-80 min-h-screen backdrop-blur-md bg-black/80 border-r border-yellow-500/30 p-6 fixed left-0 top-20 bottom-0 overflow-y-auto"
        >
          {/* Admin Header */}
          <div className="mb-8 pb-6 border-b border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl text-white">AdminCP</h2>
            </div>
            <p className="text-gray-400 text-sm">Management Panel</p>
          </div>

          {/* Dashboard Button */}
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              activeSection === 'dashboard'
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          {/* Site Editor Button */}
          <button
            onClick={() => setActiveSection('siteeditor')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-4 transition-all ${
              activeSection === 'siteeditor'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/50'
                : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/30'
            }`}
          >
            <Palette className="w-5 h-5" />
            <span>Site Editor</span>
          </button>

          {/* Menu Items */}
          <nav className="space-y-2">
            {sidebarMenu.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      expandedMenu === item.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                
                {/* Sub Items */}
                {expandedMenu === item.id && item.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 mt-1 space-y-1"
                  >
                    {item.subItems
                      .filter(subItem => !subItem.hidden)
                      .map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveSection(subItem.id)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                            activeSection === subItem.id
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-80 px-8 py-8 max-w-[1400px] mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Dashboard Content Component
function DashboardContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your server statistics and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`backdrop-blur-md bg-black/70 border ${stat.border} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-14 h-14 ${stat.bg} rounded-lg flex items-center justify-center border ${stat.border}`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="backdrop-blur-md bg-black/70 border-yellow-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-yellow-500" />
          <h3 className="text-2xl text-white">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-yellow-500/20 hover:border-yellow-500/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'ban' ? 'bg-red-500/20 border border-red-500/50' :
                  activity.type === 'news' ? 'bg-blue-500/20 border border-blue-500/50' :
                  activity.type === 'edit' ? 'bg-yellow-500/20 border border-yellow-500/50' :
                  'bg-green-500/20 border border-green-500/50'
                }`}>
                  {activity.type === 'ban' && <Ban className="w-5 h-5 text-red-500" />}
                  {activity.type === 'news' && <Newspaper className="w-5 h-5 text-blue-500" />}
                  {activity.type === 'edit' && <Edit className="w-5 h-5 text-yellow-500" />}
                  {activity.type === 'credits' && <DollarSign className="w-5 h-5 text-green-500" />}
                </div>
                <div>
                  <p className="text-white">
                    <span className="text-yellow-500">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-gray-400 text-sm">{activity.target}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">{activity.time}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="backdrop-blur-md bg-black/70 border-yellow-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-yellow-500" />
          <h3 className="text-2xl text-white">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6">
            <Plus className="w-5 h-5 mr-2" />
            Add News
          </Button>
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6">
            <Ban className="w-5 h-5 mr-2" />
            Ban Account
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6">
            <DollarSign className="w-5 h-5 mr-2" />
            Add Credits
          </Button>
          <Button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black py-6">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Search Account Content
function SearchAccountContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl text-white mb-2">Search Account</h1>
        <p className="text-gray-400">Find and manage user accounts</p>
      </div>

      <Card className="backdrop-blur-md bg-black/70 border-yellow-500/30 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Account Username:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter username..."
                className="flex-1 bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-black px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Online Accounts Content
function OnlineAccountsContent() {
  const mockOnlineAccounts = [
    { username: 'Player1', characters: 2, ip: '192.168.1.100', loginTime: '2 hours ago' },
    { username: 'Player2', characters: 1, ip: '192.168.1.101', loginTime: '1 hour ago' },
    { username: 'Player3', characters: 3, ip: '192.168.1.102', loginTime: '30 mins ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl text-white mb-2">Online Accounts</h1>
        <p className="text-gray-400">Currently connected players</p>
      </div>

      <Card className="backdrop-blur-md bg-black/70 border-yellow-500/30 p-6">
        <div className="space-y-3">
          {mockOnlineAccounts.map((account, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-green-500/30"
            >
              <div>
                <p className="text-white mb-1">{account.username}</p>
                <p className="text-gray-400 text-sm">
                  {account.characters} character(s) | IP: {account.ip}
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/50">
                  Online
                </span>
                <p className="text-gray-500 text-xs mt-1">{account.loginTime}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// Search Character Content
function SearchCharacterContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl text-white mb-2">Search Character</h1>
        <p className="text-gray-400">Find and edit character information</p>
      </div>

      <Card className="backdrop-blur-md bg-black/70 border-yellow-500/30 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Character Name:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter character name..."
                className="flex-1 bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-black px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Ban Account Content
function BanAccountContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl text-white mb-2">Ban Account</h1>
        <p className="text-gray-400">Restrict access to user accounts</p>
      </div>

      <Card className="backdrop-blur-md bg-black/70 border-red-500/30 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Username:</label>
            <input
              type="text"
              placeholder="Enter username to ban..."
              className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Reason:</label>
            <textarea
              placeholder="Enter ban reason..."
              rows={4}
              className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Duration:</label>
            <select className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>Permanent</option>
              <option>7 Days</option>
              <option>30 Days</option>
              <option>Custom</option>
            </select>
          </div>
          <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4">
            <Ban className="w-5 h-5 mr-2" />
            Ban Account
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}