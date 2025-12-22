import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, Zap, Play } from "lucide-react";
import heroImage from "@/assets/team-meeting.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Secure & Regulated Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="text-foreground">Smart Digital</span>
              <br />
              <span className="gradient-text">Asset Investing</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Build wealth with confidence. VanTrusty offers secure, long-term investment plans 
              in digital currencies with transparent returns and professional management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Start Investing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" className="gap-2" asChild>
                <a href="#features">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-md mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">$2.5B+</div>
                <div className="text-xs text-muted-foreground">Assets Managed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-display font-bold gradient-text-gold">150K+</div>
                <div className="text-xs text-muted-foreground">Active Investors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image - Now visible on all screen sizes */}
          <div className="relative animate-fade-in order-first lg:order-last" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden glow-primary">
                <img 
                  src={heroImage} 
                  alt="Professional investor"
                  className="w-full h-64 sm:h-80 lg:h-auto object-cover object-center rounded-3xl"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:from-background/80" />
              </div>

              {/* Floating Stats Card - Top Right */}
              <div className="absolute top-2 right-2 sm:-top-4 sm:-right-4 glass rounded-xl sm:rounded-2xl p-2 sm:p-4 animate-float">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-success/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Portfolio Growth</div>
                    <div className="text-sm sm:text-lg font-bold text-success">+47.2%</div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card - Bottom Left */}
              <div className="absolute bottom-2 left-2 sm:-bottom-4 sm:-left-4 glass rounded-xl sm:rounded-2xl p-2 sm:p-4 animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Active Investments</div>
                    <div className="text-sm sm:text-lg font-bold text-foreground">$32,450</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
