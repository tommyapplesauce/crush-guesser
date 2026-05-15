# Crush Guesser source asset notes

The prototype is wired to load the temporary art from `assets/source_assets`. CSS placeholders remain as a fallback if a file is missing while filenames are still being finalized.

## Expected source layout

```text
assets/source_assets/
  backgrounds/
    view-1-school-hallway.PNG
    view-2-locker-closed-lock-on.PNG
    view-3-locker-closed-lock-off.PNG
    view-4-locker-open.PNG
    view-5-trapper-keeper-closed.PNG
    view-6-trapper-keeper-open.PNG
  hand with paper/
    hand-with-paper-hallway.PNG
    hand-with-paper-locker.PNG
    hand-with-paper-trapper-keeper.PNG
  lock/
    lock-body.PNG
    lock-on.PNG
    lock-open.PNG
  Dial/
    tk-dial-0.PNG
    ...
    tk-dial-9.PNG
    perspective/
      dial-1/dial-1-0.PNG
      ...
      dial-17/dial-17-9.PNG
```

If the uploaded filenames differ, update `src/assetManifest.js` instead of editing the rendering/state-machine code.
