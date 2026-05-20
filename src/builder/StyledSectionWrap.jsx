import { isLightSectionTheme, styleToCssVars } from "./editorTheme";

export default function StyledSectionWrap({
  sectionType,
  style,
  heroTone,
  children,
  className = "",
}) {
  const cssVars = styleToCssVars(style, sectionType);
  const clean = Object.fromEntries(
    Object.entries(cssVars).filter(([, v]) => v !== undefined && v !== "")
  );
  const tone = isLightSectionTheme(style, sectionType, heroTone) ? "light" : "dark";

  return (
    <div
      className={`section-wrap ve-styled-section--${sectionType} ${className}`.trim()}
      style={clean}
      data-section-type={sectionType}
      data-tone={tone}
    >
      {children}
    </div>
  );
}
