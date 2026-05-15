# Crush Guesser asset drop folder

The prototype is now wired to prefer the source art folder at `assets/source_assets` when those files exist. CSS placeholders remain in place as a fallback so the app still runs before every filename is finalized.

## Expected source layout

```text
assets/source_assets/
  backgrounds/
    view-1-school-hallway.png
    view-2-locker-locks.png
    view-3-locker-lock-off.png
    view-4-locker-open.png
    view-5-trapper-keeper.png
    view-6-trapper-keeper-open.png
  hand with paper/
    hand-paper-1.png
    hand-paper-2.png
    hand-paper-3.png
  lock/
    lock-body.png
    lock-on.png
    lock-open.png
  Dial/
    main-dial.png
    perspective/
      dial-1/dial-1.png
      ...
      dial-17/dial-17.png
```

If the uploaded filenames differ, update `src/assetManifest.js` rather than editing the rendering code.
