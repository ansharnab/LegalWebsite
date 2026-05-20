import {
  LegalHeroBlock,
  LegalStatsBlock,
  LegalAboutBlock,
  PracticeAreasBlock,
  TestimonialsBlock,
  LegalContactBlock,
  LegalCtaBlock,
  PageIntroBlock,
  ArticlesListBlock,
  PublicationsListBlock,
} from "../sections/blocks";
import { defaultStyleForType } from "./editorTheme";
import { IMAGES } from "../data/mediaDefaults";
import { ATTORNEY } from "../data/attorneyProfile";

export const PAGE_OPTIONS = [
  { id: "home", label: "Home" },
  { id: "articles", label: "Articles" },
  { id: "publications", label: "Publications" },
];

export const SECTION_TYPES = {
  legalHero: {
    label: "Hero Banner",
    icon: "fa-gavel",
    component: LegalHeroBlock,
    defaultProps: {
      eyebrow: "Advocate · New Delhi",
      title: "Research-Driven Advocacy\nfor Complex Legal Challenges.",
      subtitle:
        "Deputy Counsel at the Delhi International Arbitration Centre. LLM (Business Laws), NLSIU · UGC-NET. Insolvency, arbitration, corporate, IP, and cyber law.",
      primaryLabel: "Schedule Consultation",
      primaryLink: "#contact",
      secondaryLabel: "Practice Areas",
      secondaryLink: "#practice-areas",
      image: IMAGES.heroPortrait,
      backgroundImage: IMAGES.heroBg,
      stat1: "6+",
      label1: "Years Experience",
      stat2: "LLM",
      label2: "NLSIU Bangalore",
      stat3: "UGC-NET",
      label3: "Qualified",
      heroTone: "lavender",
      imagePosition: "right",
    },
    fields: [
      {
        key: "heroTone",
        label: "Hero look",
        type: "select",
        options: [
          { value: "lavender", label: "Soft white lavender" },
          { value: "classic", label: "Classic dark" },
        ],
      },
      {
        key: "imagePosition",
        label: "Portrait position",
        type: "select",
        options: [
          { value: "right", label: "Right" },
          { value: "left", label: "Left" },
        ],
      },
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Headline", type: "textarea" },
      { key: "subtitle", label: "Subheadline", type: "textarea" },
      { key: "primaryLabel", label: "Primary button", type: "text" },
      { key: "primaryLink", label: "Primary link", type: "text" },
      { key: "secondaryLabel", label: "Secondary button", type: "text" },
      { key: "secondaryLink", label: "Secondary link", type: "text" },
      { key: "image", label: "Portrait image", type: "image" },
      { key: "backgroundImage", label: "Hero background image", type: "image" },
      { key: "stat1", label: "Stat 1 value", type: "text" },
      { key: "label1", label: "Stat 1 label", type: "text" },
      { key: "stat2", label: "Stat 2 value", type: "text" },
      { key: "label2", label: "Stat 2 label", type: "text" },
      { key: "stat3", label: "Stat 3 value", type: "text" },
      { key: "label3", label: "Stat 3 label", type: "text" },
    ],
  },
  legalStats: {
    label: "Stats Band",
    icon: "fa-chart-simple",
    component: LegalStatsBlock,
    defaultProps: {
      stat1: "120+",
      label1: "Cases Resolved",
      stat2: "98%",
      label2: "Client Satisfaction",
      stat3: "20+",
      label3: "Years Experience",
      stat4: "24/7",
      label4: "Support Available",
    },
    fields: [
      { key: "stat1", label: "Stat 1 value", type: "text" },
      { key: "label1", label: "Stat 1 label", type: "text" },
      { key: "stat2", label: "Stat 2 value", type: "text" },
      { key: "label2", label: "Stat 2 label", type: "text" },
      { key: "stat3", label: "Stat 3 value", type: "text" },
      { key: "label3", label: "Stat 3 label", type: "text" },
      { key: "stat4", label: "Stat 4 value", type: "text" },
      { key: "label4", label: "Stat 4 label", type: "text" },
    ],
  },
  legalAbout: {
    label: "About Firm",
    icon: "fa-scale-balanced",
    component: LegalAboutBlock,
    defaultProps: {
      title: "Professional Profile",
      body: ATTORNEY.about,
      advocateName: ATTORNEY.name,
      advocateHeadline: ATTORNEY.headline,
      advocateRole: ATTORNEY.currentRole,
      buttonLabel: "Get in Touch",
      buttonLink: "#contact",
      image: IMAGES.about,
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "buttonLabel", label: "Button", type: "text" },
      { key: "buttonLink", label: "Button link", type: "text" },
      { key: "image", label: "Image URL", type: "text" },
    ],
  },
  practiceAreas: {
    label: "Practice Areas",
    icon: "fa-grid-2",
    component: PracticeAreasBlock,
    defaultProps: {
      title: "Practice Areas",
      subtitle: "Insolvency, arbitration, corporate, intellectual property, cyber law, and litigation.",
    },
    fields: [
      { key: "title", label: "Section title", type: "text" },
      { key: "subtitle", label: "Section subtitle", type: "textarea" },
    ],
  },
  testimonials: {
    label: "Testimonials",
    icon: "fa-quote-left",
    component: TestimonialsBlock,
    defaultProps: {
      title: "Client Testimonials",
      subtitle: "Endorsements from colleagues and the legal community.",
    },
    fields: [
      { key: "title", label: "Section title", type: "text" },
      { key: "subtitle", label: "Section subtitle", type: "textarea" },
    ],
  },
  legalContact: {
    label: "Contact Section",
    icon: "fa-envelope",
    component: LegalContactBlock,
    defaultProps: {
      title: "Get In Touch",
      subtitle:
        "Reach out to discuss insolvency, arbitration, corporate, or litigation matters. Based in New Delhi — connect via the form or LinkedIn.",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
    ],
  },
  legalCta: {
    label: "Call to Action",
    icon: "fa-bullhorn",
    component: LegalCtaBlock,
    defaultProps: {
      title: "Need legal guidance?",
      text: "Book a free consultation — we respond within one business day.",
      buttonLabel: "Contact Us",
      buttonLink: "#contact",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "text", label: "Text", type: "textarea" },
      { key: "buttonLabel", label: "Button label", type: "text" },
      { key: "buttonLink", label: "Button link", type: "text" },
    ],
  },
  pageIntro: {
    label: "Page Intro",
    icon: "fa-file-lines",
    component: PageIntroBlock,
    defaultProps: {
      id: "page-intro",
      eyebrow: "Insights",
      title: "Articles & Commentary",
      subtitle: "Research notes and commentary on insolvency, arbitration, and corporate law.",
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
    ],
  },
  articlesList: {
    label: "Articles List",
    icon: "fa-newspaper",
    component: ArticlesListBlock,
    defaultProps: {
      title: "Recent articles",
      subtitle: "Practical perspectives drawn from practice and published work.",
    },
    fields: [
      { key: "title", label: "Section title", type: "text" },
      { key: "subtitle", label: "Section subtitle", type: "textarea" },
      {
        key: "hideHead",
        label: "Hide section heading (use when a Page Intro is above)",
        type: "checkbox",
      },
    ],
  },
  publicationsList: {
    label: "Publications List",
    icon: "fa-book",
    component: PublicationsListBlock,
    defaultProps: {
      title: "Publication list",
      subtitle: "Selected articles, commentary, and academic writing.",
    },
    fields: [
      { key: "title", label: "Section title", type: "text" },
      { key: "subtitle", label: "Section subtitle", type: "textarea" },
      {
        key: "hideHead",
        label: "Hide section heading (use when a Page Intro is above)",
        type: "checkbox",
      },
    ],
  },
};

