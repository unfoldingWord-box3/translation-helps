/**
 * languageMapping.js
 * Comprehensive mapping of language codes to flag emojis and metadata
 * Supports multiple flags for languages used in multiple countries
 */

// Language to flag emoji mapping with support for multiple regions
export const languageToFlag = {
  // Major Languages with multiple regions
  en: ["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇳🇿"], // English
  es: ["🇪🇸", "🇲🇽", "🇦🇷", "🇨🇴", "🇵🇪", "🇻🇪", "🇨🇱", "🇪🇨", "🇬🇹", "🇨🇺"], // Spanish
  pt: ["🇵🇹", "🇧🇷", "🇦🇴", "🇲🇿", "🇨🇻", "🇬🇼", "🇸🇹", "🇹🇱"], // Portuguese
  ar: ["🇸🇦", "🇪🇬", "🇦🇪", "🇯🇴", "🇱🇧", "🇸🇾", "🇮🇶", "🇰🇼", "🇴🇲", "🇶🇦"], // Arabic
  fr: ["🇫🇷", "🇨🇦", "🇧🇪", "🇨🇭", "🇸🇳", "🇲🇱", "🇧🇫", "🇳🇪", "🇲🇬", "🇭🇹"], // French
  de: ["🇩🇪", "🇦🇹", "🇨🇭", "🇱🇮"], // German
  zh: ["🇨🇳", "🇹🇼", "🇭🇰", "🇸🇬", "🇲🇴"], // Chinese
  hi: ["🇮🇳", "🇫🇯"], // Hindi
  ru: ["🇷🇺", "🇧🇾", "🇰🇿", "🇰🇬"], // Russian
  nl: ["🇳🇱", "🇧🇪", "🇸🇷"], // Dutch
  bn: ["🇧🇩", "🇮🇳"], // Bengali
  pa: ["🇮🇳", "🇵🇰"], // Punjabi
  ms: ["🇲🇾", "🇸🇬", "🇧🇳"], // Malay
  sw: ["🇰🇪", "🇹🇿", "🇺🇬", "🇷🇼"], // Swahili
  ta: ["🇮🇳", "🇱🇰", "🇸🇬", "🇲🇾"], // Tamil
  ku: ["🇹🇷", "🇮🇶", "🇮🇷", "🇸🇾"], // Kurdish

  // European Languages
  it: "🇮🇹", // Italian
  pl: "🇵🇱", // Polish
  sv: "🇸🇪", // Swedish
  no: "🇳🇴", // Norwegian
  da: "🇩🇰", // Danish
  fi: "🇫🇮", // Finnish
  cs: "🇨🇿", // Czech
  sk: "🇸🇰", // Slovak
  hu: "🇭🇺", // Hungarian
  ro: "🇷🇴", // Romanian
  bg: "🇧🇬", // Bulgarian
  hr: "🇭🇷", // Croatian
  sr: "🇷🇸", // Serbian
  sl: "🇸🇮", // Slovenian
  uk: "🇺🇦", // Ukrainian
  el: "🇬🇷", // Greek
  tr: "🇹🇷", // Turkish
  et: "🇪🇪", // Estonian
  lv: "🇱🇻", // Latvian
  lt: "🇱🇹", // Lithuanian
  mt: "🇲🇹", // Maltese
  is: "🇮🇸", // Icelandic
  ga: "🇮🇪", // Irish
  cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", // Welsh
  gd: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", // Scottish Gaelic
  eu: "🇪🇸", // Basque (Spain/France)
  ca: "🇪🇸", // Catalan
  gl: "🇪🇸", // Galician
  mk: "🇲🇰", // Macedonian
  sq: "🇦🇱", // Albanian
  bs: "🇧🇦", // Bosnian
  me: "🇲🇪", // Montenegrin

  // Asian Languages
  ja: "🇯🇵", // Japanese
  ko: "🇰🇷", // Korean
  th: "🇹🇭", // Thai
  vi: "🇻🇳", // Vietnamese
  id: "🇮🇩", // Indonesian
  tl: "🇵🇭", // Tagalog/Filipino
  my: "🇲🇲", // Burmese
  km: "🇰🇭", // Khmer
  lo: "🇱🇦", // Lao
  ne: "🇳🇵", // Nepali
  si: "🇱🇰", // Sinhala
  te: "🇮🇳", // Telugu
  ml: "🇮🇳", // Malayalam
  kn: "🇮🇳", // Kannada
  gu: "🇮🇳", // Gujarati
  mr: "🇮🇳", // Marathi
  or: "🇮🇳", // Odia
  as: "🇮🇳", // Assamese
  mn: "🇲🇳", // Mongolian
  bo: "🇹🇳", // Tibetan
  dz: "🇧🇹", // Dzongkha
  uz: "🇺🇿", // Uzbek
  kk: "🇰🇿", // Kazakh
  ky: "🇰🇬", // Kyrgyz
  tg: "🇹🇯", // Tajik
  tk: "🇹🇲", // Turkmen
  ps: "🇦🇫", // Pashto
  fa: "🇮🇷", // Persian/Farsi
  ur: "🇵🇰", // Urdu
  sd: "🇵🇰", // Sindhi

  // African Languages
  am: "🇪🇹", // Amharic
  ha: "🇳🇬", // Hausa
  yo: "🇳🇬", // Yoruba
  ig: "🇳🇬", // Igbo
  zu: "🇿🇦", // Zulu
  xh: "🇿🇦", // Xhosa
  af: "🇿🇦", // Afrikaans
  so: "🇸🇴", // Somali
  rw: "🇷🇼", // Kinyarwanda
  sn: "🇿🇼", // Shona
  ny: "🇲🇼", // Chichewa
  mg: "🇲🇬", // Malagasy
  wo: "🇸🇳", // Wolof
  ff: "🇳🇬", // Fulah
  bm: "🇲🇱", // Bambara
  lg: "🇺🇬", // Luganda
  ki: "🇰🇪", // Kikuyu
  om: "🇪🇹", // Oromo
  ti: "🇪🇹", // Tigrinya
  tn: "🇧🇼", // Tswana
  st: "🇱🇸", // Sesotho
  ss: "🇸🇿", // Swati
  nr: "🇿🇦", // Ndebele
  ve: "🇿🇦", // Venda
  ts: "🇿🇦", // Tsonga

  // Pacific Languages
  mi: "🇳🇿", // Māori
  haw: "🇺🇸", // Hawaiian
  sm: "🇼🇸", // Samoan
  to: "🇹🇴", // Tongan
  fj: "🇫🇯", // Fijian
  ty: "🇵🇫", // Tahitian
  gil: "🇰🇮", // Gilbertese

  // Middle Eastern
  he: "🇮🇱", // Hebrew
  yi: "🇮🇱", // Yiddish
  hy: "🇦🇲", // Armenian
  ka: "🇬🇪", // Georgian
  az: "🇦🇿", // Azerbaijani

  // Native American Languages
  nv: "🇺🇸", // Navajo
  iu: "🇨🇦", // Inuktitut
  cr: "🇨🇦", // Cree
  oj: "🇨🇦", // Ojibwe
  chr: "🇺🇸", // Cherokee

  // Special/Constructed Languages
  eo: "🌍", // Esperanto (international)
  ia: "🌍", // Interlingua
  ie: "🌍", // Interlingue

  // Historical/Classical Languages
  la: "🏛️", // Latin (historical)
  sa: "🕉️", // Sanskrit (religious/historical)
  grc: "🇬🇷", // Ancient Greek
  cop: "🇪🇬", // Coptic
  syc: "🏛️", // Classical Syriac
  ang: "🏛️", // Old English
  non: "🏛️", // Old Norse

  // Biblical/Ancient Languages
  hbo: "🇮🇱", // Ancient Hebrew
  arc: "🏛️", // Aramaic
  "el-x-koine": "🇬🇷", // Koine Greek
};

