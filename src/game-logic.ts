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
  
  // Και τα δύο themes χρησιμοποιούν εικόνες πλέον
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

/** Updates the header UI displaying player scores and current turn. */
export function updateScoreUI(): void {
  const display = getElement("score-display");
  const icon = getElement("turn-icon");
  const blueIcon = STATE.theme === "gaming" 
    ? "./assets/images/chess_pawn_blue.svg" 
    : "./assets/images/blueFlag.svg";
    
  const orangeIcon = STATE.theme === "gaming" 
    ? "./assets/images/chess_pawn_orange.svg" 
    : "./assets/images/orange_flag.svg";
  display.innerHTML = `
    <div class="score-player blue">
      <img src="${blueIcon}" alt="Blue Player">
      <span>Blue ${STATE.scores.blue}</span>
    </div>
    <div class="score-player orange">
      <img src="${orangeIcon}" alt="Orange Player">
      <span>Orange ${STATE.scores.orange}</span>
    </div>
  `;

  if (STATE.theme === "gaming") {
    icon.innerHTML = `<img src="./assets/images/chess_pawn.svg" alt="Turn icon">`;
    icon.style.backgroundColor = `var(--c-${STATE.currentPlayer})`;
  } else {
    const currentFlag = STATE.currentPlayer === "blue" ? blueIcon : orangeIcon;
    icon.innerHTML = `<img src="${currentFlag}" alt="Turn icon">`;
    icon.style.backgroundColor = "transparent";
  }
}

/** Triggers the game over sequence if all pairs are matched. */
function checkWinCondition(): void {
  if (STATE.pairsMatched === STATE.boardSize / 2) {
    setTimeout(triggerGameOver, CONSTANTS.GAME_OVER_DELAY_MS);
  } else {
    resetTurnState();
  }
}

/** Executes the transition logic for the final game screen. */
function triggerGameOver(): void {
  switchScreen("screen-game-over");
  const finalScoreEl = getElement("final-score");
  
  // Έλεγχος του theme για το τι θα εμφανιστεί στο Final Score
  if (STATE.theme === "gaming") {
    // Στο Gaming Theme εμφανίζουμε μόνο εικονίδιο και το σκορ (αριθμό)
    const blueIcon = "./assets/images/chess_pawn_blue.svg";
    const orangeIcon = "./assets/images/chess_pawn_orange.svg";
    
    finalScoreEl.innerHTML = `
      <div class="score-player blue">
        <img src="${blueIcon}" alt="Blue Player">
        <span>${STATE.scores.blue}</span>
      </div>
      <div class="score-player orange">
        <img src="${orangeIcon}" alt="Orange Player">
        <span>${STATE.scores.orange}</span>
      </div>
    `;
  } else {
    // Στο Code Vibes Theme αντιγράφουμε κανονικά το HTML του Header (κρατάει τα ονόματα)
    finalScoreEl.innerHTML = getElement("score-display").innerHTML;
  }
  
  setTimeout(() => {
    displayWinner();
    switchScreen("screen-winner");
  }, CONSTANTS.GAME_OVER_DELAY_MS);
}

/** Determines the winner and populates the final screen. */
function displayWinner(): void {
  const nameEl = getElement("winner-name");
  const iconBox = getElement("winner-icon"); 
  const diff = STATE.scores.blue - STATE.scores.orange;
  
  if (diff === 0) {
    nameEl.textContent = "IT'S A TIE";
    nameEl.style.color = "var(--text-main)";
    iconBox.innerHTML = ""; 
  } else {
    const winner = diff > 0 ? "blue" : "orange";
    nameEl.textContent = `${winner.toUpperCase()} PLAYER`;
    nameEl.style.color = `var(--c-${winner})`;
    
    if (STATE.theme === "code-vibes") {
      const iconSrc = winner === "blue" 
        ? "./assets/images/PlayerBlue.svg" 
        : "./assets/images/PlayerOrange.svg";
        
      iconBox.innerHTML = `<img src="${iconSrc}" alt="${winner} player pawn">`;
    } else {
      iconBox.innerHTML = `<img src="./assets/images/pockal.svg" alt="Winner Trophy">`;
    }
  }
}