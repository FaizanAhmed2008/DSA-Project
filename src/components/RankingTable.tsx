import { motion } from 'framer-motion'
import type { SortStep, Student } from '../types'

interface RankingTableProps {
  students: Student[]
  subjectId: string
  step: SortStep | null
  finished: boolean
}

const COLS = 'grid grid-cols-[56px_minmax(160px,1.2fr)_110px_minmax(120px,1fr)_90px] gap-3'

const medal = (rank: number) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '')

export default function RankingTable({ students, subjectId, step, finished }: RankingTableProps) {
  const n = students.length

  const maxMarks = students.length > 0
    ? Math.max(...students.map((s) => s.marks[subjectId] ?? 0), 100)
    : 100

  return (
    <div className="w-full overflow-x-auto">
      <div className="w-full min-w-[580px]" role="table" aria-label="Student ranking">
        {/* Table Header */}
        <div
          role="row"
          className={`${COLS} items-center border-b border-line bg-surface-2/40 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-muted backdrop-blur-md`}
        >
          <span role="columnheader" className="text-center">
            Rank
          </span>
          <span role="columnheader">Student</span>
          <span role="columnheader">Roll No</span>
          <span role="columnheader">Score Meter</span>
          <span role="columnheader" className="text-right">
            Marks
          </span>
        </div>

        {/* Table Body */}
        <div role="rowgroup" className="divide-y divide-line/60">
          {n === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted">
              No students in classroom — load sample students or add them in the Students tab.
            </div>
          )}

          {students.map((student, idx) => {
            const marks = student.marks[subjectId] ?? 0
            const percent = Math.min(100, Math.max(8, (marks / maxMarks) * 100))
            const isComparing = step?.comparing
              ? step.comparing.includes(idx)
              : step !== null && (idx === step.i || idx === step.j)
            const isSwap = isComparing && step?.action === 'swap'
            const isLocked = step?.sortedIndexes
              ? step.sortedIndexes.includes(idx)
              : step !== null && idx >= n - step.lockedCount

            let leftBorder = 'border-l-2 border-l-transparent'
            let rowTint = 'hover:bg-surface-2/40'

            if (isSwap) {
              leftBorder = 'border-l-4 border-l-warning'
              rowTint = 'bg-warning/10 shadow-[inset_0_0_15px_rgba(245,158,11,0.08)]'
            } else if (isComparing) {
              leftBorder = 'border-l-4 border-l-cyan'
              rowTint = 'bg-cyan/10 shadow-[inset_0_0_15px_rgba(6,182,212,0.08)]'
            } else if (isLocked) {
              leftBorder = 'border-l-2 border-l-success/80'
              rowTint = 'bg-success/5 hover:bg-success/10'
            }

            return (
              <motion.div
                key={student.id}
                role="row"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 440, damping: 36 }}
                className={`${COLS} h-14 items-center px-5 transition-all duration-150 ${leftBorder} ${rowTint}`}
              >
                {/* Rank */}
                <div role="cell" className="flex items-center justify-center gap-1">
                  {finished && idx < 3 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-base" aria-hidden>{medal(idx + 1)}</span>
                      <span className="font-mono text-xs font-bold text-ink">
                        {idx + 1}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums ${
                        isLocked ? 'text-success font-bold' : 'text-muted'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Student Name & Avatar */}
                <div role="cell" className="flex min-w-0 items-center gap-3">
                  <div className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-cyan/20 p-0.5">
                    <div className="flex size-full items-center justify-center rounded-[10px] bg-surface font-mono text-xs font-bold text-cyan-light">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="truncate text-xs sm:text-sm font-semibold text-ink">
                    {student.name}
                  </span>
                  {isLocked && !finished && (
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-success shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                      title="Locked in final position"
                    />
                  )}
                </div>

                {/* Roll Number */}
                <div role="cell" className="font-mono text-xs text-muted">
                  Roll #{student.rollNo}
                </div>

                {/* Visual Score Meter */}
                <div role="cell" className="w-full pr-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-base/80 p-0.5">
                    <motion.div
                      className={`h-full rounded-full ${
                        isSwap
                          ? 'bg-gradient-to-r from-warning to-amber-400'
                          : isComparing
                            ? 'bg-gradient-to-r from-cyan to-cyan-light'
                            : isLocked
                              ? 'bg-gradient-to-r from-success to-emerald-400'
                              : 'bg-gradient-to-r from-accent to-cyan'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Marks */}
                <div
                  role="cell"
                  className={`text-right font-mono text-sm font-bold tabular-nums ${
                    isSwap
                      ? 'text-warning'
                      : isComparing
                        ? 'text-cyan-light'
                        : isLocked
                          ? 'text-success'
                          : 'text-ink'
                  }`}
                >
                  {marks}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}