import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Minus, Plus, Check, Play, Pause, RotateCcw, Star } from 'lucide-react';
import { TrackerMetric } from '../types';
import { GlassCard3D } from './GlassCard3D';
import { DynamicIcon } from './DynamicIcon';

interface TrackerCardProps {
  metric: TrackerMetric;
  value: number | boolean | undefined;
  onChangeValue: (metricId: string, newValue: number | boolean) => void;
  isDark: boolean;
}

export const TrackerCard: React.FC<TrackerCardProps> = ({
  metric,
  value,
  onChangeValue,
  isDark,
}) => {
  const [timerActive, setTimerActive] = useState(false);

  // Normalize values
  const numValue = typeof value === 'number' ? value : 0;
  const boolValue = typeof value === 'boolean' ? value : false;

  // Percentage towards target
  let progress = 0;
  if (metric.type === 'boolean') {
    progress = boolValue ? 100 : 0;
  } else if (metric.targetGoal > 0) {
    progress = Math.min(100, Math.round((numValue / metric.targetGoal) * 100));
  }

  const isCompleted = progress >= 100;

  // Trigger celebration on completion
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: [metric.color, '#38bdf8', '#fbbf24', '#f472b6'],
      });
    } catch {
      // ignore
    }
  };

  // Timer runner for timer-type metrics
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        const nextVal = (typeof value === 'number' ? value : 0) + 1;
        onChangeValue(metric.id, nextVal);
      }, 60000); // add 1 min per minute
    }
    return () => clearInterval(interval);
  }, [timerActive, value, metric.id, onChangeValue]);

  const handleIncrement = (amount = 1) => {
    const nextVal = Math.max(0, numValue + amount);
    onChangeValue(metric.id, nextVal);
    if (nextVal >= metric.targetGoal && numValue < metric.targetGoal) {
      triggerCelebration();
    }
  };

  const handleDecrement = (amount = 1) => {
    const nextVal = Math.max(0, numValue - amount);
    onChangeValue(metric.id, nextVal);
  };

  const handleToggleBool = () => {
    const next = !boolValue;
    onChangeValue(metric.id, next);
    if (next) triggerCelebration();
  };

  return (
    <GlassCard3D
      isDark={isDark}
      glowColor={`${metric.color}25`}
      className="p-5 flex flex-col justify-between h-full group"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden"
              style={{
                backgroundColor: `${metric.color}20`,
                color: metric.color,
                border: `1px solid ${metric.color}50`,
                boxShadow: `0 8px 16px -4px ${metric.color}40`,
              }}
            >
              {/* Glossy highlight inside icon badge */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 pointer-events-none rounded-t-2xl" />
              <DynamicIcon name={metric.icon} className="w-6 h-6 drop-shadow-sm relative z-10" />
            </div>

            <div>
              <h3 className="font-bold text-base leading-tight tracking-tight">{metric.name}</h3>
              {metric.description && (
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{metric.description}</p>
              )}
            </div>
          </div>

          {/* Goal pill */}
          <div
            className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-white/10 text-slate-400 border border-white/10'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5" /> Done
              </>
            ) : (
              <>
                {progress}%
              </>
            )}
          </div>
        </div>

        {/* Big 3D Metric Stat Display */}
        <div className="my-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: metric.color }}
            >
              {metric.type === 'boolean' ? (boolValue ? 'Completed' : 'Pending') : numValue}
            </span>
            {metric.type !== 'boolean' && metric.unit && (
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {metric.unit}
              </span>
            )}
          </div>
          {metric.type !== 'boolean' && (
            <span className="text-xs text-slate-400">
              Goal: <strong className="text-slate-200">{metric.targetGoal} {metric.unit || ''}</strong>
            </span>
          )}
        </div>

        {/* 3D Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-black/30 border border-white/10 overflow-hidden relative p-0.5 shadow-inner mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="h-full rounded-full relative"
            style={{
              background: `linear-gradient(90deg, ${metric.color}90 0%, ${metric.color} 100%)`,
              boxShadow: `0 0 12px ${metric.color}80`,
            }}
          >
            {/* Glossy top stripe */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40 rounded-t-full pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Interactive Controls based on Type */}
      <div className="pt-2">
        {metric.type === 'counter' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecrement(metric.step || 1)}
              className="flex-1 py-2.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-slate-300 hover:text-white shadow-md btn-3d"
              title="Decrease"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleIncrement(metric.step || 1)}
              style={{
                background: `linear-gradient(135deg, ${metric.color}cc, ${metric.color})`,
                boxShadow: `0 4px 14px -2px ${metric.color}60`,
              }}
              className="flex-[2] py-2.5 rounded-xl font-semibold text-white active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg btn-3d"
            >
              <Plus className="w-4 h-4" /> Add +{metric.step || 1}
            </button>
          </div>
        )}

        {metric.type === 'slider' && (
          <div className="space-y-1">
            <input
              type="range"
              min={metric.min || 0}
              max={metric.max || 10}
              step={metric.step || 0.5}
              value={numValue}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeValue(metric.id, val);
                if (val >= metric.targetGoal && numValue < metric.targetGoal) {
                  triggerCelebration();
                }
              }}
              style={{ accentColor: metric.color }}
              className="w-full cursor-pointer h-2 bg-white/10 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{metric.min || 0}</span>
              <span>{metric.max || 10} {metric.unit}</span>
            </div>
          </div>
        )}

        {metric.type === 'rating' && (
          <div className="flex items-center justify-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  onChangeValue(metric.id, star);
                  if (star >= metric.targetGoal) triggerCelebration();
                }}
                className="p-1 transition-transform hover:scale-125 active:scale-95"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= numValue
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {metric.type === 'boolean' && (
          <button
            type="button"
            onClick={handleToggleBool}
            className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 btn-3d ${
              boolValue
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
            }`}
          >
            <Check className={`w-4 h-4 ${boolValue ? 'opacity-100' : 'opacity-40'}`} />
            {boolValue ? 'Completed for Today' : 'Mark as Done'}
          </button>
        )}

        {metric.type === 'timer' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTimerActive(!timerActive)}
              className={`flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 btn-3d ${
                timerActive
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 animate-pulse'
                  : 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              }`}
            >
              {timerActive ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Timer
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerActive(false);
                onChangeValue(metric.id, 0);
              }}
              className="p-2.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all btn-3d"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </GlassCard3D>
  );
};
