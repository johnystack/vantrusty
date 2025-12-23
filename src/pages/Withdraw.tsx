import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, DollarSign, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  available_balance: number;
}

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsPageLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('available_balance')
          .eq('id', user.id)
          .single();
        
        if (error) {
          toast.error("Failed to load balance", { description: error.message });
        } else {
          setProfile(data);
        }
      }
      setIsPageLoading(false);
    };
    fetchProfile();
  }, []);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$...';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawalAmount = parseFloat(amount);

    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid, positive amount." });
      return;
    }
    if (!profile || withdrawalAmount > profile.available_balance) {
      toast.error("Insufficient Balance", { description: "You cannot withdraw more than your available balance." });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('create_withdrawal', { amount_arg: withdrawalAmount });
      if (error) throw error;
      
      toast.success("Withdrawal Successful", {
        description: `Your withdrawal of ${formatCurrency(withdrawalAmount)} is being processed.`,
      });
      navigate("/dashboard");

    } catch (error: any) {
      toast.error("Withdrawal Failed", { description: error.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <DashboardHeader 
            title="Withdraw Funds" 
            subtitle="Transfer funds from your wallet"
          />

          <Card variant="highlight" className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available to Withdraw</p>
                  {isPageLoading ? (
                    <Skeleton className="h-9 w-48 mt-1" />
                  ) : (
                    <p className="text-3xl font-display font-bold text-foreground">
                      {formatCurrency(profile?.available_balance)}
                    </p>
                  )}
                </div>
                <Wallet className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Create a Withdrawal Request</CardTitle>
              <CardDescription>
                For this demo, funds will be deducted from your balance instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdrawal} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g., 100.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                      min="0.01"
                      step="0.01"
                      required
                      disabled={isPageLoading}
                    />
                  </div>
                  <div className="text-right text-sm">
                    <button 
                      type="button"
                      className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                      onClick={() => profile && setAmount(profile.available_balance.toString())}
                      disabled={isPageLoading || !profile}
                    >
                      Withdraw Maximum
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  variant="hero"
                  disabled={isLoading || isPageLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Confirm Withdrawal"
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  In a real application, this would require additional steps like entering a bank account or crypto wallet address.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;
