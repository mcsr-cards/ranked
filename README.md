# @mcsr-cards/ranked

Typed client for the [MCSR Ranked](https://mcsrranked.com) API.

```
npm install @mcsr-cards/ranked
```

Requires Node 18+ (uses global `fetch`).

## Usage

```ts
import { createClient } from '@mcsr-cards/ranked';

const ranked = createClient({ apiKey: process.env.MCSR_RANKED_API_KEY });

const user = await ranked.getUser('feinberg');
const matches = await ranked.getUserMatches(user.uuid, { type: 2, count: 50 });
const leaderboard = await ranked.getLeaderboard();
```

An identifier is a UUID, a nickname, or `discord.{id}`:

```ts
await ranked.getUser('discord.843230753734918154');
```

The API key is optional but raises your rate limit. Generate one in game under
Profile, Settings, Generate & Copy API Private Key.

You can also request a private API key for larger projects with higher rate limits on the Discord server, as of June 2026 that limit is 3000 requests per 10 minutes by default.

## Rate limiting

Requests are counted against a 10 minute window and `RateLimitError` is thrown
locally once the budget is gone, so you find out before the API starts rate limiting.
The budget is always the public limit of 500 requests per 10 minutes, even when you pass
an `apiKey`. **Raising rate limits is manual,** so for a regular private key it looks
something like this:

```ts
createClient({ apiKey, limiter: new RateLimiter(3000, 600_000) });
```

`mcsr.remaining()` shows how many requests are left in that window.

## Caching

Responses are cached in memory per URL, 5 seconds on `api.mcsrranked.com` and
30 seconds on `mcsrranked.com/api`

You can (and should) raise it manually to your needs:

```ts
createClient({ ttl: { user: 300_000, leaderboard: 60_000 } });
```

Setting a TTL lower than the defaults is pointless, because you'll just be requesting
already cached info.

Pass your own store to cache somewhere other than memory, useful for workers or
whatever:

```ts
createClient({ cache: myRedisBackedStore });
```

Any object with this shape works, and `CacheStore` is exported if you want to implement
it explicitly:

```ts
interface CacheStore {
  get(key: string): unknown | Promise<unknown>;
  set(key: string, value: unknown, ttlMs: number): void | Promise<void>;
}
```

`get` and `set` may return promises, so a Redis or KV backed store works as-is. If the
store throws, a read is treated as a miss and a write is dropped, the request still goes
through.

## Timeouts and retries

Requests are aborted after 10 seconds by default, and `MCSRRankedTimeoutError` is thrown.
Set `timeoutMs: 0` to disable.

Network errors and 5xx responses are retried twice with exponential backoff (250ms, 500ms).
4xx responses and `RateLimitError` are never retried. Set `retries: 0` to disable.

```ts
createClient({ timeoutMs: 5_000, retries: 0 });
```

## Validation

Responses are validated against the API's own OpenAPI schema (via [ajv](https://ajv.js.org))
before being returned, corrupted or unexpected fields throw `MCSRRankedValidationError`
Set `validate: false` to disable.

## Errors

Failures throw `MCSRRankedError` with `status`, `message` and the raw `data`.

Be aware the API answers 400 for everything for some reason, so an unknown user and a
malformed request can only be told apart by the message. `isMissingUser` does that for you:

```ts
import { isMissingUser } from '@mcsr-cards/ranked';

try {
  await ranked.getUser('discord.123');
} catch (err) {
  if (isMissingUser(err)) {
    // no linked account
  }
  throw err;
}
```

## Cursors

`after` and `before` take a match ID, and the API rejects anything below 1 with
`Too small: expected number to be >=1`. The spec gives them no minimum, only `count` has
one, so this is a server rule you cannot see in the types. Use `after: 1` when you mean
"everything", not 0

## Types

`src/schema.d.ts` (types) and `src/schemas.ts` (validation schemas) are both generated
from the spec:

```
npm run update-spec   # pull the latest openapi.yaml
npm run generate      # regenerate src/schema.d.ts and src/schemas.ts
```

The upstream spec is maintained by hand and has shipped incorrect types before,
so please review the updated spec before generating. (im gonna forget)

I'm an idiot. Please validate anything you depend on.

## License

MIT
