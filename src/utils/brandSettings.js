const DEFAULT_LOGO_TAGLINE = "Advocate · New Delhi";

function containsPersonalName(text, settings) {
  if (!text?.trim()) return false;
  const lower = text.toLowerCase();
  const parts = [
    settings?.logoText,
    settings?.logoAccent,
    settings?.advocateName?.replace(/^advocate\s+/i, ""),
  ]
    .filter(Boolean)
    .map((p) => p.toLowerCase());

  return parts.some((part) => part.length > 2 && lower.includes(part));
}

/** Tagline safe for header/footer logo areas — never a personal name. */
export function resolveLogoTagline(settings = {}) {
  const raw = settings.logoTagline?.trim();
  if (raw && !containsPersonalName(raw, settings)) return raw;
  return DEFAULT_LOGO_TAGLINE;
}

export function normalizeBrandSettings(settings = {}) {
  return {
    ...settings,
    logoTagline: resolveLogoTagline(settings),
  };
}
