# GGS scaffold verification

Verified 5 October 2026.

## Automated checks

- `npm test`: 12 existing content/session tests pass across two files.
- TypeScript and Vite production builds pass at `/` and `/German-Grammar-Simplified/`.
- Workbox generates a service worker and precaches 21 entries, including app code, CSS, fonts, icons and HTML (approximately 476 KiB).

## Browser checks

Using Playwright CLI with Chromium and the production preview under the GitHub Pages project path:

- App renders with the correct title, GGS name and manifest paths.
- Manifest has standalone display, project-relative identity/start/scope, 192/512 PNG icons and a separate maskable entry.
- Service worker reaches activated state and controls the page.
- After a successful online visit, a browser context set to offline can reload the full app; local fonts are loaded and the offline status is shown.
- Preserved prototype opens through the hash link while offline.
- Desktop (1200px) and narrow mobile (320px) layouts have no horizontal overflow; screenshots inspected visually.
- Initial preview mismatch was resolved by using the project base environment variable for both build and preview; README records that command.

Screenshots are local artifacts under `output/playwright/` and excluded from Git.

## Limits

No full A1 beginner lesson is implemented. Install/update controls depend on browser events. Actual operating-system installation, Safari/Firefox behavior and a second-version update cycle have not been manually verified. Browser speech synthesis in the preserved trial may depend on installed voices and is not promised offline. Progress remains in local storage and does not sync across devices.

The GitHub Actions deployment and hosted HTTPS checks are recorded after publication below.
