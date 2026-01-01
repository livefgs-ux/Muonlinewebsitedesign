/**
 * 💰 CREDITS SECTION - Seção de Gerenciamento de Créditos
 * 
 * Cor da Seção: Amber (#f59e0b)
 * 
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { DollarSign, Search, Plus, Minus, History, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';

export function CreditsSection() {
  const [activeTab, setActiveTab] = useState('manager');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
          <DollarSign className="size-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Credits & Payment Management</h2>
          <p className="text-gray-400 text-sm">
            Manage player credits, transactions, and payment settings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black/60">
          <TabsTrigger value="manager" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            <DollarSign className="size-4 mr-2" />
            Credit Manager
          </TabsTrigger>
          <TabsTrigger value="paypal" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            <History className="size-4 mr-2" />
            PayPal Donations
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            <SettingsIcon className="size-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Credit Manager Tab */}
        <TabsContent value="manager" className="space-y-6">
          <Card className="glass-card border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Credit Manager</CardTitle>
              <CardDescription>Add or remove credits from player accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Account */}
              <div className="space-y-2">
                <Label htmlFor="search-account">Search Account</Label>
                <div className="flex gap-2">
                  <Input
                    id="search-account"
                    placeholder="Enter username..."
                    className="bg-black/40 border-gray-700 text-white"
                  />
                  <Button className="bg-amber-600 hover:bg-amber-500 text-black">
                    <Search className="size-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Account Info (example) */}
              <div className="p-4 bg-black/40 border border-gray-700 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Username:</span>
                  <span className="text-white font-semibold">PlayerExample</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Credits:</span>
                  <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-lg">
                    1,250 Credits
                  </Badge>
                </div>
              </div>

              {/* Adjust Credits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-credits">Add Credits</Label>
                  <div className="flex gap-2">
                    <Input
                      id="add-credits"
                      type="number"
                      placeholder="Amount..."
                      className="bg-black/40 border-gray-700 text-white"
                    />
                    <Button className="bg-emerald-600 hover:bg-emerald-500">
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remove-credits">Remove Credits</Label>
                  <div className="flex gap-2">
                    <Input
                      id="remove-credits"
                      type="number"
                      placeholder="Amount..."
                      className="bg-black/40 border-gray-700 text-white"
                    />
                    <Button variant="destructive">
                      <Minus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Required)</Label>
                <Input
                  id="reason"
                  placeholder="Enter reason for adjustment..."
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="glass-card border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Recent Transactions</CardTitle>
              <CardDescription>Last 10 credit adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                Select an account to view transaction history
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PayPal Donations Tab */}
        <TabsContent value="paypal" className="space-y-6">
          <Card className="glass-card border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">PayPal Donations</CardTitle>
              <CardDescription>View and manage PayPal transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                No PayPal transactions found
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-card border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Credit System Settings</CardTitle>
              <CardDescription>Configure credit system and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Currency Name */}
              <div className="space-y-2">
                <Label htmlFor="currency-name">Currency Name</Label>
                <Input
                  id="currency-name"
                  defaultValue="Credits"
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>

              {/* Exchange Rate */}
              <div className="space-y-2">
                <Label htmlFor="exchange-rate">Exchange Rate (R$ per Credit)</Label>
                <Input
                  id="exchange-rate"
                  type="number"
                  step="0.01"
                  defaultValue="1.00"
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>

              {/* Min/Max Purchase */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-purchase">Min Purchase</Label>
                  <Input
                    id="min-purchase"
                    type="number"
                    defaultValue="10"
                    className="bg-black/40 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-purchase">Max Purchase</Label>
                  <Input
                    id="max-purchase"
                    type="number"
                    defaultValue="10000"
                    className="bg-black/40 border-gray-700 text-white"
                  />
                </div>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-500 text-black font-semibold">
                Save Settings
              </Button>
            </CardContent>
          </Card>

          {/* PayPal Settings */}
          <Card className="glass-card border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">PayPal Configuration</CardTitle>
              <CardDescription>Configure PayPal integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypal-client-id">Client ID</Label>
                <Input
                  id="paypal-client-id"
                  type="password"
                  placeholder="Enter PayPal Client ID..."
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal-secret">Secret Key</Label>
                <Input
                  id="paypal-secret"
                  type="password"
                  placeholder="Enter PayPal Secret..."
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal-email">PayPal Email</Label>
                <Input
                  id="paypal-email"
                  type="email"
                  placeholder="your-email@example.com"
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-500">
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
