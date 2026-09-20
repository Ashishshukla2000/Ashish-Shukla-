import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Flame, 
  CheckCircle2, 
  Sliders, 
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { TrackerMetric, TodoItem } from '../types';
import { formatDateDisplay } from '../utils/storage';
import { GlassCard3D } from './GlassCard3D';

interface HeroOverview3DProps {
  selectedDate: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onDateChange: (date: string) => void;
  metrics: TrackerMetric[];
  trackingData: Record<string, any>;
  todos: TodoItem[];
  streakDays: number;
  onOpenCustomizer: () => void;
  isDark: boolean;
}

export const HeroOverview3D: React.FC<HeroOverview3DProps> = ({
  selectedDate,
  onPrevDay,
  onNextDay,
  onToday,
  onDateChange,
  metrics,
  trackingData,
  todos,
  streakDays,
  onOpenCustomizer,
  isDark,
}) => {
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Calculate habit progress
  let completedHabits = 0;
  metrics.forEach((m) => {
    const val = trackingData[m.id];
    if (m.type === 'boolean' && val === true) {
      completedHabits++;
    } else if (typeof val === 'number' && val >= m.targetGoal) {
      completedHabits++;
    }
  });

  const habitPercent = metrics.length > 0 ? Math.round((completedHabits / metrics.length) * 100) : 0;

  // Calculate todo progress
  const dayTodos = todos.filter((t) => t.date === selectedDate);
  const completedTodos = dayTodos.filter((t) => t.completed).length;
  const todoPercent = dayTodos.length > 0 ? Math.round((completedTodos / dayTodos.length) * 100) : 0;

  // Combined daily score
  const overallScore = Math.round(
    dayTodos.length > 0 ? (habitPercent * 0.6 + todoPercent * 0.4) : habitPercent
  );

  return (
    <div className="relative mb-8">
      {/* 3D Atmospheric Glowing Backdrop Spheres */}
      <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none -z-10" />

      <GlassCard3D
        isDark={isDark}
        glowColor="rgba(6, 182, 212, 0.25)"
        className="p-6 md:p-8"
        depth={16}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Date & Title & Day Controls */}
          <div className="flex-1 w-full text-center lg:text-left">
            {/* Date Navigator Bar */}
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-md mb-4 shadow-inner">
              <button
                type="button"
                onClick={onPrevDay}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors btn-3d"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-3">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className={`bg-transparent text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={onNextDay}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors btn-3d"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {!isToday && (
                <button
                  type="button"
                  onClick={onToday}
                  className="ml-1 px-3 py-1 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
                >
                  Go to Today
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xs uppercase tracking-widest font-extrabold text-cyan-400">
                  {formatDateDisplay(selectedDate)}
                </span>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Today
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Own Your Day, <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Your Way</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mt-1 mx-auto lg:mx-0">
                Track personal rituals, check off essential todos, and capture your state of mind in real-time.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-6">
              <button
                type="button"
                onClick={onOpenCustomizer}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md shadow-lg transition-all btn-3d"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                Customize Trackers ({metrics.length})
              </button>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold shadow-sm">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{streakDays} Day Streak</span>
              </div>
            </div>
          </div>

          {/* Right Column: Big 3D Radial Progress Globe & Highlights */}
          <div className="flex flex-col sm:flex-row items-center gap-6 flex-shrink-0">
            {/* 3D Big Glossy Orb Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer 3D glowing sphere shadow */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%)',
                }}
              />

              {/* Glossy 3D Ring SVG */}
              <svg className="w-36 h-36 -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-white/10"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="url(#gradient-ring)"
                  strokeWidth="8"
                  strokeDasharray={351}
                  strokeDashoffset={351 - (351 * overallScore) / 100}
                  className="transition-all duration-700 ease-out"
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center 3D Glass Pill with Score */}
              <div className="absolute inset-4 rounded-full flex flex-col items-center justify-center backdrop-blur-md bg-black/40 border border-white/20 shadow-inner">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  {overallScore}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Daily Score
                </span>
              </div>
            </div>

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 w-full sm:w-44">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Habits Done</div>
                  <div className="text-sm font-bold">
                    {completedHabits} / {metrics.length}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Tasks Closed</div>
                  <div className="text-sm font-bold">
                    {completedTodos} / {dayTodos.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard3D>
    </div>
  );
};
