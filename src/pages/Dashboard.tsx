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
  balance: number;
  referral_bonus: number;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
        } else {
          setProfile(data);
        }
      }
      setLoading(false);
    };

    fetchProfile();
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
                  title="Wallet Balance"
                  value={formatCurrency(profile?.balance)}
                  change="+0.0% this month"
                  changeType="neutral"
                  icon={Wallet}
                />
                <StatCard
                  title="Active Investments"
                  value="$0.00"
                  change="0 active plans"
                  changeType="neutral"
                  icon={TrendingUp}
                  iconColor="bg-gradient-accent"
                />
                <StatCard
                  title="Total Earnings"
                  value="$0.00"
                  change="+$0.00 this week"
                  changeType="neutral"
                  icon={DollarSign}
                />
                <StatCard
                  title="Referral Bonus"
                  value={formatCurrency(profile?.referral_bonus)}
                  change="0 referrals"
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
