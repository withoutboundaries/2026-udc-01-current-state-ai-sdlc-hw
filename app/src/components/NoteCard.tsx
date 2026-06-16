"use client";

import { useEffect, useState } from "react";

import type { Note } from "@/types/note";

type NoteCardProps = {
  note: Note;
  onDelete: (id: string) => void;
};

const COPY_FEEDBACK_MS = 2000;

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(note.text);
      setCopied(true);
    } catch {
      // Clipboard may be unavailable outside a secure context or without permission.
    }
  }

  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-wrap break-words text-zinc-900 dark:text-zinc-100">
          {note.text}
        </p>
        <time
          className="mt-2 block text-sm text-zinc-500 dark:text-zinc-400"
          dateTime={note.createdAt}
        >
          {formatCreatedAt(note.createdAt)}
        </time>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          aria-label="Скопіювати текст нотатки"
        >
          {copied ? "Скопійовано" : "Копіювати"}
        </button>
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          aria-label="Видалити нотатку"
        >
          Видалити
        </button>
      </div>
    </li>
  );
}
