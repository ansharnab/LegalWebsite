import { SECTION_TYPES } from "./sectionRegistry";
import StyledSectionWrap from "./StyledSectionWrap";

export default function PageSectionsView({ sections = [] }) {
  return (
    <>
      {sections.filter((s) => !s.hidden).map((section) => {
        const def = SECTION_TYPES[section.type];
        if (!def) return null;
        const Component = def.component;
        return (
          <StyledSectionWrap
            key={section.id}
            sectionType={section.type}
            style={section.style}
            heroTone={section.props?.heroTone}
          >
            <Component {...(section.props || {})} />
          </StyledSectionWrap>
        );
      })}
    </>
  );
}
