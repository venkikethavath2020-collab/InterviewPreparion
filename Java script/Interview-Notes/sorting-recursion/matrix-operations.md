# Matrix Operations (Map, Transpose)

## Difficulty
Easy / Medium

## Category
Matrix / 2D Arrays

## Problem Statement

Two classic 2D-array tasks:
1. **Set odd numbers to 0** (transform each cell).
2. **Transpose** a matrix (swap rows and columns).

## Example

```text
Set odd → 0:
Input:  [[1,2,3],[4,5,6]]
Output: [[0,2,0],[4,0,6]]

Transpose:
Input:  [[1,2,3],[4,5,6]]
Output: [[1,4],[2,5],[3,6]]
```

---

## Set Odd Numbers to 0

### Explanation

Walk every cell; keep even values, replace odd values with 0. Returns a new matrix (use in-place assignment to mutate).

### Time Complexity
O(m·n)

### Space Complexity
O(m·n) (new matrix) or O(1) in-place.

### Solution

```js
const setOddToZero = (matrix = []) =>
  matrix.map((row) => row.map((cell) => (cell % 2 === 0 ? cell : 0)));
```

---

## Transpose a Matrix

### Explanation

The transpose swaps indices: `result[j][i] = matrix[i][j]`. For an `m × n` matrix the result is `n × m`.

### Time Complexity
O(m·n)

### Space Complexity
O(m·n)

### Solution

```js
const transpose = (matrix = []) => {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const result = Array.from({ length: cols }, () => new Array(rows));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
};

// Concise (square or rectangular):
const transpose2 = (m) => m[0].map((_, c) => m.map((row) => row[c]));
```

---

## Common Interview Follow-up Questions

1. Transpose a **square** matrix in place (swap across the diagonal).
2. Rotate a matrix 90° (transpose + reverse each row).
3. Spiral traversal of a matrix.

## Edge Cases

* Empty matrix → `[]`
* Non-square (rectangular) matrices — result dimensions flip
* Jagged arrays (rows of differing length) — handle or reject
* Single row / single column

## Key Takeaways

* In-place transpose only works for **square** matrices.
* 90° rotation = transpose then reverse each row.
* `m[0].map((_, c) => m.map(row => row[c]))` is the elegant transpose one-liner.
