import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface SuccessOverlayProps {
  onRestart: () => void;
  attempts: number;
}

export function SuccessOverlay({ onRestart, attempts }: SuccessOverlayProps) {
  const [particles, setParticles] = useState<Array<any>>([]);

  useEffect(() => {
    // Generate some deterministic but random-looking particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      color: Math.random() > 0.5 ? 'bg-cyan-400' : 'bg-purple-400'
    }));
    setParticles(newParticles);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020204]/95 backdrop-blur-xl font-mono overflow-hidden"
    >
      {/* Background Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.color} shadow-[0_0_15px_currentColor]`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: [0, 0.8, 0], y: -200 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* Sweeping scanline */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent w-full h-[20%]"
        animate={{ top: ['-20%', '120%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
        className="relative z-10 flex flex-col items-center p-8 md:p-12 border border-cyan-400/30 bg-black/50 shadow-[0_0_100px_rgba(34,211,238,0.2)] max-w-lg w-full mx-4 text-center"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-cyan-400" />
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-purple-500" />
        
        <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          Core Stabilized
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm tracking-widest uppercase mb-10">
          Resonance achieved in {attempts} cycle{attempts !== 1 ? 's' : ''}.
        </p>

        <button 
          onClick={onRestart}
          className="w-full py-4 border border-cyan-400/50 bg-cyan-400/10 text-cyan-400 text-xs tracking-[0.5em] font-bold uppercase hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          Restart Cycle
        </button>
      </motion.div>
    </motion.div>
  );
}
