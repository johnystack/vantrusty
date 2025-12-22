import { Card, CardContent } from "@/components/ui/card";
import { Shield, TrendingUp, Zap, Lock, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Multi-layer encryption, cold storage, and 2FA protection for all your digital assets.",
  },
  {
    icon: TrendingUp,
    title: "Long-Term Growth",
    description: "Strategic investment plans designed for sustainable wealth building over time.",
  },
  {
    icon: Zap,
    title: "Fast Transactions",
    description: "Lightning-fast withdrawals with minimal processing times.",
  },
  {
    icon: Lock,
    title: "Asset Insurance",
    description: "Your investments are protected with comprehensive insurance coverage.",
  },
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description: "Round-the-clock portfolio tracking and automated risk management.",
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Dedicated investment advisors available to help you make informed decisions.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Why Choose <span className="gradient-text">VanTrusty</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Industry-leading features designed to maximize your investment potential while keeping your assets secure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="glass" 
              className="group hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
