import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const testimonials = [
  {
    name: "Michael Chen",
    role: "Business Owner",
    image: testimonial1,
    quote: "VanTrusty has transformed my investment strategy. The Elite plan's returns exceeded my expectations, and their support team is exceptional.",
    rating: 5,
    returns: "+47%",
  },
  {
    name: "Sarah Mitchell",
    role: "Financial Analyst",
    image: testimonial2,
    quote: "As someone in finance, I'm impressed by their transparency and security measures. It's rare to find a platform this trustworthy.",
    rating: 5,
    returns: "+52%",
  },
  {
    name: "David Thompson",
    role: "Entrepreneur",
    image: testimonial3,
    quote: "Started with the Starter plan, now I'm on Annual. The consistent returns and professional management make all the difference.",
    rating: 5,
    returns: "+63%",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-6">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm text-muted-foreground">Trusted by 150,000+ Investors</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            What Our <span className="gradient-text">Investors</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real investors who've achieved their financial goals with VanTrusty.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              variant="glass"
              className="relative overflow-hidden group hover:border-primary/30 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                  "{testimonial.quote}"
                </p>

                {/* Returns Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 mb-6">
                  <span className="text-success font-semibold">{testimonial.returns}</span>
                  <span className="text-xs text-muted-foreground">Annual Return</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="text-sm text-muted-foreground">256-bit SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-sm text-muted-foreground">Insured Assets</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-sm text-muted-foreground">SOC 2 Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
