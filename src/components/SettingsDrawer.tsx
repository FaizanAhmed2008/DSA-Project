import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { drawer, overlay } from '../animations'
import { CloseIcon, PencilIcon, PlusIcon, TrashIcon } from './icons'
import type { Student, Subject } from '../types'

export interface StudentPatch {
  name?: string
  rollNo?: number
  marks?: number
}

interface SettingsDrawerProps {
  open: boolean
  subjects: Subject[]
  activeSubjectId: string
  students: Student[]
  onClose: () => void
  onSelectSubject: (id: string) => void
  onAddSubject: (name: string) => void
  onRenameSubject: (id: string, name: string) => void
  onDeleteSubject: (id: string) => void
  onUpdateStudent: (id: string, patch: StudentPatch) => void
  onAddStudent: (name: string, rollNo: number, marks: number) => void
  onDeleteStudent: (id: string) => void
}

const inputCls =
  'w-full rounded-xl border border-line bg-surface-2 px-3 py-2 text-xs sm:text-sm text-ink placeholder:text-muted/50 outline-none transition-all focus:border-cyan focus:ring-2 focus:ring-cyan/30'

const inlineBtn =
  'grid size-7 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink'

const addBtn =
  'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-cyan px-3.5 py-2 text-xs font-bold text-slate-950 shadow-sm transition-all hover:brightness-110'

