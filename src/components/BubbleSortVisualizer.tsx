import { motion } from 'framer-motion'
import type { SortStep, Student } from '../types'
import { CheckIcon, SparklesIcon, SwapIcon } from './icons'

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
    <div className="relative w-full overflow-hidden rounded-2xl glass-panel p-5 sm:p-7">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-64 rounded-full bg-cyan/15 blur-3xl" />

      {/* Header Bar */}
      <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-cyan" />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink sm:text-sm">
              Algorithm Stage • Live Student Lineup
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Ranking classroom by <span className="font-semibold text-cyan-light">{subjectName}</span> marks in{' '}
            <span className="font-semibold text-accent-light">descending order</span> (highest marks bubble to front).
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 text-xs">
          {started && step && (
            <>
              <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface-2/80 px-3 py-1 font-mono text-muted">
                <span>Pass</span>
                <span className="font-bold text-accent-light">
                  {step.pass}
                  <span className="text-muted/60 font-normal">/{step.totalPasses}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface-2/80 px-3 py-1 font-mono text-muted">
                <span>Step</span>
                <span className="font-bold text-cyan-light">
                  {step.stepIndex}
                  <span className="text-muted/60 font-normal">/{step.totalSteps}</span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Live Algorithm Action Banner */}
      {started && step ? (
        <motion.div
          key={`action-${step.stepIndex}-${step.action}`}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm backdrop-blur-md ${
            step.action === 'swap'
              ? 'border-warning/50 bg-warning/10 text-warning shadow-[0_0_20px_rgba(245,158,11,0.15)]'
              : step.action === 'compare'
                ? 'border-cyan/50 bg-cyan/10 text-cyan-light shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                : step.action === 'complete'
                  ? 'border-success/50 bg-success/10 text-success shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'border-line bg-surface-2/80 text-muted'
          }`}
        >
          <div className="flex items-center gap-3">
            {step.action === 'swap' ? (
              <span className="grid size-7 place-items-center rounded-lg bg-warning/20 text-warning shadow-sm">
                <SwapIcon className="size-4 animate-bounce" />
              </span>
            ) : step.action === 'complete' ? (
              <span className="grid size-7 place-items-center rounded-lg bg-success/20 text-success shadow-sm">
                <CheckIcon className="size-4" />
              </span>
            ) : (
              <span className="grid size-7 place-items-center rounded-lg bg-cyan/20 text-cyan-light shadow-sm">
                <span className="size-2 rounded-full bg-cyan animate-ping" />
              </span>
            )}
            <span className="font-medium text-ink sm:text-[14px]">{step.message}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                step.action === 'swap'
                  ? 'bg-warning/25 text-warning ring-1 ring-warning/40'
                  : step.action === 'compare'
                    ? 'bg-cyan/25 text-cyan-light ring-1 ring-cyan/40'
                    : step.action === 'complete'
                      ? 'bg-success/25 text-success ring-1 ring-success/40'
                      : 'bg-surface-3 text-muted'
              }`}
            >
              {step.action.replace('-', ' ')}
            </span>
          </div>
        </motion.div>
      ) : (
        <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface-2/40 px-4 py-3 text-xs text-muted backdrop-blur-md">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-cyan" />
            <span>Click <strong>Start Sorting</strong> or press <strong>Space</strong> to watch elements bubble into order.</span>
          </div>
          <span className="font-mono text-[11px] text-accent-light">Time: O(n²) • Space: O(1) in-place</span>
        </div>
      )}

      {/* Visual Student Cards Canvas */}
      <div className="relative z-10 min-h-[280px] overflow-x-auto pb-4 pt-2">
        <div className="flex min-w-max items-end justify-center gap-3 sm:gap-4.5 px-3">
          {currentArray.map((student, idx) => {
            const marks = student.marks[subjectId] ?? 0
            const isComparing = comparingIndices ? comparingIndices.includes(idx) : false
            const isSwapping = isComparing && isSwapAction
            const isSorted = sortedSet.has(idx)
            const heightPercent = Math.max(16, Math.min(100, Math.round(marks)))

            // Dynamic card stylings based on algorithm state
            let cardBorder = 'border-line/70'
            let cardBg = 'bg-surface-2/60'
            let glow = ''
            let yOffset = 0

            if (isSwapping) {
              cardBorder = 'border-warning ring-2 ring-warning/50'
              cardBg = 'bg-gradient-to-b from-warning/20 to-surface-2/90'
              glow = 'shadow-[0_0_28px_rgba(245,158,11,0.35)]'
              yOffset = -12 // elevate card during swap
            } else if (isComparing) {
              cardBorder = 'border-cyan ring-2 ring-cyan/50'
              cardBg = 'bg-gradient-to-b from-cyan/20 to-surface-2/90'
              glow = 'shadow-[0_0_28px_rgba(6,182,212,0.35)]'
              yOffset = -6 // subtle lift during comparison
            } else if (isSorted) {
              cardBorder = 'border-success/60'
              cardBg = 'bg-gradient-to-b from-success/10 to-surface-2/70'
              glow = 'shadow-[0_0_16px_rgba(16,185,129,0.15)]'
            }

            return (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: isSwapping ? 1.05 : isComparing ? 1.02 : 1,
                  y: yOffset,
                }}
                transition={{
                  layout: { type: 'spring', stiffness: 360, damping: 28 },
                  y: { type: 'spring', stiffness: 400, damping: 25 },
                  scale: { duration: 0.2 },
                }}
                className="group relative flex flex-col items-center select-none"
                style={{ width: '116px' }}
              >
                {/* Pointer / Status Badge above Card */}
                <div className="mb-2 h-7 flex items-center justify-center">
                  {isSwapping ? (
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-warning to-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-md shadow-warning/30"
                    >
                      <SwapIcon className="size-3" />
                      Swap
                    </motion.span>
                  ) : isComparing ? (
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan to-cyan-light px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-md shadow-cyan/30"
                    >
                      Compare
                    </motion.span>
                  ) : isSorted ? (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/20 px-2 py-0.5 text-[10px] font-semibold text-success shadow-sm"
                    >
                      <CheckIcon className="size-2.5" />
                      Ranked
                    </motion.span>
                  ) : (
                    <span className="text-[10px] font-semibold text-muted/60">
                      Rank #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Card Container */}
                <div
                  className={`relative flex w-full flex-col justify-between rounded-2xl border p-3.5 backdrop-blur-md transition-colors duration-200 ${cardBorder} ${cardBg} ${glow}`}
                  style={{ minHeight: '196px' }}
                >
                  {/* Top: Avatar & Roll Badge */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="relative flex size-7.5 items-center justify-center rounded-xl bg-gradient-to-br from-accent/30 to-cyan/30 p-0.5">
                      <div className="flex size-full items-center justify-center rounded-[10px] bg-surface font-bold text-xs text-cyan-light">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <span className="rounded-md bg-base/70 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted">
                      #{student.rollNo}
                    </span>
                  </div>

                  {/* Middle: Marks & Animated Bar */}
                  <div className="my-3 flex flex-col items-center justify-center">
                    <div className="text-3xl font-black tracking-tight text-ink tabular-nums">
                      {marks}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">
                      Marks
                    </span>

                    {/* Proportional visual height bar with Cyber Gradient */}
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-base/90 p-0.5">
                      <motion.div
                        className={`h-full rounded-full transition-all ${
                          isSwapping
                            ? 'bg-gradient-to-r from-warning to-amber-400'
                            : isComparing
                              ? 'bg-gradient-to-r from-cyan to-cyan-light'
                              : isSorted
                                ? 'bg-gradient-to-r from-success to-emerald-400'
                                : 'bg-gradient-to-r from-accent to-cyan'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${heightPercent}%` }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Bottom: Student Name */}
                  <div
                    className="truncate text-center text-xs font-semibold text-ink"
                    title={student.name}
                  >
                    {student.name}
                  </div>
                </div>

                {/* Index Indicator */}
                <div className="mt-2.5 font-mono text-[11px] font-semibold text-muted/80">
                  Index [{idx}]
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Completion Banner */}
      {finished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 mt-2 mb-2 flex items-center justify-between rounded-xl border border-success/40 bg-gradient-to-r from-success/15 via-cyan/10 to-accent/15 p-4 text-xs"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <div>
              <p className="font-bold text-ink">Sorting & Ranking Finished!</p>
              <p className="text-muted">Every student has been placed into their exact descending merit position.</p>
            </div>
          </div>
          <span className="rounded-lg bg-success px-3 py-1 font-bold text-slate-950 text-xs">
            100% Sorted
          </span>
        </motion.div>
      )}

      {/* Legend & Guide footer */}
      <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5 text-xs text-muted">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-ink-secondary">Comparing pair</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <span className="text-ink-secondary">Swapping positions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-ink-secondary">Sorted & locked in rank</span>
          </div>
        </div>

        <div className="font-mono text-[11px] text-muted">
          Rule: <strong className="text-cyan-light font-bold">Left &lt; Right</strong> → Swap to descending
        </div>
      </div>
    </div>
  )
}
