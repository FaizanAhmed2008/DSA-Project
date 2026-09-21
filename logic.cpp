#include <iostream>
#include <string>
using namespace std;

// ---------------------------------------------------------------
//  Student Result Ranking System  —  Bubble Sort (core algorithm)
//
//  Goal: sort a classroom of students by MARKS in DESCENDING order.
//  Algorithm: Bubble Sort (stable, in-place, O(n^2) worst case).
//
//  How Bubble Sort works:
//    1. Repeat "passes" over the list.
//    2. In each pass, compare every pair of adjacent students.
//    3. If the left student has LOWER marks than the right student,
//       they are out of order (descending), so we SWAP them.
//    4. After each pass the smallest marks "bubble" down to the end,
//       so the next pass can stop one position earlier.
//    5. If a full pass performs zero swaps, the list is already sorted.
// ---------------------------------------------------------------

// A single student in the classroom
struct Student {
    string name;      // e.g. "Ahmed"
    int rollNo;       // e.g. 21
    int marks;        // marks in the selected subject
};

// -----------------------------------------------------------------
// Swaps the positions of two students using a temporary third slot.
// -----------------------------------------------------------------
void swapStudents(Student &a, Student &b) {
    Student temp = a;   // temporarily store student a
    a = b;              // move student b into a's place
    b = temp;           // move the saved student into b's place
}

// -----------------------------------------------------------------
// Bubble Sort by marks in DESCENDING order.
// Each comparison is printed so the algorithm is easy to follow.
// -----------------------------------------------------------------
void bubbleSortDescending(Student arr[], int n) {
    // Outer loop: run a pass for every position in the list.
    // After pass i, the i-th smallest element has "bubbled" to the end,
    // so the next pass only needs to look at fewer elements.
    for (int pass = 0; pass < n - 1; pass++) {
        bool swapped = false;            // Did this pass swap anything?

        cout << "\n--- Pass " << (pass + 1) << " ---\n";

        // Inner loop: compare adjacent pairs up to the unsorted part.
        // The last 'pass' elements are already in their final position.
        for (int i = 0; i < n - 1 - pass; i++) {
            Student &left  = arr[i];        // current student
            Student &right = arr[i + 1];    // student next to it

            cout << "Compare: " << left.name  << " (" << left.marks
                 << ")  vs  " << right.name << " (" << right.marks << ")\n";

            // Descending order => the bigger marks must come first.
            // If the left student has smaller marks than the right one,
            // they are in the wrong order, so swap them.
            if (left.marks < right.marks) {
                swapStudents(left, right);
                swapped = true;
                cout << "  -> SWAP (" << left.name << " & " << right.name << ")\n";
            } else {
                cout << "  -> No swap needed (already in order)\n";
            }
        }

        // If a whole pass made NO swaps, the list is fully sorted.
        // We can stop early instead of wasting the remaining passes.
        if (!swapped) {
            cout << "No swaps in this pass — list is sorted. Stopping early.\n";
            break;
        }
    }
}

// -----------------------------------------------------------------
// Prints the classroom in its current order.
// -----------------------------------------------------------------
void printStudents(Student arr[], int n) {
    cout << "\nRanking:\n";
    for (int i = 0; i < n; i++) {
        cout << (i + 1) << ". " << arr[i].name
             << " | Roll " << arr[i].rollNo
             << " | " << arr[i].marks << " marks\n";
    }
}

int main() {
    // A classroom already exists — the teacher does not start from zero.
    Student cls[] = {
        {"Ahmed", 21, 78},
        {"Rahul", 8, 91},
        {"Sara",  14, 84},
    };
    int n = sizeof(cls) / sizeof(cls[0]);

    cout << "Student Result Ranking System — Bubble Sort Demo\n";

    cout << "\nBefore sorting:\n";
    printStudents(cls, n);

    // Run the core algorithm.
    bubbleSortDescending(cls, n);

    cout << "\nAfter sorting (descending by marks):\n";
    printStudents(cls, n);

    return 0;
}