import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, RefreshCw, Eye, EyeOff, MinusCircle, PlusCircle, Repeat, Landmark, PiggyBank } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Investment {
  id: number;
  user_id: string;
  amount: number;
  status: 'pending' | 'active' | 'rejected' | 'matured' | 'withdrawn' | 'reinvested' | 'approved';
  created_at: string;
  start_date: string;
  end_date: string;
  investment_plans: {
    name: string;
    duration_days: number;
    daily_interest_rate: number;
  };
}

const MyInvestmentsPage = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  console.log("Component rendered. Withdrawing ID:", withdrawingId, "Investments:", investments);

  useEffect(() => {
    const fetchUserAndData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchData(user.id);
      } else {
        setLoading(false);
        toast.error("You must be logged in to view your investments.");
      }
    };
    fetchUserAndData();
  }, []);

  const fetchData = async (currentUserId: string) => {
    console.log("Fetching data for user:", currentUserId);
    try {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          id,
          amount,
          status,
          created_at,
          start_date,
          end_date,
          investment_plans (name, duration_days, daily_interest_rate)
        `)
        .eq('user_id', currentUserId)
        .in('status', ['pending', 'active', 'matured', 'approved', 'withdrawn']) // Include 'withdrawn' status
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
      console.log("Data fetched successfully:", data);
      setInvestments(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch investments", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (investmentId: number) => {
    console.log("Attempting to withdraw investment ID:", investmentId);
    setWithdrawingId(investmentId);
    try {
        const { data, error } = await supabase.rpc('withdraw_investment', { p_investment_id: investmentId });
        console.log("RPC call result - Data:", data, "Error:", error);

        if (error) throw error;

        toast.success("Withdrawal successful!", { description: "The investment amount has been added to your available balance." });
        console.log("Withdrawal successful, refreshing data...");
        if(userId) fetchData(userId); // Refresh data
    } catch (error: any) {
        console.error("Caught error during withdrawal:", error);
        if (error.message.includes('Investment is not matured')) {
            toast.error("Withdrawal Failed", { description: "This investment has already been withdrawn or is not matured." });
        } else {
            toast.error("Withdrawal failed", { description: error.message });
        }
    } finally {
        console.log("Resetting withdrawingId.");
        setWithdrawingId(null);
    }
  };

  const handleReinvest = async (investmentId: number) => {
    try {
        const { error } = await supabase.rpc('reinvest_investment', { p_investment_id: investmentId });
        if (error) throw error;

        toast.success("Reinvestment successful!", { description: "A new investment has been created with the same plan." });
        if(userId) fetchData(userId); // Refresh data
    } catch (error: any) {
        toast.error("Reinvestment failed", { description: error.message });
    }
  };

  const getStatusBadge = (status: Investment['status']) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case "approved":
        return <Badge className="bg-info/20 text-info border-info/30">Approved</Badge>;
      case "matured":
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Matured</Badge>;
      case "withdrawn":
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now >= end) return 100;
    if (now <= start) return 0;

    return Math.floor(((now - start) / (end - start)) * 100);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="My Investments" 
            subtitle="View and manage your active, pending, and matured investments"
          />

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Your Investments ({investments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Plan</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Progress</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-3 px-2"><Skeleton className="h-5 w-24" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-20" /></td>
                          <td className="py-3 px-2 hidden lg:table-cell"><Skeleton className="h-5 w-28" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-20" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-40" /></td>
                        </tr>
                      ))
                    ) : investments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">You have no active, pending, or matured investments.</td>
                      </tr>
                    ) : (
                      investments.map((investment) => (
                        <tr key={investment.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-3 px-2">
                            <div className="font-medium text-foreground text-sm">{investment.investment_plans.name}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">Started: {new Date(investment.start_date).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-sm font-medium text-foreground">${investment.amount.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-2 hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Progress value={calculateProgress(investment.start_date, investment.end_date)} className="w-24 h-2" />
                              <span className="text-xs text-muted-foreground">{calculateProgress(investment.start_date, investment.end_date)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            {getStatusBadge(investment.status)}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {investment.status === 'matured' ? (
                              <div className="flex gap-2 justify-center">
                                <Button size="sm" variant="outline" onClick={() => handleWithdraw(investment.id)} disabled={withdrawingId === investment.id}>
                                  {withdrawingId === investment.id ? "Withdrawing..." : "Withdraw"}
                                </Button>
                                <Button size="sm" variant="default" onClick={() => handleReinvest(investment.id)}>
                                  Reinvest
                                </Button>
                              </div>
                            ) : investment.status === 'withdrawn' ? (
                                <span className="text-xs text-muted-foreground">Withdrawn</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">--</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MyInvestmentsPage;