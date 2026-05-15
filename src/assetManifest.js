const SOURCE_ROOT = "assets/source_assets";

export const ASSETS = Object.freeze({
  backgrounds: {
    view1Hallway: assetPath("backgrounds/view-1-school-hallway.png"),
    view2LockerLocks: assetPath("backgrounds/view-2-locker-locks.png"),
    view3LockerLockOff: assetPath("backgrounds/view-3-locker-lock-off.png"),
    view4LockerOpen: assetPath("backgrounds/view-4-locker-open.png"),
    view5TrapperKeeper: assetPath("backgrounds/view-5-trapper-keeper.png"),
    view6TrapperKeeperOpen: assetPath("backgrounds/view-6-trapper-keeper-open.png"),
  },
  handsWithPaper: [
    assetPath("hand with paper/hand-paper-1.png"),
    assetPath("hand with paper/hand-paper-2.png"),
    assetPath("hand with paper/hand-paper-3.png"),
  ],
  lockerLock: {
    body: assetPath("lock/lock-body.png"),
    on: assetPath("lock/lock-on.png"),
    open: assetPath("lock/lock-open.png"),
  },
  trapperDial: {
    main: assetPath("Dial/main-dial.png"),
    perspectiveFolder: `${SOURCE_ROOT}/Dial/perspective`,
  },
});

export function assetPath(relativePath) {
  return `${SOURCE_ROOT}/${relativePath}`;
}

export function perspectiveDialPath(slotNumber) {
  return `${ASSETS.trapperDial.perspectiveFolder}/dial-${slotNumber}/dial-${slotNumber}.png`;
}

export function backgroundForState(state, states) {
  if (state === states.TITLE || state === states.HALLWAY_NAME_LENGTH) {
    return ASSETS.backgrounds.view1Hallway;
  }
  if (state === states.MOVE_TO_LOCKER || state === states.LOCKER_GROUP_SELECTION) {
    return ASSETS.backgrounds.view2LockerLocks;
  }
  if (state === states.LOCKER_UNLOCK_ANIMATION) {
    return ASSETS.backgrounds.view3LockerLockOff;
  }
  if (state === states.INSIDE_LOCKER) {
    return ASSETS.backgrounds.view4LockerOpen;
  }
  if (state === states.TRAPPER_KEEPER_SELECTION || state === states.TRAPPER_KEEPER_UNLOCK_ANIMATION) {
    return ASSETS.backgrounds.view5TrapperKeeper;
  }
  if (state === states.NAME_REVEAL) {
    return ASSETS.backgrounds.view6TrapperKeeperOpen;
  }
  return ASSETS.backgrounds.view1Hallway;
}
