import { useEffect, useRef } from "react";

export default function SiteHeaderInspector({
  settings = {},
  focusField,
  onChange,
  onOpenSiteContent,
}) {
  const patch = (p) => onChange?.({ ...settings, ...p });
  const ctaInputRef = useRef(null);

  useEffect(() => {
    if (focusField === "cta" && ctaInputRef.current) {
      ctaInputRef.current.focus();
      ctaInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusField]);

  return (
    <div className="ve-inspector">
      <div className="ve-inspector__head">
        <i className="fa-solid fa-bars" aria-hidden="true" />
        <div>
          <h3>Site header</h3>
          <p>Logo and consultation button for the live header.</p>
        </div>
      </div>

      <div className="ve-inspector__panel">
        <p className="ve-inspector__hint">
          Click the logo or CTA in the preview to jump here. Practice areas and testimonials are under{" "}
          <strong>Site Content</strong>.
        </p>

        <div className="field">
          <label htmlFor="hdr-logo-tagline">Logo tagline</label>
          <input
            id="hdr-logo-tagline"
            type="text"
            value={settings.logoTagline || ""}
            onChange={(e) => patch({ logoTagline: e.target.value })}
            placeholder="Advocate · New Delhi"
          />
          <p className="ve-inspector__hint" style={{ marginTop: "0.35rem" }}>
            Used in footer and loading screen. Header shows the symbol only.
          </p>
        </div>

        <div className="field">
          <label htmlFor="hdr-logo-image">Logo image URL</label>
          <input
            id="hdr-logo-image"
            type="text"
            value={settings.logoImage || ""}
            onChange={(e) => patch({ logoImage: e.target.value })}
            placeholder="/images/brand-mark.svg"
          />
          <p className="ve-inspector__hint" style={{ marginTop: "0.35rem" }}>
            Symbol only (no initials). Upload in Media, then paste the path here.
          </p>
        </div>

        <div className="field">
          <label htmlFor="hdr-cta-label">Header CTA label</label>
          <input
            id="hdr-cta-label"
            ref={ctaInputRef}
            type="text"
            value={settings.headerCtaLabel || ""}
            onChange={(e) => patch({ headerCtaLabel: e.target.value })}
            placeholder="Schedule Consultation"
          />
        </div>

        <div className="field">
          <label htmlFor="hdr-cta-link">Header CTA link</label>
          <input
            id="hdr-cta-link"
            type="text"
            value={settings.headerCtaLink || "#contact"}
            onChange={(e) => patch({ headerCtaLink: e.target.value })}
            placeholder="#contact"
          />
        </div>

        <button type="button" className="ve-btn ve-inspector__full" onClick={onOpenSiteContent}>
          <i className="fa-solid fa-sliders" aria-hidden="true" /> Open Site Content panel
        </button>
      </div>
    </div>
  );
}
