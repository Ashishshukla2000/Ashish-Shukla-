import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Sliders, 
  Download, 
  Upload, 
  Palette, 
  BookHeart, 
  CheckSquare, 
  LayoutDashboard,
  BarChart3,
  X
} from 'lucide-react';
import { ThemePalette } from '../types';
import { exportFullBackup, importFullBackup } from '../utils/storage';

interface HeaderBarProps {
  isDark: boolean;
  onToggleDark: () => void;
  palette: ThemePalette;
  onChangePalette: (palette: ThemePalette) => void;
  activeTab: 'all' | 'trackers' | 'todos' | 'diary' | 'insights';
  onChangeTab: (tab: 'all' | 'trackers' | 'todos' | 'diary' | 'insights') => void;
  onOpenCustomizer: () => void;
  onDataImported: () => void;
}

const PALETTES: { id: ThemePalette; label: string; color: string }[] = [
  { id: 'cyan', label: 'Cyan Aurora', color: '#06b6d4' },
  { id: 'purple', label: 'Amethyst', color: '#8b5cf6' },
  { id: 'emerald', label: 'Emerald Glow', color: '#10b981' },
  { id: 'amber', label: 'Solar Amber', color: '#f59e0b' },
  { id: 'rose', label: 'Rose Quartz', color: '#f43f5e' },
];

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isDark,
  onToggleDark,
  palette,
  onChangePalette,
  activeTab,
  onChangeTab,
  onOpenCustomizer,
  onDataImported,
}) => {
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleDownloadBackup = () => {
    const json = exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError('');
    if (!importJson.trim()) return;
    const success = importFullBackup(importJson);
    if (success) {
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        setShowBackupModal(false);
        onDataImported();
      }, 1000);
    } else {
      setImportError('Invalid backup file. Please verify JSON format.');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full mb-6">
      <div
        className={`mx-auto max-w-7xl px-4 py-3 rounded-2xl md:rounded-3xl border transition-all ${
          isDark
            ? 'glass-panel-dark border-white/10 shadow-2xl'
            : 'glass-panel-light border-white/60 shadow-lg'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              {/* 3D Glossy Logo Cube */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/25">
                <div className="w-full h-full rounded-[14px] bg-slate-950/80 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 pointer-events-none rounded-t-[14px]" />
                  <Sparkles className="w-5 h-5 text-cyan-300 drop-shadow" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-extrabold tracking-tight">Shukla's</h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    3D Glass
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Daily Tracker & Personal Diary</p>
              </div>
            </div>

            {/* Mobile dark mode & customizer toggles */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={onToggleDark}
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Navigation Views */}
          <nav className="flex items-center gap-1 p-1 rounded-2xl bg-black/25 border border-white/10 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => onChangeTab('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> All in One
            </button>
            <button
              type="button"
              onClick={() => onChangeTab('trackers')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'trackers'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Trackers
            </button>
            <button
              type="button"
              onClick={() => onChangeTab('todos')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'todos'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" /> Todos
            </button>
            <button
              type="button"
              onClick={() => onChangeTab('diary')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'diary'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookHeart className="w-3.5 h-3.5" /> Diary
            </button>
            <button
              type="button"
              onClick={() => onChangeTab('insights')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'insights'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Insights
            </button>
          </nav>

          {/* Right Controls: Theme & Dark Mode & Customizer */}
          <div className="hidden md:flex items-center gap-2">
            {/* Color Palette Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPaletteMenu(!showPaletteMenu)}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all btn-3d"
                title="Glass Accent Color"
              >
                <Palette className="w-4 h-4" />
              </button>

              {showPaletteMenu && (
                <div
                  className={`absolute right-0 mt-2 p-2 rounded-2xl border shadow-xl flex flex-col gap-1.5 z-50 min-w-36 ${
                    isDark ? 'bg-slate-900/95 border-white/15' : 'bg-white/95 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    Theme Aura
                  </span>
                  {PALETTES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onChangePalette(p.id);
                        setShowPaletteMenu(false);
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left transition-all ${
                        palette === p.id ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={onToggleDark}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all btn-3d"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Backup / Restore Modal trigger */}
            <button
              type="button"
              onClick={() => setShowBackupModal(true)}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all btn-3d"
              title="Backup & Restore Data"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Customizer trigger */}
            <button
              type="button"
              onClick={onOpenCustomizer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all btn-3d"
            >
              <Sliders className="w-3.5 h-3.5" /> Customize
            </button>
          </div>
        </div>
      </div>

      {/* Backup / Export / Import Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 ${
              isDark ? 'bg-slate-900 border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Download className="w-5 h-5 text-cyan-400" />
                <span>Backup & Restore Data</span>
              </div>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Export Your Life Data
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save an offline JSON snapshot of all your custom metrics, daily tracking history, todos, and personal diary entries.
              </p>
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Backup (.json)
              </button>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Restore from Backup
              </h4>
              <textarea
                rows={4}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste your JSON backup data here..."
                className={`w-full p-3 rounded-xl text-xs font-mono border focus:outline-none ${
                  isDark ? 'bg-slate-800/80 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-300'
                }`}
              />

              {importError && (
                <p className="text-xs text-rose-400 font-medium">{importError}</p>
              )}
              {importSuccess && (
                <p className="text-xs text-emerald-400 font-medium">Backup restored successfully!</p>
              )}

              <button
                type="button"
                onClick={handleImportSubmit}
                disabled={!importJson.trim()}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> Import Backup Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
