import type { RecordModel } from 'pocketbase';

import { getCurrentUser } from './auth';
import { SESSIONS_COLLECTION } from './config';
import { collection } from './pocketbase';

export type SessionRecord = RecordModel & {
  id: string;
  user_id: string;
  name: string
  duration: number;
  energy: number;
  note?: string;
  date: string;
  created: string;
  updated: string;
};

export type CreateSessionInput = {
  name: string;
  duration: number;
  energy: number;
  note?: string;
  date: string;
};

const sessionsCollection = () => collection<SessionRecord>(SESSIONS_COLLECTION);

export async function listSessions(): Promise<SessionRecord[]> {
  const user = getCurrentUser();
  if (!user) return [];
  const list = await sessionsCollection().getList(1, 50, {
    filter: `created_by = "${user.id}"`,
    sort: '-date,-created_at',
  });
  console.log(list)
  return list.items;
}

export async function createSession(input: CreateSessionInput): Promise<SessionRecord> {
  const user = getCurrentUser();
  if (!user) throw new Error('Must be logged in to create a session');
  return sessionsCollection().create({
    created_by: user.id,
    name: input.name,
    date: input.date,
    duration: input.duration,
    energy: input.energy,
    note: input.note ?? '',
  });
}
