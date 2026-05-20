import { PageIntroBlock, PublicationsListBlock, LegalCtaBlock } from "../sections/blocks";

/** Built-in publications page when custom builder content is not enabled */
export default function PublicationsPage() {
  return (
    <>
      <PageIntroBlock
        id="publications-hero"
        eyebrow="Published work"
        title="Publications"
        subtitle="Selected articles, commentary, and academic writing in insolvency, ADR, and corporate law."
      />
      <PublicationsListBlock hideHead />
      <LegalCtaBlock
        title="Request a copy or citation"
        text="Contact the office for full text links or speaking engagements related to published work."
        buttonLabel="Contact"
        buttonLink="/#contact"
      />
    </>
  );
}
