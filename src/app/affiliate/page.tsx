import AffiliateNavigation from '@/components/affiliate/AffiliateNavigation';
import AffiliateHero from '@/components/affiliate/AffiliateHero';
import AffiliateBenefits from '@/components/affiliate/AffiliateBenefits';
import AffiliateUseCases from '@/components/affiliate/AffiliateUseCases';
import AffiliateStats from '@/components/affiliate/AffiliateStats';
import AffiliateHow from '@/components/affiliate/AffiliateHow';
import AffiliatePricing from '@/components/affiliate/AffiliatePricing';
import AffiliateTestimonials from '@/components/affiliate/AffiliateTestimonials';
import AffiliateFAQ from '@/components/affiliate/AffiliateFAQ';
import AffiliateContact from '@/components/affiliate/AffiliateContact';
import Footer from '@/components/Footer';

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-hero">
      <AffiliateNavigation />
      <AffiliateHero />
      <AffiliateBenefits />
      <AffiliateUseCases />
      <AffiliateStats />
      <AffiliateHow />
      <AffiliatePricing />
      <AffiliateTestimonials />
      <AffiliateContact />
      <AffiliateFAQ />
      <Footer />
    </div>
  );
}