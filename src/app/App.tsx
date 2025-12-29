import { useState, lazy, Suspense, useEffect } from 'react';
import { Navigation } from './components/navigation';
import { ServerInfoWidget } from './components/server-info-widget';
import { MusicProvider } from './contexts/music-context';
import { MusicPlayerWidget } from './components/music-player-widget';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSelector } from './components/language-selector';
import { NewsProvider } from './contexts/NewsContext';
import { SharedBackground } from './components/shared-background';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { Footer } from './components/footer';

// Lazy loading de componentes pesados
const HeroSection = lazy(() => import('./components/hero-section'));
// ❌ REMOVIDO - arquivo deletado, estava cheio de mocks
// const DashboardSection = lazy(() => import('./components/dashboard-section'));
const EventsSection = lazy(() => import('./components/events-section-real')); // ✅ USANDO API REAL
const RankingsSection = lazy(() => import('./components/rankings-section-real')); // ✅ USANDO API REAL
const DownloadsSection = lazy(() => import('./components/downloads-section'));
const NewsSection = lazy(() => import('./components/news-section'));
const LoginSection = lazy(() => import('./components/login-section'));
const PlayerDashboard = lazy(() => import('./components/player-dashboard'));
const AdminLogin = lazy(() => import('./components/admin-login'));
const AdminDashboard = lazy(() => import('./components/admin-dashboard'));
// Setup removido - não existe mais

// Skeleton loader component
const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-amber-400/80">Carregando...</p>
    </div>
  </div>
);

/**
 * MeuMU Online - Main Application
 * Season 19-2-3 - Épico
 * ⚡ OTIMIZADO para performance
 */

