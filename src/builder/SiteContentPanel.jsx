import { useEffect, useState } from "react";
import axios from "axios";
import { practiceAreas as defaultAreas, defaultTestimonials, defaultFeatures } from "../data/siteData";
import { defaultArticles, defaultPublications } from "../data/writing";
import { getDefaultSiteContent } from "../utils/mergeSiteData";
import "./site-content-panel.css";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("legal-advisor-admin-token")}` };
}

const TABS = [
  { id: "brand", label: "Brand", icon: "fa-scale-balanced" },
  { id: "practice", label: "Practice Areas", icon: "fa-grid-2" },
  { id: "testimonials", label: "Testimonials", icon: "fa-quote-left" },
  { id: "articles", label: "Articles", icon: "fa-newspaper" },
  { id: "publications", label: "Publications", icon: "fa-book" },
  { id: "contact", label: "Contact & Disclaimer", icon: "fa-envelope" },
];

function Field({ label, children }) {
  return (
    <div className="scp-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function normalizeContent(data) {
  const defaults = getDefaultSiteContent();
  return {
    pages: data?.pages || {},
    settings: { ...defaults.settings, ...(data?.settings || {}) },
    site: {
      practiceAreas: defaultAreas.map((p) => {
        const saved = data?.site?.practiceAreas?.find((x) => x.id === p.id);
        return {
          ...p,
          title: saved?.title ?? p.title,
          summary: saved?.summary ?? p.summary,
          icon: saved?.icon ?? p.icon,
          hidden: saved?.hidden === true,
        };
      }),
      testimonials: data?.site?.testimonials?.length
        ? data.site.testimonials
        : defaultTestimonials,
      features: data?.site?.features?.length ? data.site.features : defaultFeatures,
      articles: data?.site?.articles?.length ? data.site.articles : defaultArticles,
      publications: data?.site?.publications?.length ? data.site.publications : defaultPublications,
    },
  };
}

export default function SiteContentPanel({
  initialTab = "brand",
  content: controlledContent,
  setContent: setControlledContent,
  onSaved,
}) {
  const [tab, setTab] = useState(initialTab);
  const [localContent, setLocalContent] = useState({ pages: {}, settings: {}, site: {} });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const isControlled = Boolean(setControlledContent);
  const content = isControlled ? controlledContent : localContent;
  const setContent = isControlled ? setControlledContent : setLocalContent;

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const load = () => {
    axios.get("/api/content").then((r) => {
      const normalized = normalizeContent(r.data);
      if (isControlled) setContent(normalized);
      else setLocalContent(normalized);
      onSaved?.(normalized);
    });
  };

  useEffect(() => {
    if (!isControlled) load();
  }, [isControlled]);

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      const fresh = await axios.get("/api/content");
      const base = fresh.data || {};
      const next = {
        ...base,
        settings: content.settings,
        site: content.site,
      };
      await axios.put("/api/content", next, { headers: authHeaders() });
      setContent(next);
      setStatus("Site content saved.");
      onSaved?.(next);
    } catch {
      setStatus("Save failed. Is the API running?");
    } finally {
      setSaving(false);
    }
  };

  const patchSettings = (patch) => setContent((c) => ({ ...c, settings: { ...c.settings, ...patch } }));

  const patchPractice = (id, patch) => {
    setContent((c) => ({
      ...c,
      site: {
        ...c.site,
        practiceAreas: c.site.practiceAreas.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      },
    }));
  };

  const patchTestimonial = (id, patch) => {
    setContent((c) => ({
      ...c,
      site: {
        ...c.site,
        testimonials: c.site.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      },
    }));
  };

  const patchArticle = (id, patch) => {
    setContent((c) => ({
      ...c,
      site: {
        ...c.site,
        articles: c.site.articles.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      },
    }));
  };

  const patchPublication = (id, patch) => {
    setContent((c) => ({
      ...c,
      site: {
        ...c.site,
        publications: c.site.publications.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      },
    }));
  };

  const s = content.settings || {};
  const areas = content.site?.practiceAreas || [];
  const testimonials = content.site?.testimonials || [];
  const articles = content.site?.articles || [];
  const publications = content.site?.publications || [];

  return (
    <div className="scp-root">
      <header className="scp-header">
        <div>
          <h1>Site Content</h1>
          <p>Brand, practice areas, testimonials, and contact details used across the site.</p>
        </div>
        <button type="button" className="ve-btn ve-btn--primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save site content"}
        </button>
      </header>
      {status && <p className="scp-status">{status}</p>}

      <div className="scp-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? "is-active" : ""}
            onClick={() => setTab(t.id)}
          >
            <i className={`fa-solid ${t.icon}`} /> {t.label}
          </button>
        ))}
      </div>

      <div className="scp-panel">
        {tab === "brand" && (
          <>
            <Field label="Logo tagline (header — no personal name)">
              <input
                value={s.logoTagline || ""}
                onChange={(e) => patchSettings({ logoTagline: e.target.value })}
                placeholder="Advocate · New Delhi"
              />
            </Field>
            <Field label="Footer name (first part)">
              <input value={s.logoText || ""} onChange={(e) => patchSettings({ logoText: e.target.value })} />
            </Field>
            <Field label="Footer name (second part)">
              <input value={s.logoAccent || ""} onChange={(e) => patchSettings({ logoAccent: e.target.value })} />
            </Field>
            <Field label="Logo image URL">
              <input
                value={s.logoImage || ""}
                onChange={(e) => patchSettings({ logoImage: e.target.value })}
                placeholder="/images/brand-mark.svg"
              />
            </Field>
            <Field label="Advocate name">
              <input
                value={s.advocateName || ""}
                onChange={(e) => patchSettings({ advocateName: e.target.value })}
              />
            </Field>
            <Field label="Headline (credentials)">
              <input
                value={s.advocateHeadline || ""}
                onChange={(e) => patchSettings({ advocateHeadline: e.target.value })}
              />
            </Field>
            <Field label="Current role">
              <input value={s.advocateRole || ""} onChange={(e) => patchSettings({ advocateRole: e.target.value })} />
            </Field>
            <Field label="LinkedIn profile URL">
              <input value={s.linkedInUrl || ""} onChange={(e) => patchSettings({ linkedInUrl: e.target.value })} />
            </Field>
            <Field label="Header CTA label">
              <input
                value={s.headerCtaLabel || ""}
                onChange={(e) => patchSettings({ headerCtaLabel: e.target.value })}
              />
            </Field>
            <Field label="Footer tagline">
              <textarea
                rows={2}
                value={s.footerTagline || ""}
                onChange={(e) => patchSettings({ footerTagline: e.target.value })}
              />
            </Field>
            <Field label="About features (one per line)">
              <textarea
                rows={4}
                value={(content.site?.features || []).join("\n")}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    site: { ...c.site, features: e.target.value.split("\n").filter(Boolean) },
                  }))
                }
              />
            </Field>
          </>
        )}

        {tab === "practice" &&
          areas.map((area) => (
            <article key={area.id} className="scp-card">
              <h3>{area.title}</h3>
              <Field label="Title">
                <input value={area.title} onChange={(e) => patchPractice(area.id, { title: e.target.value })} />
              </Field>
              <Field label="Summary">
                <textarea
                  rows={2}
                  value={area.summary}
                  onChange={(e) => patchPractice(area.id, { summary: e.target.value })}
                />
              </Field>
              <Field label="Icon (Font Awesome class, e.g. fa-gavel)">
                <input
                  value={area.icon}
                  onChange={(e) => patchPractice(area.id, { icon: e.target.value })}
                  placeholder="fa-briefcase"
                />
              </Field>
              <Field label="Card image URL">
                <input
                  value={area.image || ""}
                  onChange={(e) => patchPractice(area.id, { image: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <label className="scp-check">
                <input
                  type="checkbox"
                  checked={area.hidden}
                  onChange={(e) => patchPractice(area.id, { hidden: e.target.checked })}
                />
                Hide on site
              </label>
            </article>
          ))}

        {tab === "articles" &&
          articles.map((article) => (
            <article key={article.id} className="scp-card">
              <h3>{article.title}</h3>
              <Field label="Title">
                <input
                  value={article.title}
                  onChange={(e) => patchArticle(article.id, { title: e.target.value })}
                />
              </Field>
              <Field label="Excerpt (card preview)">
                <textarea
                  rows={3}
                  value={article.excerpt}
                  onChange={(e) => patchArticle(article.id, { excerpt: e.target.value })}
                />
              </Field>
              <Field label="Full text (shown when card is expanded)">
                <textarea
                  rows={5}
                  value={article.body || ""}
                  onChange={(e) => patchArticle(article.id, { body: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <input
                  value={article.category || ""}
                  onChange={(e) => patchArticle(article.id, { category: e.target.value })}
                />
              </Field>
              <Field label="Date (YYYY-MM-DD)">
                <input
                  value={article.date || ""}
                  onChange={(e) => patchArticle(article.id, { date: e.target.value })}
                />
              </Field>
              <Field label="Read time (minutes)">
                <input
                  type="number"
                  min={1}
                  value={article.readMinutes || ""}
                  onChange={(e) =>
                    patchArticle(article.id, { readMinutes: Number(e.target.value) || undefined })
                  }
                />
              </Field>
              <Field label="External URL (optional)">
                <input
                  value={article.url || ""}
                  onChange={(e) => patchArticle(article.id, { url: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <label className="scp-check">
                <input
                  type="checkbox"
                  checked={article.hidden}
                  onChange={(e) => patchArticle(article.id, { hidden: e.target.checked })}
                />
                Hide on site
              </label>
            </article>
          ))}

        {tab === "publications" &&
          publications.map((pub) => (
            <article key={pub.id} className="scp-card">
              <h3>{pub.title}</h3>
              <Field label="Title">
                <input value={pub.title} onChange={(e) => patchPublication(pub.id, { title: e.target.value })} />
              </Field>
              <Field label="Outlet">
                <input
                  value={pub.outlet || ""}
                  onChange={(e) => patchPublication(pub.id, { outlet: e.target.value })}
                />
              </Field>
              <Field label="Year">
                <input value={pub.year || ""} onChange={(e) => patchPublication(pub.id, { year: e.target.value })} />
              </Field>
              <Field label="Type">
                <input
                  value={pub.type || ""}
                  onChange={(e) => patchPublication(pub.id, { type: e.target.value })}
                  placeholder="Article, Commentary, Academic"
                />
              </Field>
              <Field label="Summary (card preview)">
                <textarea
                  rows={2}
                  value={pub.summary || ""}
                  onChange={(e) => patchPublication(pub.id, { summary: e.target.value })}
                />
              </Field>
              <Field label="Full text (shown when card is expanded)">
                <textarea
                  rows={5}
                  value={pub.body || ""}
                  onChange={(e) => patchPublication(pub.id, { body: e.target.value })}
                />
              </Field>
              <Field label="URL (optional)">
                <input
                  value={pub.url || ""}
                  onChange={(e) => patchPublication(pub.id, { url: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <label className="scp-check">
                <input
                  type="checkbox"
                  checked={pub.hidden}
                  onChange={(e) => patchPublication(pub.id, { hidden: e.target.checked })}
                />
                Hide on site
              </label>
            </article>
          ))}

        {tab === "testimonials" &&
          testimonials.map((t) => (
            <article key={t.id} className="scp-card">
              <h3>{t.name}</h3>
              <Field label="Quote">
                <textarea rows={3} value={t.quote} onChange={(e) => patchTestimonial(t.id, { quote: e.target.value })} />
              </Field>
              <Field label="Name">
                <input value={t.name} onChange={(e) => patchTestimonial(t.id, { name: e.target.value })} />
              </Field>
              <Field label="Role">
                <input value={t.role} onChange={(e) => patchTestimonial(t.id, { role: e.target.value })} />
              </Field>
              <Field label="Initials">
                <input
                  value={t.initials}
                  onChange={(e) => patchTestimonial(t.id, { initials: e.target.value })}
                />
              </Field>
            </article>
          ))}

        {tab === "contact" && (
          <>
            <Field label="Email">
              <input value={s.email || ""} onChange={(e) => patchSettings({ email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input value={s.phone || ""} onChange={(e) => patchSettings({ phone: e.target.value })} />
            </Field>
            <Field label="Address">
              <textarea rows={3} value={s.address || ""} onChange={(e) => patchSettings({ address: e.target.value })} />
            </Field>
            <Field label="Disclaimer paragraph 1">
              <textarea
                rows={4}
                value={s.disclaimerParagraph1 || ""}
                onChange={(e) => patchSettings({ disclaimerParagraph1: e.target.value })}
              />
            </Field>
            <Field label="Disclaimer paragraph 2">
              <textarea
                rows={4}
                value={s.disclaimerParagraph2 || ""}
                onChange={(e) => patchSettings({ disclaimerParagraph2: e.target.value })}
              />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}
