import { useState, useEffect } from 'react';
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Wallet, TrendingUp, Users, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from '@/components/ui/skeleton';

interface Profile {
  full_name: string;
  username: string;
  available_balance: number;
  referral_bonus: number;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activeInvestmentsCount, setActiveInvestmentsCount] = useState(0);
  const [referralCount, setReferralCount] = useState(0);


  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Fetch profile, investments, and referral count in parallel
        const [profileRes, investmentsRes, referralsRes] = await Promise.all([
          supabase.from('profiles').select('full_name, username, available_balance, referral_bonus').eq('id', user.id).single(),
          supabase.from('investment_details').select('amount, status, plan_daily_interest_rate, plan_duration_days').eq('user_id', user.id),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('referred_by', user.id)
        ]);

        if (profileRes.error) throw profileRes.error;
        if (investmentsRes.error) throw investmentsRes.error;
        if (referralsRes.error) throw referralsRes.error;
        
        setProfile(profileRes.data);
        setReferralCount(referralsRes.count || 0);

        const investments = investmentsRes.data || [];

        // Calculate stats from investments
        const totalInvestedCalc = investments
          .filter(inv => inv.status !== 'cancelled')
          .reduce((acc, inv) => acc + inv.amount, 0);
        setTotalInvested(totalInvestedCalc);

        const totalEarningsCalc = investments
          .filter(inv => inv.status === 'completed')
          .reduce((acc, inv) => acc + (inv.amount * (inv.plan_daily_interest_rate / 100) * inv.plan_duration_days), 0);
        setTotalEarnings(totalEarningsCalc);

        const activeCount = investments.filter(inv => inv.status === 'active').length;
        setActiveInvestmentsCount(activeCount);

      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 lg:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="Dashboard" 
            subtitle={loading ? "Loading..." : `Welcome back, ${profile?.full_name || 'User'}!`}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading ? (
              <>
                <Skeleton className="h-36 rounded-xl" />
                <Skeleton className="h-36 rounded-xl" />
                <Skeleton className="h-36 rounded-xl" />
                <Skeleton className="h-36 rounded-xl" />
              </>
            ) : (
              <>
                <StatCard
                  title="Available Balance"
                  value={formatCurrency(profile?.available_balance)}
                  icon={Wallet}
                />
                <StatCard
                  title="Total Invested"
                  value={formatCurrency(totalInvested)}
                  change={`${activeInvestmentsCount} active plans`}
                  changeType="neutral"
                  icon={TrendingUp}
                  iconColor="bg-gradient-accent"
                />
                <StatCard
                  title="Total Earnings"
                  value={formatCurrency(totalEarnings)}
                  icon={DollarSign}
                />
                <StatCard
                  title="Referral Bonus"
                  value={formatCurrency(profile?.referral_bonus)}
                  change={`${referralCount} referrals`}
                  changeType="neutral"
                  icon={Users}
                />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Activity and Portfolio */}
          <div className="grid lg:grid-cols-2 gap-8">
            <RecentActivity />
            
            {/* Active Investments Placeholder */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-display font-semibold mb-4">Active Investments</h3>
              <div className="space-y-4 flex flex-col items-center justify-center h-full text-center">
                 <p className="text-muted-foreground">You have no active investments.</p>
                 <p className="text-sm text-muted-foreground">Investment plans will appear here once you invest.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
