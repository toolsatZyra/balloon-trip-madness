# Deployment

Live: https://balloon-fight-zyra.netlify.app/
Netlify site: 92e04975-9c31-4b98-ab8a-8adf77b0266f
First production deploy: 6aa3a3d80c69a4c65c3bf8d8
Build: npm run build
Publish: npx netlify-cli deploy --prod --dir dist --no-build
This project is linked locally through ignored .netlify/state.json. Authentication remains outside the repository. On this Windows host, NODE_USE_SYSTEM_CA=1 uses the system certificate store for CLI connections.

Current production deploy: 6aa3ca46bfa1ed1eafaedf2b, September 11, 2026. Local game commit: 67d2052. Includes the 10% larger balloonist with matching collision bounds, full-height bouncing stars after eight seconds, and eased 8% star-speed increases every 15 seconds with visible levels. All eight published files matched local SHA-256 hashes. Live Start/Space/Pause passed with sound off and no captured warnings/errors; the enlarged character and level HUD rendered correctly. All 16 simulation tests pass. This repository currently has no GitHub remote.

September 11 counter update: current production deploy is 6aa3cf6fdc425b466568563a (supersedes the gameplay deployment above). Includes the shared games-played label and counter function, with no explanatory note or icon. All 23 tests pass; all eight published static files match the build. Preview storage checks verified eight concurrent loads and duplicate-retry protection. Local game commit 5193d7e. No GitHub remote is configured.

## GitHub and Vercel handoff

Repository: https://github.com/toolsatZyra/balloon-trip-madness, main branch. This supersedes the earlier no-remote notes. Vercel configuration is committed in vercel.json with Vite, npm run build, and dist. The user will create and connect the Vercel project. All 23 tests and the production build passed for this handoff; the existing counter API returned HTTP 200 with CORS enabled for access from Vercel. No counter increment was made by that API read. No Vercel project was provisioned by the agent.
