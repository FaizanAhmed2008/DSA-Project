import { useState } from 'react'
import type { Student, Subject } from '../types'
import { clampMarks } from '../utils/bubbleSort'
import { PencilIcon, PlusIcon, SparklesIcon, TrashIcon } from './icons'

interface StudentManagerProps {
  students: Student[]
  activeSubject: Subject
  onAddStudent: (name: string, rollNo: number, marks: number) => void
  onUpdateStudent: (id: string, patch: { name?: string; rollNo?: number; marks?: number }) => void
  onDeleteStudent: (id: string) => void
  onLoadSample: () => void
  onClearAll: () => void
}

export default function StudentManager({
  students,
  activeSubject,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onLoadSample,
  onClearAll,
}: StudentManagerProps) {
  // Add Form State
  const [name, setName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [marks, setMarks] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Inline Editing State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editRoll, setEditRoll] = useState('')
  const [editMarks, setEditMarks] = useState('')
  const [editError, setEditError] = useState<string | null>(null)

  const [confirmClear, setConfirmClear] = useState(false)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setErrorMessage('Student name is required.')
      return
    }

    if (!rollNo || rollNo.trim() === '') {
      setErrorMessage('Roll number is required.')
      return
    }

    const numRoll = Number(rollNo)
    if (!Number.isInteger(numRoll) || numRoll <= 0) {
      setErrorMessage('Roll number must be a positive whole number.')
      return
    }

    const duplicateStudent = students.find((s) => s.rollNo === numRoll)
    if (duplicateStudent) {
      setErrorMessage(`Roll number ${numRoll} already exists (assigned to ${duplicateStudent.name}).`)
      return
    }

    if (marks === '' || Number.isNaN(Number(marks))) {
      setErrorMessage('Marks are required.')
      return
    }

    const numMarks = Number(marks)
    if (numMarks < 0 || numMarks > 100) {
      setErrorMessage('Marks must be between 0 and 100.')
      return
    }

    onAddStudent(trimmedName, numRoll, clampMarks(numMarks))
    setName('')
    setRollNo('')
    setMarks('')
    setSuccessMessage(`Added ${trimmedName} (Roll #${numRoll}) with ${numMarks} marks.`)
    setTimeout(() => setSuccessMessage(null), 3500)
  }

  const startEdit = (s: Student) => {
    setEditingId(s.id)
    setEditName(s.name)
    setEditRoll(String(s.rollNo))
    setEditMarks(String(s.marks[activeSubject.id] ?? 0))
    setEditError(null)
  }

  const saveEdit = (id: string) => {
    setEditError(null)
    const trimmedName = editName.trim()
    if (!trimmedName) {
      setEditError('Name cannot be empty.')
      return
    }

    const numRoll = Number(editRoll)
    if (!Number.isInteger(numRoll) || numRoll <= 0) {
      setEditError('Roll number must be a positive integer.')
      return
    }

    const duplicate = students.find((s) => s.id !== id && s.rollNo === numRoll)
    if (duplicate) {
      setEditError(`Roll #${numRoll} already taken by ${duplicate.name}.`)
      return
    }

    const numMarks = Number(editMarks)
    if (Number.isNaN(numMarks) || numMarks < 0 || numMarks > 100) {
      setEditError('Marks must be between 0 and 100.')
      return
    }

    onUpdateStudent(id, {
      name: trimmedName,
      rollNo: numRoll,
      marks: clampMarks(numMarks),
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 sm:p-5">
        <div>
          <h2 className="text-base font-semibold text-ink">Student Roster Management</h2>
          <p className="text-xs text-muted">
            Managing student marks for{' '}
            <span className="font-semibold text-accent">{activeSubject.name}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            <SparklesIcon className="size-3.5" />
            Load Sample Students
          </button>

          {students.length > 0 && (
            <>
              {confirmClear ? (
                <div className="flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 p-1">
                  <span className="px-2 text-xs font-medium text-danger">Clear all?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearAll()
                      setConfirmClear(false)
                    }}
                    className="cursor-pointer rounded bg-danger px-2.5 py-1 text-xs font-semibold text-white hover:bg-danger/80"
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="cursor-pointer rounded bg-surface px-2 py-1 text-xs text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-danger/40 hover:text-danger"
                >
                  <TrashIcon className="size-3.5" />
                  Clear Students
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* Left Column: Add Student Form with strict validation */}
        <section className="rounded-xl border border-line bg-surface p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-ink">Add New Student</h3>
            <p className="text-xs text-muted">Enter details to add to classroom ranking.</p>
          </div>

          <form onSubmit={handleAdd} className="space-y-4" noValidate>
            <div>
              <label htmlFor="student-name" className="mb-1 block text-xs font-medium text-slate-300">
                Student Full Name <span className="text-danger">*</span>
              </label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Diya Patel"
                className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="student-roll" className="mb-1 block text-xs font-medium text-slate-300">
                  Roll Number <span className="text-danger">*</span>
                </label>
                <input
                  id="student-roll"
                  type="number"
                  min={1}
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. 104"
                  className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink tabular-nums placeholder:text-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="student-marks" className="mb-1 block text-xs font-medium text-slate-300">
                  Marks (0–100) <span className="text-danger">*</span>
                </label>
                <input
                  id="student-marks"
                  type="number"
                  min={0}
                  max={100}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g. 88"
                  className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink tabular-nums placeholder:text-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-[#06202c] transition-colors hover:bg-[#5ecbf8]"
            >
              <PlusIcon className="size-4" />
              Add Student
            </button>
          </form>
        </section>

        {/* Right Column: Students Table with Inline Editing */}
        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div>
              <h3 className="text-sm font-semibold text-ink">Classroom Roster</h3>
              <p className="text-xs text-muted">
                {students.length} {students.length === 1 ? 'student' : 'students'} enrolled
              </p>
            </div>
          </div>

          {editError && (
            <div className="border-b border-danger/30 bg-danger/10 px-5 py-2 text-xs text-danger">
              {editError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead className="border-b border-line bg-surface-2/40 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Marks ({activeSubject.name})</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-muted">
                      No students yet. Add students using the form or click{' '}
                      <button
                        type="button"
                        onClick={onLoadSample}
                        className="cursor-pointer font-semibold text-accent underline hover:text-accent/80"
                      >
                        Load Sample Students
                      </button>
                      .
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const isEditing = editingId === student.id
                    const studentMarks = student.marks[activeSubject.id] ?? 0

                    if (isEditing) {
                      return (
                        <tr key={student.id} className="bg-accent/5">
                          <td className="px-4 py-2.5">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full rounded border border-line bg-surface-2 px-2 py-1 text-xs text-ink outline-none focus:border-accent"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              type="number"
                              value={editRoll}
                              onChange={(e) => setEditRoll(e.target.value)}
                              className="w-20 rounded border border-line bg-surface-2 px-2 py-1 text-xs text-ink outline-none focus:border-accent"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={editMarks}
                              onChange={(e) => setEditMarks(e.target.value)}
                              className="w-20 rounded border border-line bg-surface-2 px-2 py-1 text-xs text-ink outline-none focus:border-accent"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => saveEdit(student.id)}
                                className="cursor-pointer rounded bg-accent px-2.5 py-1 text-xs font-semibold text-[#06202c] hover:bg-[#5ecbf8]"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="cursor-pointer rounded border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted hover:text-ink"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    }

                    return (
                      <tr key={student.id} className="hover:bg-surface-2/30 transition-colors">
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
                        <td className="px-4 py-3 font-semibold tabular-nums text-ink">
                          {studentMarks}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => startEdit(student)}
                              className="grid size-7 cursor-pointer place-items-center rounded text-muted hover:bg-surface-2 hover:text-ink"
                              title="Edit student"
                            >
                              <PencilIcon className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteStudent(student.id)}
                              className="grid size-7 cursor-pointer place-items-center rounded text-muted hover:bg-surface-2 hover:text-danger"
                              title="Delete student"
                            >
                              <TrashIcon className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
