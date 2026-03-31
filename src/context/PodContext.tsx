import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PodState {
  isLocked: boolean;
  seatAngle: number;
  deskHeight: number;
  deskAngle: number;
  deskMaterial: string;
  lightBrightness: number;
  activeSound: string;
  currentPreset: string;
  activeEnvironment: string;
  temperature: number;
  humidity: number;
  co2: number;
  noise: number;
  fanSpeed: number;
  privacyLevel: number;
}

interface PodContextType {
  state: PodState;
  setIsLocked: (val: boolean) => void;
  setSeatAngle: (val: number) => void;
  setDeskHeight: (val: number) => void;
  setDeskAngle: (val: number) => void;
  setDeskMaterial: (val: string) => void;
  setLightBrightness: (val: number) => void;
  setActiveSound: (val: string) => void;
  setCurrentPreset: (val: string) => void;
  setPrivacyLevel: (val: number) => void;
  applySceneMode: (modeId: string) => void;
  applyEnvironmentPreset: (envId: string) => void;
  updateEnv: (key: keyof PodState, val: any) => void;
}

const PodContext = createContext<PodContextType | undefined>(undefined);

export function PodProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PodState>({
    isLocked: true,
    seatAngle: 128,
    deskHeight: 72,
    deskAngle: 5,
    deskMaterial: 'walnut',
    lightBrightness: 82,
    activeSound: 'rain',
    currentPreset: 'deep-focus',
    activeEnvironment: 'warm-wood',
    temperature: 24.5,
    humidity: 48,
    co2: 412,
    noise: 32,
    fanSpeed: 75,
    privacyLevel: 100,
  });

  const setIsLocked = (isLocked: boolean) => setState(s => ({ ...s, isLocked }));
  const setSeatAngle = (seatAngle: number) => setState(s => ({ ...s, seatAngle }));
  const setDeskHeight = (deskHeight: number) => setState(s => ({ ...s, deskHeight }));
  const setDeskAngle = (deskAngle: number) => setState(s => ({ ...s, deskAngle }));
  const setDeskMaterial = (deskMaterial: string) => setState(s => ({ ...s, deskMaterial }));
  const setLightBrightness = (lightBrightness: number) => setState(s => ({ ...s, lightBrightness }));
  const setActiveSound = (activeSound: string) => setState(s => ({ ...s, activeSound }));
  const setCurrentPreset = (currentPreset: string) => setState(s => ({ ...s, currentPreset }));
  const setPrivacyLevel = (privacyLevel: number) => setState(s => ({ ...s, privacyLevel }));
  
  const applySceneMode = (modeId: string) => {
    let newState = { ...state, currentPreset: modeId };
    switch (modeId) {
      case 'deep-focus':
        newState = { ...newState, seatAngle: 115, deskHeight: 75, lightBrightness: 85, activeSound: 'rain' };
        break;
      case 'casual-reading':
        newState = { ...newState, seatAngle: 105, deskHeight: 72, lightBrightness: 100, activeSound: 'library' };
        break;
      case 'silence-focus':
        newState = { ...newState, seatAngle: 145, deskHeight: 65, lightBrightness: 40, activeSound: 'forest' };
        break;
      case 'power-nap':
        newState = { ...newState, seatAngle: 170, deskHeight: 60, lightBrightness: 5, activeSound: 'campfire', isLocked: true };
        break;
    }
    setState(newState);
  };

  const applyEnvironmentPreset = (envId: string) => {
    let newState = { ...state, activeEnvironment: envId };
    switch (envId) {
      case 'warm-wood':
        newState = { ...newState, lightBrightness: 70, temperature: 25.5, activeSound: 'campfire' };
        break;
      case 'fresh-mint':
        newState = { ...newState, lightBrightness: 85, temperature: 22.0, activeSound: 'forest' };
        break;
      case 'deep-star':
        newState = { ...newState, lightBrightness: 30, temperature: 20.0, activeSound: 'rain' };
        break;
      case 'morning-aurora':
        newState = { ...newState, lightBrightness: 95, temperature: 23.5, activeSound: 'library' };
        break;
    }
    setState(newState);
  };

  const updateEnv = (key: keyof PodState, val: any) => setState(s => ({ ...s, [key]: val }));

  return (
    <PodContext.Provider value={{ 
      state, 
      setIsLocked, 
      setSeatAngle, 
      setDeskHeight, 
      setDeskAngle,
      setDeskMaterial,
      setLightBrightness, 
      setActiveSound, 
      setCurrentPreset,
      setPrivacyLevel,
      applySceneMode,
      applyEnvironmentPreset,
      updateEnv
    }}>
      {children}
    </PodContext.Provider>
  );
}

export function usePod() {
  const context = useContext(PodContext);
  if (context === undefined) {
    throw new Error('usePod must be used within a PodProvider');
  }
  return context;
}