// Language metadata including direction and script info
export const languageMetadata = {
  ar: { direction: "rtl", script: "Arab" },
  he: { direction: "rtl", script: "Hebr" },
  yi: { direction: "rtl", script: "Hebr" },
  fa: { direction: "rtl", script: "Arab" },
  ur: { direction: "rtl", script: "Arab" },
  ps: { direction: "rtl", script: "Arab" },
  ku: { direction: "rtl", script: "Arab" },
  sd: { direction: "rtl", script: "Arab" },
  arc: { direction: "rtl", script: "Armi" },
  hbo: { direction: "rtl", script: "Hebr" },
  syc: { direction: "rtl", script: "Syrc" },
  // All others default to LTR
};

/**
 * Get the primary flag emoji for a language code
 * @param {string} languageCode - The language code (e.g., 'en', 'es')
 * @returns {string} The flag emoji or default fallback
 */
export function getLanguageFlag(languageCode) {
  const flag = languageToFlag[languageCode];
  if (Array.isArray(flag)) {
    return flag[0]; // Return primary flag
  }
  return flag || "🗣️"; // Default fallback
}

/**
 * Get all flags for a language (for tooltips or extended display)
 * @param {string} languageCode - The language code
 * @returns {string[]} Array of flag emojis
 */
export function getAllLanguageFlags(languageCode) {
  const flag = languageToFlag[languageCode];
  if (Array.isArray(flag)) {
    return flag;
  }
  return flag ? [flag] : ["🗣️"];
}

