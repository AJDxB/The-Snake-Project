# Snake — Rounds Mode

A simple browser-based Snake game inside a bounded 500x500 playfield with 10 rounds and per-round apple targets.

Features
- 500x500 pixel canvas, solid walls
- Apples to eat, score shown in the top-right HUD
- 10 rounds total
  - Round 1 target: 10 apples
  - Each subsequent round target adds +5 apples (15, 20, ..., 55)
- Win a round by reaching the target; then advance automatically
- Lose if you hit a wall or yourself (retry the current round)
- Controls: Arrow Keys or WASD
- Space: Start game / Next round / Retry round
- R: Restart the entire game (from Round 1)

How to run
1. Open the `index.html` file in your browser (double-click it or drag it into Chrome/Edge/Firefox).
2. Press Space to start, then Space to start each round or continue after crash/round complete.

Notes
- Movement speed increases slightly each round.
- The HUD shows: Round N and Apples: current/target.

Troubleshooting
- If apples or snake look blurry, ensure browser zoom is 100% and that your window is wide enough to fit the 500x500 canvas.
- If keyboard input doesn’t work, click once on the page to focus it.
