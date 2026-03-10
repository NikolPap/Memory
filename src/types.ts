export type ThemeID = "code-vibes" | "gaming";
export type PlayerID = "blue" | "orange";

export interface CardData {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  theme: ThemeID;
  startingPlayer: PlayerID;
  boardSize: number;
  currentPlayer: PlayerID;
  scores: Record<PlayerID, number>;
  cards: CardData[];
  firstCardIndex: number | null;
  isLocked: boolean;
  pairsMatched: number;
}