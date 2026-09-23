import { CodeIcon } from './icons'

export default function HowItWorksModal() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-line bg-surface p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
            <CodeIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">How Bubble Sort Works (Descending)</h2>
            <p className="text-xs text-muted">
              Data Structures & Algorithms • Student Result Ranking System
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Principles */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[11px] font-bold text-accent">
            1. Adjacent Comparison
          </span>
          <h3 className="mt-2 text-sm font-semibold text-ink">Compare Left & Right</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            The algorithm iterates through the classroom, checking pairs <code className="text-accent">arr[i]</code> and <code className="text-accent">arr[i + 1]</code>.
            For descending ranking, if <code className="text-warning">left &lt; right</code>, they are out of order.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-4">
          <span className="rounded bg-warning/15 px-2 py-0.5 font-mono text-[11px] font-bold text-warning">
            2. Swapping
          </span>
          <h3 className="mt-2 text-sm font-semibold text-ink">Bubble Smaller Down</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            When out of order, the two students exchange positions. Higher marks bubble toward the front (top ranks),
            while lower marks sink toward the end of the array.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-4">
          <span className="rounded bg-success/15 px-2 py-0.5 font-mono text-[11px] font-bold text-success">
            3. Early Termination
          </span>
          <h3 className="mt-2 text-sm font-semibold text-ink">Pass Optimization</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            After each pass, the smallest remaining student settles into their final slot.
            If an entire pass completes with zero swaps, the list is already fully sorted and execution stops early.
          </p>
        </div>
      </div>

      {/* Complexity Breakdown */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Worst Case Time</span>
          <div className="mt-1 font-mono text-base font-bold text-ink">O(n²)</div>
          <span className="text-[10px] text-muted">Reverse sorted input</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Best Case Time</span>
          <div className="mt-1 font-mono text-base font-bold text-success">O(n)</div>
          <span className="text-[10px] text-muted">Already sorted list</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Space Complexity</span>
          <div className="mt-1 font-mono text-base font-bold text-accent">O(1)</div>
          <span className="text-[10px] text-muted">In-place sorting</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3.5 text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">Stability</span>
          <div className="mt-1 text-base font-bold text-success">Stable</div>
          <span className="text-[10px] text-muted">Preserves relative ties</span>
        </div>
      </div>

      {/* C++ logic.cpp Code Showcase */}
      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-3 bg-surface-2/40">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent" />
            <h3 className="font-mono text-xs font-semibold text-ink">logic.cpp (Core Algorithm)</h3>
          </div>
          <span className="text-[11px] text-muted">Exact project reference logic</span>
        </div>

        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
{`void bubbleSortDescending(Student arr[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        bool swapped = false;

        for (int i = 0; i < n - 1 - pass; i++) {
            // Descending order => the higher marks must come first.
            // If the left student has fewer marks, swap them.
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
