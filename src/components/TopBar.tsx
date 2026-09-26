import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  GearIcon,
  PlayIcon,
  SparklesIcon,
  TrophyIcon,
  UserIcon,
  VolumeIcon,
  VolumeMuteIcon,
} from './icons'
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
  soundEnabled: boolean
  onToggleSound: () => void
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
  soundEnabled,
  onToggleSound,
}: TopBarProps) {
  const tabs = [
    { id: 'visualizer' as const, label: 'Visualizer', icon: PlayIcon },
    { id: 'students' as const, label: 'Students', icon: UserIcon },
    { id: 'ranking' as const, label: 'Leaderboard', icon: TrophyIcon },
    { id: 'about' as const, label: 'How It Works', icon: BookOpenIcon },
  ]

  const activeSubject = subjects.find((s) => s.id === activeSubjectId) ?? subjects[0]

  return (
    <header className="sticky top-0 z-30 w-full border-b border-line/80 bg-base/85 backdrop-blur-2xl transition-all">
      {/* Main TopBar Container - Covers Full Screen Width */}
      <div className="flex h-16 w-full items-center justify-between gap-2 px-3 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Left Section: Brand Identity */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Clean Modern App Icon */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-500/20">
            <div className="flex size-full items-center justify-center rounded-[10px] bg-[#0c0f24]">
              <TrophyIcon className="size-5 text-cyan-400" />
            </div>
          </div>

          {/* Title and Integrated Tag */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-none">
                Student Result Ranking
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                Bubble Sort
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-1">
              Classroom Merit Lineup Simulator
            </p>
          </div>
        </div>

        {/* Center Section: Navigation Tabs (Desktop & Tablet) */}
        <nav
          className="hidden md:flex items-center rounded-xl border border-line/80 bg-surface-2/50 p-1 backdrop-blur-md shadow-inner"
          aria-label="Main Navigation"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex cursor-pointer items-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 select-none ${
                  isActive
                    ? 'text-cyan-light font-bold'
                    : 'text-muted hover:text-ink hover:bg-surface-3/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="topbar-active-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-lg border border-cyan/40 bg-gradient-to-r from-accent/25 via-cyan/20 to-accent/15 shadow-[0_0_16px_rgba(6,182,212,0.25)]"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`size-3.5 ${isActive ? 'text-cyan-light' : 'text-muted'}`} />
                  <span>{tab.label}</span>
                </span>
              </button>
            )
          })}
        </nav>

        {/* Right Section: Toolbar (Sound, Sample Data, Subject Selector, Settings) */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {/* Audio Synthesizer Toggle */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sorting sound effects'}
            className={`grid size-8.5 sm:size-9 cursor-pointer place-items-center rounded-xl border transition-all ${
              soundEnabled
                ? 'border-cyan/50 bg-cyan/15 text-cyan-light shadow-sm shadow-cyan/25'
                : 'border-line bg-surface-2/60 text-muted hover:border-line-bright hover:text-ink'
            }`}
          >
            {soundEnabled ? <VolumeIcon className="size-4" /> : <VolumeMuteIcon className="size-4" />}
          </motion.button>

          {/* Quick Load Sample Data */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onLoadSample}
            disabled={locked}
            title={locked ? 'Locked during sort' : 'Load sample student dataset'}
            className="hidden lg:inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-surface-2/60 px-3 py-1.5 text-xs font-semibold text-cyan-light hover:border-cyan/40 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
          >
            <SparklesIcon className="size-3.5" />
            <span>Sample Data</span>
          </motion.button>

          {/* Subject Dropdown Pill */}
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2/60 px-2 sm:px-2.5 py-1">
            <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider text-muted">
              Subject:
            </span>
            <select
              value={activeSubject.id}
              onChange={(e) => onSelectSubject(e.target.value)}
              disabled={locked}
              className="cursor-pointer bg-transparent text-xs font-semibold text-ink outline-none transition-colors hover:text-cyan-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id} className="bg-surface text-ink">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Settings Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={onOpenSettings}
            disabled={locked}
            title={locked ? 'Editing is locked during sorting' : 'Teacher configuration settings'}
            aria-label="Teacher settings"
            className="grid size-8.5 sm:size-9 cursor-pointer place-items-center rounded-xl border border-line bg-surface-2/60 text-muted transition-all hover:border-accent/40 hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <GearIcon className="size-4" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Streamlined Navigation Bar (< md screens) */}
      <div className="flex border-t border-line/60 bg-surface-2/40 px-2 py-1.5 md:hidden backdrop-blur-md">
        <div className="flex w-full justify-around gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border border-cyan/40 bg-cyan/15 text-cyan-light shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}