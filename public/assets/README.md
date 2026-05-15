# Crush Guesser source asset notes

The prototype is wired to load the temporary art from `assets/source_assets`. CSS placeholders remain as a fallback if a file is missing while filenames are still being finalized.

## Expected source layout

```text
assets/source_assets/
  backgrounds/
    view-1-school-hallway.PNG
    view-2-locker-closed-lock-on.PNG
    view-3-locler-closed-lock-off.PNG
    view-4-locker-open.PNG
    view-5-trapper-keeper-closed.PNG
    view-6-trapper-keeper-open.PNG
  hand-with-paper/
    hand-with-paper-hallway.PNG
    hand-with-paper-locker.PNG
    hand-with-paper-trapper-keeper.PNG
  lock/
    locker-lock-body-off.PNG
    locker-lock-body-on.PNG
    locker-lock-dial.PNG
  dial/
    tk-dial-0.PNG
    ...
    tk-dial-9.PNG
    perspective/
      Dial-1/dial-1-0.PNG
      ...
      Dial-17/dial-17-9.PNG
```

The manifest includes common fallback variants for legacy folder casing/spacing and PNG/png extensions. If the browser still logs `Missing Crush Guesser asset`, update `src/assetManifest.js` with the exact path shown in your checkout instead of editing the rendering/state-machine code.
