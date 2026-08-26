import Ajv2020 from 'ajv/dist/2020.js';
import type { components } from './schema';
import { schemaDefs } from './schemas';

type Schemas = components['schemas'];

const ajv = new Ajv2020({ strict: false });

function compile<T>(ref: string) {
  return ajv.compile<T>({ $defs: schemaDefs, $ref: `#/$defs/${ref}` });
}

const validateUserDetails = compile<Schemas['UserDetails']>('UserDetails');
const validateLeaderboard = compile<Schemas['Leaderboard']>('Leaderboard');
const validateMatchInfoList = ajv.compile<Schemas['MatchInfo'][]>({
  $defs: schemaDefs,
  type: 'array',
  items: { $ref: '#/$defs/MatchInfo' },
});

export function isUserDetails(value: unknown): value is Schemas['UserDetails'] {
  return validateUserDetails(value);
}

export function isMatchInfoArray(value: unknown): value is Schemas['MatchInfo'][] {
  return validateMatchInfoList(value);
}

export function isLeaderboard(value: unknown): value is Schemas['Leaderboard'] {
  return validateLeaderboard(value);
}
