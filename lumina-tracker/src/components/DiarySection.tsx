import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookHeart, 
  Sun, 
  CloudRain, 
  Cloud, 
  Moon, 
  Zap, 
  Heart, 
  Sparkles, 
  Bookmark, 
  History, 
  Save, 
  Clock,
  Feather,
  Smile,
  Shield,
  Check
} from 'lucide-react';
import { DiaryEntry, MoodType } from '../types';
import { GlassCard3D } from './GlassCard3D';

interface DiarySectionProps {
  entry: DiaryEntry | undefined;
  onSaveEntry: (entry: DiaryEntry) => void;
  isDark: boolean;
  selectedDate: string;
  allDiaries: Record<string, DiaryEntry>;
  onSelectDate: (date: string) => void;
}

const MOODS: { type: MoodType; label: string; icon: string; color: string; bg: string }[] = [
  { type: 'ecstatic', label: 'Radiant', icon: '✨', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { type: 'happy', label: 'Joyful', icon: '😊', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { type: 'peaceful', label: 'Calm', icon: '🌿', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  { type: 'neutral', label: 'Steady', icon: '⚖️', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
  { type: 'reflective', label: 'Deep', icon: '📖', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  { type: 'stressed', label: 'Stressed', icon: '⚡', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  { type: 'tired', label: 'Exhausted', icon: '🌙', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
];

const WEATHER_OPTIONS: { type: DiaryEntry['weather']; label: string; icon: React.FC<{ className?: string }> }[] = [
  { type: 'sunny', label: 'Sunny', icon: Sun },
  { type: 'cloudy', label: 'Cloudy', icon: Cloud },
  { type: 'rainy', label: 'Rainy', icon: CloudRain },
  { type: 'night', label: 'Clear Night', icon: Moon },
];

export const DiarySection: React.FC<DiarySectionProps> = ({
  entry,
  onSaveEntry,
  isDark,
  selectedDate,
  allDiaries,
  onSelectDate,
}) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<MoodType>(entry?.mood || 'peaceful');
  const [weather, setWeather] = useState<DiaryEntry['weather']>(entry?.weather || 'sunny');
  const [gratitude, setGratitude] = useState(entry?.gratitude || '');
  const [wins, setWins] = useState(entry?.wins || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(entry?.tags || ['Reflection']);
  const [showHistory, setShowHistory] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Sync state whenever selected date or entry changes
  useEffect(() => {
    setTitle(entry?.title || '');
    setContent(entry?.content || '');
    setMood(entry?.mood || 'peaceful');
    setWeather(entry?.weather || 'sunny');
    setGratitude(entry?.gratitude || '');
    setWins(entry?.wins || '');
    setTags(entry?.tags || ['Reflection']);
  }, [entry, selectedDate]);

  const handleManualSave = () => {
    const updated: DiaryEntry = {
      id: entry?.id || `diary-${selectedDate}`,
      date: selectedDate,
      title: title.trim() || 'Daily Reflection',
      content: content.trim(),
      mood,
      weather,
      gratitude: gratitude.trim(),
      wins: wins.trim(),
      tags,
      updatedAt: Date.now(),
    };
    onSaveEntry(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        const next = [...tags, tagInput.trim()];
        setTags(next);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const insertPrompt = (promptHeader: string) => {
    const addition = `\n\n**${promptHeader}:** `;
    setContent((prev) => prev + addition);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const currentMoodObj = MOODS.find((m) => m.type === mood) || MOODS[2];

  // List of other dates that have diary entries
  const pastDiaryDates = Object.keys(allDiaries)
    .filter((d) => allDiaries[d] && (allDiaries[d].content || allDiaries[d].title))
    .sort((a, b) => b.localeCompare(a));

  return (
    <GlassCard3D
      isDark={isDark}
      glowColor={`${currentMoodObj.color}20`}
      className="p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 text-violet-300 flex items-center justify-center border border-violet-500/30 shadow-md">
            <BookHeart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Personal Diary & Journal</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">
                {wordCount} words
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              Record daily thoughts, memories, reflections, and mindset
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* History drawer toggle */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all border border-white/10"
          >
            <History className="w-4 h-4" /> Past Entries ({pastDiaryDates.length})
          </button>

          {/* Save button */}
          <button
            type="button"
            onClick={handleManualSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:brightness-110 active:scale-95 transition-all btn-3d"
          >
            {savedFeedback ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Journal
              </>
            )}
          </button>
        </div>
      </div>

      {/* History Browser Modal / Drawer */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="my-4 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Browse Past Diary Entries</span>
            <button
              onClick={() => setShowHistory(false)}
              className="hover:text-white text-slate-500"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {pastDiaryDates.map((dateKey) => {
              const d = allDiaries[dateKey];
              const isCurrent = dateKey === selectedDate;
              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => {
                    onSelectDate(dateKey);
                    setShowHistory(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-200'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{dateKey}</span>
                    <span>{d.mood ? MOODS.find((m) => m.type === d.mood)?.icon : '📝'}</span>
                  </div>
                  <div className="text-xs truncate font-medium text-slate-200">
                    {d.title || 'Untitled Entry'}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {d.content || 'No text written'}
                  </p>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Mood & Weather Selection */}
      <div className="my-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mood Selector */}
        <div className="lg:col-span-2 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            How are you feeling today? (Mood)
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const isSelected = mood === m.type;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setMood(m.type)}
                  style={{
                    backgroundColor: isSelected ? m.bg : 'rgba(255, 255, 255, 0.05)',
                    borderColor: isSelected ? m.color : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isSelected ? `0 4px 12px ${m.color}35` : 'none',
                  }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all btn-3d ${
                    isSelected ? 'text-white scale-105' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weather Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Today's Sky & Weather
          </label>
          <div className="flex gap-2">
            {WEATHER_OPTIONS.map((w) => {
              const isSelected = weather === w.type;
              const Icon = w.icon;
              return (
                <button
                  key={w.type}
                  type="button"
                  onClick={() => setWeather(w.type)}
                  className={`flex-1 py-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px]">{w.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Title & Entry Body */}
      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give today's chapter a title..."
            className={`w-full px-4 py-3 rounded-2xl text-lg font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
              isDark
                ? 'bg-slate-900/60 border-white/15 text-white placeholder:text-slate-600'
                : 'bg-white/70 border-slate-300 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        {/* Guided Prompts Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Prompts:
          </span>
          <button
            type="button"
            onClick={() => insertPrompt('Grateful For')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
          >
            + Gratitude
          </button>
          <button
            type="button"
            onClick={() => insertPrompt("Today's Win")}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
          >
            + Key Win
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('Mindset & Feeling')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
          >
            + Mindset
          </button>
          <button
            type="button"
            onClick={() => insertPrompt('Tomorrow I will focus on')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
          >
            + Tomorrow's Intention
          </button>
        </div>

        {/* Content Area */}
        <div className="relative">
          <textarea
            rows={7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your heart out. What happened today? What inspired you? What did you discover about yourself?..."
            className={`w-full p-4 rounded-2xl text-sm md:text-base leading-relaxed border transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-y font-normal ${
              isDark
                ? 'bg-slate-900/60 border-white/15 text-slate-100 placeholder:text-slate-600'
                : 'bg-white/70 border-slate-300 text-slate-800 placeholder:text-slate-400'
            }`}
          />
        </div>

        {/* Gratitude & Wins Side-by-side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
              <Sun className="w-4 h-4" /> Three Things I'm Grateful For
            </div>
            <textarea
              rows={2}
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="1. Sunny walk, 2. Delicious coffee, 3. Supportive friend..."
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder:text-slate-500 resize-none"
            />
          </div>

          <div
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" /> Daily Highlight / Proud Moment
            </div>
            <textarea
              rows={2}
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              placeholder="Shipped project milestone, remained calm during a tough call..."
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder:text-slate-500 resize-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Tags:</span>
          </div>
          {tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1"
            >
              #{t}
              <button
                type="button"
                onClick={() => handleRemoveTag(t)}
                className="hover:text-rose-400 text-slate-400 text-xs ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type tag & hit Enter..."
            className="bg-transparent text-xs px-2.5 py-1 rounded-full border border-white/10 focus:outline-none focus:border-violet-400 text-slate-300"
          />
        </div>
      </div>
    </GlassCard3D>
  );
};
