import { ATTORNEY } from "./attorneyProfile";

/**
 * Local images under /public/images (served in dev & production).
 * Advocate portrait + professional legal photography (Unsplash/Pexels).
 */

const IMG = "/images";

/** Remote fallbacks when local files are missing (run: npm run media) */
export const REMOTE_IMAGES = {
  heroBg:
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85&auto=format&fit=crop",
  heroPortrait:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85&auto=format&fit=crop",
  practice: {
    insolvency:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=85&auto=format&fit=crop",
    arbitration:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=85&auto=format&fit=crop",
    corporate:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=85&auto=format&fit=crop",
    ip: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=85&auto=format&fit=crop",
    cyber:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=85&auto=format&fit=crop",
    litigation:
      "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&q=85&auto=format&fit=crop",
  },
};

export const IMAGES = {
  /** Hero background — courthouse / legal setting */
  heroBg: `${IMG}/advocacy/hero-courthouse.jpg`,
  /** Hero card & about section — Advocate Saumya Upadhyay */
  heroPortrait: ATTORNEY.photo,
  about: ATTORNEY.photo,
  /** Legacy alias */
  hero: `${IMG}/advocacy/hero-courthouse.jpg`,
  practice: {
    insolvency: `${IMG}/practice/insolvency.jpg`,
    arbitration: `${IMG}/practice/arbitration.jpg`,
    corporate: `${IMG}/practice/corporate.jpg`,
    ip: `${IMG}/practice/ip.jpg`,
    cyber: `${IMG}/practice/cyber.jpg`,
    litigation: `${IMG}/practice/litigation.jpg`,
  },
  advocacy: {
    courthouse: `${IMG}/advocacy/hero-courthouse.jpg`,
    courtroom: `${IMG}/advocacy/courtroom.jpg`,
    library: `${IMG}/advocacy/law-library.jpg`,
  },
};

export function isValidImageUrl(url) {
  if (typeof url !== "string") return false;
  const t = url.trim();
  return /^https?:\/\//i.test(t) || t.startsWith("/");
}

export function resolvePracticeImage(area) {
  if (isValidImageUrl(area?.image)) return area.image.trim();
  return IMAGES.practice[area?.id] || IMAGES.practice.corporate;
}

export function remotePracticeFallback(area) {
  return REMOTE_IMAGES.practice[area?.id] || REMOTE_IMAGES.practice.corporate;
}

/** Hero card portrait — defaults to advocate photo */
export function resolveHeroPortrait(url) {
  if (isValidImageUrl(url) && !url.includes("picsum.photos")) return url.trim();
  return IMAGES.heroPortrait;
}

/** Hero section background */
export function resolveHeroBackground(url) {
  if (isValidImageUrl(url) && !url.includes("picsum.photos")) return url.trim();
  return IMAGES.heroBg;
}

export function resolveHeroImage(url) {
  return resolveHeroPortrait(url);
}
