import { STATE, startNewGame, updateScoreUI } from "./game-logic";
import type { ThemeID, PlayerID } from "./types";
import { getElement, switchScreen, getRadioValue } from "./utils";
import { THEME_ICONS } from "./constants";
import './styles/style.scss'

/** Initializes DOM event listeners on load. */
function initEvents(): void {
  getElement("btn-play").addEventListener("click", () => switchScreen("screen-settings"));
  getElement("btn-start").addEventListener("click", startNewGame);
  getElement("btn-exit").addEventListener("click", promptExit);
  
  getElement("btn-quit-no").addEventListener("click", cancelExit);
  getElement("btn-quit-yes").addEventListener("click", confirmExit);
  getElement("btn-home").addEventListener("click", goHome);

  attachSettingListeners();
  syncSettingsUI();
}

/** Binds change listeners to all radio inputs. */
function attachSettingListeners(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
  inputs.forEach((input) => input.addEventListener("change", syncSettingsUI));
}

/** Synchronizes application state with form selections. */
function syncSettingsUI(): void {
  STATE.theme = getRadioValue("theme") as ThemeID;
  STATE.startingPlayer = getRadioValue("player") as PlayerID;
  STATE.boardSize = parseInt(getRadioValue("size"), 10);

  updateSettingsSummary();
  applyThemeStyles();
}

/** Updates the text representations inside the settings summary bar. */
function updateSettingsSummary(): void {
  const themeText = document.querySelector('input[name="theme"]:checked')?.parentElement?.textContent;
  const playerText = document.querySelector('input[name="player"]:checked')?.parentElement?.textContent;
  
  getElement("sum-theme").textContent = themeText?.trim() || "";
  getElement("sum-player").textContent = playerText?.trim() || "";
  getElement("sum-size").textContent = `${STATE.boardSize} cards`;
}

/** Applies CSS variables and body classes matching the theme. */
function applyThemeStyles(): void {
  const app = getElement("app");
  app.className = `theme-${STATE.theme}`;
  document.body.className = `preview-${STATE.theme}`;
  
  const iconSpan = getElement("preview-icon");
  iconSpan.innerHTML = `<img src="${THEME_ICONS[STATE.theme][0]}" style="width: 100%; height: 100%; object-fit: contain;">`;
}

/** Shows the exit confirmation modal. */
function promptExit(): void {
  getElement("quit-modal").classList.add("active");
}

/** Hides the exit confirmation modal. */
function cancelExit(): void {
  getElement("quit-modal").classList.remove("active");
}


function resetToDefaultSettings(): void {
  const defaultTheme = document.querySelector('input[name="theme"][value="code-vibes"]') as HTMLInputElement;
  const defaultPlayer = document.querySelector('input[name="player"][value="blue"]') as HTMLInputElement;
  const defaultSize = document.querySelector('input[name="size"][value="16"]') as HTMLInputElement;

  if (defaultTheme) defaultTheme.checked = true;
  if (defaultPlayer) defaultPlayer.checked = true;
  if (defaultSize) defaultSize.checked = true;
  syncSettingsUI();
}

/** Resets the radio buttons and the theme to their default values (Code Vibes, etc.). */
function confirmExit(): void {
  cancelExit();
  resetToDefaultSettings(); 
  switchScreen("screen-start");
}

/** Returns the user to the start screen. */
function goHome(): void {
  resetToDefaultSettings(); 
  switchScreen("screen-start");
}


document.addEventListener("DOMContentLoaded", initEvents);