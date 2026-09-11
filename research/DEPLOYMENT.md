# Deployment

Live: https://balloon-fight-zyra.netlify.app/
Netlify site: 92e04975-9c31-4b98-ab8a-8adf77b0266f
First production deploy: 6aa3a3d80c69a4c65c3bf8d8
Build: npm run build
Publish: npx netlify-cli deploy --prod --dir dist --no-build
This project is linked locally through ignored .netlify/state.json. Authentication remains outside the repository. On this Windows host, NODE_USE_SYSTEM_CA=1 uses the system certificate store for CLI connections.

Final production deploy: 6aa3a4f247dd39ffc0f18714. Published HTML and all static assets verified against local SHA-256 hashes. Live Start/Space/Pause/Back to title passed with sound off and no captured warnings/errors.
