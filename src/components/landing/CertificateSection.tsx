import { Award, Shield, CheckCircle, MapPin, Calendar } from "lucide-react";

// REPLACE THIS PATH WITH YOUR ACTUAL CERTIFICATE IMAGE
// Simply update the import path below to use your own certificate image
import certificateImage from "@/assets/certificate-placeholder.png";
import teamMeetingImage from "@/assets/hero-investor.jpg";

const CertificateSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* About Company Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-6">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Verified & Certified</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="text-foreground">About </span>
            <span className="gradient-text">VanTrusty</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Founded in Austria in 2020, VanTrusty has grown to become a trusted name in digital investment 
            management, serving clients worldwide with innovative financial solutions.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Vienna, Austria</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Est. 2020</span>
            </div>
          </div>
        </div>

        {/* Team Meeting Image */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl" />
          <div className="relative glass rounded-3xl p-2 md:p-4 border border-border/50 overflow-hidden">
            <img 
              src={teamMeetingImage} 
              alt="VanTrusty team meeting in modern office" 
              className="w-full h-48 md:h-72 lg:h-96 object-cover rounded-2xl"
            />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 glass rounded-xl p-3 md:p-4">
              <p className="text-xs md:text-sm font-medium text-foreground">Our Expert Team</p>
              <p className="text-xs text-muted-foreground">Working together since 2020</p>
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
            <span className="text-foreground">Official </span>
            <span className="gradient-text">Certifications</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            VanTrusty is a fully registered and certified company, operating under strict regulatory compliance 
            to ensure the safety and security of your investments.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Certificate Image - Easily replaceable */}
          <div className="relative group flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 max-w-sm mx-auto" />
            <div className="relative glass rounded-2xl p-3 md:p-4 border border-border/50 max-w-sm">
              {/* 
                TO REPLACE THIS CERTIFICATE IMAGE:
                1. Add your certificate image to src/assets/ folder
                2. Update the import at the top of this file
                Example: import certificateImage from "@/assets/your-certificate.jpg";
              */}
              <img 
                src={certificateImage} 
                alt="VanTrusty GmbH - Austrian Business Registration Certificate" 
                className="w-full max-w-xs h-auto rounded-xl shadow-xl"
              />
              <div className="absolute top-4 right-4 md:top-5 md:right-5 glass rounded-full p-2">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-border/50">
              <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Austrian Business Register (Firmenbuch)
              </h3>
              <p className="text-muted-foreground mb-4">
                VanTrusty GmbH is officially registered with the Austrian Business Register, 
                operating legally since 2020 under strict EU financial regulations.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                  EU Verified
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  Active Since 2020
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-foreground">EU Licensed</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fully licensed under EU financial directives
                </p>
              </div>
              <div className="glass rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-foreground">Audited</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Regular third-party audits and compliance checks
                </p>
              </div>
              <div className="glass rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-foreground">Insured</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Assets protected by comprehensive insurance
                </p>
              </div>
              <div className="glass rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-foreground">Compliant</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Adheres to international financial standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificateSection;
