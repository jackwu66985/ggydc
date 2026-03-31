import { type SceneMode, type SoundPreset, type EnvironmentPreset } from './types';

export const SCENE_MODES: SceneMode[] = [
  { id: 'deep-focus', name: '专注阅读', label: 'Deep Focus', icon: 'Sparkles' },
  { id: 'casual-reading', name: '轻松阅览', label: 'Casual Reading', icon: 'BookOpen' },
  { id: 'silence-focus', name: '沉静静音', label: 'Silence Focus', icon: 'BellOff' },
  { id: 'power-nap', name: '短时休息', label: 'Power Nap', icon: 'Bed' },
];

export const SOUND_PRESETS: SoundPreset[] = [
  { id: 'rain', name: '窗外雨声', description: '正在播放', icon: 'CloudRain' },
  { id: 'forest', name: '清晨森林', description: '鸟鸣与微风', icon: 'Trees' },
  { id: 'library', name: '静谧图书馆', description: '翻页声', icon: 'Library' },
  { id: 'campfire', name: '篝火声', description: '木材碎裂声', icon: 'Flame' },
];

export const ENVIRONMENT_PRESETS: EnvironmentPreset[] = [
  { id: 'warm-wood', name: '温暖木质' },
  { id: 'fresh-mint', name: '清爽薄荷' },
  { id: 'deep-star', name: '深邃星空' },
  { id: 'morning-aurora', name: '晨间极光' },
];

export const FOCUS_PRESETS = [
  { id: 'forest', name: '森林禅意', label: 'Ambient Forest', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAovsZk7FYJ-nlb6bMiKcYgr2ZGWb8lsWPnTJqqVgdUate0T1tSYQ0jj6STQ-2MsOfejOScAiMLbcD4z2LYDr1P27Dy-0_TBCY6JJJLnrMvY-jGMsDWbPYhBpsEKjQcHFdLz9NdNZK38LJnmD-VAPNCcd_gpduyfJqm0aK-il_DYdv1Lmk-9wANQfo8XdEElSAdWzltdC0XUucc0RrTVsCeSEM-O2HmgLHziEb0FRB1M4guvSQYcFIuyWhoajvGz7IQP_YCnXBgV4dZ' },
  { id: 'study', name: '深夜书房', label: 'Midnight Study', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHrhMDWQXsT2QVqNsZM0NzMixtvYKZW7Sqi3bPGVt_Znx0-3AmGg-ViyOAqbdmv-EMcKkx7tx6zL4QrTnJ77vrpDpyM0qbMddaGvD5CpO1vzjPZDI0P5GaXQRiBRz5ngozDw6u5qCjTM8PWWtzEZXP5N7jUos0PXPbTwDcBEpGWugfEG-c7GOt7Zgxv3yQ8f4rij-deapc3cFLw083Q_PhZxDg8JUSExunBa9fej71CaKvfges4H5ajuX-0uuvqOMvEXnYcZLlo5Rl' },
  { id: 'rain', name: '雨打残荷', label: 'Gentle Rain', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoc4tT8154kRox4QQMiCLIrmWPH-z6LbpjeQjD6mqwvEZ7Rz5vM4LoEv7XL7n59HLhXZT09CZ5HIg7xbvGw-dIng8EKPV6b-E1PM5XZzqeilM9LlUX5rtDxd7zTyfk8g8s4Uy0LVT1_l5hHaOiRMPwHARjQbA8B8c82Yee79TfsMz0ttmWL2DC3f_pntKx84c7Sc_RDJKJ95-mrZDf2MB6KI6npk1yflrN0uPs8Cb9wdbbKH5umEeXqyV-TQKb19WDHEsxWWxd5YE' },
];
