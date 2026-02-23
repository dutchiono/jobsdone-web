# jobsdone-web

Static site for jobsdone.team

## Structure

- `/launch` — Token launch page for crypto/web3 audience
- `/onboard` — Small business onboarding page (Variant A: clean/minimal)
- `/onboard-v2` — Small business onboarding page (Variant B: warm/bold)

## Deployment

Auto-deploys to `198.71.54.203` on push to `main` via GitHub Actions.

### GitHub Secrets Required

| Secret | Value |
|---|---|
| `SERVER_PASSWORD` | Password for `team` user on server |
| `GITHUB_ORG` | GitHub org or username this repo lives under |

## Token name

Search and replace `$JOBSDONE` across all files to update the ticker.
