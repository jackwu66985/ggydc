import { useState, useEffect } from 'react';
import { Timer, Pause, Play, Square, BarChart3, PlusCircle, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { FOCUS_PRESETS } from '../constants';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

interface FocusViewProps {
  onExit: () => void;
}

export default function FocusView({ onExit }: FocusViewProps) {
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [activePresetId, setActivePresetId] = useState<string>(FOCUS_PRESETS[1].id);

  // Timer and Progress State
  const [seconds, setSeconds] = useState(45 * 60); // Start at 45 mins for demo
  const [isPaused, setIsPaused] = useState(false);
  const goalMinutes = 60;
  const goalWords = goalMinutes * 250; // Assuming 250 words per minute

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const wordsRead = Math.floor((seconds / 60) * 250);
  const minutesRead = Math.floor(seconds / 60);
  const progressPercent = Math.min(100, (seconds / (goalMinutes * 60)) * 100);

  useEffect(() => {
    const generateSummary = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "请为这段阅读内容生成一个简短的摘要（约50字）：'读书不是为了雄辩和驳斥，也不是为了轻信和盲从，而是为了衡量和思考。世界上所有的夜晚，都有读书人在灯下。阅读是一种深度的自我对话，它让我们在喧嚣的世界中找到宁静。'",
        });
        setSummary(response.text || "无法生成摘要。");
      } catch (error) {
        console.error("AI Summary Error:", error);
        setSummary("摘要生成失败，请稍后重试。");
      } finally {
        setIsGenerating(false);
      }
    };

    generateSummary();
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {FOCUS_PRESETS.map(preset => (
          <img 
            key={preset.id}
            src={preset.image} 
            alt="" 
            className={cn(
              "absolute inset-0 w-full h-full object-cover blur-[80px] scale-125 transition-opacity duration-1000 ease-in-out",
              preset.id === activePresetId ? "opacity-40" : "opacity-0"
            )}
            referrerPolicy="no-referrer"
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,85,69,0.05)_0%,_transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full h-full p-12 flex flex-col justify-between">
        {/* Center Focus Timer */}
        <section className="flex flex-col items-center justify-center flex-1 w-full max-w-5xl mx-auto">
        <h2 className="text-zinc-500 text-xs font-bold tracking-[0.5em] mb-4 uppercase opacity-60">Focus Session</h2>
        <div className="text-[14rem] font-headline font-extralight tracking-tighter leading-none text-white timer-glow select-none">
          {formatTime(seconds)}
        </div>
        
        {/* Reading Progress Indicator */}
        <div className="w-full max-w-2xl mt-12 flex flex-col gap-4">
          <div className="flex justify-between text-sm font-bold tracking-widest uppercase text-zinc-500">
            <span>Reading Progress</span>
            <span className="text-primary">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary shadow-[0_0_20px_rgba(255,85,69,0.8)] transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-medium text-zinc-600 uppercase tracking-wider">
            <span>{wordsRead.toLocaleString()} words read</span>
            <span>Goal: {goalWords.toLocaleString()} words</span>
          </div>
        </div>

        <div className="flex gap-10 mt-12">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="w-20 h-20 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/15 transition-all active:scale-90 border border-white/10"
          >
            {isPaused ? <Play className="w-10 h-10 ml-1" /> : <Pause className="w-10 h-10" />}
          </button>
          <button 
            onClick={onExit}
            className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-all active:scale-90 shadow-[0_0_50px_rgba(255,180,170,0.35)]"
          >
            <Square className="w-10 h-10 fill-current" />
          </button>
        </div>
      </section>

      {/* Bottom Control Grid */}
      <div className="w-full grid grid-cols-12 gap-8 items-stretch pb-4">
        {/* Statistics Card */}
        <div className="col-span-4 glass-panel rounded-full p-8 flex flex-col justify-center spatial-rim">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase">阅读统计</h3>
            <BarChart3 className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-4xl font-headline font-bold text-on-surface">{wordsRead.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-500 font-bold mt-2 uppercase tracking-wide">本次阅读字数</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-headline font-bold text-on-surface">{minutesRead}</div>
              <div className="text-[10px] text-zinc-500 font-bold mt-2 uppercase tracking-wide">已累计分钟</div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary shadow-[0_0_15px_rgba(255,180,170,0.6)] transition-all duration-1000 ease-linear" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Environment Presets */}
        <div className="col-span-5 glass-panel rounded-full p-8 spatial-rim">
          <h3 className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">专注环境</h3>
          <div className="flex gap-6">
            {FOCUS_PRESETS.map((preset) => (
              <div 
                key={preset.id}
                onClick={() => setActivePresetId(preset.id)}
                className={cn(
                  "flex-1 relative group cursor-pointer overflow-hidden rounded-3xl aspect-[4/5] transition-all active:scale-95 border",
                  preset.id === activePresetId ? "ring-2 ring-primary border-transparent" : "border-white/5"
                )}
              >
                <img 
                  alt={preset.name} 
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110",
                    preset.id === activePresetId ? "opacity-70" : "opacity-40"
                  )} 
                  src={preset.image} 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="text-xs font-bold text-white">{preset.name}</div>
                  <div className="text-[8px] text-zinc-400 font-medium tracking-tighter">{preset.label}</div>
                </div>
                {preset.id === activePresetId && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-4 h-4 text-primary fill-current" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes & AI Summary Column */}
        <div className="col-span-3 flex flex-col gap-6">
          {/* Notes Card */}
          <div className="flex-1 glass-panel rounded-[2.5rem] p-8 flex flex-col spatial-rim overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase">灵感摘录</h3>
              <button className="text-primary hover:text-white transition-colors">
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
              <div className="p-5 rounded-3xl bg-white/5 border-l-4 border-primary/50">
                <p className="text-[11px] text-zinc-300 leading-relaxed italic font-light">“读书不是为了雄辩和驳斥，也不是为了轻信和盲从，而是为了衡量和思考。”</p>
                <span className="block text-[8px] text-zinc-500 mt-3 font-bold uppercase">— 弗朗西斯·培根</span>
              </div>
              <div className="p-5 rounded-3xl bg-white/5 border-l-4 border-white/10">
                <p className="text-[11px] text-zinc-300 leading-relaxed italic font-light">“世界上所有的夜晚，都有读书人在灯下。”</p>
                <span className="block text-[8px] text-zinc-500 mt-3 font-bold uppercase">— 21:05</span>
              </div>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="h-44 glass-panel rounded-[2.5rem] p-8 flex flex-col spatial-rim overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase">AI 总结</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <p className="text-[10px] text-zinc-400 font-medium animate-pulse">AI 正在为您生成阅读摘要...</p>
                </div>
              ) : (
                <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                  {summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
