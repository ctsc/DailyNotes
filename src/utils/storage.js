const { ipcRenderer } = window.require('electron');

class Storage {
  constructor() {
    this.cache = {};
  }

  async read(filename) {
    try {
      const data = await ipcRenderer.invoke('read-file', filename);
      if (data) {
        this.cache[filename] = data;
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return null;
    }
  }

  async write(filename, data) {
    try {
      this.cache[filename] = data;
      const result = await ipcRenderer.invoke('write-file', filename, data);
      return result.success;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }

  async backup() {
    try {
      const result = await ipcRenderer.invoke('backup-data');
      return result;
    } catch (error) {
      console.error('Error creating backup:', error);
      return { success: false, error: error.message };
    }
  }

  // Tasks
  async getTasks() {
    return await this.read('tasks.json') || [];
  }

  async saveTasks(tasks) {
    return await this.write('tasks.json', tasks);
  }

  // Notes
  async getNotes() {
    return await this.read('notes.json') || [];
  }

  async saveNotes(notes) {
    return await this.write('notes.json', notes);
  }

  // Goals
  async getGoals() {
    return await this.read('goals.json') || { weekly: [], monthly: [] };
  }

  async saveGoals(goals) {
    return await this.write('goals.json', goals);
  }

  // Settings
  async getSettings() {
    const defaultSettings = {
      theme: 'system',
      weekStartDay: 'monday',
      timeFormat: '12h',
      notifications: true,
      autoBackup: true,
      fontSize: 'medium',
    };
    const settings = await this.read('settings.json');
    return settings || defaultSettings;
  }

  async saveSettings(settings) {
    return await this.write('settings.json', settings);
  }

  // Daily entries (consolidates tasks, notes for a specific day)
  async getDailyEntry(date) {
    const entries = await this.read('daily-entries.json') || {};
    return entries[date] || {
      date,
      tasks: [],
      notes: '',
      goals: [],
      completed: false,
    };
  }

  async saveDailyEntry(date, entry) {
    const entries = await this.read('daily-entries.json') || {};
    entries[date] = entry;
    return await this.write('daily-entries.json', entries);
  }

  async getAllDailyEntries() {
    return await this.read('daily-entries.json') || {};
  }

  async saveDailyEntries(entries) {
    return await this.write('daily-entries.json', entries);
  }
}

export default new Storage();