import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Image from "../site/Image";
import Reveal from "../components/Reveal";
import { useActiveSection } from "../context/ActiveSectionContext";
import { practiceAreas as defaultAreas, defaultTestimonials } from "../data/siteData";
import { defaultArticles, defaultPublications } from "../data/writing";
import { ATTORNEY } from "../data/attorneyProfile";
import { IMAGES, REMOTE_IMAGES } from "../data/mediaDefaults";
import { useSiteDataOptional } from "../context/SiteDataContext";
import { VeEditable } from "../builder/VeInlineEdit";
import { faIconClass } from "../utils/icons";

function HashLink({ to, className, children }) {
  if (to?.startsWith("/")) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  const href = to?.startsWith("#") ? to : `#${to || "contact"}`;
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/** Hero stat card — scrolls to a section on home or navigates to another page */
function HeroStatLink({ href, className, children, style, "aria-label": ariaLabel }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { navigateToSection } = useActiveSection();
  const isRoute = href.startsWith("/") && !href.includes("#");

  if (isRoute) {
    return (
      <Link to={href} className={className} style={style} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  const sectionId = href.replace(/^#/, "");
  const anchorHref = pathname === "/" ? href : `/${href}`;

  const onClick = (e) => {
    e.preventDefault();
    if (pathname === "/") {
      navigateToSection(sectionId);
    } else {
      navigate({ pathname: "/", hash: sectionId });
    }
  };

  return (
    <a href={anchorHref} className={className} style={style} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </a>
  );
}

function formatArticleDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function isExternalUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url.trim());
}

function WritingCardActions({ url, contactLabel = "Request full text" }) {
  const external = isExternalUrl(url);
  return (
    <div className="writing-card__actions">
      {external ? (
        <a href={url.trim()} target="_blank" rel="noopener noreferrer" className="writing-card__link">
          Read online →
        </a>
      ) : null}
      <HashLink to="/#contact" className="writing-card__link">
        {contactLabel} →
      </HashLink>
    </div>
  );
}

function ArticleCard({ article }) {
  const fullText = article.body?.trim() || article.excerpt || "";
  const preview = article.excerpt || fullText;

  return (
    <details className="writing-card writing-card--expandable">
      <summary className="writing-card__summary">
        <div className="writing-card__meta">
          {article.category ? <span className="writing-card__tag">{article.category}</span> : null}
          {article.date ? <time dateTime={article.date}>{formatArticleDate(article.date)}</time> : null}
          {article.readMinutes ? <span>{article.readMinutes} min read</span> : null}
        </div>
        <h3>{article.title}</h3>
        <p className="writing-card__preview">{preview}</p>
        <span className="writing-card__toggle" aria-hidden="true">
          Read full article
        </span>
      </summary>
      <div className="writing-card__detail">
        {fullText.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <WritingCardActions url={article.url} />
      </div>
    </details>
  );
}

function PublicationCard({ pub }) {
  const fullText = pub.body?.trim() || pub.summary || "";

  return (
    <details className="publication-item publication-item--expandable">
      <summary className="publication-item__summary">
        <div className="publication-item__head">
          {pub.type ? <span className="writing-card__tag">{pub.type}</span> : null}
          {pub.year ? <span className="publication-item__year">{pub.year}</span> : null}
        </div>
        <h3>{pub.title}</h3>
        {pub.outlet ? <p className="publication-item__outlet">{pub.outlet}</p> : null}
        {pub.summary ? <p className="publication-item__summary-text">{pub.summary}</p> : null}
        <span className="writing-card__toggle" aria-hidden="true">
          View details
        </span>
      </summary>
      <div className="publication-item__detail">
        {fullText.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <WritingCardActions url={pub.url} contactLabel="Request publication details" />
      </div>
    </details>
  );
}

export function LegalHeroBlock({
  eyebrow = "Advocate · New Delhi",
  title = "Advocacy in insolvency, arbitration,\ncorporate law, and dispute resolution.",
  subtitle = "",
  primaryLabel = "Schedule Consultation",
  primaryLink = "#contact",
  secondaryLabel = "Practice Areas",
  secondaryLink = "#practice-areas",
  image,
  backgroundImage,
  stat1 = "6+",
  label1 = "Years Experience",
  stat2 = "LLM",
  label2 = "NLSIU Bangalore",
  stat3 = "UGC-NET",
  label3 = "Exam",
  heroTone = "lavender",
  imagePosition = "right",
}) {
  const lavender = heroTone === "lavender" || heroTone === "light";
  const portrait = image || IMAGES.heroPortrait;
  const bg = backgroundImage || IMAGES.heroBg;
  const credentials = [
    { value: stat1, label: label1, icon: "fa-briefcase" },
    { value: stat2, label: label2, icon: "fa-graduation-cap" },
    { value: stat3, label: label3, icon: "fa-award" },
  ];

  return (
    <section
      id="hero"
      className={`hero${lavender ? " hero--lavender" : " hero--dark"}`}
      data-image-pos={imagePosition}
    >
      <div className="hero__mesh" aria-hidden="true" />
      <div className="hero__orbs" aria-hidden="true">
        <span className="hero__orb hero__orb--1" />
        <span className="hero__orb hero__orb--2" />
        <span className="hero__orb hero__orb--3" />
      </div>
      <div className="hero__bg" aria-hidden="true">
        <Image src={bg} alt="" variant="heroBg" className="hero__bg-img" priority />
      </div>
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            <VeEditable field="eyebrow">{eyebrow}</VeEditable>
          </p>
          <h1 className="hero__title" style={{ whiteSpace: "pre-line" }}>
            <VeEditable field="title" multiline>
              {title}
            </VeEditable>
          </h1>
          <p className="hero__lead">
            <VeEditable field="subtitle" multiline>
              {subtitle}
            </VeEditable>
          </p>
          <div className="hero__actions">
            {primaryLabel && (
              <HashLink to={primaryLink} className="btn btn--primary">
                <VeEditable field="primaryLabel">{primaryLabel}</VeEditable>
              </HashLink>
            )}
            {secondaryLabel && (
              <HashLink to={secondaryLink} className="btn btn--outline">
                <VeEditable field="secondaryLabel">{secondaryLabel}</VeEditable>
              </HashLink>
            )}
          </div>
          <HeroStatLink
            href="#about"
            className="hero__credentials"
            aria-label="View profile — experience and qualifications"
          >
            <div className="hero__credentials-grid">
              {credentials.map((item, i) => (
                <div key={item.label} className="hero__credential" style={{ "--stat-i": i }}>
                  <span className="hero__stat-icon" aria-hidden="true">
                    <i className={`fa-solid ${item.icon}`} />
                  </span>
                  <strong className="hero__stat-value">
                    <VeEditable field={`stat${i + 1}`}>{item.value}</VeEditable>
                  </strong>
                  <span className="hero__stat-label">
                    <VeEditable field={`label${i + 1}`}>{item.label}</VeEditable>
                  </span>
                </div>
              ))}
            </div>
            <span className="hero__credentials-go">View profile →</span>
            <span className="hero__stat-shine" aria-hidden="true" />
          </HeroStatLink>
        </div>
        <div className="hero__portrait-wrap">
          <div className="hero__portrait">
            <Image src={portrait} alt={ATTORNEY.name} variant="portrait" priority />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalStatsBlock({ stat1, label1, stat2, label2, stat3, label3, stat4, label4 }) {
  const items = [
    { value: stat1, label: label1 },
    { value: stat2, label: label2 },
    { value: stat3, label: label3 },
    { value: stat4, label: label4 },
  ].filter((x) => x.value && x.label);

  return (
    <section className="stats-band">
      <div className="container stats-band__grid">
        {items.map((s, i) => (
          <Reveal key={s.label} className="stats-band__item" variant="scale" delay={i * 90}>
            <strong>
              <VeEditable field={`stat${i + 1}`}>{s.value}</VeEditable>
            </strong>
            <span>
              <VeEditable field={`label${i + 1}`}>{s.label}</VeEditable>
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function LegalAboutBlock({
  title = "Profile",
  body,
  buttonLabel = "Get in Touch",
  buttonLink = "#contact",
  image,
  advocateName,
  advocateHeadline,
  advocateRole,
}) {
  const ctx = useSiteDataOptional();
  const settings = ctx?.settings || {};
  const features = ctx?.features || [];
  const aboutBody = body || ATTORNEY.about;
  const name = advocateName || settings.advocateName || ATTORNEY.name;
  const headline = advocateHeadline || settings.advocateHeadline || ATTORNEY.headline;
  const role = advocateRole || settings.advocateRole || ATTORNEY.currentRole;
  const location = settings.advocateLocation || settings.address || ATTORNEY.location;
  const linkedIn = settings.linkedInUrl || ATTORNEY.linkedIn;

  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <Reveal variant="left" className="about__media">
          <Image src={image || IMAGES.about} alt={name} variant="portrait" />
        </Reveal>
        <Reveal variant="right" delay={80} className="about__content">
          <p className="eyebrow">About the Advocate</p>
          <p className="about__name">{name}</p>
          <p className="about__meta">{headline}</p>
          <p className="about__role">{role}</p>
          <p className="about__location">
            <i className="fa-solid fa-location-dot" aria-hidden="true" /> {location}
          </p>
          <h2>
            <VeEditable field="title">{title}</VeEditable>
          </h2>
          <div className="about__body">
            <VeEditable field="body" multiline>
              {aboutBody}
            </VeEditable>
          </div>
          <ul className="about__features stagger-in">
            {features.map((item) => (
              <li key={item}>
                <i className="fa-solid fa-check" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <div className="about__actions">
            {buttonLabel && (
              <HashLink to={buttonLink} className="btn btn--outline">
                <VeEditable field="buttonLabel">{buttonLabel}</VeEditable>
              </HashLink>
            )}
            {linkedIn && (
              <a href={linkedIn} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin" aria-hidden="true" /> LinkedIn
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PracticeAreasBlock({ title = "Practice Areas", subtitle = "" }) {
  const ctx = useSiteDataOptional();
  const areas = (ctx?.practiceAreas || defaultAreas).filter((a) => !a.hidden);

  return (
    <section id="practice-areas" className="section practice">
      <div className="container">
        <Reveal as="header" className="section-head" variant="blur">
          <p className="eyebrow">Expertise</p>
          <h2>
            <VeEditable field="title">{title}</VeEditable>
          </h2>
          <p className="section-lead">
            <VeEditable field="subtitle" multiline>
              {subtitle}
            </VeEditable>
          </p>
        </Reveal>
        <div className="practice__grid">
          {areas.map((area, index) => (
            <Reveal key={area.id} as="article" className="practice-card" delay={index * 70}>
              <div className="practice-card__img">
                <Image
                  src={area.image || IMAGES.practice[area.id]}
                  alt={area.title}
                  variant="practice"
                />
              </div>
              <div className="practice-card__body">
                <i className={faIconClass(area.icon, area.id)} aria-hidden="true" />
                <h3>{area.title}</h3>
                <p>{area.summary}</p>
                <a href="#contact">Discuss this area →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsBlock({ title = "References", subtitle = "" }) {
  const ctx = useSiteDataOptional();
  const items = ctx?.testimonials || defaultTestimonials;

  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <Reveal as="header" className="section-head" variant="blur">
          <p className="eyebrow">References</p>
          <h2>
            <VeEditable field="title">{title}</VeEditable>
          </h2>
          <p className="section-lead">
            <VeEditable field="subtitle" multiline>
              {subtitle}
            </VeEditable>
          </p>
        </Reveal>
        <div className="testimonials__grid">
          {items.map((t, index) => (
            <Reveal key={t.id} as="blockquote" className="testimonial-card" delay={index * 90}>
              <span className="testimonial-card__mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="testimonial-card__quote">{t.quote}</p>
              <footer className="testimonial-card__footer">
                <div className="testimonial-card__avatar" aria-hidden="true">
                  {t.initials}
                </div>
                <div className="testimonial-card__author">
                  <strong>{t.name}</strong>
                  <span className="testimonial-card__role">{t.role}</span>
                </div>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LegalContactBlock({ title = "Get In Touch", subtitle = "" }) {
  const ctx = useSiteDataOptional();
  const settings = ctx?.settings || {};
  const [status, setStatus] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    try {
      await axios.post("/api/contact", data);
      setStatus("Thank you. Your message was sent.");
      form.reset();
    } catch {
      setStatus("Could not send. Please try again or use LinkedIn.");
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container contact__grid">
        <Reveal variant="left" className="contact__info">
          <p className="eyebrow eyebrow--light">Contact</p>
          <h2>
            <VeEditable field="title">{title}</VeEditable>
          </h2>
          <p className="section-lead section-lead--light">
            <VeEditable field="subtitle" multiline>
              {subtitle}
            </VeEditable>
          </p>
          <ul className="contact__list stagger-in">
            <li>
              <i className="fa-solid fa-location-dot" aria-hidden="true" />
              {settings.address || settings.advocateLocation || ATTORNEY.location}
            </li>
            {settings.phone && (
              <li>
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </li>
            )}
            {settings.email && (
              <li>
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {settings.linkedInUrl && (
              <li>
                <i className="fa-brands fa-linkedin" aria-hidden="true" />
                <a href={settings.linkedInUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </Reveal>
        <Reveal variant="fade" delay={100} as="form" className="contact__form" onSubmit={onSubmit}>
          <div className="stagger-in">
            <label>
              Name
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              Email
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <label>
              Phone
              <input name="phone" autoComplete="tel" />
            </label>
            <label>
              Message
              <textarea name="message" rows={4} required />
            </label>
            <button type="submit" className="btn btn--primary">
              Send message
            </button>
            {status && <p className="contact__status">{status}</p>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PageIntroBlock({
  id = "page-intro",
  eyebrow = "Insights",
  title = "Articles",
  subtitle = "",
}) {
  return (
    <section id={id} className="section page-intro">
      <div className="container page-intro__inner">
        <Reveal variant="blur">
          <p className="eyebrow">
            <VeEditable field="eyebrow">{eyebrow}</VeEditable>
          </p>
          <h1>
            <VeEditable field="title">{title}</VeEditable>
          </h1>
          {subtitle ? (
            <p className="section-lead">
              <VeEditable field="subtitle" multiline>
                {subtitle}
              </VeEditable>
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

export function ArticlesListBlock({ title = "Recent articles", subtitle = "", hideHead = false }) {
  const ctx = useSiteDataOptional();
  const items = (ctx?.articles || defaultArticles).filter((a) => !a.hidden);
  const showHead = !hideHead && (title?.trim() || subtitle?.trim());

  return (
    <section id="articles" className="section writing-list">
      <div className="container">
        {showHead ? (
          <Reveal as="header" className="section-head" variant="blur">
            <p className="eyebrow">Articles</p>
            <h2>
              <VeEditable field="title">{title}</VeEditable>
            </h2>
            {subtitle ? (
              <p className="section-lead">
                <VeEditable field="subtitle" multiline>
                  {subtitle}
                </VeEditable>
              </p>
            ) : null}
          </Reveal>
        ) : null}
        <div className="writing-grid">
          {items.length === 0 ? (
            <p className="writing-list__empty">No articles to display yet. Add entries in Site Content → Articles.</p>
          ) : (
            items.map((article) => <ArticleCard key={article.id} article={article} />)
          )}
        </div>
      </div>
    </section>
  );
}

export function PublicationsListBlock({ title = "Publication list", subtitle = "", hideHead = false }) {
  const ctx = useSiteDataOptional();
  const items = (ctx?.publications || defaultPublications).filter((p) => !p.hidden);
  const showHead = !hideHead && (title?.trim() || subtitle?.trim());

  return (
    <section id="publications" className="section writing-list writing-list--publications">
      <div className="container">
        {showHead ? (
          <Reveal as="header" className="section-head" variant="blur">
            <p className="eyebrow">Publications</p>
            <h2>
              <VeEditable field="title">{title}</VeEditable>
            </h2>
            {subtitle ? (
              <p className="section-lead">
                <VeEditable field="subtitle" multiline>
                  {subtitle}
                </VeEditable>
              </p>
            ) : null}
          </Reveal>
        ) : null}
        <ul className="publication-list">
          {items.length === 0 ? (
            <li className="writing-list__empty">
              No publications to display yet. Add entries in Site Content → Publications.
            </li>
          ) : (
            items.map((pub) => (
              <li key={pub.id}>
                <PublicationCard pub={pub} />
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

export function LegalCtaBlock({
  title = "Need legal guidance?",
  text = "Book a consultation — inquiries are reviewed promptly.",
  buttonLabel = "Contact",
  buttonLink = "#contact",
}) {
  return (
    <section className="section cta-band">
      <Reveal className="container cta-band__inner" variant="blur">
        <h2>
          <VeEditable field="title">{title}</VeEditable>
        </h2>
        <p>
          <VeEditable field="text" multiline>
            {text}
          </VeEditable>
        </p>
        <HashLink to={buttonLink} className="btn btn--primary">
          <VeEditable field="buttonLabel">{buttonLabel}</VeEditable>
        </HashLink>
      </Reveal>
    </section>
  );
}
