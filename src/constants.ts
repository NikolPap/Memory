/** Application constants. */
export const CONSTANTS = {
  POINTS_PER_MATCH: 2,
  FLIP_DELAY_MS: 1000,
  GAME_OVER_DELAY_MS: 3000,
} as const;

const GAMING_ICONS_BASE =[
  './assets/images/gameThemeCart1.svg',
  './assets/images/gameThemeCart2.svg',
  './assets/images/gameThemeCart3.svg',
  './assets/images/gameThemeCart4.svg',
  './assets/images/gameThemeCart5.svg',
  './assets/images/gameThemeCart6.svg',
  './assets/images/gameThemeCart7.svg',
  './assets/images/gameThemeCart8.svg',
  './assets/images/gameThemeCart9.svg',
  './assets/images/gameThemeCart10.svg',
  './assets/images/gameThemeCart11.svg',
  './assets/images/gameThemeCart12.svg',
  './assets/images/gameThemeCart13.svg',
  './assets/images/gameThemeCart14.svg',
  './assets/images/gameThemeCart15.svg',
  './assets/images/gameThemeCart16.svg',
  './assets/images/gameThemeCart17.svg',
  './assets/images/gameThemeCart18.svg'
];

const CODE_VIBES_ICONS_BASE =[
  './assets/images/codeVibesCart1.svg',
  './assets/images/codeVibesCart2.svg',
  './assets/images/codeVibesCart3.svg',
  './assets/images/codeVibesCart4.svg',
  './assets/images/codeVibesCart5.svg',
  './assets/images/codeVibesCart6.svg',
  './assets/images/codeVibesCart7.svg',
  './assets/images/codeVibesCart8.svg',
  './assets/images/codeVibesCart9.svg',
  './assets/images/codeVibesCart10.svg',
  './assets/images/codeVibesCart11.svg',
  './assets/images/codeVibesCart12.svg',
  './assets/images/codeVibesCart13.svg',
  './assets/images/codeVibesCart14.svg',
  './assets/images/codeVibesCart15.svg',
  './assets/images/codeVibesCart16.svg',
  './assets/images/codeVibesCart17.svg',
  './assets/images/codeVibesCart18.svg'
];

/** Icon sets per theme. */
export const THEME_ICONS: Record<string, string[]> = {
  "code-vibes":[
    ...CODE_VIBES_ICONS_BASE,
    ...CODE_VIBES_ICONS_BASE.slice(0, 14) 
  ],
  "gaming":[
    ...GAMING_ICONS_BASE,
    ...GAMING_ICONS_BASE.slice(0, 14)
  ]
};