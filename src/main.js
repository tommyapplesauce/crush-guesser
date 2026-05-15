import {
  createSelectedGroups,
  displayGroup,
  divideAlphabet,
  reconstructName,
  toHumanCombination,
  transposeGroups,
} from "./crushLogic.js";
import { GAME_STATES, createInitialGameState } from "./gameStates.js";
import { ASSETS, backgroundForState, mainDialPath, perspectiveDialPath } from "./assetManifest.js";

const MAX_NAME_LENGTH = 17;
const INTRO_LINES = [
  "I can almost hear it like it was yesterday...",
  "School was already done by then.",
  "My bestfriend told me their crush's name was written inside a Trapper Keeper.",
  "It's inside their locker.",
  "The only clue I knew was that the locker number is the same length as the crush's name.",
];
const TRAPPER_LINES = [
  "There's a combination lock on it too!",
  "There has to be another clue in these papers somewhere.",
];

let game = createInitialGameState();
let lengthDraft = "5";
const app = document.querySelector("#app");

function setGame(nextGame) {
  game = typeof nextGame === "function" ? nextGame(game) : nextGame;
  render();
}

function startCase() {
  lengthDraft = "5";
  setGame({ ...createInitialGameState(), currentState: GAME_STATES.INTRO_NARRATION });
}

function advanceDialogue() {
  if (game.currentState === GAME_STATES.INTRO_NARRATION) {
    if (game.introDialogueIndex < INTRO_LINES.length - 1) {
      setGame((current) => ({ ...current, introDialogueIndex: current.introDialogueIndex + 1 }));
    } else {
      setGame((current) => ({ ...current, currentState: GAME_STATES.HALLWAY_NAME_LENGTH }));
    }
  }

  if (game.currentState === GAME_STATES.TRAPPER_KEEPER_INTRO) {
    if (game.trapperDialogueIndex < TRAPPER_LINES.length - 1) {
      setGame((current) => ({ ...current, trapperDialogueIndex: current.trapperDialogueIndex + 1 }));
    } else {
      setGame((current) => ({
        ...current,
        currentState: GAME_STATES.TRAPPER_KEEPER_SELECTION,
        currentLetterIndex: 0,
        message: "Check the paper for the next clue.",
      }));
    }
  }
}

