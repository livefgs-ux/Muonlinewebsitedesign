// AdminCP Module Status Types
export type ModuleStatus = 'active' | 'development' | 'not-configured' | 'disabled';

export interface ModuleState {
  id: string;
  name: string;
  status: ModuleStatus;
  lastUpdated?: string;
  description?: string;
}

// Account Management Types
export interface Account {
  account: string;
  email: string;
  blocked: number;
  activated: number;
  ip: string;
  created_at: string;
  last_login?: string;
}

export interface OnlineAccount {
  account: string;
  character: string;
  level: number;
  map: string;
  online_since: string;
}

// Ban Management Types
export interface BanRecord {
  id: number;
  account?: string;
  ip?: string;
  mac?: string;
  country?: string;
  reason: string;
  created_at: string;
  created_by: string;
  expires_at?: string;
}

// Credits System Types
export interface CreditProvider {
  provider: 'paypal' | 'mercadopago' | 'pix' | 'stripe';
  enabled: boolean;
  client_id?: string;
  secret?: string;
  configured: boolean;
}

export interface CreditPackage {
  id: number;
  credits: number;
  price: number;
  currency: string;
  enabled: boolean;
  bonus?: number;
  popular?: boolean;
}

export interface CreditTransaction {
  id: number;
  account: string;
  credits: number;
  amount: number;
  currency: string;
  provider: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

// Site Editor Types
export interface SiteStyle {
  font_family: string;
  font_size: string;
  font_weight: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  updated_at: string;
}

export interface SiteContent {
  id: number;
  section: string;
  key: string;
  value: string;
  language: string;
}

// Downloads Types
export interface Download {
  id: number;
  title: string;
  description: string;
  file_url: string;
  file_size: string;
  version: string;
  enabled: boolean;
  downloads_count: number;
  created_at: string;
  updated_at: string;
}

// Events Types
export interface Event {
  id: number;
  name: string;
  description: string;
  start_time: string;
  duration: number;
  enabled: boolean;
  days: string[]; // ['monday', 'tuesday', etc]
}

// Rankings Configuration
export interface RankingConfig {
  type: 'resets' | 'pk' | 'guilds' | 'events';
  enabled: boolean;
  limit: number;
  refresh_interval: number; // minutes
  last_updated: string;
}

// Global Settings
export interface GlobalSettings {
  site_name: string;
  site_description: string;
  site_keywords: string;
  language_default: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  max_accounts_per_ip: number;
  exp_rate: number;
  drop_rate: number;
  discord_url?: string;
  facebook_url?: string;
  youtube_url?: string;
}

// Module Configuration
export interface ModuleConfig {
  accounts: ModuleState;
  bans: ModuleState;
  credits: ModuleState;
  downloads: ModuleState;
  events: ModuleState;
  rankings: ModuleState;
  site_editor: ModuleState;
  global_settings: ModuleState;
  social_links: ModuleState;
  news: ModuleState;
  plugins: ModuleState;
}
