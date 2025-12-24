import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeInvestmentsValue: 0,
    activePlansCount: 0,
  });

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      setLoading(true);
      try {
        const [
          usersRes,
          investmentsRes,
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('investments').select('amount, status').eq('status', 'active'),
        ]);

        if (usersRes.error) throw usersRes.error;
        if (investmentsRes.error) throw investmentsRes.error;

        const activeInvestments = investmentsRes.data || [];
        const activeInvestmentsValue = activeInvestments.reduce((acc, inv) => acc + inv.amount, 0);
        const activePlansCount = activeInvestments.length;

        setStats({
          totalUsers: usersRes.count || 0,
          activeInvestmentsValue,
          activePlansCount,
        });

      } catch (error: any) {
        toast.error("Failed to load dashboard data", { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const statCards = [
    { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "bg-gradient-primary" },
    { title: "Active Investments", value: formatCurrency(stats.activeInvestmentsValue), change: `${stats.activePlansCount} active plans`, icon: TrendingUp, color: "bg-gradient-accent" },
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="Admin Dashboard" 
            subtitle="Overview of platform activity and management"
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading ? (
              Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-xl" />)
            ) : (
              statCards.map((stat, index) => (
                <Card key={index} variant="glass" className="overflow-hidden">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground truncate">{stat.title}</p>
                        <p className="text-xl lg:text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                        {stat.change && <p className="text-xs text-muted-foreground mt-1 truncate">{stat.change}</p>}
                      </div>
                      <div className={`p-2 lg:p-3 rounded-xl ${stat.color} flex-shrink-0`}>
                        <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {/* Recent Activity Placeholder */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>This section is a placeholder. Real-time activity feed coming soon.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Recent activity feed is not yet implemented.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};


export default AdminDashboard;
