import { 
  ModuleConfig, 
  Account, 
  BanRecord, 
  CreditProvider, 
  CreditPackage,
  Download,
  Event,
  RankingConfig,
  GlobalSettings 
} from '../types/admincp';

// Module States - Central configuration
export const moduleConfig: ModuleConfig = {
  accounts: {
    id: 'accounts',
    name: 'Account Management',
    status: 'active',
    lastUpdated: '2025-01-15',
    description: 'Search, manage and monitor user accounts'
  },
  bans: {
    id: 'bans',
    name: 'Ban Management',
    status: 'active',
    lastUpdated: '2025-01-15',
    description: 'Manage account, IP, MAC and region bans'
  },
  credits: {
    id: 'credits',
    name: 'Credits System',
    status: 'not-configured',
    description: 'Payment providers not configured yet'
  },
  downloads: {
    id: 'downloads',
    name: 'Downloads Management',
    status: 'active',
    lastUpdated: '2025-01-15',
    description: 'Manage game client and patch downloads'
  },
  events: {
    id: 'events',
    name: 'Events Configuration',
    status: 'active',
    lastUpdated: '2025-01-14',
    description: 'Configure automatic events schedule'
  },
  rankings: {
    id: 'rankings',
    name: 'Rankings System',
    status: 'active',
    lastUpdated: '2025-01-15',
    description: 'Auto-update rankings from database'
  },
  site_editor: {
    id: 'site_editor',
    name: 'Site Editor',
    status: 'active',
    lastUpdated: '2025-01-15',
    description: 'Customize site appearance and content'
  },
  global_settings: {
    id: 'global_settings',
    name: 'Global Settings',
    status: 'active',
    lastUpdated: '2025-01-15',
    description: 'Server rates, limits and general settings'
  },
  social_links: {
    id: 'social_links',
    name: 'Social Links',
    status: 'active',
    lastUpdated: '2025-01-14',
    description: 'Manage Discord, Facebook, YouTube links'
  },
  news: {
    id: 'news',
    name: 'News Management',
    status: 'active',
    lastUpdated: '2025-01-14',
    description: 'Create and manage news posts'
  },
  plugins: {
    id: 'plugins',
    name: 'Plugins System',
    status: 'active',
    lastUpdated: '2025-01-14',
    description: 'Enable/disable site plugins'
  }
};

// Mock Data - Accounts
export const mockAccounts: Account[] = [
  {
    account: 'admin',
    email: 'admin@meumu.com',
    blocked: 0,
    activated: 1,
    ip: '192.168.1.1',
    created_at: '2025-01-01 10:00:00',
    last_login: '2025-01-15 14:30:00'
  },
  {
    account: 'player001',
    email: 'player001@email.com',
    blocked: 0,
    activated: 1,
    ip: '192.168.1.100',
    created_at: '2025-01-10 15:20:00',
    last_login: '2025-01-15 20:15:00'
  },
  {
    account: 'banned_user',
    email: 'banned@email.com',
    blocked: 1,
    activated: 1,
    ip: '10.0.0.50',
    created_at: '2025-01-05 08:00:00',
    last_login: '2025-01-12 10:00:00'
  }
];

// Mock Data - Bans
export const mockBans: BanRecord[] = [
  {
    id: 1,
    account: 'banned_user',
    ip: '10.0.0.50',
    mac: '00:1B:44:11:3A:B7',
    country: 'Unknown',
    reason: 'Using third-party software',
    created_at: '2025-01-12 10:30:00',
    created_by: 'admin',
    expires_at: '2025-02-12 10:30:00'
  },
  {
    id: 2,
    ip: '192.168.50.100',
    reason: 'Multiple account violations',
    created_at: '2025-01-10 18:00:00',
    created_by: 'admin'
  }
];

