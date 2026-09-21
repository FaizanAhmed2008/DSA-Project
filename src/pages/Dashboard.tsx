import { useEffect, useState } from 'react'
import Controls from '../components/Controls'
import ExplanationPanel from '../components/ExplanationPanel'
import RankingTable from '../components/RankingTable'
import SettingsDrawer, { type StudentPatch } from '../components/SettingsDrawer'
import StatsPanel from '../components/StatsPanel'
import TopBar from '../components/TopBar'
import { defaultStudents, defaultSubjects } from '../data/defaults'
import { clampMarks, generateSortSteps, makeId } from '../utils/bubbleSort'
import type { SortStep, Student, Subject } from '../types'

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
  let cls = 'border-line bg-surface-2 text-muted'
  if (finished) {
    label = 'Complete'
    cls = 'border-success/30 bg-success/10 text-success'
  } else if (running) {
    label = 'Sorting'
    cls = 'border-accent/30 bg-accent/10 text-accent'
  } else if (started) {
    label = 'Paused'
    cls = 'border-warning/30 bg-warning/10 text-warning'
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${cls}`}
    >
      {(running || finished) && (
        <span
          className={`size-1.5 rounded-full ${finished ? 'bg-success' : 'bg-accent'} ${
            running ? 'animate-pulse' : ''
          }`}
        />
      )}
      {label}
    </span>
  )
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects)
  const [activeSubjectId, setActiveSubjectId] = useState<string>(defaultSubjects[0].id)
  const [students, setStudents] = useState<Student[]>(defaultStudents)
  const [steps, setSteps] = useState<SortStep[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(60)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const activeSubject = subjects.find((s) => s.id === activeSubjectId) ?? subjects[0]
  const started = currentStep >= 0 && steps.length > 0
  const step = started ? steps[currentStep] : null
  const finished = steps.length > 0 && currentStep === steps.length - 1
  const locked = started && !finished
  const displayStudents = step ? step.array : students
  const isRunning = playing && !finished
  const canRun = students.length >= 2
  const lastStep = steps.length > 0 ? steps[steps.length - 1] : null

  const speedInterval = Math.round(1600 - speed * 13)

  useEffect(() => {
    if (!playing) return
    if (currentStep >= steps.length - 1) return
    const timer = setTimeout(
      () => setCurrentStep((c) => Math.min(steps.length - 1, c + 1)),
      speedInterval,
    )
    return () => clearTimeout(timer)
  }, [playing, currentStep, steps.length, speedInterval])

  const resetSort = () => {
    setPlaying(false)
    setCurrentStep(-1)
  }

  const handleStart = () => {
    if (students.length < 2) return
    if (!started || finished) {
      setSteps(generateSortSteps(students, activeSubjectId))
      setCurrentStep(0)
    }
    setPlaying(true)
  }

  const handleNext = () => {
    setPlaying(false)
    if (!started) {
      if (students.length < 2) return
      setSteps(generateSortSteps(students, activeSubjectId))
      setCurrentStep(0)
      return
    }
    if (currentStep < steps.length - 1) setCurrentStep((c) => c + 1)
  }

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

  return (
    <div className="min-h-screen bg-base">
      <TopBar
        subjects={subjects}
        activeSubjectId={activeSubject.id}
        locked={locked}
        onSelectSubject={handleSelectSubject}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-5 sm:px-6 sm:py-6">
        <section className="overflow-hidden rounded-xl border border-line bg-surface">
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
            onReset={resetSort}
          />
          <StatsPanel step={step} started={started} />
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-ink">
                  {finished ? 'Ranking Complete' : 'Live Ranking'}
                </h2>
                <p className="truncate text-xs text-muted">{activeSubject.name}</p>
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
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line px-4 py-3 text-xs text-muted sm:px-5">
                <span>
                  Students{' '}
                  <span className="font-semibold text-ink">{students.length}</span>
                </span>
                <span>
                  Comparisons{' '}
                  <span className="font-semibold text-ink">{lastStep.comparisonCount}</span>
                </span>
                <span>
                  Swaps <span className="font-semibold text-ink">{lastStep.swapCount}</span>
                </span>
              </div>
            )}

            {!canRun && !started && (
              <p className="border-t border-line px-4 py-3 text-xs text-muted sm:px-5">
                Add at least 2 students from the teacher panel to start ranking.
              </p>
            )}
          </section>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <ExplanationPanel step={step} started={started} finished={finished} />
          </aside>
        </div>
      </main>

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