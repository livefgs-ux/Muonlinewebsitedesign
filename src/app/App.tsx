import { useState } from 'react';
import { Navigation } from './components/navigation';
import { HeroSection } from './components/hero-section';
import { DashboardSection } from './components/dashboard-section';
import { EventsSection } from './components/events-section';
import { RankingsSection } from './components/rankings-section';
import { DownloadsSection } from './components/downloads-section';
import { ServerInfoWidget } from './components/server-info-widget';

export default function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentSection('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentSection('home');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HeroSection onNavigate={setCurrentSection} />;
      case 'dashboard':
        return <DashboardSection />;
      case 'events':
        return <EventsSection />;
      case 'rankings':
        return <RankingsSection />;
      case 'downloads':
        return <DownloadsSection />;
      default:
        return <HeroSection onNavigate={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(234 179 8) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-yellow-900/10 via-transparent to-black/50 pointer-events-none" />

      {/* Navigation */}
      <Navigation 
        onNavigate={setCurrentSection} 
        currentSection={currentSection}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Server Info Widget */}
      <ServerInfoWidget />

      {/* Main Content */}
      <main className="relative z-10">
        {renderSection()}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-yellow-500/20 bg-black/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white mb-4">Sobre o Servidor</h3>
              <p className="text-gray-400 text-sm">
                Servidor privado de MeuMU Online Season 19-2-3 - Épico com experiência balanceada, eventos épicos e comunidade ativa desde 2024.
              </p>
            </div>
            <div>
              <h3 className="text-white mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Regras do Servidor</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Guia de Iniciante</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Sistema de Doação</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white mb-4">Comunidade</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Discord Oficial</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Grupo WhatsApp</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Fórum</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-yellow-500/20 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 MeuMU Online - Season 19-2-3 - Épico. Todos os direitos reservados. | Made with ❤️ by Figma Make
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}