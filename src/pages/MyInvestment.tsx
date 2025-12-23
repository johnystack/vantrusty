import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import InvestmentCard from "@/components/investments/InvestmentCard";
import { Eye, ArrowUpRight, ArrowDownLeft, RefreshCw, EyeOff, MinusCircle, PlusCircle, Repeat, Landmark, PiggyBank } from "lucide-react";
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
        .in('status', ['pending', 'active', 'matured', 'withdrawn', 'reinvested', 'approved']) // Also include 'reinvested' status
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
      case "approved":
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
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
    // Only calculate for active/matured investments
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="glass-strong border-border flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2 text-sm">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full mt-2" />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-4 border-t border-border/50">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : investments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground text-center">
              <PiggyBank className="w-16 h-16 mb-4 text-primary" />
              <p className="text-xl font-semibold mb-2">No Investments Yet!</p>
              <p className="mb-4">It looks like you haven't made any investments. Start today and watch your money grow!</p>
              <Button asChild>
                <Link to="/dashboard/investments">Invest Now</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investments.map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  investment={investment}
                  onWithdraw={handleWithdraw}
                  onReinvest={handleReinvest}
                  onViewDetails={setSelectedInvestment}
                  isWithdrawing={withdrawingId === investment.id}
                  getStatusBadge={getStatusBadge}
                  calculateProgress={calculateProgress}
                  calculateReturns={calculateReturns}
                />
              ))}
            </div>
          )}

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