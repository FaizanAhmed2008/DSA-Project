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

const btn =
  'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 select-none'

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
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {playing ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onPause}
            className={`${btn} border border-line bg-surface-2 text-ink hover:bg-[#212c3a]`}
            title="Pause sorting (Space)"
          >
            <PauseIcon className="size-4 text-warning" />
            <span>Pause</span>
            <kbd className="hidden rounded bg-base/80 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">
              Space
            </kbd>
          </motion.button>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            disabled={!canRun}
            className={`${btn} bg-accent text-[#06202c] font-semibold hover:bg-[#5ecbf8]`}
            title={!canRun ? 'Add at least 2 students to start' : 'Start/Resume sorting (Space)'}
          >
            <PlayIcon className="size-4" />
            <span>{finished ? 'Re-sort' : started ? 'Resume' : 'Start Sorting'}</span>
            <kbd className="hidden rounded bg-black/20 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              Space
            </kbd>
          </motion.button>
        )}

        {/* Previous Step */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onPrev}
          disabled={!canPrev || playing}
          className={`${btn} border border-line text-muted hover:bg-surface-2 hover:text-ink`}
          title="Previous step (Left Arrow)"
        >
          <PrevIcon className="size-4" />
          <span>Previous</span>
          <kbd className="hidden rounded bg-base/60 px-1 py-0.5 font-mono text-[10px] sm:inline">
            ←
          </kbd>
        </motion.button>

        {/* Next Step */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={finished || playing || !canRun}
          className={`${btn} border border-line text-muted hover:bg-surface-2 hover:text-ink`}
          title="Next step (Right Arrow)"
        >
          <NextIcon className="size-4" />
          <span>Next</span>
          <kbd className="hidden rounded bg-base/60 px-1 py-0.5 font-mono text-[10px] sm:inline">
            →
          </kbd>
        </motion.button>

        {/* Reset */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          disabled={!started}
          className={`${btn} border border-line text-muted hover:bg-surface-2 hover:text-ink`}
          title="Reset visualization (R)"
        >
          <ResetIcon className="size-4" />
          <span>Reset</span>
          <kbd className="hidden rounded bg-base/60 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            R
          </kbd>
        </motion.button>
      </div>

      {/* Speed Controls: Presets + Slider */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Speed Presets */}
        <div className="flex items-center rounded-lg border border-line bg-surface-2/60 p-0.5">
          {speedPresets.map((preset) => {
            const isSelected = Math.abs(speed - preset.value) < 10
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onSpeedChange(preset.value)}
                className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-accent font-semibold text-[#06202c]'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>

        {/* Fine Slider */}
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