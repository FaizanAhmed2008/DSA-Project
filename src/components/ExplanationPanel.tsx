import { motion } from 'framer-motion'
import { CheckIcon, SparklesIcon } from './icons'
import type { SortStep } from '../types'

interface ExplanationPanelProps {
  step: SortStep | null
  started: boolean
  finished: boolean
}

function StudentComparisonCard({
  name,
  marks,
  isLeft,
}: {
  name: string
  marks: number
  isLeft?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2/60 px-3.5 py-2.5 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase font-bold text-muted">
          {isLeft ? 'Left [i]' : 'Right [i+1]'}
        </span>
        <span className="truncate text-xs font-semibold text-ink">{name}</span>
      </div>
      <span className="font-mono text-xs font-bold tabular-nums text-cyan-light">{marks} pts</span>
    </div>
  )
}

export default function ExplanationPanel({ step, started, finished }: ExplanationPanelProps) {
  const active = started && step !== null && !finished

  return (
    <div className="rounded-2xl glass-panel p-5">
      {/* Header */}
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-3.5 text-accent-light" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            Algorithm Logic
          </h2>
        </div>

        {active && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-light">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan" />
            </span>
            Step Active
          </span>
        )}
      </div>

      {finished ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-success/40 bg-success/10 p-3 text-xs leading-relaxed text-success">
            <CheckIcon className="mt-0.5 size-4 shrink-0" />
            <span>
              <strong>Ranking Complete:</strong> All students are now ordered with the highest marks at the front and lowest at the back!
            </span>
          </div>
          <div className="rounded-xl border border-line bg-surface-2/40 p-3 text-xs text-muted">
            <p className="font-semibold text-ink">Early Exit / Efficiency</p>
            <p className="mt-1">
              Bubble Sort runs in <strong>O(n²)</strong> time worst-case, but stops early if a pass makes 0 swaps!
            </p>
          </div>
        </div>
      ) : active && step ? (
        <motion.div
          key={`${step.pass}-${step.comparisonInPass}-${step.action}`}
          initial={{ opacity: 0.7, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Compared Students */}
          <div className="space-y-2">
            <StudentComparisonCard name={step.left.name} marks={step.left.marks} isLeft={true} />
            <StudentComparisonCard name={step.right.name} marks={step.right.marks} isLeft={false} />
          </div>

          {/* Condition Evaluation */}
          <div className="rounded-xl border border-line bg-base/80 p-3 text-center">
            <div className="text-[11px] text-muted mb-1">Condition Check (Descending Order)</div>
            <code className="font-mono text-sm font-bold tabular-nums text-accent-light">
              {step.left.marks} {step.swap ? '<' : '≥'} {step.right.marks}
            </code>
            <p className="mt-1 text-[11px] text-muted">
              {step.swap
                ? 'Left is smaller than Right → SWAP needed'
                : 'Left is greater or equal → Already sorted'}
            </p>
          </div>

          {/* Action Decision Pill */}
          <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2/40 px-3.5 py-2.5">
            <span className="text-xs font-medium text-muted">Decision</span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                step.swap
                  ? 'border border-warning/50 bg-warning/20 text-warning shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'border border-line bg-surface-3 text-muted'
              }`}
            >
              {step.swap ? 'SWAP POSITIONS' : 'KEEP IN PLACE'}
            </span>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3 text-xs text-muted">
          <p className="leading-relaxed">
            Click <strong className="text-cyan-light">Start Sorting</strong> or press <kbd className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink">Space</kbd> to step through the comparisons.
          </p>
          <div className="rounded-xl border border-line bg-surface-2/40 p-3 leading-relaxed">
            <p className="font-semibold text-ink">How Bubble Sort Works:</p>
            <p className="mt-1">
              Compare adjacent students in pairs. If the left student has fewer marks than the right student, swap them so higher marks bubble up to Rank #1.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}