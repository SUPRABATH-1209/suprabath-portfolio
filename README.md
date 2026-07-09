# Suprabath Behera — Developer Portfolio

A recruiter-focused React portfolio for Java Backend Developer, Spring Boot Developer, and Software Engineer roles.

Live site: https://preeminent-praline-d3e820.netlify.app

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Firebase
* Firestore
* Netlify

## Features

* Responsive portfolio UI
* Mobile-first layout
* Recruiter-friendly sections
* Skills, projects, certificates, resume, and contact pages
* Resume preview and download
* Certificate gallery with real uploaded certificate images
* Project cards with screenshot/video support
* Firebase-based anonymous visitor analytics
* Admin dashboard for recruiter activity
* Firebase-based admin password management
* Admin/test device exclusion from analytics
* Netlify production deployment

## Firebase Usage

Firebase is used for real portfolio analytics and admin security.

Tracked anonymously:

* Page views
* Resume opens
* Resume downloads
* Project clicks
* Certificate clicks
* Contact clicks
* Visitor repeat count by anonymous browser ID
* Mobile/desktop activity

No visitor Gmail, name, or personal identity is collected unless login is added in the future.

## Admin Password

Admin password is verified using a SHA-256 password hash stored in Firebase Firestore.

The plain password is not stored in GitHub.

Firestore location:

`portfolioAdminSettings / security / passwordHash`

If the password is forgotten, reset it from Firebase Console by updating the stored password hash.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Netlify

```bash
npx netlify deploy --prod --dir=dist
```

Netlify settings:

* Build command: `npm run build`
* Publish directory: `dist`

## Important Files

* `src/lib/firebase.ts`
* `src/lib/portfolioAnalytics.ts`
* `src/lib/adminPassword.ts`
* `src/hooks/useTrackPageView.ts`
* `src/pages/Admin.tsx`
* `src/data/initialContent.ts`

## Environment Variables

Create `.env.local` locally and add Firebase Vite variables.

Do not commit `.env.local`.

`.gitignore` already excludes:

* `node_modules/`
* `dist/`
* `.env`
* `.env.local`
* `.vite/`
* `.netlify/`
* `tsconfig.tsbuildinfo`

## Content Notes

Certificates should be stored as real files in `public/certificates/`.

Projects can be updated later with real screenshots, GitHub links, demo links, and optional videos.

## Safety Note

This is a public portfolio dashboard setup. For stronger production-grade admin security in the future, Firebase Auth, App Check, and stricter Firestore rules should be added.
