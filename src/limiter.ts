export class RateLimitError extends Error {
  constructor(readonly retryAfterMs: number) {
    super(`rate limit exhausted, retry in ${Math.ceil(retryAfterMs / 1000)}s`);
    this.name = 'RateLimitError';
  }
}

export class RateLimiter {
  private hits: number[] = [];

  constructor(
    readonly limit = 3000,
    readonly windowMs = 600_000,
  ) {}

  private prune(now: number) {
    const cutoff = now - this.windowMs;
    const keep = this.hits.findIndex((hit) => hit > cutoff);
    this.hits = keep === -1 ? [] : this.hits.slice(keep);
  }

  remaining(): number {
    this.prune(Date.now());
    return this.limit - this.hits.length;
  }

  take() {
    const now = Date.now();
    this.prune(now);
    if (this.hits.length >= this.limit) {
      const oldest = this.hits[0];
      throw new RateLimitError(oldest === undefined ? 0 : oldest + this.windowMs - now);
    }
    this.hits.push(now);
  }
}
