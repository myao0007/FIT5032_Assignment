# FIT5032_Assignment_A1.2

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Use Firebase Emulator (recommended for restricted networks)

If your console shows errors like "FirebaseError: Failed to get document because the client is offline" during navigation, your network may be blocking access to `*.googleapis.com`.

Run the Firebase Emulator locally and the app will auto-connect in development:

```sh
# 1) Install the CLI once
npm i -g firebase-tools

# 2) Start emulators in this repo (Auth:9099, Firestore:8080)
firebase emulators:start --only auth,firestore --project demo-she --config firebase_emulator/firebase.json

# 3) In another terminal, run Vite dev server
npm run dev
```

When running on `localhost`, `src/firebase/config.js` connects to the emulators automatically.

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
