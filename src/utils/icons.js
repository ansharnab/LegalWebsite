/** Font Awesome 6 solid icon names (without fa-solid prefix) */

export const PRACTICE_ICONS_BY_ID = {
  insolvency: "fa-file-invoice-dollar",
  arbitration: "fa-handshake",
  corporate: "fa-briefcase",
  ip: "fa-lightbulb",
  cyber: "fa-shield-halved",
  litigation: "fa-gavel",
  family: "fa-scale-balanced",
  criminal: "fa-gavel",
  realestate: "fa-building",
  injury: "fa-user-injured",
  estate: "fa-file-signature",
};

/** Legacy emoji → FA mapping for saved CMS content */
const EMOJI_TO_FA = {
  "⚖️": "fa-scale-balanced",
  "🏢": "fa-briefcase",
  "🛡️": "fa-gavel",
  "🏠": "fa-building",
  "🤕": "fa-user-injured",
  "📝": "fa-file-signature",
};

export function normalizeFaIcon(icon, fallbackId) {
  if (!icon || typeof icon !== "string") {
    return PRACTICE_ICONS_BY_ID[fallbackId] || "fa-briefcase";
  }
  const trimmed = icon.trim();
  if (EMOJI_TO_FA[trimmed]) return EMOJI_TO_FA[trimmed];
  if (trimmed.startsWith("fa-")) return trimmed;
  if (trimmed.startsWith("fa ")) return trimmed.replace(/^fa\s+/, "fa-");
  return `fa-${trimmed}`;
}

export function faIconClass(icon, fallbackId) {
  const name = normalizeFaIcon(icon, fallbackId);
  return `fa-solid ${name}`;
}
