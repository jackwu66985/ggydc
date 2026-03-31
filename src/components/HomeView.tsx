import React, { Suspense } from 'react';
import { Sparkles, BookOpen, BellOff, Bed } from 'lucide-react';
import { SCENE_MODES, ENVIRONMENT_PRESETS } from '../constants';
import { cn } from '../lib/utils';
import { usePod } from '../context/PodContext';
import { motion } from 'motion/react';
import PodModel from './PodModel';

interface HomeViewProps {
  onEnterFocus: () => void;
  onNavigate?: (screen: string) => void;
}

const iconMap: Record<string, any> = {
  Sparkles,
  BookOpen,
  BellOff,
  Bed
};

export default function HomeView({ onEnterFocus, onNavigate }: HomeViewProps) {
  const { state, applySceneMode, applyEnvironmentPreset, setLightBrightness, setSeatAngle, setDeskHeight } = usePod();

  return (
    <div className="w-full h-full p-12 grid grid-cols-12 gap-8 relative overflow-hidden">
      {/* Left Column: Scene Modes */}
      <section className="col-span-3 flex flex-col gap-5">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-headline font-extrabold text-on-surface">场景模式</h2>
          <p className="text-xs text-on-surface/40 font-body uppercase">Scene Modes</p>
        </header>
        <div className="grid grid-cols-1 gap-3 overflow-y-auto no-scrollbar pb-4">
          {SCENE_MODES.map((mode) => {
            const Icon = iconMap[mode.icon];
            const isActive = state.currentPreset === mode.id;
            return (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  applySceneMode(mode.id);
                  if (mode.id === 'deep-focus') onEnterFocus();
                }}
                className={cn(
                  "relative group h-28 rounded-lg overflow-hidden border p-4 flex flex-col justify-between text-left transition-all",
                  isActive 
                    ? "border-primary/30 bg-primary/10 shadow-[0_0_20px_rgba(255,180,170,0.15)]" 
                    : "border-white/5 bg-surface-container-low hover:bg-white/5"
                )}
              >
                <div className="absolute top-0 right-0 p-4">
                  <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-on-surface/40")} />
                </div>
                <span className={cn("relative z-10 font-bold text-lg transition-colors", isActive ? "text-primary" : "text-on-surface")}>
                  {mode.name}
                </span>
                <span className={cn("relative z-10 text-[10px] font-medium uppercase transition-colors", isActive ? "text-primary/60" : "text-on-surface/40")}>
                  {mode.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-scene-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary" 
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Center Column: 3D Visualization */}
      <section className="col-span-6 relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,180,170,0.05)_0%,transparent_70%)]" />
        <div className="relative w-full h-[480px] flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center holographic-glow">
            <Suspense fallback={
              <div className="text-primary font-mono text-sm animate-pulse">Loading 3D Model...</div>
            }>
              <PodModel state={state} onNavigate={onNavigate} />
            </Suspense>
            
            {/* Interactive Hotspots */}
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[48%] left-[52%] group cursor-pointer z-20 pointer-events-none"
            >
              <div className="w-4 h-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,180,170,1)]" />
              </div>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap bg-zinc-900/90 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/10 shadow-2xl">
                <p className="text-[10px] text-primary font-bold tracking-wider">智能人体工学座椅</p>
                <p className="text-[8px] text-white/40 uppercase">Ergonomic Seat</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Environment Parameter Overlay */}
        <div className="flex gap-8 bg-zinc-900/40 backdrop-blur-2xl rounded-2xl px-8 py-4 border border-white/5 shadow-2xl mt-4">
          <div className="text-center">
            <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mb-1">温度</p>
            <p className="text-lg font-headline font-bold text-on-surface">{state.temperature.toFixed(1)}°C</p>
          </div>
          <div className="w-[1px] h-8 bg-white/10 self-center" />
          <div className="text-center">
            <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mb-1">湿度</p>
            <p className="text-lg font-headline font-bold text-on-surface">{state.humidity}%</p>
          </div>
          <div className="w-[1px] h-8 bg-white/10 self-center" />
          <div className="text-center">
            <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mb-1">噪音指数</p>
            <p className="text-lg font-headline font-bold text-green-400">{state.noise}dB</p>
          </div>
        </div>
      </section>

      {/* Right Column: Quick Adjustments */}
      <section className="col-span-3 flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-headline font-extrabold text-on-surface">快速调节</h2>
          <p className="text-xs text-on-surface/40 font-body uppercase">Quick Adjustments</p>
        </header>
        <div className="flex flex-col gap-6">
          <AdjustmentSlider 
            label="灯光亮度" 
            value={state.lightBrightness} 
            onChange={setLightBrightness}
            unit="%" 
            color="primary" 
          />
          <AdjustmentSlider 
            label="座椅角度" 
            value={Math.round((state.seatAngle - 90) / 0.9)} 
            displayValue={state.seatAngle}
            onChange={(v) => setSeatAngle(Math.round(90 + v * 0.9))}
            unit="°" 
            color="secondary" 
          />
          <AdjustmentSlider 
            label="桌板高度" 
            value={Math.round((state.deskHeight - 60) / 0.3)} 
            displayValue={state.deskHeight}
            onChange={(v) => setDeskHeight(Math.round(60 + v * 0.3))}
            unit="cm" 
            color="tertiary" 
          />

          {/* Environment Switcher */}
          <div className="mt-2 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
            <p className="text-[9px] text-on-surface/40 uppercase tracking-widest mb-3">环境预设</p>
            <div className="grid grid-cols-2 gap-2">
              {ENVIRONMENT_PRESETS.map((env) => (
                <motion.button 
                  key={env.id}
                  onClick={() => applyEnvironmentPreset(env.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "py-2 rounded-lg text-[10px] font-bold transition-all border",
                    state.activeEnvironment === env.id 
                      ? "bg-primary/20 border-primary/30 text-primary shadow-[0_0_10px_rgba(255,180,170,0.2)]" 
                      : "bg-white/5 border-white/5 text-on-surface/60 hover:bg-white/10"
                  )}
                >
                  {env.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AdjustmentSlider({ 
  label, 
  value, 
  displayValue,
  unit, 
  color, 
  onChange 
}: { 
  label: string, 
  value: number, 
  displayValue?: number,
  unit: string, 
  color: string,
  onChange: (v: number) => void
}) {
  const colorClass = color === 'primary' ? 'bg-primary' : color === 'secondary' ? 'bg-secondary' : 'bg-tertiary';
  const shadowClass = color === 'primary' ? 'shadow-primary/40' : color === 'secondary' ? 'shadow-secondary/40' : '';

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    onChange(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold text-on-surface")}>{label}</span>
        </div>
        <span className={cn("text-[10px] font-headline font-bold", color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-tertiary')}>
          {displayValue !== undefined ? displayValue : value}{unit}
        </span>
      </div>
      <div 
        onClick={handleClick}
        className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden cursor-pointer group"
      >
        <motion.div 
          animate={{ width: `${value}%` }}
          className={cn("absolute left-0 top-0 h-full", colorClass, shadowClass)} 
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" 
          style={{ left: `calc(${value}% - 6px)` }} 
        />
      </div>
    </div>
  );
}
