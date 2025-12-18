import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Save,
  AlertCircle,
  UserCog,
  Trash2,
  Plus,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface AdminAccount {
  username: string;
  accessLevel: number;
}

// Mock current logged admin
const CURRENT_ADMIN = 'Admin1';

// Mock admins data
const mockAdmins: AdminAccount[] = [
  { username: 'Admin1', accessLevel: 100 },
  { username: 'Admin2', accessLevel: 75 },
  { username: 'GameMaster1', accessLevel: 50 },
  { username: 'Moderator1', accessLevel: 25 },
];

export function AdminCPAccess() {
  const [admins, setAdmins] = useState<AdminAccount[]>(mockAdmins);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminAccessLevel, setNewAdminAccessLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validate username (AlphaNumeric)
  const validateUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(username);
  };

  // Validate username length (typically 4-10 characters for MU Online)
  const validateUsernameLength = (username: string): boolean => {
    return username.length >= 4 && username.length <= 10;
  };

  // Validate access level
  const validateAccessLevel = (level: number): boolean => {
    return !isNaN(level) && level >= 0 && level <= 100;
  };

  const handleAccessLevelChange = (username: string, value: string) => {
    const numValue = parseInt(value, 10);
    
    if (value === '' || (numValue >= 0 && numValue <= 100)) {
      setAdmins(
        admins.map((admin) =>
          admin.username === username
            ? { ...admin, accessLevel: value === '' ? 0 : numValue }
            : admin
        )
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validate existing admins
      for (const admin of admins) {
        if (!validateUsername(admin.username)) {
          throw new Error(`The username "${admin.username}" is not valid.`);
        }

        if (!validateUsernameLength(admin.username)) {
          throw new Error(`The username "${admin.username}" is not valid.`);
        }

        if (!validateAccessLevel(admin.accessLevel)) {
          throw new Error('Access level must be a number between 0 and 100');
        }

        // Check if trying to remove self
        if (admin.accessLevel === 0 && admin.username === CURRENT_ADMIN) {
          throw new Error('You cannot remove yourself.');
        }
      }

      // Validate new admin if provided
      if (newAdminUsername.trim()) {
        // Check if username already exists
        if (admins.some((admin) => admin.username === newAdminUsername)) {
          throw new Error('An administrator with the same username is already in the list.');
        }

        if (!validateUsername(newAdminUsername)) {
          throw new Error('The entered username is not valid (only letters and numbers allowed).');
        }

        if (!validateUsernameLength(newAdminUsername)) {
          throw new Error('The username must be between 4 and 10 characters.');
        }

        const newLevel = parseInt(newAdminAccessLevel, 10);
        
        if (!newAdminAccessLevel || isNaN(newLevel)) {
          throw new Error('Please enter an access level for the new admin.');
        }

        if (newLevel < 1 || newLevel > 100) {
          throw new Error('Access level must be a number between 1 and 100');
        }
      }

      setIsSubmitting(true);

      // Simulate saving to webengine.json
      setTimeout(() => {
        // Filter out admins with access level 0 (removed admins)
        let updatedAdmins = admins.filter((admin) => admin.accessLevel > 0);

        // Add new admin if provided
        if (newAdminUsername.trim() && newAdminAccessLevel) {
          updatedAdmins.push({
            username: newAdminUsername,
            accessLevel: parseInt(newAdminAccessLevel, 10),
          });
        }

        setAdmins(updatedAdmins);
        setNewAdminUsername('');
        setNewAdminAccessLevel('');
        setSuccess('Settings successfully saved!');
        setIsSubmitting(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }, 800);
    } catch (ex: any) {
      setError(ex.message);
      setIsSubmitting(false);
    }
  };

  if (admins.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl text-white mb-2">AdminCP Access</h1>
          <p className="text-gray-400">Manage administrator accounts and access levels</p>
        </div>

        <Card className="backdrop-blur-lg bg-red-500/10 border-red-500/30 p-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Admins list is empty.</p>
              <p className="text-sm mt-1">Please check your configuration file.</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">AdminCP Access</h1>
        <p className="text-gray-400">
          Manage administrator accounts and access levels
        </p>
      </div>

      {/* Info Alert */}
      <Card className="backdrop-blur-lg bg-blue-500/10 border-blue-500/30 p-4">
        <div className="flex items-start gap-3 text-blue-400">
          <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-1">Important Information:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>To remove an admin, set their access level to 0</li>
              <li>Access levels range from 0 to 100 (higher = more permissions)</li>
              <li>You cannot remove yourself from the admin list</li>
              <li>Changes will be saved to webengine.json configuration file</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Success Message */}
      {success && (
        <Card className="backdrop-blur-lg bg-green-500/10 border-green-500/30 p-4">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <p>{success}</p>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="backdrop-blur-lg bg-red-500/10 border-red-500/30 p-4">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Admin List Form */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-xl text-indigo-400 font-semibold">Administrator Accounts</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admins Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-indigo-500/30">
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                    Admin Account
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                    Access Level
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold w-24">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/20">
                {admins.map((admin) => (
                  <tr
                    key={admin.username}
                    className={`transition-all ${
                      admin.accessLevel === 0
                        ? 'bg-red-500/10 border-l-4 border-red-500'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <UserCog className="w-4 h-4 text-indigo-400" />
                        <span className="text-white font-medium">{admin.username}</span>
                        {admin.username === CURRENT_ADMIN && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/50">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={admin.accessLevel}
                        onChange={(e) =>
                          handleAccessLevelChange(admin.username, e.target.value)
                        }
                        className={`w-full max-w-[120px] px-3 py-2 bg-black/40 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                          admin.accessLevel === 0
                            ? 'border-red-500/50 focus:ring-red-500/50'
                            : 'border-indigo-500/30 focus:border-indigo-500 focus:ring-indigo-500/50'
                        }`}
                        required
                      />
                    </td>
                    <td className="py-3 px-4">
                      {admin.accessLevel === 0 ? (
                        <span className="flex items-center gap-1 text-red-400 text-sm">
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </span>
                      ) : (
                        <span className="text-green-400 text-sm">Active</span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Add New Admin Row */}
                <tr className="border-t-2 border-indigo-500/30 bg-indigo-500/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-green-400" />
                      <input
                        type="text"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        placeholder="username"
                        className="w-full max-w-[200px] px-3 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newAdminAccessLevel}
                      onChange={(e) => setNewAdminAccessLevel(e.target.value)}
                      placeholder="0"
                      className="w-full max-w-[120px] px-3 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-400 text-sm">New</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4 border-t border-indigo-500/30">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Settings
                </>
              )}
            </Button>

            <p className="text-gray-400 text-sm">
              {admins.filter((a) => a.accessLevel > 0).length} active admin(s)
            </p>
          </div>
        </form>
      </Card>

      {/* Access Level Guide */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2 text-sm text-gray-400">
            <p className="text-indigo-400 font-semibold">Access Level Guide:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs border border-red-500/50">
                  0
                </span>
                <span>Removed / No Access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs border border-orange-500/50">
                  1-25
                </span>
                <span>Moderator</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs border border-yellow-500/50">
                  26-50
                </span>
                <span>Game Master</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/50">
                  51-75
                </span>
                <span>Senior Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/50">
                  76-99
                </span>
                <span>Super Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs border border-purple-500/50">
                  100
                </span>
                <span>Owner / Full Access</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
