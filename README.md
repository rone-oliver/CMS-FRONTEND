# Frontend (Angular)

This is the Angular frontend for the CMS. It uses Angular CLI 20.

## Prerequisites

- Node.js and npm installed
- Angular CLI (optional, scripts use the local CLI)

## Setup

```bash
# from repo root
cd frontend
npm install
```

## Running (dev server)

```bash
npm start
```

- Opens at http://localhost:5201/
- Reloads automatically on source changes

## Available scripts (from `package.json`)

```json
{
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "lint": "ng lint",
  "lint:fix": "ng lint --fix"
}
```

Common usage:

- Build (production): `npm run build` → outputs to `dist/`
- Watch build (dev): `npm run watch`
- Unit tests: `npm test`
- Lint: `npm run lint`
- Lint with fixes: `npm run lint:fix`

## Environments

Angular environment files live in `src/environments/`:

- `environment.ts` (development)
- `environment.prod.ts` (production)

Use `ng build --configuration production` (used by `npm run build`) for production settings.

## Code scaffolding (optional)

You can generate code via Angular CLI:

```bash
npx ng generate component my-feature
npx ng generate service my-service
```

Run `npx ng generate --help` for more schematics.

## Testing

- Unit tests use Karma/Jasmine: `npm test`
- No e2e setup by default; choose and configure your preferred e2e framework as needed.

## Linting & formatting

- ESLint + Angular ESLint are configured. Run `npm run lint`.
- Prettier is configured for templates (see `prettier` overrides in `package.json`).

## Project structure

- App code in `src/app/`
- Static assets in `src/assets/`

## Author & metadata

- Author: Antony Rone Oliver
- Contact: roneootan611@gmail.com
- License: MIT

---

## License

This project is licensed under the MIT License. See the `LICENSE` file at the repository root for full text.

---

For more CLI details, see the Angular CLI docs: https://angular.dev/tools/cli
