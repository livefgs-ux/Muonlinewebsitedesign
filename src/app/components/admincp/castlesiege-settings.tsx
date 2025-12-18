import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Castle, CheckCircle, XCircle, Save, Calendar, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface CastleSiegeStage {
  title: string;
  start_day: string;
  start_time: string;
  end_day: string;
  end_time: string;
}

interface CastleSiegeConfig {
  active: number;
  hide_idle: number;
  live_data: number;
  show_castle_owner: number;
  show_castle_owner_alliance: number;
  show_battle_countdown: number;
  show_castle_information: number;
  show_current_stage: number;
  show_next_stage: number;
  show_battle_duration: number;
  show_registered_guilds: number;
  show_schedule: number;
  schedule_date_format: string;
  show_widget: number;
  stages: CastleSiegeStage[];
}

export function CastleSiegeSettings() {
  // Mock current configuration - would come from JSON file in production
  const [config, setConfig] = useState<CastleSiegeConfig>({
    active: 1,
    hide_idle: 0,
    live_data: 0,
    show_castle_owner: 1,
    show_castle_owner_alliance: 1,
    show_battle_countdown: 1,
    show_castle_information: 1,
    show_current_stage: 1,
    show_next_stage: 1,
    show_battle_duration: 1,
    show_registered_guilds: 1,
    show_schedule: 1,
    schedule_date_format: 'F j, Y, g:i a',
    show_widget: 1,
    stages: [
      {
        title: 'Registration Period',
        start_day: 'Monday',
        start_time: '00:00',
        end_day: 'Friday',
        end_time: '23:59',
      },
      {
        title: 'Idle Period',
        start_day: 'Saturday',
        start_time: '00:00',
        end_day: 'Saturday',
        end_time: '17:59',
      },
      {
        title: 'Castle Siege Battle',
        start_day: 'Saturday',
        start_time: '18:00',
        end_day: 'Saturday',
        end_time: '20:00',
      },
      {
        title: 'Idle Period',
        start_day: 'Saturday',
        start_time: '20:01',
        end_day: 'Sunday',
        end_time: '23:59',
      },
    ],
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const validateUnsignedNumber = (value: any): boolean => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    const formData = new FormData(e.currentTarget);

    try {
      console.log('💾 Saving Castle Siege Settings...');
      console.log('📄 JSON Path: configs/castlesiege.json');
      
      const newConfig: any = { ...config };

      // Validate setting_1 (active)
      const setting1 = formData.get('setting_1');
      if (!validateUnsignedNumber(setting1)) {
        throw new Error('Submitted setting is not valid (active)');
      }
      if (![0, 1].includes(Number(setting1))) {
        throw new Error('Submitted setting is not valid (active)');
      }
      newConfig.active = Number(setting1);

      // Validate setting_2 (hide_idle)
      const setting2 = formData.get('setting_2');
      if (!validateUnsignedNumber(setting2)) {
        throw new Error('Submitted setting is not valid (hide_idle)');
      }
      if (![0, 1].includes(Number(setting2))) {
        throw new Error('Submitted setting is not valid (hide_idle)');
      }
      newConfig.hide_idle = Number(setting2);

      // Validate setting_3 (live_data)
      const setting3 = formData.get('setting_3');
      if (!validateUnsignedNumber(setting3)) {
        throw new Error('Submitted setting is not valid (live_data)');
      }
      if (![0, 1].includes(Number(setting3))) {
        throw new Error('Submitted setting is not valid (live_data)');
      }
      newConfig.live_data = Number(setting3);

      // Validate setting_4 (show_castle_owner)
      const setting4 = formData.get('setting_4');
      if (!validateUnsignedNumber(setting4)) {
        throw new Error('Submitted setting is not valid (show_castle_owner)');
      }
      if (![0, 1].includes(Number(setting4))) {
        throw new Error('Submitted setting is not valid (show_castle_owner)');
      }
      newConfig.show_castle_owner = Number(setting4);

      // Validate setting_5 (show_castle_owner_alliance)
      const setting5 = formData.get('setting_5');
      if (!validateUnsignedNumber(setting5)) {
        throw new Error('Submitted setting is not valid (show_castle_owner_alliance)');
      }
      if (![0, 1].includes(Number(setting5))) {
        throw new Error('Submitted setting is not valid (show_castle_owner_alliance)');
      }
      newConfig.show_castle_owner_alliance = Number(setting5);

      // Validate setting_6 (show_battle_countdown)
      const setting6 = formData.get('setting_6');
      if (!validateUnsignedNumber(setting6)) {
        throw new Error('Submitted setting is not valid (show_battle_countdown)');
      }
      if (![0, 1].includes(Number(setting6))) {
        throw new Error('Submitted setting is not valid (show_battle_countdown)');
      }
      newConfig.show_battle_countdown = Number(setting6);

      // Validate setting_7 (show_castle_information)
      const setting7 = formData.get('setting_7');
      if (!validateUnsignedNumber(setting7)) {
        throw new Error('Submitted setting is not valid (show_castle_information)');
      }
      if (![0, 1].includes(Number(setting7))) {
        throw new Error('Submitted setting is not valid (show_castle_information)');
      }
      newConfig.show_castle_information = Number(setting7);

      // Validate setting_8 (show_current_stage)
      const setting8 = formData.get('setting_8');
      if (!validateUnsignedNumber(setting8)) {
        throw new Error('Submitted setting is not valid (show_current_stage)');
      }
      if (![0, 1].includes(Number(setting8))) {
        throw new Error('Submitted setting is not valid (show_current_stage)');
      }
      newConfig.show_current_stage = Number(setting8);

      // Validate setting_9 (show_next_stage)
      const setting9 = formData.get('setting_9');
      if (!validateUnsignedNumber(setting9)) {
        throw new Error('Submitted setting is not valid (show_next_stage)');
      }
      if (![0, 1].includes(Number(setting9))) {
        throw new Error('Submitted setting is not valid (show_next_stage)');
      }
      newConfig.show_next_stage = Number(setting9);

      // Validate setting_10 (show_battle_duration)
      const setting10 = formData.get('setting_10');
      if (!validateUnsignedNumber(setting10)) {
        throw new Error('Submitted setting is not valid (show_battle_duration)');
      }
      if (![0, 1].includes(Number(setting10))) {
        throw new Error('Submitted setting is not valid (show_battle_duration)');
      }
      newConfig.show_battle_duration = Number(setting10);

      // Validate setting_11 (show_registered_guilds)
      const setting11 = formData.get('setting_11');
      if (!validateUnsignedNumber(setting11)) {
        throw new Error('Submitted setting is not valid (show_registered_guilds)');
      }
      if (![0, 1].includes(Number(setting11))) {
        throw new Error('Submitted setting is not valid (show_registered_guilds)');
      }
      newConfig.show_registered_guilds = Number(setting11);

      // Validate setting_12 (show_schedule)
      const setting12 = formData.get('setting_12');
      if (!validateUnsignedNumber(setting12)) {
        throw new Error('Submitted setting is not valid (show_schedule)');
      }
      if (![0, 1].includes(Number(setting12))) {
        throw new Error('Submitted setting is not valid (show_schedule)');
      }
      newConfig.show_schedule = Number(setting12);

      // Validate setting_13 (schedule_date_format)
      const setting13 = formData.get('setting_13');
      if (!setting13) {
        throw new Error('Submitted setting is not valid (schedule_date_format)');
      }
      newConfig.schedule_date_format = String(setting13);

      // Validate setting_14 (show_widget)
      const setting14 = formData.get('setting_14');
      if (!validateUnsignedNumber(setting14)) {
        throw new Error('Submitted setting is not valid (show_widget)');
      }
      if (![0, 1].includes(Number(setting14))) {
        throw new Error('Submitted setting is not valid (show_widget)');
      }
      newConfig.show_widget = Number(setting14);

      // SCHEDULE VALIDATION
      const startDays = formData.getAll('setting_stage_startday[]');
      const startTimes = formData.getAll('setting_stage_starttime[]');
      const endDays = formData.getAll('setting_stage_endday[]');
      const endTimes = formData.getAll('setting_stage_endtime[]');

      if (startDays.length !== config.stages.length) {
        throw new Error('Schedule stages settings array size is not valid.');
      }
      if (startTimes.length !== config.stages.length) {
        throw new Error('Schedule stages settings array size is not valid.');
      }
      if (endDays.length !== config.stages.length) {
        throw new Error('Schedule stages settings array size is not valid.');
      }
      if (endTimes.length !== config.stages.length) {
        throw new Error('Schedule stages settings array size is not valid.');
      }

      // Update stages
      newConfig.stages = config.stages.map((stage, index) => ({
        ...stage,
        start_day: String(startDays[index]),
        start_time: String(startTimes[index]),
        end_day: String(endDays[index]),
        end_time: String(endTimes[index]),
      }));

      console.log('⚙️ Settings:', newConfig);
      console.log('✅ Settings saved successfully');

      // Update state
      setConfig(newConfig);

      setMessage({
        type: 'success',
        text: 'Settings successfully saved.',
      });
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setMessage({
        type: 'error',
        text: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Castle Siege Settings</h2>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {message.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl p-6 border ${
              message.type === 'success'
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50'
                : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border-green-500/50'
                    : 'bg-red-500/20 border-red-500/50'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    message.type === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Form */}
      <form onSubmit={handleSubmit}>
        {/* Main Settings Table */}
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden mb-6">
          <table className="w-full">
            <tbody>
              {/* Active */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Active</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enables or disabled the castle siege module.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_1"
                        value="1"
                        defaultChecked={config.active === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_1"
                        value="0"
                        defaultChecked={config.active === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Hide Idle */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Hide Idle</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the idle stages of castle siege will not be displayed.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="1"
                        defaultChecked={config.hide_idle === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="0"
                        defaultChecked={config.hide_idle === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Live Data */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Live Data</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, castle siege data will be loaded directly from the database and will bypass the cache system.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_3"
                        value="1"
                        defaultChecked={config.live_data === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_3"
                        value="0"
                        defaultChecked={config.live_data === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Castle Owner */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Castle Owner</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the castle owner.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_4"
                        value="1"
                        defaultChecked={config.show_castle_owner === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_4"
                        value="0"
                        defaultChecked={config.show_castle_owner === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Castle Owner Alliance */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Castle Owner Alliance</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the castle owner alliance guilds.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_5"
                        value="1"
                        defaultChecked={config.show_castle_owner_alliance === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_5"
                        value="0"
                        defaultChecked={config.show_castle_owner_alliance === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Battle Countdown */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Battle Countdown</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the castle siege battle countdown.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_6"
                        value="1"
                        defaultChecked={config.show_battle_countdown === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_6"
                        value="0"
                        defaultChecked={config.show_battle_countdown === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Castle Information */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Castle Information</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the castle information.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_7"
                        value="1"
                        defaultChecked={config.show_castle_information === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_7"
                        value="0"
                        defaultChecked={config.show_castle_information === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Current Stage */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Current Stage</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the current castle siege stage.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_8"
                        value="1"
                        defaultChecked={config.show_current_stage === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_8"
                        value="0"
                        defaultChecked={config.show_current_stage === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Next Stage */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Next Stage</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the next castle siege stage.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_9"
                        value="1"
                        defaultChecked={config.show_next_stage === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_9"
                        value="0"
                        defaultChecked={config.show_next_stage === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Battle Duration */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Battle Duration</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the castle siege battle duration. Duration of battle is calculated according to your castle siege schedule configurations.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_10"
                        value="1"
                        defaultChecked={config.show_battle_duration === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_10"
                        value="0"
                        defaultChecked={config.show_battle_duration === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Registered Guilds */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Registered Guilds</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the registered guilds and alliances.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_11"
                        value="1"
                        defaultChecked={config.show_registered_guilds === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_11"
                        value="0"
                        defaultChecked={config.show_registered_guilds === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Schedule */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Schedule</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the full castle siege schedule.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_12"
                        value="1"
                        defaultChecked={config.show_schedule === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_12"
                        value="0"
                        defaultChecked={config.show_schedule === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Schedule PHP Date Format */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Schedule PHP Date Format</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Documentation:<br />
                      <a 
                        href="https://www.php.net/manual/en/datetime.format.php#refsect1-datetime.format-parameters" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline"
                      >
                        https://www.php.net/manual/en/datetime.format.php#refsect1-datetime.format-parameters
                      </a>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_13"
                    defaultValue={config.schedule_date_format}
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Show Widget */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Widget</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Displays the castle siege information in your template's sidebar/header.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_14"
                        value="1"
                        defaultChecked={config.show_widget === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_14"
                        value="0"
                        defaultChecked={config.show_widget === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* Schedule Section */}
        <div className="mb-6">
          <h3 className="text-2xl text-white mb-4">Schedule</h3>
          <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50 bg-black/40">
                    <th className="px-6 py-3 text-left text-white font-medium">Stage</th>
                    <th className="px-6 py-3 text-left text-white font-medium">Start Day</th>
                    <th className="px-6 py-3 text-left text-white font-medium">Start Time</th>
                    <th className="px-6 py-3 text-left text-white font-medium">End Day</th>
                    <th className="px-6 py-3 text-left text-white font-medium">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {config.stages.map((stage, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{stage.title}</td>
                      <td className="px-6 py-4">
                        <select
                          name="setting_stage_startday[]"
                          defaultValue={stage.start_day}
                          className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                        >
                          {weekDays.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="setting_stage_starttime[]"
                          defaultValue={stage.start_time}
                          className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="setting_stage_endday[]"
                          defaultValue={stage.end_day}
                          className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                        >
                          {weekDays.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="setting_stage_endtime[]"
                          defaultValue={stage.end_time}
                          className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Submit Button */}
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr>
                <td colSpan={2} className="px-6 py-4 bg-black/20">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </form>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Castle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Castle Siege Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the Castle Siege module that displays castle siege information, schedule, and live data.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Active:</strong> Enable or disable the entire castle siege module</li>
              <li><strong>Hide Idle:</strong> Hide idle stages from display</li>
              <li><strong>Live Data:</strong> Load data directly from database (bypasses cache)</li>
              <li><strong>Show Options:</strong> Control what information is displayed to players</li>
              <li><strong>Schedule:</strong> Configure castle siege event timings and stages</li>
              <li><strong>Date Format:</strong> PHP date format for displaying schedule dates</li>
              <li><strong>Widget:</strong> Display castle siege info in sidebar/header</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">configs/castlesiege.json</code></li>
              <li>Example stages: Registration Period, Idle Period, Castle Siege Battle</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