export default function SettingsDrawer({
  open,
  subjects,
  activeSubjectId,
  students,
  onClose,
  onSelectSubject,
  onAddSubject,
  onRenameSubject,
  onDeleteSubject,
  onUpdateStudent,
  onAddStudent,
  onDeleteStudent,
}: SettingsDrawerProps) {
  const [newSubject, setNewSubject] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [newName, setNewName] = useState('')
  const [newRoll, setNewRoll] = useState('')
  const [newMarks, setNewMarks] = useState('')
  const [studentError, setStudentError] = useState<string | null>(null)

  const activeSubject = subjects.find((s) => s.id === activeSubjectId)

  const submitSubject = () => {
    const name = newSubject.trim()
    if (name) {
      onAddSubject(name)
      setNewSubject('')
    }
  }

  const submitRename = () => {
    if (renamingId && renameValue.trim()) {
      onRenameSubject(renamingId, renameValue.trim())
    }
    setRenamingId(null)
  }

  const submitStudent = () => {
    setStudentError(null)
    const name = newName.trim()
    if (!name) {
      setStudentError('Student name is required.')
      return
    }
    const roll = Number(newRoll)
    if (!Number.isInteger(roll) || roll <= 0) {
      setStudentError('Roll number must be a positive integer.')
      return
    }
    if (students.some((s) => s.rollNo === roll)) {
      setStudentError(`Roll number ${roll} is already in use.`)
      return
    }
    const marksVal = Number(newMarks)
    if (newMarks === '' || Number.isNaN(marksVal) || marksVal < 0 || marksVal > 100) {
      setStudentError('Marks must be between 0 and 100.')
      return
    }
    onAddStudent(name, roll, marksVal)
    setNewName('')
    setNewRoll('')
    setNewMarks('')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            variants={drawer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-surface/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4.5">
              <div>
                <h2 className="text-base font-bold text-ink">Teacher Configuration</h2>
                <p className="text-xs text-muted">Manage classroom subjects and student data</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-8 cursor-pointer place-items-center rounded-xl border border-line bg-surface-2 text-muted transition-colors hover:text-ink hover:border-line-bright"
                aria-label="Close panel"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {/* Subjects */}
              <section>
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted">
                  Classroom Subjects
                </h3>
                <div className="space-y-2">
                  {subjects.map((subject) => {
                    const isActive = subject.id === activeSubjectId
                    const isRenaming = renamingId === subject.id
                    return (
                      <div
                        key={subject.id}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all ${
                          isActive
                            ? 'border-cyan/50 bg-cyan/15 text-cyan-light shadow-sm shadow-cyan/15'
                            : 'border-line bg-surface-2/40 hover:bg-surface-2/70'
                        }`}
                      >
                        <input
                          type="radio"
                          name="subject"
                          checked={isActive}
                          onChange={() => onSelectSubject(subject.id)}
                          className="size-4 accent-cyan"
                        />
                        {isRenaming ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={submitRename}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') submitRename()
                              if (e.key === 'Escape') setRenamingId(null)
                            }}
                            className={`${inputCls} flex-1`}
                          />
                        ) : (
                          <span
                            className={`flex-1 truncate text-xs font-semibold ${
                              isActive ? 'text-ink' : 'text-slate-300'
                            }`}
                          >
                            {subject.name}
                          </span>
                        )}
                        <button
                          type="button"
                          className={inlineBtn}
                          onClick={() => {
                            setRenamingId(subject.id)
                            setRenameValue(subject.name)
                          }}
                          aria-label={`Rename ${subject.name}`}
                        >
                          <PencilIcon className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${inlineBtn} hover:text-danger`}
                          onClick={() => onDeleteSubject(subject.id)}
                          aria-label={`Delete ${subject.name}`}
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitSubject()}
                    placeholder="New subject title"
                    className={inputCls}
                  />
                  <button type="button" onClick={submitSubject} className={addBtn}>
                    <PlusIcon className="size-3.5" />
                    Add
                  </button>
                </div>
              </section>

              {/* Students quick list */}
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                  Students ({students.length})
                </h3>
                <p className="mb-3 rounded-xl border border-line bg-surface-2/50 px-3 py-2 text-xs text-muted">
                  Editing marks specifically for{' '}
                  <span className="font-bold text-cyan-light">{activeSubject?.name ?? '—'}</span>.
                </p>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="space-y-2 rounded-xl border border-line bg-surface-2/50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          value={student.name}
                          onChange={(e) => onUpdateStudent(student.id, { name: e.target.value })}
                          placeholder="Name"
                          className={inputCls}
                        />
                        <button
                          type="button"
                          className={`${inlineBtn} shrink-0 hover:text-danger`}
                          onClick={() => onDeleteStudent(student.id)}
                          aria-label={`Delete ${student.name}`}
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <label className="w-16 shrink-0 text-muted">Roll No</label>
                        <input
                          type="number"
                          value={student.rollNo}
                          onChange={(e) =>
                            onUpdateStudent(student.id, { rollNo: Number(e.target.value) || 0 })
                          }
                          className={`${inputCls} tabular-nums`}
                        />
                        <label className="w-12 shrink-0 text-muted">Marks</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={student.marks[activeSubjectId] ?? 0}
                          onChange={(e) =>
                            onUpdateStudent(student.id, { marks: Number(e.target.value) || 0 })
                          }
                          className={`${inputCls} tabular-nums`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 space-y-2 rounded-xl border border-dashed border-line bg-base/50 p-3.5">
                  <p className="text-xs font-bold text-ink">Quick Add Student</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Student Name"
                      className={inputCls}
                    />
                    <input
                      type="number"
                      value={newRoll}
                      onChange={(e) => setNewRoll(e.target.value)}
                      placeholder="Roll"
                      className={`${inputCls} w-20 shrink-0 font-mono`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newMarks}
                      onChange={(e) => setNewMarks(e.target.value)}
                      placeholder={`Marks (${activeSubject?.name ?? ''})`}
                      className={`${inputCls} flex-1 font-mono`}
                    />
                    <button type="button" onClick={submitStudent} className={addBtn}>
                      <PlusIcon className="size-3.5" />
                      Add
                    </button>
                  </div>
                  {studentError && (
                    <p className="rounded-lg bg-danger/15 p-2 text-xs text-danger">
                      {studentError}
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t border-line px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full cursor-pointer rounded-xl bg-surface-2 border border-line px-4 py-2.5 text-xs font-bold text-ink transition-colors hover:border-line-bright hover:bg-surface-3"
              >
                Close Settings
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}