import PocketBase from 'pocketbase';

import { pocketBaseUrl } from './config';

const pb = new PocketBase(pocketBaseUrl);

export const pocketBaseClient = pb;

/**
 * Convenience helper to get a typed collection instance.
 */
export const collection = <TRecord = unknown>(name: string) =>
  pocketBaseClient.collection<TRecord>(name);
