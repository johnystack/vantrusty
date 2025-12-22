import Header from "@/components/layout/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PlansSection from "@/components/landing/PlansSection";
import SecuritySection from "@/components/landing/SecuritySection";
import CertificateSection from "@/components/landing/CertificateSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PlansSection />
        <SecuritySection />
        <CertificateSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
