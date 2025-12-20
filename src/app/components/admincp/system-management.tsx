import { useState } from "react";
import { AdminDiagnostics } from "./admin-diagnostics";
import { AdminBackupManager } from "./admin-backup-manager";
import { AdminDbTest } from "./admin-db-test";
import { AdminLogViewer } from "./admin-log-viewer";
import { AdminSecurityAudit } from "./admin-security-audit";
import { AdminLiveDefense } from "./admin-live-defense";
import { AdminAdaptiveFirewall } from "./admin-adaptive-firewall";
import { AdminSecurityDashboard } from "./admin-security-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Activity, Database, FileText, TestTube, Shield, ShieldAlert, Brain, Sparkles } from "lucide-react";

export function SystemManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="w-full space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          System Management
        </h1>
        <p className="text-gray-400">
          Dashboard unificado, diagnósticos, backups, segurança e defesa com IA do sistema MU Online
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 bg-black/60 border border-[#FFB800]/20 p-1">
          <TabsTrigger 
            value="dashboard"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-200 data-[state=inactive]:text-slate-200"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </TabsTrigger>

          <TabsTrigger 
            value="diagnostics"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFB800] data-[state=active]:to-[#FF8800] data-[state=active]:text-black text-slate-200 data-[state=inactive]:text-slate-200"
          >
            <Activity className="w-4 h-4" />
            <span className="hidden md:inline">Diagnostics</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="backup"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFB800] data-[state=active]:to-[#FF8800] data-[state=active]:text-black text-slate-200 data-[state=inactive]:text-slate-200"
          >
            <Database className="w-4 h-4" />
            <span className="hidden md:inline">Backup</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="dbtest"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFB800] data-[state=active]:to-[#FF8800] data-[state=active]:text-black text-slate-200 data-[state=inactive]:text-slate-200"
          >
            <TestTube className="w-4 h-4" />
            <span className="hidden md:inline">DB Test</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="logs"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFB800] data-[state=active]:to-[#FF8800] data-[state=active]:text-black text-slate-200 data-[state=inactive]:text-slate-200"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Logs</span>
          </TabsTrigger>

          <TabsTrigger 
            value="security"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-200 data-[state=inactive]:text-slate-200"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>

          <TabsTrigger 
            value="defense"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white text-slate-200 data-[state=inactive]:text-slate-200"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden md:inline">Defense</span>
          </TabsTrigger>

          <TabsTrigger 
            value="adaptive"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-200 data-[state=inactive]:text-slate-200"
          >
            <Brain className="w-4 h-4" />
            <span className="hidden md:inline">AI Firewall</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="space-y-6">
            <AdminSecurityDashboard />
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <AdminDiagnostics />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <AdminBackupManager />
          </TabsContent>

          <TabsContent value="dbtest" className="space-y-6">
            <AdminDbTest />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <AdminLogViewer />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <AdminSecurityAudit />
          </TabsContent>

          <TabsContent value="defense" className="space-y-6">
            <AdminLiveDefense />
          </TabsContent>

          <TabsContent value="adaptive" className="space-y-6">
            <AdminAdaptiveFirewall />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}