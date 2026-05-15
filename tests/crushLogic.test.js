import assert from "node:assert/strict";
import {
  createSelectedGroups,
  divideAlphabet,
  reconstructName,
  transposeGroups,
} from "../src/crushLogic.js";

function runCase({ nameLength, firstSelections, secondSelections, groups, selectedGroups, transposed, expected }) {
  const alphabetGroups = divideAlphabet(nameLength);
  assert.deepEqual(alphabetGroups, groups);

  const selected = createSelectedGroups(alphabetGroups, firstSelections.map((choice) => choice - 1));
  assert.deepEqual(selected, selectedGroups);

  const clueStrips = transposeGroups(selected);
  assert.deepEqual(clueStrips, transposed);

  const guessed = reconstructName(clueStrips, secondSelections.map((choice) => choice - 1));
  assert.equal(guessed, expected);
}

runCase({
  nameLength: 5,
  firstSelections: [3, 1, 4, 2, 1],
  secondSelections: [3, 1, 3, 4, 1],
  groups: ["ABCDE", "FGHIJ", "KLMNO", "PQRST", "UVWXY", "Z____"],
  selectedGroups: ["KLMNO", "ABCDE", "PQRST", "FGHIJ", "ABCDE"],
  transposed: ["KAPFA", "LBQGB", "MCRHC", "NDSID", "OETJE"],
  expected: "MARIA",
});

runCase({
  nameLength: 3,
  firstSelections: [9, 5, 2],
  secondSelections: [2, 3, 2],
  groups: ["ABC", "DEF", "GHI", "JKL", "MNO", "PQR", "STU", "VWX", "YZ_"],
  selectedGroups: ["YZ_", "MNO", "DEF"],
  transposed: ["YMD", "ZNE", "_OF"],
  expected: "ZOE",
});

runCase({
  nameLength: 3,
  firstSelections: [1, 5, 1],
  secondSelections: [1, 2, 1],
  groups: ["ABC", "DEF", "GHI", "JKL", "MNO", "PQR", "STU", "VWX", "YZ_"],
  selectedGroups: ["ABC", "MNO", "ABC"],
  transposed: ["AMA", "BNB", "COC"],
  expected: "ANA",
});

assert.throws(() => reconstructName(["_OF"], [0]), /blank/);
assert.equal(divideAlphabet(1).length, 26);
assert.deepEqual(divideAlphabet(26), ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"]);

console.log("Crush Guesser logic tests passed.");
