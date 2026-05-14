import {
  createSelectedGroups,
  displayGroup,
  divideAlphabet,
  reconstructName,
  toHumanCombination,
  transposeGroups,
} from "./crushLogic.js";
import { GAME_STATES, createInitialGameState } from "./gameStates.js";

let game = createInitialGameState();
let lengthDraft = "5";
const app = document.querySelector("#app");

function setGame(nextGame) {
  game = typeof nextGame === "function" ? nextGame(game) : nextGame;
  render();
}

function startCase() {
  lengthDraft = "5";
  setGame({ ...createInitialGameState(), currentState: GAME_STATES.HALLWAY_NAME_LENGTH });
}

function submitNameLength(event) {
  event.preventDefault();
  const nameLength = Number(lengthDraft);
  try {
    const alphabetGroups = divideAlphabet(nameLength);
    setGame((current) => ({
      ...current,
      nameLength,
      alphabetGroups,
      currentState: GAME_STATES.MOVE_TO_LOCKER,
      message: `${nameLength} letters... locker ${100 + nameLength}.`,
    }));
  } catch (error) {
    setGame((current) => ({ ...current, message: error.message }));
  }
}

function goToLockerClues() {
  setGame((current) => ({
    ...current,
    currentState: GAME_STATES.LOCKER_GROUP_SELECTION,
    currentLetterIndex: 0,
    message: "Okay... first clue.",
  }));
}

function chooseLockerRow(rowIndex) {
  setGame((current) => {
    const firstStageSelections = [...current.firstStageSelections, rowIndex];
    const isDone = firstStageSelections.length === current.nameLength;

    if (!isDone) {
      return {
        ...current,
        firstStageSelections,
        currentLetterIndex: firstStageSelections.length,
        message: "Scribbled it on the paper.",
      };
    }

    const selectedGroups = createSelectedGroups(current.alphabetGroups, firstStageSelections);
    const transposedGroups = transposeGroups(selectedGroups);
    return {
      ...current,
      firstStageSelections,
      selectedGroups,
      transposedGroups,
      currentLetterIndex: current.nameLength,
      currentState: GAME_STATES.LOCKER_UNLOCK_ANIMATION,
      message: "Now for the combo...",
    };
  });
}

function openLocker() {
  setGame((current) => ({
    ...current,
    currentState: GAME_STATES.INSIDE_LOCKER,
    message: "There's something inside.",
  }));
}

function startTrapperKeeper() {
  setGame((current) => ({
    ...current,
    currentState: GAME_STATES.TRAPPER_KEEPER_SELECTION,
    currentLetterIndex: 0,
    message: "Wait... another lock?",
  }));
}

function chooseTrapperStrip(stripIndex) {
  setGame((current) => {
    const letterIndex = current.secondStageSelections.length;
    const clueLetter = current.transposedGroups[stripIndex]?.[letterIndex];
    if (!clueLetter || clueLetter === "_") {
      return { ...current, message: "That clue is blank. Try another strip." };
    }

    const secondStageSelections = [...current.secondStageSelections, stripIndex];
    const isDone = secondStageSelections.length === current.nameLength;

    if (!isDone) {
      return {
        ...current,
        secondStageSelections,
        currentLetterIndex: secondStageSelections.length,
        message: "The dial clicks softly.",
      };
    }

    const guessedName = reconstructName(current.transposedGroups, secondStageSelections);
    return {
      ...current,
      secondStageSelections,
      guessedName,
      currentLetterIndex: current.nameLength,
      currentState: GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION,
      message: "Opening the case file...",
    };
  });
}

function revealName() {
  setGame((current) => ({
    ...current,
    currentState: GAME_STATES.NAME_REVEAL,
    message: "Case closed.",
  }));
}

function render() {
  const lockerNumber = game.nameLength ? 100 + game.nameLength : NaN;
  app.className = `app-shell ${sceneForState(game.currentState)}`;
  app.innerHTML = `
    <div class="scene-stage" aria-hidden="true">
      <div class="locker-interior">
        <div class="locker-glow"></div>
        ${scenePropMarkup()}
      </div>
    </div>
    <section class="dialogue-box" aria-live="polite">
      <div class="speaker-tag">YOU</div>
      <p>${escapeHtml(dialogueText(lockerNumber))}</p>
      <span class="dialogue-caret"></span>
    </section>
    <section class="paper-card" aria-label="Case note and choices">
      ${sceneMarkup(lockerNumber)}
      ${game.message ? `<p class="status-note">${escapeHtml(game.message)}</p>` : ""}
    </section>
  `;
  bindSceneEvents();
}