// Mock Data - Credit Providers
export const mockCreditProviders: CreditProvider[] = [
  {
    provider: 'paypal',
    enabled: false,
    configured: false
  },
  {
    provider: 'mercadopago',
    enabled: false,
    configured: false
  },
  {
    provider: 'pix',
    enabled: false,
    configured: false
  },
  {
    provider: 'stripe',
    enabled: false,
    configured: false
  }
];

// Mock Data - Credit Packages
export const mockCreditPackages: CreditPackage[] = [
  {
    id: 1,
    credits: 100,
    price: 5.00,
    currency: 'USD',
    enabled: true
  },
  {
    id: 2,
    credits: 300,
    price: 14.00,
    currency: 'USD',
    enabled: true,
    bonus: 50
  },
  {
    id: 3,
    credits: 500,
    price: 20.00,
    currency: 'USD',
    enabled: true,
    bonus: 100,
    popular: true
  },
  {
    id: 4,
    credits: 1000,
    price: 35.00,
    currency: 'USD',
    enabled: true,
    bonus: 300
  }
];

// Mock Data - Downloads
export const mockDownloads: Download[] = [
  {
    id: 1,
    title: 'MeuMU Client Full',
    description: 'Complete game client - Season 19-2-3',
    file_url: 'https://example.com/client-full.zip',
    file_size: '4.2 GB',
    version: '19.2.3',
    enabled: true,
    downloads_count: 5420,
    created_at: '2025-01-01 10:00:00',
    updated_at: '2025-01-10 15:00:00'
  },
  {
    id: 2,
    title: 'Latest Patch',
    description: 'Update to version 19.2.3',
    file_url: 'https://example.com/patch-v19.2.3.zip',
    file_size: '245 MB',
    version: '19.2.3',
    enabled: true,
    downloads_count: 1250,
    created_at: '2025-01-10 15:00:00',
    updated_at: '2025-01-10 15:00:00'
  }
];

// Mock Data - Events
export const mockEvents: Event[] = [
  {
    id: 1,
    name: 'Blood Castle',
    description: 'Enter the Blood Castle and defeat the enemies',
    start_time: '14:00',
    duration: 30,
    enabled: true,
    days: ['monday', 'wednesday', 'friday']
  },
  {
    id: 2,
    name: 'Devil Square',
    description: 'Survive waves of monsters',
    start_time: '16:00',
    duration: 20,
    enabled: true,
    days: ['tuesday', 'thursday', 'saturday']
  },
  {
    id: 3,
    name: 'Chaos Castle',
    description: 'Battle royale event',
    start_time: '20:00',
    duration: 30,
    enabled: true,
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }
];

// Mock Data - Ranking Configuration
export const mockRankingConfig: RankingConfig[] = [
  {
    type: 'resets',
    enabled: true,
    limit: 100,
    refresh_interval: 5,
    last_updated: '2025-01-15 14:30:00'
  },
  {
    type: 'pk',
    enabled: true,
    limit: 100,
    refresh_interval: 10,
    last_updated: '2025-01-15 14:25:00'
  },
  {
    type: 'guilds',
    enabled: true,
    limit: 50,
    refresh_interval: 15,
    last_updated: '2025-01-15 14:20:00'
  },
  {
    type: 'events',
    enabled: true,
    limit: 100,
    refresh_interval: 5,
    last_updated: '2025-01-15 14:30:00'
  }
];

// Mock Data - Global Settings
export const mockGlobalSettings: GlobalSettings = {
  site_name: 'MeuMU Online',
  site_description: 'Season 19-2-3 Epic Server',
  site_keywords: 'mu online, mmorpg, season 19, mu server',
  language_default: 'pt-BR',
  maintenance_mode: false,
  registration_enabled: true,
  max_accounts_per_ip: 3,
  exp_rate: 9999,
  drop_rate: 60,
  discord_url: 'https://discord.gg/meumu',
  facebook_url: 'https://facebook.com/meumu',
  youtube_url: 'https://youtube.com/@meumu'
};
