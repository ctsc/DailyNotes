import React, { useState } from 'react';
import { Home, Calendar, Archive, Settings, Search, BookOpen } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const Sidebar = ({ currentView, onViewChange, onDateSelect, searchQuery, onSearchChange, entries }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
    onDateSelect(formatDate(date, 'iso'));
  };

  const handleSearch = (e) => {
    onSearchChange(e.target.value);
    if (e.target.value && currentView !== 'archive') {
      onViewChange('archive');
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Carter's Notes</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Personal Productivity</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes and tasks..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (item.id === 'home' && currentView === 'daily') ||
            (item.id === 'calendar' && (currentView === 'monthly' || currentView === 'yearly'));
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`nav-item w-full ${isActive ? 'nav-item-active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Date Picker */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Jump to Date
        </label>
        <input
          type="date"
          value={formatDate(selectedDate, 'iso')}
          onChange={handleDateChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Total Entries:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Object.keys(entries).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>This Week:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Object.keys(entries).filter(date => {
                const d = new Date(date);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return d >= weekAgo && d <= now;
              }).length}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;