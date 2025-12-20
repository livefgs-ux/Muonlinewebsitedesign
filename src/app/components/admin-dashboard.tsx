import { useState, useMemo } from 'react';
import { 
  Crown, Shield, Users, Swords, TrendingUp, Calendar,
  Settings, Database, Lock, FileText, Award, Activity,
  Ban, CreditCard, UserCog, BarChart3, LogOut, Menu,
  X, ChevronRight, Search, Bell, UserCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { AdminCPLayout } from './admincp/AdminCPLayout';

interface AdminDashboardProps {
  adminData: any;
  onLogout: () => void;
  onNavigate?: (section: string) => void;
}

/**
 * 🛡️ AdminCP Dashboard - Painel de Controle Completo
 * Com dados MOCK realistas para testes
 */

export function AdminDashboard({ adminData, onLogout, onNavigate }: AdminDashboardProps) {
  // Usar o novo layout SPA
  return <AdminCPLayout adminData={adminData} onLogout={onLogout} onNavigate={onNavigate} />;
}

export default AdminDashboard;