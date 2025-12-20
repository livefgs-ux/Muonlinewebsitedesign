/**
 * Player Dashboard Wrapper
 * Importa e renderiza o novo componente PlayerDashboard da pasta player/
 */

import PlayerDashboard from './player/PlayerDashboard';

interface PlayerDashboardWrapperProps {
  onLogout?: () => void;
}

export function PlayerDashboard({ onLogout }: PlayerDashboardWrapperProps) {
  return <PlayerDashboard />;
}

export default PlayerDashboard;
