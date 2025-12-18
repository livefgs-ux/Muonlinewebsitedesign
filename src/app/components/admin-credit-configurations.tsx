import { motion } from 'motion/react';
import { DollarSign, Plus, Edit, Trash2, Database, Table, Columns, User, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface CreditConfig {
  config_id: number;
  config_title: string;
  config_database: 'MuOnline' | 'Me_MuOnline';
  config_table: string;
  config_credits_col: string;
  config_user_col: string;
  config_user_col_id: 'userid' | 'username' | 'email' | 'character';
  config_checkonline: boolean;
  config_display: boolean;
}

interface FormData {
  title: string;
  database: 'MuOnline' | 'Me_MuOnline';
  table: string;
  credits_column: string;
  user_column: string;
  user_column_id: 'userid' | 'username' | 'email' | 'character';
  checkonline: boolean;
  display: boolean;
}

export function AdminCreditConfigurations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Database settings (from webengine.json)
  const SQL_DB_NAME = 'MuOnline';
  const SQL_DB_2_NAME = 'Me_MuOnline';
  const SQL_USE_2_DB = true;

  // Mock data - in production, this would come from database
  const [configs, setConfigs] = useState<CreditConfig[]>([
    {
      config_id: 1,
      config_title: 'WCoin (Cash Credits)',
      config_database: 'Me_MuOnline',
      config_table: 'MEMB_CREDITS',
      config_credits_col: 'credits',
      config_user_col: 'memb___id',
      config_user_col_id: 'username',
      config_checkonline: true,
      config_display: true,
    },
    {
      config_id: 2,
      config_title: 'GoblinPoints',
      config_database: 'MuOnline',
      config_table: 'AccountCharacter',
      config_credits_col: 'GoblinPoint',
      config_user_col: 'Id',
      config_user_col_id: 'username',
      config_checkonline: false,
      config_display: true,
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    database: 'MuOnline',
    table: '',
    credits_column: '',
    user_column: '',
    user_column_id: 'userid',
    checkonline: true,
    display: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      database: 'MuOnline',
      table: '',
      credits_column: '',
      user_column: '',
      user_column_id: 'userid',
      checkonline: true,
      display: true,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Title is required.');
      return;
    }
    if (!formData.table.trim()) {
      setErrorMessage('Table is required.');
      return;
    }
    if (!formData.credits_column.trim()) {
      setErrorMessage('Credits Column is required.');
      return;
    }
    if (!formData.user_column.trim()) {
      setErrorMessage('User Column is required.');
      return;
    }

    setIsSubmitting(true);

    // Simulate: Save or update configuration
    setTimeout(() => {
      if (editingId !== null) {
        // Edit existing config
        console.log('💾 Editing Credit Configuration:', editingId);
        setConfigs(configs.map(config => 
          config.config_id === editingId
            ? {
                ...config,
                config_title: formData.title,
                config_database: formData.database,
                config_table: formData.table,
                config_credits_col: formData.credits_column,
                config_user_col: formData.user_column,
                config_user_col_id: formData.user_column_id,
                config_checkonline: formData.checkonline,
                config_display: formData.display,
              }
            : config
        ));
        setSuccessMessage('Configuration updated successfully!');
      } else {
        // Create new config
        console.log('💾 Creating New Credit Configuration:');
        const newConfig: CreditConfig = {
          config_id: Math.max(...configs.map(c => c.config_id), 0) + 1,
          config_title: formData.title,
          config_database: formData.database,
          config_table: formData.table,
          config_credits_col: formData.credits_column,
          config_user_col: formData.user_column,
          config_user_col_id: formData.user_column_id,
          config_checkonline: formData.checkonline,
          config_display: formData.display,
        };
        setConfigs([...configs, newConfig]);
        setSuccessMessage('Configuration created successfully!');
      }

      console.log('Form Data:', formData);

      resetForm();
      setShowSuccess(true);
      setIsSubmitting(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  const handleEdit = (config: CreditConfig) => {
    setFormData({
      title: config.config_title,
      database: config.config_database,
      table: config.config_table,
      credits_column: config.config_credits_col,
      user_column: config.config_user_col,
      user_column_id: config.config_user_col_id,
      checkonline: config.config_checkonline,
      display: config.config_display,
    });
    setEditingId(config.config_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (configId: number) => {
    const config = configs.find(c => c.config_id === configId);
    if (!config) return;

    if (!confirm(`Are you sure you want to delete the configuration "${config.config_title}"?`)) {
      return;
    }

    console.log('🗑️ Deleting Credit Configuration:', configId);
    setConfigs(configs.filter(c => c.config_id !== configId));
    
    setSuccessMessage('Configuration deleted successfully!');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    if (editingId === configId) {
      resetForm();
    }
  };

  const getDatabaseDisplayName = (dbName: string) => {
    return dbName === 'MuOnline' ? SQL_DB_NAME : SQL_DB_2_NAME;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-xl border border-yellow-500/30">
          <DollarSign className="w-8 h-8 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-3xl text-white">Credit Configurations</h1>
          <p className="text-yellow-300/70 mt-1">
            Configure credit systems for your server
          </p>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="text-green-300 font-medium">{successMessage}</div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="text-red-300 font-medium">{errorMessage}</div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${editingId !== null ? 'from-yellow-500/5 to-amber-600/5 border-yellow-500/20' : 'from-blue-500/5 to-indigo-600/5 border-blue-500/20'} backdrop-blur-xl`}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  {editingId !== null ? (
                    <>
                      <Edit className="w-6 h-6 text-yellow-400" />
                      <h2 className="text-xl text-yellow-200">Edit Configuration</h2>
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-blue-400" />
                      <h2 className="text-xl text-blue-200">New Configuration</h2>
                    </>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Title:</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-obsidian/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="e.g., WCoin (Cash Credits)"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Database */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Database:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="database"
                          checked={formData.database === 'MuOnline'}
                          onChange={() => setFormData({ ...formData, database: 'MuOnline' })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300">{SQL_DB_NAME}</span>
                      </label>
                      {SQL_USE_2_DB && (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="database"
                            checked={formData.database === 'Me_MuOnline'}
                            onChange={() => setFormData({ ...formData, database: 'Me_MuOnline' })}
                            className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                            disabled={isSubmitting}
                          />
                          <span className="text-gray-300">{SQL_DB_2_NAME}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Table:</label>
                    <input
                      type="text"
                      value={formData.table}
                      onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                      className="w-full bg-obsidian/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="e.g., MEMB_CREDITS"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Credits Column */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Credits Column:</label>
                    <input
                      type="text"
                      value={formData.credits_column}
                      onChange={(e) => setFormData({ ...formData, credits_column: e.target.value })}
                      className="w-full bg-obsidian/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="e.g., credits"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* User Column */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">User Column:</label>
                    <input
                      type="text"
                      value={formData.user_column}
                      onChange={(e) => setFormData({ ...formData, user_column: e.target.value })}
                      className="w-full bg-obsidian/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      placeholder="e.g., memb___id"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* User Identifier */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">User Identifier:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="user_column_id"
                          checked={formData.user_column_id === 'userid'}
                          onChange={() => setFormData({ ...formData, user_column_id: 'userid' })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300 text-sm">User ID</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="user_column_id"
                          checked={formData.user_column_id === 'username'}
                          onChange={() => setFormData({ ...formData, user_column_id: 'username' })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300 text-sm">Username</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="user_column_id"
                          checked={formData.user_column_id === 'email'}
                          onChange={() => setFormData({ ...formData, user_column_id: 'email' })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300 text-sm">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="user_column_id"
                          checked={formData.user_column_id === 'character'}
                          onChange={() => setFormData({ ...formData, user_column_id: 'character' })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300 text-sm">Character Name</span>
                      </label>
                    </div>
                  </div>

                  {/* Check Online Status */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Check Online Status:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="checkonline"
                          checked={formData.checkonline === true}
                          onChange={() => setFormData({ ...formData, checkonline: true })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300">Yes</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="checkonline"
                          checked={formData.checkonline === false}
                          onChange={() => setFormData({ ...formData, checkonline: false })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Display in My Account */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Display in My Account:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="display"
                          checked={formData.display === true}
                          onChange={() => setFormData({ ...formData, display: true })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300">Yes</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="display"
                          checked={formData.display === false}
                          onChange={() => setFormData({ ...formData, display: false })}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-gray-300">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 ${editingId !== null ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <span>{editingId !== null ? 'Update Configuration' : 'Save Configuration'}</span>
                      )}
                    </Button>
                    {editingId !== null && (
                      <Button
                        type="button"
                        onClick={resetForm}
                        disabled={isSubmitting}
                        variant="outline"
                        className="bg-gray-500/10 border-gray-500/30 text-gray-300 hover:bg-gray-500/20 hover:border-gray-500/50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Configurations List Column */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {configs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-yellow-500/5 to-amber-600/5 border-yellow-500/20 backdrop-blur-xl">
                  <div className="p-12 text-center">
                    <DollarSign className="w-16 h-16 text-yellow-400/30 mx-auto mb-4" />
                    <p className="text-yellow-300/50">You have not created any configuration.</p>
                  </div>
                </Card>
              </motion.div>
            ) : (
              configs.map((config, index) => (
                <motion.div
                  key={config.config_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="bg-gradient-to-br from-yellow-500/5 to-amber-600/5 border-yellow-500/20 backdrop-blur-xl">
                    <div className="p-4 border-b border-yellow-500/20 flex items-center justify-between">
                      <h3 className="text-lg text-yellow-200 font-medium">{config.config_title}</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(config)}
                          variant="outline"
                          className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 px-3 py-1 text-sm"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(config.config_id)}
                          variant="outline"
                          className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 px-3 py-1 text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-yellow-300/50 text-xs mb-1">Config ID</div>
                            <div className="text-yellow-200 font-mono">{config.config_id}</div>
                          </div>
                          <div>
                            <div className="text-yellow-300/50 text-xs mb-1">Database</div>
                            <div className="text-yellow-200 flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              {getDatabaseDisplayName(config.config_database)}
                            </div>
                          </div>
                          <div>
                            <div className="text-yellow-300/50 text-xs mb-1">Table</div>
                            <div className="text-yellow-200 flex items-center gap-2">
                              <Table className="w-4 h-4" />
                              {config.config_table}
                            </div>
                          </div>
                          <div>
                            <div className="text-yellow-300/50 text-xs mb-1">Credits Column</div>
                            <div className="text-yellow-200 flex items-center gap-2">
                              <Columns className="w-4 h-4" />
                              {config.config_credits_col}
                            </div>
                          </div>
                          <div>
                            <div className="text-yellow-300/50 text-xs mb-1">User Column</div>
                            <div className="text-yellow-200 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {config.config_user_col}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-yellow-300/50 text-xs mb-1">User Column Identifier</div>
                            <div className="text-yellow-200 capitalize">{config.config_user_col_id}</div>
                          </div>
                          <div>
                            <div className="text-yellow-300/50 text-xs mb-1">Online Check</div>
                            <div>
                              {config.config_checkonline ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                                  Yes
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-500/20 border border-gray-500/30 text-gray-400 text-xs">
                                  No
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-yellow-300/50 text-xs mb-1">Display in My Account</div>
                            <div>
                              {config.config_display ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                                  Yes
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-500/20 border border-gray-500/30 text-gray-400 text-xs">
                                  No
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
