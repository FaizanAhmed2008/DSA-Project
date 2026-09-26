import { motion } from 'framer-motion'
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, ResetIcon } from './icons'

interface ControlsProps {
  playing: boolean
  started: boolean
  finished: boolean
  canRun: boolean
  speed: number
  onSpeedChange: (value: number) => void
  onStart: () => void
  onPause: () => void
  onNext: () => void
  onPrev?: () => void
  canPrev?: boolean
  onReset: () => void
}

const btnBase =
  'relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 select-none'

export default function Controls({
  playing,
  started,
  finished,
  canRun,
  speed,
  onSpeedChange,
  onStart,
  onPause,
  onNext,
  onPrev,
  canPrev = false,
  onReset,
}: ControlsProps) {
  const speedPresets = [
    { label: '0.5x', value: 20 },
    { label: '1x', value: 60 },
    { label: '1.5x', value: 80 },
    { label: '2x', value: 95 },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-3.5 sm:px-6">
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {playing ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onPause}
            className={`${btnBase} border border-warning/40 bg-warning/15 text-warning hover:bg-warning/25 shadow-md shadow-warning/15`}
            title="Pause sorting (Space)"
          >
            <PauseIcon className="size-4" />
            <span>Pause</span>
            <kbd className="hidden rounded bg-warning/20 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              Space
            </kbd>
          </motion.button>
        ) : (
          <motion.button
            type="button"
            whileHover={{ scale: canRun ? 1.03 : 1 }}
            whileTap={{ scale: canRun ? 0.96 : 1 }}
            onClick={onStart}
            disabled={!canRun}
            className={`${btnBase} bg-gradient-to-r from-accent to-cyan font-bold text-slate-950 shadow-lg shadow-accent/25 hover:shadow-cyan/35 hover:brightness-110`}
            title={!canRun ? 'Add at least 2 students to start' : 'Start/Resume sorting (Space)'}
          >
            <PlayIcon className="size-4 fill-slate-950" />
            <span>{finished ? 'Re-sort' : started ? 'Resume' : 'Start Sorting'}</span>
            <kbd className="hidden rounded bg-black/25 px-1.5 py-0.5 font-mono text-[10px] text-slate-950 sm:inline">
              Space
            </kbd>
          </motion.button>
        )}

        {/* Previous Step */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onPrev}
          disabled={!canPrev || playing}
          className={`${btnBase} border border-line bg-surface-2/60 text-muted hover:border-line-bright hover:bg-surface-2 hover:text-ink`}
          title="Previous step (Left Arrow)"
        >
          <PrevIcon className="size-3.5" />
          <span>Previous</span>
          <kbd className="hidden rounded bg-base/80 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            ←
          </kbd>
        </motion.button>

        {/* Next Step */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
          disabled={finished || playing || !canRun}
          className={`${btnBase} border border-line bg-surface-2/60 text-muted hover:border-cyan/40 hover:bg-surface-2 hover:text-cyan-light`}
          title="Next step (Right Arrow)"
        >
          <NextIcon className="size-3.5" />
          <span>Next</span>
          <kbd className="hidden rounded bg-base/80 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            →
          </kbd>
        </motion.button>

        {/* Reset */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          disabled={!started}
          className={`${btnBase} border border-line bg-surface-2/60 text-muted hover:border-danger/40 hover:bg-danger/10 hover:text-danger`}
          title="Reset visualization (R)"
        >
          <ResetIcon className="size-3.5" />
          <span>Reset</span>
          <kbd className="hidden rounded bg-base/80 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            R
          </kbd>
        </motion.button>
      </div>

      {/* Speed Controls: Presets + Slider */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="hidden text-[11px] font-bold uppercase tracking-wider text-muted sm:inline">
          Speed
        </span>

        {/* Speed Presets Pill Container */}
        <div className="flex items-center rounded-xl border border-line bg-surface-2/70 p-1">
          {speedPresets.map((preset) => {
            const isSelected = Math.abs(speed - preset.value) < 10
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onSpeedChange(preset.value)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? 'bg-gradient-to-r from-accent to-cyan text-slate-950 font-bold shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>

        {/* Fine-Tuning Slider */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={5}
            max={98}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-24 sm:w-28"
            aria-label="Animation speed"
          />
        </div>
      </div>
    </div>
  )
}