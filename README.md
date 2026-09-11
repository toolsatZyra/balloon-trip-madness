# Balloon Fight — Back in the air

A separate browser fan recreation of **C — Balloon Trip**, the survival mode in Nintendo's Balloon Fight. Smooth, newly drawn red balloons, cap, blue outfit, animated arms, a midnight sea, and glowing lightning sparks preserve the recognizable visual idea. This is an independently rebuilt game, not an emulator or an exact reproduction of the NES program. Nintendo created the original game and character; no ROM, ripped sprites, original music, or original source code is bundled.

## Run

Requires Node 22.12+ or 24. `npm ci`, then `npm run dev` (http://127.0.0.1:4182). `npm test` checks simulation behavior. `npm run build` creates `dist`; `npm run preview` serves it on 4183. Vercel's Vite preset and Netlify can serve the static output without environment variables or a backend.

## Play

- Left/right or A/D accelerate horizontally. Releasing preserves drift; opposite input brakes before reversing.
- Tap Space, Up, W, or Z to flap. Hold X or the touch FLAP control for repeated flaps. Gravity gradually brings you down.
- Collect green balloons for 100 points. Twenty consecutive balloons give 1,000 extra points. Missing a balloon resets the chain after it leaves the screen.
- The course travels from left to right across the screen, so you advance toward the left, matching Balloon Trip.
- Avoid moving sparks and the sea. A ripple warns before a fish attacks a player lingering near the surface.
- Collect a bubble for 200 points and three seconds without world scrolling. You and the sparks can still move.
- P/Escape pauses. Losing focus or resizing pauses automatically. Start a fresh randomized sky or retry the same seed from the result panel.
- Sound is off until explicitly enabled. Effects are newly synthesized; original music is not reproduced.

## Implementation

Phaser 3 + Vite. Simulation is separate from the renderer at a fixed 120 Hz. Smooth canvas artwork is created at four times its displayed size, then animated as reused textures. DPR is capped at 2. Entity counts are bounded by recycling off-screen columns. DOM menus, local fonts, keyboard and multi-touch inputs, separate local best-score storage, and reduced-motion styling are included. Courses have reserved safe bands; hazard motion is continuous and bounded. The specific physics constants, safe-band generation, progression, and fish timing are this recreation's design choices, not reverse-engineered NES code.

## References and attribution

- [Nintendo manual](https://www.nintendo.co.jp/clv/manuals/en/pdf/CLV-P-NAARE_en.pdf): controls, C Balloon Trip, sparks, 20-balloon streak, water and fish.
- [Nintendo's interview with Yoshio Sakamoto](https://www.nintendo.com/en-gb/News/2016/November/Nintendo-Classic-Mini-NES-special-interview-Volume-2-Balloon-Fight-1154453.html): Balloon Trip's origins, two balloons, and bubbles stopping scrolling so players can go back.
- [Still screenshot reviewed](https://videochums.com/review/balloon-fight-3.jpg): original silhouette, dark sea, collectible balloons and spark presentation. Used as a visual reference; not shipped as an asset.
- [Phaser](https://phaser.io): MIT licensed, license included in installed package. [Vite](https://vite.dev): MIT. DM Sans fonts: SIL OFL, included beside local fonts.

## Verification and limits

13 simulation tests pass, including acceleration/braking, retained drift, additive lift, collision with either balloon, sea, fish warning, score and streak, bubble behavior, seed reproducibility, and safe-band bounds. Desktop browser run survived 35 seconds and collected eight balloons, with sound off and no captured console warnings/errors. Desktop and 390×844 title layouts reviewed visually. Browser keyboard start/pause/resume reviewed. Physical touch hardware and audible sound have not been reviewed. Phaser's production bundle produces Vite's size advisory; this is not a build failure.

Developer-only `?verify=1` exposes a 35-second controller run, release button, and braking check. Controls are removed from production builds. The reconstruction covers Balloon Trip only, not the original A/B combat modes or two-player mode.

Play online: https://balloon-fight-zyra.netlify.app/

