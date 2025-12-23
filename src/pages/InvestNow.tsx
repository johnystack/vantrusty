import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2, Coins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types to match our database tables
interface InvestmentPlan {
  id: number;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  daily_interest_rate: number;
  duration_days: number;
}

interface UserInvestment {
  id: number;
  amount: number;
  start_date: string;
  end_date: string;
  status: string;
  investment_plans: {
    name: string;
  };
}

interface Profile {
  available_balance: number;
}

interface Cryptocurrency {
  id: number;
  name: string;
  wallet: string;
  network: string;
}

const InvestNow = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>("");
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investmentMethod, setInvestmentMethod] = useState("deposit");

  const selectedPlan = plans.find(plan => String(plan.id) === selectedPlanId);
  const selectedCryptoDetails = cryptocurrencies.find(crypto => String(crypto.id) === selectedCryptoId);

  const depositButtonDisabled = isSubmitting || !proofOfPayment || !selectedCryptoId || !selectedPlan;
  const balanceButtonDisabled = isSubmitting || !selectedPlan || !investAmount || (profile && parseFloat(investAmount) > profile.available_balance);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

              const [plansRes, profileRes, cryptoRes] = await Promise.all([
                supabase.from('investment_plans').select('*').order('min_amount'),
                supabase.from('profiles').select('available_balance').eq('id', user.id).maybeSingle(),
                supabase.from('cryptocurrencies').select('*').eq('enabled', true),
              ]);
      if (plansRes.error) throw plansRes.error;
      if (profileRes.error) throw profileRes.error;
      if (cryptoRes.error) throw cryptoRes.error;
      
      setPlans(plansRes.data || []);
      setProfile(profileRes.data);
      setCryptocurrencies(cryptoRes.data || []);

    } catch (error: any) {
      toast.error("Failed to load data", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInvestFromBalance = async () => {
    if (!selectedPlan) {
      toast.error("No Plan Selected", { description: "Please select an investment plan." });
      return;
    }

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid positive investment amount." });
      return;
    }
    if (!profile || amount > profile.available_balance) {
      toast.error("Insufficient Balance", { description: "You do not have enough funds in your wallet." });
      return;
    }
    if (amount < selectedPlan.min_amount || amount > selectedPlan.max_amount) {
      toast.error("Invalid Amount", { description: `Amount must be between ${formatCurrency(selectedPlan.min_amount)} and ${formatCurrency(selectedPlan.max_amount)}.` });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      const newAvailableBalance = profile.available_balance - amount;

      // 1. Create active investment entry
      const { error: investmentError } = await supabase.from('investments').insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        amount: amount,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + selectedPlan.duration_days * 24 * 60 * 60 * 1000).toISOString(),
      });
      if (investmentError) throw investmentError;

      // 2. Update user's available_balance
      const { error: profileError } = await supabase.from('profiles').update({ available_balance: newAvailableBalance }).eq('id', user.id);
      if (profileError) throw profileError;

      toast.success("Investment Successful!", { description: `Your investment of ${formatCurrency(amount)} in the ${selectedPlan.name} plan is now active.` });
      setSelectedPlanId(null);
      setInvestAmount("");
      fetchData(); // Refresh all data
    } catch (error: any) {
      toast.error("Investment Failed", { description: error.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInvestViaDeposit = async () => {
    if (!selectedPlan) {
      toast.error("No Plan Selected", { description: "Please select an investment plan." });
      return;
    }

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid positive investment amount." });
      return;
    }
    if (amount < selectedPlan.min_amount || amount > selectedPlan.max_amount) {
      toast.error("Invalid Amount", { description: `Amount must be between ${formatCurrency(selectedPlan.min_amount)} and ${formatCurrency(selectedPlan.max_amount)}.` });
      return;
    }
    if (!selectedCryptoId) {
      toast.error("Cryptocurrency Not Selected", { description: "Please select a cryptocurrency for payment." });
      return;
    }
    if (!proofOfPayment) {
      toast.error("Proof of Payment Missing", { description: "Please upload proof of your payment." });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      // 1. Upload proof of payment
      const fileExt = proofOfPayment.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('investment_proofs')
        .upload(filePath, proofOfPayment, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage.from('investment_proofs').getPublicUrl(filePath).data.publicUrl;

      // 2. Create pending investment entry
      const { error } = await supabase.from('investments').insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        amount: amount,
        crypto_type: `${selectedCryptoDetails?.name} (${selectedCryptoDetails?.network})`,
        proof_of_payment_url: publicUrl,
        status: 'pending',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + selectedPlan.duration_days * 24 * 60 * 60 * 1000).toISOString(),
      });
      
      if (error) throw error;

      toast.success("Investment Submitted!", { description: `Your investment of ${formatCurrency(amount)} in the ${selectedPlan.name} plan is awaiting admin approval.` });
      setSelectedPlanId(null);
      setInvestAmount("");
      setSelectedCryptoId("");
      setProofOfPayment(null);
      fetchData(); // Refresh all data
    } catch (error: any) {
      toast.error("Investment Failed", { description: error.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvest = () => {
    if (investmentMethod === 'balance') {
      handleInvestFromBalance();
    } else {
      handleInvestViaDeposit();
    }
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader title="Invest Now" subtitle="Fill out the form to start your investment" />

          {/* Plans Grid */}
          <Card variant="glass" className="mb-8">
            <CardHeader>
              <CardTitle>Select an Investment Plan</CardTitle>
              <CardDescription>Choose from our available plans to start investing.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedPlanId || ""} onValueChange={setSelectedPlanId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-border bg-card z-50">
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={String(plan.id)}>
                        <span>{plan.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedPlan && (
                <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                  <p className="text-lg font-medium text-foreground">{selectedPlan.name}</p>
                  <p className="text-muted-foreground text-sm">{selectedPlan.description}</p>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    <span className="text-foreground font-medium">{selectedPlan.duration_days} days</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Min Investment:</span>{" "}
                    <span className="text-foreground font-medium">{formatCurrency(selectedPlan.min_amount)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Max Investment:</span>{" "}
                    <span className="text-foreground font-medium">{formatCurrency(selectedPlan.max_amount)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>


          {/* Investment Form */}
            <Card variant="glass" className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Invest in {selectedPlan?.name || "a Plan"}
                </CardTitle>
                <CardDescription>Your available balance: {formatCurrency(profile?.available_balance || 0)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={investmentMethod} onValueChange={setInvestmentMethod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="deposit">Invest via Deposit</TabsTrigger>
                    <TabsTrigger value="balance">From Available Balance</TabsTrigger>
                  </TabsList>
                  <TabsContent value="deposit" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="investAmount">Investment Amount (USD)</Label>
                      <Input 
                        id="investAmount"
                        type="number" 
                        placeholder={`Min ${formatCurrency(selectedPlan?.min_amount || 0)} - Max ${formatCurrency(selectedPlan?.max_amount || 0)}`} 
                        value={investAmount} 
                        onChange={(e) => setInvestAmount(e.target.value)} 
                        disabled={!selectedPlan}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cryptoSelect">Select Cryptocurrency</Label>
                      {loading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Select value={selectedCryptoId} onValueChange={setSelectedCryptoId} disabled={!selectedPlan}>
                          <SelectTrigger id="cryptoSelect" className="w-full">
                            <SelectValue placeholder="Select a cryptocurrency" />
                          </SelectTrigger>
                          <SelectContent className="glass-strong border-border bg-card z-50">
                            {cryptocurrencies.map((crypto) => (
                              <SelectItem key={crypto.id} value={String(crypto.id)}>
                                <div className="flex items-center gap-2">
                                  <Coins className="w-4 h-4" />
                                  <span>{crypto.name} ({crypto.network})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {selectedCryptoDetails && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Send {formatCurrency(parseFloat(investAmount) || 0)} worth of {selectedCryptoDetails.name} to: 
                          <code className="block bg-secondary/30 p-2 rounded-md mt-1 break-all text-foreground font-mono">
                            {selectedCryptoDetails.wallet}
                          </code>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proofOfPayment">Proof of Payment</Label>
                      <Input 
                        id="proofOfPayment"
                        type="file" 
                        onChange={(e) => setProofOfPayment(e.target.files ? e.target.files[0] : null)} 
                        accept="image/*,application/pdf"
                        disabled={!selectedPlan}
                      />
                      {proofOfPayment && (
                        <p className="text-sm text-muted-foreground">File selected: {proofOfPayment.name}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Your investment will be activated after admin review and approval.
                    </p>
                  </TabsContent>

                  <TabsContent value="balance" className="space-y-4 pt-4">
                     <div className="space-y-2">
                      <Label htmlFor="investAmountBalance">Investment Amount (USD)</Label>
                      <Input 
                        id="investAmountBalance"
                        type="number" 
                        placeholder={`Min ${formatCurrency(selectedPlan?.min_amount || 0)}`} 
                        value={investAmount} 
                        onChange={(e) => setInvestAmount(e.target.value)} 
                        disabled={!selectedPlan}
                      />
                    </div>
                     <p className="text-xs text-muted-foreground text-center pt-2">
                      The amount will be deducted from your available balance.
                    </p>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  variant="hero" 
                  className="w-full" 
                  onClick={handleInvest} 
                  disabled={investmentMethod === 'deposit' ? depositButtonDisabled : balanceButtonDisabled}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Invest Now"}
                </Button>

              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default InvestNow;
