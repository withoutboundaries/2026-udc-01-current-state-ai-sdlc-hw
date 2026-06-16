# Task 4 (bonus) — A/B промптів

**Дата:** 10 Jun 2026 · **IDE:** Cursor · **Модель:** composer-2.5-fast  
**Задача:** додати кнопку **«Копіювати»** — текст нотатки в буфер обміну.  
**Контекст:** `@app/src/components/NoteCard.tsx`, `@app/AGENTS.md` · repomix `app/src` ≈ **2 813 tokens**.

---

## Prompt A — базовий

```text
Додай кнопку копіювання тексту нотатки в буфер обміну.
```

---

## Prompt B — структурований

```text
Роль: React/Next.js розробник. Проєкт — Notes App (див. @app/AGENTS.md).

Контекст:
- Картка нотатки: @app/src/components/NoteCard.tsx
- Стиль кнопок як у «Видалити»; UI українською

Обмеження:
- Не змінювати notes-storage / use-notes
- Client лише в існуючих компонентах
- Після змін: npm run build && npm run lint у app/

Acceptance criteria:
1) Кнопка «Копіювати» біля «Видалити» на кожній картці
2) Клік → note.text у clipboard (navigator.clipboard.writeText)
3) Короткий feedback «Скопійовано» (~2 с), потім зникає
4) aria-label українською; type="button"
5) Помилка clipboard — без падіння UI (ignore / console)

Формат відповіді:
- Список змінених файлів
- Коротко, як перевірити вручну (1–2 кроки)
```

---

## Результати

| Метрика | A — базовий | B — структурований |
|---|---|---|
| **Ітерації агента** | 3 | 1 |
| **Файлів змінено** | 1 (`NoteCard.tsx`) | 1 (`NoteCard.tsx`) |
| **build + lint** | lint OK; без feedback/a11y — довелось доробляти | з першого разу |
| **AC виконано** | 2 / 5 | 5 / 5 |
| **Орієнтовні tokens*** | ~280–420k (3 turns + cache) | ~90–140k (1 turn) |

\*Tokens — оцінка в межах однієї короткої сесії (окремий export у Usage не робили); масштаб: repomix `app/src` 2 813 tok/turn + зростання cache read на кожну ітерацію (див. `docs/cost-analysis.md` §2).

### Якість — що отримали

| Критерій | A | B |
|---|---|---|
| Кнопка копіює текст | ✅ | ✅ |
| Feedback «Скопійовано» | ❌ → додано в iter 2 | ✅ |
| `aria-label` | ❌ → iter 3 | ✅ |
| Група кнопок / layout | ⚠️ криво → iter 2 | ✅ |
| Обробка помилки clipboard | ❌ | ✅ |
| Перевірка build/lint у промпті | ❌ (не згадано) | ✅ |

**Хід Prompt A (3 ітерації):**

1. **Iter 1** — `onClick={() => navigator.clipboard.writeText(note.text)}`, кнопка «Копіювати»; працює, але без UX/a11y.
2. **Iter 2** — «додай підказку що скопійовано» → локальний state + timeout 2s.
3. **Iter 3** — «зроби як Видалити, додай aria-label» → фінальний layout.

**Хід Prompt B (1 ітерація):** усі 5 AC закриті одразу; `npm run build` і `npm run lint` — без помилок.

---

## Висновок

**Структурований промпт (B) виграв по всіх осях:** одна ітерація замість трьох, повний AC з першого разу, менше tokens через коротший чат. Базовий «зроби X» швидко дає **working prototype**, але змушує витрачати 2–3 follow-up на a11y, feedback і стиль — саме те, що в Task 2 призвело до ESLint-рефактору (`useSyncExternalStore`).

**Практичне правило для наступних задач:** навіть для дрібної фічі вкладати **acceptance criteria + обмеження + команду перевірки** в перший промпт; роль і формат відповіді допомагають агенту не «забути» lint/build.

---

## Як відтворити

```bash
cd app && npm run dev
# Додати нотатку → «Копіювати» → «Скопійовано» → вставити в інше поле
npm run build && npm run lint
```
