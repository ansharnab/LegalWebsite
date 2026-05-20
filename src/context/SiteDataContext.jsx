import { createContext, useContext, useMemo } from "react";
import { useSiteContent } from "../hooks/useSiteContent";
import { mergeSiteContent } from "../utils/mergeSiteData";

export const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const { content, loading, settings: rawSettings, ...rest } = useSiteContent();
  const merged = useMemo(() => mergeSiteContent(content), [content]);

  const value = useMemo(
    () => ({
      ...rest,
      content,
      loading,
      settings: merged.settings,
      practiceAreas: merged.practiceAreas,
      testimonials: merged.testimonials,
      features: merged.features,
      articles: merged.articles,
      publications: merged.publications,
    }),
    [rest, content, loading, merged]
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider");
  return ctx;
}

export function useSiteDataOptional() {
  return useContext(SiteDataContext);
}