function submitNameLength(event) {
  event.preventDefault();
  const nameLength = Number(lengthDraft);
  try {
    if (nameLength > MAX_NAME_LENGTH) {
      throw new RangeError(`This lock only has room for ${MAX_NAME_LENGTH} letters right now.`);
    }
    const alphabetGroups = divideAlphabet(nameLength);
    setGame((current) => ({
      ...current,
      nameLength,
      alphabetGroups,
      currentState: GAME_STATES.MOVE_TO_LOCKER,
      message: `${nameLength} letters... locker ${nameLength}.`,
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
        message: "Scribbled it into the combination.",
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
      message: "Combination complete.",
    };
  });
}

function openLocker() {
  setGame((current) => ({
    ...current,
    currentState: GAME_STATES.INSIDE_LOCKER,
    message: "The lock pops open.",
  }));
}

function zoomToTrapperKeeper() {
  setGame((current) => ({
    ...current,
    currentState: GAME_STATES.TRAPPER_KEEPER_INTRO,
    trapperDialogueIndex: 0,
    message: "",
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
        message: "The Trapper Keeper combo grows.",
      };
    }

    const guessedName = reconstructName(current.transposedGroups, secondStageSelections);
    return {
      ...current,
      secondStageSelections,
      guessedName,
      currentLetterIndex: current.nameLength,
      currentState: GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION,
      message: "The last dial clicks.",
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
  app.className = `app-shell ${sceneClass()}`;
  app.innerHTML = `
    <div class="scene-stage ${sceneAssetClass()}" aria-hidden="true">
      ${assetImage(backgroundForState(game.currentState, GAME_STATES), "scene-background")}
      <div class="parallax-stage">
        ${scenePropMarkup()}
      </div>
    </div>
    ${dialogueMarkup()}
    ${paperMarkup()}
  `;
  bindSceneEvents();
  bindParallax();
}

function dialogueMarkup() {
  const text = dialogueText();
  if (!text) {
    return "";
  }

  const speaker = dialogueSpeaker();
  const canContinue = game.currentState === GAME_STATES.INTRO_NARRATION || game.currentState === GAME_STATES.TRAPPER_KEEPER_INTRO;
  return `
    <section class="dialogue-box ${speaker ? "has-speaker" : "narration-box"}" aria-live="polite">
      ${speaker ? `<div class="speaker-tag">${speaker}</div>` : ""}
      <p>${escapeHtml(text)}</p>
      ${canContinue ? `<button class="dialogue-next" data-action="advance-dialogue">Continue</button>` : `<span class="dialogue-caret"></span>`}
    </section>
  `;
}

function paperMarkup() {
  if (game.currentState === GAME_STATES.INTRO_NARRATION || game.currentState === GAME_STATES.TRAPPER_KEEPER_INTRO) {
    return "";
  }

  return `
    <section class="paper-stage ${game.currentState === GAME_STATES.TITLE ? "title-paper-stage" : ""}" aria-label="Hands holding clue paper">
      ${assetImage(handPaperForState(), "hand-paper-art")}
      <div class="paper-card" aria-label="Case note and choices">
        ${sceneMarkup()}
        ${game.message ? `<p class="status-note">${escapeHtml(game.message)}</p>` : ""}
      </div>
    </section>
  `;
}

function scenePropMarkup() {
  if (game.currentState === GAME_STATES.TITLE || game.currentState === GAME_STATES.INTRO_NARRATION || game.currentState === GAME_STATES.HALLWAY_NAME_LENGTH) {
    return "";
  }

  if (game.currentState === GAME_STATES.MOVE_TO_LOCKER) {
    return lockerNumberPlatesMarkup();
  }

  if (game.currentState === GAME_STATES.LOCKER_GROUP_SELECTION) {
    return `${lockerNumberPlatesMarkup()}${lockerLockMarkup()}`;
  }

  if (game.currentState === GAME_STATES.LOCKER_UNLOCK_ANIMATION) {
    return `${lockerNumberPlatesMarkup()}${lockerLockMarkup()}${bigCombinationMarkup(game.firstStageSelections, "locker")}`;
  }

  if (game.currentState === GAME_STATES.TRAPPER_KEEPER_INTRO || game.currentState === GAME_STATES.TRAPPER_KEEPER_SELECTION || game.currentState === GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION) {
    return `${trapperDialMarkup()}${trapperLargeDialMarkup()}`;
  }

  if (game.currentState === GAME_STATES.NAME_REVEAL) {
    return `<span class="art-reveal-name">${escapeHtml(game.guessedName || "???")}</span>`;
  }

  return "";
}

function lockerNumberPlatesMarkup() {
  if (!game.nameLength) {
    return "";
  }

  return `
    <div class="locker-number-plates">
      <span>${Math.max(1, game.nameLength - 1)}</span>
      <span>${game.nameLength}</span>
      <span>${Math.min(MAX_NAME_LENGTH, game.nameLength + 1)}</span>
    </div>
  `;
}

function lockerLockMarkup() {
  const lockBodySource = game.currentState === GAME_STATES.LOCKER_UNLOCK_ANIMATION ? ASSETS.lockerLock.offBody : ASSETS.lockerLock.onBody;
  return `
    <div class="locker-lock-focus ${game.currentState === GAME_STATES.LOCKER_UNLOCK_ANIMATION ? "lock-open-flash" : ""}" style="--lock-rotation: ${lockerDialRotation()}deg">
      <div class="lock-gradient"></div>
      ${assetImage(lockBodySource, "locker-lock-body")}
      ${assetImage(ASSETS.lockerLock.dial, "locker-lock-dial")}
    </div>
  `;
}

function lockerDialRotation() {
  return game.firstStageSelections.reduce((total, selection, index) => total + ((selection + 1) * 36) + (index * 18), 0);
}

function trapperDialMarkup() {
  if (!game.nameLength) {
    return "";
  }

  const slots = getCenteredDialSlots(game.nameLength);
  return `
    <div class="perspective-dial-rack" style="--dial-count: ${slots.length}">
      ${slots.map((slotNumber, visualIndex) => {
        const value = game.secondStageSelections[visualIndex] !== undefined ? game.secondStageSelections[visualIndex] + 1 : 0;
        return `
          <div class="perspective-dial" style="--dial-left: ${dialLeftPercent(slotNumber)}%; --dial-offset: ${Math.abs(slotNumber - 9)}">
            ${assetImage(perspectiveDialPath(slotNumber, value), "perspective-dial-art")}
            <span>${value || visualIndex + 1}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function getCenteredDialSlots(count) {
  const cappedCount = Math.min(Math.max(count, 1), MAX_NAME_LENGTH);
  const centerSlot = 9;
  const slots = [centerSlot];
  for (let offset = 1; slots.length < cappedCount; offset += 1) {
    if (centerSlot - offset >= 1) {
      slots.push(centerSlot - offset);
    }
    if (slots.length < cappedCount && centerSlot + offset <= MAX_NAME_LENGTH) {
      slots.push(centerSlot + offset);
    }
  }
  return slots.sort((a, b) => a - b);
}

function dialLeftPercent(slotNumber) {
  return 50 + ((slotNumber - 9) * 5.2);
}

function sceneMarkup() {
  switch (game.currentState) {
    case GAME_STATES.TITLE:
      return `
        <p class="eyebrow">Secret Crush Case File</p>
        <h1>Crush Guesser</h1>
        <p class="paper-copy">Think of a name. Don&apos;t say it out loud. We&apos;ll turn it into a locker mystery.</p>
        <p class="tiny-rule">Old school rules: letters A-Z only. No spaces yet.</p>
        <button class="sticker-button" data-action="start">Start the Case</button>
      `;

    case GAME_STATES.HALLWAY_NAME_LENGTH:
      return `
        <form data-action="submit-length">
          <p class="eyebrow">Locker clue</p>
          <label class="number-label" for="name-length">Number of letters in crush&apos;s name</label>
          <div class="slider-readout">${escapeHtml(lengthDraft)}</div>
          <input id="name-length" class="length-slider" min="1" max="${MAX_NAME_LENGTH}" step="1" type="range" value="${escapeHtml(lengthDraft)}" />
          <div class="slider-scale"><span>1</span><span>${MAX_NAME_LENGTH}</span></div>
          <button class="sticker-button" type="submit">Circle it</button>
        </form>
      `;

    case GAME_STATES.MOVE_TO_LOCKER:
      return `
        <p class="eyebrow">Locker ${game.nameLength}</p>
        <p class="paper-copy">The number on the middle locker matches the name length.</p>
        <button class="sticker-button" data-action="locker-clues">Find the combination</button>
      `;

    case GAME_STATES.LOCKER_GROUP_SELECTION:
      return cluePickerMarkup({
        heading: "Possible combination:",
        subtitle: "Tap the row where each letter is hiding.",
        rows: game.alphabetGroups,
        selections: game.firstStageSelections,
        action: "locker-row",
      });

    case GAME_STATES.LOCKER_UNLOCK_ANIMATION:
      return `
        <p class="eyebrow">Possible combination:</p>
        <p class="combo-line">${toHumanCombination(game.firstStageSelections)}</p>
        <button class="sticker-button" data-action="open-locker">Open locker</button>
      `;

    case GAME_STATES.INSIDE_LOCKER:
      return `
        <button class="sticker-button" data-action="trapper-zoom">Look closer</button>
      `;

    case GAME_STATES.TRAPPER_KEEPER_SELECTION:
      return cluePickerMarkup({
        heading: "Possible Trapper Keeper Combination:",
        subtitle: "Tap the strip that reveals each hidden letter.",
        rows: game.transposedGroups,
        selections: game.secondStageSelections,
        action: "trapper-row",
        activeLetterIndex: game.currentLetterIndex,
      });

    case GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION:
      return `
        <p class="eyebrow">Possible Trapper Keeper Combination:</p>
        <p class="combo-line">${toHumanCombination(game.secondStageSelections)}</p>
        <button class="sticker-button" data-action="reveal">Open it</button>
      `;

    case GAME_STATES.NAME_REVEAL:
      return `
        <p class="eyebrow">I like...</p>
        <h2 class="revealed-name">${escapeHtml(game.guessedName)}</h2>
        <div class="reveal-actions">
          <button class="sticker-button" data-action="start">Go Again</button>
          <button class="sticker-button secondary" data-action="title">Exit to Title</button>
        </div>
      `;

    default:
      return "";
  }
}

function cluePickerMarkup({ heading, subtitle, rows, selections, action, activeLetterIndex = null }) {
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
    <p class="eyebrow">${escapeHtml(heading)}</p>
    <p class="combo-line">${selections.length ? toHumanCombination(selections) : "___"}</p>
    <p>${escapeHtml(subtitle)}</p>
    <div class="clue-list">${rowMarkup}</div>
  `;
}

function trapperLargeDialMarkup() {
  if (!game.nameLength || game.currentState === GAME_STATES.TRAPPER_KEEPER_INTRO) {
    return "";
  }

  const values = Array.from({ length: game.nameLength }, (_, index) => game.secondStageSelections[index] !== undefined ? game.secondStageSelections[index] + 1 : 0);
  return bigCombinationMarkup(values, "trapper", true);
}

function bigCombinationMarkup(selections, stage, valuesAreDigits = false) {
  if (!selections.length) {
    return "";
  }

  return `
    <div class="big-combo-wheels ${stage === "trapper" ? "trapper-big-dials" : ""}">
      ${selections.map((selection) => {
        const value = valuesAreDigits ? selection : selection + 1;
        return `
          <div class="combo-wheel ${stage === "trapper" ? "combo-wheel-image" : ""}">
            ${stage === "trapper" ? assetImage(mainDialPath(value), "main-dial-art") : ""}
            <span>${previousDigit(value)}</span>
            <strong>${value}</strong>
            <span>${nextDigit(value)}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function previousDigit(value) {
  return value <= 1 ? 0 : value - 1;
}

function nextDigit(value) {
  return value >= 9 ? 0 : value + 1;
}

function dialogueText() {
  switch (game.currentState) {
    case GAME_STATES.INTRO_NARRATION:
      return INTRO_LINES[game.introDialogueIndex];
    case GAME_STATES.HALLWAY_NAME_LENGTH:
      return "Hmm...how many letters were in the crush's name again?";
    case GAME_STATES.MOVE_TO_LOCKER:
    case GAME_STATES.LOCKER_GROUP_SELECTION:
      return "Ahh...here it is! Now what was the combination again?";
    case GAME_STATES.INSIDE_LOCKER:
      return "There it is! The Trapper Keeper with the name inside.";
    case GAME_STATES.TRAPPER_KEEPER_INTRO:
      return TRAPPER_LINES[game.trapperDialogueIndex];
    case GAME_STATES.TRAPPER_KEEPER_SELECTION:
      return "There has to be another clue in these papers somewhere.";
    case GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION:
      return "The Trapper Keeper lock is opening...";
    case GAME_STATES.NAME_REVEAL:
      return "It's here! the name of their crush is--";
    default:
      return "";
  }
}

function dialogueSpeaker() {
  if (game.currentState === GAME_STATES.HALLWAY_NAME_LENGTH) {
    return "YOU";
  }
  return "";
}

function sceneAssetClass() {
  const classes = [];
  if (game.currentState === GAME_STATES.TITLE) {
    classes.push("title-scene");
  }
  if ([GAME_STATES.MOVE_TO_LOCKER, GAME_STATES.LOCKER_GROUP_SELECTION, GAME_STATES.LOCKER_UNLOCK_ANIMATION].includes(game.currentState)) {
    classes.push("locker-closeup-scene");
  }
  if ([GAME_STATES.TRAPPER_KEEPER_INTRO, GAME_STATES.TRAPPER_KEEPER_SELECTION, GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION].includes(game.currentState)) {
    classes.push("trapper-background-scene");
  }
  if (game.currentState === GAME_STATES.NAME_REVEAL) {
    classes.push("reveal-background-scene");
  }
  return classes.join(" ");
}

function handPaperForState() {
  if (game.currentState === GAME_STATES.TITLE || game.currentState === GAME_STATES.HALLWAY_NAME_LENGTH) {
    return ASSETS.handsWithPaper.hallway;
  }
  if (game.currentState === GAME_STATES.LOCKER_GROUP_SELECTION) {
    return ASSETS.handsWithPaper.locker;
  }
  return ASSETS.handsWithPaper.trapperKeeper;
}

function sceneClass() {
  if (game.currentState === GAME_STATES.TITLE) {
    return "title-ui";
  }
  if ([GAME_STATES.TRAPPER_KEEPER_INTRO, GAME_STATES.TRAPPER_KEEPER_SELECTION, GAME_STATES.TRAPPER_KEEPER_UNLOCK_ANIMATION, GAME_STATES.NAME_REVEAL].includes(game.currentState)) {
    return "inside-scene";
  }
  if ([GAME_STATES.MOVE_TO_LOCKER, GAME_STATES.LOCKER_GROUP_SELECTION, GAME_STATES.LOCKER_UNLOCK_ANIMATION].includes(game.currentState)) {
    return "locker-scene";
  }
  return "hallway-scene";
}

function bindSceneEvents() {
  app.querySelector('[data-action="start"]')?.addEventListener("click", startCase);
  app.querySelector('[data-action="title"]')?.addEventListener("click", () => setGame(createInitialGameState()));
  app.querySelector('[data-action="advance-dialogue"]')?.addEventListener("click", advanceDialogue);
  app.querySelector('[data-action="locker-clues"]')?.addEventListener("click", goToLockerClues);
  app.querySelector('[data-action="open-locker"]')?.addEventListener("click", openLocker);
  app.querySelector('[data-action="trapper-zoom"]')?.addEventListener("click", zoomToTrapperKeeper);
  app.querySelector('[data-action="reveal"]')?.addEventListener("click", revealName);

  app.querySelector('[data-action="submit-length"]')?.addEventListener("submit", submitNameLength);
  app.querySelector("#name-length")?.addEventListener("input", (event) => {
    lengthDraft = event.target.value;
    render();
  });

  app.querySelectorAll('[data-action="locker-row"]').forEach((button) => {
    button.addEventListener("click", () => chooseLockerRow(Number(button.dataset.row)));
  });
  app.querySelectorAll('[data-action="trapper-row"]').forEach((button) => {
    button.addEventListener("click", () => chooseTrapperStrip(Number(button.dataset.row)));
  });

  document.onkeydown = (event) => {
    if ((event.key === "Enter" || event.key === " ") && (game.currentState === GAME_STATES.INTRO_NARRATION || game.currentState === GAME_STATES.TRAPPER_KEEPER_INTRO)) {
      event.preventDefault();
      advanceDialogue();
    }
  };
}


function bindParallax() {
  const stage = app.querySelector(".scene-stage");
  if (!stage || !app.classList.contains("locker-scene")) {
    return;
  }

  app.onpointermove = (event) => {
    const bounds = app.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) - 0.5;
    const y = ((event.clientY - bounds.top) / bounds.height) - 0.5;
    stage.style.setProperty("--peek-x", `${(-x * 18).toFixed(2)}px`);
    stage.style.setProperty("--peek-y", `${(-y * 10).toFixed(2)}px`);
  };
}

function assetImage(src, className, alt = "") {
  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="eager" decoding="async" onerror="this.hidden=true" />`;
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
