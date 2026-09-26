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
      <div className="rounded-2xl glass-panel p-5">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
          Algorithm Step Timeline
        </h3>
        <p className="text-xs text-muted">
          Start the sorting simulator to record step-by-step comparisons, swaps, and pass records.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-2xl glass-panel p-5">
      {/* Header */}
      <div className="mb-3.5 flex items-center justify-between border-b border-line pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
            Algorithm Timeline
          </h3>
          <p className="text-[11px] text-muted">Click any step to inspect snapshot</p>
        </div>
        <span className="rounded-lg border border-accent/40 bg-accent/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-cyan-light">
          {currentStep >= 0 ? `${currentStep + 1} / ${steps.length}` : `0 / ${steps.length}`}
        </span>
      </div>

      {/* Steps List */}
      <div
        ref={listContainerRef}
        className="max-h-72 space-y-1.5 overflow-y-auto pr-1 select-none"
        tabIndex={0}
        aria-label="Algorithm steps timeline"
      >
        {steps.map((step, idx) => {
          const isActive = idx === currentStep
          const isSwap = step.action === 'swap'
          const isCompare = step.action === 'compare'
          const isComplete = step.action === 'complete'

          let actionBadge = 'bg-surface-3 text-muted border-line'
          if (isSwap)
            actionBadge = 'bg-warning/20 text-warning border-warning/40 font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]'
          else if (isCompare)
            actionBadge = 'bg-cyan/20 text-cyan-light border-cyan/40 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]'
          else if (isComplete)
            actionBadge = 'bg-success/20 text-success border-success/40 font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]'

          return (
            <button
              key={`step-${idx}-${step.stepIndex}`}
              ref={isActive ? activeItemRef : null}
              type="button"
              onClick={() => onSelectStep(idx)}
              className={`flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition-all duration-150 ${
                isActive
                  ? 'border-cyan bg-cyan/15 shadow-md shadow-cyan/20 ring-1 ring-cyan/40'
                  : 'border-line/60 bg-surface-2/40 hover:border-line hover:bg-surface-2/70'
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`font-mono text-[11px] font-bold ${
                    isActive ? 'text-cyan-light' : 'text-muted'
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
                    ? 'All elements ranked'
                    : step.left && step.right && step.comparing
                      ? `${step.left.name} ↔ ${step.right.name}`
                      : step.message}
                </span>
              </div>

              <span
                className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${actionBadge}`}
              >
                {step.action === 'no-swap' ? 'Keep' : step.action}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
