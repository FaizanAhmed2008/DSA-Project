import { motion } from 'framer-motion'
import { CheckIcon } from './icons'
import type { SortStep } from '../types'

interface ExplanationPanelProps {
  step: SortStep | null
  started: boolean
  finished: boolean
}

function StudentRow({ name, marks }: { name: string; marks: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
      <span className="truncate text-sm text-ink">{name}</span>
      <span className="text-sm font-semibold tabular-nums text-ink">{marks}</span>
    </div>
  )
}

export default function ExplanationPanel({ step, started, finished }: ExplanationPanelProps) {
  const active = started && step !== null && !finished

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          Current Step
        </h2>
        {active && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Comparing
          </span>
        )}
      </div>

      {finished ? (
        <div className="flex items-start gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2.5 text-xs leading-relaxed text-success">
          <CheckIcon className="mt-0.5 size-3.5 shrink-0" />
          <span>Ranking complete — the smallest marks bubbled to the end of the list.</span>
        </div>
      ) : active && step ? (
        <motion.div
          key={`${step.pass}-${step.comparisonInPass}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="space-y-2">
            <StudentRow name={step.left.name} marks={step.left.marks} />
            <StudentRow name={step.right.name} marks={step.right.marks} />
          </div>

          <div className="rounded-lg border border-line bg-base px-3 py-2 text-center">
            <code className="text-sm font-semibold tabular-nums text-accent">
              {step.left.marks} {step.swap ? '<' : '≥'} {step.right.marks}
            </code>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Action</span>
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                step.swap
                  ? 'border-warning/30 bg-warning/15 text-warning'
                  : 'border-line bg-surface-2 text-muted'
              }`}
            >
              {step.swap ? 'Swap' : 'No Swap'}
            </span>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-muted">
            Press <span className="font-medium text-ink">Start Sorting</span> to run Bubble Sort,
            or step through it with{' '}
            <span className="font-medium text-ink">Next Step</span>.
          </p>
          <div className="rounded-lg bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-muted">
            <p className="font-medium text-ink/90">How Bubble Sort works</p>
            <p className="mt-1">
              Compare adjacent students. If the left has fewer marks they are out of order, so
              swap them. Repeat each pass until the list is sorted.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}