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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface Profile {
  available_balance: number;
}

interface Withdrawal {
  id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  wallet_address: string;
  created_at: string;
}

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsPageLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [profileRes, historyRes] = await Promise.all([
        supabase.from('profiles').select('available_balance').eq('id', user.id).single(),
        supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);
      
      if (profileRes.error) {
        toast.error("Failed to load balance", { description: profileRes.error.message });
      } else {
        setProfile(profileRes.data);
      }

      if (historyRes.error) {
        toast.error("Failed to load withdrawal history", { description: historyRes.error.message });
      } else {
        setWithdrawalHistory(historyRes.data || []);
      }
    }
    setIsPageLoading(false);
  };

  useEffect(() => {
    fetchData();
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
    if (!walletAddress) {
      toast.error("Wallet Address Required", { description: "Please enter a destination wallet address." });
      return;
    }
    if (!profile || withdrawalAmount > profile.available_balance) {
      toast.error("Insufficient Balance", { description: "You cannot withdraw more than your available balance." });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('request_withdrawal', {
        amount_to_withdraw: withdrawalAmount,
        address: walletAddress,
      });

      if (error) throw error;
      
      toast.success("Withdrawal Request Submitted", {
        description: `Your request to withdraw ${formatCurrency(withdrawalAmount)} is being processed.`,
      });
      setAmount("");
      setWalletAddress("");
      // Re-fetch all data to show updated balance and history
      fetchData();

    } catch (error: any) {
      toast.error("Withdrawal Failed", { description: error.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Withdrawal['status']) => {
    let variant: "warning" | "success" | "destructive" | "outline" = "outline";
    if (status === 'pending') variant = 'warning';
    if (status === 'approved') variant = 'success';
    if (status === 'rejected') variant = 'destructive';
    
    return <Badge variant={variant}>{status}</Badge>;
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
                Funds will be deducted and a withdrawal request will be created for admin approval.
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

                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Your Wallet Address</Label>
                   <Input
                      id="walletAddress"
                      type="text"
                      placeholder="Enter your crypto wallet address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      required
                      disabled={isPageLoading}
                    />
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
                    "Request Withdrawal"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card variant="glass" className="mt-8">
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPageLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-32" /></TableCell>
                      </TableRow>
                    ))
                  ) : withdrawalHistory.length > 0 ? (
                    withdrawalHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-[150px]">{item.wallet_address}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        You haven't made any withdrawals yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;
