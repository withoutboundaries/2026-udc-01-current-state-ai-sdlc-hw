# Task 2 — Workflow (Plan → Agent)

**Фіча:** список нотаток — додавання через форму, перегляд, видалення, збереження в `localStorage`.

**Інструмент:** Cursor (Agent + Plan-підхід у одній сесії).

---

## Acceptance criteria фічі

Сформульовано **до написання коду**:

1. **Додавання нотатки** — форма з textarea і кнопкою «Додати». Порожній текст або лише пробіли → помилка «Введіть текст нотатки», нотатка не створюється. Валідний текст → нотатка з’являється в списку, поле очищується.
2. **Список нотаток** — кожен рядок показує текст і дату/час створення. Нові нотатки додаються **зверху** списку.
3. **Видалення** — біля кожної нотатки кнопка «Видалити»; після кліку рядок зникає одразу.
4. **Порожній стан** — якщо нотаток немає, показується «Нотаток ще немає».
5. **Збереження** — дані в `localStorage`; після перезавантаження (F5) список відновлюється; видалення також зберігається.

### Як перевіряли

| Крок | Дія | Очікуваний результат |
|---|---|---|
| 1 | Відкрити `/` | Форма + «Нотаток ще немає» |
| 2 | «Додати» без тексту | Помилка, список порожній |
| 3 | Додати «Перша нотатка» | Рядок з текстом і датою |
| 4 | Додати другу | Друга зверху |
| 5 | Видалити одну | Зникає з UI |
| 6 | F5 | Стан як до reload |
| 7 | Видалити всі + F5 | Знову порожній стан |

Автоматично: `npm run build`, `npm run lint` у `app/` — без помилок.

---

## Режим Plan — що робили

**Мета:** отримати план реалізації до коду, без змін у репозиторії.

1. **Обрали фічу** — список нотаток (узгоджено з назвою проєкту в `app/AGENTS.md`).
2. **Зафіксували 5 acceptance criteria** (див. вище).
3. **Спроєктували архітектуру:**
   - `src/app/page.tsx` — Server Component (обгортка сторінки);
   - `src/components/NotesApp.tsx` — `"use client"`, форма + список;
   - `src/components/NoteCard.tsx` — один рядок нотатки;
   - `src/types/note.ts` — тип `Note`;
   - `src/lib/notes-storage.ts` — read/write `localStorage` з версією схеми.
4. **Узгодили підхід до стану:** `useState` для списку; завантаження з `localStorage` у `useEffect` після mount.
5. **Врахували skill `vercel-react-best-practices`:** `client-localstorage-schema`, `rerender-functional-setstate`, `rerender-no-inline-components`.

**Промпт до агента (Plan):** сформулювати acceptance criteria і план файлів/компонентів перед імплементацією.

---

## Рев’ю плану — що скоригували

Після перегляду плану **до коду** внесли такі зміни:

| Було в чернетці плану | Стало після рев’ю | Чому |
|---|---|---|
| Один великий `NotesApp` з розміткою рядка | Окремий `NoteCard.tsx` | Skill: `rerender-no-inline-components` |
| Сирий масив у `localStorage` | JSON `{ version: 1, notes: [...] }` | Skill: `client-localstorage-schema` |
| ISO-дата в UI | `Intl.DateTimeFormat("uk-UA")` | Зрозуміліший формат для користувача |
| Одразу показувати порожній стан | Короткий «Завантаження…» до client hydrate | Уникнути миготіння при читанні `localStorage` |

---

## Режим Agent — що робили

**Мета:** реалізувати фічу за погодженим (скоригованим) планом.

1. Створено файли: `note.ts`, `notes-storage.ts`, `NoteCard.tsx`, `NotesApp.tsx`.
2. Оновлено `page.tsx` — підключено `NotesApp` замість шаблону `create-next-app`.
3. Оновлено `layout.tsx` — title/description для Notes App.
4. Запущено `npm run build` і `npm run lint`.

**Промпт до агента (Agent):** «Пройдіть задачу у двох режимах… виконайте за погодженим планом».

---

## Що скоригували під час Agent (після рев’ю дифу / lint)

Під час імплементації план **ще раз** змінили — вже після коду:

| Проблема | Рішення |
|---|---|
| ESLint `react-hooks/set-state-in-effect` на `setNotes(loadNotes())` у `useEffect` | Винесено логіку в `src/lib/use-notes.ts` на базі `useSyncExternalStore` |
| Ризик зайвого save до hydrate | Save лише через `updateNotes()` після завантаження snapshot |

Підсумкова структура:

```
app/src/
├── app/page.tsx          # Server Component
├── components/
│   ├── NotesApp.tsx      # client: форма + список
│   └── NoteCard.tsx      # client: один рядок
├── lib/
│   ├── notes-storage.ts  # localStorage + version
│   └── use-notes.ts      # useSyncExternalStore hook
└── types/note.ts
```

---

## Висновок

- **Plan** дав чітку архітектуру й acceptance criteria до коду.
- **Рев’ю плану** додало `NoteCard`, версіонування `localStorage` і UX-деталі.
- **Agent** реалізував фічу; **рев’ю дифу** призвело до рефакторингу стану (`useSyncExternalStore`) для відповідності ESLint і React-практикам.

Фіча відповідає всім 5 acceptance criteria; опис процесу зафіксовано для CodeRabbit / DoD Task 2.