function scenePropMarkup() {
  if ([GAME_STATES.INSIDE_LOCKER, GAME_STATES.TRAPPER_KEEPER_SELECTION, GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION, GAME_STATES.NAME_REVEAL].includes(game.currentState)) {
    return `
      <div class="trapper-art ${game.currentState === GAME_STATES.NAME_REVEAL ? "open-art" : ""}">
        <div class="trapper-grid"></div>
        <div class="trapper-shape one"></div>
        <div class="trapper-shape two"></div>
        ${game.currentState === GAME_STATES.NAME_REVEAL ? `<span class="art-reveal-name">${escapeHtml(game.guessedName || "???")}</span>` : ""}
      </div>
      <div class="side-lock ${game.currentState === GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION ? "unlocking" : ""}">${smallLockSlots()}</div>
      ${game.currentState === GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION ? bigCombinationMarkup(game.secondStageSelections) : ""}
    `;
  }

  return `
    <div class="locker-row">${lockerMarkup(game.nameLength ? 100 + game.nameLength : NaN)}</div>
    ${game.currentState === GAME_STATES.LOCKER_UNLOCK_ANIMATION ? bigCombinationMarkup(game.firstStageSelections) : ""}
  `;
}

function smallLockSlots() {
  return Array.from({ length: 12 }, (_, index) => `<span>${(index % 9) + 1}</span>`).join("");
}

