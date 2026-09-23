import type { SortStep, Student } from '../types'

let idCounter = 0

export function makeId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

export function clampMarks(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

export const sampleStudents: Student[] = [
  {
    id: 'stu-s1',
    name: 'Aarav Sharma',
    rollNo: 101,
    marks: { ds: 82, math: 85, prog: 78, db: 80 },
  },
  {
    id: 'stu-s2',
    name: 'Vivaan Mehta',
    rollNo: 102,
    marks: { ds: 91, math: 95, prog: 89, db: 92 },
  },
  {
    id: 'stu-s3',
    name: 'Aditya Rao',
    rollNo: 103,
    marks: { ds: 74, math: 70, prog: 76, db: 73 },
  },
  {
    id: 'stu-s4',
    name: 'Diya Patel',
    rollNo: 104,
    marks: { ds: 88, math: 92, prog: 84, db: 90 },
  },
  {
    id: 'stu-s5',
    name: 'Ananya Gupta',
    rollNo: 105,
    marks: { ds: 96, math: 98, prog: 94, db: 97 },
  },
  {
    id: 'stu-s6',
    name: 'Kabir Singh',
    rollNo: 106,
    marks: { ds: 79, math: 81, prog: 83, db: 78 },
  },
]

// -----------------------------------------------------------------------------
// Bubble Sort — Step-by-Step Simulator (mirrors logic.cpp)
//
// Core algorithm (sort by marks DESCENDING):
//   for each pass:
//     compare every adjacent pair (arr[i], arr[i + 1])
//     if arr[i].marks < arr[i + 1].marks  -> out of order (descending) -> SWAP
//     else                                 -> already in order -> NO SWAP
//   after each pass the smallest remaining mark "bubbles" to the end (sorted suffix),
//   so subsequent passes stop earlier.
//   If a full pass makes zero swaps, the list is already sorted -> early exit.
//
// Discrete states generated:
//   1. 'compare' -> visualizer highlights the two students with comparison banner
//   2. 'swap'    -> visualizer animates students swapping positions
//      OR
//      'no-swap' -> visualizer indicates elements are already in relative order
//   3. 'complete'-> all students placed in final sorted positions
// -----------------------------------------------------------------------------
export function generateSortSteps(input: Student[], subjectId: string): SortStep[] {
  const arr = input.map((s) => ({ ...s, marks: { ...s.marks } }))
  const n = arr.length

  if (n === 0) return []
  if (n === 1) {
    return [
      {
        pass: 1,
        totalPasses: 1,
        stepIndex: 1,
        totalSteps: 1,
        comparisonInPass: 1,
        comparisonsInPass: 1,
        comparisonCount: 0,
        swapCount: 0,
        array: arr.map((s) => ({ ...s, marks: { ...s.marks } })),
        i: 0,
        j: 0,
        comparing: null,
        left: { name: arr[0].name, marks: arr[0].marks[subjectId] ?? 0 },
        right: { name: arr[0].name, marks: arr[0].marks[subjectId] ?? 0 },
        swap: false,
        action: 'complete',
        message: 'Single student is already ranked.',
        sortedIndexes: [0],
        lockedCount: 1,
      },
    ]
  }

  const rawSteps: Omit<SortStep, 'stepIndex' | 'totalSteps'>[] = []
  let comparisonCount = 0
  let swapCount = 0
  const totalPasses = n - 1
  const sortedSet = new Set<number>()

  for (let pass = 0; pass < n - 1; pass++) {
    const comparisonsInPass = n - 1 - pass
    let swappedAny = false

    for (let i = 0; i < comparisonsInPass; i++) {
      comparisonCount += 1
      const leftStudent = arr[i]
      const rightStudent = arr[i + 1]
      const leftMarks = leftStudent.marks[subjectId] ?? 0
      const rightMarks = rightStudent.marks[subjectId] ?? 0
      const needSwap = leftMarks < rightMarks

      // 1. COMPARE STEP
      rawSteps.push({
        pass: pass + 1,
        totalPasses,
        comparisonInPass: i + 1,
        comparisonsInPass,
        comparisonCount,
        swapCount,
        array: arr.map((s) => ({ ...s, marks: { ...s.marks } })),
        i,
        j: i + 1,
        comparing: [i, i + 1],
        left: { name: leftStudent.name, marks: leftMarks },
        right: { name: rightStudent.name, marks: rightMarks },
        swap: needSwap,
        action: 'compare',
        message: `Comparing ${leftStudent.name} (${leftMarks}) with ${rightStudent.name} (${rightMarks})`,
        sortedIndexes: Array.from(sortedSet),
        lockedCount: sortedSet.size,
      })

      if (needSwap) {
        // Swap elements in the array
        const temp = arr[i]
        arr[i] = arr[i + 1]
        arr[i + 1] = temp
        swappedAny = true
        swapCount += 1

        // 2. SWAP STEP
        rawSteps.push({
          pass: pass + 1,
          totalPasses,
          comparisonInPass: i + 1,
          comparisonsInPass,
          comparisonCount,
          swapCount,
          array: arr.map((s) => ({ ...s, marks: { ...s.marks } })),
          i,
          j: i + 1,
          comparing: [i, i + 1],
          left: { name: leftStudent.name, marks: leftMarks },
          right: { name: rightStudent.name, marks: rightMarks },
          swap: true,
          action: 'swap',
          message: `${leftMarks} < ${rightMarks} → Swap! ${rightStudent.name} bubbles up before ${leftStudent.name}`,
          sortedIndexes: Array.from(sortedSet),
          lockedCount: sortedSet.size,
        })
      } else {
        // 2. NO SWAP STEP
        rawSteps.push({
          pass: pass + 1,
          totalPasses,
          comparisonInPass: i + 1,
          comparisonsInPass,
          comparisonCount,
          swapCount,
          array: arr.map((s) => ({ ...s, marks: { ...s.marks } })),
          i,
          j: i + 1,
          comparing: [i, i + 1],
          left: { name: leftStudent.name, marks: leftMarks },
          right: { name: rightStudent.name, marks: rightMarks },
          swap: false,
          action: 'no-swap',
          message: `${leftMarks} ≥ ${rightMarks} → No swap needed (already in descending order)`,
          sortedIndexes: Array.from(sortedSet),
          lockedCount: sortedSet.size,
        })
      }
    }

    // Element at index (n - 1 - pass) has now settled into its final sorted position
    sortedSet.add(n - 1 - pass)

    // Early termination: If no swaps occurred during this entire pass, the entire list is sorted
    if (!swappedAny) {
      for (let k = 0; k < n; k++) {
        sortedSet.add(k)
      }
      break
    }
  }

  // Ensure all elements are marked sorted upon completion
  for (let k = 0; k < n; k++) {
    sortedSet.add(k)
  }

  // Final COMPLETION step
  rawSteps.push({
    pass: totalPasses,
    totalPasses,
    comparisonInPass: 0,
    comparisonsInPass: 0,
    comparisonCount,
    swapCount,
    array: arr.map((s) => ({ ...s, marks: { ...s.marks } })),
    i: -1,
    j: -1,
    comparing: null,
    left: { name: '', marks: 0 },
    right: { name: '', marks: 0 },
    swap: false,
    action: 'complete',
    message: 'Bubble Sort finished! All students ranked in descending order.',
    sortedIndexes: Array.from(sortedSet),
    lockedCount: n,
  })

  const totalSteps = rawSteps.length
  return rawSteps.map((step, idx) => ({
    ...step,
    stepIndex: idx + 1,
    totalSteps,
  }))
}