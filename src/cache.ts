export interface CacheStore {
  get(key: string): unknown;
  set(key: string, value: unknown, ttlMs: number): void;
}

export class MemoryCache implements CacheStore {
  private entries = new Map<string, { value: unknown; expires: number }>();

  constructor(private readonly maxEntries = 1000) {}

  get(key: string): unknown {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expires <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: unknown, ttlMs: number) {
    if (this.entries.size >= this.maxEntries && !this.entries.has(key)) {
      const oldest = this.entries.keys().next().value;
      if (oldest !== undefined) this.entries.delete(oldest);
    }
    this.entries.set(key, { value, expires: Date.now() + ttlMs });
  }
}
