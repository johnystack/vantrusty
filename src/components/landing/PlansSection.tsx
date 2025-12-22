import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    duration: "3 Months",
    targetReturn: "15-20%",
    minAmount: "$500",
    features: ["Basic portfolio tracking", "Email support", "Monthly reports"],
    popular: false,
  },
  {
    name: "Silver",
    duration: "6 Months",
    targetReturn: "25-35%",
    minAmount: "$2,500",
    features: ["Advanced analytics", "Priority support", "Weekly reports", "Risk management"],
    popular: false,
  },
  {
    name: "Elite",
    duration: "9 Months",
    targetReturn: "40-55%",
    minAmount: "$10,000",
    features: ["Premium analytics", "24/7 support", "Daily reports", "Dedicated advisor", "Early access"],
    popular: true,
  },
  {
    name: "Annual",
    duration: "12 Months",
    targetReturn: "60-80%",
    minAmount: "$25,000",
    features: ["Full platform access", "VIP support", "Real-time reports", "Personal advisor", "Exclusive events", "Insurance coverage"],
    popular: false,
  },
];

const PlansSection = () => {
  return (
    <section id="plans" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Investment <span className="gradient-text-gold">Plans</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your investment goals. All plans include our core security features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              variant={plan.popular ? "premium" : "glass"}
              className={`relative overflow-hidden animate-fade-in-up ${plan.popular ? "ring-2 ring-accent/50" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-accent text-accent-foreground px-4 py-1 text-sm font-semibold rounded-bl-xl flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Popular
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-muted-foreground">{plan.duration}</div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-display font-bold gradient-text-gold">
                    {plan.targetReturn}
                  </div>
                  <div className="text-sm text-muted-foreground">Target Return</div>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Minimum: </span>
                  <span className="text-foreground font-medium">{plan.minAmount}</span>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "premium" : "hero-outline"} 
                  className="w-full"
                  asChild
                >
                  <Link to="/signup">Invest Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            * Target returns are estimates based on historical performance and market conditions. 
            Past performance does not guarantee future results. Digital asset investments carry risk and may not be suitable for all investors.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
