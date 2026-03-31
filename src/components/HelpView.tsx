import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, PhoneCall, MessageSquare, Info, ChevronDown, Wrench, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function HelpView() {
  const [sosState, setSosState] = useState<'idle' | 'confirming' | 'calling'>('idle');
  const [staffState, setStaffState] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "如何调节座椅到最舒适的角度？",
      answer: "您可以在“座椅”面板中选择预设的姿态（如专注、放松），或者使用精密调节滑块微调靠背角度和座椅高度。系统会自动记忆您的偏好。"
    },
    {
      question: "舱内温度感觉不适怎么办？",
      answer: "请前往“环境”面板，使用温度滑块进行调节。系统采用微孔送风技术，调节后约需 30 秒达到设定温度。如果感到闷热，可以点击“净化”按钮加速空气循环。"
    },
    {
      question: "如何连接舱内蓝牙音响？",
      answer: "打开您设备的蓝牙设置，搜索并连接名为“Pod-Audio-08”的设备。连接成功后，舱内系统会自动暂停自带的白噪音。"
    },
    {
      question: "遇到紧急情况如何处理？",
      answer: "请长按左侧的红色 SOS 紧急呼叫按钮 3 秒，系统将立即解锁舱门、开启最大照明，并直接连通场馆安保中心。"
    }
  ];

  // Handle SOS logic
  const handleSosClick = () => {
    if (sosState === 'idle') {
      setSosState('confirming');
    } else if (sosState === 'confirming') {
      setSosState('calling');
      // Simulate emergency response
      setTimeout(() => {
        setSosState('idle');
      }, 5000);
    }
  };

  const cancelSos = () => {
    setSosState('idle');
  };

  // Handle Staff Call
  const handleCallStaff = () => {
    if (staffState === 'idle') {
      setStaffState('calling');
      setTimeout(() => {
        setStaffState('connected');
        setTimeout(() => {
          setStaffState('idle');
        }, 4000);
      }, 2000);
    }
  };

  return (
    <div className="w-full h-full p-12 lg:p-16 relative flex gap-8 overflow-y-auto">
      {/* Left Column: Emergency & Direct Contact */}
      <div className="w-1/3 flex flex-col gap-6">
        <header className="mb-4">
          <h2 className="text-2xl font-headline font-extrabold text-on-surface">求助中心</h2>
          <p className="text-xs text-on-surface/40 font-body uppercase tracking-widest mt-1">Help & Support</p>
        </header>

        {/* SOS Button */}
        <div className="relative glass-panel rounded-2xl p-8 flex flex-col items-center justify-center border border-red-500/20 overflow-hidden min-h-[280px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,59,48,0.1)_0%,transparent_70%)]" />
          
          <AnimatePresence mode="wait">
            {sosState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSosClick}
                  className="w-32 h-32 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(255,59,48,0.2)] hover:bg-red-500/20 hover:shadow-[0_0_50px_rgba(255,59,48,0.4)] transition-all relative group"
                >
                  <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping opacity-20" />
                  <AlertTriangle className="w-12 h-12" />
                </motion.button>
                <h3 className="text-red-500 font-bold text-lg mt-6 tracking-widest">紧急呼叫</h3>
                <p className="text-red-500/60 text-xs mt-2 text-center">仅在遇到突发疾病、火情等<br/>紧急状况时使用</p>
              </motion.div>
            )}

            {sosState === 'confirming' && (
              <motion.div
                key="confirming"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center w-full"
              >
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
                <h3 className="text-red-500 font-bold text-xl mb-2">确认呼叫安保？</h3>
                <p className="text-red-400/80 text-xs text-center mb-8">此操作将解锁舱门并触发警报</p>
                
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={cancelSos}
                    className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-sm font-bold"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSosClick}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(255,59,48,0.4)] transition-all text-sm font-bold"
                  >
                    确认呼叫
                  </button>
                </div>
              </motion.div>
            )}

            {sosState === 'calling' && (
              <motion.div
                key="calling"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-red-500 font-bold text-xl mb-2">已接通安保中心</h3>
                <p className="text-red-400/80 text-sm text-center">请保持冷静，工作人员正赶往 08 号舱</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call Staff Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCallStaff}
          disabled={staffState !== 'idle'}
          className={cn(
            "w-full glass-panel rounded-2xl p-6 flex items-center gap-6 transition-all border",
            staffState === 'idle' ? "border-white/5 hover:bg-white/5" : "border-primary/30 bg-primary/10"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
            staffState === 'idle' ? "bg-white/10 text-white" : "bg-primary text-on-primary"
          )}>
            {staffState === 'idle' && <PhoneCall className="w-6 h-6" />}
            {staffState === 'calling' && <Loader2 className="w-6 h-6 animate-spin" />}
            {staffState === 'connected' && <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div className="text-left flex-1">
            <h3 className={cn("font-bold text-lg", staffState !== 'idle' ? "text-primary" : "text-on-surface")}>
              {staffState === 'idle' && "呼叫客服"}
              {staffState === 'calling' && "正在呼叫..."}
              {staffState === 'connected' && "已接通"}
            </h3>
            <p className="text-xs text-on-surface/50 mt-1">
              {staffState === 'idle' && "需要饮水、清洁或设备协助"}
              {staffState === 'calling' && "请等待客服响应"}
              {staffState === 'connected' && "请通过舱内麦克风通话"}
            </p>
          </div>
        </motion.button>
      </div>

      {/* Right Column: FAQ & System Status */}
      <div className="w-2/3 flex flex-col gap-6">
        {/* System Status Banner */}
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between border border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-green-400 font-bold text-sm">系统运行正常</h3>
              <p className="text-green-400/60 text-xs mt-1">所有硬件设备及网络连接状态良好</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold transition-colors flex items-center gap-2 border border-white/5">
            <Wrench className="w-3.5 h-3.5" />
            运行诊断
          </button>
        </div>

        {/* FAQ Section */}
        <div className="glass-panel rounded-2xl p-8 flex-1 flex flex-col border border-white/5">
          <h3 className="text-lg font-headline font-bold flex items-center gap-2 text-on-surface mb-6">
            <MessageSquare className="w-5 h-5 text-primary" />
            常见问题
          </h3>
          
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={cn(
                  "rounded-xl border transition-all overflow-hidden",
                  expandedFaq === index ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 hover:bg-white/10"
                )}
              >
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className={cn("font-bold text-sm transition-colors", expandedFaq === index ? "text-primary" : "text-on-surface")}>
                    {faq.question}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-on-surface/50 transition-transform duration-300", expandedFaq === index && "rotate-180 text-primary")} />
                </button>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-sm text-on-surface/60 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-on-surface/50">
              <Info className="w-4 h-4" />
              <span className="text-xs">没有找到您的问题？</span>
            </div>
            <button className="text-primary text-xs font-bold hover:underline">
              查看完整使用手册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
