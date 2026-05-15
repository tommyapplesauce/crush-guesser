# Crush Guesser

A playable web prototype for a nostalgic high-school locker mystery that disguises a name-reconstruction logic trick as a secret crush case file.

## What is implemented

- Mobile-first static web app with no build dependency required.
- Mockup-inspired visual shell with a title paper, pixel RPG-style narration/dialogue box, animated hands-with-paper layer, locker lock overlay, Trapper Keeper prop, and combination wheel overlays.
- Source-asset manifest for `assets/source_assets` backgrounds, hand-paper frames, locker lock pieces, large Trapper Keeper dials, and 17 perspective Trapper Keeper dials.
- Name-length slider is capped at 17 to match the available Trapper Keeper dial assets.
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

## GitHub Pages / static hosting note

If the app is hosted from a repository subpath such as `https://username.github.io/crush-guesser/`, keep script and stylesheet links relative (`./src/main.js`, `./src/styles.css`). Browser network statuses like `200` and `304` are normal successful responses; the app is only failing if the console shows red JavaScript errors, MIME-type errors, or `404` missing files.

## Temporary/final assets

The current prototype uses CSS placeholder art based on the supplied mockups so the game is playable before final assets are wired in. It now also attempts to load source images from `assets/source_assets` through `src/assetManifest.js`. The manifest includes fallback variants for common folder casing/spacing and PNG/png mismatches. If a filename still differs, update the manifest rather than the scene logic.

Expected source groups:

- `backgrounds/` for `view-1-school-hallway.PNG` through `view-6-trapper-keeper-open.PNG`.
- `hand-with-paper/` for `hand-with-paper-hallway.PNG`, `hand-with-paper-locker.PNG`, and `hand-with-paper-trapper-keeper.PNG`.
- `lock/` for the locker lock body-on, body-off, and rotating dial.
- `dial/` and `dial/perspective/` for `tk-dial-0.PNG` through `tk-dial-9.PNG` and 17 perspective dial slots.

## Version 1 limitations

- Supports letters A-Z only.
- Name length is capped at 1-17 in the UI for the current dial assets, while the core logic still supports 1-26.
- Spaces, hyphens, accents, and Ñ are not supported yet.

## Codex PR workflow

For a Codex-owned branch, let Codex make follow-up commits and open the next PR from the current repository state. If the branch is edited manually on GitHub, start a new Codex PR instead of trying to update the old one.
