const SOURCE_ROOT = "assets/source_assets";

const BACKGROUND_CANDIDATES = Object.freeze({
  view1Hallway: [
    assetPath("backgrounds/view-1-school-hallway.PNG"),
    assetPath("backgrounds/view-1-school-hallway.png"),
  ],
  view2LockerLocks: [
    assetPath("backgrounds/view-2-locker-closed-lock-on.PNG"),
    assetPath("backgrounds/view-2-locker-closed-lock-on.png"),
  ],
  view3LockerLockOff: [
    assetPath("backgrounds/view-3-locler-closed-lock-off.PNG"),
    assetPath("backgrounds/view-3-locker-closed-lock-off.PNG"),
    assetPath("backgrounds/view-3-locler-closed-lock-off.png"),
    assetPath("backgrounds/view-3-locker-closed-lock-off.png"),
  ],
  view4LockerOpen: [
    assetPath("backgrounds/view-4-locker-open.PNG"),
    assetPath("backgrounds/view-4-locker-open.png"),
  ],
  view5TrapperKeeper: [
    assetPath("backgrounds/view-5-trapper-keeper-closed.PNG"),
    assetPath("backgrounds/view-5-trapper-keeper-closed.png"),
  ],
  view6TrapperKeeperOpen: [
    assetPath("backgrounds/view-6-trapper-keeper-open.PNG"),
    assetPath("backgrounds/view-6-trapper-keeper-open.png"),
  ],
});

export const ASSETS = Object.freeze({
  backgrounds: BACKGROUND_CANDIDATES,
  handsWithPaper: {
    hallway: [
      assetPath("hand-with-paper/hand-with-paper-hallway.PNG"),
      assetPath("hand with paper/hand-with-paper-hallway.PNG"),
      assetPath("hand-with-paper/hand-with-paper-hallway.png"),
      assetPath("hand with paper/hand-with-paper-hallway.png"),
    ],
    locker: [
      assetPath("hand-with-paper/hand-with-paper-locker.PNG"),
      assetPath("hand with paper/hand-with-paper-locker.PNG"),
      assetPath("hand-with-paper/hand-with-paper-locker.png"),
      assetPath("hand with paper/hand-with-paper-locker.png"),
    ],
    trapperKeeper: [
      assetPath("hand-with-paper/hand-with-paper-trapper-keeper.PNG"),
      assetPath("hand with paper/hand-with-paper-trapper-keeper.PNG"),
      assetPath("hand-with-paper/hand-with-paper-trapper-keeper.png"),
      assetPath("hand with paper/hand-with-paper-trapper-keeper.png"),
    ],
  },
  lockerLock: {
    offBody: [
      assetPath("lock/locker-lock-body-off.PNG"),
      assetPath("lock/locker-lock-body-off.png"),
      assetPath("lock/lock-open.PNG"),
      assetPath("lock/lock-open.png"),
    ],
    onBody: [
      assetPath("lock/locker-lock-body-on.PNG"),
      assetPath("lock/locker-lock-body-on.png"),
      assetPath("lock/lock-on.PNG"),
      assetPath("lock/lock-on.png"),
    ],
    dial: [
      assetPath("lock/locker-lock-dial.PNG"),
      assetPath("lock/locker-lock-dial.png"),
      assetPath("lock/lock-dial.PNG"),
      assetPath("lock/lock-dial.png"),
    ],
  },
  trapperDial: {
    mainFolders: [
      `${SOURCE_ROOT}/dial`,
      `${SOURCE_ROOT}/Dial`,
    ],
    perspectiveFolders: [
      `${SOURCE_ROOT}/dial/perspective`,
      `${SOURCE_ROOT}/Dial/perspective`,
    ],
  },
});

export function assetPath(relativePath) {
  return `${SOURCE_ROOT}/${relativePath}`;
}

export function perspectiveDialPath(slotNumber, value = 0) {
  return [
    `${ASSETS.trapperDial.perspectiveFolders[0]}/Dial-${slotNumber}/dial-${slotNumber}-${value}.PNG`,
    `${ASSETS.trapperDial.perspectiveFolders[0]}/dial-${slotNumber}/dial-${slotNumber}-${value}.PNG`,
    `${ASSETS.trapperDial.perspectiveFolders[1]}/Dial-${slotNumber}/dial-${slotNumber}-${value}.PNG`,
    `${ASSETS.trapperDial.perspectiveFolders[1]}/dial-${slotNumber}/dial-${slotNumber}-${value}.PNG`,
    `${ASSETS.trapperDial.perspectiveFolders[0]}/Dial-${slotNumber}/dial-${slotNumber}-${value}.png`,
    `${ASSETS.trapperDial.perspectiveFolders[0]}/dial-${slotNumber}/dial-${slotNumber}-${value}.png`,
  ];
}

export function mainDialPath(value = 0) {
  return [
    `${ASSETS.trapperDial.mainFolders[0]}/tk-dial-${value}.PNG`,
    `${ASSETS.trapperDial.mainFolders[1]}/tk-dial-${value}.PNG`,
    `${ASSETS.trapperDial.mainFolders[0]}/tk-dial-${value}.png`,
    `${ASSETS.trapperDial.mainFolders[1]}/tk-dial-${value}.png`,
  ];
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
