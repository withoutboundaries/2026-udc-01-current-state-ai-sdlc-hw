# Task 3 — Аналіз токенів і вартості

**Область:** домашка WS1, зокрема **фіча «Список нотаток»** (Task 2) + підготовка проєкту (Task 1).  
**IDE:** Cursor · **Дата вимірювання:** 16 Jun 2026  
**Модель (факт):** **composer-2.5-fast** · **Джерело usage:** `~/Downloads/usage-events-2026-06-16.csv` (28 rows, 10–16 Jun 2026).

> Ціни для розрахунку: [Cursor Models & Pricing](https://cursor.com/docs/models-and-pricing) — Input **$0.50/M**, Output **$2.50/M**, Cache read **$0.20/M**.  
> У CSV колонка **Cost = «Included»** — входить у підписку; нижче — **теоретична** вартість за API-тарифами Composer 2.5.

---

## 1. Repomix — розмір контексту (виміряно 16 Jun 2026)

```bash
cd ~/Projects/2026-udc-01-current-state-ai-sdlc-hw
repomix app/src --ignore "**/node_modules/**,**/.next/**"
repomix app --ignore "**/node_modules/**,**/.next/**,**/package-lock.json"
repomix . --ignore "**/node_modules/**,**/.next/**,**/.agents/**,**/package-lock.json,**/docs/**"
repomix .agents/skills/vercel-react-best-practices
```

| Область | Файлів | Токенів | Коментар |
|---|---:|---:|---|
| **`app/src/`** — код фічі | 8 | **2 813** | мінімальний контекст |
| **`app/`** + AGENTS.md, SVG | 22 | **7 473** | +825 tok AGENTS.md, SVG |
| **Репо** без `.agents/`, без `docs/` | 29 | **10 590** | +configs, CodeRabbit |
| **Skill** (повний каталог) | 76 | **57 491** | rules + AGENTS.md skill |
| **`SKILL.md` only** (top-file repomix) | 1 | **~1 764** | достатньо для більшості задач |

**Оптимальний bundle для Task 2:** `app/src` + `app/AGENTS.md` ≈ **2 813 + 825 ≈ 3 638 tokens** (замість 57k+ skill).

---

## 2. Cursor Usage — фактичні токени (з CSV)

Export: `usage-events-2026-06-16.csv` · **composer-2.5-fast:** 26 events (1× 10 Jun поза WS1, 18× 14 Jun, 7× 16 Jun) · **gpt-5.4-mini:** 2 events (10 Jun, поза WS1).

### A. Task 1–2 — **14 Jun 2026** (18 events)

| Метрика | Токени | % від total |
|---|---:|---:|
| Input (w/o Cache Write) | **307 058** | 5.1% |
| Input (w/ Cache Write) | 0 | — |
| **Cache Read** | **5 748 327** | **94.6%** |
| Output | **22 516** | 0.4% |
| **Total** | **6 077 901** | 100% |

Найбільші запити того дня (total tokens):

| Час (UTC) | Total | Input | Cache Read | Output |
|---|---:|---:|---:|---:|
| 19:21 | 718 258 | 5 442 | 709 882 | 2 934 |
| 19:18 | 665 712 | 52 346 | 610 843 | 2 523 |
| 19:36 | 566 097 | 64 388 | 499 859 | 1 850 |

### B. Task 3 + продовження — **16 Jun 2026** (7 events)

| Метрика | Токени | % від total |
|---|---:|---:|
| Input (w/o Cache Write) | **599 037** | 14.1% |
| Cache Read | **3 618 432** | **85.3%** |
| Output | **22 127** | 0.5% |
| **Total** | **4 239 596** | 100% |

Найбільші запити того дня:

| Час (UTC) | Total | Input | Cache Read | Output |
|---|---:|---:|---:|---:|
| 19:44 | 1 155 213 | 144 102 | 1 005 696 | 5 415 |
| 19:22 | 939 691 | 8 131 | 923 136 | 8 424 |
| 19:36 | 671 584 | 128 520 | 542 080 | 984 |

### C. Уся домашка WS1 (Composer, 14–16 Jun)

| Метрика | Токени | % від total |
|---|---:|---:|
| Input (w/o Cache Write) | **906 095** | 8.8% |
| Cache Read | **9 366 759** | **90.8%** |
| Output | **44 643** | 0.4% |
| **Total** | **10 317 497** | 100% |
| Agent events | **25** | — |

---

## 3. Розрахунок вартості: токени × ціна моделі

### Формула (Composer 2.5)

```text
USD = (input_w/o_cache / 1_000_000 × 0.50)
    + (cache_read / 1_000_000 × 0.20)
    + (output / 1_000_000 × 2.50)
```

### Task 1–2 (14 Jun) — **факт з CSV**

| Стаття | Токени | × ціна | USD |
|---|---:|---|---:|
| Input | 307 058 | × $0.50/M | **$0.15** |
| Cache read | 5 748 327 | × $0.20/M | **$1.15** |
| Output | 22 516 | × $2.50/M | **$0.06** |
| **Разом (теоретично)** | **6 077 901** | | **$1.36** |
| **Фактично сплачено** | | | **$0** (Included у підписці) |

### Task 3 (16 Jun) — **факт з CSV**

| Стаття | Токени | × ціна | USD |
|---|---:|---|---:|
| Input | 599 037 | × $0.50/M | **$0.30** |
| Cache read | 3 618 432 | × $0.20/M | **$0.72** |
| Output | 22 127 | × $2.50/M | **$0.06** |
| **Разом (теоретично)** | **4 239 596** | | **$1.08** |
| **Фактично сплачено** | | | **$0** (Included) |

### Уся WS1 Composer (14–16 Jun)

| Стаття | Токени | USD |
|---|---:|---:|
| Input | 906 095 | $0.45 |
| Cache read | 9 366 759 | $1.87 |
| Output | 44 643 | $0.11 |
| **Разом** | **10 317 497** | **$2.44** (Included) |

### Порівняння: Claude 4.6 Sonnet (ті самі токени, 14 Jun)

| Стаття | Токени | × ціна Sonnet ($3 / $0.30 / $15) | USD |
|---|---:|---|---:|
| Input | 307 058 | × $3/M | $0.92 |
| Cache read | 5 748 327 | × $0.30/M | $1.72 |
| Output | 22 516 | × $15/M | $0.34 |
| **Разом** | **6 077 901** | | **$2.98** |

**Висновок:** Composer **~2.2× дешевший** за Sonnet на Task 1–2 ($1.36 vs $2.98); головна стаття вартості — **cache read** ($1.15 з $1.36), не output ($0.06).

> ⚠️ Попередня **оцінка** (~950k input, $0.76) була **заниженою**: реальний обсяг — **6.08M total** на 14 Jun, бо Cursor рахує **cache read** окремо (~95% tokens).

---

## 4. Оптимізації (3 конкретні)

### Оптимізація 1 — Вузький контекст

**Проблема:** широкий контекст множить input на кожен запит.

| Контекст на 1 запит | Repomix tokens | Input cost / запит (Composer) |
|---|---:|---:|
| `@app/src` only | 2 813 | $0.0014 |
| `@app/src` + `@app/AGENTS.md` | ~3 638 | $0.0018 |
| `@app/` (з SVG) | 7 473 | $0.0037 |
| Репо без docs/agents | 10 590 | $0.0053 |
| Повний skill | 57 491 | $0.029 |
| Skill + код фічі | ~60 329 | $0.030 |

**Що вже зроблено:** `.cursorignore` (11 патернів) — `node_modules/`, `.next/`, lock-файли, `.env*` не потрапляють у контекст.

**Що робити далі:**
- `@app/src/components/NotesApp.tsx` замість всього репо;
- skill — лише `@SKILL.md` (~1.8k), не `.agents/skills/` (~57k);
- не `@docs/walkthrough.md` (1 674 tok) під час кодування.

**Економія (оцінка):** вузький `@` зменшує **input**, але **cache read** залежить від довжини чату — новий чат на Task 2 міг би скоротити cache на **30–50%** (див. §5 A/B).

---

### Оптимізація 2 — Дешевша модель для рутини

**Факт з CSV:** WS1 (14–16 Jun) — **composer-2.5-fast**, Included. Поза WS1: gpt-5.4-mini 10 Jun — **$0.87 + $0.22** (2 events у CSV).

| Задача | Модель | Чому |
|---|---|---|
| Task 1–3 (факт) | **composer-2.5-fast** | CRUD, docs, repomix — достатньо |
| Security / deep refactor | Sonnet / Opus | не потрібно було |

**14 Jun на Sonnet** (гіпотетично): **$2.98** vs **$1.36** Composer — **2.2× дорожче**.

---

### Оптимізація 3 — Коротші ітерації + чіткіші промпти

**Проблема в baseline:** кілька «хвиль» роботи замість одного циклу Plan → Agent.

| Ітерація (14 Jun) | Подія | Total tokens (з CSV) |
|---|---|---:|
| 19:18–19:21 | Task 1 init + довгий чат | 665 712 + 718 258 |
| 19:36 | create-next-app / setup | 566 097 |
| 20:08–20:34 | AGENTS.md, cursorignore, skill | ~1.1M |
| 20:20 | npm run dev / перевірки | 503k |

**Оптимізований промпт-шаблон (структурований):**

```text
Plan: реалізуй фічу «нотатки» за acceptance criteria:
1) форма + валідація trim
2) список з датою, нові зверху
3) видалення
4) порожній стан
5) localStorage з version
Файли: app/src/components/, app/src/lib/, app/src/types/
Stack: див. app/AGENTS.md. Server default, client лише для інтерактиву.
Не чіпай next.config.ts. Після коду: npm run build && npm run lint.
```

**Економія:** новий чат для Task 2 + структурований промпт → менше cache read (див. §5 A/B).

---

## 5. (Опц.) A/B — baseline vs оптимізований сценарій

> Retrospective: B — «новий чат + вузький @ + один Plan→Agent цикл».

| Параметр | A — Fact (14 Jun, CSV) | B — Optimized (model) | Δ |
|---|---:|---:|---:|
| Agent events | 18 | 10 | −44% |
| Input | 307 058 | 180 000 | −41% |
| Cache read | 5 748 327 | 2 900 000 | −50% |
| Output | 22 516 | 18 000 | −20% |
| **Total tokens** | **6 077 901** | **3 098 000** | **−49%** |
| **Composer $** | **$1.36** | **$0.69** | **−49%** |

### Розрахунок B

```
Input:      180 000 × $0.50/M = $0.09
Cache read: 2 900 000 × $0.20/M = $0.58
Output:      18 000 × $2.50/M = $0.04
────────────────────────────────────────
Разом:                              $0.69
```

**Assumptions B:** окремий чат для Task 2; `@app/src` + `@app/AGENTS.md`; acceptance criteria в першому промпті; 10 agent events замість 18.

---

## 6. Висновки (≥3)

1. **Cache read — головна стаття вартості (~95% tokens на 14 Jun).** З **$1.36** теоретичної вартості **$1.15** — cache read; input ($0.15) і output ($0.06) — дрібниця. Оптимізація = **коротші чати**, не лише вузький `@`.

2. **`.cursorignore` — must-have.** Без нього repomix включив би `node_modules` (мільйони tokens). Це найбільший одноразовий leverage у Task 1.

3. **Skill (~57k) не тягнути цілком у промпт.** Repomix: `@SKILL.md` (~1.8k) достатньо; повний каталог skill множить input на кожен запит.

4. **Composer 2.5 vs Sonnet — ~2.2× на тих самих токенах** ($1.36 vs $2.98 на 14 Jun). Для CRUD-фічі WS1 Sonnet не дав би пропорційного приросту якості.

5. **Plan → Agent з criteria зменшує «хвилі».** Baseline: 18 events, два піки >650k total (19:18–19:21). Структурований промпт + новий чат могли б зменшити cache read на ~50% (§5 B → **$0.69**).

6. **Repomix — безкоштовний sanity check.** `repomix app/src` → **2 813 tokens** — нижня межа контексту коду фічі перед великим промптом.

---

## 7. Чеклист

- [x] Usage CSV інтегровано в §2 (14 Jun: 6 077 901 · 16 Jun: 4 239 596 · WS1: 10 317 497)
- [x] §3: розрахунок з cache read ($1.36 + $1.08 = $2.44 WS1)
- [x] §5 A/B: B перераховано з cache read ($0.69)
- [x] Repomix: app/src 2 813 · app 7 473 · skill 57 491 tok
- [x] `repomix-output.xml` і `usage-events-*.csv` не комітити (локальні артефакти)
- [x] Task 4 (bonus): `docs/ab-experiment.md` — A/B копіювання нотатки
