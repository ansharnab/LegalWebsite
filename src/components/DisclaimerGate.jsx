import { createPortal } from "react-dom";
import { DisclaimerLogoMark } from "./SiteLogoMark";

/** Legacy key — cleared on load so an old “agreed” flag does not skip the gate. */
export const DISCLAIMER_STORAGE_KEY = "legal-advisor-disclaimer-agreed";

export const DISCLAIMER_SHOW_EVENT = "legal-advisor-show-disclaimer";

export function requestDisclaimer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DISCLAIMER_SHOW_EVENT));
  }
}

const DEFAULT_P1 =
  "The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner. By accessing this website, you acknowledge and confirm that you are seeking information relating to Advocate Saumya Upadhyay of your own accord and that there has been no form of solicitation, advertisement or inducement.";

const DEFAULT_P2 =
  "The content of this website is for informational purposes only and should not be interpreted as soliciting or advertisement. No material/information provided on this website should be construed as legal advice.";

/**
 * Full-screen gate — site is not shown until the user clicks I Agree.
 */
export default function DisclaimerGate({ settings = {}, onAgree }) {
  const p1 = settings.disclaimerParagraph1 || DEFAULT_P1;
  const p2 = settings.disclaimerParagraph2 || DEFAULT_P2;

  return createPortal(
    <div
      className="disclaimer-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-gate-title"
    >
      <div className="disclaimer-gate__card">
        <DisclaimerLogoMark settings={settings} />
        <p className="disclaimer-gate__eyebrow">Legal notice</p>
        <h1 id="disclaimer-gate-title" className="disclaimer-gate__title">
          Disclaimer
        </h1>
        <div className="disclaimer-gate__body">
          <p>{p1}</p>
          <p>{p2}</p>
        </div>
        <p className="disclaimer-gate__required">
          You must read and accept this disclaimer to access the website.
        </p>
        <button type="button" className="btn btn--primary disclaimer-gate__btn" onClick={onAgree}>
          I Agree — Enter Website
        </button>
      </div>
    </div>,
    document.body
  );
}
