import type { SortStep } from '../types'

interface StatsPanelProps {
  step: SortStep | null
  started: boolean
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-xs text-muted">
      {label}{' '}
      <span className="ml-1 font-semibold tabular-nums text-ink">{value}</span>
    </span>
  )
}

export default function StatsPanel({ step, started }: StatsPanelProps) {
  const active = started && step !== null

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 border-t border-line px-4 py-2.5 sm:px-5">
      <Stat label="Pass" value={active ? `${step.pass} / ${step.totalPasses}` : '—'} />
      <Stat
        label="Comparison"
        value={active ? `${step.comparisonInPass} / ${step.comparisonsInPass}` : '—'}
      />
      <Stat label="Comparisons" value={active ? String(step.comparisonCount) : '0'} />
      <Stat label="Swaps" value={active ? String(step.swapCount) : '0'} />
    </div>
  )
}