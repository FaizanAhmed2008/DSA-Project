import { motion } from 'framer-motion'
import type { SortStep, Student, Subject } from '../types'
import { SparklesIcon, TrophyIcon } from './icons'

interface FinalRankingViewProps {
  students: Student[]
  activeSubject: Subject
  lastStep: SortStep | null
  onGoToVisualizer: () => void
}

const medalConfig = [
  {
    rank: 1,
    label: '1st Place • Champion',
    glow: 'border-yellow-500/50 bg-gradient-to-b from-yellow-500/20 via-yellow-500/5 to-surface-2/80 shadow-[0_0_35px_rgba(234,179,8,0.2)]',
    badge: 'bg-yellow-500 text-slate-950 font-black',
    accentText: 'text-yellow-400',
    icon: '🥇',
  },
  {
    rank: 2,
    label: '2nd Place • Runner Up',
    glow: 'border-cyan/50 bg-gradient-to-b from-cyan/20 via-cyan/5 to-surface-2/80 shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    badge: 'bg-cyan text-slate-950 font-black',
    accentText: 'text-cyan-light',
    icon: '🥈',
  },
  {
    rank: 3,
    label: '3rd Place • Bronze',
    glow: 'border-amber-600/50 bg-gradient-to-b from-amber-600/20 via-amber-600/5 to-surface-2/80 shadow-[0_0_30px_rgba(217,119,6,0.2)]',
    badge: 'bg-amber-600 text-slate-950 font-black',
    accentText: 'text-amber-400',
    icon: '🥉',
  },
]

export default function FinalRankingView({
  students,
  activeSubject,
  lastStep,
  onGoToVisualizer,
}: FinalRankingViewProps) {
  // Sort descending by marks
  const ranked = [...students].sort(
    (a, b) => (b.marks[activeSubject.id] ?? 0) - (a.marks[activeSubject.id] ?? 0),
  )

  const marksList = ranked.map((s) => s.marks[activeSubject.id] ?? 0)
  const highest = marksList.length > 0 ? Math.max(...marksList) : 0
  const lowest = marksList.length > 0 ? Math.min(...marksList) : 0
  const average =
    marksList.length > 0
      ? (marksList.reduce((a, b) => a + b, 0) / marksList.length).toFixed(1)
      : '0'

  if (students.length === 0) {
    return (
      <div className="rounded-2xl glass-panel p-12 text-center">
        <TrophyIcon className="mx-auto mb-3 size-12 text-muted/30" />
        <h3 className="text-base font-bold text-ink">No Students in Classroom</h3>
        <p className="mt-1 text-xs text-muted">
          Add students or load sample data to generate the ranking leaderboard.
        </p>
      </div>
    )
  }

  const topThree = ranked.slice(0, 3)

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6">
        <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex size-12 place-items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 p-0.5 shadow-lg shadow-yellow-500/25">
              <div className="flex size-full items-center justify-center rounded-[14px] bg-base">
                <TrophyIcon className="size-6 text-yellow-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
                Classroom Merit Leaderboard
              </h2>
              <p className="text-xs text-muted">
                Sorted by descending marks in{' '}
                <span className="font-semibold text-cyan-light">{activeSubject.name}</span>.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onGoToVisualizer}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-accent to-cyan px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-accent/20 hover:shadow-cyan/30 transition-all"
          >
            ← View Step-by-Step Sort
          </motion.button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Total Students
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-ink">{students.length}</div>
        </div>
        <div className="rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Highest Score
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-success">{highest}</div>
        </div>
        <div className="rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Class Average
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-cyan-light">{average}</div>
        </div>
        <div className="rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Lowest Score
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-muted">{lowest}</div>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Sort Swaps
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-accent-light">
            {lastStep ? lastStep.swapCount : '—'}
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 2 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {topThree.map((student, idx) => {
            const config = medalConfig[idx]
            const marks = student.marks[activeSubject.id] ?? 0
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                whileHover={{ y: -4 }}
                className={`relative flex items-center justify-between rounded-2xl border p-5 backdrop-blur-md transition-all ${config.glow}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="text-3xl select-none" aria-hidden>
                    {config.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                      {config.label}
                    </span>
                    <h3 className="text-base font-bold text-ink">{student.name}</h3>
                    <p className="font-mono text-xs text-muted">Roll #{student.rollNo}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono text-3xl font-black tabular-nums ${config.accentText}`}>
                    {marks}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Marks
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Full Descending Merit Table */}
      <section className="overflow-hidden rounded-2xl glass-panel">
        <div className="flex items-center justify-between border-b border-line bg-surface-2/40 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-cyan" />
            <h3 className="text-sm font-bold text-ink">Complete Merit List (Rank 1 to {ranked.length})</h3>
          </div>
          <span className="text-xs text-muted font-mono">Descending Order</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-xs">
            <thead className="border-b border-line bg-surface-2/30 font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
              <tr>
                <th className="w-16 px-5 py-3.5 text-center">Rank</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="w-48 px-5 py-3.5">Score Visualizer</th>
                <th className="px-5 py-3.5 text-right">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {ranked.map((student, idx) => {
                const marks = student.marks[activeSubject.id] ?? 0
                const percent = highest > 0 ? (marks / 100) * 100 : 0
                const isTop = idx === 0

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors hover:bg-surface-2/50 ${
                      isTop ? 'bg-accent/10' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 text-center">
                      {idx < 3 ? (
                        <span className="text-lg" title={`Rank ${idx + 1}`}>
                          {medalConfig[idx].icon}
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-muted">
                          #{idx + 1}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative flex size-7.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/25 to-cyan/25 p-0.5">
                          <div className="flex size-full items-center justify-center rounded-[10px] bg-surface font-mono text-xs font-bold text-cyan-light">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <span className="font-semibold text-ink sm:text-sm">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-muted">
                      #{student.rollNo}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-base/80 p-0.5">
                        <motion.div
                          className={`h-full rounded-full ${
                            isTop
                              ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                              : idx < 3
                                ? 'bg-gradient-to-r from-cyan to-accent'
                                : 'bg-gradient-to-r from-accent/60 to-cyan/60'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm font-bold tabular-nums text-ink">
                      {marks}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
