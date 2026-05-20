import { practiceAreas, defaultTestimonials, defaultFeatures } from "../data/siteData";
import { defaultArticles, defaultPublications } from "../data/writing";
import { ATTORNEY } from "../data/attorneyProfile";
import { IMAGES, isValidImageUrl } from "../data/mediaDefaults";
import { normalizeBrandSettings } from "./brandSettings";
import { normalizeFaIcon } from "./icons";

export function getDefaultSiteContent() {
  return {
    settings: {
      logoText: ATTORNEY.logoText,
      logoAccent: ATTORNEY.logoAccent,
      logoTagline: ATTORNEY.logoTagline,
      logoImage: ATTORNEY.logoImage,
      advocateName: ATTORNEY.name,
      advocateHeadline: ATTORNEY.headline,
      advocateRole: ATTORNEY.currentRole,
      advocateLocation: ATTORNEY.location,
      linkedInUrl: ATTORNEY.linkedIn,
      headerCtaLabel: "Schedule Consultation",
      headerCtaLink: "#contact",
      email: "",
      phone: "",
      address: ATTORNEY.location,
      footerTagline:
        "Research-driven advocacy in insolvency, arbitration, corporate law, and dispute resolution — New Delhi, India.",
      disclaimerParagraph1:
        "The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner. By accessing this website, you acknowledge and confirm that you are seeking information relating to Advocate Saumya Upadhyay of your own accord and that there has been no form of solicitation, advertisement or inducement.",
      disclaimerParagraph2:
        "The content of this website is for informational purposes only and should not be interpreted as soliciting or advertisement. No material/information provided on this website should be construed as legal advice.",
    },
    site: {
      practiceAreas: practiceAreas.map((p) => ({ ...p, hidden: false })),
      testimonials: defaultTestimonials,
      features: defaultFeatures,
      articles: defaultArticles,
      publications: defaultPublications,
    },
  };
}

export function mergeSiteContent(content) {
  const defaults = getDefaultSiteContent();
  const savedAreas = content?.site?.practiceAreas;
  const savedTestimonials = content?.site?.testimonials;

  return {
    settings: normalizeBrandSettings({ ...defaults.settings, ...(content?.settings || {}) }),
    practiceAreas: practiceAreas.map((p) => {
      const saved = savedAreas?.find((x) => x.id === p.id);
      return {
        ...p,
        title: saved?.title ?? p.title,
        summary: saved?.summary ?? p.summary,
        icon: normalizeFaIcon(saved?.icon, p.id),
        image:
          isValidImageUrl(saved?.image) && !saved.image.includes("picsum.photos")
            ? saved.image.trim()
            : p.image ?? IMAGES.practice[p.id],
        hidden: saved?.hidden === true,
      };
    }),
    testimonials: savedTestimonials?.length ? savedTestimonials : defaults.site.testimonials,
    features: content?.site?.features?.length ? content.site.features : defaults.site.features,
    articles: content?.site?.articles?.length ? content.site.articles : defaults.site.articles,
    publications: content?.site?.publications?.length
      ? content.site.publications
      : defaults.site.publications,
  };
}
