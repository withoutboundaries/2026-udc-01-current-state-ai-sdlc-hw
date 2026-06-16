import { useCallback, useSyncExternalStore } from "react";

import type { Note } from "@/types/note";

import { loadNotes, saveNotes } from "./notes-storage";

const listeners = new Set<() => void>();

let notesCache: Note[] | null = null;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getNotesSnapshot(): Note[] {
  if (typeof window === "undefined") {
    return [];
  }

  if (notesCache === null) {
    notesCache = loadNotes();
  }

  return notesCache;
}

function getServerSnapshot(): Note[] {
  return [];
}

function updateNotes(updater: (current: Note[]) => Note[]) {
  const next = updater(getNotesSnapshot());
  notesCache = next;
  saveNotes(next);
  listeners.forEach((listener) => listener());
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useNotes() {
  const isClient = useIsClient();
  const notes = useSyncExternalStore(
    subscribe,
    getNotesSnapshot,
    getServerSnapshot,
  );

  const addNote = useCallback((text: string) => {
    const note: Note = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    };

    updateNotes((current) => [note, ...current]);
  }, []);

  const deleteNote = useCallback((id: string) => {
    updateNotes((current) => current.filter((note) => note.id !== id));
  }, []);

  return {
    notes,
    addNote,
    deleteNote,
    isReady: isClient,
  };
}
