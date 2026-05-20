import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePreviewNav } from "../builder/PreviewNavContext";
import SiteLogoMark from "../components/SiteLogoMark";
import { useActiveSection } from "../context/ActiveSectionContext";
import { SITE_NAV, getNavHighlightId, isNavItemActive, navHref } from "./navConfig";

const VIEWPORT_COMPACT_MAX = 1100;

function getViewportCompact(previewDevice) {
  if (previewDevice) return previewDevice === "mobile" || previewDevice === "tablet";
  if (typeof window !== "undefined") {
    return window.matchMedia(`(max-width: ${VIEWPORT_COMPACT_MAX}px)`).matches;
  }
  return false;
}

function MobileMenu({ pathname, onClose, onBackdropClose, onHashNav, onRouteNav, isActive, ctaLabel, ctaLink }) {
  return (
    <div className="nav-menu nav-menu--live" role="presentation">
      <button type="button" className="nav-backdrop" aria-label="Close menu" onClick={onBackdropClose} />
      <nav id="site-mobile-menu" className="nav-drawer" aria-label="Site menu">
        <div className="nav-drawer__head">
          <strong>Menu</strong>
          <button type="button" className="nav-drawer__close" aria-label="Close menu" onClick={onClose}>
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <ul className="nav-drawer__list">
          {SITE_NAV.map((item) => (
            <li key={item.id}>
              {item.route ? (
                <Link
                  to={item.href}
                  data-nav-id={item.id}
                  className={isActive(item) ? "is-active" : ""}
                  onClick={() => onRouteNav()}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={navHref(item, pathname)}
                  data-nav-id={item.id}
                  className={isActive(item) ? "is-active" : ""}
                  onClick={(e) => onHashNav(item, e)}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <a
          className="btn btn--primary nav-drawer__cta"
          href={navHref({ href: ctaLink }, pathname)}
          onClick={(e) => onHashNav({ href: ctaLink, id: "contact", hash: true }, e)}
        >
          {ctaLabel}
        </a>
      </nav>
    </div>
  );
}

export default function Header({ settings = {}, previewDevice }) {
  const previewNav = usePreviewNav();
  const isPreview = Boolean(previewDevice);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [liveMenuOpen, setLiveMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [liveCompact, setLiveCompact] = useState(() => getViewportCompact(previewDevice));
  const { activeId, navigateToSection, isNavigating, gliderInstant } = useActiveSection();
  const navTrackRef = useRef(null);
  const highlightId = getNavHighlightId(pathname, activeId);
  const [navGlider, setNavGlider] = useState({ left: 0, width: 0, ready: false });

  const ctaLabel = settings.headerCtaLabel || "Schedule Consultation";
  const ctaLink = settings.headerCtaLink || "#contact";

  const compact = isPreview
    ? previewDevice === "mobile" || previewDevice === "tablet"
    : liveCompact;

  const menuOpen = isPreview ? Boolean(previewNav?.menuOpen) : liveMenuOpen;

  useEffect(() => {
    if (previewDevice) return undefined;
    const mq = window.matchMedia(`(max-width: ${VIEWPORT_COMPACT_MAX}px)`);
    const sync = () => {
      const nextCompact = mq.matches;
      setLiveCompact(nextCompact);
      if (!nextCompact) setLiveMenuOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [previewDevice]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const positionNavGlider = useCallback(() => {
    const track = navTrackRef.current;
    if (!track) return;
    const active = track.querySelector(`[data-nav-id="${highlightId}"]`);
    if (!active) {
      setNavGlider((g) => ({ ...g, ready: false }));
      return;
    }
    setNavGlider({
      left: active.offsetLeft,
      width: active.offsetWidth,
      ready: true,
    });
  }, [highlightId]);

  useLayoutEffect(() => {
    if (compact) return;
    positionNavGlider();
    const id = requestAnimationFrame(positionNavGlider);
    return () => cancelAnimationFrame(id);
  }, [highlightId, pathname, compact, positionNavGlider, gliderInstant]);

  useEffect(() => {
    if (compact) return undefined;
    const onResize = () => positionNavGlider();
    window.addEventListener("resize", onResize, { passive: true });
    const track = navTrackRef.current;
    const ro = track ? new ResizeObserver(() => positionNavGlider()) : null;
    ro?.observe(track);
    document.fonts?.ready?.then(positionNavGlider);
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [compact, positionNavGlider, highlightId]);

  const closeLiveMenu = useCallback(() => {
    setLiveMenuOpen(false);
    document.body.classList.remove("nav-open");
  }, []);

  const openLiveMenu = useCallback(() => {
    if (!compact) return;
    setLiveMenuOpen(true);
    document.body.classList.add("nav-open");
  }, [compact]);

  useEffect(() => {
    if (isPreview || !liveMenuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeLiveMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPreview, liveMenuOpen, closeLiveMenu]);

  useEffect(() => () => document.body.classList.remove("nav-open"), []);

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent?.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
    if (isPreview) {
      if (menuOpen) {
        previewNav?.closeMenu();
      } else {
        previewNav?.openMenu();
        document.querySelector(".ve-canvas-wrap")?.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }
    if (liveMenuOpen) closeLiveMenu();
    else openLiveMenu();
  };

  const stopNavToggleBubble = (e) => {
    e.stopPropagation();
    if (e.nativeEvent?.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  const dismissNav = useCallback(() => {
    if (isPreview) previewNav?.closeMenu();
    else closeLiveMenu();
  }, [isPreview, previewNav, closeLiveMenu]);

  const onRouteNav = useCallback(() => {
    dismissNav();
  }, [dismissNav]);

  const onHashNav = useCallback(
    (item, e) => {
      if (!item?.hash && !item?.href?.startsWith("#")) return;
      e?.preventDefault();
      e?.stopPropagation();
      dismissNav();
      const hash = item.href.startsWith("#") ? item.href : `#${item.href}`;
      if (isPreview) {
        const id = item.id || hash.slice(1);
        if (id) navigateToSection(id);
        return;
      }
      const id = item.id || hash.slice(1);
      if (!id) return;
      if (pathname === "/") {
        navigateToSection(id);
      } else {
        navigate({ pathname: "/", hash: id });
      }
    },
    [dismissNav, isPreview, pathname, navigate, navigateToSection]
  );

  const navActive = useCallback(
    (item) => isNavItemActive(item, { pathname, activeSectionId: activeId }),
    [pathname, activeId]
  );

  useEffect(() => {
    if (!compact) positionNavGlider();
  }, [pathname, compact, positionNavGlider]);

  const liveMenuLayer =
    !isPreview && liveMenuOpen && compact ? (
      <MobileMenu
        pathname={pathname}
        onClose={closeLiveMenu}
        onBackdropClose={closeLiveMenu}
        onHashNav={onHashNav}
        onRouteNav={onRouteNav}
        isActive={navActive}
        ctaLabel={ctaLabel}
        ctaLink={ctaLink}
      />
    ) : null;

  const livePortaledMenu =
    typeof document !== "undefined"
      ? createPortal(liveMenuLayer, document.body, "site-mobile-menu-layer")
      : null;

  return (
    <header
      className={[
        "site-header",
        compact ? "site-header--compact" : "site-header--desktop",
        scrolled ? "site-header--scrolled" : "",
        isNavigating ? "site-header--navigating" : "",
        menuOpen ? "site-header--open" : "",
        previewDevice ? `site-header--preview-${previewDevice}` : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="site-header__shell">
        <div className="site-header__inner">
          <Link
            className="site-brand site-brand--mark-only"
            to="/"
            aria-label="Home"
            onClick={(e) => {
              if (pathname === "/") {
                onHashNav({ href: "#hero", id: "hero", hash: true }, e);
              } else {
                onRouteNav();
              }
            }}
          >
            <SiteLogoMark settings={settings} />
          </Link>

          {!compact && (
            <nav className="site-nav" aria-label="Main">
              <div className="site-nav__track" ref={navTrackRef}>
                {SITE_NAV.map((item) =>
                  item.route ? (
                    <Link
                      key={item.id}
                      to={item.href}
                      data-nav-id={item.id}
                      className={navActive(item) ? "is-active" : ""}
                      onClick={onRouteNav}
                    >
                      <span className="nav-label nav-label--full">{item.label}</span>
                      {item.short ? <span className="nav-label nav-label--short">{item.short}</span> : null}
                    </Link>
                  ) : (
                    <a
                      key={item.id}
                      href={navHref(item, pathname)}
                      data-nav-id={item.id}
                      className={navActive(item) ? "is-active" : ""}
                      onClick={(e) => onHashNav(item, e)}
                    >
                      <span className="nav-label nav-label--full">{item.label}</span>
                      {item.short ? <span className="nav-label nav-label--short">{item.short}</span> : null}
                    </a>
                  )
                )}
                <span
                  className={`site-nav__glider${navGlider.ready ? " site-nav__glider--ready" : ""}${
                    isNavigating || gliderInstant ? " site-nav__glider--instant" : ""
                  }${isNavigating ? " site-nav__glider--moving" : ""}`}
                  aria-hidden="true"
                  style={{
                    width: navGlider.width ? `${navGlider.width}px` : 0,
                    transform: `translate3d(${navGlider.left}px, 0, 0)`,
                  }}
                />
              </div>
            </nav>
          )}

          <div className="site-header__actions">
            {!compact && (
              <a
                className="site-header__cta btn btn--primary"
                href={navHref({ href: ctaLink }, pathname)}
                onClick={(e) => onHashNav({ href: ctaLink, id: "contact", hash: true }, e)}
              >
                <span className="site-header__cta-long">{ctaLabel}</span>
                <span className="site-header__cta-brief">Consult</span>
              </a>
            )}
            {compact && (
              <button
                type="button"
                className="nav-toggle"
                aria-expanded={menuOpen}
                aria-controls="site-mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onPointerDown={stopNavToggleBubble}
                onClick={toggleMenu}
              >
                <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
      {!isPreview ? livePortaledMenu : null}
    </header>
  );
}
