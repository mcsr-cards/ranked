import { type CacheStore, MemoryCache } from './src/cache';
import { RateLimitError, RateLimiter } from './src/limiter';
import type { components, operations } from './src/schema';

type Schemas = components['schemas'];

export type UserDetails = Schemas['UserDetails'];
export type MatchInfo = Schemas['MatchInfo'];
export type Leaderboard = Schemas['Leaderboard'];

export type UserQuery = NonNullable<operations['getUserData']['parameters']['query']>;
export type MatchQuery = NonNullable<operations['getUserMatches']['parameters']['query']>;
export type LeaderboardQuery = NonNullable<operations['getEloLeaderboard']['parameters']['query']>;

export type { CacheStore };
export { MemoryCache, RateLimitError, RateLimiter };

const BASE_URL = 'https://api.mcsrranked.com';

export class MCSRRankedError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly data: unknown = null,
  ) {
    super(message);
    this.name = 'MCSRRankedError';
  }
}

function stringLeaves(value: unknown, depth = 4): string[] {
  if (depth < 0) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap((entry) => stringLeaves(entry, depth - 1));
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((entry) => stringLeaves(entry, depth - 1));
  }
  return [];
}

// every failure is a 400 (redlime why have you forsaken me)
// data is either {error} or {params: {field: [msg]}}
function errorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const shape = data as { error?: unknown };
    if (typeof shape.error === 'string') return shape.error;
    const messages = stringLeaves(data);
    if (messages.length) return messages.join(', ');
  }
  return fallback;
}

export interface TtlConfig {
  user: number;
  matches: number;
  leaderboard: number;
}

const SERVER_CACHE_MS: Record<string, number> = {
  'https://api.mcsrranked.com': 5_000,
  'https://mcsrranked.com/api': 30_000,
};

function defaultTtl(baseUrl: string): TtlConfig {
  const ms = SERVER_CACHE_MS[baseUrl.replace(/\/+$/, '')] ?? 5_000;
  return { user: ms, matches: ms, leaderboard: ms };
}

function clone<T>(value: T): T {
  return typeof value === 'object' && value !== null ? (structuredClone(value) as T) : value;
}

function mergeTtl(base: TtlConfig, overrides: Partial<TtlConfig> = {}): TtlConfig {
  const merged = { ...base };
  for (const key of Object.keys(merged) as (keyof TtlConfig)[]) {
    const value = overrides[key];
    if (value !== undefined) merged[key] = value;
  }
  return merged;
}

export interface ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  cache?: CacheStore;
  limiter?: RateLimiter;
  ttl?: Partial<TtlConfig>;
}

export class MCSRRankedClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly cache: CacheStore;
  private readonly limiter: RateLimiter;
  private readonly ttl: TtlConfig;
  private readonly inflight = new Map<string, Promise<unknown>>();

  constructor(options: ClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? BASE_URL).replace(/\/+$/, '');
    this.headers = options.apiKey ? { 'Private-Key': options.apiKey } : {};
    this.cache = options.cache ?? new MemoryCache();
    this.limiter = options.limiter ?? new RateLimiter();
    this.ttl = mergeTtl(defaultTtl(this.baseUrl), options.ttl);
  }

  remaining(): number {
    return this.limiter.remaining();
  }

  getUser(identifier: string, query: UserQuery = {}) {
    return this.get<UserDetails>(`/users/${encodeURIComponent(identifier)}`, query, this.ttl.user);
  }

  getUserMatches(identifier: string, query: MatchQuery = {}) {
    const path = `/users/${encodeURIComponent(identifier)}/matches`;
    return this.get<MatchInfo[]>(path, query, this.ttl.matches);
  }

  getLeaderboard(query: LeaderboardQuery = {}) {
    return this.get<Leaderboard>('/leaderboard', query, this.ttl.leaderboard);
  }

  private get<T>(path: string, query: Record<string, unknown>, ttlMs: number): Promise<T> {
    const url = new URL(this.baseUrl + path);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const key = url.toString();

    const existing = this.inflight.get(key);
    if (existing) return (existing as Promise<T>).then(clone);

    const pending = this.load<T>(key, ttlMs).finally(() => this.inflight.delete(key));
    this.inflight.set(key, pending);
    return pending.then(clone);
  }

  private async load<T>(url: string, ttlMs: number): Promise<T> {
    if (ttlMs > 0) {
      try {
        const hit = await this.cache.get(url);
        if (hit !== undefined) return hit as T;
      } catch {}
    }
    return this.fetchJson<T>(url, ttlMs);
  }

  private async fetchJson<T>(url: string, ttlMs: number): Promise<T> {
    this.limiter.take();

    const res = await fetch(url, { headers: this.headers });
    const body = (await res.json().catch(() => null)) as { status?: string; data?: unknown } | null;

    if (!res.ok || body?.status !== 'success') {
      const detail = errorMessage(body?.data, res.statusText);
      throw new MCSRRankedError(res.status, detail || 'request failed', body?.data ?? null);
    }

    if (ttlMs > 0) {
      try {
        await this.cache.set(url, body.data, ttlMs);
      } catch {}
    }
    return body.data as T;
  }
}

export function createClient(options?: ClientOptions) {
  return new MCSRRankedClient(options);
}
