import MobileGamesNavigation from '@/components/mobile-games/MobileGamesNavigation';
import MobileGamesHero from '@/components/mobile-games/MobileGamesHero';
import MobileGamesWhatIsNandi from '@/components/mobile-games/MobileGamesWhatIsNandi';
import MobileGamesLearnSection from '@/components/mobile-games/MobileGamesLearnSection';
import MobileGamesPersonalizeSection from '@/components/mobile-games/MobileGamesPersonalizeSection';
import MobileGamesStatsSection from '@/components/mobile-games/MobileGamesStatsSection';
import MobileGamesCompetitive from '@/components/mobile-games/MobileGamesCompetitive';
import MobileGamesSubscription from '@/components/mobile-games/MobileGamesSubscription';
import MobileGamesFAQ from '@/components/mobile-games/MobileGamesFAQ';
import MobileGamesContact from '@/components/mobile-games/MobileGamesContact';
import Footer from '@/components/Footer';

export default function MobileGamesPage() {
  return (
    <div className="min-h-screen bg-hero">
      <MobileGamesNavigation />
      <MobileGamesHero />
      <MobileGamesWhatIsNandi />
      <MobileGamesLearnSection />
      <MobileGamesPersonalizeSection />
      <MobileGamesStatsSection />
      <MobileGamesCompetitive />
      <MobileGamesSubscription />
      <MobileGamesContact />
      <MobileGamesFAQ />
      <Footer />
    </div>
  );
}