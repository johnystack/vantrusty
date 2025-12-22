import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">V</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">VanTrusty</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Smart digital asset investing for the modern investor. Build wealth with confidence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/plans" className="text-muted-foreground hover:text-foreground transition-colors">Investment Plans</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 VanTrusty. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
            Risk Warning: Digital asset investments are subject to high market risk. 
            VanTrusty is not responsible for any direct or indirect loss.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
