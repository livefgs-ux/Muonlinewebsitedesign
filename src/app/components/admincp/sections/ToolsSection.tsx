/**
 * 🔧 TOOLS SECTION - Seção de Ferramentas Administrativas
 * 
 * Cor da Seção: Cyan (#06b6d4)
 * 
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Wrench, Trash2, Clock, Database as DatabaseIcon, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';

export function ToolsSection() {
  const [activeTab, setActiveTab] = useState('cache');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
          <Wrench className="size-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Administrative Tools</h2>
          <p className="text-gray-400 text-sm">
            System maintenance, cache management, and cron jobs
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black/60">
          <TabsTrigger value="cache" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Trash2 className="size-4 mr-2" />
            Cache Manager
          </TabsTrigger>
          <TabsTrigger value="cron" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Clock className="size-4 mr-2" />
            Cron Jobs
          </TabsTrigger>
          <TabsTrigger value="connection" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <DatabaseIcon className="size-4 mr-2" />
            Connection
          </TabsTrigger>
        </TabsList>

        {/* Cache Manager Tab */}
        <TabsContent value="cache" className="space-y-6">
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Cache Statistics</CardTitle>
              <CardDescription>Current cache status and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cache Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-black/40 border border-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Total Size</div>
                  <div className="text-2xl font-bold text-cyan-400">24.5 MB</div>
                </div>
                <div className="p-4 bg-black/40 border border-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Hit Rate</div>
                  <div className="text-2xl font-bold text-emerald-400">98.2%</div>
                </div>
                <div className="p-4 bg-black/40 border border-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Miss Rate</div>
                  <div className="text-2xl font-bold text-rose-400">1.8%</div>
                </div>
                <div className="p-4 bg-black/40 border border-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Entries</div>
                  <div className="text-2xl font-bold text-white">1,247</div>
                </div>
              </div>

              {/* Cache Types */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Cache Types</h3>
                {[
                  { name: 'Rankings', size: '8.2 MB', entries: 450 },
                  { name: 'News', size: '3.1 MB', entries: 120 },
                  { name: 'Server Stats', size: '2.4 MB', entries: 80 },
                  { name: 'Player Data', size: '6.5 MB', entries: 387 },
                  { name: 'Items', size: '3.8 MB', entries: 180 },
                  { name: 'Translations', size: '0.5 MB', entries: 30 }
                ].map((cache, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/40 border border-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{cache.name}</div>
                      <div className="text-xs text-gray-400">{cache.entries} entries</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                        {cache.size}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => console.log(`Clear ${cache.name} cache`)}
                      >
                        <Trash2 className="size-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-red-600 hover:bg-red-500">
                  <Trash2 className="size-4 mr-2" />
                  Clear All Cache
                </Button>
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-500">
                  <Activity className="size-4 mr-2" />
                  Warm Up Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cron Jobs Tab */}
        <TabsContent value="cron" className="space-y-6">
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Scheduled Tasks (Cron Jobs)</CardTitle>
              <CardDescription>Manage automated system tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Update Rankings', schedule: '*/5 * * * *', status: 'running', nextRun: '2 min' },
                  { name: 'Clean Expired Accounts', schedule: '0 2 * * *', status: 'idle', nextRun: '6 hours' },
                  { name: 'Database Backup', schedule: '0 3 * * *', status: 'idle', nextRun: '7 hours' },
                  { name: 'Clear Old Logs', schedule: '0 4 * * 0', status: 'idle', nextRun: '3 days' },
                  { name: 'Check Server Status', schedule: '* * * * *', status: 'running', nextRun: '30 sec' },
                  { name: 'Process Donations', schedule: '*/10 * * * *', status: 'idle', nextRun: '8 min' }
                ].map((job, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{job.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Schedule: <code className="text-cyan-400">{job.schedule}</code>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Next Run: {job.nextRun}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          job.status === 'running'
                            ? 'border-emerald-500/50 text-emerald-400'
                            : 'border-gray-500/50 text-gray-400'
                        }
                      >
                        {job.status === 'running' && (
                          <div className="size-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                        )}
                        {job.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Run Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connection Settings Tab */}
        <TabsContent value="connection" className="space-y-6">
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Database Connection Settings</CardTitle>
              <CardDescription>Configure MySQL/MariaDB connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold">Connection Status: Active</span>
                </div>
              </div>

              {/* Connection Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Host</div>
                  <div className="text-white font-mono">localhost</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Port</div>
                  <div className="text-white font-mono">3306</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Database</div>
                  <div className="text-white font-mono">muonline</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">User</div>
                  <div className="text-white font-mono">webuser</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Pool Size</div>
                  <div className="text-white font-mono">10 connections</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Charset</div>
                  <div className="text-white font-mono">utf8mb4</div>
                </div>
              </div>

              <Button className="w-full bg-cyan-600 hover:bg-cyan-500">
                <Activity className="size-4 mr-2" />
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
