import React from 'react';
import { Wind, Sun, Snowflake, CloudRain, Trees, Library, Flame } from 'lucide-react';
import { SOUND_PRESETS, ENVIRONMENT_PRESETS } from '../constants';
import { cn } from '../lib/utils';
import { type SoundPreset } from '../types';
import { usePod } from '../context/PodContext';
import { motion } from 'motion/react';

export default function EnvironmentView() {
  const { state, setLightBrightness, setActiveSound, updateEnv, applyEnvironmentPreset } = usePod();

  const getOrbColor = () => {
    switch (state.activeEnvironment) {
      case 'warm-wood': return { r: 249, g: 186, b: 130 };
      case 'fresh-mint': return { r: 74, g: 222, b: 128 };
      case 'deep-star': return { r: 96, g: 165, b: 250 };
      case 'morning-aurora': return { r: 244, g: 114, b: 182 };
      default: return { r: 255, g: 255, b: 255 };
    }
  };
  const orbColor = getOrbColor();

  const getColorTempText = () => {
    switch (state.activeEnvironment) {
      case 'warm-wood': return '3000K WARM';
      case 'fresh-mint': return '5000K COOL';
      case 'deep-star': return '6500K DAYLIGHT';
      case 'morning-aurora': return '4200K NATURAL';
      default: return '4200K NATURAL';
    }
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-extrabold tracking-tight text-white mb-1">环境调节</h1>
        <p className="text-zinc-400 font-medium text-sm tracking-wide">舱位 08 · 打造属于您的深度阅读空间</p>
      </header>

      {/* Environment Presets */}
      <div className="mb-6 flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {ENVIRONMENT_PRESETS.map(preset => {
          const isActive = state.activeEnvironment === preset.id;
          return (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => applyEnvironmentPreset(preset.id)}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                isActive 
                  ? "bg-primary text-on-primary border-primary shadow-[0_0_15px_rgba(255,180,170,0.3)]" 
                  : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
              )}
            >
              {preset.name}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-140px)] pb-4">
        {/* Air System */}
        <section className="col-span-4 flex flex-col">
          <div className="glass-panel spatial-rim p-8 rounded-2xl flex-1 flex flex-col items-center justify-between relative overflow-hidden">
            {/* Airflow Particles */}
            {state.fanSpeed > 0 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-30">
                {Array.from({ length: Math.floor(state.fanSpeed / 5) }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-secondary rounded-full blur-[1px]"
                    initial={{ 
                      x: 50 + Math.random() * 200, 
                      y: 300, 
                      opacity: 0 
                    }}
                    animate={{ 
                      y: -20, 
                      opacity: [0, 1, 0],
                      x: `+=${(Math.random() - 0.5) * 50}`
                    }}
                    transition={{ 
                      duration: 1.5 + Math.random() * 2 - (state.fanSpeed / 100), 
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "linear"
                    }}
                  />
                ))}
              </div>
            )}

            <div className="w-full flex justify-between items-start z-10">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">空气系统</h2>
                <p className="text-xs text-zinc-400 font-medium">智能恒温循环中</p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: state.fanSpeed > 0 ? 3 - (state.fanSpeed / 100) * 2.5 : 0, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                <Wind className={cn("w-6 h-6 text-secondary", state.fanSpeed === 0 && "opacity-50")} />
              </motion.div>
            </div>

            {/* Arc Gauge Simulation */}
            <div 
              className="relative w-44 h-44 flex items-center justify-center cursor-pointer group z-10"
              onMouseMove={(e) => {
                if (e.buttons !== 1) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                let angle = Math.atan2(y, x) + Math.PI / 2;
                if (angle < 0) angle += 2 * Math.PI;
                const percentage = Math.round((angle / (2 * Math.PI)) * 100);
                updateEnv('fanSpeed', Math.max(0, Math.min(100, percentage)));
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                let angle = Math.atan2(y, x) + Math.PI / 2;
                if (angle < 0) angle += 2 * Math.PI;
                const percentage = Math.round((angle / (2 * Math.PI)) * 100);
                updateEnv('fanSpeed', Math.max(0, Math.min(100, percentage)));
              }}
            >
              <svg className="w-full h-full transform -rotate-90 pointer-events-none">
                <circle className="text-white/5" cx="88" cy="88" fill="transparent" r="76" stroke="currentColor" strokeWidth="8" />
                <motion.circle 
                  animate={{ strokeDashoffset: 477 - (477 * (state.fanSpeed / 100)) }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="text-secondary drop-shadow-[0_0_10px_rgba(249,186,130,0.5)]" 
                  cx="88" cy="88" fill="transparent" r="76" stroke="currentColor" 
                  strokeDasharray="477" strokeLinecap="round" strokeWidth="12" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform group-hover:scale-110 pointer-events-none">
                <span className="text-3xl font-headline font-black text-white">{state.fanSpeed}%</span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-500">风量强度</span>
              </div>
              <div className="absolute -bottom-2 px-3 py-1 bg-secondary/20 backdrop-blur-md rounded-full border border-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[8px] font-bold text-secondary uppercase tracking-widest">滑动调节</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 z-10">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
                <div className="text-[10px] text-zinc-500 font-bold mb-1">舱内温度</div>
                <div className="text-lg font-headline font-bold text-white flex items-center gap-2">
                  {state.temperature.toFixed(1)}°C
                  <div className="flex flex-col gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => updateEnv('temperature', Math.min(30, state.temperature + 0.5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20 text-xs">+</button>
                    <button onClick={() => updateEnv('temperature', Math.max(16, state.temperature - 0.5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20 text-xs">-</button>
                  </div>
                </div>
                {/* Temperature color indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 opacity-50">
                  <motion.div 
                    className="absolute top-0 h-full w-2 bg-white rounded-full shadow-[0_0_5px_white]"
                    animate={{ left: `${Math.max(0, Math.min(100, ((state.temperature - 16) / 14) * 100))}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
                <div className="text-[10px] text-zinc-500 font-bold mb-1">CO2 浓度</div>
                <div className="text-lg font-headline font-bold text-white flex items-center gap-2">
                  {state.co2} <span className="text-xs font-normal text-zinc-400">ppm</span>
                  <button 
                    onClick={() => {
                      updateEnv('co2', 400);
                      updateEnv('fanSpeed', 100);
                    }} 
                    className="ml-auto px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-500/30"
                  >
                    净化
                  </button>
                </div>
                {/* CO2 color indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-50">
                  <motion.div 
                    className="absolute top-0 h-full w-2 bg-white rounded-full shadow-[0_0_5px_white]"
                    animate={{ left: `${Math.max(0, Math.min(100, ((state.co2 - 400) / 1600) * 100))}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Light Controls */}
        <section className="col-span-4 flex flex-col">
          <div className="glass-panel spatial-rim p-8 rounded-2xl flex-1 flex flex-col relative overflow-hidden">
            {/* Dynamic Ambient Glow */}
            <motion.div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 rounded-full blur-[60px] pointer-events-none"
              style={{ backgroundColor: `rgba(${orbColor.r}, ${orbColor.g}, ${orbColor.b}, 0.2)` }}
              animate={{ 
                opacity: state.lightBrightness / 100,
                scale: 0.8 + (state.lightBrightness / 100) * 0.5
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />

            <div className="flex justify-between items-center mb-6 z-10">
              <h2 className="text-lg font-bold text-white">灯光调节</h2>
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-200/20 border border-orange-200/50 flex items-center justify-center cursor-pointer hover:bg-orange-200/30 transition-colors">
                  <Sun className="w-3.5 h-3.5 text-orange-200" />
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-200/20 border border-blue-200/50 flex items-center justify-center cursor-pointer hover:bg-blue-200/30 transition-colors">
                  <Snowflake className="w-3.5 h-3.5 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Light Visualizer Orb */}
            <div className="relative w-full h-32 mb-8 flex items-center justify-center z-10">
              {/* Core */}
              <motion.div 
                className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center z-20"
                animate={{
                  boxShadow: `0 0 ${20 + state.lightBrightness}px ${10 + state.lightBrightness * 0.4}px rgba(${orbColor.r}, ${orbColor.g}, ${orbColor.b}, ${state.lightBrightness / 100 * 0.8})`,
                  backgroundColor: `rgba(${orbColor.r}, ${orbColor.g}, ${orbColor.b}, ${0.5 + (state.lightBrightness / 100) * 0.5})`
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <Sun className="w-6 h-6 text-white/80" />
              </motion.div>
              
              {/* Ripple Rings */}
              <motion.div 
                className="absolute w-24 h-24 rounded-full border z-10"
                style={{ borderColor: `rgba(${orbColor.r}, ${orbColor.g}, ${orbColor.b}, 0.4)` }}
                animate={{
                  scale: 1 + (state.lightBrightness / 100) * 0.6,
                  opacity: state.lightBrightness / 100 * 0.6
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
              <motion.div 
                className="absolute w-32 h-32 rounded-full border z-10"
                style={{ borderColor: `rgba(${orbColor.r}, ${orbColor.g}, ${orbColor.b}, 0.2)` }}
                animate={{
                  scale: 1 + (state.lightBrightness / 100) * 1.2,
                  opacity: state.lightBrightness / 100 * 0.3
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>

            <div className="space-y-6 flex-1 z-10">
              <LightSlider 
                label="主灯亮度" 
                value={state.lightBrightness} 
                onChange={setLightBrightness}
                color="primary" 
              />
              <LightSlider label="护眼模式 (暖色)" value={60} color="secondary" />
              <LightSlider label="顶部矩阵" value={35} color="white" />
            </div>

            <div className="mt-4 p-4 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md flex items-center justify-between z-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase mb-1">当前色温</span>
                <span className="text-xs font-bold text-white tracking-widest">{getColorTempText()}</span>
              </div>
              <div className="h-8 w-24 rounded-lg bg-gradient-to-r from-[#FFD5A1] via-[#FFF4E5] to-[#E5F1FF] opacity-80" />
            </div>
          </div>
        </section>

        {/* Sound Atmosphere */}
        <section className="col-span-4 flex flex-col">
          <div className="glass-panel spatial-rim p-8 rounded-2xl flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-6">声音氛围</h2>
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 no-scrollbar">
              {SOUND_PRESETS.map((preset) => (
                <SoundCard 
                  key={preset.id} 
                  preset={preset} 
                  isActive={state.activeSound === preset.id}
                  onClick={() => setActiveSound(preset.id)}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">氛围音量</span>
                <span className="text-[9px] font-headline font-bold text-primary">45dB</span>
              </div>
              <div className="flex items-center gap-1 h-10 justify-center">
                {[3, 6, 8, 10, 5, 8, 4, 6, 2].map((h, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ height: [h * 3, h * 5, h * 3] }}
                    transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                      "w-1 bg-primary rounded-full",
                      i === 0 || i === 6 ? "opacity-30" : "opacity-80"
                    )} 
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function LightSlider({ label, value, color, onChange }: { label: string, value: number, color: string, onChange?: (v: number) => void }) {
  const colorClass = color === 'primary' ? 'bg-primary' : color === 'secondary' ? 'bg-secondary' : 'bg-white/20';
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    onChange(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-zinc-300">{label}</label>
        <span className={cn("text-xs font-headline font-bold", color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-zinc-300')}>
          {value}%
        </span>
      </div>
      <div 
        onClick={handleClick}
        className="relative h-1.5 bg-white/5 rounded-full overflow-hidden cursor-pointer group"
      >
        <motion.div 
          animate={{ width: `${value}%` }}
          className={cn("absolute h-full rounded-full", colorClass)} 
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" style={{ left: `calc(${value}% - 6px)` }} />
      </div>
    </div>
  );
}

const soundIconMap: Record<string, any> = {
  CloudRain,
  Trees,
  Library,
  Flame
};

function SoundCard({ preset, isActive, onClick }: { preset: SoundPreset; isActive: boolean; onClick: () => void, key?: any }) {
  const Icon = soundIconMap[preset.icon];
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer border rounded-2xl p-3 flex items-center gap-4 transition-all",
        isActive ? "bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,180,170,0.1)]" : "bg-white/5 border-white/5 hover:bg-white/10"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
        isActive ? "bg-primary text-on-primary shadow-[0_0_20px_rgba(255,180,170,0.4)]" : "bg-zinc-800 text-zinc-400"
      )}>
        <Icon className={cn("w-4 h-4", isActive && "animate-pulse")} />
      </div>
      <div className="flex-1">
        <div className={cn("text-xs font-bold transition-colors", isActive ? "text-primary" : "text-white")}>{preset.name}</div>
        <div className="text-[9px] text-zinc-400">{preset.description}</div>
      </div>
      {isActive && (
        <div className="flex gap-0.5">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i}
              animate={{ height: [4, 12, 4] }}
              transition={{ duration: 0.5 + i * 0.2, repeat: Infinity }}
              className="w-0.5 bg-primary rounded-full"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
