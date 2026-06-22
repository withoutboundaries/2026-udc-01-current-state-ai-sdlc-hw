---
title: Narrow Effect Dependencies
impact: LOW
impactDescription: minimizes effect re-runs
tags: rerender, useEffect, dependencies, optimization
---

## Narrow Effect Dependencies

Specify primitive dependencies instead of objects to minimize effect re-runs.

**Incorrect (re-runs on any user field change):**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**Correct (re-runs only when id changes):**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**For derived state, compute outside effect:**

```tsx
// Incorrect: runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// Correct: runs only on boolean transition
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```

**Benefits:**

1. **Fewer effect runs** — primitives and booleans change less often than whole objects
2. **Clearer intent** — dependencies match what the effect actually reads
3. **Less accidental coupling** — avoids re-running when unrelated fields on an object change

**When to use:**

- `useEffect` / `useMemo` deps include objects or arrays built inline
- Continuous numeric state (width, scrollY) drives boolean UI modes
- Derived booleans (`isMobile`, `isEmpty`) gate side effects

**When not to focus on narrowing:**

- Stable object references from context or state managers
- Effects that intentionally need to react to any field change on an object
