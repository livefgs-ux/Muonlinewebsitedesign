import { motion } from 'motion/react';
import { User, Save, AlertCircle, CheckCircle, ArrowLeft, Shield, Zap, Heart, Sparkles, Swords, TrendingUp, Coins } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface CharacterData {
  name: string;
  account: string;
  class: number;
  level: number;
  resets?: number;
  grand_resets?: number;
  zen: number;
  levelup_points: number;
  pk_level: number;
  strength: number;
  agility: number;
  vitality: number;
  energy: number;
  command: number;
  master_level?: number;
  master_exp?: number;
  master_next_exp?: number;
  master_points?: number;
}

interface CharacterClass {
  id: number;
  name: string;
  group: string;
}

interface EditCharacterProps {
  characterName: string;
  onBack: () => void;
}

export function AdminEditCharacter({ characterName, onBack }: EditCharacterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Character classes (Mu Online Season 19)
  const characterClasses: CharacterClass[] = [
    { id: 0, name: 'Dark Wizard', group: 'Wizard' },
    { id: 1, name: 'Soul Master', group: 'Wizard' },
    { id: 2, name: 'Grand Master', group: 'Wizard' },
    { id: 3, name: 'Soul Wizard', group: 'Wizard' },
    { id: 16, name: 'Dark Knight', group: 'Knight' },
    { id: 17, name: 'Blade Knight', group: 'Knight' },
    { id: 18, name: 'Blade Master', group: 'Knight' },
    { id: 19, name: 'Dragon Knight', group: 'Knight' },
    { id: 32, name: 'Fairy Elf', group: 'Elf' },
    { id: 33, name: 'Muse Elf', group: 'Elf' },
    { id: 34, name: 'High Elf', group: 'Elf' },
    { id: 35, name: 'Noble Elf', group: 'Elf' },
    { id: 48, name: 'Magic Gladiator', group: 'Magic Gladiator' },
    { id: 50, name: 'Duel Master', group: 'Magic Gladiator' },
    { id: 64, name: 'Dark Lord', group: 'Dark Lord' },
    { id: 66, name: 'Lord Emperor', group: 'Dark Lord' },
    { id: 80, name: 'Summoner', group: 'Summoner' },
    { id: 81, name: 'Bloody Summoner', group: 'Summoner' },
    { id: 82, name: 'Dimension Master', group: 'Summoner' },
    { id: 83, name: 'Dimension Summoner', group: 'Summoner' },
    { id: 96, name: 'Rage Fighter', group: 'Rage Fighter' },
    { id: 98, name: 'Fist Master', group: 'Rage Fighter' },
    { id: 112, name: 'Grow Lancer', group: 'Grow Lancer' },
    { id: 114, name: 'Mirage Lancer', group: 'Grow Lancer' },
    { id: 128, name: 'Rune Wizard', group: 'Rune Wizard' },
    { id: 130, name: 'Rune Spell Master', group: 'Rune Wizard' },
    { id: 144, name: 'Slayer', group: 'Slayer' },
    { id: 146, name: 'Royal Slayer', group: 'Slayer' },
    { id: 160, name: 'Gun Crusher', group: 'Gun Crusher' },
    { id: 162, name: 'Master Gun Crusher', group: 'Gun Crusher' },
    { id: 176, name: 'Light Wizard', group: 'Light Wizard' },
    { id: 178, name: 'Shine Wizard', group: 'Light Wizard' },
    { id: 192, name: 'Lemuria', group: 'Lemuria' },
    { id: 194, name: 'Ascendant Lemuria', group: 'Lemuria' },
    { id: 208, name: 'Illusion Knight', group: 'Illusion Knight' },
    { id: 210, name: 'Mirage Knight', group: 'Illusion Knight' },
  ];

  // Mock character data - in production, this would come from database
  const [formData, setFormData] = useState<CharacterData>({
    name: characterName,
    account: 'PlayerAccount',
    class: 18, // Blade Master
    level: 400,
    resets: 150,
    grand_resets: 10,
    zen: 2500000000,
    levelup_points: 520,
    pk_level: 3,
    strength: 1500,
    agility: 1200,
    vitality: 1000,
    energy: 800,
    command: 1300,
    master_level: 400,
    master_exp: 150000000,
    master_next_exp: 200000000,
    master_points: 125,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    const validateNumber = (value: any, fieldName: string) => {
      if (value === undefined || value === null || value === '') {
        setErrorMessage(`${fieldName} is required.`);
        return false;
      }
      if (isNaN(value) || value < 0) {
        setErrorMessage(`${fieldName} must be a valid positive number.`);
        return false;
      }
      return true;
    };

    if (!validateNumber(formData.class, 'Class')) return;
    if (!validateNumber(formData.level, 'Level')) return;
    if (formData.resets !== undefined && !validateNumber(formData.resets, 'Resets')) return;
    if (formData.grand_resets !== undefined && !validateNumber(formData.grand_resets, 'Grand Resets')) return;
    if (!validateNumber(formData.zen, 'Money')) return;
    if (!validateNumber(formData.levelup_points, 'Level-Up Points')) return;
    if (!validateNumber(formData.pk_level, 'PK Level')) return;
    if (!validateNumber(formData.strength, 'Strength')) return;
    if (!validateNumber(formData.agility, 'Dexterity')) return;
    if (!validateNumber(formData.vitality, 'Vitality')) return;
    if (!validateNumber(formData.energy, 'Energy')) return;
    if (!validateNumber(formData.command, 'Command')) return;

    if (formData.master_level !== undefined) {
      if (!validateNumber(formData.master_level, 'Master Level')) return;
      if (!validateNumber(formData.master_exp, 'Master Experience')) return;
      if (formData.master_next_exp !== undefined && !validateNumber(formData.master_next_exp, 'Next Experience')) return;
      if (!validateNumber(formData.master_points, 'Master Points')) return;
    }

    setIsSubmitting(true);

    // Simulate: Check if account is online
    const isAccountOnline = false; // Mock check
    if (isAccountOnline) {
      setErrorMessage('The account is currently online. Please wait until the player logs out.');
      setIsSubmitting(false);
      return;
    }

    // Simulate: Save character data
    setTimeout(() => {
      console.log('💾 Updating Character:', formData.name);
      console.log('Account:', formData.account);
      console.log('Class:', formData.class);
      console.log('Level:', formData.level);
      console.log('Resets:', formData.resets);
      console.log('Grand Resets:', formData.grand_resets);
      console.log('Zen:', formData.zen);
      console.log('Level-Up Points:', formData.levelup_points);
      console.log('PK Level:', formData.pk_level);
      console.log('Stats:', {
        STR: formData.strength,
        AGI: formData.agility,
        VIT: formData.vitality,
        ENE: formData.energy,
        CMD: formData.command,
      });
      console.log('Master Level:', {
        Level: formData.master_level,
        Exp: formData.master_exp,
        NextExp: formData.master_next_exp,
        Points: formData.master_points,
      });

      setShowSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  const getClassName = (classId: number) => {
    const charClass = characterClasses.find(c => c.id === classId);
    return charClass ? `${charClass.name} (${charClass.group})` : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl border border-purple-500/30">
            <User className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl text-white">
              Edit Character: <span className="text-purple-400">{formData.name}</span>
            </h1>
            <p className="text-purple-300/70 mt-1">
              Modify character statistics and attributes
            </p>
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-gray-500/10 border-gray-500/30 text-gray-300 hover:bg-gray-500/20 hover:border-gray-500/50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
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
            <div className="text-green-300 font-medium">Character updated successfully!</div>
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

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Common */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl text-blue-200">Common</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Account (readonly) */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Account:</label>
                      <div className="bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2">
                        <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                          {formData.account}
                        </a>
                      </div>
                    </div>

                    {/* Class */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Class:</label>
                      <select
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: parseInt(e.target.value) })}
                        className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        disabled={isSubmitting}
                      >
                        {characterClasses.map((charClass) => (
                          <option key={charClass.id} value={charClass.id}>
                            {charClass.name} ({charClass.group})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Level */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Level:</label>
                      <input
                        type="number"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Resets */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Resets:</label>
                      <input
                        type="number"
                        value={formData.resets}
                        onChange={(e) => setFormData({ ...formData, resets: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        min="0"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Grand Resets */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Grand Resets:</label>
                      <input
                        type="number"
                        value={formData.grand_resets}
                        onChange={(e) => setFormData({ ...formData, grand_resets: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        min="0"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Money (Zen) */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        Money:
                      </label>
                      <input
                        type="number"
                        value={formData.zen}
                        onChange={(e) => setFormData({ ...formData, zen: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Level-Up Points */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Level-Up Points:</label>
                      <input
                        type="number"
                        value={formData.levelup_points}
                        onChange={(e) => setFormData({ ...formData, levelup_points: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* PK Level */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">PK Level:</label>
                      <input
                        type="number"
                        value={formData.pk_level}
                        onChange={(e) => setFormData({ ...formData, pk_level: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Stats & Master Level */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/5 to-violet-600/5 border-purple-500/20 backdrop-blur-xl">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl text-purple-200">Stats</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Strength */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                        <Swords className="w-4 h-4 text-red-400" />
                        Strength:
                      </label>
                      <input
                        type="number"
                        value={formData.strength}
                        onChange={(e) => setFormData({ ...formData, strength: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Dexterity (Agility) */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Dexterity:
                      </label>
                      <input
                        type="number"
                        value={formData.agility}
                        onChange={(e) => setFormData({ ...formData, agility: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Vitality */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-green-400" />
                        Vitality:
                      </label>
                      <input
                        type="number"
                        value={formData.vitality}
                        onChange={(e) => setFormData({ ...formData, vitality: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Energy */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        Energy:
                      </label>
                      <input
                        type="number"
                        value={formData.energy}
                        onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Command */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        Command:
                      </label>
                      <input
                        type="number"
                        value={formData.command}
                        onChange={(e) => setFormData({ ...formData, command: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        min="0"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Master Level */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20 backdrop-blur-xl">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                    <h2 className="text-xl text-amber-200">Master Level</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Master Level */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Master Level:</label>
                      <input
                        type="number"
                        value={formData.master_level}
                        onChange={(e) => setFormData({ ...formData, master_level: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        min="0"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Experience:</label>
                      <input
                        type="number"
                        value={formData.master_exp}
                        onChange={(e) => setFormData({ ...formData, master_exp: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        min="0"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Next Experience */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Next Experience:</label>
                      <input
                        type="number"
                        value={formData.master_next_exp}
                        onChange={(e) => setFormData({ ...formData, master_next_exp: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        min="0"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Points */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Points:</label>
                      <input
                        type="number"
                        value={formData.master_points}
                        onChange={(e) => setFormData({ ...formData, master_points: parseInt(e.target.value) || 0 })}
                        className="w-full bg-obsidian/50 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        min="0"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Save className="w-6 h-6" />
                <span>Save Changes</span>
              </div>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
