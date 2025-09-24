# The Snake Project

A modern browser-based Snake game featuring a rounds-based gameplay system with progressive difficulty. Built with vanilla HTML5, CSS3, and JavaScript for optimal performance and compatibility.

## 🎮 Game Description

Experience the classic Snake game reimagined with a structured rounds system! Navigate your snake within a bounded 500x500 pixel arena, collecting apples to grow and score points across 10 challenging rounds.

## ✨ Features

- **Progressive Difficulty**: 10 rounds with increasing apple targets
  - Round 1: 10 apples to advance
  - Each subsequent round adds +5 apples (15, 20, 25, ..., up to 55 in Round 10)
- **Bounded Gameplay**: 500x500 pixel canvas with solid walls - no wrapping!
- **Real-time HUD**: Live scoring display in the top-right corner
- **Smooth Controls**: Responsive Arrow Keys or WASD movement
- **Multiple Game States**: Start, pause, retry, and restart functionality
- **Modern UI**: Dark theme with clean, professional styling
- **Browser Compatible**: Works in all modern browsers without plugins

## 🎯 How to Win

Complete all 10 rounds by reaching each round's apple target. Speed increases slightly with each round for added challenge!

## 🕹️ Controls

| Key | Action |
|-----|--------|
| ↑↓←→ or WASD | Move snake |
| Space | Start game / Continue after crash / Advance to next round |
| P | Pause/Resume during active gameplay |
| R | Restart entire game (return to start screen) |

## 🚀 How to Play

### Option 1: Local Play
1. Download or clone this repository
2. Open `index.html` in your web browser (double-click or drag into Chrome/Edge/Firefox)
3. Press Space to start your first round
4. Use arrow keys or WASD to guide your snake
5. Collect red apples to grow and score points
6. Complete each round by reaching the target apple count

### Option 2: Play Online
Visit the live version hosted on GitHub Pages: [Play Now](https://ajdxb.github.io/The-Snake-Project/)

## 💡 Game Tips

- Plan your path carefully - you can't reverse direction instantly
- Use the pause feature (P key) if you need a moment to strategize
- Watch the HUD to track your progress toward each round's target
- Speed increases each round, so stay focused!

## 🔧 Technical Details

- **Pure Vanilla JavaScript**: No frameworks or dependencies
- **HTML5 Canvas**: Smooth 60 FPS rendering
- **Responsive Design**: Optimized for desktop browsers
- **Grid-based Movement**: 20px cells for precise control
- **Cross-browser Compatible**: Works on Chrome, Firefox, Safari, Edge

## 📁 Project Structure

```
The-Snake-Project/
├── index.html      # Main game page
├── style.css       # Game styling and UI
├── main.js         # Game logic and controls
└── README.md       # This file
```

## 🛠️ Troubleshooting
- If apples or snake look blurry, ensure browser zoom is 100% and that your window is wide enough to fit the 500x500 canvas.
- If keyboard input doesn’t work, click once on the page to focus it.

## 🎨 Customization

The game uses CSS custom properties for easy theming. Feel free to modify colors, fonts, or layout in `style.css`.

## 📜 License

This project is open source. Feel free to fork, modify, and share!

## 🐍 Enjoy the Game!

Challenge yourself to complete all 10 rounds and achieve Snake mastery! 

---
*Built with ❤️ by AJDxB*