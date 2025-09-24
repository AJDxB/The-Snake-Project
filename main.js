// Snake: Rounds Mode
// Contract:
// - 500x500 canvas play area, bounded walls.
// - Apples to eat; score is apples eaten this round.
// - 10 rounds total. Win a round by eating N apples.
//   Round 1 target = 10, each next round adds +5 apples.
// - HUD top-right shows "Apples: x / target" and "Round n".
// - Controls: Arrow keys or WASD. No 180-degree reversals.
// - Space: Start game / Next round / Retry round (contextual)
// - R: Restart the entire game (from Round 1) immediately
// - On death (hit wall or self), show overlay to retry or restart.
// - After meeting round target, show overlay to go to next round.

(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const roundLabel = document.getElementById('roundLabel');
  const scoreLabel = document.getElementById('scoreLabel');

  // Grid settings
  const CANVAS_SIZE = 500; // px
  const CELL = 20; // px cell size for crisp movement; 500/20 = 25 cells per side
  const COLS = CANVAS_SIZE / CELL; // 50
  const ROWS = CANVAS_SIZE / CELL; // 50

  // Game pacing
  const BASE_SPEED_FPS = 10; // moves per second base
  const SPEED_INCREMENT_PER_ROUND = 1; // add 1 FPS per round for mild difficulty scaling

  // Rounds
  const TOTAL_ROUNDS = 10;
  const ROUND1_TARGET = 10;
  const ROUND_TARGET_INCREMENT = 5;

  // Game state
  let state = {
    tickMs: 1000 / BASE_SPEED_FPS,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    snake: [], // array of {x, y} cells; head is at index 0
    apple: null, // {x, y}
    scoreThisRound: 0,
    roundIndex: 0, // 0-based
    running: false,
    lastTick: 0,
    pendingGrowth: 0,
    finishedAllRounds: false,
  };

  // Tracks the current overlay's primary action for Spacebar
  let currentOverlayAction = null;
  // Track overlay context to control pause behavior
  // Possible values: 'start' | 'roundIntro' | 'pause' | 'crash' | 'roundWin' | 'finalWin' | null
  let overlayContext = null;

  function roundTarget(roundIndex) {
    return ROUND1_TARGET + ROUND_TARGET_INCREMENT * roundIndex;
  }

  function setHUD() {
    const roundNo = state.roundIndex + 1;
    roundLabel.textContent = `Round ${roundNo}`;
    scoreLabel.textContent = `Apples: ${state.scoreThisRound} / ${roundTarget(state.roundIndex)}`;
  }

  function showOverlay(title, subtitle, spaceHint, showButton, buttonText, buttonHandler) {
    overlay.classList.remove('hidden');
    overlay.innerHTML = `
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle || ''}</div>
      <div class="help">Controls: Arrow Keys or WASD</div>
      <div class="help">Press Space to ${spaceHint}. Press R to Restart Game.</div>
      ${showButton ? `<button id=\"overlayBtn\" class=\"button\">${buttonText}</button>` : ''}
    `;
    if (showButton) {
      const btn = document.getElementById('overlayBtn');
      btn.addEventListener('click', buttonHandler);
    }
    // Remember the action for Spacebar
    currentOverlayAction = buttonHandler || null;
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    currentOverlayAction = null;
    overlayContext = null;
  }

  function setupRound(roundIdx) {
    // Initialize round state without showing overlays
    state.roundIndex = roundIdx;
    state.scoreThisRound = 0;
    state.tickMs = 1000 / (BASE_SPEED_FPS + SPEED_INCREMENT_PER_ROUND * roundIdx);
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };

    // Start snake length 5 at center
    const startX = Math.floor(COLS / 2);
    const startY = Math.floor(ROWS / 2);
    state.snake = [];
    for (let i = 0; i < 5; i++) {
      state.snake.push({ x: startX - i, y: startY });
    }
    state.pendingGrowth = 0;
    state.apple = spawnApple();
    state.running = false;
    setHUD();
  }

  function initRound(roundIdx) {
    // Prepare and show round intro overlay; Space/Click starts immediately
    setupRound(roundIdx);
    showOverlay(
      `Round ${roundIdx + 1}`,
      `Eat ${roundTarget(roundIdx)} apples to advance`,
      'Start Round',
      true,
      'Start Round (Space)',
      () => {
        hideOverlay();
        resume();
      }
    );
    overlayContext = 'roundIntro';
  }

  function resume() {
    state.running = true;
    state.lastTick = performance.now();
    requestAnimationFrame(loop);
  }

  function pause() {
    state.running = false;
  }

  function loop(now) {
    if (!state.running) return;

    const elapsed = now - state.lastTick;
    if (elapsed >= state.tickMs) {
      state.lastTick = now;
      update();
      draw();
    }
    requestAnimationFrame(loop);
  }

  function update() {
    // Prevent 180-degree reversal: only accept nextDirection if it's not opposite
    const d = state.direction;
    const nd = state.nextDirection;
    if (!(d.x === -nd.x && d.y === -nd.y)) {
      state.direction = nd;
    }

    // Move head
    const head = { ...state.snake[0] };
    head.x += state.direction.x;
    head.y += state.direction.y;

    // Collisions with walls (bounded 1000x1000 means walls are solid)
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      return onDeath();
    }

    // Collisions with self
    for (let i = 0; i < state.snake.length; i++) {
      const seg = state.snake[i];
      if (seg.x === head.x && seg.y === head.y) {
        return onDeath();
      }
    }

    // Add new head
    state.snake.unshift(head);

    // Apple eaten?
    if (state.apple && head.x === state.apple.x && head.y === state.apple.y) {
      state.scoreThisRound += 1;
      setHUD();
      state.pendingGrowth += 1; // grow by 1 per apple
      state.apple = spawnApple();

      // Round completed?
      if (state.scoreThisRound >= roundTarget(state.roundIndex)) {
        onRoundWin();
        return;
      }
    }

    // Handle tail (growth)
    if (state.pendingGrowth > 0) {
      state.pendingGrowth -= 1; // keep tail (grow)
    } else {
      state.snake.pop(); // move: remove tail
    }
  }

  function onDeath() {
    pause();
    showOverlay(
      `You crashed!`,
      `Round ${state.roundIndex + 1}: You ate ${state.scoreThisRound} / ${roundTarget(state.roundIndex)} apples`,
      'Retry Round',
      true,
      'Retry Round (Space)',
      () => {
        hideOverlay();
        setupRound(state.roundIndex);
        resume();
      }
    );
    overlayContext = 'crash';
  }

  function onRoundWin() {
    pause();
    const next = state.roundIndex + 1;
    if (next >= TOTAL_ROUNDS) {
      state.finishedAllRounds = true;
      showOverlay(
        `You won all ${TOTAL_ROUNDS} rounds!`,
        `Final round target was ${roundTarget(state.roundIndex)} apples. Great job!`,
        'Play Again',
        true,
        'Play Again (Space)',
        () => {
          hideOverlay();
          setupRound(0);
          resume();
        }
      );
      overlayContext = 'finalWin';
    } else {
      showOverlay(
        `Round ${state.roundIndex + 1} complete!`,
        `Next round target: ${roundTarget(next)} apples`,
        'Next Round',
        true,
        'Start Next Round (Space)',
        () => {
          hideOverlay();
          setupRound(next);
          resume();
        }
      );
      overlayContext = 'roundWin';
    }
  }

  function spawnApple() {
    // Avoid spawning on the snake
    const occupied = new Set(state.snake.map(c => `${c.x},${c.y}`));
    let x, y;
    let attempts = 0;
    const maxAttempts = 5000;
    do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
      attempts++;
      if (attempts > maxAttempts) break; // fallback safety
    } while (occupied.has(`${x},${y}`));
    return { x, y };
  }

  function draw() {
    // clear
    ctx.fillStyle = '#0b0c12';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // draw border
    ctx.strokeStyle = '#2a2a31';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2);

    // draw apple
    if (state.apple) {
      drawCell(state.apple.x, state.apple.y, '#ff6b6b');
      // apple highlight
      ctx.strokeStyle = '#ffd6d6';
      ctx.lineWidth = 1;
      ctx.strokeRect(state.apple.x * CELL + 2, state.apple.y * CELL + 2, CELL - 4, CELL - 4);
    }

    // draw snake
    for (let i = 0; i < state.snake.length; i++) {
      const seg = state.snake[i];
      const isHead = i === 0;
      drawCell(seg.x, seg.y, isHead ? '#6cf08a' : '#41d37a');
      if (isHead) {
        // tiny face indicator
        ctx.fillStyle = '#0f0f12';
        const cx = seg.x * CELL + CELL / 2;
        const cy = seg.y * CELL + CELL / 2;
        ctx.beginPath();
        ctx.arc(cx - 4, cy - 3, 2, 0, Math.PI * 2);
        ctx.arc(cx + 4, cy - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawCell(cx, cy, color) {
    ctx.fillStyle = color;
    ctx.fillRect(cx * CELL, cy * CELL, CELL, CELL);
  }

  function showStartOverlay() {
    // Show the initial start screen; Space will begin Round 1
    showOverlay(
      'Snake — Rounds Mode',
      `10 rounds. Round 1 target: ${ROUND1_TARGET} apples, +${ROUND_TARGET_INCREMENT} each round.`,
      'Start',
      true,
      'Start (Space)',
      () => {
        hideOverlay();
        setupRound(0);
        resume();
      }
    );
    overlayContext = 'start';
  }

  function restartGame() {
    // Return to the start overlay instead of auto-starting gameplay
    pause();
    showStartOverlay();
  }

  // Input
  window.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        state.nextDirection = { x: 0, y: -1 };
        e.preventDefault();
        break;
      case 'arrowdown':
      case 's':
        state.nextDirection = { x: 0, y: 1 };
        e.preventDefault();
        break;
      case 'arrowleft':
      case 'a':
        state.nextDirection = { x: -1, y: 0 };
        e.preventDefault();
        break;
      case 'arrowright':
      case 'd':
        state.nextDirection = { x: 1, y: 0 };
        e.preventDefault();
        break;
      case ' ': // Spacebar: perform current overlay primary action
        if (!overlay.classList.contains('hidden') && typeof currentOverlayAction === 'function') {
          currentOverlayAction();
          e.preventDefault();
        }
        break;
      case 'p': { // Pause/resume only during active play (not on crash/win overlays)
        const overlayVisible = !overlay.classList.contains('hidden');
        if (!overlayVisible && state.running) {
          // Pause and show pause overlay
          pause();
          showOverlay(
            'Paused',
            'Game is paused',
            'Resume',
            true,
            'Resume',
            () => {
              hideOverlay();
              resume();
            }
          );
          overlayContext = 'pause';
          e.preventDefault();
        } else if (overlayVisible && overlayContext === 'pause') {
          // Resume if currently in pause overlay
          hideOverlay();
          resume();
          e.preventDefault();
        }
        break;
      }
      case 'r': // Restart whole game immediately
        restartGame();
        e.preventDefault();
        break;
      default:
        break;
    }
  });

  // Initial draw and show start overlay
  draw();
  showStartOverlay();
})();
