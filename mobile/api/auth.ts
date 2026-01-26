import type { RecordAuthResponse, RecordModel } from 'pocketbase';

import { USERS_COLLECTION } from './config';
import { collection, pocketBaseClient } from './pocketbase';

export type UserRecord = RecordModel & {
  username?: string;
  email?: string;
  name?: string;
};

export type AuthResult = RecordAuthResponse<UserRecord>;

export type SignupInput = {
  email: string;
  password: string;
  passwordConfirm: string;
  username?: string;
  name?: string;
};

export const loginWithPassword = async (
  identity: string,
  password: string,
): Promise<AuthResult> => {
  const authData = await collection<UserRecord>(USERS_COLLECTION).authWithPassword(
    identity,
    password,
  );

  return authData;
};

export const signUp = async (payload: SignupInput): Promise<UserRecord> => {
  const newUser = await collection<UserRecord>(USERS_COLLECTION).create(payload);
  return newUser;
};

export const logout = (): void => {
  pocketBaseClient.authStore.clear();
};

export const isAuthenticated = (): boolean => pocketBaseClient.authStore.isValid;

export const getAuthToken = (): string => pocketBaseClient.authStore.token;

export const getCurrentUser = (): UserRecord | null =>
  (pocketBaseClient.authStore.model as UserRecord | null) ?? null;
