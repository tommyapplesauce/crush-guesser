# Crush Guesser

A playable web prototype for a nostalgic high-school locker mystery that disguises a name-reconstruction logic trick as a secret crush case file.

## What is implemented

- Mobile-first static web app with no build dependency required.
- Mockup-inspired visual shell with a warm locker interior, pixel RPG-style dialogue box, animated hands-with-paper layer, Trapper Keeper prop, and combination wheel overlays.
- Source-asset manifest for `assets/source_assets` backgrounds, hand-paper frames, locker lock pieces, and 17 perspective Trapper Keeper dials.
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

The current prototype uses CSS placeholder art based on the supplied mockups so the game is playable before final assets are wired in. It now also attempts to load source images from `assets/source_assets` through `src/assetManifest.js`. If a filename differs from the expected names, update the manifest rather than the scene logic.

Expected source groups:

- `backgrounds/` for view 1 through view 6.
- `hand with paper/` for the three hands-holding-paper frames.
- `lock/` for the locker lock body, on state, and popped-open state.
- `Dial/` and `Dial/perspective/` for the main dial and 17 perspective dial slots.

## Version 1 limitations

- Supports letters A-Z only.
- Name length must be 1-26.
- Spaces, hyphens, accents, and Ñ are not supported yet.
