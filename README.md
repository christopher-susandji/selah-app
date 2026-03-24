# Selah App

A minimal focus timer for Bible Scripture reading sessions. The main purpose of this app is to reduce distraction caused by the phone by motivating the user to stay locked into the (physical) Bible. Hence the word "Selah" – to pause and reflect.

(The secondary purpose is to explore React Native and Expo from first principles.)

---

## What it does

- Start a timed reading session with a chosen duration
- Track distractions and app-leave events during a session
- Record a reflection at the end
- Maintain a daily streak across sessions
- View full session history grouped by date

## Tech stack

- [Expo](https://expo.dev) (SDK 52, managed workflow)
- [Expo Router](https://expo.github.io/router) — file-based navigation
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — local persistence
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — tactile feedback
- [expo-keep-awake](https://docs.expo.dev/versions/latest/sdk/keep-awake/) — screen stays on during sessions
- TypeScript throughout

## Project structure

```
src/
├── app/             # Screens (Expo Router file-based)
│   ├── index.tsx    # Home
│   ├── focus-setup.tsx
│   ├── session.tsx
│   ├── finish.tsx
│   └── history.tsx
├── components/      # Reusable UI components
├── hooks/           # Custom hooks (useTimer, useAppState, useKeepAwake)
├── storage/         # AsyncStorage abstraction (sessions, streak)
├── types/           # TypeScript types
└── constants/       # Theme, colors, spacing, fonts
```

## Running locally

```bash
git clone https://github.com/your-username/selah.git
cd selah
npm install
npx expo start
```

Requires the [Expo Go](https://expo.dev/go) app on your device,
or an iOS/Android simulator.

## Status

Work in progress — MVP.
