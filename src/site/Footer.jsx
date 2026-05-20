import { Link } from "react-router-dom";
import { requestDisclaimer } from "../components/DisclaimerGate";
import Reveal from "../components/Reveal";
import { resolveLogoTagline } from "../utils/brandSettings";

export default function Footer({ settings = {} }) {
  const year = new Date().getFullYear();
  const name = settings.advocateName || "Advocate Saumya Upadhyay";
  const tagline =
    settings.footerTagline ||
    "Insolvency, arbitration, corporate law, and dispute resolution — New Delhi, India.";
  const linkedIn = settings.linkedInUrl;

  return (
    <Reveal as="footer" className="site-footer" variant="fade">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <strong>{resolveLogoTagline(settings)}</strong>
          <p>{tagline}</p>
        </div>
        <div>
          <h4>Pages</h4>
          <p>
            <Link to="/articles">Articles</Link>
          </p>
          <p>
            <Link to="/publications">Publications</Link>
          </p>
          <p>
            <Link to="/#about">Profile</Link>
          </p>
          <p>
            <Link to="/#practice-areas">Practice areas</Link>
          </p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>{settings.advocateLocation || "New Delhi, Delhi, India"}</p>
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          )}
          {settings.phone && (
            <p>
              <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            </p>
          )}
          {linkedIn && (
            <p>
              <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="site-footer__bar">
        <div className="container">
          <p>
            © {year} {name}. All rights reserved.
          </p>
          <p className="site-footer__bci">
            The Bar Council of India does not permit advertisement or solicitation by advocates.{" "}
            <button type="button" className="site-footer__disclaimer-link" onClick={requestDisclaimer}>
              View disclaimer
            </button>
          </p>
        </div>
      </div>
    </Reveal>
  );
}
