import { useState } from 'react';
import { Navigation } from './components/navigation';
import { HeroSection } from './components/hero-section';
import { DashboardSection } from './components/dashboard-section';
import { EventsSection } from './components/events-section';
import { RankingsSection } from './components/rankings-section';
import { DownloadsSection } from './components/downloads-section';
import { NewsSection } from './components/news-section';
import { ServerInfoWidget } from './components/server-info-widget';
import { AdminCP } from './components/admin-cp';
import { MusicProvider } from './contexts/music-context';
import { MusicPlayerWidget } from './components/music-player-widget';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSelector } from './components/language-selector';
import { NewsProvider } from './contexts/NewsContext';

export default function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Admin status - DEFAULT FALSE (só true quando admin logado)

  const handleLoginSuccess = (username: string) => {
    setIsLoggedIn(true);
    // Check if user is admin (in production, this would come from database)
    // For demo, let's say user 'admin' or 'lorack' has admin privileges
    if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'lorack') {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentSection('home');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HeroSection onNavigate={setCurrentSection} />;
      case 'dashboard':
        return <DashboardSection onLoginSuccess={handleLoginSuccess} isLoggedIn={isLoggedIn} onLogout={handleLogout} />;
      case 'admincp':
        return isAdmin ? <AdminCP /> : <HeroSection onNavigate={setCurrentSection} />;
      case 'events':
        return <EventsSection />;
      case 'rankings':
        return <RankingsSection />;
      case 'downloads':
        return <DownloadsSection />;
      case 'news':
        return <NewsSection />;
      default:
        return <HeroSection onNavigate={setCurrentSection} />;
    }
  };

  // IMPORTANT: All providers wrap the entire app to ensure hooks work correctly
  return (
    <LanguageProvider>
      <NewsProvider>
        <MusicProvider>
          <div className="min-h-screen bg-gradient-to-br from-obsidian via-obsidian-light to-obsidian">
            <Navigation 
              onNavigate={setCurrentSection} 
              currentSection={currentSection}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              onLogout={handleLogout}
            />
            
            {renderSection()}
            
            <ServerInfoWidget currentSection={currentSection} />
            <MusicPlayerWidget currentSection={currentSection} />
          </div>
        </MusicProvider>
      </NewsProvider>
    </LanguageProvider>
  );
}