# Suprabath Behera — React Portfolio Final v5

A clean, recruiter-focused React portfolio for Java Backend / Spring Boot developer roles.

## What changed in final v5

- Premium UI cleanup pass.
- Removed experimental pet/fingerprint/extra background effects.
- Removed fake local analytics numbers.

- Home page shows top 3 certificates and top 2 projects only.
- Certificates show full image first, details below.
- Projects show screenshot first; if video is uploaded, it starts automatically after 3 seconds.
- Project videos are stored in IndexedDB in local mode, not localStorage.
- Mobile resume view now opens PDF separately instead of showing a cropped iframe.
- Better spacing, colors, cards, progress bars, and mobile layout.

## Run locally

```bash
npm install
npm run dev
```

Open the localhost link shown in terminal.

## Build for Netlify

```bash
npm run build
```

Netlify settings:

- Build command: `npm run build`
- Publish directory: `dist`

## Important limits

This version is free/local-first. Admin data saves in browser storage.
For final public deployment with real all-user analytics, real login, and permanent image/video uploads, connect Firebase Auth, Firestore, Firebase Storage, and Google Analytics later.

Do not run `npm audit fix --force` unless you are ready to test dependency changes.
