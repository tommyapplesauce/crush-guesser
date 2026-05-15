const SOURCE_ROOT = "assets/source_assets";

export const ASSETS = Object.freeze({
  backgrounds: {
    view1Hallway: assetPath("backgrounds/view-1-school-hallway.PNG"),
    view2LockerLocks: assetPath("backgrounds/view-2-locker-closed-lock-on.PNG"),
    view3LockerLockOff: assetPath("backgrounds/view-3-locker-closed-lock-off.PNG"),
    view4LockerOpen: assetPath("backgrounds/view-4-locker-open.PNG"),
    view5TrapperKeeper: assetPath("backgrounds/view-5-trapper-keeper-closed.PNG"),
    view6TrapperKeeperOpen: assetPath("backgrounds/view-6-trapper-keeper-open.PNG"),
  },
  handsWithPaper: {
    hallway: assetPath("hand with paper/hand-with-paper-hallway.PNG"),
    locker: assetPath("hand with paper/hand-with-paper-locker.PNG"),
    trapperKeeper: assetPath("hand with paper/hand-with-paper-trapper-keeper.PNG"),
  },
  lockerLock: {
    body: assetPath("lock/lock-body.PNG"),
    on: assetPath("lock/lock-on.PNG"),
    open: assetPath("lock/lock-open.PNG"),
  },
  trapperDial: {
    main: assetPath("Dial/main-dial.PNG"),
    perspectiveFolder: `${SOURCE_ROOT}/Dial/perspective`,
  },
});

export function assetPath(relativePath) {
  return `${SOURCE_ROOT}/${relativePath}`;
}

export function perspectiveDialPath(slotNumber, value = 0) {
  return `${ASSETS.trapperDial.perspectiveFolder}/dial-${slotNumber}/dial-${slotNumber}-${value}.PNG`;
}

export function mainDialPath(value = 0) {
  return assetPath(`Dial/tk-dial-${value}.PNG`);
}

export function backgroundForState(state, states) {
  if (state === states.TITLE || state === states.INTRO_NARRATION || state === states.HALLWAY_NAME_LENGTH) {
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
  if (state === states.TRAPPER_KEEPER_INTRO || state === states.TRAPPER_KEEPER_SELECTION || state === states.TRAPPER_KEEPER_UNLOCK_ANIMATION) {
    return ASSETS.backgrounds.view5TrapperKeeper;
  }
  if (state === states.NAME_REVEAL) {
    return ASSETS.backgrounds.view6TrapperKeeperOpen;
  }
  return ASSETS.backgrounds.view1Hallway;
}
