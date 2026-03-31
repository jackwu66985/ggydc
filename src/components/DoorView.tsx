import { ShieldCheck, ChevronRight, EyeOff, Grid, LogOut, Lock, Info, Unlock, AlertTriangle, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { usePod } from '../context/PodContext';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function DoorView() {
  const { state, setIsLocked, setPrivacyLevel } = usePod();
  const [showConfirm, setShowConfirm] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 300], [0.4, 0]);
  const scale = useTransform(x, [0, 300], [1, 0.8]);

  const handleDragEnd = () => {
    if (x.get() > 250) {
      setShowConfirm(true);
      x.set(0);
    } else {
      x.set(0);
    }
  };

  const confirmUnlock = () => {
    setIsLocked(false);
    setShowConfirm(false);
  };

  return (
    <div className="w-full h-full p-14 flex gap-12 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_rgba(255,180,170,0.05)_0%,_transparent_70%)]">
      {/* Left Section: Door Status Visualizer */}
      <section className="flex-1 flex flex-col">
        <div className="flex-1 glass-panel rounded-[2.5rem] spatial-rim relative overflow-hidden flex flex-col items-center justify-center group">
          {/* Status Background Image */}
          <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: 0.2 + (state.privacyLevel / 100) * 0.3 }}>
            <img 
              alt="舱门状态" 
              className="w-full h-full object-cover scale-110 blur-sm" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFfBHx4dNEDKPrl072wtOddX3sRXA-yJA7YbR6vR_waIkIeLYm3W6ewpozd5ygr5eFhJfzHzl5Bv1plxxpZckyoPC_04ysc7wcel9f45pWDDfbKu9l2-TGhOuErFBpfzhAR1nO0uG8Nr2G9-uQF-6YYWOOva3QJFWphYxYsPloplJ1j4EaNASG723TZVjPeCX8DQwbuPVyLh_qIRqAHJfisWuxeGASxycG5CRbOANsT-euhbNF_Tzyl-5dOCfs0xVNBszvLzehij5V" 
              referrerPolicy="no-referrer"
            />
            {/* Privacy Glass Overlay */}
            <div 
              className="absolute inset-0 bg-white/20 backdrop-blur-3xl transition-all duration-500" 
              style={{ 
                opacity: state.privacyLevel / 100,
                backdropFilter: `blur(${state.privacyLevel * 0.4}px)`
              }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/40" />
          </div>

          {/* Door Schematic */}
          <div className="relative w-72 h-[420px] border-4 border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md bg-white/5 shadow-inner overflow-hidden">
            {/* Background Glow based on state */}
            <AnimatePresence>
              <motion.div
                key={state.isLocked ? 'locked-bg' : 'unlocked-bg'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "absolute inset-0 blur-3xl",
                  state.isLocked ? "bg-primary" : "bg-green-400"
                )}
              />
            </AnimatePresence>

            <motion.div 
              animate={{ 
                x: state.isLocked ? 0 : -120,
                transition: { type: "spring", stiffness: 100, damping: 20 }
              }}
              className="absolute inset-y-0 left-0 w-1/2 bg-white/10 border-r border-white/20 rounded-l-[20px] z-10" 
            />
            <motion.div 
              animate={{ 
                x: state.isLocked ? 0 : 120,
                transition: { type: "spring", stiffness: 100, damping: 20 }
              }}
              className="absolute inset-y-0 right-0 w-1/2 bg-white/10 border-l border-white/20 rounded-r-[20px] z-10" 
            />
            
            <motion.div 
              layout
              className={cn(
                "z-20 p-10 rounded-full border shadow-2xl backdrop-blur-2xl transition-colors duration-500",
                state.isLocked 
                  ? "bg-primary/20 border-primary/40 shadow-primary/20" 
                  : "bg-green-400/20 border-green-400/40 shadow-green-400/20"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.isLocked ? 'lock' : 'unlock'}
                  initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.5, opacity: 0, rotate: 45 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {state.isLocked ? (
                    <Lock className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(255,180,170,0.8)] fill-current" />
                  ) : (
                    <Unlock className="w-16 h-16 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] fill-current" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Impact particles on lock */}
            {state.isLocked && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 border-4 border-primary/50 rounded-3xl z-30 pointer-events-none"
              />
            )}
          </div>

          <div className="mt-10 text-center relative z-10">
            <AnimatePresence mode="wait">
              <motion.h2 
                key={state.isLocked ? 'locked-text' : 'unlocked-text'}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className={cn("text-4xl font-headline font-extrabold mb-3 tracking-tight", state.isLocked ? "text-primary" : "text-green-400")}
              >
                {state.isLocked ? "舱门已锁定" : "舱门已解锁"}
              </motion.h2>
            </AnimatePresence>
            <motion.p 
              animate={{ opacity: [0.5, 1] }}
              className="text-zinc-300 font-body text-lg max-w-md"
            >
              {state.isLocked ? "舱内环境已进入私密模式，外界无法开启" : "您可以随时离开，舱内设置将自动保存"}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Right Section: Controls */}
      <aside className="w-[480px] flex flex-col gap-8">
        {/* Security Lock */}
        <div className="glass-panel rounded-[2rem] spatial-rim p-10 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h3 className="font-headline font-bold text-2xl">安全控制</h3>
          </div>
          
          <AnimatePresence mode="wait">
            {state.isLocked ? (
              <motion.div 
                key="locked-slider"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative h-24 bg-black/40 rounded-full border border-white/5 flex items-center p-2.5 group overflow-hidden"
              >
                <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-zinc-500 font-medium tracking-widest text-base uppercase opacity-40 group-hover:opacity-100 transition-opacity">滑动以解锁舱门</span>
                </motion.div>
                <motion.div 
                  drag="x"
                  dragConstraints={{ left: 0, right: 350 }}
                  style={{ x }}
                  onDragEnd={handleDragEnd}
                  className="h-[74px] w-[74px] bg-primary rounded-full flex items-center justify-center text-on-primary shadow-[0_0_30px_rgba(255,180,170,0.5)] cursor-grab active:cursor-grabbing transition-shadow hover:brightness-110 z-10"
                >
                  <ChevronRight className="w-8 h-8 font-bold" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.button 
                key="unlocked-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setIsLocked(true)}
                className="w-full h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center gap-4 text-green-400 font-headline font-bold text-xl hover:bg-green-500/20 transition-all"
              >
                <Lock className="w-6 h-6" />
                重新锁定舱门
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy Glass */}
        <div className="glass-panel rounded-[2rem] spatial-rim p-10 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <EyeOff className="w-8 h-8 text-secondary" />
              <h3 className="font-headline font-bold text-2xl">隐私玻璃</h3>
            </div>
            <span className="text-secondary font-headline font-bold text-xl">{state.privacyLevel}%</span>
          </div>

          {/* Privacy Level Slider */}
          <div 
            className="relative h-4 bg-white/5 rounded-full overflow-hidden cursor-pointer group"
            onMouseMove={(e) => {
              if (e.buttons !== 1) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = Math.round((x / rect.width) * 100);
              setPrivacyLevel(Math.max(0, Math.min(100, percentage)));
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = Math.round((x / rect.width) * 100);
              setPrivacyLevel(Math.max(0, Math.min(100, percentage)));
            }}
          >
            <motion.div 
              animate={{ width: `${state.privacyLevel}%` }}
              className="absolute h-full bg-secondary rounded-full" 
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100 transition-opacity" 
              style={{ left: `calc(${state.privacyLevel}% - 12px)` }} 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div 
              onClick={() => setPrivacyLevel(0)}
              className={cn(
                "flex flex-col items-center justify-center gap-4 p-8 rounded-[1.5rem] transition-all cursor-pointer",
                state.privacyLevel === 0 
                  ? "bg-white/20 border border-white/30 ring-4 ring-white/10" 
                  : "bg-white/5 border border-white/5 opacity-40 hover:opacity-60"
              )}
            >
              <EyeOff className="w-10 h-10" />
              <span className="font-label text-base">全透明</span>
            </div>
            <div 
              onClick={() => setPrivacyLevel(100)}
              className={cn(
                "flex flex-col items-center justify-center gap-4 p-8 rounded-[1.5rem] transition-all cursor-pointer",
                state.privacyLevel === 100 
                  ? "bg-secondary/20 border border-secondary/40 ring-4 ring-secondary/10" 
                  : "bg-secondary/5 border border-secondary/10 opacity-40 hover:opacity-60"
              )}
            >
              <Grid className={cn("w-10 h-10", state.privacyLevel === 100 ? "text-secondary" : "text-zinc-400")} />
              <span className={cn("font-label text-base font-bold", state.privacyLevel === 100 ? "text-secondary" : "text-zinc-400")}>完全雾化</span>
            </div>
          </div>
          <p className="text-sm text-zinc-500 italic text-center">雾化模式可有效阻隔视线，同时保留采光亮度。</p>
        </div>

        <div className="flex-grow" />

        <div className="flex flex-col gap-4">
          <button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white py-8 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all active:scale-95 font-headline font-bold text-xl shadow-2xl shadow-red-950/40 border border-white/10">
            <LogOut className="w-6 h-6" />
            结束使用并开门
          </button>
          <div className="flex items-center justify-center gap-3 text-zinc-500">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">点击后将结算本次阅读时长并重置舱内设置</span>
          </div>
        </div>
      </aside>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-panel rounded-[2.5rem] spatial-rim p-12 flex flex-col items-center text-center gap-8 shadow-2xl"
            >
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                <AlertTriangle className="w-12 h-12 text-primary" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-headline font-bold text-white">确认解锁舱门？</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  解锁后舱内环境将恢复至待机状态。如果您正在阅读，建议保持锁定以维持最佳专注环境。
                </p>
              </div>

              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  取消
                </button>
                <button 
                  onClick={confirmUnlock}
                  className="flex-1 py-6 rounded-2xl bg-primary text-on-primary font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  确认解锁
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