function AppContent() {
  const [currentSection, setCurrentSection] = useState('home');
  const { isLoggedIn, user, isLoading, logout: authLogout } = useAuth();  // ✅ PEGAR logout do context
  const isAdmin = user?.isAdmin || false;
  
  // 🔍 DEBUG: Log toda mudança de estado
  useEffect(() => {
    console.log('🔍 [App.tsx] Estado atualizado:', {
      currentSection,
      isLoggedIn,
      isLoading,
      user: user?.username || null
    });
  }, [currentSection, isLoggedIn, isLoading, user]);
  
  // Estado separado para AdminCP
  const [adminSession, setAdminSession] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleLoginSuccess = () => {
    // 🔥 REDIRECIONAR IMEDIATAMENTE
    console.log('✅ Login bem-sucedido! Redirecionando para dashboard...');
    setCurrentSection('dashboard');
  };
  
  // ❌ REMOVIDO - Estava causando redirecionamento prematuro
  // useEffect(() => {
  //   if (!isLoading && !isLoggedIn && currentSection === 'dashboard') {
  //     setCurrentSection('home');
  //   }
  // }, [isLoggedIn, currentSection, isLoading]);

  const handleLogout = () => {
    console.log('👋 [handleLogout] Fazendo logout...');
    authLogout();  // ✅ CHAMAR logout do AuthContext
    setCurrentSection('home');
  };
  
  const handleAdminLoginSuccess = (adminData: any) => {
    setAdminSession(adminData);
    setShowAdminPanel(true);
  };
  
  const handleAdminLogout = () => {
    setAdminSession(null);
    setShowAdminPanel(false);
    sessionStorage.removeItem('adminSession');
  };
  
  // 🛡️ Verificar sessão admin ao carregar
  useEffect(() => {
    const savedSession = sessionStorage.getItem('adminSession');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setAdminSession(parsed);
        setShowAdminPanel(true);
      } catch (error) {
        console.error('Erro ao carregar sessão admin:', error);
      }
    }
  }, []);
  
  // Se AdminCP estiver ativo, mostrar dashboard admin
  if (showAdminPanel && adminSession) {
    return (
      <Suspense fallback={<SectionLoader />}>
        <AdminDashboard 
          adminData={adminSession} 
          onLogout={handleAdminLogout} 
          onNavigate={(section) => {
            // Fechar AdminCP e navegar para a seção solicitada
            setShowAdminPanel(false);
            setAdminSession(null);
            setCurrentSection(section);
          }}
        />
      </Suspense>
    );
  }

  const renderSection = () => {
    console.log('🔍 [renderSection] Renderizando:', currentSection);
    
    switch (currentSection) {
      case 'home':
        return <HeroSection onNavigate={setCurrentSection} />;
      case 'dashboard':
        // ✅ PROTEÇÃO: Se não estiver logado, mostrar tela de login
        if (!isLoggedIn && !isLoading) {
          console.log('⚠️ [renderSection] Usuário não logado - mostrando LoginSection');
          return <LoginSection onLoginSuccess={handleLoginSuccess} />;
        }
        // Se estiver logado, mostrar dashboard
        return <PlayerDashboard onLogout={handleLogout} />;
      case 'admincp':
        // ========================================================================
        // 🛡️ ADMINCP - PROTEÇÃO WEBENGINE STYLE
        // ========================================================================
        // LÓGICA (baseada em codigo_de_comparacao.md, linha 26732):
        // 1. Se NÃO estiver logado → Redirect para login
        // 2. Se NÃO for admin (isAdmin = false) → Redirect para home
        // 3. Se for admin → Mostrar AdminDashboard
        // ========================================================================
        
        console.log('🛡️ [AdminCP] Verificando acesso...');
        console.log('🛡️ [AdminCP] isLoggedIn:', isLoggedIn);
        console.log('🛡️ [AdminCP] isAdmin:', isAdmin);
        console.log('🛡️ [AdminCP] user:', user);
        
        // Se não estiver logado, redirecionar para login
        if (!isLoggedIn && !isLoading) {
          console.log('❌ [AdminCP] Usuário não logado - redirecionando para login');
          setCurrentSection('dashboard'); // Redireciona para login
          return <LoginSection onLoginSuccess={handleLoginSuccess} />;
        }
        
        // Se estiver logado mas NÃO for admin, redirecionar para home
        if (isLoggedIn && !isAdmin) {
          console.log('❌ [AdminCP] Usuário não é admin - redirecionando para home');
          setCurrentSection('home');
          return <HeroSection onNavigate={setCurrentSection} />;
        }
        
        // Se for admin, mostrar AdminCP
        console.log('✅ [AdminCP] Acesso liberado - mostrando AdminDashboard');
        
        // Criar objeto adminData com todas as permissões necessárias
        const adminData = {
          user: {
            username: user?.username || 'admin',
            accountId: user?.accountId || 'admin',
            email: user?.email || 'admin@meumu.com',
            isAdmin: true,
            avatar: user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=FFB800&color=000000&bold=true`,
            role: 'Administrator',
            permissions: {
              viewAccounts: true,
              editAccounts: true,
              banUsers: true,
              editCharacters: true,
              manageCredits: true,
              publishNews: true,
              manageEvents: true,
              viewLogs: true,
              manageSettings: true,
              managePlugins: true
            }
          }
        };
        
        return (
          <AdminDashboard 
            adminData={adminData} 
            onLogout={() => {
              handleAdminLogout();
              handleLogout();
            }} 
            onNavigate={setCurrentSection}
          />
        );
      case 'events':
        return <EventsSection />;
      case 'rankings':
        return <RankingsSection />;
      case 'downloads':
        return <DownloadsSection />;
      case 'news':
        return <NewsSection />;
      case 'admin':
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      default:
        return <HeroSection onNavigate={setCurrentSection} />;
    }
  };

  return (
    <>
      {/* ⚠️ BACKGROUND UNIVERSAL - NUNCA REMOVER! ⚠️ */}
      <SharedBackground />
      
      <div className="min-h-screen relative flex flex-col">
        <Navigation 
          onNavigate={setCurrentSection} 
          currentSection={currentSection}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
        
        {/* Language Selector - Fixed top right */}
        <div className="fixed top-4 right-6 z-[110]">
          <LanguageSelector />
        </div>
        
        <div className="flex-1">
          <Suspense fallback={<SectionLoader />}>
            {renderSection()}
          </Suspense>
        </div>
        
        <Footer />
        
        <ServerInfoWidget currentSection={currentSection} />
        <MusicPlayerWidget currentSection={currentSection} />
      </div>
    </>
  );
}

export default function App() {
  // IMPORTANT: All providers wrap the entire app to ensure hooks work correctly
  return (
    <LanguageProvider>
      <NewsProvider>
        <MusicProvider>
          <AuthProvider>
            <PlayerProvider>
              <AppContent />
            </PlayerProvider>
          </AuthProvider>
        </MusicProvider>
      </NewsProvider>
    </LanguageProvider>
  );
}