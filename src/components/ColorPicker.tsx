import { motion } from 'motion/react';
import { Color } from '../lib/types';
import { COLOR_STYLES } from './Peg';
import { cn } from '../lib/utils';
import { Delete, Radar } from 'lucide-react';

interface ColorPickerProps {
  onSelect: (color: Color) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onRequestClue: () => void;
  disabled: boolean;
  canSubmit: boolean;
  colors: Color[];
  cluesRemaining: number;
  currentGuessLength: number;
}

export function ColorPicker({ onSelect, onDelete, onSubmit, onRequestClue, disabled, canSubmit, colors, cluesRemaining, currentGuessLength }: ColorPickerProps) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 mt-8 font-mono">
      <div className="flex justify-center gap-3 sm:gap-4 flex-wrap px-4">
        {colors.map((color) => (
          <motion.button
            key={color}
            whileHover={{ scale: disabled ? 1 : 1.1 }}
            whileTap={{ scale: disabled ? 1 : 0.9 }}
            onClick={() => onSelect(color)}
            disabled={disabled}
            className={cn(
              "group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all bg-white/5",
              COLOR_STYLES[color].outer,
              disabled ? "opacity-30 cursor-not-allowed shadow-none" : "cursor-pointer hover:bg-white/10"
            )}
            aria-label={`Select ${color}`}
          >
             <div className={cn("w-4 h-4 sm:w-5 sm:h-5 rounded-full", COLOR_STYLES[color].inner)}></div>
             <div className={cn(
               "absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-200 pointer-events-none px-3 py-1.5 bg-[#020204] border border-white/10 text-[9px] uppercase tracking-[0.2em] text-zinc-300 whitespace-nowrap z-50 shadow-[0_0_15px_rgba(0,0,0,0.8)]",
               !disabled && "group-hover:opacity-100"
             )}>
               {color}
             </div>
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-center gap-2 sm:gap-4 mt-2 px-4">
        <motion.button
          whileHover={{ scale: (disabled || currentGuessLength === 0) ? 1 : 1.05 }}
          whileTap={{ scale: (disabled || currentGuessLength === 0) ? 1 : 0.95 }}
          onClick={onDelete}
          disabled={disabled || currentGuessLength === 0}
          className="flex items-center justify-center p-4 border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Backspace"
        >
          <Delete size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: (disabled || cluesRemaining === 0) ? 1 : 1.02 }}
          whileTap={{ scale: (disabled || cluesRemaining === 0) ? 1 : 0.98 }}
          onClick={onRequestClue}
          disabled={disabled || cluesRemaining === 0}
          className="flex items-center gap-2 px-4 py-4 border border-purple-500/50 bg-purple-500/10 text-purple-400 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] uppercase hover:bg-purple-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Radar size={16} />
          <span className="hidden sm:inline">Analyze ({cluesRemaining})</span>
          <span className="sm:hidden">{cluesRemaining}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: (!canSubmit || disabled) ? 1 : 1.02 }}
          whileTap={{ scale: (!canSubmit || disabled) ? 1 : 0.98 }}
          onClick={onSubmit}
          disabled={!canSubmit || disabled}
          className={cn(
            "flex-1 flex items-center justify-center px-6 py-4 text-xs tracking-[0.5em] font-bold uppercase transition-all border",
            canSubmit && !disabled 
              ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400 hover:text-black cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
              : "border-zinc-800 bg-zinc-900/50 text-zinc-600 cursor-not-allowed"
          )}
        >
          <span>Initialize</span>
        </motion.button>
      </div>
    </div>
  );
}
