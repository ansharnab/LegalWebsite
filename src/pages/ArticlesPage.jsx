import { PageIntroBlock, ArticlesListBlock, LegalCtaBlock } from "../sections/blocks";

/** Built-in articles page when custom builder content is not enabled */
export default function ArticlesPage() {
  return (
    <>
      <PageIntroBlock
        id="articles-hero"
        eyebrow="Insights"
        title="Articles & Commentary"
        subtitle="Research notes and commentary on insolvency, arbitration, corporate law, and dispute resolution."
      />
      <ArticlesListBlock hideHead />
      <LegalCtaBlock
        title="Discuss a legal question?"
        text="Reach out for a consultation on insolvency, arbitration, or corporate matters."
        buttonLabel="Get in Touch"
        buttonLink="/#contact"
      />
    </>
  );
}
