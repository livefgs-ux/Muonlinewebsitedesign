import { useState } from 'react';
import { Menu, X, Swords, Trophy, Download, Users, Calendar, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  onNavigate: (section: string) => void;
  currentSection: string;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navigation({ onNavigate, currentSection, isLoggedIn, onLogin, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: Swords },
    { id: 'dashboard', label: 'Dashboard', icon: Users },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'downloads', label: 'Downloads', icon: Download },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/50">
              <Swords className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-xl text-white">
                MeuMU <span className="text-yellow-500">Online</span>
              </h1>
              <p className="text-xs text-gray-400">Season 19-2-3 Epic Server</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentSection === item.id
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-500 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Login/Logout Button */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Button
                onClick={onLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/50 hover:shadow-red-600/70 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Deslogar
              </Button>
            ) : (
              <Button
                onClick={onLogin}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black shadow-lg shadow-yellow-500/50"
              >
                Entrar
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden backdrop-blur-lg bg-black/90 border-t border-yellow-500/20">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentSection === item.id
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            {isLoggedIn ? (
              <Button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Deslogar
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}