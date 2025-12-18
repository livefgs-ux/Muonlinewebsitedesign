import { motion } from 'motion/react';
import { User, Search, Edit, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface SearchCharacterProps {
  onEditCharacter: (characterName: string) => void;
}

export function AdminSearchCharacter({ onEditCharacter }: SearchCharacterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a character name.');
      return;
    }

    // Validation: alphanumeric only
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(searchQuery)) {
      setErrorMessage('Invalid character name. Only alphanumeric characters are allowed.');
      return;
    }

    console.log('🔍 Searching for character:', searchQuery);
    
    // In production, this would check if character exists
    // For now, we'll just navigate to edit
    onEditCharacter(searchQuery);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-xl border border-violet-500/30">
          <User className="w-8 h-8 text-violet-400" />
        </div>
        <div>
          <h1 className="text-3xl text-white">Search Character</h1>
          <p className="text-violet-300/70 mt-1">
            Find and edit character information
          </p>
        </div>
      </motion.div>

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

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-violet-500/5 to-purple-600/5 border-violet-500/20 backdrop-blur-xl">
          <div className="p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Character Name:</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-obsidian/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="Enter character name..."
                    autoFocus
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Enter the exact character name (alphanumeric characters only)
                </p>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Edit className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl text-blue-200">Character Editor</h3>
            </div>
            <div className="text-blue-300/70 space-y-2 text-sm">
              <p className="font-medium text-blue-300">
                What you can edit:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Character class and level</li>
                <li>Resets and Grand Resets</li>
                <li>Zen (money) and Level-Up Points</li>
                <li>PK Level</li>
                <li>Stats (Strength, Dexterity, Vitality, Energy, Command)</li>
                <li>Master Level information (level, experience, points)</li>
              </ul>
              <p className="text-blue-400 mt-4">
                ⚠️ <strong>Important:</strong> Make sure the account is offline before editing character data!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
