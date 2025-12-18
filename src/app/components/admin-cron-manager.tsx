import { motion } from 'motion/react';
import { Clock, Plus, Play, RotateCcw, Power, PowerOff, Trash2, CheckCircle, AlertCircle, ExternalLink, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface CronJob {
  cron_id: number;
  cron_name: string;
  cron_file_run: string;
  cron_run_time: number; // in seconds
  cron_last_run: number | null; // timestamp
  cron_status: 0 | 1; // 0 = disabled, 1 = enabled
}

export function AdminCronManager() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Available cron files (from /cron directory)
  const availableCronFiles = [
    'rankings.php',
    'castle_war.php',
    'online_stats.php',
    'account_cleanup.php',
    'reset_rankings.php',
    'backup_database.php',
  ];

  // Common intervals
  const commonIntervals = {
    300: '5 Minutes',
    600: '10 Minutes',
    900: '15 Minutes',
    1800: '30 Minutes',
    3600: '1 Hour',
    7200: '2 Hours',
    21600: '6 Hours',
    43200: '12 Hours',
    86400: '24 Hours (1 Day)',
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    file: availableCronFiles[0],
    interval: 300,
  });

  // Mock cron jobs data - in production, this would come from database
  const [cronJobs, setCronJobs] = useState<CronJob[]>([
    {
      cron_id: 1,
      cron_name: 'Rankings Update',
      cron_file_run: 'rankings.php',
      cron_run_time: 300, // 5 minutes
      cron_last_run: Date.now() / 1000 - 180, // 3 mins ago
      cron_status: 1,
    },
    {
      cron_id: 2,
      cron_name: 'Castle War Stats',
      cron_file_run: 'castle_war.php',
      cron_run_time: 3600, // 1 hour
      cron_last_run: Date.now() / 1000 - 1800, // 30 mins ago
      cron_status: 1,
    },
    {
      cron_id: 3,
      cron_name: 'Online Statistics',
      cron_file_run: 'online_stats.php',
      cron_run_time: 600, // 10 minutes
      cron_last_run: null, // never run
      cron_status: 0,
    },
  ]);

  const CRON_API_URL = 'https://meumuonline.com/cron.php';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Cron name is required.');
      return;
    }

    setIsSubmitting(true);

    // Simulate: Add new cron job
    setTimeout(() => {
      console.log('➕ Adding New Cron Job:');
      console.log('Name:', formData.name);
      console.log('File:', formData.file);
      console.log('Interval:', formData.interval, 'seconds');

      const newCron: CronJob = {
        cron_id: Math.max(...cronJobs.map(c => c.cron_id), 0) + 1,
        cron_name: formData.name,
        cron_file_run: formData.file,
        cron_run_time: formData.interval,
        cron_last_run: null,
        cron_status: 1,
      };

      setCronJobs([...cronJobs, newCron]);

      // Reset form
      setFormData({
        name: '',
        file: availableCronFiles[0],
        interval: 300,
      });

      setSuccessMessage('Cron job added successfully!');
      setShowSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  const handleToggleStatus = (id: number) => {
    setCronJobs(cronJobs.map(cron => 
      cron.cron_id === id 
        ? { ...cron, cron_status: cron.cron_status === 1 ? 0 : 1 }
        : cron
    ));
    setSuccessMessage(`Cron job ${cronJobs.find(c => c.cron_id === id)?.cron_status === 1 ? 'disabled' : 'enabled'} successfully!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id: number) => {
    const cron = cronJobs.find(c => c.cron_id === id);
    if (!cron) return;

    if (!confirm(`Are you sure you want to delete the cron job "${cron.cron_name}"?`)) {
      return;
    }

    console.log('🗑️ Deleting Cron Job:', id);
    setCronJobs(cronJobs.filter(c => c.cron_id !== id));
    
    setSuccessMessage('Cron job deleted successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = (id: number) => {
    console.log('🔄 Resetting Cron Last Run:', id);
    setCronJobs(cronJobs.map(cron => 
      cron.cron_id === id 
        ? { ...cron, cron_last_run: null }
        : cron
    ));
    setSuccessMessage('Cron last run reset successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEnableAll = () => {
    console.log('✅ Enabling All Cron Jobs');
    setCronJobs(cronJobs.map(cron => ({ ...cron, cron_status: 1 })));
    setSuccessMessage('All cron jobs enabled successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDisableAll = () => {
    console.log('❌ Disabling All Cron Jobs');
    setCronJobs(cronJobs.map(cron => ({ ...cron, cron_status: 0 })));
    setSuccessMessage('All cron jobs disabled successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleResetAll = () => {
    console.log('🔄 Resetting All Cron Jobs');
    setCronJobs(cronJobs.map(cron => ({ ...cron, cron_last_run: null })));
    setSuccessMessage('All cron jobs reset successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleRunCron = (id: number) => {
    const url = `${CRON_API_URL}?id=${id}`;
    window.open(url, '_blank');
  };

  const secondsToHMS = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  const formatLastRun = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30">
          <Clock className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl text-white">Cron Job Manager</h1>
          <p className="text-cyan-300/70 mt-1">
            Manage automated tasks and scheduled jobs
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
        {/* Left Column - Form & Actions & Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Add New Cron Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Plus className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl text-blue-200">Add New Cron</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Name:</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="e.g., Rankings Update"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* File */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">File:</label>
                    <select
                      value={formData.file}
                      onChange={(e) => setFormData({ ...formData, file: e.target.value })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      disabled={isSubmitting}
                    >
                      {availableCronFiles.map((file) => (
                        <option key={file} value={file}>
                          {file}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Interval */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Repeat:</label>
                    <select
                      value={formData.interval}
                      onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      disabled={isSubmitting}
                    >
                      {Object.entries(commonIntervals).map(([seconds, description]) => (
                        <option key={seconds} value={seconds}>
                          {description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Adding...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Plus className="w-5 h-5" />
                          <span>Add Cron</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border-cyan-500/20 backdrop-blur-xl">
              <div className="p-6">
                <h3 className="text-lg text-cyan-200 mb-4">Actions:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleEnableAll}
                    variant="outline"
                    className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 text-sm px-3 py-1"
                  >
                    <Power className="w-4 h-4 mr-1" />
                    Enable All
                  </Button>
                  <Button
                    onClick={handleDisableAll}
                    variant="outline"
                    className="bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20 hover:border-gray-500/50 text-sm px-3 py-1"
                  >
                    <PowerOff className="w-4 h-4 mr-1" />
                    Disable All
                  </Button>
                  <Button
                    onClick={handleResetAll}
                    variant="outline"
                    className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 text-sm px-3 py-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset All
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Master Cron Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-yellow-500/5 to-amber-600/5 border-yellow-500/20 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg text-yellow-200">Setting up the master cron:</h3>
                </div>
                <div className="text-yellow-300/70 text-sm space-y-3">
                  <p>
                    WebEngine CMS' cron job system is designed to automatically run heavy tasks in the background. 
                    This helps to make sure the website always loads as fast as possible to all visitors.
                  </p>
                  <p className="text-yellow-300">
                    Please refer to the following link if your cron jobs are not being executed automatically:
                  </p>
                  <a
                    href="https://github.com/lautaroangelico/WebEngine/wiki/Setting-up-the-master-cron-job"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 underline"
                  >
                    WebEngine CMS Github Wiki
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Cron API Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-600/5 border-indigo-500/20 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ExternalLink className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-lg text-indigo-200">Cron Jobs API:</h3>
                </div>
                <div className="text-indigo-300/70 text-sm space-y-3">
                  <p>
                    If unable to set-up the master cron on your web server, you may alternatively use the cron job api 
                    along with a third-party service such as{' '}
                    <a
                      href="https://cron-job.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline"
                    >
                      cron-job.org
                    </a>{' '}
                    to execute your master cron.
                  </p>
                  <div>
                    <p className="text-indigo-300 mb-2">Cron API URL:</p>
                    <input
                      type="text"
                      value={CRON_API_URL}
                      readOnly
                      className="w-full bg-obsidian/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-indigo-300 text-sm font-mono cursor-not-allowed"
                      onClick={(e) => e.currentTarget.select()}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Cron Jobs Table */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border-cyan-500/20 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl text-cyan-200">Cron Jobs</h2>
                </div>

                {cronJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-cyan-400/30 mx-auto mb-4" />
                    <p className="text-cyan-300/50">No cron jobs configured.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-cyan-500/20">
                          <th className="text-left text-cyan-300/70 text-sm py-3 px-2">ID</th>
                          <th className="text-left text-cyan-300/70 text-sm py-3 px-2">Name</th>
                          <th className="text-left text-cyan-300/70 text-sm py-3 px-2">File</th>
                          <th className="text-left text-cyan-300/70 text-sm py-3 px-2">Repeat</th>
                          <th className="text-left text-cyan-300/70 text-sm py-3 px-2">Last Run</th>
                          <th className="text-left text-cyan-300/70 text-sm py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cronJobs.map((cron) => {
                          const interval = secondsToHMS(cron.cron_run_time);
                          return (
                            <tr
                              key={cron.cron_id}
                              className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
                            >
                              <td className="text-cyan-200 text-sm py-3 px-2 font-mono">{cron.cron_id}</td>
                              <td className="text-cyan-200 text-sm py-3 px-2">{cron.cron_name}</td>
                              <td className="text-cyan-200 text-sm py-3 px-2 font-mono">{cron.cron_file_run}</td>
                              <td className="text-cyan-200 text-sm py-3 px-2">
                                {interval.hours}h {interval.minutes}m
                              </td>
                              <td className="text-cyan-200 text-xs py-3 px-2">
                                {cron.cron_last_run ? (
                                  formatLastRun(cron.cron_last_run)
                                ) : (
                                  <span className="italic text-cyan-400/50">Never</span>
                                )}
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex gap-1">
                                  {/* Reset */}
                                  <Button
                                    onClick={() => handleReset(cron.cron_id)}
                                    variant="outline"
                                    className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 px-2 py-1 text-xs"
                                    title="Reset Last Run"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </Button>

                                  {/* Run */}
                                  <Button
                                    onClick={() => handleRunCron(cron.cron_id)}
                                    variant="outline"
                                    className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 px-2 py-1 text-xs"
                                    title="Run Now"
                                  >
                                    <Play className="w-3 h-3" />
                                  </Button>

                                  {/* Enable/Disable */}
                                  <Button
                                    onClick={() => handleToggleStatus(cron.cron_id)}
                                    variant="outline"
                                    className={`${
                                      cron.cron_status === 1
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50'
                                        : 'bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20 hover:border-gray-500/50'
                                    } px-2 py-1 text-xs`}
                                    title={cron.cron_status === 1 ? 'Enabled' : 'Disabled'}
                                  >
                                    {cron.cron_status === 1 ? (
                                      <Power className="w-3 h-3" />
                                    ) : (
                                      <PowerOff className="w-3 h-3" />
                                    )}
                                  </Button>

                                  {/* Delete */}
                                  <Button
                                    onClick={() => handleDelete(cron.cron_id)}
                                    variant="outline"
                                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 px-2 py-1 text-xs"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
