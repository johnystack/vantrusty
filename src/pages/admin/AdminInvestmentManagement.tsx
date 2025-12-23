import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Check, X, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Investment {
  id: number;
  user_id: string;
  amount: number;
  status: 'pending' | 'active' | 'denied' | 'matured' | 'withdrawn' | 'reinvested';
  created_at: string;
  start_date: string;
  end_date: string;
  crypto_type: string;
  proof_of_payment_url: string;
  bonus: number;
  full_name: string;
  email: string;
  plan_name: string;
  plan_duration_days: number;
  plan_daily_interest_rate: number;
}

const AdminInvestmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [investmentForBonus, setInvestmentForBonus] = useState<Investment | null>(null); // New state for bonus adjustment
  const [bonusAdjustment, setBonusAdjustment] = useState(0); // New state for bonus amount input
  const [bonusAction, setBonusAction] = useState<'add' | 'deduct' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('investment_details') // Query the new view
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching investments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = supabase.channel('investments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, (payload) => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      const investmentToConfirm = investments.find(inv => inv.id === id);
      if(!investmentToConfirm) return;

      const { error } = await supabase
        .from('investments')
        .update({ status: 'active', start_date: new Date().toISOString(), end_date: new Date(Date.now() + (investmentToConfirm?.plan_duration_days || 0) * 24 * 60 * 60 * 1000).toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        p_user_id: investmentToConfirm.user_id,
        p_amount: investmentToConfirm.amount,
      });
      if (balanceError) throw balanceError;

      toast({ title: "Investment Confirmed", description: `Investment #${id} has been activated.` });
      setSelectedInvestment(null);
      fetchData(); // Re-fetch data
    } catch (error: any) {
      toast({
        title: "Error confirming investment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const { error } = await supabase
        .from('investments')
        .update({ status: 'denied' })
        .eq('id', id);

      if (error) throw error;

      toast({ title: "Investment Rejected", description: `Investment #${id} has been rejected.`, variant: "destructive" });
      setSelectedInvestment(null);
      fetchData(); // Re-fetch data
    } catch (error: any) {
      toast({
        title: "Error rejecting investment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openBonusModal = (investment: Investment, action: 'add' | 'deduct') => {
    setInvestmentForBonus(investment);
    setBonusAction(action);
    setBonusAdjustment(0);
  };
  
  const handleAdjustBonus = async () => {
    if (!investmentForBonus || bonusAdjustment === 0) {
      toast({ title: "No adjustment specified", description: "Please enter a non-zero amount.", variant: "destructive" });
      return;
    }

    const adjustment = bonusAction === 'deduct' ? -bonusAdjustment : bonusAdjustment;
    
    try {
      const { error } = await supabase.rpc('adjust_investment_bonus', {
        p_investment_id: investmentForBonus.id,
        p_bonus_adjustment: adjustment
      });

      if (error) throw error;

      toast({
        title: "Bonus Adjusted",
        description: `Successfully adjusted bonus for investment #${investmentForBonus.id} by ${adjustment}.`
      });

      setInvestmentForBonus(null);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error adjusting bonus",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredInvestments = investments.filter(inv =>
    (inv.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: 'pending' | 'active' | 'denied' | 'matured' | 'withdrawn' | 'reinvested') => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case "denied":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Denied</Badge>;
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
  
  const calculateReturns = (investment: Investment): number => {
    // Only calculate for active/matured investments for admin view
    if (investment.status !== 'active' && investment.status !== 'matured') return 0; 
    const dailyRate = investment.plan_daily_interest_rate / 100;
    const durationDays = investment.plan_duration_days;
    
    const interest = investment.amount * dailyRate * durationDays;
    return investment.amount + interest;
  };
  
  const calculateProgress = (startDate: string, endDate: string, status: 'pending' | 'active' | 'denied' | 'matured' | 'withdrawn' | 'reinvested') => {
    if (status === 'pending' || !startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.floor(((now - start) / (end - start)) * 100);
  };


  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="Investment Management" 
            subtitle="Monitor and manage all investments"
          />

          <Card variant="glass" className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search investments by user, plan, or status..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>All Investments ({filteredInvestments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Plan</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Bonus</th> {/* New */}
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Returns</th> {/* New */}
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Progress</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-3 px-2"><Skeleton className="h-5 w-24" /></td>
                          <td className="py-3 px-2 hidden sm:table-cell"><Skeleton className="h-5 w-20" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-16" /></td>
                          <td className="py-3 px-2 hidden lg:table-cell"><Skeleton className="h-5 w-20" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-16" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-28" /></td>
                        </tr>
                      ))
                    ) : filteredInvestments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-muted-foreground">No investments found.</td>
                      </tr>
                    ) : (
                      filteredInvestments.map((investment) => (
                        <tr key={investment.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-3 px-2">
                            <div>
                              <div className="font-medium text-foreground text-sm">{investment.full_name}</div>
                              <div className="text-xs text-muted-foreground hidden sm:block truncate max-w-[120px]">{investment.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-2 hidden sm:table-cell">
                            <span className="text-sm text-foreground">{investment.plan_name}</span>
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
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-primary rounded-full"
                                  style={{ width: `${calculateProgress(investment.start_date, investment.end_date, investment.status)}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{calculateProgress(investment.start_date, investment.end_date, investment.status)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            {getStatusBadge(investment.status)}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setSelectedInvestment(investment)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {investment.status === "pending" && (
                                <>
                                  <Button variant="ghost" size="icon" onClick={() => handleConfirm(investment.id)} className="text-success">
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleReject(investment.id)} className="text-destructive">
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="icon" onClick={() => openBonusModal(investment, 'add')}>
                                <DollarSign className="w-4 h-4 text-success" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openBonusModal(investment, 'deduct')}>
                                <DollarSign className="w-4 h-4 text-destructive" />
                              </Button>
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

          <Dialog open={!!selectedInvestment} onOpenChange={() => setSelectedInvestment(null)}>
            <DialogContent className="glass-strong border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>Investment Details</DialogTitle>
                <DialogDescription>Review investment transaction</DialogDescription>
              </DialogHeader>
              {selectedInvestment && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">User</label>
                      <p className="font-medium text-foreground">{selectedInvestment.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground">{selectedInvestment.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Plan</label>
                      <p className="font-medium text-foreground">{selectedInvestment.plan_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Amount</label>
                      <p className="font-medium text-foreground text-lg">${selectedInvestment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Bonus</label> {/* New */}
                      <p className="font-medium text-foreground text-lg">${selectedInvestment.bonus.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Returns</label> {/* New */}
                      <p className="font-medium text-foreground text-lg">${calculateReturns(selectedInvestment).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Cryptocurrency</label>
                      <p className="font-medium text-foreground">{selectedInvestment.crypto_type}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Date</label>
                      <p className="font-medium text-foreground">{new Date(selectedInvestment.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Proof of Payment</label>
                      <a 
                        href={selectedInvestment.proof_of_payment_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Eye className="w-4 h-4" />
                        View Proof
                      </a>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      {getStatusBadge(selectedInvestment.status)}
                    </div>
                  </div>
                  {selectedInvestment.status === "pending" && (
                    <div className="flex gap-2 pt-4">
                      <Button variant="default" className="flex-1 bg-success hover:bg-success/90" onClick={() => handleConfirm(selectedInvestment.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        Confirm
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedInvestment.id)}>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Bonus Adjustment Modal */}
          <Dialog open={!!investmentForBonus} onOpenChange={() => setInvestmentForBonus(null)}>
            <DialogContent className="glass-strong border-border">
              <DialogHeader>
                <DialogTitle>{bonusAction === 'add' ? 'Add' : 'Deduct'} Bonus</DialogTitle>
                <DialogDescription>
                  {bonusAction === 'add' ? 'Add to' : 'Deduct from'} the bonus for Investment #{investmentForBonus?.id}. Current bonus: ${investmentForBonus?.bonus.toLocaleString()}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <label htmlFor="bonus-adjustment" className="text-sm font-medium text-muted-foreground">
                  Adjustment Amount
                </label>
                <Input
                  id="bonus-adjustment"
                  type="number"
                  placeholder="Enter amount"
                  className="mt-2"
                  value={bonusAdjustment}
                  onChange={(e) => setBonusAdjustment(parseFloat(e.target.value) || 0)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInvestmentForBonus(null)}>Cancel</Button>
                <Button onClick={handleAdjustBonus}>Save Adjustment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default AdminInvestmentManagement;
