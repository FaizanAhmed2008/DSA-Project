import type { SortStep, Student, Subject } from '../types'
import { TrophyIcon } from './icons'

interface FinalRankingViewProps {
  students: Student[]
  activeSubject: Subject
  lastStep: SortStep | null
  onGoToVisualizer: () => void
}

const medalConfig = [
  { rank: 1, label: '1st Place', color: 'from-amber-400 to-yellow-600', icon: '🥇', border: 'border-yellow-500/40 bg-yellow-500/5' },
  { rank: 2, label: '2nd Place', color: 'from-slate-300 to-slate-500', icon: '🥈', border: 'border-slate-400/40 bg-slate-400/5' },
  { rank: 3, label: '3rd Place', color: 'from-amber-700 to-amber-900', icon: '🥉', border: 'border-amber-700/40 bg-amber-700/5' },
]

export default function FinalRankingView({
  students,
  activeSubject,
  lastStep,
  onGoToVisualizer,
}: FinalRankingViewProps) {
  // Sort descending by marks to guarantee ranking display
  const ranked = [...students].sort(
    (a, b) => (b.marks[activeSubject.id] ?? 0) - (a.marks[activeSubject.id] ?? 0),
  )

  const marksList = ranked.map((s) => s.marks[activeSubject.id] ?? 0)
  const highest = marksList.length > 0 ? Math.max(...marksList) : 0
  const lowest = marksList.length > 0 ? Math.min(...marksList) : 0
  const average = marksList.length > 0 ? (marksList.reduce((a, b) => a + b, 0) / marksList.length).toFixed(1) : '0'

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface p-12 text-center">
        <TrophyIcon className="mx-auto mb-3 size-10 text-muted/40" />
        <h3 className="text-base font-semibold text-ink">No Students in Classroom</h3>
        <p className="mt-1 text-xs text-muted">Add students to view the ranking leaderboard.</p>
      </div>
    )
  }

  const topThree = ranked.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-warning/30 bg-warning/10 text-warning">
            <TrophyIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Classroom Final Leaderboard</h2>
            <p className="text-xs text-muted">
              Ranked in descending order by{' '}
              <span className="font-semibold text-accent">{activeSubject.name}</span> marks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToVisualizer}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-[#06202c] transition-colors hover:bg-[#5ecbf8]"
        >
          View Bubble Sort Steps
        </button>
      </div>

      {/* Summary Statistics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Students</span>
          <div className="mt-1 text-xl font-bold tabular-nums text-ink">{students.length}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Highest</span>
          <div className="mt-1 text-xl font-bold tabular-nums text-success">{highest}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Class Average</span>
          <div className="mt-1 text-xl font-bold tabular-nums text-accent">{average}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Lowest</span>
          <div className="mt-1 text-xl font-bold tabular-nums text-muted">{lowest}</div>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Comparisons / Swaps</span>
          <div className="mt-1 text-xl font-bold tabular-nums text-ink">
            {lastStep ? `${lastStep.comparisonCount} / ${lastStep.swapCount}` : '—'}
          </div>
        </div>
      </div>

      {/* Podium for Top 3 */}
      {topThree.length >= 2 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {topThree.map((student, idx) => {
            const config = medalConfig[idx]
            const marks = student.marks[activeSubject.id] ?? 0
            return (
              <div
                key={student.id}
                className={`relative flex items-center justify-between rounded-xl border p-4 transition-transform hover:-translate-y-0.5 ${config.border}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl" aria-hidden>
                    {config.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      {config.label}
                    </span>
                    <h3 className="text-sm font-bold text-ink">{student.name}</h3>
                    <p className="font-mono text-xs text-muted">Roll #{student.rollNo}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black tabular-nums text-ink">{marks}</div>
                  <span className="text-[10px] uppercase tracking-wider text-muted">Marks</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full Descending Ranking Table */}
      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-5 py-3">
          <h3 className="text-sm font-semibold text-ink">Complete Merit List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-xs">
            <thead className="border-b border-line bg-surface-2/40 text-[11px] font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="w-16 px-4 py-3 text-center">Rank</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Roll Number</th>
                <th className="w-48 px-4 py-3">Score Bar</th>
                <th className="px-4 py-3 text-right">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ranked.map((student, idx) => {
                const marks = student.marks[activeSubject.id] ?? 0
                const percent = highest > 0 ? (marks / 100) * 100 : 0
                const isTop = idx === 0

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors hover:bg-surface-2/40 ${
                      isTop ? 'bg-accent/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      {idx < 3 ? (
                        <span className="text-base font-bold" title={`Rank ${idx + 1}`}>
                          {medalConfig[idx].icon}
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-muted">
                          #{idx + 1}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-7 shrink-0 place-items-center rounded bg-surface-2 font-mono text-xs font-bold text-accent">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="font-semibold text-ink">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted">
                      #{student.rollNo}
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-base">
                        <div
                          className={`h-full rounded-full ${
                            isTop ? 'bg-accent' : idx < 3 ? 'bg-success' : 'bg-line'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-bold tabular-nums text-ink">
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
