import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WeeklyView from './components/WeeklyView';
import DailyView from './components/DailyView';
import MonthlyCalendar from './components/MonthlyCalendar';
import YearlyCalendar from './components/YearlyCalendar';
import Archive from './components/Archive';
import Settings from './components/Settings';
import storage from './utils/storage';
import { applyTheme, formatDate } from './utils/helpers';

const { ipcRenderer } = window.require('electron');

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'iso'));
  const [entries, setEntries] = useState({});
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
    setupEventListeners();
    
    return () => {
      cleanupEventListeners();
    };
  }, []);

  // Apply theme when settings change
  useEffect(() => {
    if (settings) {
      applyTheme(settings.theme);
    }
  }, [settings]);

  const loadData = async () => {
    try {
      const [loadedEntries, loadedSettings] = await Promise.all([
        storage.getAllDailyEntries(),
        storage.getSettings(),
      ]);
      
      setEntries(loadedEntries);
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupEventListeners = () => {
    ipcRenderer.on('menu-new-task', handleNewTask);
    ipcRenderer.on('menu-toggle-theme', handleToggleTheme);
    ipcRenderer.on('menu-navigate', (event, view) => setCurrentView(view));
    ipcRenderer.on('menu-export', handleExport);
  };

  const cleanupEventListeners = () => {
    ipcRenderer.removeAllListeners('menu-new-task');
    ipcRenderer.removeAllListeners('menu-toggle-theme');
    ipcRenderer.removeAllListeners('menu-navigate');
    ipcRenderer.removeAllListeners('menu-export');
  };

  const handleNewTask = () => {
    setCurrentView('daily');
    // Focus on task input will be handled by DailyView
  };

  const handleToggleTheme = async () => {
    if (!settings) return;
    
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    const newSettings = { ...settings, theme: nextTheme };
    setSettings(newSettings);
    await storage.saveSettings(newSettings);
  };

  const handleExport = async () => {
    const data = {
      entries,
      settings,
      exportDate: new Date().toISOString(),
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carters-notes-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateEntry = async (date, updatedEntry) => {
    const newEntries = { ...entries, [date]: updatedEntry };
    setEntries(newEntries);
    await storage.saveDailyEntries(newEntries);
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    await storage.saveSettings(newSettings);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentView('daily');
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your notes...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <WeeklyView
            entries={entries}
            onDateSelect={handleDateSelect}
            settings={settings}
          />
        );
      case 'daily':
        return (
          <DailyView
            date={selectedDate}
            entry={entries[selectedDate] || { date: selectedDate, tasks: [], notes: '', goals: [] }}
            onUpdate={(updatedEntry) => updateEntry(selectedDate, updatedEntry)}
            onDateChange={(newDate) => setSelectedDate(newDate)}
            settings={settings}
          />
        );
      case 'calendar':
      case 'monthly':
        return (
          <MonthlyCalendar
            entries={entries}
            onDateSelect={handleDateSelect}
            settings={settings}
            onViewChange={setCurrentView}
          />
        );
      case 'yearly':
        return (
          <YearlyCalendar
            entries={entries}
            onMonthSelect={(year, month) => {
              setCurrentView('monthly');
            }}
          />
        );
      case 'archive':
        return (
          <Archive
            entries={entries}
            onDateSelect={handleDateSelect}
            searchQuery={searchQuery}
          />
        );
      case 'settings':
        return (
          <Settings
            settings={settings}
            onUpdate={updateSettings}
            onBackup={() => storage.backup()}
          />
        );
      default:
        return <WeeklyView entries={entries} onDateSelect={handleDateSelect} settings={settings} />;
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onDateSelect={handleDateSelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        entries={entries}
      />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;