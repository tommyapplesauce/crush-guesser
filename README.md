# Crush Guesser

A playable web prototype for a nostalgic high-school locker mystery that disguises a name-reconstruction logic trick as a secret crush case file.

## What is implemented

- Mobile-first static web app with no build dependency required.
- Mockup-inspired visual shell with a warm locker interior, pixel RPG-style dialogue box, torn lined-paper interaction area, Trapper Keeper prop, and combination wheel overlays.
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

The current prototype uses CSS placeholder art based on the supplied mockups so the game is playable before final assets are wired in. The easiest way to add your separated assets is to place exported images in a repository folder such as `public/assets/` or `src/assets/`, then replace the CSS placeholder locker interior, dialogue box, paper, Trapper Keeper, and lock layers with those files.

Recommended names:

- `locker-interior.png`
- `dialogue-box.png`
- `torn-lined-paper.png`
- `trapper-keeper-closed.png`
- `trapper-keeper-open.png`
- `side-combo-lock.png`
- `combo-wheel.png`

## Version 1 limitations

- Supports letters A-Z only.
- Name length must be 1-26.
- Spaces, hyphens, accents, and Ñ are not supported yet.
