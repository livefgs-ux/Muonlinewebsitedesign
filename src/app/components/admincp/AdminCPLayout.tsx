import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, Users, Swords, FileText, Settings, LogOut, Menu,
  X, ChevronRight, Search, Bell, UserCircle2, Database,
  Calendar, Award, Activity, Ban, Shield, TrendingUp,
  BarChart3, Boxes, Layout, ScrollText, Clock, DollarSign, Eye, ShoppingCart
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { DashboardSection } from './sections/DashboardSection';
import { AccountManagement } from './sections/AccountManagement';
import { CharacterManagement } from './sections/CharacterManagement';
import { NewsManagement } from './sections/NewsManagement';
import { SettingsSection } from './sections/SettingsSection';
import { PluginsSection } from './sections/PluginsSection';
import { LogsSection } from './sections/LogsSection';
import { SiteEditorSection } from './sections/SiteEditorSection';
import { CronsSection } from './sections/CronsSection';
import { BansSection } from './sections/BansSection';
import { InstallationGuideSection } from './sections/InstallationGuideSection';
import { DonationLinksSection } from './sections/DonationLinksSection';
import WCoinPackagesSection from './sections/WCoinPackagesSection';
import DonationsPanel from '../admin/DonationsPanel';
import SecurityPanel from '../admin/SecurityPanel';
import CronJobsPanel from '../admin/CronJobsPanel';
import { SystemManagement } from './system-management';

interface AdminCPLayoutProps {
  adminData: any;
  onLogout: () => void;
  onNavigate?: (section: string) => void;
}

/**
 * 🛡️ AdminCP SPA Layout - Painel Administrativo Completo
 * 
 * ✨ Features:
 * - Layout SPA moderno com navegação fluida
 * - 10 módulos administrativos completos
 * - Tema Dark Medieval Fantasy + Glassmorphism
 * - Animações suaves com Motion
 * - Responsivo e otimizado
 */

export function AdminCPLayout({ adminData, onLogout, onNavigate }: AdminCPLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const user = adminData.user;

  // 📋 Menu de Módulos Administrativos
  const adminModules = useMemo(() => [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: BarChart3,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'accounts',
      name: 'Contas',
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'characters',
      name: 'Personagens',
      icon: Swords,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      permission: 'editCharacters'
    },
    {
      id: 'donations',
      name: 'Doações',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'news',
      name: 'Notícias',
      icon: FileText,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      permission: 'publishNews'
    },
    {
      id: 'settings',
      name: 'Configurações',
      icon: Settings,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'plugins',
      name: 'Plugins',
      icon: Boxes,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'security',
      name: 'Segurança',
      icon: Shield,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'logs',
      name: 'Logs',
      icon: ScrollText,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'site-editor',
      name: 'Editor de Site',
      icon: Layout,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'crons',
      name: 'Crons',
      icon: Clock,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'bans',
      name: 'Bans',
      icon: Ban,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      permission: 'banUsers'
    },
    {
      id: 'system',
      name: 'Sistema',
      icon: Database,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'installation-guide',
      name: 'Guia de Instalação',
      icon: FileText,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'donation-links',
      name: 'Links de Doação',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      permission: 'viewAccounts'
    },
    {
      id: 'wcoin-packages',
      name: 'Pacotes WCoin',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      permission: 'viewAccounts'
    }
  ], []);

  // Filtrar módulos baseado em permissões
  const availableModules = useMemo(() => {
    return adminModules.filter(module => 
      user.permissions[module.permission as keyof typeof user.permissions]
    );
  }, [adminModules, user.permissions]);

  // Renderizar conteúdo do módulo ativo
  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardSection />;
      case 'accounts':
        return <AccountManagement />;
      case 'characters':
        return <CharacterManagement />;
      case 'donations':
        return <DonationsPanel />;
      case 'news':
        return <NewsManagement />;
      case 'settings':
        return <SettingsSection />;
      case 'plugins':
        return <PluginsSection />;
      case 'security':
        return <SecurityPanel />;
      case 'logs':
        return <LogsSection />;
      case 'site-editor':
        return <SiteEditorSection />;
      case 'crons':
        return <CronJobsPanel />;
      case 'bans':
        return <BansSection />;
      case 'system':
        return <SystemManagement />;
      case 'installation-guide':
        return <InstallationGuideSection />;
      case 'donation-links':
        return <DonationLinksSection />;
      case 'wcoin-packages':
        return <WCoinPackagesSection apiBaseUrl={process.env.VITE_API_URL || 'http://localhost:3001/api'} />;
      default:
        return <DashboardSection />;
    }
  };

  const activeModuleData = availableModules.find(m => m.id === activeModule);

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Glassmorphism Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950 pointer-events-none" />
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================
          SIDEBAR - Navegação Lateral
          ======================================== */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="relative z-20 flex flex-col border-r border-amber-500/20 bg-slate-900/40 backdrop-blur-2xl"
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                  <Crown className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h2 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                    AdminCP
                  </h2>
                  <p className="text-[10px] text-slate-500 font-medium">MeuMU Online</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Sidebar Menu */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {availableModules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              
              return (
                <motion.button
                  key={module.id}
                  onClick={() => {
                    setActiveModule(module.id);
                    if (onNavigate) onNavigate(module.id);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-200 relative overflow-hidden
                    ${isActive 
                      ? `${module.bgColor} border border-${module.color.replace('text-', '')}/30 text-white shadow-lg` 
                      : 'bg-slate-800/40 text-slate-200 hover:bg-slate-700/60 hover:text-white border border-slate-700/50'
                    }
                    ${!sidebarOpen && 'justify-center'}
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute left-0 top-0 bottom-0 w-1 ${module.color.replace('text-', 'bg-')}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <Icon className={`w-5 h-5 ${isActive ? module.color : 'text-slate-300'} relative z-10`} />
                  
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium relative z-10">
                        {module.name}
                      </span>
                      {isActive && (
                        <ChevronRight className={`w-4 h-4 ${module.color} relative z-10`} />
                      )}
                    </>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer - User Info */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-slate-800/50"
            >
              <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-slate-800/30 backdrop-blur-xl">
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-10 h-10 rounded-full border-2 border-amber-500 shadow-lg shadow-amber-500/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-amber-400 truncate">
                    {user.username}
                  </p>
                  <Badge className="text-xs bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* ========================================
          MAIN CONTENT - Área Principal
          ======================================== */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/40 backdrop-blur-2xl border-b border-slate-800/50 flex items-center justify-between px-6 relative z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              {activeModuleData && (
                <>
                  <div className={`p-2 rounded-lg ${activeModuleData.bgColor}`}>
                    <activeModuleData.icon className={`w-5 h-5 ${activeModuleData.color}`} />
                  </div>
                  <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                    {activeModuleData.name}
                  </h1>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-slate-800/50 backdrop-blur-xl border-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500/50 transition-colors"
              />
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
            </Button>

            {/* Profile */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <UserCircle2 className="w-6 h-6" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1600px] mx-auto"
            >
              {renderModuleContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}