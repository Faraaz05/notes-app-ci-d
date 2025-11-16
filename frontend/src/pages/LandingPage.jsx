import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import CTASection from '../components/CTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <HeroSection />
      <FeatureSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;
