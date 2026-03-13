import { CONSTANTS, THEME_ICONS } from "./constants";
import type { GameState, ThemeID, PlayerID, CardData } from "./types";
import { shuffleArray, getElement, switchScreen } from "./utils";

export const STATE: GameState = {
  theme: "code-vibes",
  startingPlayer: "blue",
  boardSize: 16,
  currentPlayer: "blue",
  scores: { blue: 0, orange: 0 },
  cards:[],
  firstCardIndex: null,
  isLocked: false,
  pairsMatched: 0
};

/** Initializes a new round based on current settings. */
export function startNewGame(): void {
  STATE.scores = { blue: 0, orange: 0 };
  STATE.currentPlayer = STATE.startingPlayer;
  STATE.pairsMatched = 0;
  STATE.firstCardIndex = null;
  STATE.isLocked = false;
  
  generateDeck();
  renderBoard();
  updateScoreUI();
  switchScreen("screen-game");
}

/** Builds and shuffles the deck based on board size. */
function generateDeck(): void {
  const pairsNeeded = STATE.boardSize / 2;
  const pool = THEME_ICONS[STATE.theme];
  const selected = pool.slice(0, pairsNeeded);
  const deckRaw = [...selected, ...selected];
  
  const shuffled = shuffleArray(deckRaw);
  STATE.cards = shuffled.map((val, id) => ({
    id, value: val, isFlipped: false, isMatched: false
  }));
}

/** Renders cards using the semantic HTML template. */
function renderBoard(): void {
  const board = getElement("board");
  const tpl = getElement<HTMLTemplateElement>("card-template");
  
  board.className = `size-${STATE.boardSize}`;
  board.innerHTML = "";

  STATE.cards.forEach((card, index) => {
    const clone = tpl.content.cloneNode(true) as DocumentFragment;
    const article = clone.querySelector(".card") as HTMLElement;
    setupCard(article, card, index);
    board.appendChild(article);
  });
}

/** Binds data and events to a newly generated card instance. */
function setupCard(article: HTMLElement, card: CardData, idx: number): void {
  const content = article.querySelector(".card__face--content") as HTMLElement;
  const btn = article.querySelector("button") as HTMLButtonElement;
  content.innerHTML = `<img src="${card.value}" alt="card image" />`;
  
  article.dataset.index = idx.toString();
  btn.addEventListener("click", () => handleFlip(idx, article));
}

/** Processes a click on a card element. */
function handleFlip(idx: number, article: HTMLElement): void {
  const card = STATE.cards[idx];
  if (STATE.isLocked || card.isFlipped || card.isMatched) return;

  card.isFlipped = true;
  article.classList.add("is-flipped");

  if (STATE.firstCardIndex === null) {
    STATE.firstCardIndex = idx;
    return;
  }
  processMatch(idx, article);
}

/** Evaluates if the flipped pair is a match. */
function processMatch(secondIdx: number, secondEl: HTMLElement): void {
  STATE.isLocked = true;
  const firstIdx = STATE.firstCardIndex as number;
  const isMatch = STATE.cards[firstIdx].value === STATE.cards[secondIdx].value;

  if (isMatch) {
    handleSuccessfulMatch(firstIdx, secondIdx);
  } else {
    handleFailedMatch(firstIdx, secondIdx);
  }
}

/** Updates state for a successful pair match. */
function handleSuccessfulMatch(idx1: number, idx2: number): void {
  STATE.cards[idx1].isMatched = true;
  STATE.cards[idx2].isMatched = true;
  STATE.scores[STATE.currentPlayer] += CONSTANTS.POINTS_PER_MATCH;
  STATE.pairsMatched++;
  
  updateScoreUI();
  checkWinCondition();
}

/** Reverts cards on a failed match after a delay. */
function handleFailedMatch(idx1: number, idx2: number): void {
  setTimeout(() => {
    revertCardUI(idx1);
    revertCardUI(idx2);
    STATE.currentPlayer = STATE.currentPlayer === "blue" ? "orange" : "blue";
    updateScoreUI();
    resetTurnState();
  }, CONSTANTS.FLIP_DELAY_MS);
}

/** Reverts a specific card's UI state based on its index. */
function revertCardUI(idx: number): void {
  STATE.cards[idx].isFlipped = false;
  const board = getElement("board");
  const el = board.children[idx] as HTMLElement;
  el.classList.remove("is-flipped");
}

/** Resets the interaction locks for the next player turn. */
function resetTurnState(): void {
  STATE.firstCardIndex = null;
  STATE.isLocked = false;
}

