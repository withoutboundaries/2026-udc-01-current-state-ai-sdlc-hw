# AGENTS.md — UDC WS1 Notes App

Невеликий Next.js-проєкт у `app/` для домашнього завдання Воркшопу 1.
Документація українською; ідентифікатори в коді — англійською.

> **Next.js 16:** API та конвенції можуть відрізнятися від старіших версій у
> training data. Перед змінами маршрутизації чи data fetching переглядай
> `node_modules/next/dist/docs/` і deprecation notices.

## Стек і версії

| Технологія | Версія |
|---|---|
| Node.js | 22+ (локально: 24.x через nvm) |
| Next.js (App Router) | 16.2.9 |
| React / React DOM | 19.2.4 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.1 |
| ESLint (`eslint-config-next`) | 9.39.4 / 16.2.9 |
| PostCSS | `@tailwindcss/postcss` ^4 |

**Структура:** `src/app/` (App Router), `src/components/` (UI), `public/` (статика).

## Команди

Усі команди запускати з теки `app/`:

```bash
npm run dev      # dev-сервер → http://localhost:3000
npm run build    # production build + typecheck
npm run start    # запуск зібраного build
npm run lint     # ESLint — поточна «test»-перевірка (окремий test runner ще не додано)
```

**Перевірка перед PR:** `npm run build` і `npm run lint` без помилок.

## Конвенції

1. **Нейминг:** React-компоненти — `PascalCase` (`NoteCard.tsx`); хуки — `use` + `camelCase`; утиліти — `camelCase`; файли маршрутів у `src/app/` — `kebab-case` для сегментів URL.
2. **Структура:** сторінки лише в `src/app/`; перевикористовуваний UI — `src/components/`; спільні типи — `src/types/`; чисті функції без React — `src/lib/`.
3. **Компоненти:** за замовчуванням Server Components; `"use client"` — лише для інтерактиву (стан, події, браузерні API).
4. **Стиль:** Tailwind utility-класи в JSX; глобальні токени — у `src/app/globals.css`; уникати inline `style={{}}`, якщо це не динамічне значення.
5. **Імпорти:** alias `@/*` → `src/*`; зовнішні пакети спочатку, потім внутрішні (`@/components/...`), порожній рядок між групами.

## Guardrails

1. **НЕ чіпати** без явного запиту: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `package-lock.json`, кореневі `AGENTS.md` / `.coderabbit.yaml` поза `app/`.
2. **НЕ робити:** комітити `.env*`, секрети, API keys; додавати важкі UI-бібліотеки без узгодження; переписувати весь шаблон `create-next-app` замість точкових змін під фічу.
3. **НЕ тягнути в контекст агента:** `node_modules/`, `.next/`, lock-файли — для цього є `.cursorignore` у корені репо.
