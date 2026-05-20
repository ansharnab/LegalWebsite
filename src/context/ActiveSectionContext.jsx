import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const SECTION_IDS = ["hero", "about", "practice-areas", "testimonials", "contact"];

const NAV_LOCK_MAX_MS = 4500;
const SCROLL_SPY_DEBOUNCE_MS = 100;
const BOOT_SETTLE_MS = 700;

const ActiveSectionContext = createContext(null);

function getHeaderOffset() {
  if (typeof document === "undefined") return 100;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
  const rem = parseFloat(raw);
  const px = Number.isFinite(rem) ? rem * 16 : 84;
  return px + 16;
}

export function getScrollRoot() {
  if (typeof document === "undefined") return { el: null, isWindow: true };

  const hero = document.getElementById("hero");
  const canvasWrap = document.querySelector(".ve-canvas-wrap");
  if (hero && canvasWrap?.contains(hero)) {
    return { el: canvasWrap, isWindow: false };
  }
  return { el: null, isWindow: true };
}

export function scrollToSection(sectionEl, { behavior = "smooth" } = {}) {
  if (!sectionEl) return;

  const { el: scrollRoot, isWindow } = getScrollRoot();

  if (isWindow) {
    sectionEl.scrollIntoView({ behavior, block: "start" });
    return;
  }

  const offset = getHeaderOffset();
  const top =
    sectionEl.getBoundingClientRect().top -
    scrollRoot.getBoundingClientRect().top +
    scrollRoot.scrollTop -
    offset;
  scrollRoot.scrollTo({ top: Math.max(0, top), behavior });
}

export function scrollToHashSection(id, options) {
  const normalized = id?.replace(/^#/, "");
  if (!normalized) return false;
  const el = document.getElementById(normalized);
  if (!el) return false;
  scrollToSection(el, options);
  return true;
}

function isLayoutSettled() {
  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
  if (sections.length < 2) return false;

  const tops = sections.map((el) => Math.round(el.getBoundingClientRect().top));
  const unique = new Set(tops);
  return unique.size > 1;
}

function detectActiveSection() {
  const { el: scrollRoot, isWindow } = getScrollRoot();
  if (!isWindow && !scrollRoot) return "hero";

  if (!isLayoutSettled()) return "hero";

  const offset = getHeaderOffset();

  if (isWindow && window.scrollY < 24) return "hero";
  if (!isWindow && scrollRoot.scrollTop < 24) return "hero";

  let current = SECTION_IDS[0];

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= offset + 12) {
      current = id;
    }
  }

  if (isWindow) {
    const docH = document.documentElement.scrollHeight;
    const nearBottom =
      window.scrollY > 120 && window.innerHeight + window.scrollY >= docH - 48;
    if (nearBottom) return SECTION_IDS[SECTION_IDS.length - 1];
  } else {
    const nearBottom =
      scrollRoot.scrollTop > 80 &&
      scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 48;
    if (nearBottom) return SECTION_IDS[SECTION_IDS.length - 1];
  }

  return current;
}

