/**
 * 📦 COMMON TYPES - Tipos compartilhados entre componentes
 * Evita duplicação de interfaces
 */

// ===== STATUS & STATES =====
export type Status = 'active' | 'inactive' | 'paused' | 'error' | 'success' | 'pending';
export type OnlineStatus = 'online' | 'offline';
export type ActionType = 'create' | 'update' | 'delete' | 'read' | 'ban' | 'unban';

// ===== USER & ACCOUNT =====
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  lastLogin?: string;
  isAdmin?: boolean;
}

export interface Account {
  accountId: string;
  username: string;
  email: string;
  createdAt: string;
  vipLevel: number;
  wcoin: number;
  goblinPoints: number;
  zen: number;
  status: Status;
}

// ===== CHARACTER =====
export interface Character {
  id: number;
  name: string;
  class: string;
  classCode?: number;
  level: number;
  resets: number;
  masterResets: number;
  guild: string;
  online: boolean;
  experience?: number;
  pointsAvailable?: number;
  stats?: CharacterStats;
  zen?: number;
  pkLevel?: number;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  vitality: number;
  energy: number;
  leadership: number;
}

// ===== ACTIVITY LOG =====
export interface Activity {
  id: number;
  timestamp: string;
  action: string;
  icon: string;
  type?: string;
  details?: string;
}

// ===== SECURITY =====
export interface SecurityLog {
  id: number;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip?: string;
  user?: string;
}

export interface BannedIP {
  ip: string;
  reason: string;
  bannedAt: string;
  expiresAt?: string;
  bannedBy: string;
}

// ===== CRON JOBS =====
export interface CronJob {
  id: number;
  name: string;
  description: string;
  schedule: string;
  schedulePattern: string;
  lastRun: string;
  nextRun?: string;
  status: Status;
}

export interface CronLog {
  id: number;
  jobName: string;
  runTime: string;
  status: 'success' | 'failed';
  output: string;
  duration?: number;
  errorMessage?: string;
}

// ===== DONATIONS =====
export interface Donation {
  id: number;
  username: string;
  amount: number;
  gateway: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
}

// ===== RANKINGS =====
export interface RankingPlayer {
  position: number;
  name: string;
  class: string;
  level: number;
  resets: number;
  masterResets: number;
  guild?: string;
}

export interface RankingGuild {
  position: number;
  name: string;
  master: string;
  score: number;
  members: number;
  logo?: string;
}

// ===== API RESPONSE =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ===== FORM VALIDATION =====
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errors?: string[];
}

// ===== STATS =====
export interface Stats {
  wcoin: number;
  goblinPoints: number;
  zen: number;
  vipLevel?: number;
  totalResets?: number;
  totalMasterResets?: number;
}

// ===== EVENTS =====
export interface GameEvent {
  id: number;
  name: string;
  type: string;
  startTime: string;
  endTime?: string;
  status: 'upcoming' | 'active' | 'completed';
  participants?: number;
  rewards?: string;
}

// ===== NEWS =====
export interface News {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  published: boolean;
  views: number;
}

// ===== PLUGIN =====
export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  config?: Record<string, any>;
}

// ===== SETTINGS =====
export interface ServerSettings {
  serverName: string;
  serverVersion: string;
  maxPlayers: number;
  experienceRate: number;
  dropRate: number;
  masterRate: number;
  maintenance: boolean;
  maintenanceMessage?: string;
}

// ===== TABLE PROPS =====
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
}

// ===== MODAL PROPS =====
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ===== NOTIFICATION =====
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
}