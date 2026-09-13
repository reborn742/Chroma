class AudioEngine {
  context: AudioContext | null = null;

  init() {
    if (typeof window === 'undefined') return;
    if (!this.context) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.context = new AudioCtx();
      }
    }
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.05) {
    this.init();
    if (!this.context) return;
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.context.currentTime);
    
    gain.gain.setValueAtTime(vol, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + duration);
  }

  playSelect() {
    this.init();
    if (!this.context) return;
    this.playTone(800, 'sine', 0.1, 0.02);
    setTimeout(() => this.playTone(1200, 'sine', 0.15, 0.02), 50);
  }

  playDelete() {
    this.playTone(300, 'triangle', 0.1, 0.03);
  }

  playSubmit() {
    this.playTone(400, 'sine', 0.1, 0.03);
    setTimeout(() => this.playTone(600, 'sine', 0.2, 0.03), 100);
  }

  playHint() {
    this.init();
    if (!this.context) return;
    let time = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'square';
    
    osc.frequency.setValueAtTime(1200, time);
    osc.frequency.exponentialRampToValueAtTime(400, time + 0.3);
    
    gain.gain.setValueAtTime(0.015, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.3);
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  playWin() {
    this.init();
    if (!this.context) return;
    const time = this.context.currentTime;
    // C Major arpeggio
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.04, time + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + i * 0.1 + 1);
      osc.connect(gain);
      gain.connect(this.context!.destination);
      osc.start(time + i * 0.1);
      osc.stop(time + i * 0.1 + 1);
    });
  }

  playLose() {
    this.init();
    if (!this.context) return;
    const time = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 1.5);
    gain.gain.setValueAtTime(0.04, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.5);
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(time);
    osc.stop(time + 1.5);
  }
  
  playError() {
    this.playTone(150, 'square', 0.2, 0.03);
  }
}

export const audioEngine = new AudioEngine();
