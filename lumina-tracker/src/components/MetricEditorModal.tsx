import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Check, Sparkles } from 'lucide-react';
import { TrackerMetric, MetricType } from '../types';
import { AVAILABLE_METRIC_ICONS } from '../data/defaultData';
import { DynamicIcon } from './DynamicIcon';

interface MetricEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: TrackerMetric[];
  onSaveMetrics: (newMetrics: TrackerMetric[]) => void;
  isDark: boolean;
}

const COLOR_OPTIONS = [
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#6366f1', // Indigo
];

export const MetricEditorModal: React.FC<MetricEditorModalProps> = ({
  isOpen,
  onClose,
  metrics,
  onSaveMetrics,
  isDark,
}) => {
  const [metricList, setMetricList] = useState<TrackerMetric[]>(metrics);
  const [editingMetric, setEditingMetric] = useState<TrackerMetric | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New metric draft state
  const [draftName, setDraftName] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftType, setDraftType] = useState<MetricType>('counter');
  const [draftIcon, setDraftIcon] = useState('Sparkles');
  const [draftUnit, setDraftUnit] = useState('');
  const [draftTarget, setDraftTarget] = useState<number>(5);
  const [draftColor, setDraftColor] = useState(COLOR_OPTIONS[0]);
  const [draftMax, setDraftMax] = useState<number>(10);
  const [draftCategory, setDraftCategory] = useState<TrackerMetric['category']>('health');

  const startCreate = () => {
    setEditingMetric(null);
    setDraftName('');
    setDraftDesc('');
    setDraftType('counter');
    setDraftIcon('Sparkles');
    setDraftUnit('times');
    setDraftTarget(5);
    setDraftColor(COLOR_OPTIONS[0]);
    setDraftMax(10);
    setDraftCategory('productivity');
    setIsCreatingNew(true);
  };

  const startEdit = (m: TrackerMetric) => {
    setIsCreatingNew(false);
    setEditingMetric(m);
    setDraftName(m.name);
    setDraftDesc(m.description || '');
    setDraftType(m.type);
    setDraftIcon(m.icon);
    setDraftUnit(m.unit || '');
    setDraftTarget(m.targetGoal);
    setDraftColor(m.color);
    setDraftMax(m.max || 10);
    setDraftCategory(m.category);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftName.trim()) return;

    if (isCreatingNew) {
      const newM: TrackerMetric = {
        id: `custom-${Date.now()}`,
        name: draftName.trim(),
        description: draftDesc.trim(),
        type: draftType,
        icon: draftIcon,
        unit: draftType === 'boolean' ? undefined : draftUnit.trim(),
        min: 0,
        max: draftMax,
        step: draftType === 'slider' ? 0.5 : 1,
        targetGoal: Number(draftTarget) || 1,
        color: draftColor,
        category: draftCategory,
      };
      const updated = [...metricList, newM];
      setMetricList(updated);
      onSaveMetrics(updated);
      setIsCreatingNew(false);
    } else if (editingMetric) {
      const updated = metricList.map((m) =>
        m.id === editingMetric.id
          ? {
              ...m,
              name: draftName.trim(),
              description: draftDesc.trim(),
              type: draftType,
              icon: draftIcon,
              unit: draftType === 'boolean' ? undefined : draftUnit.trim(),
              targetGoal: Number(draftTarget) || 1,
              color: draftColor,
              max: draftMax,
              category: draftCategory,
            }
          : m
      );
      setMetricList(updated);
      onSaveMetrics(updated);
      setEditingMetric(null);
    }
  };

  const handleDelete = (id: string) => {
    if (metricList.length <= 1) {
      alert('You must have at least one tracker metric.');
      return;
    }
    const updated = metricList.filter((m) => m.id !== id);
    setMetricList(updated);
    onSaveMetrics(updated);
    if (editingMetric?.id === id) setEditingMetric(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const items = [...metricList];
    const [removed] = items.splice(index, 1);
    items.splice(index - 1, 0, removed);
    setMetricList(items);
    onSaveMetrics(items);
  };

  const moveDown = (index: number) => {
    if (index === metricList.length - 1) return;
    const items = [...metricList];
    const [removed] = items.splice(index, 1);
    items.splice(index + 1, 0, removed);
    setMetricList(items);
    onSaveMetrics(items);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden border shadow-2xl ${
            isDark
              ? 'bg-slate-900/95 border-white/15 text-slate-100 shadow-cyan-950/40'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-400/30'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Customize Daily Trackers</h3>
                <p className="text-xs text-slate-400">Add, edit, reorder or customize any daily habit & metric</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* If creating or editing */}
            {(isCreatingNew || editingMetric) ? (
              <form onSubmit={handleSaveForm} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-sm font-semibold text-cyan-400">
                    {isCreatingNew ? 'Create New Custom Tracker' : `Edit "${editingMetric?.name}"`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNew(false);
                      setEditingMetric(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Tracker Name *</label>
                    <input
                      type="text"
                      required
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      placeholder="e.g. Water, Workout, Deep Work"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                        isDark ? 'bg-slate-800/80 border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Type of Tracker</label>
                    <select
                      value={draftType}
                      onChange={(e) => setDraftType(e.target.value as MetricType)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                        isDark ? 'bg-slate-800/80 border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="counter">Counter (+ / - clicks)</option>
                      <option value="slider">Slider (Continuous range)</option>
                      <option value="rating">Rating (1 to 5 Stars/Points)</option>
                      <option value="boolean">Checkbox / Yes-No</option>
                      <option value="timer">Timer (Live session)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={draftDesc}
                    onChange={(e) => setDraftDesc(e.target.value)}
                    placeholder="e.g. Keep body hydrated throughout the day"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                      isDark ? 'bg-slate-800/80 border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {draftType !== 'boolean' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Daily Target Goal</label>
                      <input
                        type="number"
                        min="1"
                        value={draftTarget}
                        onChange={(e) => setDraftTarget(Number(e.target.value))}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                          isDark ? 'bg-slate-800/80 border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Unit Label</label>
                      <input
                        type="text"
                        value={draftUnit}
                        onChange={(e) => setDraftUnit(e.target.value)}
                        placeholder="glasses, mins, pages"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                          isDark ? 'bg-slate-800/80 border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Max Scale Cap</label>
                      <input
                        type="number"
                        value={draftMax}
                        onChange={(e) => setDraftMax(Number(e.target.value))}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                          isDark ? 'bg-slate-800/80 border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Color and Category */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-400">Accent Glow Color</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setDraftColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center shadow-md ${
                          draftColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110 opacity-80'
                        }`}
                      >
                        {draftColor === c && <Check className="w-4 h-4 text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-400">Pick Icon</label>
                  <div className="grid grid-cols-8 gap-2 p-3 rounded-2xl bg-black/20 border border-white/10 max-h-36 overflow-y-auto">
                    {AVAILABLE_METRIC_ICONS.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setDraftIcon(iconName)}
                        className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                          draftIcon === iconName
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40 scale-110'
                            : 'hover:bg-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <DynamicIcon name={iconName} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNew(false);
                      setEditingMetric(null);
                    }}
                    className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
                  >
                    {isCreatingNew ? 'Create Tracker' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Current Active Trackers ({metricList.length})
                  </span>
                  <button
                    onClick={startCreate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add New Tracker
                  </button>
                </div>

                <div className="space-y-2">
                  {metricList.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isDark ? 'bg-slate-800/60 border-white/10 hover:border-white/20' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                          style={{
                            backgroundColor: `${m.color}25`,
                            color: m.color,
                            border: `1px solid ${m.color}40`,
                          }}
                        >
                          <DynamicIcon name={m.icon} className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold truncate">{m.name}</h4>
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                              {m.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            Target: {m.targetGoal} {m.unit || ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(idx)}
                          disabled={idx === metricList.length - 1}
                          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEdit(m)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete tracker"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
