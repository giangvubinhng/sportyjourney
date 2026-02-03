// const DEFAULT_POCKETBASE_URL = 'http://10.0.2.2:8090';
const DEFAULT_POCKETBASE_URL = 'http://192.168.1.191:8090';

/**
 * Base URL for the PocketBase instance. Prefer an Expo public env so it is
 * available on both native and web builds.
 */
export const pocketBaseUrl =
  process.env.EXPO_PUBLIC_POCKETBASE_URL?.trim().replace(/\/$/, '') ||
  DEFAULT_POCKETBASE_URL;

export const USERS_COLLECTION = 'users';
export const SESSIONS_COLLECTION = 'sessions';