export function ActiveSectionProvider({ children }) {
  const { pathname, hash } = useLocation();
  const [activeId, setActiveId] = useState("hero");
  const [isNavigating, setIsNavigating] = useState(false);
  const [gliderInstant, setGliderInstant] = useState(true);
  const navLockRef = useRef(null);
  const debounceRef = useRef(null);
  const bootTimerRef = useRef(null);

  const endNavLock = useCallback(() => {
    const lock = navLockRef.current;
    if (!lock) return;
    if (lock.timer) clearTimeout(lock.timer);
    if (lock.onScroll && lock.target) {
      lock.target.removeEventListener("scroll", lock.onScroll);
    }
    const targetId = lock.targetId;
    navLockRef.current = null;
    setIsNavigating(false);
    setGliderInstant(false);
    setActiveId(
      targetId && document.getElementById(targetId) ? targetId : detectActiveSection()
    );
  }, []);

  const beginNavLock = useCallback(
    (targetId) => {
      const lock = navLockRef.current;
      if (lock?.timer) clearTimeout(lock.timer);
      if (lock?.onScroll && lock?.target) {
        lock.target.removeEventListener("scroll", lock.onScroll);
      }

      const { el: scrollRoot, isWindow } = getScrollRoot();
      const scrollTarget = isWindow ? window : scrollRoot;
      const nextLock = { targetId, target: scrollTarget, timer: null, onScroll: null };

      const tryRelease = () => {
        if (navLockRef.current !== nextLock) return;
        if (detectActiveSection() === targetId) endNavLock();
      };

      const onLockedScroll = () => {
        if (navLockRef.current !== nextLock) return;
        setActiveId(targetId);
        tryRelease();
      };

      nextLock.onScroll = onLockedScroll;
      nextLock.timer = setTimeout(() => {
        if (navLockRef.current !== nextLock) return;
        setActiveId(targetId);
        endNavLock();
      }, NAV_LOCK_MAX_MS);

      if (scrollTarget) {
        scrollTarget.addEventListener("scroll", onLockedScroll, { passive: true });
      }

      navLockRef.current = nextLock;
      setIsNavigating(true);
      setGliderInstant(true);
      setActiveId(targetId);

      requestAnimationFrame(() => {
        setActiveId(targetId);
        tryRelease();
      });
    },
    [endNavLock]
  );

  const navigateToSection = useCallback(
    (id, { behavior = "smooth", updateHash = true } = {}) => {
      const normalized = id?.replace(/^#/, "");
      if (!SECTION_IDS.includes(normalized)) return;

      beginNavLock(normalized);

      const el = document.getElementById(normalized);
      if (el) {
        scrollToSection(el, { behavior });
        if (updateHash && typeof window !== "undefined") {
          const { isWindow } = getScrollRoot();
          if (isWindow) {
            const nextHash = `#${normalized}`;
            if (window.location.hash !== nextHash) {
              window.history.replaceState(null, "", `${window.location.pathname}${nextHash}`);
            }
          }
        }
      }
    },
    [beginNavLock]
  );

  const scheduleSpyUpdate = useCallback(() => {
    if (navLockRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      if (navLockRef.current) return;
      setActiveId(detectActiveSection());
    }, SCROLL_SPY_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const boot = () => {
      setGliderInstant(true);
      setActiveId(detectActiveSection());
      bootTimerRef.current = window.setTimeout(() => {
        setGliderInstant(false);
        setActiveId(detectActiveSection());
      }, BOOT_SETTLE_MS);
    };

    if (document.readyState === "complete") {
      requestAnimationFrame(() => requestAnimationFrame(boot));
    } else {
      window.addEventListener("load", boot, { once: true });
    }

    return () => {
      if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") return undefined;

    const sectionId = hash?.replace(/^#/, "");
    if (!sectionId || !SECTION_IDS.includes(sectionId)) return undefined;

    beginNavLock(sectionId);
    const frame = requestAnimationFrame(() => {
      scrollToHashSection(sectionId, { behavior: "instant" });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, beginNavLock]);

  useEffect(() => {
    if (pathname !== "/") {
      if (navLockRef.current) endNavLock();
      return undefined;
    }

    setGliderInstant(true);
    setActiveId(detectActiveSection());
    const syncTimer = window.setTimeout(() => {
      setGliderInstant(false);
      setActiveId(detectActiveSection());
    }, 80);

    return () => clearTimeout(syncTimer);
  }, [pathname, endNavLock]);

  useEffect(() => {
    if (pathname !== "/") return undefined;

    let ticking = false;
    const onScroll = () => {
      if (navLockRef.current) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        scheduleSpyUpdate();
        ticking = false;
      });
    };

    const { el: scrollRoot, isWindow } = getScrollRoot();
    const target = isWindow ? window : scrollRoot;
    if (!target) return undefined;

    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname, scheduleSpyUpdate]);

  const value = useMemo(
    () => ({
      activeId,
      isNavigating,
      gliderInstant,
      navigateToSection,
      beginNavLock,
    }),
    [activeId, isNavigating, gliderInstant, navigateToSection, beginNavLock]
  );

  return <ActiveSectionContext.Provider value={value}>{children}</ActiveSectionContext.Provider>;
}

export function useActiveSection() {
  const ctx = useContext(ActiveSectionContext);
  if (!ctx) {
    throw new Error("useActiveSection must be used within ActiveSectionProvider");
  }
  return ctx;
}
