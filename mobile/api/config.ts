const DEFAULT_POCKETBASE_URL = 'http://127.0.0.1:8090';

/**
 * Base URL for the PocketBase instance. Prefer an Expo public env so it is
 * available on both native and web builds.
 */
export const pocketBaseUrl =
  process.env.EXPO_PUBLIC_POCKETBASE_URL?.trim().replace(/\/$/, '') ||
  DEFAULT_POCKETBASE_URL;

export const USERS_COLLECTION = 'users';
