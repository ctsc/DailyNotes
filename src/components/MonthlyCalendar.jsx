import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getMonthDates, formatDate, isToday, calculateProgress } from '../utils/helpers';

const MonthlyCalendar = ({ entries, onDateSelect, settings, onViewChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDates = getMonthDates(year, month);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getActivityLevel = (dateStr) => {
    const entry = entries[dateStr];
    if (!entry || !entry.tasks || entry.tasks.length === 0) return 0;
    
    const progress = calculateProgress(entry.tasks);
    if (progress === 100) return 3;
    if (progress >= 50) return 2;
    return 1;
  };

  const activityColors = {
    0: 'bg-gray-100 dark:bg-gray-800',
    1: 'bg-primary-200 dark:bg-primary-900/40',
    2: 'bg-primary-400 dark:bg-primary-700',
    3: 'bg-primary-600 dark:bg-primary-500',
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <CalendarIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {monthName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monthly Calendar View
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Previous month"
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
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewChange('yearly')}
              className="ml-4 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Year View
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 flex-1">
          {monthDates.map(({ date, currentMonth }, idx) => {
            const dateStr = formatDate(date, 'iso');
            const entry = entries[dateStr] || {};
            const tasks = entry.tasks || [];
            const dayIsToday = isToday(date);
            const activityLevel = getActivityLevel(dateStr);
            const hasNotes = entry.notes && entry.notes.length > 0;

            return (
              <button
                key={idx}
                onClick={() => onDateSelect(dateStr)}
                className={`
                  card card-hover p-3 flex flex-col items-start cursor-pointer transition-all
                  ${!currentMonth ? 'opacity-40' : ''}
                  ${dayIsToday ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}
                `}
              >
                <div className={`
                  text-sm font-medium mb-2
                  ${dayIsToday ? 'text-primary-600 dark:text-primary-400' : currentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}
                `}>
                  {date.getDate()}
                </div>

                {/* Activity Indicator */}
                {activityLevel > 0 && (
                  <div className={`w-full h-1.5 rounded-full ${activityColors[activityLevel]} mb-2`} />
                )}

                {/* Task Count */}
                {tasks.length > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {tasks.filter(t => t.completed).length}/{tasks.length}
                    </span>
                  </div>
                )}

                {/* Notes Indicator */}
                {hasNotes && (
                  <div className="mt-auto pt-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" title="Has notes" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" />
            <span className="text-gray-600 dark:text-gray-400">No activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-200 dark:bg-primary-900/40" />
            <span className="text-gray-600 dark:text-gray-400">Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-400 dark:bg-primary-700" />
            <span className="text-gray-600 dark:text-gray-400">In progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-600 dark:bg-primary-500" />
            <span className="text-gray-600 dark:text-gray-400">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;