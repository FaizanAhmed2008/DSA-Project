import type { SortStep, Student } from '../types'

let idCounter = 0

export function makeId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

export function clampMarks(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, value))
}

// -----------------------------------------------------------------------------
// Bubble Sort — step-by-step simulator (mirrors logic.cpp)
//
// Core algorithm (sort by marks DESCENDING):
//   for each pass:
//     compare every adjacent pair (arr[i], arr[i + 1])
//     if arr[i].marks < arr[i + 1].marks  -> out of order -> SWAP
//     else                                 -> already in order -> NO SWAP
//   after each pass the smallest marks "bubbles" to the end, so the next
//   pass compares fewer elements. If a full pass makes no swaps, the list
//   is already sorted and we stop early.
//
// Instead of sorting in one go, every single comparison is recorded as a
// SortStep so the UI can animate Compare -> Swap/No Swap -> Next, exactly
// like the C++ version does on the console.
// -----------------------------------------------------------------------------
export function generateSortSteps(input: Student[], subjectId: string): SortStep[] {
  const arr = input.map((s) => ({ ...s, marks: { ...s.marks } }))
  const n = arr.length
  const steps: SortStep[] = []
  let comparisonCount = 0
  let swapCount = 0
  const totalPasses = n > 0 ? n - 1 : 0

  // Outer loop: one pass per position.
  for (let pass = 0; pass < n - 1; pass++) {
    const comparisonsInPass = n - 1 - pass
    let swappedAny = false

    // Inner loop: compare adjacent pairs within the unsorted part.
    for (let i = 0; i < comparisonsInPass; i++) {
      comparisonCount += 1
      const left = arr[i]
      const right = arr[i + 1]
      const leftMarks = left.marks[subjectId] ?? 0
      const rightMarks = right.marks[subjectId] ?? 0
      const needSwap = leftMarks < rightMarks

      if (needSwap) {
        // Out of order (descending) -> swap the two students.
        const temp = arr[i]
        arr[i] = arr[i + 1]
        arr[i + 1] = temp
        swappedAny = true
        swapCount += 1
      }

      steps.push({
        pass: pass + 1,
        totalPasses,
        comparisonInPass: i + 1,
        comparisonsInPass,
        comparisonCount,
        swapCount,
        array: arr.map((s) => ({ ...s, marks: { ...s.marks } })),
        i,
        j: i + 1,
        left: { name: left.name, marks: leftMarks },
        right: { name: right.name, marks: rightMarks },
        swap: needSwap,
        lockedCount: pass,
      })
    }

    // A pass with zero swaps means everything is already in order.
    if (!swappedAny) break
  }

  return steps
}