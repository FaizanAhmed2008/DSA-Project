import type { Student, Subject } from '../types'

export const defaultSubjects: Subject[] = [
  { id: 'ds', name: 'Data Structures' },
  { id: 'math', name: 'Mathematics' },
  { id: 'prog', name: 'Programming' },
  { id: 'db', name: 'Database' },
]

export const defaultStudents: Student[] = [
  {
    id: 'stu-1',
    name: 'Ahmed',
    rollNo: 21,
    marks: { ds: 78, math: 85, prog: 72, db: 80 },
  },
  {
    id: 'stu-2',
    name: 'Rahul',
    rollNo: 8,
    marks: { ds: 91, math: 88, prog: 95, db: 82 },
  },
  {
    id: 'stu-3',
    name: 'Sara',
    rollNo: 14,
    marks: { ds: 84, math: 79, prog: 86, db: 77 },
  },
  {
    id: 'stu-4',
    name: 'Priya',
    rollNo: 3,
    marks: { ds: 65, math: 71, prog: 68, db: 74 },
  },
  {
    id: 'stu-5',
    name: 'John',
    rollNo: 27,
    marks: { ds: 88, math: 92, prog: 81, db: 90 },
  },
]