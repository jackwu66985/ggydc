import { ShieldCheck, ChevronRight, EyeOff, Grid, LogOut, Lock, Info, Unlock } from 'lucide-react';
import { cn } from '../lib/utils';
import { usePod } from '../context/PodContext';
import { motion, useMotionValue, useTransform } from 'motion/react';

export default function DoorView() {
  const { state, setIsLocked } = usePod();
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 300], [0.4, 0]);
  const scale = useTransform(x, [0, 300], [1, 0.8]);

  const handleDragEnd = () => {
    if (x.get() > 250) {
      setIsLocked(false);
    } else {
      x.set(0);
    }
  };

  return (
    <div className="w-full h-full p-14 flex gap-12 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_rgba(255,180,170,0.05)_0%,_transparent_70%)]">
      {/* Left Section: Door Status Visualizer */}
      <section className="flex-1 flex flex-col">
        <div className="flex-1 glass-panel rounded-[2.5rem] spatial-rim relative overflow-hidden flex flex-col items-center justify-center group">
          {/* Status Background Image */}
          <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-700">
            <img 
              alt="舱门状态" 
              className="w-full h-full object-cover scale-110 blur-sm" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFfBHx4dNEDKPrl072wtOddX3sRXA-yJA7YbR6vR_waIkIeLYm3W6ewpozd5ygr5eFhJfzHzl5Bv1plxxpZckyoPC_04ysc7wcel9f45pWDDfbKu9l2-TGhOuErFBpfzhAR1nO0uG8Nr2G9-uQF-6YYWOOva3QJFWphYxYsPloplJ1j4EaNASG723TZVjPeCX8DQwbuPVyLh_qIRqAHJfisWuxeGASxycG5CRbOANsT-euhbNF_Tzyl-5dOCfs0xVNBszvLzehij5V" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/40" />
          </div>

          {/* Door Schematic */}
          <div className="relative w-72 h-[420px] border-4 border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md bg-white/5 shadow-inner">
            <motion.div 
              animate={{ x: state.isLocked ? 0 : -100 }}
              className="absolute inset-y-0 left-0 w-1/2 bg-white/5 border-r border-white/10 rounded-l-[20px]" 
            />
            <motion.div 
              animate={{ x: state.isLocked ? 0 : 100 }}
              className="absolute inset-y-0 right-0 w-1/2 bg-white/5 border-l border-white/10 rounded-r-[20px]" 
            />
            <div className="z-10 bg-white/10 p-10 rounded-full border border-white/20 shadow-2xl backdrop-blur-xl">
              {state.isLocked ? (
                <Lock className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(255,180,170,0.5)] fill-current" />
              ) : (
                <Unlock className="w-16 h-16 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] fill-current" />
              )}
            </div>
          </div>

          <div className="mt-10 text-center relative z-10">
            <h2 className={cn("text-4xl font-headline font-extrabold mb-3 tracking-tight", state.isLocked ? "text-primary" : "text-green-400")}>
              {state.isLocked ? "舱门已锁定" : "舱门已解锁"}
            </h2>
            <p className="text-zinc-300 font-body text-lg">
              {state.isLocked ? "舱内环境已进入私密模式，外界无法开启" : "您可以随时离开，舱内设置将自动保存"}
            </p>
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
          
          {state.isLocked ? (
            <div className="relative h-24 bg-black/40 rounded-full border border-white/5 flex items-center p-2.5 group overflow-hidden">
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
            </div>
          ) : (
            <button 
              onClick={() => setIsLocked(true)}
              className="w-full h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center gap-4 text-green-400 font-headline font-bold text-xl hover:bg-green-500/20 transition-all"
            >
              <Lock className="w-6 h-6" />
              重新锁定舱门
            </button>
          )}
        </div>

        {/* Privacy Glass */}
        <div className="glass-panel rounded-[2rem] spatial-rim p-10 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <EyeOff className="w-8 h-8 text-secondary" />
              <h3 className="font-headline font-bold text-2xl">隐私玻璃</h3>
            </div>
            <div className="w-20 h-10 bg-secondary/20 rounded-full relative p-1.5 cursor-pointer border border-secondary/20">
              <div className="h-7 w-7 bg-secondary rounded-full ml-auto shadow-lg shadow-secondary/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white/5 rounded-[1.5rem] border border-white/5 opacity-40 hover:opacity-60 transition-all cursor-pointer">
              <EyeOff className="w-10 h-10" />
              <span className="font-label text-base">全透明</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-secondary/15 rounded-[1.5rem] border border-secondary/30 ring-4 ring-secondary/5 transition-all cursor-pointer">
              <Grid className="w-10 h-10 text-secondary" />
              <span className="font-label text-base text-secondary font-bold">磨砂雾化</span>
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
    </div>
  );
}
