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

export interface SortStep {
  pass: number
  totalPasses: number
  comparisonInPass: number
  comparisonsInPass: number
  comparisonCount: number
  swapCount: number
  array: Student[]
  i: number
  j: number
  left: ComparedValue
  right: ComparedValue
  swap: boolean
  lockedCount: number
}