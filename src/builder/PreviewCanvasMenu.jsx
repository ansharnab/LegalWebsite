import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "../context/ActiveSectionContext";
import { SITE_NAV, isNavItemActive, navHref } from "../site/navConfig";
import { usePreviewNav } from "./PreviewNavContext";

function syncBackdropTop() {
  const canvas = document.querySelector(".ve-canvas");
  const header = document.querySelector(".ve-chrome-block .site-header");
  if (!canvas || !header) return;
  canvas.style.setProperty("--preview-nav-backdrop-top", `${header.getBoundingClientRect().height}px`);
}

export default function PreviewCanvasMenu({ ctaLabel = "Schedule Consultation", ctaLink = "#contact" }) {
  const { menuOpen, closeMenu } = usePreviewNav();
  const { pathname } = useLocation();
  const { activeId, navigateToSection } = useActiveSection();
  const [showBackdrop, setShowBackdrop] = useState(false);
  const openedAtRef = useRef(0);

  useLayoutEffect(() => {
    const canvas = document.querySelector(".ve-canvas");
    if (!canvas) return undefined;

    canvas.classList.toggle("ve-canvas--menu-open", menuOpen);

    if (!menuOpen) {
      setShowBackdrop(false);
      return () => {
        canvas.classList.remove("ve-canvas--menu-open");
      };
    }

    openedAtRef.current = performance.now();
    syncBackdropTop();

    const backdropTimer = window.setTimeout(() => setShowBackdrop(true), 450);

    return () => {
      window.clearTimeout(backdropTimer);
      canvas.classList.remove("ve-canvas--menu-open");
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!menuOpen) return undefined;
    const onResize = () => syncBackdropTop();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const dismissBackdrop = useCallback(() => {
    if (performance.now() - openedAtRef.current < 450) return;
    closeMenu();
  }, [closeMenu]);

  const onHashNav = useCallback(
    (item, e) => {
      e?.preventDefault();
      e?.stopPropagation();
      closeMenu();
      const id = item.id || item.href?.slice(1);
      if (id) navigateToSection(id);
    },
    [closeMenu, navigateToSection]
  );

  const navActive = (item) => isNavItemActive(item, { pathname, activeSectionId: activeId });

  if (!menuOpen) return null;

  return (
    <div className="nav-menu nav-menu--preview nav-menu--preview-host" role="presentation">
      {showBackdrop ? (
        <button type="button" className="nav-backdrop" aria-label="Close menu" onClick={dismissBackdrop} />
      ) : null}
      <nav id="site-mobile-menu" className="nav-drawer" aria-label="Site menu">
        <div className="nav-drawer__head">
          <strong>Menu</strong>
          <button type="button" className="nav-drawer__close" aria-label="Close menu" onClick={closeMenu}>
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <ul className="nav-drawer__list">
          {SITE_NAV.map((item) => (
            <li key={item.id}>
              {item.route ? (
                <Link
                  to={item.href}
                  className={navActive(item) ? "is-active" : ""}
                  onClick={() => closeMenu()}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={navHref(item, pathname)}
                  className={navActive(item) ? "is-active" : ""}
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
