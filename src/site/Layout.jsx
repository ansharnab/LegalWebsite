import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ActiveSectionProvider } from "../context/ActiveSectionContext";
import Header from "./Header";
import Footer from "./Footer";
import DisclaimerGate, {
  DISCLAIMER_SHOW_EVENT,
  DISCLAIMER_STORAGE_KEY,
} from "../components/DisclaimerGate";
import PageSectionsView from "../builder/PageSectionsView";
import { useSiteContent } from "../hooks/useSiteContent";
import { mergeSiteContent } from "../utils/mergeSiteData";
import { resolveLogoTagline } from "../utils/brandSettings";

export default function Layout() {
  const { content, loading, getPageSections } = useSiteContent();
  const { settings } = useMemo(() => mergeSiteContent(content || {}), [content]);
  const { pathname, hash } = useLocation();
  const PAGE_BY_PATH = {
    "/": "home",
    "/articles": "articles",
    "/publications": "publications",
  };
  const pageId = PAGE_BY_PATH[pathname] ?? null;
  const customSections = pageId ? getPageSections(pageId) : null;
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const handleDisclaimerAgree = () => {
    setDisclaimerAccepted(true);
  };

  useEffect(() => {
    sessionStorage.removeItem(DISCLAIMER_STORAGE_KEY);
  }, []);

  useEffect(() => {
    const show = () => setDisclaimerAccepted(false);
    window.addEventListener(DISCLAIMER_SHOW_EVENT, show);
    return () => window.removeEventListener(DISCLAIMER_SHOW_EVENT, show);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("disclaimer-gate-open", !disclaimerAccepted);
    return () => document.body.classList.remove("disclaimer-gate-open");
  }, [disclaimerAccepted]);

  useEffect(() => {
    if (!disclaimerAccepted) return undefined;
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    return undefined;
  }, [pathname, hash, disclaimerAccepted]);

  useEffect(() => {
    if (loading) {
      setReady(false);
      setShowPreloader(true);
      return undefined;
    }
    const frame = requestAnimationFrame(() => setReady(true));
    const hide = setTimeout(() => setShowPreloader(false), 480);
    const forceHide = setTimeout(() => setShowPreloader(false), 3500);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(hide);
      clearTimeout(forceHide);
    };
  }, [loading]);

  if (!disclaimerAccepted) {
    return <DisclaimerGate settings={settings} onAgree={handleDisclaimerAgree} />;
  }

  return (
    <ActiveSectionProvider>
      <div className={`site-shell${ready ? " is-ready" : ""}`}>
        {showPreloader && (
          <div className={`preloader${ready ? " preloader--done" : ""}`} aria-hidden="true">
            <p className="preloader__brand">{resolveLogoTagline(settings)}</p>
            <div className="preloader__spinner" />
          </div>
        )}
        <Header settings={settings} />
        <main className="site-main">
          {customSections ? <PageSectionsView sections={customSections} /> : <Outlet />}
        </main>
        <Footer settings={settings} />
      </div>
    </ActiveSectionProvider>
  );
}