/** Returns the correct icons depending on whether the theme is gaming. */
function getPlayerIcons(isGaming: boolean) {
  return {
    blueIcon: isGaming ? "./assets/images/chess_pawn_blue.svg" : "./assets/images/blueFlag.svg",
    orangeIcon: isGaming ? "./assets/images/chess_pawn_orange.svg" : "./assets/images/orange_flag.svg"
  };
}

/** Updates the HTML of the score display. */
function renderScoreDisplay(isGaming: boolean, blueIcon: string, orangeIcon: string): void {
  const bScore = isGaming ? STATE.scores.blue : `Blue ${STATE.scores.blue}`;
  const oScore = isGaming ? STATE.scores.orange : `Orange ${STATE.scores.orange}`;
  
  getElement("score-display").innerHTML = `
    <div class="score-player blue"><img src="${blueIcon}" alt="Blue"><span>${bScore}</span></div>
    <div class="score-player orange"><img src="${orangeIcon}" alt="Orange"><span>${oScore}</span></div>
  `;
}

/** Updates the turn icon for the current player. */
function updateTurnIcon(isGaming: boolean, blueIcon: string, orangeIcon: string): void {
  const icon = getElement("turn-icon");
  if (isGaming) {
    icon.innerHTML = `<img src="./assets/images/chess_pawn.svg" alt="Turn icon">`;
    icon.style.backgroundColor = `var(--c-${STATE.currentPlayer})`;
  } else {
    icon.innerHTML = `<img src="${STATE.currentPlayer === "blue" ? blueIcon : orangeIcon}" alt="Turn icon">`;
    icon.style.backgroundColor = "transparent";
  }
}

/** Main function that calls the helpers to update the score UI. */
export function updateScoreUI(): void {
  const isGaming = STATE.theme === "gaming";
  const { blueIcon, orangeIcon } = getPlayerIcons(isGaming);
  
  renderScoreDisplay(isGaming, blueIcon, orangeIcon);
  updateTurnIcon(isGaming, blueIcon, orangeIcon);
}

/** Triggers the game over sequence if all pairs are matched. */
function checkWinCondition(): void {
  if (STATE.pairsMatched === STATE.boardSize / 2) {
    setTimeout(triggerGameOver, CONSTANTS.GAME_OVER_DELAY_MS);
  } else {
    resetTurnState();
  }
}
/** Renders the final score display based on the current theme. */
function renderFinalScore(): void {
  const finalScoreEl = getElement("final-score");
  if (STATE.theme === "gaming") {
    finalScoreEl.innerHTML = `
      <div class="score-player blue"><img src="./assets/images/chess_pawn_blue.svg" alt="Blue"><span>${STATE.scores.blue}</span></div>
      <div class="score-player orange"><img src="./assets/images/chess_pawn_orange.svg" alt="Orange"><span>${STATE.scores.orange}</span></div>
    `;
  } else {
    finalScoreEl.innerHTML = getElement("score-display").innerHTML;
  }
}

/** Executes the transition logic for the final game screen. */
function triggerGameOver(): void {
  switchScreen("screen-game-over");
  renderFinalScore();
  
  setTimeout(() => {
    displayWinner();
    switchScreen("screen-winner");
  }, CONSTANTS.GAME_OVER_DELAY_MS);
}

/** Updates the UI elements for a tie game scenario. */
function renderTie(nameEl: HTMLElement, iconBox: HTMLElement, isGaming: boolean): void {
  nameEl.textContent = isGaming ? "It's a tie" : "IT'S A TIE";
  nameEl.style.color = "var(--text-main)";
  iconBox.innerHTML = ""; 
}

/** Updates the UI elements for the winning player. */
function renderWinner(nameEl: HTMLElement, iconBox: HTMLElement, winner: "blue" | "orange", isGaming: boolean): void {
  const winnerNameText = isGaming ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} Player` : `${winner.toUpperCase()} PLAYER`;
  const iconSrc = isGaming ? "./assets/images/pockal.svg" : `./assets/images/Player${winner === "blue" ? "Blue" : "Orange"}.svg`;
  
  nameEl.textContent = winnerNameText;
  nameEl.style.color = `var(--c-${winner})`;
  iconBox.innerHTML = `<img src="${iconSrc}" alt="Winner icon">`;
}

/** Determines the winner and populates the final screen. */
function displayWinner(): void {
  const nameEl = getElement("winner-name");
  const iconBox = getElement("winner-icon"); 
  const diff = STATE.scores.blue - STATE.scores.orange;
  const isGaming = STATE.theme === "gaming";
  
  if (diff === 0) {
    renderTie(nameEl, iconBox, isGaming);
  } else {
    renderWinner(nameEl, iconBox, diff > 0 ? "blue" : "orange", isGaming);
  }
}