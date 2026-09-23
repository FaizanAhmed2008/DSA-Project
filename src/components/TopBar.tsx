import { BookOpenIcon, GearIcon, PlayIcon, SparklesIcon, TrophyIcon, UserIcon } from './icons'
import type { Subject } from '../types'

export type NavTab = 'visualizer' | 'students' | 'ranking' | 'about'

interface TopBarProps {
  subjects: Subject[]
  activeSubjectId: string
  locked: boolean
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  onSelectSubject: (id: string) => void
  onOpenSettings: () => void
  onLoadSample: () => void
}

export default function TopBar({
  subjects,
  activeSubjectId,
  locked,
  activeTab,
  onSelectTab,
  onSelectSubject,
  onOpenSettings,
  onLoadSample,
}: TopBarProps) {
  const tabs = [
    { id: 'visualizer' as const, label: 'Visualizer', icon: PlayIcon },
    { id: 'students' as const, label: 'Students', icon: UserIcon },
    { id: 'ranking' as const, label: 'Leaderboard', icon: TrophyIcon },
    { id: 'about' as const, label: 'How It Works', icon: BookOpenIcon },
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-base/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        {/* Left: Brand Identity */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-accent/40 bg-accent/10 text-accent">
            <TrophyIcon className="size-4" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-ink sm:text-[15px]">
              Student Ranking System
            </h1>
            <p className="truncate text-[11px] text-muted">Bubble Sort Visualization</p>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden items-center rounded-lg border border-line bg-surface p-1 md:flex" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent text-[#06202c]'
                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Right: Subject Selector & Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Quick Load Sample Data */}
          <button
            type="button"
            onClick={onLoadSample}
            disabled={locked}
            title={locked ? 'Locked during sort' : 'Load sample student dataset'}
            className="hidden sm:inline-flex cursor-pointer items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-accent hover:border-accent/40 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SparklesIcon className="size-3.5" />
            <span>Sample Data</span>
          </button>

          {/* Subject Dropdown */}
          <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5">
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-muted lg:inline">
              Subject
            </span>
            <select
              value={activeSubjectId}
              onChange={(e) => onSelectSubject(e.target.value)}
              disabled={locked}
              className="max-w-28 cursor-pointer rounded-md border border-line bg-surface-2 px-2 py-1 text-xs font-medium text-ink outline-none transition-colors hover:border-accent/40 focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-40"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Settings Button */}
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

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex border-t border-line/60 bg-surface/50 px-2 py-1 md:hidden overflow-x-auto">
        <div className="flex w-full justify-around gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent text-[#06202c]'
                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`}
              >
                <Icon className="size-3" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}