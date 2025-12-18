import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Server,
  ChevronRight,
  Search,
  Edit,
  Plus,
  Users,
  User,
  Ban,
  DollarSign,
  Palette,
  Wrench,
  Languages,
  Plug,
  Newspaper,
  Info,
  Clock,
  Calendar,
  Activity,
  MessageSquare,
  TrendingUp,
  Database,
  AlertTriangle,
  FileEdit,
  Settings,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AccountSearch } from './admincp/account-search';
import { AccountInfo } from './admincp/account-info';
import { AccountsFromIP } from './admincp/accounts-from-ip';
import { NewRegistrations } from './admincp/new-registrations';
import { BanSearch } from './admincp/ban-search';
import { LatestBans } from './admincp/latest-bans';
import { BlockedIPs } from './admincp/blocked-ips';
import { PayPalDonations } from './admincp/paypal-donations';
import { AdminCPAccess } from './admincp/admincp-access';
import { ModuleManager } from './admincp/module-manager';
import { OnlineAccounts } from './admincp/online-accounts';
import { LanguagePhrases } from './admincp/language-phrases';
import { ImportPlugin } from './admincp/import-plugin';
import { AddStatsSettings } from './admincp/addstats-settings';
import { BuyZenSettings } from './admincp/buyzen-settings';
import { CastleSiegeSettings } from './admincp/castlesiege-settings';
import { ClearPKSettings } from './admincp/clearpk-settings';
import { ClearSkillTreeSettings } from './admincp/clearskilltree-settings';
import { ContactSettings } from './admincp/contact-settings';
import { DonationSettings } from './admincp/donation-settings';
import { DownloadsSettings } from './admincp/downloads-settings';
import { EmailSettings } from './admincp/email-settings';
import { ForgotPasswordSettings } from './admincp/forgotpassword-settings';
import { LoginSettings } from './admincp/login-settings';
import { MyAccountSettings } from './admincp/myaccount-settings';
import { MyEmailSettings } from './admincp/myemail-settings';
import { MyPasswordSettings } from './admincp/mypassword-settings';
import { NewsSettings } from './admincp/news-settings';
import { PayPalSettings } from './admincp/paypal-settings';
import { ProfilesSettings } from './admincp/profiles-settings';
import { RankingsSettings } from './admincp/rankings-settings';
import { RegistrationSettings } from './admincp/registration-settings';
import { ResetSettings } from './admincp/reset-settings';
import { ResetStatsSettings } from './admincp/resetstats-settings';
import { UnstickSettings } from './admincp/unstick-settings';
import { VoteSettings } from './admincp/vote-settings';
import { WebsiteSettings } from './admincp/website-settings';

// ✨ NOVOS IMPORTS - Módulos faltantes
import { AdminSearchCharacter } from './admin-search-character';
import { AdminEditCharacter } from './admin-edit-character';
import { AdminPublishNews } from './admin-publish-news';
import { AdminManageNews } from './admin-manage-news';
import { AdminEditNews } from './admin-edit-news';
import { AdminSiteEditor } from './admin-site-editor';
import { AdminMusicPlaylist } from './admin-music-playlist';
import { AdminSocialLinks } from './admin-social-links';
import { AdminCreditManager } from './admin-credit-manager';
import { AdminCreditConfigurations } from './admin-credit-configurations';
import { AdminCacheManager } from './admin-cache-manager';
import { AdminCronManager } from './admin-cron-manager';
import { AdminBanAccount } from './admin-ban-account';
import { AdminBlockIP } from './admin-block-ip';
import { AdminPlugins } from './admin-plugins';
import { AdminConnectionSettings } from './admin-connection-settings';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  color?: string; // Cor específica para cada seção
  subItems?: { id: string; label: string; hidden?: boolean }[];
}

