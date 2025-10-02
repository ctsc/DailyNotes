// Date formatting helpers
export const formatDate = (date, format = 'full') => {
  const d = new Date(date);
  const options = {
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    short: { month: 'short', day: 'numeric' },
    iso: null,
  };

  if (format === 'iso') {
    return d.toISOString().split('T')[0];
  }

  return d.toLocaleDateString('en-US', options[format] || options.full);
};

export const formatTime = (date, format24h = false) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !format24h,
  });
};

export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

export const getWeekDates = (startDate = new Date(), startDay = 'monday') => {
  const dates = [];
  const current = new Date(startDate);
  
  // Adjust to start of week
  const day = current.getDay();
  const diff = startDay === 'monday' 
    ? (day === 0 ? -6 : 1 - day)
    : -day;
  
  current.setDate(current.getDate() + diff);
  
  // Get 7 days
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

export const getMonthDates = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates = [];
  
  // Add previous month days to fill first week
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    dates.push({ date, currentMonth: false });
  }
  
  // Add current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push({ date: new Date(year, month, i), currentMonth: true });
  }
  
  // Add next month days to fill last week
  const remaining = 42 - dates.length; // 6 weeks * 7 days
  for (let i = 1; i <= remaining; i++) {
    dates.push({ date: new Date(year, month + 1, i), currentMonth: false });
  }
  
  return dates;
};

export const getYearMonths = (year) => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push({
      name: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'long' }),
      index: i,
      date: new Date(year, i, 1),
    });
  }
  return months;
};

// Task helpers
export const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
};

export const getPriorityColor = (priority) => {
  const colors = {
    high: 'danger',
    medium: 'warning',
    low: 'success',
  };
  return colors[priority] || 'gray';
};

export const sortTasksByPriority = (tasks) => {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

// Search helpers
export const searchItems = (items, query, fields) => {
  if (!query) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerQuery);
      }
      return false;
    });
  });
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Export data
export const exportToJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Date range helpers
export const getDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

// Statistics helpers
export const calculateStats = (entries) => {
  const stats = {
    totalTasks: 0,
    completedTasks: 0,
    totalDays: 0,
    activeDays: 0,
    streak: 0,
    longestStreak: 0,
  };
  
  const sortedDates = Object.keys(entries).sort();
  let currentStreak = 0;
  let tempStreak = 0;
  
  sortedDates.forEach((date, index) => {
    const entry = entries[date];
    if (entry.tasks && entry.tasks.length > 0) {
      stats.totalTasks += entry.tasks.length;
      stats.completedTasks += entry.tasks.filter(t => t.completed).length;
      stats.activeDays++;
      
      // Calculate streak
      if (index === 0 || isConsecutiveDay(sortedDates[index - 1], date)) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      
      if (tempStreak > stats.longestStreak) {
        stats.longestStreak = tempStreak;
      }
      
      if (isToday(date) || isYesterday(date)) {
        currentStreak = tempStreak;
      }
    }
  });
  
  stats.totalDays = sortedDates.length;
  stats.streak = currentStreak;
  stats.completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;
  
  return stats;
};

const isConsecutiveDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

// Theme helpers
export const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
  if (theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};