import { motion } from 'framer-motion'
import type { SortStep, Student } from '../types'
import { CheckIcon, SwapIcon } from './icons'

interface BubbleSortVisualizerProps {
  students: Student[]
  subjectId: string
  subjectName: string
  step: SortStep | null
  started: boolean
  finished: boolean
}

export default function BubbleSortVisualizer({
  students,
  subjectId,
  subjectName,
  step,
  started,
  finished,
}: BubbleSortVisualizerProps) {
  const currentArray = step ? step.array : students
  const comparingIndices = step?.comparing ?? null
  const sortedSet = new Set(step?.sortedIndexes ?? (finished ? students.map((_, i) => i) : []))
  const isSwapAction = step?.action === 'swap'

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface p-4 sm:p-6">
      {/* Header bar of visualizer */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink">
              Algorithm Stage • Student Lineup
            </h2>
          </div>
          <p className="text-xs text-muted">
            Sorting classroom by <span className="font-medium text-ink">{subjectName}</span> marks in{' '}
            <span className="font-semibold text-accent">descending order</span> (highest marks first).
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 text-xs">
          {started && step && (
            <div className="flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2.5 py-1 text-muted">
              <span>Pass</span>
              <span className="font-semibold text-ink">
                {step.pass} / {step.totalPasses}
              </span>
            </div>
          )}
          {started && step && (
            <div className="flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2.5 py-1 text-muted">
              <span>Step</span>
              <span className="font-semibold text-ink">
                {step.stepIndex} / {step.totalSteps}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Live Algorithm Action Banner */}
      {started && step ? (
        <motion.div
          key={`action-${step.stepIndex}-${step.action}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            step.action === 'swap'
              ? 'border-warning/40 bg-warning/10 text-warning'
              : step.action === 'compare'
                ? 'border-accent/40 bg-accent/10 text-accent'
                : step.action === 'complete'
                  ? 'border-success/40 bg-success/10 text-success'
                  : 'border-line bg-surface-2 text-muted'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {step.action === 'swap' ? (
              <span className="grid size-6 place-items-center rounded-full bg-warning/20 text-warning">
                <SwapIcon className="size-3.5" />
              </span>
            ) : step.action === 'complete' ? (
              <span className="grid size-6 place-items-center rounded-full bg-success/20 text-success">
                <CheckIcon className="size-3.5" />
              </span>
            ) : (
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
              </span>
            )}
            <span className="font-medium text-ink">{step.message}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span
              className={`rounded-full px-2.5 py-0.5 ${
                step.action === 'swap'
                  ? 'bg-warning/20 text-warning'
                  : step.action === 'compare'
                    ? 'bg-accent/20 text-accent'
                    : step.action === 'complete'
                      ? 'bg-success/20 text-success'
                      : 'bg-surface-2 text-muted'
              }`}
            >
              {step.action.replace('-', ' ')}
            </span>
          </div>
        </motion.div>
      ) : (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-line bg-surface-2/40 px-4 py-3 text-xs text-muted">
          <span>Click <strong>Start Sorting</strong> or <strong>Next Step</strong> to begin the visual Bubble Sort process.</span>
          <span className="font-mono text-[11px] text-accent">O(n²) time • O(1) space</span>
        </div>
      )}

      {/* Visual Student Cards Canvas */}
      <div className="min-h-[260px] overflow-x-auto pb-4 pt-2">
        <div className="flex min-w-max items-end justify-center gap-3 sm:gap-4 px-2">
          {currentArray.map((student, idx) => {
            const marks = student.marks[subjectId] ?? 0
            const isComparing = comparingIndices ? comparingIndices.includes(idx) : false
            const isSwapping = isComparing && isSwapAction
            const isSorted = sortedSet.has(idx)
            const heightPercent = Math.max(18, Math.min(100, Math.round(marks)))

            // Card state styles
            let cardBorder = 'border-line hover:border-line/80'
            let cardBg = 'bg-surface-2/70'
            let glow = ''

            if (isSwapping) {
              cardBorder = 'border-warning ring-2 ring-warning/30'
              cardBg = 'bg-warning/10'
              glow = 'shadow-[0_0_20px_rgba(251,191,36,0.2)]'
            } else if (isComparing) {
              cardBorder = 'border-accent ring-2 ring-accent/30'
              cardBg = 'bg-accent/10'
              glow = 'shadow-[0_0_20px_rgba(56,189,248,0.2)]'
            } else if (isSorted) {
              cardBorder = 'border-success/60'
              cardBg = 'bg-success/5'
            }

            return (
              <motion.div
                key={student.id}
                layout
                transition={{
                  type: 'spring',
                  stiffness: 340,
                  damping: 26,
                  mass: 0.9,
                }}
                className="group relative flex flex-col items-center"
                style={{ width: '108px' }}
              >
                {/* Pointer / Badge above comparing cards */}
                <div className="mb-2 h-6 flex items-center justify-center">
                  {isSwapping ? (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black shadow"
                    >
                      <SwapIcon className="size-2.5" />
                      Swap
                    </motion.span>
                  ) : isComparing ? (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black shadow"
                    >
                      Compare
                    </motion.span>
                  ) : isSorted ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
                      <CheckIcon className="size-2.5" />
                      Locked
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-muted/60">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Card Container */}
                <div
                  className={`relative flex w-full flex-col justify-between rounded-xl border p-3 transition-colors ${cardBorder} ${cardBg} ${glow}`}
                  style={{ minHeight: '180px' }}
                >
                  {/* Top: Avatar & Roll */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="grid size-7 place-items-center rounded-lg bg-base text-xs font-bold text-accent">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="rounded bg-base/60 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                      R#{student.rollNo}
                    </span>
                  </div>

                  {/* Middle: Marks Graphic Bar */}
                  <div className="my-3 flex flex-col items-center justify-center">
                    <div className="text-2xl font-black tracking-tight text-ink tabular-nums">
                      {marks}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted">Marks</span>

                    {/* Proportional visual height bar inside card */}
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-base/80">
                      <motion.div
                        className={`h-full rounded-full ${
                          isSwapping
                            ? 'bg-warning'
                            : isComparing
                              ? 'bg-accent'
                              : isSorted
                                ? 'bg-success'
                                : 'bg-line'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${heightPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Bottom: Student Name */}
                  <div className="truncate text-center text-xs font-semibold text-ink" title={student.name}>
                    {student.name}
                  </div>
                </div>

                {/* Index Indicator underneath */}
                <div className="mt-2 flex items-center justify-center text-[11px] font-medium text-muted">
                  Index [{idx}]
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend & Guide footer */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-xs text-muted">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-accent" />
            <span>Comparing pair</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-warning" />
            <span>Swapping positions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-success" />
            <span>Sorted suffix (Final rank)</span>
          </div>
        </div>

        <div className="text-[11px]">
          Target: <span className="font-semibold text-ink">Left ≥ Right</span> (Descending)
        </div>
      </div>
    </div>
  )
}
