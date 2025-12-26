import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Check, TrendingUp, Shield } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-investor.jpg";
import { supabase } from "@/lib/supabaseClient";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [referrerUsername, setReferrerUsername] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferrerUsername(ref);
    }
  }, [searchParams]);

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "Contains a number", met: /\d/.test(password) },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
  ];
  
  const allPasswordReqsMet = passwordRequirements.every(req => req.met);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both passwords are the same.",
      });
      return;
    }
    if (!allPasswordReqsMet) {
      toast.error("Password is not strong enough", {
        description: "Please meet all the password requirements.",
      });
      return;
    }

    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          referrer_username: referrerUsername,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      toast.error("Signup Failed", {
        description: error.message,
      });
    } else if (data.user) {
      toast.success("Account created!", {
        description: "Please check your email to verify your account.",
      });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col-reverse lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-2xl">V</span>
            </div>
            <span className="font-display font-bold text-2xl text-foreground">VanTrusty</span>
          </Link>

          <Card variant="glass" className="animate-scale-in">
            <CardHeader className="text-center lg:text-left">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Start your investment journey today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" placeholder="yourusername" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {password && (
                    <div className="space-y-1 mt-2">
                      {passwordRequirements.map((req) => (
                        <div key={req.text} className="flex items-center gap-2 text-xs">
                          <Check className={`w-3 h-3 ${req.met ? "text-green-500" : "text-muted-foreground"}`} />
                          <span className={req.met ? "text-green-500" : "text-muted-foreground"}>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referrerUsername">Referral Code (Optional)</Label>
                  <Input id="referrerUsername" type="text" placeholder="Referrer's username" value={referrerUsername} onChange={(e) => setReferrerUsername(e.target.value)} />
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1 rounded border-border" required />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a href="/legal#terms-of-service" className="text-primary hover:underline" target="_blank">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/legal#privacy-policy" className="text-primary hover:underline" target="_blank">Privacy Policy</a>
                  </Label>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5 ml-2" /></>}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative h-64 md:h-80 lg:h-auto lg:flex-1 overflow-hidden">
        <img src={heroImage} alt="Professional investor" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent lg:from-background lg:via-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:from-background/80" />
        
        <div className="relative z-10 hidden lg:flex flex-col justify-end h-full p-12">
          <div className="max-w-md">
            
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Join 150,000+ Investors Building Wealth
            </h2>
            <p className="text-muted-foreground mb-6">
              Start your investment journey with as little as $500. Our platform makes digital asset investing accessible, secure, and profitable.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Bank-grade security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                <span>Verified platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
