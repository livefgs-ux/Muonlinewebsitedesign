/**
 * Player Dashboard Wrapper
 * Importa e renderiza o novo componente PlayerDashboard da pasta player/
 */

import PlayerDashboardComponent from './player/PlayerDashboard';

interface PlayerDashboardWrapperProps {
  onLogout?: () => void;
}

export function PlayerDashboard({ onLogout }: PlayerDashboardWrapperProps) {
  return <PlayerDashboardComponent onLogout={onLogout} />;
}

export default PlayerDashboard;
