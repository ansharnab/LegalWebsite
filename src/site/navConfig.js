/** Shared header / mobile nav items for live site and preview */

export const SITE_NAV = [
  { label: "Home", href: "#hero", id: "hero", hash: true },
  { label: "About", href: "#about", id: "about", hash: true },
  { label: "Practice", href: "#practice-areas", id: "practice-areas", hash: true },
  { label: "Articles", href: "/articles", id: "articles", route: true },
  { label: "Publications", href: "/publications", id: "publications", route: true, short: "Pubs" },
  { label: "Testimonials", href: "#testimonials", id: "testimonials", hash: true, short: "Reviews" },
  { label: "Contact", href: "#contact", id: "contact", hash: true },
];

export function navHref(item, pathname = "/") {
  if (item.route) return item.href;
  if (pathname === "/") return item.href;
  return `/${item.href}`;
}

export function getNavHighlightId(pathname = "/", activeSectionId = "hero") {
  if (pathname === "/articles") return "articles";
  if (pathname === "/publications") return "publications";
  if (pathname === "/") return activeSectionId || "hero";
  return activeSectionId || "hero";
}

export function isNavItemActive(item, { pathname = "/", activeSectionId = "hero" } = {}) {
  return item.id === getNavHighlightId(pathname, activeSectionId);
}
