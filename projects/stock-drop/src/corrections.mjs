// Spelling fixes applied to descriptions and section names at build time.
// The client's sheet is left as sent. Only add brand names and other spellings
// that are certainly wrong, never wording choices. Approved by Hammad, 2026-10-10.
// Each pattern matches whole words only, so an already-correct "Carhartt" is left alone.

export const CORRECTIONS = [
  { find: /\bCarhart\b/g, replace: "Carhartt" },
  { find: /\bLevis\b/g, replace: "Levi's" },
  { find: /\blee\b/g, replace: "Lee" },
  { find: /\bwrangler\b/g, replace: "Wrangler" },
  { find: /\bHarley Davidson\b/g, replace: "Harley-Davidson" },
  { find: /\bNascar\b/g, replace: "NASCAR" },
];

// Section names as buyers should see them, keyed by the exact name in the sheet.
export const SECTION_NAMES = {
  "3 button": "Collar T-shirts (3 buttons)", // Hammad, 2026-10-10
  // The client's own headings from their July 2026 carousel (docs/research/july-carousel.md)
  Baby: "Children (0–14 years)",
  Overall: "Overalls",
  Pants: "Cotton Pants",
  Winter: "Winter Mix",
};

export function correct(text) {
  return CORRECTIONS.reduce((t, c) => t.replace(c.find, c.replace), text);
}

export function correctSection(name) {
  return SECTION_NAMES[name] ?? correct(name);
}
