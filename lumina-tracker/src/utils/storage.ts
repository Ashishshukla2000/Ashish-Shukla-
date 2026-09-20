import { TrackerMetric, TodoItem, DiaryEntry, DayTrackingData, AppThemeConfig } from '../types';
import { DEFAULT_TRACKER_METRICS, DEFAULT_TODOS, DEFAULT_DIARY_ENTRY } from '../data/defaultData';

const METRICS_STORAGE_KEY = 'lumina_custom_metrics_v1';
const TRACKING_DATA_KEY = 'lumina_tracking_data_v1';
const TODOS_STORAGE_KEY = 'lumina_todos_data_v1';
const DIARY_STORAGE_KEY = 'lumina_diary_data_v1';
const THEME_STORAGE_KEY = 'lumina_theme_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function loadMetrics(): TrackerMetric[] {
  try {
    const raw = localStorage.getItem(METRICS_STORAGE_KEY);
    if (!raw) return DEFAULT_TRACKER_METRICS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TRACKER_METRICS;
  } catch (e) {
    console.error('Failed to load metrics', e);
    return DEFAULT_TRACKER_METRICS;
  }
}

export function saveMetrics(metrics: TrackerMetric[]): void {
  try {
    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));
  } catch (e) {
    console.error('Failed to save metrics', e);
  }
}

export function loadAllTracking(): Record<string, DayTrackingData> {
  try {
    const raw = localStorage.getItem(TRACKING_DATA_KEY);
    if (!raw) {
      const today = getTodayDateString();
      return {
        [today]: {
          sleep: 4,
          surya_jal: false,
          self_training: 0,
          water: 0,
          portfolio_work: 0,
          shoot_editing: 0,
          discipline: true,
        }
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load tracking data', e);
    return {};
  }
}

export function saveAllTracking(data: Record<string, DayTrackingData>): void {
  try {
    localStorage.setItem(TRACKING_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save tracking data', e);
  }
}

export function loadAllTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!raw) return DEFAULT_TODOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_TODOS;
  } catch (e) {
    console.error('Failed to load todos', e);
    return DEFAULT_TODOS;
  }
}

export function saveAllTodos(todos: TodoItem[]): void {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error('Failed to save todos', e);
  }
}

export function loadAllDiaries(): Record<string, DiaryEntry> {
  try {
    const raw = localStorage.getItem(DIARY_STORAGE_KEY);
    if (!raw) {
      const today = getTodayDateString();
      return {
        [today]: {
          ...DEFAULT_DIARY_ENTRY,
          date: today,
        }
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load diaries', e);
    return {};
  }
}

export function saveAllDiaries(diaries: Record<string, DiaryEntry>): void {
  try {
    localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(diaries));
  } catch (e) {
    console.error('Failed to save diaries', e);
  }
}

export function loadThemeConfig(): AppThemeConfig {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) {
      return {
        palette: 'cyan',
        isDark: true, // Default to sleek 3D dark mode requested by user
        glassIntensity: 'glossy',
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      palette: 'cyan',
      isDark: true,
      glassIntensity: 'glossy',
    };
  }
}

export function saveThemeConfig(theme: AppThemeConfig): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

export function exportFullBackup(): string {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    metrics: loadMetrics(),
    tracking: loadAllTracking(),
    todos: loadAllTodos(),
    diaries: loadAllDiaries(),
    theme: loadThemeConfig(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importFullBackup(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.metrics) saveMetrics(parsed.metrics);
    if (parsed.tracking) saveAllTracking(parsed.tracking);
    if (parsed.todos) saveAllTodos(parsed.todos);
    if (parsed.diaries) saveAllDiaries(parsed.diaries);
    if (parsed.theme) saveThemeConfig(parsed.theme);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}
