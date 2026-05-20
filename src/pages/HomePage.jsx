import {
  LegalHeroBlock,
  LegalAboutBlock,
  PracticeAreasBlock,
  TestimonialsBlock,
  LegalContactBlock,
  LegalCtaBlock,
} from "../sections/blocks";
import { ATTORNEY } from "../data/attorneyProfile";
import { IMAGES } from "../data/mediaDefaults";

/** Built-in homepage when custom builder content is not enabled */
export default function HomePage() {
  return (
    <>
      <LegalHeroBlock
        heroTone="lavender"
        title={"Research-Driven Advocacy\nfor Complex Legal Challenges."}
        subtitle="Deputy Counsel at the Delhi International Arbitration Centre. LLM (Business Laws), NLSIU · UGC-NET."
        image={IMAGES.heroPortrait}
        backgroundImage={IMAGES.heroBg}
        stat1="6+"
        label1="Years Experience"
        stat2="LLM"
        label2="NLSIU Bangalore"
        stat3="UGC-NET"
        label3="Qualified"
      />
      <LegalAboutBlock title="Professional Profile" body={ATTORNEY.about} image={IMAGES.about} />
      <PracticeAreasBlock
        title="Practice Areas"
        subtitle="Insolvency, arbitration, corporate, intellectual property, cyber law, and litigation."
      />
      <TestimonialsBlock
        title="Professional Endorsements"
        subtitle="Endorsements from colleagues and the legal community."
      />
      <LegalContactBlock
        title="Get In Touch"
        subtitle="Reach out to discuss your matter. Based in New Delhi."
      />
      <LegalCtaBlock />
    </>
  );
}
