/** Application constants. */
export const CONSTANTS = {
  POINTS_PER_MATCH: 2,
  FLIP_DELAY_MS: 1000,
  GAME_OVER_DELAY_MS: 3000,
} as const;

const GAMING_ICONS_BASE =[
  './public/assets/images/gameThemeCart1.svg',
  './public/assets/images/gameThemeCart2.svg',
  './public/assets/images/gameThemeCart3.svg',
  './public/assets/images/gameThemeCart4.svg',
  './public/assets/images/gameThemeCart5.svg',
  './public/assets/images/gameThemeCart6.svg',
  './public/assets/images/gameThemeCart7.svg',
  './public/assets/images/gameThemeCart8.svg',
  './public/assets/images/gameThemeCart9.svg',
  './public/assets/images/gameThemeCart10.svg',
  './public/assets/images/gameThemeCart11.svg',
  './public/assets/images/gameThemeCart12.svg',
  './public/assets/images/gameThemeCart13.svg',
  './public/assets/images/gameThemeCart14.svg',
  './public/assets/images/gameThemeCart15.svg',
  './public/assets/images/gameThemeCart16.svg',
  './public/assets/images/gameThemeCart17.svg',
  './public/assets/images/gameThemeCart18.svg'
];

const CODE_VIBES_ICONS_BASE =[
  './public/assets/images/codeVibesCart1.svg',
  './public/assets/images/codeVibesCart2.svg',
  './public/assets/images/codeVibesCart3.svg',
  './public/assets/images/codeVibesCart4.svg',
  './public/assets/images/codeVibesCart5.svg',
  './public/assets/images/codeVibesCart6.svg',
  './public/assets/images/codeVibesCart7.svg',
  './public/assets/images/codeVibesCart8.svg',
  './public/assets/images/codeVibesCart9.svg',
  './public/assets/images/codeVibesCart10.svg',
  './public/assets/images/codeVibesCart11.svg',
  './public/assets/images/codeVibesCart12.svg',
  './public/assets/images/codeVibesCart13.svg',
  './public/assets/images/codeVibesCart14.svg',
  './public/assets/images/codeVibesCart15.svg',
  './public/assets/images/codeVibesCart16.svg',
  './public/assets/images/codeVibesCart17.svg',
  './public/assets/images/codeVibesCart18.svg'
];

/** Icon sets per theme. */
export const THEME_ICONS: Record<string, string[]> = {
  "code-vibes":[
    ...CODE_VIBES_ICONS_BASE,
    ...CODE_VIBES_ICONS_BASE.slice(0, 14) // Επαναλαμβάνουμε μερικά για τα 32 ζευγάρια (64 cards)
  ],
  "gaming":[
    ...GAMING_ICONS_BASE,
    ...GAMING_ICONS_BASE.slice(0, 14)
  ]
};