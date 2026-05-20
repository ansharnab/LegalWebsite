const DEFAULT_LOGO_IMAGE = "/images/brand-mark.svg";
const DEFAULT_LOGO_ICON = "fa-landmark";

/**
 * Header / gate mark: image URL from settings, else Font Awesome icon.
 */
export default function SiteLogoMark({
  settings = {},
  className = "site-brand__icon",
  imageClassName = "site-brand__img",
}) {
  const src = settings.logoImage || DEFAULT_LOGO_IMAGE;

  if (src) {
    return (
      <span className={`${className} site-brand__mark--image`} aria-hidden="true">
        <img src={src} alt="" className={imageClassName} />
      </span>
    );
  }

  const icon = settings.logoIcon || DEFAULT_LOGO_ICON;
  return (
    <span className={className} aria-hidden="true">
      <i className={`fa-solid ${icon}`} />
    </span>
  );
}

export function DisclaimerLogoMark({ settings = {} }) {
  const src = settings.logoImage || DEFAULT_LOGO_IMAGE;
  if (src) {
    return (
      <div className="disclaimer-gate__icon disclaimer-gate__icon--image" aria-hidden="true">
        <img src={src} alt="" />
      </div>
    );
  }
  const icon = settings.logoIcon || DEFAULT_LOGO_ICON;
  return (
    <div className="disclaimer-gate__icon" aria-hidden="true">
      <i className={`fa-solid ${icon}`} />
    </div>
  );
}
