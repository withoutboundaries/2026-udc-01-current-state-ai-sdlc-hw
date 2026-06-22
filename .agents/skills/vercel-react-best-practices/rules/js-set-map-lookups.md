---
title: Use Set/Map for O(1) Lookups
impact: LOW-MEDIUM
impactDescription: O(n) to O(1)
tags: javascript, set, map, data-structures, performance
---

## Use Set/Map for O(1) Lookups

Convert arrays to Set/Map for repeated membership checks.

**Incorrect (O(n) per check):**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**Correct (O(1) per check):**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

**When to use Set vs Map:**

- **Set:** membership checks, deduplicating values (no metadata per key)
- **Map:** key → value associations when you need stored metadata
- **WeakSet / WeakMap:** object references only; entries can be garbage-collected when the object is unreachable

**When Array may be better than Set:**

- Very small lists (roughly <10 items) where `includes()` is simpler
- Collections rebuilt on every render (Set construction cost may exceed lookup savings)

**Avoid constructing Set inside a loop:**

```typescript
// Incorrect: O(n) Set construction per iteration
for (const item of items) {
  const check = new Set(allowedIds).has(item.id)
}

// Correct: build once, reuse
const allowedSet = new Set(allowedIds)
for (const item of items) {
  const check = allowedSet.has(item.id)
}
```
