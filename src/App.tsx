import { useState } from 'react';
import { ChromaGame } from './components/ChromaGame';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-[#020204] text-white font-mono flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="border-b border-white/5 px-6 py-6 flex items-center justify-between sticky top-0 z-20 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-cyan-400 rotate-45 flex items-center justify-center shrink-0">
            <div className="w-3 h-3 bg-cyan-400"></div>
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">
            Lumina.OS
          </span>
        </div>
        
        <div className="hidden md:flex space-x-8 text-[11px] tracking-[0.3em] uppercase text-zinc-500">
          <div className="flex flex-col items-end">
            <span className="text-zinc-600">Session ID</span>
            <span className="text-cyan-400">#CH-9921-B</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-zinc-600">Status</span>
            <span className="text-white">Active</span>
          </div>
        </div>

        <button 
          onClick={() => setShowInstructions(true)}
          className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-cyan-400 transition-colors border border-white/5 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-400/10 rounded-sm"
          aria-label="How to play"
        >
          <HelpCircle size={20} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center py-6 md:py-8 px-4 overflow-y-auto z-10 relative">
        <ChromaGame />
      </main>

      <footer className="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-sm z-20 relative">
        <div className="flex gap-4 items-center">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-cyan-400"></div>
            <div className="w-1 h-3 bg-cyan-400/40"></div>
            <div className="w-1 h-3 bg-cyan-400/10"></div>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 hidden sm:inline-block">System Status: Optimal</span>
        </div>
        <div className="flex gap-4 sm:gap-8 text-[9px] uppercase tracking-widest text-zinc-600 font-bold">
          <span className="hidden sm:inline-block">Core Zone</span>
          <span>Grid: 44.20.91</span>
          <span className="text-white">Active</span>
        </div>
      </footer>

      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#020204] border border-white/10 p-6 md:p-8 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-cyan-500" />
              
              <h3 className="text-[10px] uppercase text-zinc-500 mb-4 tracking-widest">Documentation</h3>
              <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-wider">Initialization</h2>
              <p className="text-zinc-400 mb-6 text-xs leading-relaxed uppercase">
                Harmonize the sequence of 5 color signals in 6 attempts. Analyze the feedback to deduce the correct alignment.
              </p>
              
              <ul className="space-y-4 text-xs text-zinc-300 mb-8 uppercase">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 border-2 border-cyan-400/50 flex items-center justify-center shrink-0 bg-white/5 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <div className="w-3 h-3 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
                  </div>
                  <div>
                    <span className="font-bold text-cyan-400 text-xs block mb-1 tracking-widest">Aligned (Exact Match)</span>
                    <span className="text-[10px] text-zinc-500">Correct signal & position.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 border-2 border-purple-400/50 flex items-center justify-center shrink-0 bg-white/5 shadow-[0_0_15px_rgba(192,38,211,0.2)]">
                    <div className="w-3 h-3 bg-purple-400 shadow-[0_0_15px_rgba(192,38,211,0.8)]"></div>
                  </div>
                  <div>
                    <span className="font-bold text-purple-400 text-xs block mb-1 tracking-widest">Phase-Shift (Partial)</span>
                    <span className="text-[10px] text-zinc-500">Correct signal, wrong position.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 border border-white/10 flex items-center justify-center shrink-0 bg-white/5">
                    <div className="w-2 h-2 border border-white/20"></div>
                  </div>
                  <div>
                    <span className="font-bold text-zinc-500 text-xs block mb-1 tracking-widest">Void (No Match)</span>
                    <span className="text-[10px] text-zinc-500">Signal not present in sequence.</span>
                  </div>
                </li>
              </ul>
              
              <div className="bg-white/5 p-4 border border-white/10 mb-6">
                <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-wider">
                  <span className="text-cyan-400 font-bold">WARNING:</span> Signals may repeat. Keyboard interface (1-8) active.
                </p>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full py-4 border border-cyan-400/50 bg-cyan-400/10 text-cyan-400 text-xs tracking-[0.5em] font-bold uppercase hover:bg-cyan-400 hover:text-black transition-all duration-300"
              >
                Acknowledge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
