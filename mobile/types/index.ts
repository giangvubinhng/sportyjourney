/**
 * Shared app types. API-specific types stay in api/*; this file is for
 * cross-cutting or UI-only types.
 */

export type { UserRecord, SignupInput } from '@/api/auth';
export type { SessionRecord, CreateSessionInput } from '@/api/sessions';
