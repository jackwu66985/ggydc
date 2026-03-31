import React from 'react';
import { Sliders, Zap, Thermometer, Droplets, VolumeX, Sparkles, BookOpen, BellOff, Bed } from 'lucide-react';
import { SCENE_MODES } from '../constants';
import { cn } from '../lib/utils';
import { usePod } from '../context/PodContext';
import { motion } from 'motion/react';

const iconMap: Record<string, any> = {
  Sparkles,
  BookOpen,
  BellOff,
  Bed
};

export default function SeatView() {
  const { state, setSeatAngle, applySceneMode } = usePod();

  return (
    <div className="w-full h-full p-12 lg:p-16 relative flex gap-16 overflow-y-auto">
      {/* Left: Visual Entity */}
      <div className="w-1/2 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,59,48,0.05)_0%,transparent_70%)] rounded-full blur-[120px]" />
        
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
          {/* Schematic Seat Visualization */}
          <div className="relative w-80 h-96 flex items-center justify-center">
            {/* Seat Base / Pedestal */}
            <div className="absolute bottom-10 w-48 h-16 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-t-[3rem] border-t border-white/10 shadow-2xl" />
            <div className="absolute bottom-0 w-64 h-10 bg-zinc-900 rounded-full blur-md opacity-50" />
            
            {/* Seat Frame / Support */}
            <div className="absolute bottom-24 w-12 h-32 bg-zinc-800 rounded-full border border-white/5 shadow-inner" />

            {/* Seat Cushion */}
            <div className="absolute bottom-32 w-64 h-12 bg-zinc-800 rounded-[2rem] border border-white/10 shadow-2xl z-20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500/20" />
            </div>

            {/* Backrest - This is what rotates */}
            <motion.div 
              initial={false}
              animate={{ 
                rotate: state.seatAngle - 90,
                transition: { type: "spring", stiffness: 50, damping: 15 }
              }}
              style={{ 
                transformOrigin: 'bottom center',
                bottom: '140px', // Positioned at the pivot point
                left: 'calc(50% - 24px)', // Centered (half of width)
              }}
              className="absolute w-12 h-72 z-10"
            >
              {/* Backrest Visuals */}
              <div className="w-full h-full bg-zinc-800 rounded-full border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                {/* Headrest area */}
                <div className="absolute top-4 left-2 right-2 h-20 bg-zinc-700/50 rounded-full border border-white/5" />
                {/* Lumbar support area */}
                <div className="absolute bottom-12 left-2 right-2 h-32 bg-zinc-700/30 rounded-full" />
                {/* Glowing accent */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500/30 shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
              </div>
            </motion.div>

            {/* Pivot Joint Glow */}
            <div className="absolute bottom-[130px] w-8 h-8 bg-red-500/20 rounded-full blur-sm z-30 animate-pulse border border-red-500/40" />
          </div>

          {/* Angle Display Badge */}
          <div className="absolute -top-4 -right-4 w-32 h-32 glass-panel rounded-full flex items-center justify-center border border-red-500/20 z-40">
            <div className="text-center">
              <motion.div 
                key={state.seatAngle}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-red-500 font-headline text-xl font-bold"
              >
                {state.seatAngle}°
              </motion.div>
              <div className="text-[10px] text-zinc-400">当前仰角</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Control Panel */}
      <div className="w-1/2 flex flex-col gap-8 justify-center">
        <div className="glass-panel rounded-xl p-8 space-y-8">
          <h3 className="text-lg font-headline font-bold flex items-center gap-2 text-on-surface">
            <Sliders className="w-5 h-5 text-secondary" />
            精密调节
          </h3>
          <div className="space-y-6">
            <SliderItem 
              label="靠背角度" 
              value={`${state.seatAngle}°`} 
              progress={((state.seatAngle - 90) / 90) * 100} 
              onChange={(p) => setSeatAngle(Math.round(90 + (p / 100) * 90))}
            />
            <SliderItem label="座椅高度" value="48cm" progress={45} />
            <SliderItem label="脚托伸缩" value="22%" progress={22} />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-8 space-y-6">
          <h3 className="text-lg font-headline font-bold flex items-center gap-2 text-on-surface">
            <Zap className="w-5 h-5 text-red-500" />
            姿态预设
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {SCENE_MODES.map((mode) => {
              const Icon = iconMap[mode.icon];
              return (
                <PresetButton 
                  key={mode.id}
                  icon={Icon} 
                  label={mode.name} 
                  active={state.currentPreset === mode.id}
                  onClick={() => applySceneMode(mode.id)}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <StatCard icon={Thermometer} label="温度" value={`${state.temperature.toFixed(1)}°C`} color="blue" />
          <StatCard icon={Droplets} label="湿度" value={`${state.humidity}%`} color="cyan" />
          <StatCard icon={VolumeX} label="环境噪声" value={`${state.noise} dB`} color="green" />
        </div>
      </div>
    </div>
  );
}

function SliderItem({ label, value, progress, onChange }: { label: string, value: string, progress: number, onChange?: (p: number) => void }) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = Math.round((x / rect.width) * 100);
    onChange(Math.max(0, Math.min(100, p)));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="text-secondary font-mono">{value}</span>
      </div>
      <div 
        onClick={handleClick}
        className={cn("relative h-1.5 bg-white/5 rounded-full overflow-hidden", onChange && "cursor-pointer")}
      >
        <motion.div 
          animate={{ width: `${progress}%` }}
          className="absolute h-full bg-secondary rounded-full" 
        />
      </div>
    </div>
  );
}

function PresetButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void, key?: any }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-5 rounded-xl transition-all",
        active 
          ? "bg-red-500/20 border border-red-500/30 shadow-[0_0_20px_rgba(255,59,48,0.3)]" 
          : "glass-panel hover:bg-white/5 border border-white/5"
      )}
    >
      <Icon className={cn("w-6 h-6", active ? "text-red-500" : "text-zinc-400")} />
      <span className={cn("text-xs", active ? "text-red-400 font-bold" : "text-zinc-400")}>{label}</span>
      {active && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,59,48,0.8)]" />}
    </motion.button>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    green: 'text-green-400 bg-green-500/10',
  };

  return (
    <div className="glass-panel rounded-xl p-4 flex items-center gap-4">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[10px] text-zinc-500 uppercase">{label}</div>
        <div className="text-sm font-bold font-headline text-on-surface">{value}</div>
      </div>
    </div>
  );
}
