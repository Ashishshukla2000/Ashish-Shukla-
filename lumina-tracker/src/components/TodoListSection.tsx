import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Plus, Check, Trash2, Calendar, Tag, AlertCircle, Sparkles } from 'lucide-react';
import { TodoItem } from '../types';
import { GlassCard3D } from './GlassCard3D';

interface TodoListSectionProps {
  todos: TodoItem[];
  onAddTodo: (text: string, priority: 'low' | 'medium' | 'high', category: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  isDark: boolean;
  selectedDate: string;
}

export const TodoListSection: React.FC<TodoListSectionProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  isDark,
  selectedDate,
}) => {
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Personal');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const categories = ['All', 'Work', 'Wellness', 'Fitness', 'Personal', 'Study'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter tasks for the selected date
  const dayTodos = todos.filter((t) => t.date === selectedDate);

  const filteredTodos = dayTodos.filter((t) => {
    if (filter === 'active' && t.completed) return false;
    if (filter === 'completed' && !t.completed) return false;
    if (selectedCategory !== 'All' && t.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    return true;
  });

  const completedCount = dayTodos.filter((t) => t.completed).length;
  const totalCount = dayTodos.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddTodo(inputText.trim(), priority, category);
    setInputText('');
  };

  const handleToggle = (id: string, wasCompleted: boolean) => {
    onToggleTodo(id);
    if (!wasCompleted) {
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // ignore
      }
    }
  };

  const priorityColors = {
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    low: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  };

  return (
    <GlassCard3D
      isDark={isDark}
      glowColor="rgba(56, 189, 248, 0.15)"
      className="p-6 md:p-8"
    >
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Today's Focus & Tasks</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Organize daily intentions, action items, and goals
          </p>
        </div>

        {/* 3D Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Completion</div>
            <div className="text-sm font-bold text-cyan-400">
              {completedCount} of {totalCount} ({completionPercent}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center relative bg-black/20 shadow-inner">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-white/10"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * completionPercent) / 100}
                className="text-cyan-400 transition-all duration-500 ease-out"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[11px] font-extrabold">{completionPercent}%</span>
          </div>
        </div>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleSubmit} className="mt-6 mb-6">
        <div
          className={`p-2 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900/60 border-white/15 focus-within:border-cyan-500/50 shadow-inner'
              : 'bg-white/80 border-slate-300 focus-within:border-cyan-500'
          }`}
        >
          <div className="flex items-center gap-3 px-3 py-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Add a new task, habit goal, or reminder..."
              className="w-full bg-transparent text-sm md:text-base focus:outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 px-3 pb-1 border-t border-white/5 text-xs">
            <div className="flex items-center gap-1 text-slate-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Priority:</span>
            </div>
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold tracking-wider transition-all ${
                  priority === p
                    ? `${priorityColors[p]} border shadow-sm`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {p}
              </button>
            ))}

            <div className="h-3 w-px bg-white/10 mx-1 hidden sm:block" />

            <div className="flex items-center gap-1 text-slate-400">
              <Tag className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`bg-transparent text-xs rounded-lg px-2 py-0.5 border border-white/10 focus:outline-none ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <option value="Work" className={isDark ? 'bg-slate-900 text-white' : ''}>Work</option>
              <option value="Wellness" className={isDark ? 'bg-slate-900 text-white' : ''}>Wellness</option>
              <option value="Fitness" className={isDark ? 'bg-slate-900 text-white' : ''}>Fitness</option>
              <option value="Personal" className={isDark ? 'bg-slate-900 text-white' : ''}>Personal</option>
              <option value="Study" className={isDark ? 'bg-slate-900 text-white' : ''}>Study</option>
            </select>
          </div>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/20 border border-white/10">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === tab
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List items with 3D glass look */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center rounded-2xl border border-dashed border-white/10 text-slate-400 text-sm"
            >
              No tasks found for this view. Add one above to kickstart your day!
            </motion.div>
          ) : (
            filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all group ${
                  todo.completed
                    ? 'opacity-60 bg-white/[0.02] border-white/5'
                    : isDark
                    ? 'bg-slate-800/40 border-white/10 hover:border-white/25 hover:bg-slate-800/60'
                    : 'bg-white/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* 3D Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggle(todo.id, todo.completed)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 shadow-md ${
                      todo.completed
                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                        : 'border border-white/30 hover:border-cyan-400 bg-white/5 hover:bg-cyan-500/10'
                    }`}
                  >
                    {todo.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-sm md:text-base block truncate transition-all ${
                        todo.completed ? 'line-through text-slate-500' : 'text-slate-100 font-medium'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase border ${priorityColors[todo.priority]}`}>
                        {todo.priority}
                      </span>
                      <span className="text-slate-400 px-2 py-0.5 rounded-md bg-white/5">
                        {todo.category}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteTodo(todo.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-2"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </GlassCard3D>
  );
};
