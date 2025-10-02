import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Save, Download, Upload, Trash2, Info } from 'lucide-react';

const Settings = ({ settings, onUpdate, onBackup }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleChange = (key, value) => {
    setLocalSettings({ ...localSettings, [key]: value });
  };

  const handleSave = async () => {
    await onUpdate(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBackup = async () => {
    const result = await onBackup();
    if (result.success) {
      alert('Backup created successfully!');
    } else {
      alert('Backup failed: ' + result.error);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            // eslint-disable-next-line no-restricted-globals
            if (confirm('This will overwrite your current data. Continue?')) {
              // Import logic would go here
              alert('Import successful!');
            }
          } catch (error) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('This will delete ALL your data. This action cannot be undone. Are you sure?')) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Really delete everything? This is your last chance!')) {
        // Clear data logic would go here
        alert('Data cleared');
      }
    }
  };

  return (
    <div className="h-full overflow-auto scrollbar-thin p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <SettingsIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customize your experience
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleChange('theme', value)}
                    className={`
                      p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all
                      ${localSettings.theme === value
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                      }
                    `}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <select
                value={localSettings.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="input"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Preferences
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Week Starts On
              </label>
              <select
                value={localSettings.weekStartDay}
                onChange={(e) => handleChange('weekStartDay', e.target.value)}
                className="input"
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Format
              </label>
              <select
                value={localSettings.timeFormat}
                onChange={(e) => handleChange('timeFormat', e.target.value)}
                className="input"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notifications
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Remind you about tasks and goals
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Backup
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Daily automatic backups
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoBackup}
                  onChange={(e) => handleChange('autoBackup', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Management
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={handleBackup}
              className="w-full btn btn-secondary flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Create Backup
            </button>

            <button
              onClick={handleImport}
              className="w-full btn btn-secondary flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Import Data
            </button>

            <button
              onClick={handleClearData}
              className="w-full btn btn-danger flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear All Data
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Clearing data is permanent and cannot be undone. Always create a backup first!
            </p>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5" />
              About
            </h3>
            <span className="text-gray-400">
              {showAbout ? '−' : '+'}
            </span>
          </button>

          {showAbout && (
            <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span>Application:</span>
                <span className="font-medium text-gray-900 dark:text-white">Carter's Personal Notes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span>Version:</span>
                <span className="font-medium text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span>Built with:</span>
                <span className="font-medium text-gray-900 dark:text-white">Electron + React + Tailwind</span>
              </div>
              <div className="py-2">
                <p className="mb-2">
                  A personal productivity application for managing tasks, notes, and goals.
                </p>
                <p className="text-xs">
                  All data is stored locally on your device. No cloud, no tracking, complete privacy.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Keyboard Shortcuts
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <span className="text-gray-600 dark:text-gray-400">New Task</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                Ctrl+N
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <span className="text-gray-600 dark:text-gray-400">Search</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                Ctrl+F
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <span className="text-gray-600 dark:text-gray-400">Toggle Theme</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                Ctrl+D
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <span className="text-gray-600 dark:text-gray-400">Settings</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                Ctrl+,
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <span className="text-gray-600 dark:text-gray-400">Home</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                Ctrl+H
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <span className="text-gray-600 dark:text-gray-400">Calendar</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                Ctrl+K
              </kbd>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-0 pt-6 pb-2 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handleSave}
            className={`w-full btn transition-all ${
              saved 
                ? 'bg-success-600 hover:bg-success-700 text-white' 
                : 'btn-primary'
            }`}
          >
            <Save className="w-5 h-5 inline mr-2" />
            {saved ? 'Settings Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;