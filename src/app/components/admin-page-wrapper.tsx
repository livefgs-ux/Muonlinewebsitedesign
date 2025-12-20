import { useState, useEffect } from 'react';
import { AdminLogin } from './admin-login';
import { AdminDashboard } from './admin-dashboard';
import { SharedBackground } from './shared-background';

/**
 * 🛡️ Admin Page Wrapper
 * Wrapper completo para gerenciar login e dashboard administrativo
 */

export function AdminPageWrapper() {
  const [adminSession, setAdminSession] = useState<any>(null);

  // Verificar sessão existente no carregamento
  useEffect(() => {
    const savedSession = sessionStorage.getItem('adminSession');
    if (savedSession) {
      try {
        setAdminSession(JSON.parse(savedSession));
      } catch (error) {
        console.error('Erro ao recuperar sessão admin:', error);
        sessionStorage.removeItem('adminSession');
      }
    }
  }, []);

  const handleLoginSuccess = (adminData: any) => {
    setAdminSession(adminData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSession');
    setAdminSession(null);
  };

  return (
    <>
      {/* Background compartilhado em todas as páginas */}
      <SharedBackground />
      
      {/* Renderizar login ou dashboard baseado na sessão */}
      <div className="relative z-10">
        {adminSession ? (
          <AdminDashboard 
            adminData={adminSession} 
            onLogout={handleLogout} 
          />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </>
  );
}
