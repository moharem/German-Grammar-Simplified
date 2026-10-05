# German Grammar Simplified (GGS)

German grammar from the beginning, one clear idea at a time. A responsive React/TypeScript app and installable PWA, with English explanations first and Arabic localization planned.

- **App:** https://moharem.github.io/German-Grammar-Simplified/
- **Repository:** https://github.com/moharem/German-Grammar-Simplified

## Current scope

This is the platform scaffold. The new A1 beginner path is in preparation; no complete A1–C2 course is claimed. The earlier werden/würden/worden experiment remains available at `#trial`, labelled as a prototype. Its development is paused.

The proposed first pilot is people + **sein** + simple statements. Test one small topic, refine explanations and pacing with beginner feedback, then test a second topic before expanding. See [the development proposal](docs/development-plan.md) and [the reference comparison and grammar inventory](docs/research/german-grammar-reference-a1-c2.md).

## Local development

Use Node 22.12+:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Development normally starts at http://localhost:5173; production preview normally uses http://localhost:4173. The manifest/service worker is generated for production builds. Use the production preview to test offline behavior.

For the deployed project path:

```sh
VITE_BASE_PATH=/German-Grammar-Simplified/ npm run build
VITE_BASE_PATH=/German-Grammar-Simplified/ npm run preview
```

Then open http://localhost:4173/German-Grammar-Simplified/. Default builds use `/`; the Pages workflow supplies the project base path.

## Deployment

GitHub Pages publishes `dist/` through [the Actions workflow](.github/workflows/deploy.yml). Pushes to `main` run tests, type-check/build, and deploy. Pull requests run tests/build without publishing. Pages must use GitHub Actions as its source.

## Browser and PWA behavior

- Use GGS in a normal desktop or mobile browser. Installation is optional.
- Chromium browsers can show the app's **Install GGS** button when eligible; browser menus may also offer installation. Safari uses Add to Dock on supported macOS versions or Add to Home Screen on iOS. Installation controls vary by browser.
- After the first successful online load and service-worker download, app assets, fonts and existing prototype content are cached for offline use. External links still require a connection.
- Updates prompt the learner to reload when ready, protecting an ongoing practice step.
- Prototype progress/language stay in browser local storage. There is no backend, login or device synchronization. Clearing site data removes local progress and downloaded content.
- Hosted HTTPS and localhost support service workers; plain HTTP on a LAN address does not provide full PWA behavior.

Built with [Vite](https://vite.dev/guide/static-deploy.html) and [Vite PWA](https://vite-pwa-org.netlify.app/guide/). See [verification](docs/pwa-verification.md) for the checks performed and remaining limits.

## Project files

- `src/App.tsx`: new GGS foundation screen.
- `src/TrialApp.tsx`: preserved earlier comparison prototype.
- `src/components/PwaStatus.tsx`: installation, connection and update prompts.
- `src/content/` and `src/learning/`: existing prototype content and session engine.
- `vite.config.ts`: base path, manifest and offline cache configuration.
- `scripts/generate-icons.py`: dependency-free PNG assets from the vector brand mark.

Reference books inform original authored explanations; their content is not bundled into this repository.
