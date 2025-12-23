import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Check, Users, DollarSign, Gift, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  username: string;
  referral_bonus: number;
}

interface ReferralBonus {
  investor_username: string;
  bonus_amount: number;
  investment_date: string;
}

interface ReferredUser {
  username: string;
  created_at: string;
}

const Referrals = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [totalBonusEarned, setTotalBonusEarned] = useState(0);
  const [bonusHistory, setBonusHistory] = useState<ReferralBonus[]>([]);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);

  const referralLink = profile ? `${window.location.origin}/signup?ref=${profile.username}` : "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const [profileRes, referredUsersRes, bonusHistoryRes] = await Promise.all([
        supabase.from('profiles').select('username, referral_bonus').eq('id', user.id).single(),
        supabase.from('profiles').select('username, created_at').eq('referred_by', user.id),
        supabase.from('referral_bonus_history').select('investor_username, bonus_amount, investment_date').order('investment_date', { ascending: false }),
      ]);
      
      if (profileRes.error) throw profileRes.error;
      if (referredUsersRes.error) throw referredUsersRes.error;
      if (bonusHistoryRes.error) throw bonusHistoryRes.error;

      setProfile(profileRes.data);
      setReferredUsers(referredUsersRes.data || []);
      setReferralCount(referredUsersRes.data?.length || 0);
      setBonusHistory(bonusHistoryRes.data || []);

      const totalBonus = (bonusHistoryRes.data || []).reduce((acc, item) => acc + item.bonus_amount, 0);
      setTotalBonusEarned(totalBonus);

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
      
      toast.success("Withdrawal Successful", { description: `You have transferred ${formatCurrency(data)} to your available balance.`});
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
            action={
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Available Bonus</p>
                <p className="text-2xl font-display font-bold text-primary">{formatCurrency(profile?.referral_bonus || 0)}</p>
                <Button 
                  onClick={handleWithdrawBonus}
                  disabled={isWithdrawing || loading || !profile || profile.referral_bonus <= 0}
                  size="sm"
                  className="mt-2"
                >
                  {isWithdrawing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Gift className="w-4 h-4 mr-2" />}
                  Withdraw Bonus
                </Button>
              </div>
            }
          />

                    <div className="grid md:grid-cols-1 gap-6 mb-8">
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
          
                                          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                  {loading ? <Skeleton className="h-7 w-24 mt-1" /> : <p className="text-2xl font-display font-bold text-foreground">{formatCurrency(totalBonusEarned)}</p>}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Referred Users */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Referred Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead className="text-right">Sign-up Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        </TableRow>
                      ))
                    ) : referredUsers.length > 0 ? (
                      referredUsers.map(user => (
                        <TableRow key={user.username}><TableCell>{user.username}</TableCell><TableCell className="text-right">{new Date(user.created_at).toLocaleDateString()}</TableCell></TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={2} className="text-center">You haven't referred anyone yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Referral Bonus History */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Referral Bonus History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From User</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Bonus</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        </TableRow>
                      ))
                    ) : bonusHistory.length > 0 ? (
                      bonusHistory.map((bonus, i) => (
                        <TableRow key={i}><TableCell>{bonus.investor_username}</TableCell><TableCell>{new Date(bonus.investment_date).toLocaleDateString()}</TableCell><TableCell className="text-right text-success font-medium">+{formatCurrency(bonus.bonus_amount)}</TableCell></TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={3} className="text-center">No bonuses earned yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Referrals;
