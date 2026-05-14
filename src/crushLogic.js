export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const PADDING_CHAR = "_";

export function assertNameLength(nameLength) {
  if (!Number.isInteger(nameLength) || nameLength < 1 || nameLength > ALPHABET.length) {
    throw new RangeError("Name length must be a whole number from 1 to 26.");
  }
}

export function divideAlphabet(nameLength) {
  assertNameLength(nameLength);

  const groups = [];
  for (let start = 0; start < ALPHABET.length; start += nameLength) {
    const letters = ALPHABET.slice(start, start + nameLength);
    groups.push(letters.padEnd(nameLength, PADDING_CHAR));
  }

  return groups;
}

export function createSelectedGroups(alphabetGroups, selections) {
  return selections.map((selection) => {
    if (!Number.isInteger(selection) || selection < 0 || selection >= alphabetGroups.length) {
      throw new RangeError("Selection points outside the available alphabet rows.");
    }
    return alphabetGroups[selection];
  });
}

export function transposeGroups(selectedGroups) {
  if (!selectedGroups.length) {
    return [];
  }

  const rowLength = selectedGroups[0].length;
  if (!selectedGroups.every((group) => group.length === rowLength)) {
    throw new Error("Every selected group must be padded to the same length before transposing.");
  }

  const transposed = [];
  for (let columnIndex = 0; columnIndex < rowLength; columnIndex += 1) {
    transposed.push(selectedGroups.map((group) => group[columnIndex]).join(""));
  }
  return transposed;
}

export function reconstructName(transposedGroups, finalSelections) {
  const letters = finalSelections.map((selection, letterIndex) => {
    if (!Number.isInteger(selection) || selection < 0 || selection >= transposedGroups.length) {
      throw new RangeError("Final clue selection points outside the available strips.");
    }

    const guessedLetter = transposedGroups[selection]?.[letterIndex];
    if (!guessedLetter || guessedLetter === PADDING_CHAR) {
      throw new Error("That clue is blank. Try another strip.");
    }
    return guessedLetter;
  });

  return letters.join("");
}

export function displayGroup(group) {
  return group.replaceAll(PADDING_CHAR, "·").split("").join(" ");
}

export function toHumanCombination(selections) {
  return selections.map((selection) => selection + 1).join(" - ");
}
