import type { CrudApi } from "./crudApi";

type NumericKey<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createLocalStorageCrudApi<
  T extends object,
  CreateInput extends object = Partial<T>,
  UpdateInput extends object = Partial<T>,
>(options: {
  storageKey: string;
  idField: NumericKey<T>;
  seed: T[];
  fromCreate?: (input: CreateInput, id: number) => T;
  applyUpdate?: (current: T, input: UpdateInput) => T;
}): CrudApi<T, CreateInput, UpdateInput> {
  const { storageKey, idField, seed, fromCreate, applyUpdate } = options;

  function read(): T[] {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify(seed));
      return clone(seed);
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? (parsed as T[]) : clone(seed);
    } catch {
      localStorage.setItem(storageKey, JSON.stringify(seed));
      return clone(seed);
    }
  }

  function write(rows: T[]) {
    localStorage.setItem(storageKey, JSON.stringify(rows));
  }

  return {
    async getAll() {
      return clone(read());
    },

    async create(input) {
      const rows = read();
      const nextId = rows.reduce(
        (maximum, row) => Math.max(maximum, Number(row[idField]) || 0),
        0,
      ) + 1;

      const created = fromCreate
        ? fromCreate(input, nextId)
        : ({ ...input, [idField]: nextId } as unknown as T);

      write([...rows, created]);
      return clone(created);
    },

    async update(id, input) {
      const rows = read();
      const index = rows.findIndex((row) => String(row[idField]) === String(id));
      if (index < 0) throw new Error(`Record ${id} was not found.`);

      const current = rows[index];
      const updated = applyUpdate
        ? applyUpdate(current, input)
        : ({ ...current, ...input, [idField]: current[idField] } as T);

      const nextRows = [...rows];
      nextRows[index] = updated;
      write(nextRows);
      return clone(updated);
    },

    async remove(id) {
      const rows = read();
      const nextRows = rows.filter((row) => String(row[idField]) !== String(id));
      if (nextRows.length === rows.length) throw new Error(`Record ${id} was not found.`);
      write(nextRows);
    },
  };
}
