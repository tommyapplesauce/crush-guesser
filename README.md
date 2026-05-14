# Crush Guesser

A playable web prototype for a nostalgic high-school locker mystery that disguises a name-reconstruction logic trick as a secret crush case file.

## What is implemented

- Mobile-first static web app with no build dependency required.
- Hallway/title scene, name-length note, centered locker scene, locker clue rows, open-locker beat, Trapper Keeper clue rows, round-lock beat, and final name reveal.
- Core puzzle logic is separated from presentation in `src/crushLogic.js`.
- Game state names are centralized in `src/gameStates.js`.
- Logic tests cover MARIA, ZOE, ANA, padding behavior, and length edge cases.

## Run locally

```bash
npm start
```

Then open <http://localhost:4173>.

## Test

```bash
npm test
```

## Temporary/final assets

The current prototype uses CSS placeholder art so the game is playable before final assets are wired in. The easiest way to add your Google Drive/mockup assets is to place exported images in a repository folder such as `public/assets/` or `src/assets/`, then replace the CSS placeholder hallway, locker, paper, and Trapper Keeper layers with those files.

Recommended names:

- `hallway.png`
- `hands-paper.png`
- `locker-closeup.png`
- `locker-open.png`
- `trapper-keeper-closed.png`
- `trapper-keeper-open.png`
- `combo-lock.png`
- `paper-texture.png`

## Version 1 limitations

- Supports letters A-Z only.
- Name length must be 1-26.
- Spaces, hyphens, accents, and Ñ are not supported yet.
