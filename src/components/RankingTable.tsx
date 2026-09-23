import { motion } from 'framer-motion'
import type { SortStep, Student } from '../types'

interface RankingTableProps {
  students: Student[]
  subjectId: string
  step: SortStep | null
  finished: boolean
}

const COLS = 'grid grid-cols-[56px_minmax(160px,1fr)_110px_96px] gap-2'

const medal = (rank: number) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '')

export default function RankingTable({ students, subjectId, step, finished }: RankingTableProps) {
  const n = students.length

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[540px]" role="table" aria-label="Student ranking">
        <div
          role="row"
          className={`${COLS} items-center border-b border-line px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted sm:px-5`}
        >
          <span role="columnheader" className="text-center">
            Rank
          </span>
          <span role="columnheader">Student</span>
          <span role="columnheader">Roll Number</span>
          <span role="columnheader" className="text-right">
            Marks
          </span>
        </div>

        <div role="rowgroup">
          {n === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted">
              No students yet — add some from the teacher panel.
            </div>
          )}

          {students.map((student, idx) => {
            const marks = student.marks[subjectId] ?? 0
            const isComparing = step?.comparing
              ? step.comparing.includes(idx)
              : step !== null && (idx === step.i || idx === step.j)
            const isSwap = isComparing && step?.action === 'swap'
            const isLocked = step?.sortedIndexes
              ? step.sortedIndexes.includes(idx)
              : step !== null && idx >= n - step.lockedCount

            const leftBorder = isComparing
              ? isSwap
                ? 'border-l-warning'
                : 'border-l-accent'
              : isLocked
                ? 'border-l-success/70'
                : 'border-l-transparent'

            const tint = isComparing ? (isSwap ? 'bg-warning/10' : 'bg-accent/5') : ''


            return (
              <motion.div
                key={student.id}
                role="row"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 480, damping: 40 }}
                className={`${COLS} h-14 items-center border-b border-b-line border-l-2 ${leftBorder} px-4 transition-colors last:border-b-0 sm:px-5 ${tint}`}
              >
                <div role="cell" className="flex items-center justify-center gap-1">
                  {finished && idx < 3 ? (
                    <>
                      <span aria-hidden>{medal(idx + 1)}</span>
                      <span className="text-sm font-semibold tabular-nums text-ink">
                        {idx + 1}
                      </span>
                    </>
                  ) : (
                    <span
                      className={`text-sm tabular-nums ${isLocked ? 'text-success' : 'text-muted'}`}
                    >
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div role="cell" className="flex min-w-0 items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-surface-2 text-xs font-semibold text-muted">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate text-sm text-ink">{student.name}</span>
                  {isLocked && !finished && (
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-success/70"
                      title="Final position"
                    />
                  )}
                </div>


                <div role="cell" className="text-sm tabular-nums text-muted">
                  {student.rollNo}
                </div>

                <div
                  role="cell"
                  className={`text-right text-sm font-semibold tabular-nums ${
                    isSwap ? 'text-warning' : 'text-ink'
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