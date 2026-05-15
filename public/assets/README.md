# Crush Guesser asset drop folder

The prototype is now wired to prefer the source art folder at `assets/source_assets` when those files exist. CSS placeholders remain in place as a fallback so the app still runs before every filename is finalized.

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

If the uploaded filenames differ, update `src/assetManifest.js` instead of editing the rendering/state-machine code.
