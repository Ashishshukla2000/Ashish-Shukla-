import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  Sliders, 
  Layers, 
  Calendar as CalendarIcon,
  CheckCircle2
} from 'lucide-react';
import { 
  TrackerMetric, 
  TodoItem, 
  DiaryEntry, 
  ThemePalette, 
  AppThemeConfig 
} from './types';
import { 
  getTodayDateString, 
  loadMetrics, 
  saveMetrics, 
  loadAllTracking, 
  saveAllTracking, 
  loadAllTodos, 
  saveAllTodos, 
  loadAllDiaries, 
  saveAllDiaries, 
  loadThemeConfig, 
  saveThemeConfig 
} from './utils/storage';
import { HeaderBar } from './components/HeaderBar';
import { HeroOverview3D } from './components/HeroOverview3D';
import { TrackerCard } from './components/TrackerCard';
import { TodoListSection } from './components/TodoListSection';
import { DiarySection } from './components/DiarySection';
import { InsightsSection } from './components/InsightsSection';
import { MetricEditorModal } from './components/MetricEditorModal';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [theme, setTheme] = useState<AppThemeConfig>(loadThemeConfig());
  const [metrics, setMetrics] = useState<TrackerMetric[]>(loadMetrics());
  const [allTracking, setAllTracking] = useState<Record<string, Record<string, any>>>(loadAllTracking());
  const [todos, setTodos] = useState<TodoItem[]>(loadAllTodos());
  const [allDiaries, setAllDiaries] = useState<Record<string, DiaryEntry>>(loadAllDiaries());
  
  const [activeTab, setActiveTab] = useState<'all' | 'trackers' | 'todos' | 'diary' | 'insights'>('all');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Sync state to storage
  useEffect(() => {
    saveMetrics(metrics);
  }, [metrics]);

  useEffect(() => {
    saveAllTracking(allTracking);
  }, [allTracking]);

  useEffect(() => {
    saveAllTodos(todos);
  }, [todos]);

  useEffect(() => {
    saveAllDiaries(allDiaries);
  }, [allDiaries]);

  useEffect(() => {
    saveThemeConfig(theme);
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Today's tracking slice
  const dayTracking = allTracking[selectedDate] || {};

  // Handlers for tracking
  const handleUpdateMetricValue = (metricId: string, newValue: number | boolean) => {
    const updatedDay = {
      ...dayTracking,
      [metricId]: newValue,
    };
    const nextAll = {
      ...allTracking,
      [selectedDate]: updatedDay,
    };
    setAllTracking(nextAll);
  };

  // Handlers for Todos
  const handleAddTodo = (text: string, priority: 'low' | 'medium' | 'high', category: string) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      text,
      completed: false,
      priority,
      category,
      date: selectedDate,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // Handlers for Diary
  const handleSaveDiaryEntry = (entry: DiaryEntry) => {
    const nextAll = {
      ...allDiaries,
      [selectedDate]: entry,
    };
    setAllDiaries(nextAll);
  };

  // Date Navigation
  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const prevStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDate(prevStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const nextStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDate(nextStr);
  };

  const handleGoToday = () => {
    setSelectedDate(getTodayDateString());
  };

  // Calculate Streak
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      const dayData = allTracking[key];
      const dayTodos = todos.filter((t) => t.date === key);

      const hasActivity = 
        (dayData && Object.keys(dayData).length > 0) ||
        dayTodos.some((t) => t.completed) ||
        allDiaries[key];

      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break; // streak broke
      }
    }
    return Math.max(1, streak);
  };

  const streakDays = calculateStreak();

  // Reload data after backup import
  const handleDataImported = () => {
    setMetrics(loadMetrics());
    setAllTracking(loadAllTracking());
    setTodos(loadAllTodos());
    setAllDiaries(loadAllDiaries());
    setTheme(loadThemeConfig());
  };

  // Palette Accent Glows
  const paletteGradients: Record<ThemePalette, string> = {
    cyan: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    purple: 'from-violet-500/10 via-purple-500/5 to-transparent',
    emerald: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    amber: 'from-amber-500/10 via-orange-500/5 to-transparent',
    rose: 'from-rose-500/10 via-pink-500/5 to-transparent',
  };

  return (
    <div
      className={`min-h-screen relative transition-colors duration-500 ${
        theme.isDark
          ? 'bg-[#090d16] text-slate-100'
          : 'bg-[#f8fafc] text-slate-800'
      }`}
    >
      {/* 3D Dynamic Ambient Light & Depth Canvas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className={`absolute top-[-15%] left-[10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-40 bg-gradient-to-br ${
            paletteGradients[theme.palette]
          }`}
        />
        <div
          className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] rounded-full blur-[150px] opacity-30"
          style={{
            background: theme.isDark
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, transparent 70%)',
          }}
        />
        {/* Subtle grid mesh for 3D depth */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Header & View Controls */}
        <HeaderBar
          isDark={theme.isDark}
          onToggleDark={() => setTheme((prev) => ({ ...prev, isDark: !prev.isDark }))}
          palette={theme.palette}
          onChangePalette={(p) => setTheme((prev) => ({ ...prev, palette: p }))}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onDataImported={handleDataImported}
        />

        {/* Big 3D Hero Overview & Day Navigation */}
        <HeroOverview3D
          selectedDate={selectedDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onToday={handleGoToday}
          onDateChange={setSelectedDate}
          metrics={metrics}
          trackingData={dayTracking}
          todos={todos}
          streakDays={streakDays}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          isDark={theme.isDark}
        />

        {/* Tab Content Display */}
        <main className="space-y-8 pb-16">
          {/* TAB: ALL IN ONE or TRACKERS */}
          {(activeTab === 'all' || activeTab === 'trackers') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-6 rounded-full bg-cyan-400" />
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                    Daily Habit & Metric Trackers
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomizerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition-all btn-3d"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Customize My Trackers
                </button>
              </div>

              {/* 3D Glossy Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {metrics.map((metric) => (
                  <TrackerCard
                    key={metric.id}
                    metric={metric}
                    value={dayTracking[metric.id]}
                    onChangeValue={handleUpdateMetricValue}
                    isDark={theme.isDark}
                  />
                ))}

                {/* Add New Quick Tracker Card */}
                <button
                  type="button"
                  onClick={() => setIsCustomizerOpen(true)}
                  className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all min-h-[220px] group ${
                    theme.isDark
                      ? 'border-white/15 hover:border-cyan-400/50 bg-white/[0.02] hover:bg-white/[0.05]'
                      : 'border-slate-300 hover:border-cyan-500 bg-white/40 hover:bg-white/70'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform shadow-md">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold group-hover:text-cyan-400 transition-colors">
                      Add Custom Tracker
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Counter, slider, rating, or checkbox
                    </p>
                  </div>
                </button>
              </div>
            </section>
          )}

          {/* TAB: ALL IN ONE or TODOS & DIARY GRID */}
          {activeTab === 'all' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <TodoListSection
                  todos={todos}
                  onAddTodo={handleAddTodo}
                  onToggleTodo={handleToggleTodo}
                  onDeleteTodo={handleDeleteTodo}
                  isDark={theme.isDark}
                  selectedDate={selectedDate}
                />
              </div>

              <div className="lg:col-span-7">
                <DiarySection
                  entry={allDiaries[selectedDate]}
                  onSaveEntry={handleSaveDiaryEntry}
                  isDark={theme.isDark}
                  selectedDate={selectedDate}
                  allDiaries={allDiaries}
                  onSelectDate={setSelectedDate}
                />
              </div>
            </div>
          )}

          {/* TAB: Dedicated TODOS */}
          {activeTab === 'todos' && (
            <div className="max-w-4xl mx-auto">
              <TodoListSection
                todos={todos}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                isDark={theme.isDark}
                selectedDate={selectedDate}
              />
            </div>
          )}

          {/* TAB: Dedicated DIARY */}
          {activeTab === 'diary' && (
            <div className="max-w-4xl mx-auto">
              <DiarySection
                entry={allDiaries[selectedDate]}
                onSaveEntry={handleSaveDiaryEntry}
                isDark={theme.isDark}
                selectedDate={selectedDate}
                allDiaries={allDiaries}
                onSelectDate={setSelectedDate}
              />
            </div>
          )}

          {/* TAB: Dedicated INSIGHTS */}
          {(activeTab === 'insights' || activeTab === 'all') && (
            <section className="mt-8">
              <InsightsSection
                metrics={metrics}
                allTracking={allTracking}
                todos={todos}
                allDiaries={allDiaries}
                isDark={theme.isDark}
              />
            </section>
          )}
        </main>
      </div>

      {/* Tracker Customization Modal */}
      <MetricEditorModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        metrics={metrics}
        onSaveMetrics={(updated) => setMetrics(updated)}
        isDark={theme.isDark}
      />
    </div>
  );
}
