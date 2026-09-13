import { useState, useEffect, useCallback } from 'react';
import { Color, MatchType } from '../lib/types';
import { generateTarget, checkGuess, COLORS } from '../lib/gameLogic';
import { Peg } from './Peg';
import { ColorPicker } from './ColorPicker';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../lib/audio';
import { SuccessOverlay } from './SuccessOverlay';

const SEQUENCE_LENGTH = 5;
const MAX_ATTEMPTS = 6;

export function ChromaGame() {
  const [target, setTarget] = useState<Color[]>([]);
  const [guesses, setGuesses] = useState<Color[][]>([]);
  const [results, setResults] = useState<MatchType[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<Color[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [invalidShake, setInvalidShake] = useState(false);
  const [clues, setClues] = useState<string[]>([]);
  const [cluesRemaining, setCluesRemaining] = useState(3);

  useEffect(() => {
    setTarget(generateTarget(SEQUENCE_LENGTH));
  }, []);

  const handleSelectColor = useCallback((color: Color) => {
    if (gameState !== 'playing' || currentGuess.length >= SEQUENCE_LENGTH) return;
    setCurrentGuess(prev => [...prev, color]);
    audioEngine.playSelect();
  }, [currentGuess, gameState]);

  const handleDelete = useCallback(() => {
    if (gameState !== 'playing' || currentGuess.length === 0) return;
    setCurrentGuess(prev => prev.slice(0, -1));
    audioEngine.playDelete();
  }, [currentGuess, gameState]);

  const generateClue = useCallback(() => {
    if (cluesRemaining <= 0 || gameState !== 'playing') return;

    const targetColors = Array.from(new Set(target));
    const absentColors = COLORS.filter(c => !targetColors.includes(c));

    let newClue = "";
    let attempts = 0;
    while (attempts < 20) {
      const isPresentClue = (Math.random() > 0.5 && targetColors.length > 0) || absentColors.length === 0;
      
      if (isPresentClue) {
         const color = targetColors[Math.floor(Math.random() * targetColors.length)];
         newClue = `TRACE FOUND: [${String(color).toUpperCase()}] SIGNAL DETECTED.`;
      } else {
         const color = absentColors[Math.floor(Math.random() * absentColors.length)];
         newClue = `SCAN NEGATIVE: [${String(color).toUpperCase()}] SIGNAL IS VOID.`;
      }
      
      if (!clues.includes(newClue)) break;
      attempts++;
    }

    if (newClue) {
      setClues(prev => [...prev, newClue]);
      setCluesRemaining(prev => prev - 1);
      audioEngine.playHint();
    }
  }, [clues, cluesRemaining, gameState, target]);

  const triggerWin = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#22d3ee', '#c026d3', '#ffffff']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#22d3ee', '#c026d3', '#ffffff']
      });
    }, 250);
  };

  const handleSubmit = useCallback(() => {
    if (gameState !== 'playing') return;
    
    if (currentGuess.length < SEQUENCE_LENGTH) {
      audioEngine.playError();
      setInvalidShake(true);
      setTimeout(() => setInvalidShake(false), 500);
      return;
    }

    const matchResult = checkGuess(currentGuess, target);
    
    setGuesses(prev => [...prev, currentGuess]);
    setResults(prev => [...prev, matchResult]);
    setCurrentGuess([]);

    const isWin = matchResult.every(m => m === 'exact');
    
    if (isWin) {
      audioEngine.playWin();
      setGameState('won');
      // Delay confetti to match peg flip animation
      setTimeout(() => triggerWin(), (SEQUENCE_LENGTH * 100) + 500);
    } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
      audioEngine.playLose();
      setGameState('lost');
    } else {
      audioEngine.playSubmit();
    }
  }, [currentGuess, gameState, guesses, target]);

  const resetGame = () => {
    setTarget(generateTarget(SEQUENCE_LENGTH));
    setGuesses([]);
    setResults([]);
    setCurrentGuess([]);
    setGameState('playing');
    setClues([]);
    setCluesRemaining(3);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
      // Optional mapping: numbers 1-8 to colors
      const num = parseInt(e.key);
      if (num >= 1 && num <= COLORS.length) {
        handleSelectColor(COLORS[num - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDelete, handleSubmit, handleSelectColor]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center font-mono">
      <div className="flex flex-col items-center justify-center relative w-full mb-8">
        <div className="flex flex-col gap-4 sm:gap-6 w-full p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
            const isCurrentRow = rowIndex === guesses.length;
            const rowGuess = isCurrentRow ? currentGuess : guesses[rowIndex] || [];
            const rowResult = results[rowIndex] || [];
            
            return (
              <motion.div 
                key={rowIndex} 
                className="flex justify-center gap-2 sm:gap-4 md:gap-6"
                animate={isCurrentRow && invalidShake ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {Array.from({ length: SEQUENCE_LENGTH }).map((_, colIndex) => (
                  <Peg 
                    key={colIndex} 
                    color={rowGuess[colIndex]} 
                    match={rowResult[colIndex] || 'empty'}
                    delay={colIndex * 0.1}
                    isActiveRow={isCurrentRow}
                  />
                ))}
              </motion.div>
            );
          })}
        </div>

        {/* Floating Legend */}
        <div className="absolute -bottom-4 bg-[#020204] border border-zinc-700 px-6 py-2 rounded-full flex gap-4 sm:gap-6 shadow-xl z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-tighter text-zinc-300">Aligned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,38,211,0.8)]"></div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-tighter text-zinc-300">Phase-Shift</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-600 border border-zinc-500"></div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-tighter text-zinc-300">Void</span>
          </div>
        </div>
      </div>

      {clues.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-6 bg-white/[0.02] border border-white/5 p-4 rounded-sm relative shadow-[0_0_30px_rgba(0,0,0,0.3)]"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <h3 className="text-[10px] uppercase text-zinc-500 mb-3 tracking-widest flex justify-between items-center">
            <span>Signal Analysis Log</span>
            <span className="text-purple-400">Integrity: {((cluesRemaining / 3) * 100).toFixed(0)}%</span>
          </h3>
          <div className="space-y-2 font-mono">
            {clues.map((clue, i) => (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={i} 
                className="text-[10px] md:text-xs leading-relaxed text-zinc-300 uppercase tracking-wider flex gap-2"
              >
                <span className="text-purple-400 shrink-0">&gt;</span>
                <span>{clue}</span>
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {gameState === 'lost' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-center p-8 bg-[#020204] border border-white/10 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden z-20"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-rose-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-transparent pointer-events-none" />
            
            <h3 className="text-xl font-bold mb-2 text-white relative z-10 uppercase tracking-widest text-center">
              Critical Failure
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-6 text-center relative z-10">
              Target resonance sequence:
            </p>
            
            <div className="flex gap-2 mb-6 relative z-10 bg-white/5 p-4 border border-white/10">
              {target.map((c, i) => (
                <div key={i} className="scale-[0.7] origin-center -mx-1">
                  <Peg color={c} match="exact" />
                </div>
              ))}
            </div>

            <button 
              onClick={resetGame}
              className="relative z-10 flex items-center justify-center gap-2 w-full py-4 border border-rose-400/50 bg-rose-400/10 text-rose-400 text-xs tracking-[0.5em] font-bold uppercase hover:bg-rose-400 hover:text-black transition-all duration-300"
            >
              <span>Restart Cycle</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'won' && (
          <SuccessOverlay onRestart={resetGame} attempts={guesses.length} />
        )}
      </AnimatePresence>

      <div className={gameState !== 'playing' ? 'opacity-50 pointer-events-none transition-opacity duration-500 w-full' : 'transition-opacity duration-500 w-full'}>
        <ColorPicker 
          colors={COLORS}
          onSelect={handleSelectColor}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          onRequestClue={generateClue}
          disabled={gameState !== 'playing'}
          canSubmit={currentGuess.length === SEQUENCE_LENGTH}
          cluesRemaining={cluesRemaining}
          currentGuessLength={currentGuess.length}
        />
      </div>
    </div>
  );
}
