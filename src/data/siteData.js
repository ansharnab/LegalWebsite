import { IMAGES } from "./mediaDefaults";
import { PRACTICE_ICONS_BY_ID } from "../utils/icons";

export const practiceAreas = [
  {
    id: "insolvency",
    icon: PRACTICE_ICONS_BY_ID.insolvency,
    title: "Insolvency & Bankruptcy",
    summary:
      "Corporate insolvency, restructuring, and disputes before NCLT, NCLAT, and courts under the IBC.",
    image: IMAGES.practice.insolvency,
  },
  {
    id: "arbitration",
    icon: PRACTICE_ICONS_BY_ID.arbitration,
    title: "Arbitration & ADR",
    summary:
      "Domestic and institutional arbitration, mediation, and dispute resolution strategy — including work at the Delhi International Arbitration Centre.",
    image: IMAGES.practice.arbitration,
  },
  {
    id: "corporate",
    icon: PRACTICE_ICONS_BY_ID.corporate,
    title: "Corporate & Commercial",
    summary:
      "Contracts, corporate governance, commercial litigation, and advisory before courts, tribunals, and arbitral forums.",
    image: IMAGES.practice.corporate,
  },
  {
    id: "ip",
    icon: PRACTICE_ICONS_BY_ID.ip,
    title: "Intellectual Property",
    summary:
      "Patent infringement (including SEP matters), IP enforcement, and portfolio-related disputes and advisory.",
    image: IMAGES.practice.ip,
  },
  {
    id: "cyber",
    icon: PRACTICE_ICONS_BY_ID.cyber,
    title: "Cyber Law & Data Protection",
    summary:
      "Data protection, privacy compliance, cyber-crime, and technology law. PG Certificate in Cybersecurity & Ethical Hacking (IIT Patna).",
    image: IMAGES.practice.cyber,
  },
  {
    id: "litigation",
    icon: PRACTICE_ICONS_BY_ID.litigation,
    title: "Constitutional & Litigation",
    summary:
      "Writs, civil suits, criminal revision, execution, and negotiable instruments matters before the Supreme Court, High Courts, and district courts.",
    image: IMAGES.practice.litigation,
  },
];

export const defaultTestimonials = [
  {
    id: "t1",
    quote:
      "Works on insolvency matters with structured research and preparation for hearings and filings.",
    name: "Anil Khanna",
    role: "Colleague",
    initials: "AK",
  },
  {
    id: "t2",
    quote:
      "Worked together on insolvency, electricity law, and arbitration matters at Sarthak Advocates & Solicitors.",
    name: "Rahul Bangia",
    role: "Former colleague, Sarthak Advocates & Solicitors",
    initials: "RB",
  },
  {
    id: "t3",
    quote: "Writes and teaches on insolvency, ADR, corporate law, and cyber law.",
    name: "Peer note",
    role: "Legal community",
    initials: "LE",
  },
];

export const defaultFeatures = [
  "LLM (Business Laws), NLSIU Bangalore",
  "Deputy Counsel, Delhi International Arbitration Centre",
  "UGC-NET | Bar Council of India Enrolled",
  "Courts, Tribunals & Arbitration Experience",
];
