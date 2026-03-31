import React from 'react';
import { Wind, Sun, Snowflake, CloudRain, Trees, Library, Flame } from 'lucide-react';
import { SOUND_PRESETS } from '../constants';
import { cn } from '../lib/utils';
import { type SoundPreset } from '../types';
import { usePod } from '../context/PodContext';
import { motion } from 'motion/react';

export default function EnvironmentView() {
  const { state, setLightBrightness, setActiveSound, updateEnv } = usePod();

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-extrabold tracking-tight text-white mb-1">环境调节</h1>
        <p className="text-zinc-400 font-medium text-sm tracking-wide">舱位 08 · 打造属于您的深度阅读空间</p>
      </header>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-80px)] pb-4">
        {/* Air System */}
        <section className="col-span-4 flex flex-col">
          <div className="glass-panel spatial-rim p-8 rounded-2xl flex-1 flex flex-col items-center justify-between relative overflow-hidden">
            <div className="w-full flex justify-between items-start z-10">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">空气系统</h2>
                <p className="text-xs text-zinc-400 font-medium">智能恒温循环中</p>
              </div>
              <Wind className="w-6 h-6 text-secondary animate-spin-slow" />
            </div>

            {/* Arc Gauge Simulation */}
            <div className="relative w-44 h-44 flex items-center justify-center cursor-pointer group" onClick={() => updateEnv({ co2: Math.max(400, state.co2 - 50) })}>
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white/5" cx="88" cy="88" fill="transparent" r="76" stroke="currentColor" strokeWidth="8" />
                <motion.circle 
                  initial={{ strokeDashoffset: 477 }}
                  animate={{ strokeDashoffset: 477 - (477 * 0.75) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-secondary drop-shadow-[0_0_10px_rgba(249,186,130,0.5)]" 
                  cx="88" cy="88" fill="transparent" r="76" stroke="currentColor" 
                  strokeDasharray="477" strokeLinecap="round" strokeWidth="12" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-3xl font-headline font-black text-white">75%</span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-500">风量强度</span>
              </div>
              <div className="absolute -bottom-2 px-3 py-1 bg-secondary/20 backdrop-blur-md rounded-full border border-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-bold text-secondary uppercase tracking-widest">点击净化</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 z-10">
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                onClick={() => updateEnv({ temperature: state.temperature + 0.5 })}
                className="bg-white/5 rounded-2xl p-4 border border-white/5 cursor-pointer transition-colors"
              >
                <div className="text-[10px] text-zinc-500 font-bold mb-1">舱内温度</div>
                <div className="text-lg font-headline font-bold text-white">{state.temperature.toFixed(1)}°C</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                onClick={() => updateEnv({ co2: state.co2 + 10 })}
                className="bg-white/5 rounded-2xl p-4 border border-white/5 cursor-pointer transition-colors"
              >
                <div className="text-[10px] text-zinc-500 font-bold mb-1">CO2 浓度</div>
                <div className="text-lg font-headline font-bold text-white">{state.co2} <span className="text-xs font-normal text-zinc-400">ppm</span></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Light Controls */}
        <section className="col-span-4 flex flex-col">
          <div className="glass-panel spatial-rim p-8 rounded-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-8">
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

            <div className="space-y-8 flex-1">
              <LightSlider 
                label="主灯亮度" 
                value={state.lightBrightness} 
                onChange={setLightBrightness}
                color="primary" 
              />
              <LightSlider label="护眼模式 (暖色)" value={60} color="secondary" />
              <LightSlider label="顶部矩阵" value={35} color="white" />
            </div>

            <div className="mt-6 p-5 bg-surface-container-low rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">当前色温预览</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              <div className="h-12 w-full rounded-xl bg-gradient-to-r from-[#FFD5A1] via-[#FFF4E5] to-[#E5F1FF] flex items-center justify-center overflow-hidden">
                <div className="px-3 py-1 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                  <span className="text-[9px] font-bold text-white tracking-widest">4200K NATURAL WHITE</span>
                </div>
              </div>
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
