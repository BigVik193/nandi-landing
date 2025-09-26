'use client';

import { DocsLayout } from './components/DocsLayout';
import { OverviewSection } from './sections/OverviewSection';
import { GettingStartedSection } from './sections/GettingStartedSection';
import { CoreConceptsSection } from './sections/CoreConceptsSection';
import { ApiReferenceSection } from './sections/ApiReferenceSection';
import { IntegrationGuideSection } from './sections/IntegrationGuideSection';
import { BestPracticesSection } from './sections/BestPracticesSection';
import { TroubleshootingSection } from './sections/TroubleshootingSection';


export default function SDKDocsPage() {

  return (
    <DocsLayout>
      <OverviewSection />
      <GettingStartedSection />
      <CoreConceptsSection />
      <ApiReferenceSection />
      <IntegrationGuideSection />
      <BestPracticesSection />
      <TroubleshootingSection />
    </DocsLayout>
  );
}