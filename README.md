# jobsdone-web

Static site for jobsdone.team built with Vite.

## Structure

- `index.html` — Token launch page for crypto/web3 audience
- `onboard.html` — Small business onboarding page (Variant A: clean/minimal)
- `onboard-v2.html` — Small business onboarding page (Variant B: warm/bold)
- `src/styles/` — CSS stylesheets

## Development

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

Builds to `dist/` directory.

## Deployment

Auto-deploys to `198.71.54.203` on push to `main` via GitHub Actions.

### GitHub Secrets Required

| Secret | Value |
|---|---|
| `SERVER_HOST` | Server hostname/IP |
| `SERVER_USER` | SSH username |
| `SERVER_PASSWORD` | Password for SSH user |

## Token name

Search and replace `$JOBS` across all files to update the ticker.
