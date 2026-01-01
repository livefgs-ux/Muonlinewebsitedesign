/**
 * ⭐ ADMIN CONTROL PANEL - COMPONENTE PRINCIPAL
 * 
 * Sistema de administração completo e modular
 * Total: 68+ componentes modulares
 * 10 seções principais com cores específicas
 * 
 * @version 1.0.0
 * @date 2025-12-31
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Swords,
  ShieldBan,
  DollarSign,
  Newspaper,
  Paintbrush,
  Wrench,
  Database,
  Languages,
  Puzzle,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

// Navigation Menu
import { NavigationMenu } from './admincp/navigation-menu';

// Section Components
import { DashboardSection } from './admincp/sections/DashboardSection';
import { AccountManagement } from './admincp/sections/AccountManagement';
import { CharacterManagement } from './admincp/sections/CharacterManagement';
import { BansSection } from './admincp/sections/BansSection';
import { CreditsSection } from './admincp/sections/CreditsSection';
import { NewsManagement } from './admincp/sections/NewsManagement';
import { SiteEditorSection } from './admincp/sections/SiteEditorSection';
import { ToolsSection } from './admincp/sections/ToolsSection';
import { DatabaseSection } from './admincp/sections/DatabaseSection';
import { LanguagesSection } from './admincp/sections/LanguagesSection';
import { PluginsSection } from './admincp/sections/PluginsSection';
import { ModuleManager } from './admincp/module-manager';

/**
 * 🎨 SISTEMA DE CORES POR SEÇÃO
 * Cada seção tem uma cor única para identificação visual
 */
export const SECTION_COLORS = {
  dashboard: { name: 'Dashboard', color: 'slate', icon: LayoutDashboard },
  account: { name: 'Account', color: 'emerald', icon: Users },
  character: { name: 'Character', color: 'purple', icon: Swords },
  bans: { name: 'Bans', color: 'rose', icon: ShieldBan },
  credits: { name: 'Credits', color: 'amber', icon: DollarSign },
  news: { name: 'News', color: 'sky', icon: Newspaper },
  site: { name: 'Site Editor', color: 'indigo', icon: Paintbrush },
  tools: { name: 'Tools', color: 'cyan', icon: Wrench },
  database: { name: 'Database', color: 'teal', icon: Database },
  languages: { name: 'Languages', color: 'lime', icon: Languages },
  plugins: { name: 'Plugins', color: 'fuchsia', icon: Puzzle },
  modules: { name: 'Modules', color: 'violet', icon: Settings }
} as const;

type SectionKey = keyof typeof SECTION_COLORS;

interface AdminCPProps {
  onLogout?: () => void;
}

export function AdminCP({ onLogout }: AdminCPProps) {
  const [currentSection, setCurrentSection] = useState<SectionKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Renderizar seção ativa
  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'account':
        return <AccountManagement />;
      case 'character':
        return <CharacterManagement />;
      case 'bans':
        return <BansSection />;
      case 'credits':
        return <CreditsSection />;
      case 'news':
        return <NewsManagement />;
      case 'site':
        return <SiteEditorSection />;
      case 'tools':
        return <ToolsSection />;
      case 'database':
        return <DatabaseSection />;
      case 'languages':
        return <LanguagesSection />;
      case 'plugins':
        return <PluginsSection />;
      case 'modules':
        return <ModuleManager />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 z-50 h-screen w-72 glass-sidebar border-r border-white/10"
          >
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                      AdminCP
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">MeuMU Online</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="size-5" />
                  </Button>
                </div>

                <Separator className="bg-white/10" />

                {/* Navigation */}
                <NavigationMenu
                  currentSection={currentSection}
                  onSectionChange={setCurrentSection}
                  sections={SECTION_COLORS}
                />

                <Separator className="bg-white/10" />

                {/* Logout */}
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="size-4 mr-3" />
                  Logout
                </Button>
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'ml-0'
        }`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-40 glass-nav border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="size-5" />
                </Button>
              )}
              
              {/* Section Badge */}
              <div className="flex items-center gap-3">
                {React.createElement(SECTION_COLORS[currentSection].icon, {
                  className: `size-5 text-${SECTION_COLORS[currentSection].color}-500`
                })}
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {SECTION_COLORS[currentSection].name}
                  </h1>
                  <p className="text-xs text-gray-400">
                    Manage {SECTION_COLORS[currentSection].name.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
              Online
            </Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default AdminCP;
