---
title: Optimize SVG Precision
impact: LOW
impactDescription: reduces file size
tags: rendering, svg, optimization, svgo
---

## Optimize SVG Precision

Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size, but in general reducing precision should be considered.

**Incorrect (excessive precision):**

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**Correct (1 decimal place):**

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**Automate with SVGO:**

```bash
# Safe default for icons
npx svgo --precision=1 --multipass icon.svg

# If paths animate or must stay exact, disable aggressive path rewriting
npx svgo --precision=1 --multipass --disable=convertPathData icon.svg
```

**Typical savings:** a 24×24 icon path block often drops from ~500 bytes to ~400 bytes at `precision=1` (roughly 15–25% smaller).

**ViewBox guidance:**

- Small viewBox (e.g. `0 0 100 100`): `precision=1` is usually enough
- Large viewBox (e.g. `0 0 1000 1000`): prefer `precision=2` to avoid visible shape drift
