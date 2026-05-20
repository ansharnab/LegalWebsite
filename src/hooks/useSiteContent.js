import { useEffect, useState } from "react";
import axios from "axios";
import { normalizeSection } from "../builder/editorTheme";

export function useSiteContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    axios
      .get("/api/content", { signal: controller.signal, timeout: 8000 })
      .then((res) => setContent(res.data))
      .catch(() => setContent({ pages: {}, settings: {} }))
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const getPageSections = (pageId) => {
    const sec = content?.pages?.[pageId]?.sections;
    if (!sec?.items?.length || sec.enabled === false) return null;
    return sec.items.map(normalizeSection);
  };

  const settings = content?.settings || {};

  return { content, loading, settings, getPageSections, setContent };
}
