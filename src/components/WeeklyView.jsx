import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { getWeekDates, formatDate, isToday, calculateProgress } from '../utils/helpers';

const WeeklyView = ({ entries, onDateSelect, settings }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  
  const weekDates = getWeekDates(currentWeekStart, settings?.weekStartDay || 'monday');

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleToday = () => {
    setCurrentWeekStart(new Date());
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Weekly Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(weekDates[0], 'short')} - {formatDate(weekDates[6], 'short')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousWeek}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Previous week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Next week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-4 flex-1 overflow-auto scrollbar-thin">
        {weekDates.map((date) => {
          const dateStr = formatDate(date, 'iso');
          const entry = entries[dateStr] || { tasks: [], notes: '', goals: [] };
          const tasks = entry.tasks || [];
          const completedTasks = tasks.filter(t => t.completed).length;
          const progress = calculateProgress(tasks);
          const dayIsToday = isToday(date);

          return (
            <div
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={`card card-hover cursor-pointer flex flex-col transition-all ${
                dayIsToday ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
            >
              {/* Day Header */}
              <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className={`text-sm font-medium ${dayIsToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-2xl font-bold ${dayIsToday ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                  {date.getDate()}
                </div>
              </div>

              {/* Progress Bar */}
              {tasks.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {completedTasks}/{tasks.length} tasks
                    </span>
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Task Preview */}
              <div className="flex-1 space-y-2 overflow-hidden">
                {tasks.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 dark:text-gray-600 text-sm">
                    No tasks yet
                  </div>
                ) : (
                  tasks.slice(0, 3).map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-sm"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`line-clamp-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
                {tasks.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                    +{tasks.length - 3} more
                  </div>
                )}
              </div>

              {/* Notes Indicator */}
              {entry.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {entry.notes}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;