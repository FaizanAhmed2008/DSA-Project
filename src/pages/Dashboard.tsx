import { useEffect, useState } from 'react'
import BubbleSortVisualizer from '../components/BubbleSortVisualizer'
import Controls from '../components/Controls'
import ExplanationPanel from '../components/ExplanationPanel'
import FinalRankingView from '../components/FinalRankingView'
import HowItWorksModal from '../components/HowItWorksModal'
import RankingTable from '../components/RankingTable'
import SettingsDrawer, { type StudentPatch } from '../components/SettingsDrawer'
import StatsPanel from '../components/StatsPanel'
import StepHistory from '../components/StepHistory'
import StudentManager from '../components/StudentManager'
import TopBar, { type NavTab } from '../components/TopBar'
import { PlusIcon, SparklesIcon } from '../components/icons'
import { defaultStudents, defaultSubjects } from '../data/defaults'
import type { SortStep, Student, Subject } from '../types'
import { soundFX } from '../utils/audio'
import { clampMarks, generateSortSteps, makeId, sampleStudents } from '../utils/bubbleSort'

function StateChip({
  started,
  running,
  finished,
}: {
  started: boolean
  running: boolean
  finished: boolean
}) {
  let label = 'Ready'
  let cls = 'border-line bg-surface-2/60 text-muted'
  if (finished) {
    label = 'Complete'
    cls = 'border-success/40 bg-success/15 text-success shadow-[0_0_12px_rgba(16,185,129,0.2)]'
  } else if (running) {
    label = 'Sorting'
    cls = 'border-cyan/40 bg-cyan/15 text-cyan-light shadow-[0_0_12px_rgba(6,182,212,0.2)]'
  } else if (started) {
    label = 'Paused'
    cls = 'border-warning/40 bg-warning/15 text-warning shadow-[0_0_12px_rgba(245,158,11,0.2)]'
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${cls}`}
    >
      {(running || finished) && (
        <span
          className={`size-2 rounded-full ${finished ? 'bg-success' : 'bg-cyan'} ${
            running ? 'animate-pulse' : ''
          }`}
        />
      )}
      {label}
    </span>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<NavTab>('visualizer')
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects)
  const [activeSubjectId, setActiveSubjectId] = useState<string>(defaultSubjects[0].id)
  const [students, setStudents] = useState<Student[]>(defaultStudents)
  const [steps, setSteps] = useState<SortStep[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(60)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const activeSubject = subjects.find((s) => s.id === activeSubjectId) ?? subjects[0]
  const started = currentStep >= 0 && steps.length > 0
  const step = started ? steps[currentStep] : null
  const finished = steps.length > 0 && currentStep === steps.length - 1
  const locked = started && !finished
  const displayStudents = step ? step.array : students
  const isRunning = playing && !finished
  const canRun = students.length >= 2
  const canPrev = started && currentStep > 0
  const lastStep = steps.length > 0 ? steps[steps.length - 1] : null

  // Interval speed calculation (fast vs slow)
  const speedInterval = Math.round(1600 - speed * 13)

  // Step playback timer
  useEffect(() => {
    if (!playing) return
    if (currentStep >= steps.length - 1) {
      const stopTimer = setTimeout(() => setPlaying(false), 0)
      return () => clearTimeout(stopTimer)
    }
    const timer = setTimeout(() => {
      setCurrentStep((c) => Math.min(steps.length - 1, c + 1))
    }, speedInterval)
    return () => clearTimeout(timer)
  }, [playing, currentStep, steps.length, speedInterval])

  // Play sound effect on step transitions
  useEffect(() => {
    if (!soundEnabled || !step) return
    if (step.action === 'swap') {
      soundFX.playSwap()
    } else if (step.action === 'compare' && step.left) {
      soundFX.playCompare(step.left.marks)
    } else if (step.action === 'complete') {
      soundFX.playComplete()
    }
  }, [currentStep, step, soundEnabled])

  // Reset sorting state without deleting students
  const resetSort = () => {
    setPlaying(false)
    setCurrentStep(-1)
    setSteps([])
  }

  const handleStart = () => {
    if (students.length < 2) return
    if (!started || finished) {
      const generated = generateSortSteps(students, activeSubjectId)
      setSteps(generated)
      setCurrentStep(0)
    }
    setPlaying(true)
  }

  const handleNext = () => {
    setPlaying(false)
    if (!started) {
      if (students.length < 2) return
      const generated = generateSortSteps(students, activeSubjectId)
      setSteps(generated)
      setCurrentStep(0)
      return
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1)
    }
  }

  const handlePrev = () => {
    setPlaying(false)
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1)
    }
  }

  const handleSelectStep = (stepIdx: number) => {
    setPlaying(false)
    if (stepIdx >= 0 && stepIdx < steps.length) {
      setCurrentStep(stepIdx)
    }
  }

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    soundFX.setEnabled(next)
  }

  // Keyboard Shortcuts (Space, ArrowLeft, ArrowRight, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        if (playing) {
          setPlaying(false)
        } else if (canRun) {
          handleStart()
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        resetSort()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const handleSelectSubject = (id: string) => {
    if (!subjects.some((s) => s.id === id)) return
    setActiveSubjectId(id)
    resetSort()
  }

  const handleAddSubject = (name: string) => {
    const id = makeId('sub')
    setSubjects((prev) => [...prev, { id, name }])
    setActiveSubjectId(id)
  }

  const handleRenameSubject = (id: string, name: string) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)))
  }

  const handleDeleteSubject = (id: string) => {
    const next = subjects.filter((s) => s.id !== id)
    setSubjects(next)
    if (id === activeSubjectId && next.length > 0) setActiveSubjectId(next[0].id)
  }

  const handleUpdateStudent = (id: string, patch: StudentPatch) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const next: Student = { ...s }
        if (patch.name !== undefined) next.name = patch.name
        if (patch.rollNo !== undefined) next.rollNo = patch.rollNo
        if (patch.marks !== undefined) {
          next.marks = { ...s.marks, [activeSubjectId]: clampMarks(patch.marks) }
        }
        return next
      }),
    )
    resetSort()
  }

  const handleAddStudent = (name: string, rollNo: number, marks: number) => {
    const student: Student = {
      id: makeId('stu'),
      name,
      rollNo,
      marks: { [activeSubjectId]: clampMarks(marks) },
    }
    setStudents((prev) => [...prev, student])
    resetSort()
  }

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    resetSort()
  }

  const handleLoadSample = () => {
    setStudents(sampleStudents)
    resetSort()
  }

  const handleClearAll = () => {
    setStudents([])
    resetSort()
  }

  return (
    <div className="relative min-h-screen bg-base pb-16 selection:bg-cyan/30 selection:text-ink">
      {/* Cyber Ambient Mesh Lighting Orbs */}
      <div className="ambient-bg" aria-hidden>
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
        <div className="ambient-orb-3" />
      </div>

      <TopBar
        subjects={subjects}
        activeSubjectId={activeSubject.id}
        locked={locked}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSelectSubject={handleSelectSubject}
        onOpenSettings={() => setSettingsOpen(true)}
        onLoadSample={handleLoadSample}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="relative z-10 w-full space-y-6 px-3 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6">
        {/* TAB 1: VISUALIZER */}
        {activeTab === 'visualizer' && (
          <div className="w-full space-y-6">
            {/* Empty State when no students exist */}
            {students.length === 0 ? (
              <div className="w-full rounded-2xl glass-panel p-12 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-accent/20 to-cyan/20 p-0.5 shadow-lg shadow-accent/20">
                  <div className="grid size-full place-items-center rounded-[14px] bg-surface text-cyan">
                    <PlusIcon className="size-6" />
                  </div>
                </div>
                <h2 className="mt-4 text-lg font-bold text-ink">No Students in Classroom</h2>
                <p className="mx-auto mt-1 max-w-md text-xs text-muted">
                  Add student results to start sorting and ranking, or load our ready-made classroom sample.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-cyan px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-accent/25 hover:shadow-cyan/35 transition-all"
                  >
                    <PlusIcon className="size-4" />
                    Add Student
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/15 px-4 py-2.5 text-xs font-bold text-cyan-light hover:bg-cyan/25 transition-all"
                  >
                    <SparklesIcon className="size-4" />
                    Load Sample Classroom
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Control Bar & Stats Panel Container */}
                <section className="w-full overflow-hidden rounded-2xl glass-panel">
                  <Controls
                    playing={isRunning}
                    started={started}
                    finished={finished}
                    canRun={canRun}
                    speed={speed}
                    onSpeedChange={setSpeed}
                    onStart={handleStart}
                    onPause={() => setPlaying(false)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    canPrev={canPrev}
                    onReset={resetSort}
                  />
                  <StatsPanel
                    step={step}
                    started={started}
                    students={students}
                    subjectId={activeSubject.id}
                  />
                </section>

                {/* THE MAIN BUBBLE SORT VISUALIZER (Cards Animated Centerpiece) */}
                <BubbleSortVisualizer
                  students={students}
                  subjectId={activeSubject.id}
                  subjectName={activeSubject.name}
                  step={step}
                  started={started}
                  finished={finished}
                />

                {/* Secondary Panels: Ranking Table + Step Timeline / Explanation */}
                <div className="w-full grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
                  {/* Live Table */}
                  <section className="overflow-hidden rounded-2xl glass-panel">
                    <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2/40 px-5 py-3.5 sm:px-6 backdrop-blur-md">
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-ink">
                          {finished ? 'Classroom Ranking Complete' : 'Live Standings Table'}
                        </h2>
                        <p className="truncate text-xs text-muted">{activeSubject.name} Current Order</p>
                      </div>
                      <StateChip started={started} running={isRunning} finished={finished} />
                    </div>

                    <RankingTable
                      students={displayStudents}
                      subjectId={activeSubject.id}
                      step={finished ? null : step}
                      finished={finished}
                    />

                    {finished && lastStep && (
                      <div className="flex flex-wrap items-center justify-between border-t border-line bg-surface-2/30 px-5 py-3.5 text-xs text-muted sm:px-6">
                        <div className="flex items-center gap-4">
                          <span>
                            Students <strong className="text-ink">{students.length}</strong>
                          </span>
                          <span>
                            Comparisons <strong className="text-cyan-light">{lastStep.comparisonCount}</strong>
                          </span>
                          <span>
                            Swaps <strong className="text-warning">{lastStep.swapCount}</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('ranking')}
                          className="font-bold text-cyan-light hover:underline"
                        >
                          View Full Podium →
                        </button>
                      </div>
                    )}
                  </section>

                  {/* Right Column: Step History Timeline + Pedagogical Explanation */}
                  <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                    <StepHistory
                      steps={steps}
                      currentStep={currentStep}
                      onSelectStep={handleSelectStep}
                    />

                    <ExplanationPanel step={step} started={started} finished={finished} />
                  </aside>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE STUDENTS */}
        {activeTab === 'students' && (
          <StudentManager
            students={students}
            activeSubject={activeSubject}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onLoadSample={handleLoadSample}
            onClearAll={handleClearAll}
          />
        )}

        {/* TAB 3: FINAL RANKING & LEADERBOARD */}
        {activeTab === 'ranking' && (
          <FinalRankingView
            students={students}
            activeSubject={activeSubject}
            lastStep={lastStep}
            onGoToVisualizer={() => setActiveTab('visualizer')}
          />
        )}

        {/* TAB 4: HOW IT WORKS / ABOUT */}
        {activeTab === 'about' && <HowItWorksModal />}
      </main>

      {/* Teacher Settings Drawer */}
      <SettingsDrawer
        open={settingsOpen}
        subjects={subjects}
        activeSubjectId={activeSubject.id}
        students={students}
        onClose={() => setSettingsOpen(false)}
        onSelectSubject={handleSelectSubject}
        onAddSubject={handleAddSubject}
        onRenameSubject={handleRenameSubject}
        onDeleteSubject={handleDeleteSubject}
        onUpdateStudent={handleUpdateStudent}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
      />
    </div>
  )
}