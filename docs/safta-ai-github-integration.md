# Safta AI GitHub project intelligence

## What it does

Safta AI can list likely portfolio repositories owned by saftanasdalihin, inspect a bounded set of repository files, summarize README/source evidence, compare likely projects, and link answers to exact files and commits. It uses a heuristic ranking based on observable repository signals. It is not an audit, does not run repository code, and cannot prove a contract is safe.

The project index is cached in Upstash Redis for six hours; owned-repository metadata is cached for one hour. The index analyzes at most eight relevant repositories per refresh to limit latency and API use. Repository analyses are cached by repository name and commit SHA.

## Deployment environment

Configure these variables in the deployment environment:

- GEMINI_API_KEY: the existing Gemini API key.
- UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN: the existing Upstash Redis configuration used by rate limiting and the project cache.
- GITHUB_TOKEN: recommended fine-grained GitHub personal access token with read-only Metadata and Contents access to public repositories only. This is a public chatbot, so private repositories are excluded even if the token can access them. Without a token, public repositories remain available under lower unauthenticated GitHub API limits.
- SAFTA_SYNC_SECRET: a long random secret protecting the manual project-index refresh endpoint.

Do not commit actual secrets, put them in client-side code, or give the GitHub token write/admin permissions.

## Manual project-index refresh

Send a POST request to /api/github/sync with an Authorization header containing Bearer <SAFTA_SYNC_SECRET>. It forces a fresh bounded index and returns the project names, heuristic scores, and analyzed commit SHAs. Never expose the secret in browser code. The endpoint returns HTTP 503 until SAFTA_SYNC_SECRET is configured on the server.

Example from a trusted terminal:

    curl --fail --show-error -X POST "https://saftanasdalihin-site.vercel.app/api/github/sync" \
      -H "Authorization: Bearer $SAFTA_SYNC_SECRET" \
      -H "Content-Type: application/json" \
      --data '{}'

## Behavior and limitations

- Repository content is treated as untrusted input and is never executed.
- Private repositories, forks, archived repositories, the portfolio site, and known course/contest repositories are excluded from the candidate ranking.
- At most 12 relevant text files of at most 60 KB each are read from any one repository during a scan.
- The current index is limited to eight candidate repositories per refresh. A repo can be omitted because it is outside the candidate heuristic or GitHub access failed.
- A detected test file is not proof that tests passed. Current workflow-run evidence is fetched separately when available.
- Heuristic scores may be affected by naming, repository layout, and README wording. Use cited source files and stated limitations, not score alone, to judge project quality.
