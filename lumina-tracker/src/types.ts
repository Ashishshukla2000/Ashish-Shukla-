export type MetricType = 'counter' | 'slider' | 'rating' | 'boolean' | 'timer';

export interface TrackerMetric {
  id: string;
  name: string;
  description?: string;
  type: MetricType;
  icon: string; // Lucide icon key
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  targetGoal: number; // e.g. 8 glasses, 45 mins, 5 stars, etc.
  color: string; // hex or tailwind accent
  category: 'health' | 'productivity' | 'mindfulness' | 'learning' | 'personal';
}

export interface DayTrackingData {
  [metricId: string]: number | boolean;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  date: string; // YYYY-MM-DD
  dueDate?: string;
  createdAt: number;
}

export type MoodType = 'ecstatic' | 'happy' | 'peaceful' | 'neutral' | 'stressed' | 'tired' | 'reflective';

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodType;
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'night';
  tags: string[];
  gratitude?: string;
  wins?: string;
  updatedAt: number;
}

export type ThemePalette = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';

export interface AppThemeConfig {
  palette: ThemePalette;
  isDark: boolean;
  glassIntensity: 'subtle' | 'glossy' | 'vibrant';
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  tracking: DayTrackingData;
  todos: TodoItem[];
  diary?: DiaryEntry;
}