const sidebarMenu: SidebarItem[] = [
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
  // ✨ NOVO: Character Management
  {
    id: 'character',
    label: 'Character',
    icon: Shield,
    color: 'purple', // Roxo
    subItems: [
      { id: 'searchcharacter', label: 'Search Character' },
      { id: 'editcharacter', label: 'Edit Character' },
    ]
  },
  {
    id: 'bans',
    label: 'Bans',
    icon: Ban,
    color: 'rose', // Rosa/vermelho claro
    subItems: [
      { id: 'searchban', label: 'Search' },
      { id: 'latestbans', label: 'Latest Bans' },
      { id: 'blockedips', label: 'Blocked IPs' },
      { id: 'banaccount', label: 'Ban Account' },
      { id: 'blockip', label: 'Block IP' },
    ]
  },
  {
    id: 'credits',
    label: 'Credits',
    icon: DollarSign,
    color: 'amber', // Amarelo/dourado claro
    subItems: [
      { id: 'latestpaypal', label: 'PayPal Donations' },
      { id: 'topvotes', label: 'Top Voters' },
      { id: 'creditmanager', label: 'Credit Manager' },
      { id: 'creditconfigurations', label: 'Configurations' },
    ]
  },
  // ✨ NOVO: News Management
  {
    id: 'news',
    label: 'News',
    icon: Newspaper,
    color: 'sky', // Azul céu
    subItems: [
      { id: 'publishnews', label: 'Publish News' },
      { id: 'managenews', label: 'Manage News' },
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
      { id: 'modules_manager', label: 'Modules Manager' },
      { id: 'music_playlist', label: 'Music Playlist' },
      { id: 'social_links', label: 'Social Links' },
      { id: 'addstats_settings', label: 'Add Stats Settings' },
      { id: 'buyzen_settings', label: 'Buy Zen Settings' },
      { id: 'castlesiege_settings', label: 'Castle Siege Settings' },
      { id: 'clearpk_settings', label: 'Clear PK Settings' },
      { id: 'clearskilltree_settings', label: 'Clear Skill Tree Settings' },
      { id: 'contact_settings', label: 'Contact Settings' },
      { id: 'donation_settings', label: 'Donation Settings' },
      { id: 'downloads_settings', label: 'Downloads Settings' },
      { id: 'email_settings', label: 'Email Settings' },
      { id: 'forgotpassword_settings', label: 'Forgot Password Settings' },
      { id: 'login_settings', label: 'Login Settings' },
      { id: 'myaccount_settings', label: 'My Account Settings' },
      { id: 'myemail_settings', label: 'My Email Settings' },
      { id: 'mypassword_settings', label: 'My Password Settings' },
      { id: 'news_settings', label: 'News Settings' },
      { id: 'paypal_settings', label: 'PayPal Settings' },
      { id: 'profiles_settings', label: 'Profiles Settings' },
      { id: 'rankings_settings', label: 'Rankings Settings' },
      { id: 'registration_settings', label: 'Registration Settings' },
      { id: 'reset_settings', label: 'Reset Settings' },
      { id: 'resetstats_settings', label: 'Reset Stats Settings' },
      { id: 'unstick_settings', label: 'Unstick Settings' },
      { id: 'vote_settings', label: 'Vote Settings' },
      { id: 'website_settings', label: 'Website Settings' },
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
  // ✨ NOVO: Database
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    color: 'teal', // Verde-azulado
    subItems: [
      { id: 'connectionsettings', label: 'Connection Settings' },
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
      { id: 'pluginsmanager', label: 'Plugins Manager' },
      { id: 'import_plugin', label: 'Import Plugin' },
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
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedNewsTranslation, setSelectedNewsTranslation] = useState<{newsId: number; language: string} | null>(null);

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      
      // Account Management
      case 'searchaccount':
        return <AccountSearch onViewAccount={(id) => setActiveSection('accountinfo')} />;
      case 'accountinfo':
        return <AccountInfo accountId="10458" />;
      case 'accountsfromip':
        return <AccountsFromIP onViewAccount={(id) => setActiveSection('accountinfo')} />;
      case 'onlineaccounts':
        return <OnlineAccounts />;
      case 'newregistrations':
        return <NewRegistrations />;
      
      // Character Management
      case 'searchcharacter':
        return <AdminSearchCharacter />;
      case 'editcharacter':
        return <AdminEditCharacter />;
      
      // Ban Management
      case 'searchban':
        return <BanSearch />;
      case 'latestbans':
        return <LatestBans />;
      case 'blockedips':
        return <BlockedIPs />;
      case 'banaccount':
        return <AdminBanAccount />;
      case 'blockip':
        return <AdminBlockIP />;
      
      // Credits System
      case 'latestpaypal':
        return <PayPalDonations />;
      case 'creditmanager':
        return <AdminCreditManager />;
      case 'creditconfigurations':
        return <AdminCreditConfigurations />;
      
      // ✨ News Management
      case 'publishnews':
        return <AdminPublishNews />;
      case 'managenews':
        return <AdminManageNews />;
      
      // Site Editor
      case 'siteeditor':
      case 'site_editor':
        return <AdminSiteEditor />;
      case 'admincp_access':
        return <AdminCPAccess />;
      case 'modules_manager':
        return <ModuleManager />;
      case 'music_playlist':
        return <AdminMusicPlaylist />;
      case 'social_links':
        return <AdminSocialLinks />;
      case 'addstats_settings':
        return <AddStatsSettings />;
      case 'buyzen_settings':
        return <BuyZenSettings />;
      case 'castlesiege_settings':
        return <CastleSiegeSettings />;
      case 'clearpk_settings':
        return <ClearPKSettings />;
      case 'clearskilltree_settings':
        return <ClearSkillTreeSettings />;
      case 'contact_settings':
        return <ContactSettings />;
      case 'donation_settings':
        return <DonationSettings />;
      case 'downloads_settings':
        return <DownloadsSettings />;
      case 'email_settings':
        return <EmailSettings />;
      case 'forgotpassword_settings':
        return <ForgotPasswordSettings />;
      case 'login_settings':
        return <LoginSettings />;
      case 'myaccount_settings':
        return <MyAccountSettings />;
      case 'myemail_settings':
        return <MyEmailSettings />;
      case 'mypassword_settings':
        return <MyPasswordSettings />;
      case 'news_settings':
        return <NewsSettings />;
      case 'paypal_settings':
        return <PayPalSettings />;
      case 'profiles_settings':
        return <ProfilesSettings />;
      case 'rankings_settings':
        return <RankingsSettings />;
      case 'registration_settings':
        return <RegistrationSettings />;
      case 'reset_settings':
        return <ResetSettings />;
      case 'resetstats_settings':
        return <ResetStatsSettings />;
      case 'unstick_settings':
        return <UnstickSettings />;
      case 'vote_settings':
        return <VoteSettings />;
      case 'website_settings':
        return <WebsiteSettings />;
      
      // Tools
      case 'cachemanager':
        return <AdminCacheManager />;
      case 'cronmanager':
        return <AdminCronManager />;
      
      // Database
      case 'connectionsettings':
        return <AdminConnectionSettings />;
      
      // Languages
      case 'phrases':
        return <LanguagePhrases />;
      
      // Plugins
      case 'import_plugin':
        return <ImportPlugin />;
      case 'pluginsmanager':
        return <AdminPlugins />;
      
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-4 transition-all ${
              activeSection === 'dashboard'
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-5 h-5" />
            <span>Dashboard</span>
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
  // System Information (would come from server/database in production)
  const systemInfo = {
    os: 'Windows NT 10.0',
    phpVersion: '8.2.4',
    webEngineVersion: '1.2.6',
    updateAvailable: false,
  };

  // Server Statistics (would come from database queries in production)
  const serverStats = {
    registeredAccounts: 1234,
    bannedAccounts: 23,
    totalCharacters: 2847,
    pluginStatus: 'Enabled',
    scheduledTasks: 5,
    serverTime: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    admins: 'Admin, GameMaster, Developer',
  };

  const hasInstallDir = false; // Check if /install directory exists

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your server statistics and system information</p>
      </div>

      {/* Warning: Install Directory */}
      {hasInstallDir && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <div>
              <h3 className="text-orange-300 font-medium mb-1">WARNING</h3>
              <p className="text-orange-300/80 text-sm">
                Your WebEngine CMS <strong>install</strong> directory still exists, it is recommended that you rename or delete it.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: General Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-md bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/30 h-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/50">
                  <Info className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl text-white">General Information</h3>
              </div>

              {/* System Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-blue-500/20">
                  <span className="text-gray-300">OS</span>
                  <span className="text-blue-300 text-sm font-mono">{systemInfo.os}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-blue-500/20">
                  <span className="text-gray-300">PHP</span>
                  <span className="text-blue-300 text-sm font-mono">{systemInfo.phpVersion}</span>
                </div>
                <a
                  href="https://webenginecms.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-blue-500/20 hover:border-blue-500/40 transition-all group"
                >
                  <span className="text-gray-300 group-hover:text-blue-300 transition-colors">WebEngine</span>
                  <div className="flex items-center gap-2">
                    {systemInfo.updateAvailable && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/50">
                        Update Available
                      </span>
                    )}
                    <span className="text-blue-300 text-sm font-mono group-hover:text-blue-200 transition-colors">
                      {systemInfo.webEngineVersion}
                    </span>
                  </div>
                </a>
              </div>

              {/* Server Statistics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Registered Accounts</span>
                  </div>
                  <span className="text-blue-300 font-semibold">{serverStats.registeredAccounts.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">Banned Accounts</span>
                  </div>
                  <span className="text-red-300 font-semibold">{serverStats.bannedAccounts.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-yellow-500/20">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Characters</span>
                  </div>
                  <span className="text-yellow-300 font-semibold">{serverStats.totalCharacters.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Plug className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Plugin System</span>
                  </div>
                  <span className={`text-sm font-semibold ${serverStats.pluginStatus === 'Enabled' ? 'text-green-400' : 'text-gray-400'}`}>
                    {serverStats.pluginStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Scheduled Tasks (cron)</span>
                  </div>
                  <span className="text-blue-300 font-semibold">{serverStats.scheduledTasks}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Server Time (web)</span>
                  </div>
                  <span className="text-blue-300 text-sm font-mono">{serverStats.serverTime}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-black/30 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Admins</span>
                  </div>
                  <span className="text-blue-300 text-sm">{serverStats.admins}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Community & Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="backdrop-blur-md bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Online Now</p>
                  <p className="text-2xl text-green-400 font-semibold">156</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>
            <Card className="backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Guilds</p>
                  <p className="text-2xl text-purple-400 font-semibold">87</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Community Links */}
          <Card className="backdrop-blur-md bg-gradient-to-br from-indigo-500/5 to-purple-600/5 border-indigo-500/30">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/50">
                  <MessageSquare className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl text-white">Community</h3>
              </div>
              <div className="space-y-3">
                <a
                  href="https://webenginecms.org/discord/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50">
                      <MessageSquare className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-indigo-300 transition-colors">Discord Server</p>
                      <p className="text-gray-400 text-xs">Join our community</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://www.facebook.com/MUE.WebEngine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-blue-300 transition-colors">Facebook Page</p>
                      <p className="text-gray-400 text-xs">Follow for updates</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://webenginecms.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50">
                      <Server className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-purple-300 transition-colors">WebEngine CMS</p>
                      <p className="text-gray-400 text-xs">Official website</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="backdrop-blur-md bg-gradient-to-br from-yellow-500/5 to-orange-600/5 border-yellow-500/30">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl text-white">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add News
                </Button>
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 text-sm">
                  <Ban className="w-4 h-4 mr-2" />
                  Ban Account
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Add Credits
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 text-sm">
                  <Database className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="backdrop-blur-md bg-black/70 border-yellow-500/30 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-2xl text-white">Recent Admin Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
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
      </motion.div>
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