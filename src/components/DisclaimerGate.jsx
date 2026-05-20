import { useState } from "react";
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

const DEFAULT_POINTS = [
  "The Bar Council of India does not permit advertisement or solicitation by advocates.",
  "You are accessing this site on your own initiative, without solicitation or inducement.",
  "Material on this site is for information only and is not legal advice.",
  "No lawyer–client relationship is created by use of this website.",
];

function disclaimerPoints(settings) {
  const p1 = settings.disclaimerParagraph1?.trim();
  const p2 = settings.disclaimerParagraph2?.trim();
  if (p1 || p2) {
    return [p1, p2].filter(Boolean);
  }
  return DEFAULT_POINTS;
}

/**
 * Full-screen gate — site is not shown until the user clicks I Agree.
 */
export default function DisclaimerGate({ settings = {}, onAgree }) {
  const [declined, setDeclined] = useState(false);
  const points = disclaimerPoints(settings);

  return createPortal(
    <div
      className="disclaimer-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-gate-title"
    >
      <div className="disclaimer-gate__card">
        <DisclaimerLogoMark settings={settings} />
        {!declined ? (
          <>
            <h1 id="disclaimer-gate-title" className="disclaimer-gate__title">
              Disclaimer
            </h1>
            <p className="disclaimer-gate__lead">
              Please read the following before you continue. This is not a legal notice.
            </p>
            <ul className="disclaimer-gate__list">
              {points.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
            <p className="disclaimer-gate__required">
              Select <strong>I Agree</strong> to enter the site, or <strong>Don&apos;t Agree</strong> to
              leave.
            </p>
            <div className="disclaimer-gate__actions">
              <button
                type="button"
                className="btn btn--outline disclaimer-gate__btn disclaimer-gate__btn--decline"
                onClick={() => setDeclined(true)}
              >
                Don&apos;t Agree
              </button>
              <button type="button" className="btn btn--primary disclaimer-gate__btn" onClick={onAgree}>
                I Agree
              </button>
            </div>
          </>
        ) : (
          <div className="disclaimer-gate__declined">
            <h2 className="disclaimer-gate__declined-title">Access not granted</h2>
            <p>
              You chose not to accept the disclaimer. This website is only available to visitors who
              agree.
            </p>
            <p>You may close this tab or return to review the disclaimer.</p>
            <div className="disclaimer-gate__actions">
              <button
                type="button"
                className="btn btn--outline disclaimer-gate__btn"
                onClick={() => setDeclined(false)}
              >
                Back to disclaimer
              </button>
              <button type="button" className="btn btn--primary disclaimer-gate__btn" onClick={onAgree}>
                I Agree
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
