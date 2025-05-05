# Collect.io

A fun color collection game where you control a square to collect colorful tiles and change your color!

## How to Play

1. Use the joystick in the bottom-left corner to control your square
2. Collect colored squares to change your color and increase your score
3. Try to collect as many squares as possible!

## Offline Support

The game includes a service worker that enables offline play. Once you visit the game:
1. All game files will be cached in your browser
2. You can play the game without an internet connection
3. The game will work even if you close and reopen your browser

## Hosting

You can host the game on any static file hosting service:
- GitHub Pages
- Netlify
- Vercel
- Amazon S3
- Any web hosting service that supports static files

Simply upload these files to your hosting service:
- `index.html`
- `styles.css`
- `game.js`
- `sw.js`
- `manifest.json`

## Files

- `index.html` - Main game file
- `styles.css` - Game styling
- `game.js` - Game logic
- `sw.js` - Service worker for offline support
- `manifest.json` - Web app manifest

## Controls

- Use the joystick to move your square
- Collect colored squares to change your color
- Your score increases with each collection

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Service workers must be supported (most modern browsers) 