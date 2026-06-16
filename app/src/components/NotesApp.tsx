"use client";

import { FormEvent, useState } from "react";

import { NoteCard } from "@/components/NoteCard";
import { useNotes } from "@/lib/use-notes";

export function NotesApp() {
  const { notes, addNote, deleteNote, isReady } = useNotes();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    if (!text) {
      setError("Введіть текст нотатки");
      return;
    }

    addNote(text);
    setDraft("");
    setError(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Нотатки
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Додавайте, переглядайте та видаляйте нотатки. Дані зберігаються локально.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="note-text" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Нова нотатка
        </label>
        <textarea
          id="note-text"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          rows={3}
          placeholder="Що потрібно запамʼятати?"
          className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Додати
        </button>
      </form>

      <section aria-label="Список нотаток">
        {!isReady ? (
          <p className="text-zinc-500 dark:text-zinc-400">Завантаження…</p>
        ) : notes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Нотаток ще немає
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={deleteNote} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
