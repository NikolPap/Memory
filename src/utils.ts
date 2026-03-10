/** Retrieves an HTML element securely by ID. */
export function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found.`);
  return el as T;
}

/** Toggles the active visibility class of screen sections. */
export function switchScreen(targetId: string): void {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((s) => s.classList.remove("active"));
  getElement(targetId).classList.add("active");
}

/** Retrieves the currently checked radio button value by name. */
export function getRadioValue(name: string): string {
  const node = document.querySelector(`input[name="${name}"]:checked`);
  return (node as HTMLInputElement).value;
}

/** Shuffles an array in place using Fisher-Yates. */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}