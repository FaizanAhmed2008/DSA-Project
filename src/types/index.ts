export interface Subject {
  id: string
  name: string
}

export interface Student {
  id: string
  name: string
  rollNo: number
  marks: Record<string, number>
}

export interface ComparedValue {
  name: string
  marks: number
}

export type StepAction = 'compare' | 'swap' | 'no-swap' | 'complete'

export interface SortStep {
  pass: number
  totalPasses: number
  stepIndex: number
  totalSteps: number
  comparisonInPass: number
  comparisonsInPass: number
  comparisonCount: number
  swapCount: number
  array: Student[]
  i: number
  j: number
  comparing: [number, number] | null
  left: ComparedValue
  right: ComparedValue
  swap: boolean
  action: StepAction
  message: string
  sortedIndexes: number[]
  lockedCount: number
}