---
title: Initialize App Once, Not Per Mount
impact: LOW-MEDIUM
impactDescription: avoids duplicate init in development
tags: initialization, useEffect, app-startup, side-effects
---

## Initialize App Once, Not Per Mount

Do not put app-wide initialization that must run once per app load inside `useEffect([])` of a component. Components can remount and effects will re-run. Use a module-level guard or top-level init in the entry module instead.

**Incorrect (runs twice in dev, re-runs on remount):**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

**Correct (once per app load, guard in component):**

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

**Best Practice (module-level init — most robust):**

Move one-time startup out of components entirely. Call it from the app entry (e.g. root layout or client bootstrap) so remounts and Strict Mode never re-run side effects.

```tsx
// src/lib/init.ts
let didInit = false

export function initializeApp() {
  if (didInit) return
  didInit = true
  loadFromStorage()
  checkAuthToken()
}
```

```tsx
// src/app/layout.tsx (or client entry module)
import { initializeApp } from '@/lib/init'

initializeApp()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

For browser-only APIs (`localStorage`, `window`), keep `initializeApp()` in a `"use client"` module or guard with `typeof window !== 'undefined'`.

Reference: [Initializing the application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)
