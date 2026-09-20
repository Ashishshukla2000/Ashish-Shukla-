import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Award, Calendar, Flame, Smile, CheckCircle } from 'lucide-react';
import { TrackerMetric, TodoItem, DiaryEntry } from '../types';
import { GlassCard3D } from './GlassCard3D';

interface InsightsSectionProps {
  metrics: TrackerMetric[];
  allTracking: Record<string, Record<string, any>>;
  todos: TodoItem[];
  allDiaries: Record<string, DiaryEntry>;
  isDark: boolean;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  metrics,
  allTracking,
  todos,
  allDiaries,
  isDark,
}) => {
  // Generate last 7 days keys
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // Calculate habit completion for each day
  const weeklyStats = past7Days.map((dateKey) => {
    const dayData = allTracking[dateKey] || {};
    let completedCount = 0;
    metrics.forEach((m) => {
      const val = dayData[m.id];
      if (m.type === 'boolean' && val === true) completedCount++;
      else if (typeof val === 'number' && val >= m.targetGoal) completedCount++;
    });

    const dayTodos = todos.filter((t) => t.date === dateKey);
    const completedTodos = dayTodos.filter((t) => t.completed).length;

    const rate = metrics.length > 0 ? Math.round((completedCount / metrics.length) * 100) : 0;
    const dateObj = new Date(dateKey + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      date: dateKey,
      dayName,
      rate,
      completedHabits: completedCount,
      completedTodos,
      diaryMood: allDiaries[dateKey]?.mood,
    };
  });

  const totalDiaryWords = Object.values(allDiaries).reduce((acc, curr) => {
    return acc + (curr.content ? curr.content.trim().split(/\s+/).length : 0);
  }, 0);

  const averageCompletion = Math.round(
    weeklyStats.reduce((acc, curr) => acc + curr.rate, 0) / (weeklyStats.length || 1)
  );

  return (
    <GlassCard3D
      isDark={isDark}
      glowColor="rgba(139, 92, 246, 0.15)"
      className="p-6 md:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Weekly Performance & Trends</h2>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              Reflect on consistency, habits, and mindset across the last 7 days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            Avg: {averageCompletion}% Completed
          </div>
        </div>
      </div>

      {/* 7 Days Bar Chart with 3D Glossy Bars */}
      <div className="my-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Daily Habit Completion Rate (7 Days)
        </h4>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end p-4 rounded-2xl bg-black/20 border border-white/10">
          {weeklyStats.map((item) => (
            <div key={item.date} className="flex flex-col items-center h-full justify-end group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-cyan-300 mb-1 pointer-events-none">
                {item.rate}%
              </div>

              {/* 3D Glossy Bar */}
              <div className="w-full max-w-[36px] h-32 bg-white/5 rounded-xl p-1 flex flex-col justify-end relative overflow-hidden border border-white/10 shadow-inner">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.rate}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-full rounded-lg relative"
                  style={{
                    background:
                      item.rate >= 80
                        ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                        : item.rate >= 50
                        ? 'linear-gradient(180deg, #06b6d4 0%, #0284c7 100%)'
                        : 'linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%)',
                    boxShadow: item.rate > 0 ? '0 0 10px rgba(6, 182, 212, 0.4)' : 'none',
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-lg pointer-events-none" />
                </motion.div>
              </div>

              {/* Day Label */}
              <span className="text-[11px] font-semibold text-slate-400 mt-2">
                {item.dayName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Trackers Configured</div>
            <div className="text-lg font-bold text-white">{metrics.length} Custom Metrics</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Journal Words Recorded</div>
            <div className="text-lg font-bold text-white">{totalDiaryWords} Words</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Todo Tasks In Vault</div>
            <div className="text-lg font-bold text-white">{todos.length} Tasks</div>
          </div>
        </div>
      </div>
    </GlassCard3D>
  );
};
