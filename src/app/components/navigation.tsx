import { useState, memo, useMemo } from "react";
import {
  Menu,
  X,
  Swords,
  Trophy,
  Download,
  Users,
  Calendar,
  Shield,
  Newspaper,
  Crown,
} from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";

interface NavigationProps {
  onNavigate: (section: string) => void;
  currentSection: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  isAdmin?: boolean;
}

export const Navigation = memo(function Navigation({
  onNavigate,
  currentSection,
  isLoggedIn,
  onLogout,
  isAdmin = false,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = useMemo(
    () => [
      { id: "home", label: t("nav.home"), icon: Swords },
      {
        id: "dashboard",
        label: t("nav.dashboard"),
        icon: Users,
      },
      {
        id: "rankings",
        label: t("nav.rankings"),
        icon: Trophy,
      },
      { id: "events", label: t("nav.events"), icon: Calendar },
      {
        id: "downloads",
        label: t("nav.downloads"),
        icon: Download,
      },
      { id: "news", label: t("nav.news"), icon: Newspaper },
    ],
    [t],
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/50">
              <Swords className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-xl text-white">
                MeuMU{" "}
                <span className="text-yellow-500">Online</span>
              </h1>
              <p className="text-xs text-gray-400">
                Season 19-2-3 Epic Server
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentSection === item.id
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "text-gray-300 hover:text-yellow-500 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}

            {/* AdminCP Button - Only visible for admins */}
            {isAdmin && (
              <button
                onClick={() => onNavigate("admincp")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentSection === "admincp"
                    ? "bg-red-500/20 text-red-500 border border-red-500/50"
                    : "text-red-400 hover:text-red-500 hover:bg-red-500/10 border border-red-500/30"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>AdminCP</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            {/* AdminCP Button Mobile - Only visible for admins */}
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate("admincp");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${
                  currentSection === "admincp"
                    ? "bg-red-500/20 text-red-500 border-red-500/50"
                    : "text-red-400 hover:bg-red-500/10 border-red-500/30"
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>AdminCP</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});