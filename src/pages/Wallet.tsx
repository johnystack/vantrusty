import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  bonus: number; // Add this line
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
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  // console.log("Component rendered. Withdrawing ID:", withdrawingId, "Investments:", investments); // Debugging log removed

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
    // console.log("Fetching data for user:", currentUserId); // Debugging log removed
    try {
      const { data, error } = await supabase
        .from('investments')
        .select(`id,amount,status,created_at,start_date,end_date,bonus,investment_plans(name,duration_days,daily_interest_rate)`)
        .eq('user_id', currentUserId)
        .in('status', ['pending', 'active', 'matured', 'approved', 'withdrawn', 'reinvested']) // Also include 'reinvested' status
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
      // console.log("Data fetched successfully:", data); // Debugging log removed
      setInvestments(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch investments", { description: error.message });
    } finally {
        // console.log("Resetting withdrawingId."); // Debugging log removed
        setLoading(false);
    }
  };

  const handleWithdraw = async (investmentId: number) => {
    console.log("Attempting to withdraw investment ID:", investmentId);
    setWithdrawingId(investmentId);
    try {
        // The RPC function now returns a boolean: true for success, false for not matured/already withdrawn
        const { data: successFlag, error } = await supabase.rpc('withdraw_investment', { p_investment_id: investmentId });
        
        console.log("RPC call result - Data (success flag):", successFlag, "Error:", error);

        if (error) {
            // This error indicates a problem with the RPC call itself (e.g., network, function definition)
            throw error;
        }

        if (successFlag === true) {
            toast.success("Withdrawal successful!", { description: "The investment amount has been added to your available balance." });
            console.log("Withdrawal successful, refreshing data...");
        } else {
            // This means the function returned false, indicating the investment was not matured or already withdrawn
            throw new Error("This investment is not matured or has already been withdrawn.");
        }

        if(userId) fetchData(userId); // Refresh data
    } catch (error: any) {
        console.error("Caught error during withdrawal:", error);
        // Use a generic message for unexpected errors, or the specific one from the thrown error
        toast.error("Withdrawal Failed", { description: error.message || "An unexpected error occurred." });
    } finally {
        console.log("Resetting withdrawingId.");
        setWithdrawingId(null);
    }
  };

  const handleReinvest = async (investmentId: number) => {
    try {
        const { error } = await supabase.rpc('reinvest_investment', { p_investment_id: investmentId });
        if (error) throw error;

        toast.success("Reinvestment successful!", { description: "A new investment has been created with the same plan, including returns and bonus." });
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
      case "reinvested":
        return <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">Reinvested</Badge>;
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

  const calculateReturns = (investment: Investment): number => {
    // Only calculate for active/matured/approved investments
    if (investment.status !== 'active' && investment.status !== 'matured' && investment.status !== 'approved') return 0;
    const dailyRate = investment.investment_plans.daily_interest_rate / 100;
    const durationDays = investment.investment_plans.duration_days;
    
    const interest = investment.amount * dailyRate * durationDays;
    return investment.amount + interest;
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
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Bonus</th> {/* New */}
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Returns</th> {/* New */}
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
                        <td colSpan={8} className="py-8 text-center text-muted-foreground">You have no active, pending, or matured investments.</td>
                      </tr>
                    ) : (
                      investments.map((investment) => (
                        <tr key={investment.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-3 px-2">
                            <div className="font-medium text-foreground text-sm">{investment.investment_plans.name}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">Started: {new Date(investment.start_date).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-sm font-medium text-foreground">${investment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </td>
                          <td className="py-3 px-2"> {/* New Bonus Cell */}
                            <span className="text-sm font-medium text-foreground">${investment.bonus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </td>
                          <td className="py-3 px-2"> {/* New Returns Cell */}
                            <span className="text-sm font-medium text-foreground">${calculateReturns(investment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                            <div className="flex items-center justify-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => setSelectedInvestment(investment)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {investment.status === 'matured' ? (
                                  <>
                                    <Button size="sm" variant="outline" onClick={() => { console.log('Withdraw button clicked for investment ID:', investment.id); handleWithdraw(investment.id); }} disabled={withdrawingId === investment.id}>
                                      {withdrawingId === investment.id ? "Withdrawing..." : "Withdraw"}
                                    </Button>
                                    <Button size="sm" variant="default" onClick={() => handleReinvest(investment.id)}>
                                      Reinvest
                                    </Button>
                                  </>
                                ) : investment.status === 'withdrawn' || investment.status === 'reinvested' ? ( // Also handle 'reinvested'
                                    <span className="text-xs text-muted-foreground">
                                      {investment.status === 'withdrawn' ? 'Withdrawn' : 'Reinvested'}
                                    </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">--</span>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Details Modal */}
          <Dialog open={!!selectedInvestment} onOpenChange={() => setSelectedInvestment(null)}>
            <DialogContent className="glass-strong border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>Investment Details</DialogTitle>
                <DialogDescription>
                  Details for your {selectedInvestment?.investment_plans.name} plan.
                </DialogDescription>
              </DialogHeader>
              {selectedInvestment && (
                <div className="space-y-4 mt-4 text-sm">
                   <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                          <label className="text-muted-foreground">Plan Name</label>
                          <p className="font-medium text-foreground">{selectedInvestment.investment_plans.name}</p>
                      </div>
                      <div>
                          <label className="text-muted-foreground">Status</label>
                          <div>{getStatusBadge(selectedInvestment.status)}</div>
                      </div>
                      <div>
                          <label className="text-muted-foreground">Invested Amount</label>
                          <p className="font-medium text-foreground">${selectedInvestment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                       <div>
                          <label className="text-muted-foreground">Bonus</label>
                          <p className="font-medium text-foreground">${selectedInvestment.bonus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                          <label className="text-muted-foreground">Calculated Returns</label>
                          <p className="font-medium text-foreground">${calculateReturns(selectedInvestment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                          <label className="text-muted-foreground">Start Date</label>
                          <p className="font-medium text-foreground">{new Date(selectedInvestment.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                          <label className="text-muted-foreground">Maturity Date</label>
                          <p className="font-medium text-foreground">{new Date(selectedInvestment.end_date).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="pt-4">
                      <label className="text-muted-foreground">Progress</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={calculateProgress(selectedInvestment.start_date, selectedInvestment.end_date)} className="w-full h-2" />
                        <span className="text-xs font-medium text-foreground">{calculateProgress(selectedInvestment.start_date, selectedInvestment.end_date)}%</span>
                      </div>
                   </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

        </div>
      </main>
    </div>
  );
};

export default MyInvestmentsPage;