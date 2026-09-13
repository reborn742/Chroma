import { Color, MatchType } from './types';

export const COLORS: Color[] = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'];

export function generateTarget(length: number = 5): Color[] {
  const target: Color[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    target.push(COLORS[randomIndex]);
  }
  return target;
}

export function checkGuess(guess: Color[], target: Color[]): MatchType[] {
  const result: MatchType[] = Array(guess.length).fill('none');
  const targetCounts: Record<string, number> = {};
  
  for (const color of target) {
    targetCounts[color] = (targetCounts[color] || 0) + 1;
  }
  
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'exact';
      targetCounts[guess[i]]--;
    }
  }
  
  for (let i = 0; i < guess.length; i++) {
    if (result[i] !== 'exact' && targetCounts[guess[i]] > 0) {
      result[i] = 'partial';
      targetCounts[guess[i]]--;
    }
  }
  
  return result;
}
