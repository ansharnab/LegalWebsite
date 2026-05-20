import { createContext, useCallback, useContext, useMemo, useState } from "react";

const PreviewNavContext = createContext(null);

export function PreviewNavProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  const value = useMemo(
    () => ({ menuOpen, openMenu, closeMenu, toggleMenu }),
    [menuOpen, openMenu, closeMenu, toggleMenu]
  );

  return <PreviewNavContext.Provider value={value}>{children}</PreviewNavContext.Provider>;
}

export function usePreviewNav() {
  return useContext(PreviewNavContext);
}
