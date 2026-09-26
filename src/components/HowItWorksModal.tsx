import { motion } from 'framer-motion'
import { CodeIcon, SparklesIcon } from './icons'

export default function HowItWorksModal() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6">
        <div className="pointer-events-none absolute -top-12 -left-12 size-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="flex items-center gap-3.5">
          <div className="relative flex size-12 place-items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-cyan p-0.5 shadow-lg shadow-accent/25">
            <div className="flex size-full items-center justify-center rounded-[14px] bg-base">
              <CodeIcon className="size-6 text-cyan-light" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
              How Bubble Sort Works (Descending)
            </h2>
            <p className="text-xs text-muted">
              Data Structures & Algorithms • Student Result Ranking System
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Principles */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div whileHover={{ y: -3 }} className="rounded-2xl glass-panel p-5">
          <span className="inline-block rounded-lg bg-cyan/15 border border-cyan/30 px-2.5 py-0.5 font-mono text-[11px] font-bold text-cyan-light">
            1. Adjacent Comparison
          </span>
          <h3 className="mt-3 text-sm font-bold text-ink">Compare Left & Right</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            The algorithm compares adjacent classroom pairs <code className="text-cyan-light font-mono">arr[i]</code> and <code className="text-cyan-light font-mono">arr[i + 1]</code>.
            In descending ranking, if <code className="text-warning font-mono">left &lt; right</code>, they are in the wrong order.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="rounded-2xl glass-panel p-5">
          <span className="inline-block rounded-lg bg-warning/15 border border-warning/30 px-2.5 py-0.5 font-mono text-[11px] font-bold text-warning">
            2. Swapping
          </span>
          <h3 className="mt-3 text-sm font-bold text-ink">Bubble Smaller Down</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            When out of order, the two students swap positions. Higher marks bubble toward Rank #1 (front),
            while lower marks sink toward the end of the array.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="rounded-2xl glass-panel p-5">
          <span className="inline-block rounded-lg bg-success/15 border border-success/30 px-2.5 py-0.5 font-mono text-[11px] font-bold text-success">
            3. Early Termination
          </span>
          <h3 className="mt-3 text-sm font-bold text-ink">Pass Optimization</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            After each pass, the smallest mark settles into its final locked slot.
            If an entire pass completes with zero swaps, the list is already sorted and stops early.
          </p>
        </motion.div>
      </div>

      {/* Complexity Breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Worst Case Time</span>
          <div className="mt-1 font-mono text-xl font-bold text-ink">O(n²)</div>
          <span className="text-[10px] text-muted">Reverse sorted input</span>
        </div>
        <div className="rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Best Case Time</span>
          <div className="mt-1 font-mono text-xl font-bold text-success">O(n)</div>
          <span className="text-[10px] text-muted">Already sorted list</span>
        </div>
        <div className="rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Space Complexity</span>
          <div className="mt-1 font-mono text-xl font-bold text-cyan-light">O(1)</div>
          <span className="text-[10px] text-muted">In-place swapping</span>
        </div>
        <div className="rounded-2xl glass-panel p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Stability</span>
          <div className="mt-1 font-mono text-xl font-bold text-accent-light">Stable</div>
          <span className="text-[10px] text-muted">Preserves equal ties</span>
        </div>
      </div>

      {/* C++ logic.cpp Code Showcase */}
      <section className="overflow-hidden rounded-2xl glass-panel">
        <div className="flex items-center justify-between border-b border-line bg-surface-2/40 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-cyan" />
            <h3 className="font-mono text-xs font-bold text-ink">logic.cpp (C++ Core Implementation)</h3>
          </div>
          <span className="text-xs text-muted font-mono">Reference Algorithm</span>
        </div>

        <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-slate-300 bg-base/60">
{`void bubbleSortDescending(Student arr[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        bool swapped = false;

        for (int i = 0; i < n - 1 - pass; i++) {
            // Descending order => the higher marks must come first.
            // If left student has fewer marks than right student, swap them.
            if (arr[i].marks < arr[i + 1].marks) {
                swapStudents(arr[i], arr[i + 1]);
                swapped = true;
            }
        }

        // If no swaps occurred in this pass, array is already sorted
        if (!swapped) break;
    }
}`}
        </pre>
      </section>
    </div>
  )
}
