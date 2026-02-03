# Architecture

Production-oriented structure for the Sportbook BJJ app. Safe to extend and easy for new developers to onboard.

## Stack

- **Expo (React Native)** – app runtime and tooling
- **Expo Router** – file-based routing under `app/`
- **PocketBase** – backend (auth + `sessions` collection)
- **Gluestack UI** – components (themed + NativeWind)
- **Formik** – form state (add-session, auth)

## Folder structure

```
├── api/           # Backend: PocketBase client, auth, sessions, config
├── app/           # Screens and routes (Expo Router)
├── components/    # Reusable UI (ui/, layout, shared)
├── constants/     # Theme (Colors, PRIMARY_COLOR), fonts
├── docs/          # Architecture, ADRs
├── hooks/         # useColorScheme, useThemeColor, etc.
├── lib/           # Form/validation (session-form), utils
├── types/         # Shared TypeScript types (re-exports from api)
└── assets/        # Images, fonts
```

## Theme (light / dark)

- **Primary color**: `#1fa358` (green). Defined in:
  - `constants/theme.ts` – `PRIMARY_COLOR`, `Colors` for tabs/navigation
  - `components/ui/gluestack-ui-provider/config.ts` – primary scale (0–950) for light and dark
- **System theme**: Root layout uses system color scheme; `GluestackUIProvider` applies the matching config (light/dark) so NativeWind and Gluestack tokens stay in sync.
- **Tabs**: `app/(tabs)/_layout.tsx` uses `Colors[colorScheme]` from `constants/theme` for tab bar tint.

## API layer

- **`api/config.ts`** – `pocketBaseUrl`, collection names. Override with `EXPO_PUBLIC_POCKETBASE_URL` (see `.env.example`).
- **`api/pocketbase.ts`** – PocketBase client and typed `collection()` helper.
- **`api/auth.ts`** – Login, signup, logout, `getCurrentUser()`.
- **`api/sessions.ts`** – `listSessions()`, `createSession()`, `SessionRecord` / `CreateSessionInput`.
- **`api/index.ts`** – Re-exports for a single import path.

## Auth and routing

- **Root layout** (`app/_layout.tsx`): Waits for nav ready, then redirects:
  - No user → `/auth`
  - User on `/auth` → `/(tabs)`
- **Auth screen**: `app/auth.tsx` (login/signup).
- **Tabs**: Home, Add Session, Progress.

## Conventions

- **Types**: Prefer exporting from `api/*`; `types/index.ts` re-exports shared app types.
- **Env**: Use `EXPO_PUBLIC_*` for build-time config; document in `.env.example`.
- **Theme**: Use `constants/theme` and Gluestack/NativeWind tokens; avoid hardcoded hex except in theme files.
- **Reuse**: Shared form logic in `lib/` (e.g. `session-form.ts`); shared UI in `components/`.