export function getDefaultSections(pageId) {
  const defaults = {
    home: [
      { id: "s1", type: "legalHero", props: { ...SECTION_TYPES.legalHero.defaultProps } },
      { id: "s2", type: "legalAbout", props: { ...SECTION_TYPES.legalAbout.defaultProps } },
      { id: "s3", type: "practiceAreas", props: { ...SECTION_TYPES.practiceAreas.defaultProps } },
      { id: "s4", type: "testimonials", props: { ...SECTION_TYPES.testimonials.defaultProps } },
      { id: "s5", type: "legalContact", props: { ...SECTION_TYPES.legalContact.defaultProps } },
      { id: "s6", type: "legalCta", props: { ...SECTION_TYPES.legalCta.defaultProps } },
    ],
    articles: [
      {
        id: "a1",
        type: "pageIntro",
        props: {
          id: "articles-hero",
          eyebrow: "Insights",
          title: "Articles & Commentary",
          subtitle:
            "Research notes and commentary on insolvency, arbitration, corporate law, and dispute resolution.",
        },
      },
      {
        id: "a2",
        type: "articlesList",
        props: { ...SECTION_TYPES.articlesList.defaultProps, hideHead: true, title: "", subtitle: "" },
      },
      {
        id: "a3",
        type: "legalCta",
        props: {
          title: "Discuss a legal question?",
          text: "Reach out for a consultation on insolvency, arbitration, or corporate matters.",
          buttonLabel: "Get in Touch",
          buttonLink: "/#contact",
        },
      },
    ],
    publications: [
      {
        id: "p1",
        type: "pageIntro",
        props: {
          id: "publications-hero",
          eyebrow: "Published work",
          title: "Publications",
          subtitle:
            "Selected articles, commentary, and academic writing in insolvency, ADR, and corporate law.",
        },
      },
      {
        id: "p2",
        type: "publicationsList",
        props: { ...SECTION_TYPES.publicationsList.defaultProps, hideHead: true, title: "", subtitle: "" },
      },
      {
        id: "p3",
        type: "legalCta",
        props: {
          title: "Request a copy or citation",
          text: "Contact the office for full text links or speaking engagements related to published work.",
          buttonLabel: "Contact",
          buttonLink: "/#contact",
        },
      },
    ],
  };
  const items = JSON.parse(JSON.stringify(defaults[pageId] || defaults.home));
  return items.map((s) => ({
    ...s,
    style: { ...defaultStyleForType(s.type), ...(s.style || {}) },
  }));
}
