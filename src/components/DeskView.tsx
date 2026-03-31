import React from 'react';
import { Ruler, Compass, RotateCcw, BookOpen, Tablet, Laptop, Box } from 'lucide-react';
import { cn } from '../lib/utils';
import { usePod } from '../context/PodContext';
import { motion } from 'motion/react';

export default function DeskView() {
  const { state, setDeskHeight, setDeskAngle, applySceneMode } = usePod();

  const presets = [
    { id: 'deep-focus', icon: BookOpen, label: '书本阅读' },
    { id: 'work', icon: Laptop, label: '电脑办公' },
    { id: 'relax', icon: Tablet, label: '平板使用' },
    { id: 'sleep', icon: Box, label: '收纳模式' },
  ];

  return (
    <div className="w-full h-full p-6 overflow-hidden relative flex flex-col">
      <div className="max-w-full h-full grid grid-cols-12 gap-6 flex-1">
        {/* Left Column: Height Slider */}
        <div className="col-span-1 flex flex-col items-center justify-center py-4">
          <div className="flex flex-col items-center h-full max-h-[480px] gap-6">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest vertical-rl rotate-180">HEIGHT</span>
            <div className="relative w-10 flex-1 bg-surface-container-high rounded-full p-1.5 border border-white/5 shadow-inner flex items-center justify-center">
              <div className="absolute top-0 bottom-0 w-1.5 bg-white/10 rounded-full" />
              <motion.div 
                drag="y"
                dragConstraints={{ top: 0, bottom: 300 }} // Approximate
                onDrag={(_, info) => {
                  const p = Math.max(0, Math.min(1, info.point.y / 300));
                  setDeskHeight(Math.round(60 + (1 - p) * 30));
                }}
                animate={{ bottom: `${((state.deskHeight - 60) / 30) * 100}%` }}
                className="absolute w-6 h-6 bg-secondary rounded-full border-2 border-white shadow-[0_0_15px_rgba(249,186,130,0.4)] cursor-grab active:cursor-grabbing z-10" 
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-headline font-black text-on-surface leading-none">{state.deskHeight}</span>
              <span className="text-[10px] text-zinc-500 font-bold">cm</span>
            </div>
          </div>
        </div>

        {/* Center Column: Visualizer & Scene Presets */}
        <div className="col-span-8 flex flex-col gap-6 h-full">
          <div className="flex justify-between items-end shrink-0">
            <div>
              <h1 className="text-3xl font-headline font-extrabold text-white tracking-tight">智能全息桌面调节</h1>
              <p className="text-zinc-400 text-sm mt-0.5">当前模式：<span className="text-secondary font-medium">{presets.find(p => p.id === state.currentPreset)?.label || '自定义'}</span></p>
            </div>
            <div className="flex gap-3">
              <InfoCard icon={Ruler} label="桌面高度" value={`${state.deskHeight}cm`} />
              <InfoCard icon={Compass} label="倾斜角度" value={`${state.deskAngle}°`} />
            </div>
          </div>

          <div className="flex-1 glass-panel rounded-[2rem] overflow-hidden relative flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent pointer-events-none" />
            <div className="relative w-[90%] h-[90%] flex items-center justify-center">
              <div className="absolute w-full h-full bg-blue-500/5 blur-[120px] rounded-full" />
              <motion.img 
                key={state.deskHeight + state.deskAngle}
                animate={{ 
                  y: -(state.deskHeight - 72) * 2,
                  rotateX: state.deskAngle 
                }}
                alt="Holographic desk" 
                className="w-full h-full object-contain mix-blend-lighten drop-shadow-[0_0_30px_rgba(249,186,130,0.3)]" 
                src="https://lh3.googleusercontent.com/aida/ADBb0uiruOxcTHcoFNTRaVwhPgRFC5Hmey7TDOPXdxoClAZzgfXmp77WM29gh7ZenYIE_nyOOqfeVPX2gcgRD18dY3IaaP71rZQcFsv5EULk5mXFUCpEXk9VqBXbXhiNz0JktNxUheiOLtwHtdsCkUyjv34dqKE-upa752LsoqziEkESRA3Nt_ebw1Jej6ZrMXn1VZzZKy7kMJnKLY42X7mgRzur3QTylbgQQQL_maen_ZQBdGxdt67YWIVXjTKB2Bc5-w2NA8lY1Y1BJJ8" 
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute top-[35%] left-[25%] pointer-events-none">
                <div className="flex flex-col items-start gap-1 p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 transform -rotate-6">
                  <div className="text-[8px] font-bold text-secondary uppercase">Tilt Sensor</div>
                  <div className="text-xs font-headline font-bold text-white">Active: {state.deskAngle}°</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-black/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl">
              {presets.map((p) => (
                <PresetIcon 
                  key={p.id}
                  icon={p.icon} 
                  label={p.label} 
                  active={state.currentPreset === p.id}
                  onClick={() => applySceneMode(p.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="col-span-3 flex flex-col gap-6 py-2">
          <div className="glass-panel spatial-rim p-6 rounded-[2rem] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Desk Angle</span>
              <span className="text-xl font-headline font-bold text-secondary">{state.deskAngle}°</span>
            </div>
            <div className="space-y-6">
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const p = x / rect.width;
                  setDeskAngle(Math.round(p * 15));
                }}
                className="relative h-1.5 bg-white/10 rounded-full cursor-pointer"
              >
                <motion.div 
                  animate={{ width: `${(state.deskAngle / 15) * 100}%` }}
                  className="absolute h-full bg-secondary rounded-full" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '平整', angle: 0 },
                  { label: '阅读', angle: 15 },
                  { label: '书写', angle: 5 },
                  { label: '绘图', angle: 10 },
                ].map((btn) => (
                  <button 
                    key={btn.label}
                    onClick={() => setDeskAngle(btn.angle)}
                    className={cn(
                      "py-2 rounded-xl text-[10px] font-bold border transition-all",
                      state.deskAngle === btn.angle 
                        ? "bg-secondary/20 border-secondary/30 text-secondary" 
                        : "bg-white/5 border-white/5 text-on-surface/60 hover:bg-white/10"
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 glass-panel spatial-rim rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden relative">
            <div>
              <h3 className="text-xs font-bold text-white mb-4">全息材质模拟</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-secondary/50 p-1 overflow-hidden shrink-0">
                  <div className={cn(
                    "w-full h-full rounded-full transition-colors duration-500",
                    state.deskMaterial === 'walnut' ? "bg-[#8B5A2B]" : "bg-zinc-700"
                  )} />
                </div>
                <div>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Material Profile</p>
                  <p className="text-xs font-medium text-zinc-100">{state.deskMaterial === 'walnut' ? '北美胡桃木 · 磨砂质感' : '碳纤维 · 科技质感'}</p>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
              <button 
                onClick={() => {
                  setDeskHeight(72);
                  setDeskAngle(0);
                }}
                className="w-full py-3.5 bg-white/5 rounded-2xl border border-white/10 text-[11px] font-bold flex items-center justify-center gap-2 group hover:bg-white/10 transition-all"
              >
                <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                重置全息位姿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="glass-panel spatial-rim px-4 py-2.5 rounded-2xl flex items-center gap-3">
      <Icon className="w-5 h-5 text-secondary" />
      <div>
        <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">{label}</div>
        <div className="text-base font-headline font-bold text-on-surface leading-tight">{value}</div>
      </div>
    </div>
  );
}

function PresetIcon({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void, key?: any }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-16 h-16 rounded-3xl transition-all active:scale-95",
        active ? "bg-secondary text-on-secondary shadow-lg shadow-secondary/20" : "bg-white/5 text-zinc-400 hover:bg-white/10"
      )}
    >
      <Icon className="w-6 h-6 mb-0.5" />
      <span className="text-[9px] font-bold">{label}</span>
    </button>
  );
}
