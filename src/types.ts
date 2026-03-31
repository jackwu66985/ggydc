export type Screen = 'home' | 'seat' | 'desk' | 'environment' | 'door' | 'help' | 'focus';

export interface SceneMode {
  id: string;
  name: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface SoundPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  active?: boolean;
}

export interface EnvironmentPreset {
  id: string;
  name: string;
  active?: boolean;
}
