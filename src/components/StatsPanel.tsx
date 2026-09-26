import { motion } from 'framer-motion'
import type { SortStep, Student } from '../types'

interface StatsPanelProps {
  step: SortStep | null
  started: boolean
  students?: Student[]
  subjectId?: string
}

function Stat({
  label,
  value,
  color = 'text-ink',
  highlight = false,
}: {
  label: string
  value: string
  color?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs transition-all ${
        highlight
          ? 'border-cyan/50 bg-cyan/15 text-cyan-light shadow-sm shadow-cyan/20'
          : 'border-line/60 bg-surface-2/40 text-muted'
      }`}
    >
      <span className="text-[11px] font-medium text-muted">{label}:</span>
      <motion.span
        key={value}
        initial={{ scale: highlight ? 1.2 : 1 }}
        animate={{ scale: 1 }}
        className={`font-mono font-bold tabular-nums ${color}`}
      >
        {value}
      </motion.span>
    </div>
  )
}

export default function StatsPanel({ step, started, students, subjectId }: StatsPanelProps) {
  const active = started && step !== null

  let highestMarks = 0
  let avgMarks = '—'
  if (students && students.length > 0 && subjectId) {
    const marksArr = students.map((s) => s.marks[subjectId] ?? 0)
    highestMarks = Math.max(...marksArr)
    const sum = marksArr.reduce((acc, m) => acc + m, 0)
    avgMarks = (sum / marksArr.length).toFixed(1)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-5 py-3 text-xs sm:px-6 bg-surface/40">
      {/* Algorithm Performance Metrics */}
      <div className="flex flex-wrap items-center gap-2">
        <Stat
          label="Pass"
          value={active ? `${step.pass}/${step.totalPasses}` : '—'}
          color="text-accent-light"
        />
        <Stat
          label="Step"
          value={active ? `${step.stepIndex}/${step.totalSteps}` : '—'}
          color="text-cyan-light"
        />
        <Stat
          label="Comparisons"
          value={active ? String(step.comparisonCount) : '0'}
          color="text-cyan"
          highlight={active && step.action === 'compare'}
        />
        <Stat
          label="Swaps"
          value={active ? String(step.swapCount) : '0'}
          color="text-warning"
          highlight={active && step.action === 'swap'}
        />
      </div>

      {/* Classroom Insights */}
      {students && students.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line/40 pt-2 sm:border-t-0 sm:pt-0">
          <Stat label="Students" value={String(students.length)} color="text-ink" />
          <Stat label="Highest" value={String(highestMarks)} color="text-success" />
          <Stat label="Avg Marks" value={avgMarks} color="text-accent-light" />
        </div>
      )}
    </div>
  )
}