function bigCombinationMarkup(selections) {
  const wheels = selections.length ? selections : [7, 8, 9];
  return `
    <div class="big-combo-wheels">
      ${wheels.map((selection) => `
        <div class="combo-wheel">
          <span>${selection + 7}</span>
          <strong>${selection + 1}</strong>
          <span>${(selection + 2) % 10}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function lockerMarkup(lockerNumber) {
  return [-2, -1, 0, 1, 2]
    .map((offset, index) => {
      const number = Number.isFinite(lockerNumber) ? lockerNumber + offset : "---";
      return `<div class="locker ${index === 2 ? "target" : ""}"><span>${number}</span><i></i></div>`;
    })
    .join("");
}

function dialogueText(lockerNumber) {
  switch (game.currentState) {
    case GAME_STATES.TITLE:
      return "Think of a name. Don't say it out loud. We'll turn it into a locker mystery.";
    case GAME_STATES.HALLWAY_NAME_LENGTH:
      return "Hmm... how many letters were in my crush's name again?";
    case GAME_STATES.MOVE_TO_LOCKER:
      return `Locker ${lockerNumber}. That's the one.`;
    case GAME_STATES.LOCKER_GROUP_SELECTION:
      return `Letter ${game.currentLetterIndex + 1} of ${game.nameLength}... which row hides it?`;
    case GAME_STATES.LOCKER_UNLOCK_ANIMATION:
      return "The locker combo is scribbled down. Time to try it.";
    case GAME_STATES.INSIDE_LOCKER:
      return "There's a Trapper Keeper in here... and of course it has another lock.";
    case GAME_STATES.TRAPPER_KEEPER_SELECTION:
      return `Letter ${game.currentLetterIndex + 1} of ${game.nameLength}... which strip reveals it?`;
    case GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION:
      return "The round lock clicks through the numbers.";
    case GAME_STATES.NAME_REVEAL:
      return "The secret note is open. Case closed.";
    default:
      return "";
  }
}

function sceneMarkup(lockerNumber) {
  switch (game.currentState) {
    case GAME_STATES.TITLE:
      return `
        <p class="eyebrow">Secret Crush Case File</p>
        <h1>Crush Guesser</h1>
        <p>Think of a name. Don&apos;t say it out loud.</p>
        <p class="tiny-rule">Old school rules: letters A-Z only. No spaces yet.</p>
        <button class="sticker-button" data-action="start">Start the Case</button>
      `;

    case GAME_STATES.HALLWAY_NAME_LENGTH:
      return `
        <form data-action="submit-length">
          <p class="eyebrow">Hallway memory</p>
          <label class="number-label" for="name-length">Scribble the number of letters</label>
          <input id="name-length" inputmode="numeric" min="1" max="26" pattern="[0-9]*" type="number" value="${escapeHtml(lengthDraft)}" />
          <button class="sticker-button" type="submit">Circle it</button>
        </form>
      `;

    case GAME_STATES.MOVE_TO_LOCKER:
      return `
        <p class="eyebrow">Found the locker</p>
        <h2>Locker ${lockerNumber}</h2>
        <p>The middle locker is framed between the others.</p>
        <button class="sticker-button" data-action="locker-clues">Check the note</button>
      `;

    case GAME_STATES.LOCKER_GROUP_SELECTION:
      return cluePickerMarkup({
        subtitle: "Tap the row where each letter is hiding. These numbers become the locker combo.",
        rows: game.alphabetGroups,
        selections: game.firstStageSelections,
        action: "locker-row",
      });

    case GAME_STATES.LOCKER_UNLOCK_ANIMATION:
      return `
        <p class="eyebrow">Locker combo</p>
        <h2>${toHumanCombination(game.firstStageSelections)}</h2>
        <p>The tumblers roll into place.</p>
        <button class="sticker-button" data-action="open-locker">Open locker</button>
      `;

    case GAME_STATES.INSIDE_LOCKER:
      return `
        <p class="eyebrow">Inside locker ${lockerNumber}</p>
        <h2>Top Secret</h2>
        <p>The Trapper Keeper is waiting behind the torn note.</p>
        <button class="sticker-button" data-action="trapper">Try the lock</button>
      `;

    case GAME_STATES.TRAPPER_KEEPER_SELECTION:
      return cluePickerMarkup({
        subtitle: "Tap the strip that reveals each hidden letter.",
        rows: game.transposedGroups,
        selections: game.secondStageSelections,
        action: "trapper-row",
        activeLetterIndex: game.currentLetterIndex,
      });

    case GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION:
      return `
        <p class="eyebrow">Trapper Keeper combo</p>
        <h2>${toHumanCombination(game.secondStageSelections)}</h2>
        <p>Almost there...</p>
        <button class="sticker-button" data-action="reveal">Pop it open</button>
      `;

    case GAME_STATES.NAME_REVEAL:
      return `
        <p class="eyebrow">I like...</p>
        <h2 class="revealed-name">${escapeHtml(game.guessedName)}</h2>
        <p>Case closed.</p>
        <button class="sticker-button" data-action="start">Play Again</button>
      `;

    default:
      return "";
  }
}

function cluePickerMarkup({ subtitle, rows, selections, action, activeLetterIndex = null }) {
  const rowMarkup = rows
    .map((row, index) => {
      const isBlankForThisLetter = activeLetterIndex !== null && row[activeLetterIndex] === "_";
      return `
        <button class="clue-row" data-action="${action}" data-row="${index}" ${isBlankForThisLetter ? "disabled" : ""} type="button">
          <strong>${index + 1}</strong>
          <span>${escapeHtml(displayGroup(row))}</span>
        </button>
      `;
    })
    .join("");

  return `
    <p class="eyebrow">Notebook clue</p>
    <p>${escapeHtml(subtitle)}</p>
    <div class="clue-list">${rowMarkup}</div>
    <p class="combo-scribble">Combo so far: ${selections.length ? toHumanCombination(selections) : "___"}</p>
  `;
}

function bindSceneEvents() {
  app.querySelector('[data-action="start"]')?.addEventListener("click", startCase);
  app.querySelector('[data-action="locker-clues"]')?.addEventListener("click", goToLockerClues);
  app.querySelector('[data-action="open-locker"]')?.addEventListener("click", openLocker);
  app.querySelector('[data-action="trapper"]')?.addEventListener("click", startTrapperKeeper);
  app.querySelector('[data-action="reveal"]')?.addEventListener("click", revealName);

  app.querySelector('[data-action="submit-length"]')?.addEventListener("submit", submitNameLength);
  app.querySelector("#name-length")?.addEventListener("input", (event) => {
    lengthDraft = event.target.value;
  });

  app.querySelectorAll('[data-action="locker-row"]').forEach((button) => {
    button.addEventListener("click", () => chooseLockerRow(Number(button.dataset.row)));
  });
  app.querySelectorAll('[data-action="trapper-row"]').forEach((button) => {
    button.addEventListener("click", () => chooseTrapperStrip(Number(button.dataset.row)));
  });
}

function sceneForState(state) {
  if ([GAME_STATES.INSIDE_LOCKER, GAME_STATES.TRAPPER_KEEPER_SELECTION, GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION, GAME_STATES.NAME_REVEAL].includes(state)) {
    return "inside-scene";
  }
  if ([GAME_STATES.MOVE_TO_LOCKER, GAME_STATES.LOCKER_GROUP_SELECTION, GAME_STATES.LOCKER_UNLOCK_ANIMATION].includes(state)) {
    return "locker-scene";
  }
  return "hallway-scene";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();
