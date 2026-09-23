import type { SortStep, Student } from '../types'

interface StatsPanelProps {
  step: SortStep | null
  started: boolean
  students?: Student[]
  subjectId?: string
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <span>{label}:</span>
      <span
        className={`font-semibold tabular-nums ${
          highlight ? 'text-accent' : 'text-ink'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export default function StatsPanel({ step, started, students, subjectId }: StatsPanelProps) {
  const active = started && step !== null

  // Calculate subject marks stats if students and subjectId provided
  let highestMarks = 0
  let avgMarks = '—'
  if (students && students.length > 0 && subjectId) {
    const marksArr = students.map((s) => s.marks[subjectId] ?? 0)
    highestMarks = Math.max(...marksArr)
    const sum = marksArr.reduce((acc, m) => acc + m, 0)
    avgMarks = (sum / marksArr.length).toFixed(1)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 text-xs sm:px-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <Stat
          label="Pass"
          value={active ? `${step.pass} / ${step.totalPasses}` : '—'}
        />
        <Stat
          label="Step"
          value={active ? `${step.stepIndex} / ${step.totalSteps}` : '—'}
        />
        <Stat
          label="Comparisons"
          value={active ? String(step.comparisonCount) : '0'}
          highlight={active && step.action === 'compare'}
        />
        <Stat
          label="Swaps"
          value={active ? String(step.swapCount) : '0'}
          highlight={active && step.action === 'swap'}
        />
      </div>

      {students && students.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-line/60 pt-1.5 sm:border-t-0 sm:pt-0">
          <Stat label="Students" value={String(students.length)} />
          <Stat label="Top Score" value={String(highestMarks)} />
          <Stat label="Class Avg" value={avgMarks} />
        </div>
      )}
    </div>
  )
}