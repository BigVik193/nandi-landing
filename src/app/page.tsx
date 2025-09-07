import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import LearnSection from '@/components/LearnSection';
import PersonalizeSection from '@/components/PersonalizeSection';
import StatsSection from '@/components/StatsSection';
import Competitive from '@/components/Competitive';
import Subscription from '@/components/Subscription';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-hero">
      <Navigation />
      <Hero />
      <LearnSection />
      <PersonalizeSection />
      <StatsSection />
      <Competitive />
      <Subscription />
      <Contact />
      <FAQ />
      <Footer />
    </div>
  );
}
