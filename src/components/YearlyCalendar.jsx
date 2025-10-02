import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { getMonthDates, formatDate, calculateProgress } from '../utils/helpers';

const YearlyCalendar = ({ entries, onMonthSelect }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handlePreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const handleThisYear = () => {
    setCurrentYear(new Date().getFullYear());
  };

  const getActivityLevel = (dateStr) => {
    const entry = entries[dateStr];
    if (!entry || !entry.tasks || entry.tasks.length === 0) return 0;
    
    const progress = calculateProgress(entry.tasks);
    if (progress === 100) return 4;
    if (progress >= 75) return 3;
    if (progress >= 50) return 2;
    if (progress >= 25) return 1;
    return 1;
  };

  const activityColors = {
    0: 'bg-gray-100 dark:bg-gray-800',
    1: 'bg-primary-100 dark:bg-primary-900/20',
    2: 'bg-primary-300 dark:bg-primary-800/50',
    3: 'bg-primary-500 dark:bg-primary-600',
    4: 'bg-primary-700 dark:bg-primary-500',
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(currentYear, i, 1).toLocaleDateString('en-US', { month: 'long' }),
    index: i,
  }));

  const MiniMonth = ({ monthIndex }) => {
    const monthDates = getMonthDates(currentYear, monthIndex);
    
    return (
      <div className="space-y-1">
        {/* Mini day headers */}
        <div className="grid grid-cols-7 gap-0.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="text-[10px] text-center text-gray-500 dark:text-gray-500">
              {day}
            </div>
          ))}
        </div>
        {/* Mini calendar grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {monthDates.map(({ date, currentMonth }, idx) => {
            const dateStr = formatDate(date, 'iso');
            const activityLevel = getActivityLevel(dateStr);
            
            return (
              <div
                key={idx}
                className={`
                  aspect-square rounded-sm ${activityColors[activityLevel]}
                  ${!currentMonth ? 'opacity-30' : ''}
                  transition-all hover:scale-110 hover:z-10 cursor-pointer
                `}
                title={`${date.toLocaleDateString()} - Activity: ${activityLevel}`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // Calculate year statistics
  const yearStats = Object.entries(entries).reduce(
    (acc, [date, entry]) => {
      if (new Date(date).getFullYear() === currentYear) {
        acc.totalDays++;
        if (entry.tasks && entry.tasks.length > 0) {
          acc.activeDays++;
          acc.totalTasks += entry.tasks.length;
          acc.completedTasks += entry.tasks.filter(t => t.completed).length;
        }
      }
      return acc;
    },
    { totalDays: 0, activeDays: 0, totalTasks: 0, completedTasks: 0 }
  );

  const completionRate = yearStats.totalTasks > 0 
    ? Math.round((yearStats.completedTasks / yearStats.totalTasks) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentYear}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Yearly Activity Overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousYear}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Previous year"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleThisYear}
              className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              This Year
            </button>
            <button
              onClick={handleNextYear}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Next year"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Year Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {yearStats.activeDays}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Active Days
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {yearStats.totalTasks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Tasks
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-success-600 dark:text-success-400">
              {yearStats.completedTasks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completed
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {completionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completion Rate
            </div>
          </div>
        </div>
      </div>

      {/* Year Grid */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="grid grid-cols-4 gap-6">
          {months.map(({ name, index }) => (
            <button
              key={index}
              onClick={() => onMonthSelect(currentYear, index)}
              className="card card-hover text-left transition-all hover:scale-105"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {name}
              </h3>
              <MiniMonth monthIndex={index} />
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-6 text-sm">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Activity Level:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <span className="text-gray-600 dark:text-gray-400">None</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-100 dark:bg-primary-900/20" />
            <span className="text-gray-600 dark:text-gray-400">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-300 dark:bg-primary-800/50" />
            <span className="text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-500 dark:bg-primary-600" />
            <span className="text-gray-600 dark:text-gray-400">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-700 dark:bg-primary-500" />
            <span className="text-gray-600 dark:text-gray-400">Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyCalendar;