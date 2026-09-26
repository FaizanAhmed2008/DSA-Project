// Web Audio API Sound Synthesizer for Bubble Sort Visualizer
// Produces subtle harmonic sine waves for comparisons, swaps, and completion.

class SoundFX {
  private ctx: AudioContext | null = null
  private enabled: boolean = false

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val
    if (val) {
      this.initContext()
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  // Pitch mapped to student marks (0 - 100) -> 260Hz (C4) to 780Hz (G5)
  public playCompare(marks: number) {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    try {
      const freq = 260 + (Math.max(0, Math.min(100, marks)) / 100) * 520
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.13)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playSwap() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.14)

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.16)
    } catch {
      // Ignore audio error
    }
  }

  public playComplete() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        const start = this.ctx.currentTime + idx * 0.08
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.05, start)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(start)
        osc.stop(start + 0.3)
      })
    } catch {
      // Ignore
    }
  }
}

export const soundFX = new SoundFX()
