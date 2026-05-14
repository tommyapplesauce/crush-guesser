export const GAME_STATES = Object.freeze({
  TITLE: "TITLE",
  HALLWAY_NAME_LENGTH: "HALLWAY_NAME_LENGTH",
  MOVE_TO_LOCKER: "MOVE_TO_LOCKER",
  LOCKER_GROUP_SELECTION: "LOCKER_GROUP_SELECTION",
  LOCKER_UNLOCK_ANIMATION: "LOCKER_UNLOCK_ANIMATION",
  INSIDE_LOCKER: "INSIDE_LOCKER",
  TRAPPER_KEEPER_SELECTION: "TRAPPER_KEEPER_SELECTION",
  TRAPPER_KEEPER_UNLOCK_ANIMATION: "TRAPPER_KEEPER_UNLOCK_ANIMATION",
  NAME_REVEAL: "NAME_REVEAL",
});

export function createInitialGameState() {
  return {
    nameLength: 0,
    alphabetGroups: [],
    firstStageSelections: [],
    selectedGroups: [],
    transposedGroups: [],
    secondStageSelections: [],
    guessedName: "",
    currentState: GAME_STATES.TITLE,
    currentLetterIndex: 0,
    message: "",
  };
}
