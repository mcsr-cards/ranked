# @mcsr-cards/ranked

Typed client for the [MCSR Ranked](https://mcsrranked.com) API.

```
npm install @mcsr-cards/ranked
```

Requires Node 18+ (uses global `fetch`).

## Usage

```ts
import { createClient } from '@mcsr-cards/ranked';

const mcsr = createClient({ apiKey: process.env.MCSR_RANKED_API_KEY });

const user = await mcsr.getUser('feinberg');
const matches = await mcsr.getUserMatches(user.uuid, { type: 2, count: 50 });
const leaderboard = await mcsr.getLeaderboard();
```

An identifier is a UUID, a nickname, or `discord.{id}`:

```ts
await mcsr.getUser('discord.843230753734918154');
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
createClient({ cache: myRedisBackedStore });   // see src/cache.ts
```

`get` and `set` may return promises, so a Redis or KV backed store works as-is. If the
store throws, a read is treated as a miss and a write is dropped, the request still goes
through.

## Errors

Failures throw `McsrRankedError` with `status`, `message` and the raw `data`.

Be aware the API answers 400 for everything for some reason, so an unknown user
and a malformed request has to be distinguished like this:

```ts
try {
  await mcsr.getUser('discord.123');
} catch (err) {
  if (err instanceof McsrRankedError && err.message === 'User is not exists.') {
    // no linked account
  }
}
```

## Types

`src/schema.d.ts` is generated from a vendored copy of the spec:

```
bun run update-spec   # pull the latest openapi.yaml
bun run generate      # regenerate types
```

The upstream spec is maintained by hand and has shipped incorrect types before,
so please review the updated spec before generating. (im gonna forget)

I'm an idiot. Please validate anything you depend on.

## License

MIT
