import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Armchair, 
  Table, 
  Sun, 
  DoorClosed, 
  HelpCircle, 
  Clock, 
  Wifi, 
  BatteryFull,
  Headphones,
  Power,
  Timer
} from 'lucide-react';
import { cn } from './lib/utils';
import type { Screen } from './types';

// Views
import HomeView from './components/HomeView';
import SeatView from './components/SeatView';
import DeskView from './components/DeskView';
import EnvironmentView from './components/EnvironmentView';
import DoorView from './components/DoorView';
import FocusView from './components/FocusView';
import HelpView from './components/HelpView';

import { PodProvider } from './context/PodContext';

export default function App() {
  return (
    <PodProvider>
      <AppContent />
    </PodProvider>
  );
}

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [feedbackActive, setFeedbackActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerFeedback = useCallback(() => {
    setFeedbackActive(true);
    setTimeout(() => setFeedbackActive(false), 150);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const navItems = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'seat', icon: Armchair, label: '座椅' },
    { id: 'desk', icon: Table, label: '桌面' },
    { id: 'environment', icon: Sun, label: '环境' },
    { id: 'door', icon: DoorClosed, label: '舱门' },
    { id: 'help', icon: HelpCircle, label: '求助' },
  ];

  return (
    <div className={cn(
      "relative w-full h-screen bg-black overflow-hidden flex items-center justify-center transition-all duration-300",
      feedbackActive ? "scale-[0.998] brightness-110" : "scale-100 brightness-100"
    )}>
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full max-w-[177.78vh] h-full max-h-[56.25vw] bg-surface overflow-hidden shadow-2xl border border-white/5 flex flex-col">
        
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full -z-10" />

        {/* Top Status Bar */}
        <header className="relative z-50 flex justify-between items-center px-10 h-16 bg-zinc-900/40 backdrop-blur-3xl border-b border-white/10 shadow-2xl shadow-black/20 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-red-500 font-headline">总控首页</span>
            <div className="h-4 w-[1px] bg-white/10 ml-2" />
            <span className="font-headline tracking-tight text-on-surface/80 text-sm">舱内系统 v4.2</span>
          </div>
          
          <div className="flex items-center gap-6">
            {activeScreen === 'focus' && (
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wider uppercase">预约剩余：01:14:52</span>
              </div>
            )}
            <div className="flex items-center gap-6 text-on-surface/60">
              <div className="flex items-center gap-2 text-primary/80">
                <span className="text-[12px] font-medium">舱体 ID: LIB-082</span>
                <div className="h-3 w-[1px] bg-white/10" />
                <Clock className="w-3.5 h-3.5" />
                <span className="font-headline text-sm font-bold">剩余 45:00</span>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className="w-4.5 h-4.5" />
                <BatteryFull className="w-4.5 h-4.5" />
                <span className="font-headline font-bold text-on-surface ml-2">{formatTime(currentTime)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Side Navigation */}
          <nav className="w-28 flex flex-col py-10 z-40 bg-zinc-900/30 backdrop-blur-2xl border-r border-white/5 shrink-0">
            <div className="flex flex-col items-center mb-10 px-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center overflow-hidden mb-3">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIVpSsqU14ffhhk5nDPGS598-XBpV8zcqDXxEsjm762JrTSs06Dv5LUD15SXN7dTATRVaLtLemk_Ao9XGAfazzblRQhbhGMv7QW6Kq9N76IMA6cDluCgsgEVcMPokgsgJCDOj3C6pcdoHE-Mjhn0NvYLzCZyT_Zy-n5brurgVLvM8sJm6rQ8GWpihjQoYfp3QhsWk6rp3KrSs2hXTwk9sMYW266wVSUr5yiymE2lYgtP9HQZAVc9QAkLDiO_gP9RqEA5coEXIY4tfO" 
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center">
                <h3 className="text-on-surface text-[10px] font-bold">用户资料</h3>
                <p className="text-on-surface/40 text-[8px] uppercase tracking-widest">高级用户</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveScreen(item.id as Screen);
                    triggerFeedback();
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center py-4 rounded-2xl transition-all active:scale-95",
                    activeScreen === item.id 
                      ? "bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(255,59,48,0.2)]" 
                      : "text-on-surface/50 hover:text-on-surface hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 mb-1", activeScreen === item.id && "fill-current")} />
                  <span className="text-[10px] font-medium tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-auto flex flex-col items-center pb-8">
              <div className="w-14 h-14 rounded-full glass-panel flex items-center justify-center border border-white/10">
                <span className="text-primary font-black text-xl">08</span>
              </div>
              <span className="text-[10px] text-on-surface/40 mt-3 font-bold uppercase tracking-widest">舱位 08</span>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full"
              >
                {activeScreen === 'home' && <HomeView onEnterFocus={() => setActiveScreen('focus')} onNavigate={(screen) => setActiveScreen(screen as any)} />}
                {activeScreen === 'seat' && <SeatView />}
                {activeScreen === 'desk' && <DeskView />}
                {activeScreen === 'environment' && <EnvironmentView />}
                {activeScreen === 'door' && <DoorView />}
                {activeScreen === 'help' && <HelpView />}
                {activeScreen === 'focus' && <FocusView onExit={() => setActiveScreen('home')} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Bottom Action Area */}
        <div className="fixed bottom-8 right-8 z-50 flex gap-4">
          <button className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center active:scale-95 duration-200 shadow-primary/40">
            <Headphones className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