/**
 * Get language direction (LTR or RTL)
 * @param {string} languageCode - The language code
 * @returns {string} 'rtl' or 'ltr'
 */
export function getLanguageDirection(languageCode) {
  return languageMetadata[languageCode]?.direction || "ltr";
}

/**
 * Get formatted language display with flag and direction indicator
 * @param {string} languageCode - The language code
 * @param {string} languageName - The display name of the language
 * @param {object} options - Display options
 * @returns {object} Formatted display data
 */
export function getLanguageDisplay(languageCode, languageName, options = {}) {
  const { showAllFlags = false, showDirection = true, showScript = false } = options;

  const primaryFlag = getLanguageFlag(languageCode);
  const allFlags = getAllLanguageFlags(languageCode);
  const direction = getLanguageDirection(languageCode);
  const metadata = languageMetadata[languageCode];

  const result = {
    flag: primaryFlag,
    name: languageName,
    direction,
    isRTL: direction === "rtl",
  };

  if (showAllFlags && allFlags.length > 1) {
    result.allFlags = allFlags;
    result.flagsTooltip = `Also used in: ${allFlags.slice(1).join(" ")}`;
  }

  if (showDirection && direction === "rtl") {
    result.directionIndicator = "⬅";
  }

  if (showScript && metadata?.script) {
    result.script = metadata.script;
  }

  return result;
}

/**
 * Check if a language code has multiple regional flags
 * @param {string} languageCode - The language code
 * @returns {boolean} True if language has multiple flags
 */
export function hasMultipleFlags(languageCode) {
  const flags = languageToFlag[languageCode];
  return Array.isArray(flags) && flags.length > 1;
}

/**
 * Get language codes that use a specific flag
 * @param {string} flagEmoji - The flag emoji to search for
 * @returns {string[]} Array of language codes using this flag
 */
export function getLanguagesForFlag(flagEmoji) {
  const languages = [];

  for (const [languageCode, flags] of Object.entries(languageToFlag)) {
    if (Array.isArray(flags)) {
      if (flags.includes(flagEmoji)) {
        languages.push(languageCode);
      }
    } else if (flags === flagEmoji) {
      languages.push(languageCode);
    }
  }

  return languages;
}

/**
 * Get a random flag for languages with multiple options
 * Useful for visual variety in repeated displays
 * @param {string} languageCode - The language code
 * @returns {string} A random flag emoji for the language
 */
export function getRandomLanguageFlag(languageCode) {
  const flags = getAllLanguageFlags(languageCode);
  return flags[Math.floor(Math.random() * flags.length)];
}

// Export default function for simple usage
export default getLanguageFlag;
