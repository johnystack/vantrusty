import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Users, DollarSign, Gift, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  username: string;
  referral_bonus: number;
}

const Referrals = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralLink = profile ? `${window.location.origin}/signup?ref=${profile.username}` : "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const [profileRes, countRes] = await Promise.all([
        supabase.from('profiles').select('username, referral_bonus').eq('id', user.id).single(),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('referred_by', user.id),
      ]);
      
      if (profileRes.error) throw profileRes.error;
      if (countRes.error) throw countRes.error;

      setProfile(profileRes.data);
      setReferralCount(countRes.count || 0);

    } catch (error: any) {
      toast.error("Failed to load referral data", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWithdrawBonus = async () => {
    setIsWithdrawing(true);
    try {
      const { data, error } = await supabase.rpc('withdraw_referral_bonus');
      if (error) throw error;
      
      toast.success("Withdrawal Successful", { description: `You have transferred ${formatCurrency(data)} to your main balance.`});
      fetchData(); // Refresh data to show updated balances

    } catch (error: any) {
      toast.error("Withdrawal Failed", { description: error.message || "An unexpected error occurred." });
    } finally {
      setIsWithdrawing(false);
    }
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <DashboardHeader 
            title="Referral Program" 
            subtitle="Invite friends and earn bonuses"
          />

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Referral Link Card */}
            <Card variant="glass" className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {loading ? (
                    <Skeleton className="h-10 flex-1" />
                  ) : (
                    <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border font-mono text-sm truncate">
                      {referralLink}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    disabled={loading}
                  >
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                  Share your link with friends. When they sign up and invest, you'll receive a bonus.
                </div>
              </CardContent>
            </Card>

            {/* Bonus Withdrawal Card */}
            <Card variant="glass" className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Available Bonus
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full">
                {loading ? (
                  <Skeleton className="h-10 w-3/4 mb-4" />
                ) : (
                  <div className="text-4xl font-display font-bold text-foreground mb-4">
                    {formatCurrency(profile?.referral_bonus || 0)}
                  </div>
                )}
                <Button 
                  onClick={handleWithdrawBonus}
                  disabled={isWithdrawing || loading || !profile || profile.referral_bonus <= 0}
                  className="w-full"
                  variant="hero"
                >
                  {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Withdraw to Main Balance"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="stat">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Friends Referred</p>
                  {loading ? <Skeleton className="h-7 w-12 mt-1" /> : <p className="text-2xl font-display font-bold text-foreground">{referralCount}</p>}
                </div>
              </div>
            </Card>
            <Card variant="stat">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bonus Earned (All Time)</p>
                   {loading ? <Skeleton className="h-7 w-24 mt-1" /> : <p className="text-2xl font-display font-bold text-foreground">{formatCurrency(profile?.referral_bonus || 0)}</p>}
                   <p className="text-xs text-muted-foreground">(This shows current bonus, history coming soon)</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Referrals;
