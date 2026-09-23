import { useEffect, useRef } from 'react'
import type { SortStep } from '../types'

interface StepHistoryProps {
  steps: SortStep[]
  currentStep: number
  onSelectStep: (stepIndex: number) => void
}

export default function StepHistory({ steps, currentStep, onSelectStep }: StepHistoryProps) {
  const activeItemRef = useRef<HTMLButtonElement | null>(null)
  const listContainerRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll active item into visible area
  useEffect(() => {
    if (activeItemRef.current && listContainerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [currentStep])

  if (steps.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface p-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
          Algorithm Timeline
        </h3>
        <p className="text-xs text-muted">
          Start the sorting process to record step-by-step comparisons and swaps.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between border-b border-line pb-2.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
            Algorithm Timeline
          </h3>
          <p className="text-[11px] text-muted">Click any step to inspect state</p>
        </div>
        <span className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
          {currentStep >= 0 ? `${currentStep + 1} / ${steps.length}` : `0 / ${steps.length}`}
        </span>
      </div>

      <div
        ref={listContainerRef}
        className="max-h-72 space-y-1.5 overflow-y-auto pr-1"
        tabIndex={0}
        aria-label="Algorithm steps timeline"
      >
        {steps.map((step, idx) => {
          const isActive = idx === currentStep
          const isSwap = step.action === 'swap'
          const isCompare = step.action === 'compare'
          const isComplete = step.action === 'complete'

          let actionBadge = 'bg-surface-2 text-muted border-line'
          if (isSwap) actionBadge = 'bg-warning/15 text-warning border-warning/40 font-semibold'
          else if (isCompare) actionBadge = 'bg-accent/15 text-accent border-accent/40 font-semibold'
          else if (isComplete) actionBadge = 'bg-success/15 text-success border-success/40 font-semibold'

          return (
            <button
              key={`step-${idx}-${step.stepIndex}`}
              ref={isActive ? activeItemRef : null}
              type="button"
              onClick={() => onSelectStep(idx)}
              className={`flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                isActive
                  ? 'border-accent bg-accent/15 shadow-sm ring-1 ring-accent/30'
                  : 'border-transparent bg-surface-2/40 hover:border-line hover:bg-surface-2'
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`font-mono text-[11px] font-bold ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <span
                  className={`truncate font-medium ${
                    isActive ? 'text-ink font-semibold' : 'text-slate-300'
                  }`}
                >
                  {step.action === 'complete'
                    ? 'All elements sorted'
                    : step.left && step.right && step.comparing
                      ? `${step.left.name} ↔ ${step.right.name}`
                      : step.message}
                </span>
              </div>

              <span
                className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${actionBadge}`}
              >
                {step.action === 'no-swap' ? 'No Swap' : step.action}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
