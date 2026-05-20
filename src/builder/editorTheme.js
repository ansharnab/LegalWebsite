/** Theme presets & default section styles for the visual editor */

export const THEME_PRESETS = [
  {
    id: "brand",
    label: "Legal Brand",
    icon: "fa-palette",
    swatch: "linear-gradient(135deg, #0f172a, #734f96)",
    style: {
      background: "linear-gradient(135deg, #0f172a 0%, #2c3e50 100%)",
      textColor: "#e2e8f0",
      headingColor: "#ffffff",
      accentColor: "#734f96",
    },
  },
  {
    id: "light",
    label: "Clean Light",
    icon: "fa-sun",
    swatch: "#f8fafc",
    style: {
      background: "#ffffff",
      textColor: "#475569",
      headingColor: "#0f172a",
      accentColor: "#734f96",
    },
  },
  {
    id: "dark",
    label: "Dark Pro",
    icon: "fa-moon",
    swatch: "#0f172a",
    style: {
      background: "#0f172a",
      textColor: "#cbd5e1",
      headingColor: "#f8fafc",
      accentColor: "#734f96",
    },
  },
  {
    id: "lavender",
    label: "Lavender Accent",
    icon: "fa-gavel",
    swatch: "#734f96",
    style: {
      background: "linear-gradient(135deg, #734f96, #5b3c88)",
      textColor: "#ffffff",
      headingColor: "#ffffff",
      accentColor: "#0f172a",
    },
  },
  {
    id: "lavenderLight",
    label: "Soft Lavender",
    icon: "fa-feather",
    swatch: "linear-gradient(135deg, #faf8fc, #e9dff5)",
    style: {
      background: "linear-gradient(165deg, #ffffff 0%, #f7f2fb 42%, #efe6f8 100%)",
      textColor: "#475569",
      headingColor: "#1e293b",
      accentColor: "#734f96",
    },
  },
];

export const PADDING_OPTIONS = [
  { id: "compact", label: "Compact", py: "2rem" },
  { id: "default", label: "Default", py: "3.5rem" },
  { id: "spacious", label: "Spacious", py: "5rem" },
];

export const DEFAULT_SECTION_STYLE = {
  theme: "brand",
  background: "",
  textColor: "",
  headingColor: "",
  accentColor: "",
  padding: "default",
  textAlign: "left",
  fontScale: 1,
};

const LIGHT_THEMES = new Set(["light", "lavenderLight"]);

export function isLightSectionTheme(style = {}, sectionType, heroTone) {
  const theme = style.theme || defaultStyleForType(sectionType).theme;
  const resolvedHeroTone =
    heroTone || (sectionType === "legalHero" ? "lavender" : undefined);
  if (
    sectionType === "legalHero" &&
    (resolvedHeroTone === "lavender" || resolvedHeroTone === "light")
  ) {
    return true;
  }
  return LIGHT_THEMES.has(theme);
}

const TYPE_STYLE_HINTS = {
  legalHero: { theme: "lavenderLight", padding: "default" },
  legalStats: { theme: "lavender", padding: "compact" },
  legalAbout: { theme: "light", padding: "default" },
  practiceAreas: { theme: "light", padding: "default" },
  testimonials: { theme: "light", padding: "default" },
  legalContact: { theme: "dark", padding: "default" },
  legalCta: { theme: "lavender", padding: "default", textAlign: "center" },
  pageIntro: { theme: "lavender", padding: "default", textAlign: "center" },
  articlesList: { theme: "light", padding: "default" },
  publicationsList: { theme: "light", padding: "default" },
};

export function defaultStyleForType(type) {
  return { ...DEFAULT_SECTION_STYLE, ...(TYPE_STYLE_HINTS[type] || {}) };
}

export function mergeSectionStyle(style = {}, type) {
  const base = defaultStyleForType(type);
  const preset = THEME_PRESETS.find((t) => t.id === (style.theme || base.theme));
  const fromPreset = preset?.style || {};
  return {
    ...base,
    ...fromPreset,
    ...style,
    background: style.background || fromPreset.background || base.background || "",
    textColor: style.textColor || fromPreset.textColor || "",
    headingColor: style.headingColor || fromPreset.headingColor || "",
    accentColor: style.accentColor || fromPreset.accentColor || "#734f96",
  };
}

export function styleToCssVars(style, type) {
  const m = mergeSectionStyle(style, type);
  const pad = PADDING_OPTIONS.find((p) => p.id === m.padding) || PADDING_OPTIONS[1];
  return {
    "--ve-sec-bg": m.background || undefined,
    "--ve-sec-color": m.textColor || undefined,
    "--ve-sec-heading": m.headingColor || m.textColor || undefined,
    "--ve-sec-accent": m.accentColor || undefined,
    "--ve-sec-py": pad.py,
    "--ve-sec-align": m.textAlign || "left",
    "--ve-sec-scale": m.fontScale || 1,
  };
}

export function normalizeSection(section) {
  if (!section) return section;
  const style = { ...defaultStyleForType(section.type), ...(section.style || {}) };
  if (section.type === "legalHero" && style.theme === "brand") {
    style.theme = "lavenderLight";
  }
  const props = { ...(section.props || {}) };
  if (section.type === "legalHero" && !props.heroTone) {
    props.heroTone = "lavender";
  }
  return { ...section, style, props };
}
