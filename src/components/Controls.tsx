import { motion } from 'framer-motion'
import { NextIcon, PauseIcon, PlayIcon, ResetIcon } from './icons'

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
  onReset: () => void
}

const btn =
  'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40'

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
  onReset,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        {playing ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onPause}
            className={`${btn} border border-line bg-surface-2 text-ink hover:bg-[#212c3a]`}
          >
            <PauseIcon className="size-4" />
            Pause
          </motion.button>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            disabled={!canRun}
            className={`${btn} bg-accent text-[#06202c] hover:bg-[#5ecbf8]`}
            title={!canRun ? 'Add at least 2 students to start' : undefined}
          >
            <PlayIcon className="size-4" />
            {finished ? 'Run Again' : started ? 'Resume' : 'Start Sorting'}
          </motion.button>
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={finished || playing || !canRun}
          className={`${btn} border border-line text-muted hover:bg-surface-2 hover:text-ink`}
        >
          <NextIcon className="size-4" />
          Next Step
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          disabled={!started}
          className={`${btn} border border-line text-muted hover:bg-surface-2 hover:text-ink`}
        >
          <ResetIcon className="size-4" />
          Reset
        </motion.button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted">Slow</span>
        <input
          type="range"
          min={0}
          max={100}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-36 sm:w-40"
          aria-label="Animation speed"
        />
        <span className="text-xs text-muted">Fast</span>
      </div>
    </div>
  )
}