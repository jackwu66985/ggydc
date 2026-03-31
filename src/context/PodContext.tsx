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
  temperature: number;
  humidity: number;
  co2: number;
  noise: number;
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
  applySceneMode: (modeId: string) => void;
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
    temperature: 24.5,
    humidity: 48,
    co2: 412,
    noise: 32,
  });

  const setIsLocked = (isLocked: boolean) => setState(s => ({ ...s, isLocked }));
  const setSeatAngle = (seatAngle: number) => setState(s => ({ ...s, seatAngle }));
  const setDeskHeight = (deskHeight: number) => setState(s => ({ ...s, deskHeight }));
  const setDeskAngle = (deskAngle: number) => setState(s => ({ ...s, deskAngle }));
  const setDeskMaterial = (deskMaterial: string) => setState(s => ({ ...s, deskMaterial }));
  const setLightBrightness = (lightBrightness: number) => setState(s => ({ ...s, lightBrightness }));
  const setActiveSound = (activeSound: string) => setState(s => ({ ...s, activeSound }));
  const setCurrentPreset = (currentPreset: string) => setState(s => ({ ...s, currentPreset }));
  
  const applySceneMode = (modeId: string) => {
    let newState = { ...state, currentPreset: modeId };
    switch (modeId) {
      case 'deep-focus':
        newState = { ...newState, seatAngle: 115, deskHeight: 75, lightBrightness: 85, activeSound: 'rain' };
        break;
      case 'work':
        newState = { ...newState, seatAngle: 105, deskHeight: 72, lightBrightness: 100, activeSound: 'library' };
        break;
      case 'relax':
        newState = { ...newState, seatAngle: 145, deskHeight: 65, lightBrightness: 40, activeSound: 'forest' };
        break;
      case 'sleep':
        newState = { ...newState, seatAngle: 170, deskHeight: 60, lightBrightness: 5, activeSound: 'campfire', isLocked: true };
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
      applySceneMode,
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
