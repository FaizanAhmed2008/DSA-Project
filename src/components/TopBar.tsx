import { GearIcon, TrophyIcon } from './icons'
import type { Subject } from '../types'

interface TopBarProps {
  subjects: Subject[]
  activeSubjectId: string
  locked: boolean
  onSelectSubject: (id: string) => void
  onOpenSettings: () => void
}

export default function TopBar({
  subjects,
  activeSubjectId,
  locked,
  onSelectSubject,
  onOpenSettings,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-base/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent">
            <TrophyIcon className="size-4" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-ink sm:text-[15px]">
              Student Result Ranking System
            </h1>
            <p className="truncate text-[11px] text-muted">Bubble Sort Visualization</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5">
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-muted sm:inline">
              Subject
            </span>
            <select
              value={activeSubjectId}
              onChange={(e) => onSelectSubject(e.target.value)}
              disabled={locked}
              className="max-w-36 cursor-pointer rounded-md border border-line bg-surface-2 px-2 py-1 text-sm text-ink outline-none transition-colors hover:border-accent/40 focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-44"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            disabled={locked}
            title={locked ? 'Editing is locked during sorting' : 'Teacher settings'}
            aria-label="Teacher settings"
            className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <GearIcon className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}