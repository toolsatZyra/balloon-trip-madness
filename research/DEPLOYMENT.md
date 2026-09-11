# Deployment

Live: https://balloon-fight-zyra.netlify.app/
Netlify site: 92e04975-9c31-4b98-ab8a-8adf77b0266f
First production deploy: 6aa3a3d80c69a4c65c3bf8d8
Build: npm run build
Publish: npx netlify-cli deploy --prod --dir dist --no-build
This project is linked locally through ignored .netlify/state.json. Authentication remains outside the repository. On this Windows host, NODE_USE_SYSTEM_CA=1 uses the system certificate store for CLI connections.

Current production deploy: 6aa3ca46bfa1ed1eafaedf2b, September 11, 2026. Local game commit: 67d2052. Includes the 10% larger balloonist with matching collision bounds, full-height bouncing stars after eight seconds, and eased 8% star-speed increases every 15 seconds with visible levels. All eight published files matched local SHA-256 hashes. Live Start/Space/Pause passed with sound off and no captured warnings/errors; the enlarged character and level HUD rendered correctly. All 16 simulation tests pass. This repository currently has no GitHub remote.
