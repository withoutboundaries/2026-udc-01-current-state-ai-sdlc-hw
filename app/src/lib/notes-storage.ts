import type { Note } from "@/types/note";

const STORAGE_KEY = "udc-ws1-notes";
const SCHEMA_VERSION = 1;

type StoredNotes = {
  version: number;
  notes: Note[];
};

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.text === "string" &&
    typeof record.createdAt === "string"
  );
}

function parseStoredNotes(raw: string): Note[] {
  const parsed: unknown = JSON.parse(raw);

  if (typeof parsed !== "object" || parsed === null) {
    return [];
  }

  const record = parsed as Record<string, unknown>;

  if (record.version !== SCHEMA_VERSION || !Array.isArray(record.notes)) {
    return [];
  }

  return record.notes.filter(isNote);
}

export function loadNotes(): Note[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return parseStoredNotes(raw);
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredNotes = {
    version: SCHEMA_VERSION,
    notes,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    console.error("[notes-storage] Failed to save notes to localStorage");
    throw new Error("Failed to save notes");
  }
}
