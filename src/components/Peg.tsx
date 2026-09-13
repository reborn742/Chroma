import { motion } from 'motion/react';
import { Color, MatchType } from '../lib/types';
import { cn } from '../lib/utils';
import { Check, MoveHorizontal, X } from 'lucide-react';

export const COLOR_STYLES: Record<Color, { outer: string, inner: string }> = {
  red: { outer: 'border-[#f43f5e]/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]', inner: 'bg-[#f43f5e] shadow-[0_0_40px_rgba(244,63,94,0.8)]' },
  orange: { outer: 'border-[#f97316]/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]', inner: 'bg-[#f97316] shadow-[0_0_40px_rgba(249,115,22,0.8)]' },
  yellow: { outer: 'border-[#fbbf24]/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]', inner: 'bg-[#fbbf24] shadow-[0_0_40px_rgba(251,191,36,0.8)]' },
  green: { outer: 'border-[#10b981]/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]', inner: 'bg-[#10b981] shadow-[0_0_40px_rgba(16,185,129,0.8)]' },
  cyan: { outer: 'border-[#22d3ee]/50 shadow-[0_0_20px_rgba(34,211,238,0.2)]', inner: 'bg-[#22d3ee] shadow-[0_0_40px_rgba(34,211,238,0.8)]' },
  blue: { outer: 'border-[#3b82f6]/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]', inner: 'bg-[#3b82f6] shadow-[0_0_40px_rgba(59,130,246,0.8)]' },
  purple: { outer: 'border-[#c026d3]/50 shadow-[0_0_20px_rgba(192,38,211,0.2)]', inner: 'bg-[#c026d3] shadow-[0_0_40px_rgba(192,38,211,0.8)]' },
  pink: { outer: 'border-[#ec4899]/50 shadow-[0_0_20px_rgba(236,72,153,0.2)]', inner: 'bg-[#ec4899] shadow-[0_0_40px_rgba(236,72,153,0.8)]' },
};

interface PegProps {
  key?: string | number;
  color?: Color;
  match?: MatchType;
  delay?: number;
  isActiveRow?: boolean;
}

export function Peg({ color, match = 'empty', delay = 0, isActiveRow = false }: PegProps) {
  const isEmpty = match === 'empty' && !color;
  const isSubmitted = match !== 'empty';

  const variants = {
    empty: { scale: 1, rotateY: 0, opacity: 1 },
    filled: { scale: 1, rotateY: 0, opacity: 1 },
    exact: { scale: 1, rotateY: 180, opacity: 1 },
    partial: { scale: 1, rotateY: 180, opacity: 1 },
    none: { scale: 0.9, rotateY: 180, opacity: 0.5 }
  };

  let state = 'empty';
  if (color && !isSubmitted) state = 'filled';
  if (isSubmitted) state = match;

  let outerStyle = "border-white/10 bg-white/5";
  let innerStyle = "w-3 h-3 md:w-4 md:h-4 border border-white/20 bg-transparent";

  if (color && !isSubmitted) {
    outerStyle = COLOR_STYLES[color].outer + (isActiveRow ? " bg-white/5" : " bg-white/5 opacity-70");
    innerStyle = COLOR_STYLES[color].inner + " w-6 h-6 md:w-8 md:h-8";
  }

  if (isSubmitted && color) {
    innerStyle = COLOR_STYLES[color].inner + " w-6 h-6 md:w-8 md:h-8";
    if (match === 'exact') {
      outerStyle = `border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-cyan-900/10`;
    } else if (match === 'partial') {
      outerStyle = `border-purple-400/60 shadow-[0_0_20px_rgba(192,38,211,0.2)] bg-purple-900/10`;
    } else if (match === 'none') {
      outerStyle = `border-white/5 bg-transparent`;
      innerStyle = innerStyle.replace(/shadow-\[.*?\]/, ''); // remove glow
    }
  }

  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 relative perspective-1000">
      <motion.div
        variants={variants}
        initial="empty"
        animate={state}
        transition={{ delay: isSubmitted ? delay : 0, duration: 0.5, type: 'spring', bounce: 0.4 }}
        className={cn(
          "w-full h-full border-2 rounded-full flex items-center justify-center relative preserve-3d transition-all duration-300",
          outerStyle
        )}
      >
        <div className={cn("rounded-full transition-all duration-300", innerStyle)}></div>

        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.25 }}
            className="absolute inset-0 flex items-center justify-center backface-hidden z-10 rotate-y-180 pointer-events-none"
          >
            <div className="bg-black/60 rounded-full p-1 shadow-[0_2px_10px_rgba(0,0,0,0.8)] border border-white/20 backdrop-blur-sm">
              {match === 'exact' && <Check size={16} strokeWidth={3.5} className="text-white" />}
              {match === 'partial' && <MoveHorizontal size={16} strokeWidth={3.5} className="text-white" />}
              {match === 'none' && <X size={16} strokeWidth={3.5} className="text-zinc-400" />}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
