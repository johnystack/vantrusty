import { Shield, Lock, Eye, Server } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "256-bit Encryption",
    description: "Military-grade encryption protects all data in transit and at rest.",
  },
  {
    icon: Lock,
    title: "Cold Storage",
    description: "95% of assets stored in offline cold wallets for maximum security.",
  },
  {
    icon: Eye,
    title: "Biometric Auth",
    description: "Multi-factor authentication with biometric verification options.",
  },
  {
    icon: Server,
    title: "SOC 2 Certified",
    description: "Fully compliant with international security and privacy standards.",
  },
];

const SecuritySection = () => {
  return (
    <section id="security" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Your Security is Our <span className="gradient-text">Priority</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We employ industry-leading security measures to ensure your digital assets 
              and personal information remain protected at all times.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="flex items-start gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass rounded-3xl p-8 glow-primary">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center animate-pulse-slow">
                    <Shield className="w-16 h-16 text-primary" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-success flex items-center justify-center">
                    <Lock className="w-4 h-4 text-success-foreground" />
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-2xl font-display font-bold text-foreground">100% Secure</div>
                <div className="text-muted-foreground">Protected 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
