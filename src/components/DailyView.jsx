import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, GripVertical, Target, FileText } from 'lucide-react';
import { formatDate, isToday, calculateProgress, generateId, sortTasksByPriority } from '../utils/helpers';
import ReactMarkdown from 'react-markdown';

const DailyView = ({ date, entry, onUpdate, onDateChange, settings }) => {
  const [tasks, setTasks] = useState(entry.tasks || []);
  const [notes, setNotes] = useState(entry.notes || '');
  const [goals, setGoals] = useState(entry.goals || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const taskInputRef = useRef(null);

  useEffect(() => {
    setTasks(entry.tasks || []);
    setNotes(entry.notes || '');
    setGoals(entry.goals || []);
  }, [entry]);

  useEffect(() => {
    const updatedEntry = { ...entry, tasks, notes, goals, date };
    onUpdate(updatedEntry);
  }, [tasks, notes, goals]);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: generateId(),
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    taskInputRef.current?.focus();
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskPriorityChange = (taskId, priority) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, priority } : task
    ));
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    const goal = {
      id: generateId(),
      title: newGoal,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setGoals([...goals, goal]);
    setNewGoal('');
  };

  const handleToggleGoal = (goalId) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handlePreviousDay = () => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    onDateChange(formatDate(prevDate, 'iso'));
  };

  const handleNextDay = () => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    onDateChange(formatDate(nextDate, 'iso'));
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.id === targetTask.id) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = tasks.findIndex(t => t.id === targetTask.id);

    const newTasks = [...tasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    setTasks(newTasks);
    setDraggedTask(null);
  };

  const sortedTasks = sortTasksByPriority(tasks);
  const progress = calculateProgress(tasks);
  const currentDate = new Date(date);

  return (
    <div className="h-full flex flex-col p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousDay}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatDate(currentDate, 'full')}
              </h2>
              {isToday(date) && (
                <span className="inline-block mt-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                  Today
                </span>
              )}
            </div>
            <button
              onClick={handleNextDay}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          {tasks.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tasks.filter(t => t.completed).length} / {tasks.length} tasks
                </div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {progress}%
                </div>
              </div>
              <div className="w-24 h-24">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="text-primary-600 dark:text-primary-400 transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 overflow-auto scrollbar-thin">
        {/* Tasks Section */}
        <div className="col-span-2 space-y-6">
          {/* Quick Add Task */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Task
            </h3>
            <div className="flex gap-2">
              <input
                ref={taskInputRef}
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="What needs to be done?"
                className="input flex-1"
              />
              <button
                onClick={handleAddTask}
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tasks ({tasks.length})
            </h3>
            {sortedTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                <p>No tasks for today</p>
                <p className="text-sm mt-1">Add your first task above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, task)}
                    className={`priority-${task.priority} p-3 rounded-lg flex items-start gap-3 cursor-move hover:shadow-md transition-all`}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="checkbox mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-gray-900 dark:text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </p>
                    </div>
                    <select
                      value={task.priority}
                      onChange={(e) => handleTaskPriorityChange(task.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-danger-600 hover:text-danger-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Notes
              </h3>
              <button
                onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {showMarkdownPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {showMarkdownPreview ? (
              <div className="prose dark:prose-invert max-w-none p-4 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px]">
                <ReactMarkdown>{notes || '*No notes yet*'}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here... Markdown supported!"
                className="input min-h-[200px] resize-y font-mono text-sm"
              />
            )}
          </div>
        </div>

        {/* Goals Section */}
        <div className="space-y-6">
          <div className="card sticky top-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Daily Goals
            </h3>
            <div className="space-y-3 mb-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => handleToggleGoal(goal.id)}
                    className="checkbox mt-0.5"
                  />
                  <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {goal.title}
                  </span>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-danger-600 hover:text-danger-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder="Add a goal..."
                className="input text-sm"
              />
              <button
                onClick={handleAddGoal}
                className="btn btn-secondary px-3"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView;