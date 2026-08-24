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

export class McsrRankedError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly data: unknown = null,
  ) {
    super(message);
    this.name = 'McsrRankedError';
  }
}

// every failure is a 400 (redlime why have you forsaken me), and data is either {error} or {params: {field: [msg]}}
function errorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const shape = data as { error?: unknown; params?: Record<string, unknown> };
    if (typeof shape.error === 'string') return shape.error;
    if (shape.params && typeof shape.params === 'object') {
      const messages = Object.values(shape.params)
        .flat()
        .filter((value): value is string => typeof value === 'string');
      if (messages.length) return messages.join(', ');
    }
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

export interface ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  cache?: CacheStore;
  limiter?: RateLimiter;
  ttl?: Partial<TtlConfig>;
}

export class McsrRankedClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly cache: CacheStore;
  private readonly limiter: RateLimiter;
  private readonly ttl: TtlConfig;
  private readonly inflight = new Map<string, Promise<unknown>>();

  constructor(options: ClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? BASE_URL;
    this.headers = options.apiKey ? { 'Private-Key': options.apiKey } : {};
    this.cache = options.cache ?? new MemoryCache();
    this.limiter = options.limiter ?? new RateLimiter();
    this.ttl = { ...defaultTtl(this.baseUrl), ...options.ttl };
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
    if (existing) return existing as Promise<T>;

    const pending = this.load<T>(key, ttlMs).finally(() => this.inflight.delete(key));
    this.inflight.set(key, pending);
    return pending;
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
      throw new McsrRankedError(res.status, detail || 'request failed', body?.data ?? null);
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
  return new McsrRankedClient(options);
}
