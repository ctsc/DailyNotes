import React, { useState, useMemo } from 'react';
import { Archive as ArchiveIcon, Filter, Download, BarChart3, Calendar, CheckCircle2 } from 'lucide-react';
import { formatDate, calculateProgress, calculateStats, exportToJSON } from '../utils/helpers';

const Archive = ({ entries, onDateSelect, searchQuery }) => {
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, incomplete
  const [dateRange, setDateRange] = useState('all'); // all, week, month, year
  const [showStats, setShowStats] = useState(true);

  const stats = useMemo(() => calculateStats(entries), [entries]);

  const filteredEntries = useMemo(() => {
    let sortedDates = Object.keys(entries).sort((a, b) => new Date(b) - new Date(a));

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        week: 7,
        month: 30,
        year: 365,
      };
      const daysAgo = ranges[dateRange];
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      sortedDates = sortedDates.filter(date => new Date(date) >= cutoffDate);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      sortedDates = sortedDates.filter(date => {
        const entry = entries[date];
        const matchesTask = entry.tasks?.some(t => t.title.toLowerCase().includes(lowerQuery));
        const matchesNote = entry.notes?.toLowerCase().includes(lowerQuery);
        const matchesGoal = entry.goals?.some(g => g.title.toLowerCase().includes(lowerQuery));
        return matchesTask || matchesNote || matchesGoal;
      });
    }

    // Filter by status
    if (filterStatus !== 'all') {
      sortedDates = sortedDates.filter(date => {
        const entry = entries[date];
        if (!entry.tasks || entry.tasks.length === 0) return false;
        
        const progress = calculateProgress(entry.tasks);
        if (filterStatus === 'completed') return progress === 100;
        if (filterStatus === 'incomplete') return progress < 100;
        return true;
      });
    }

    return sortedDates.map(date => ({
      date,
      entry: entries[date],
    }));
  }, [entries, searchQuery, filterStatus, dateRange]);

  const handleExport = () => {
    const exportData = {
      entries: Object.fromEntries(
        filteredEntries.map(({ date, entry }) => [date, entry])
      ),
      stats,
      exportDate: new Date().toISOString(),
      filters: { status: filterStatus, range: dateRange, search: searchQuery },
    };
    exportToJSON(exportData, `archive-export-${Date.now()}.json`);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <ArchiveIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Archive & History
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredEntries.length} entries found
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                showStats 
                  ? 'bg-primary-600 text-white' 
                  : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Stats
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        {showStats && (
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.totalDays}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Total Days
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.activeDays}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Active Days
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                {stats.completedTasks}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Tasks Done
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                {stats.streak}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Current Streak
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.completionRate}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Completion Rate
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Filter className="w-5 h-5 text-gray-500" />
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
          >
            <option value="all">All Entries</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>

          {(dateRange !== 'all' || filterStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setDateRange('all');
                setFilterStatus('all');
              }}
              className="ml-auto text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-auto scrollbar-thin space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No entries found
            </p>
            <p className="text-gray-400 dark:text-gray-600 text-sm">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          filteredEntries.map(({ date, entry }) => {
            const tasks = entry.tasks || [];
            const progress = calculateProgress(tasks);
            
            return (
              <div
                key={date}
                onClick={() => onDateSelect(date)}
                className="card card-hover cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(new Date(date), 'full')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tasks.length} tasks • {entry.goals?.length || 0} goals
                    </p>
                  </div>
                  {progress === 100 && tasks.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Complete</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {tasks.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tasks Preview */}
                {tasks.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {tasks.slice(0, 3).map((task, idx) => (
                      <div key={idx} className="text-sm flex items-center gap-2">
                        <CheckCircle2 
                          className={`w-4 h-4 ${task.completed ? 'text-success-600' : 'text-gray-300 dark:text-gray-700'}`} 
                        />
                        <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                    {tasks.length > 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                        +{tasks.length - 3} more tasks
                      </p>
                    )}
                  </div>
                )}

                {/* Notes Preview */}
                {entry.notes && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {entry.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Archive;