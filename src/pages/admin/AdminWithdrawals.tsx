import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Eye, Clock, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface WithdrawalDetail {
  id: number;
  user_id: string;
  amount: number;
  wallet_address: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  full_name: string;
  username: string;
}

const AdminWithdrawals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState<WithdrawalDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalDetail | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('withdrawal_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching withdrawals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (id: number) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "Withdrawal Approved", description: `Withdrawal #${id} has been approved.` });
      fetchWithdrawals();
      setSelectedWithdrawal(null);
    } catch (error: any) {
      toast({ title: "Error Approving Withdrawal", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (id: number) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.rpc('reject_withdrawal', { withdrawal_id_to_reject: id });

      if (error) throw error;

      toast({ title: "Withdrawal Rejected", description: `Withdrawal #${id} has been rejected and funds returned to the user.`, variant: "destructive" });
      fetchWithdrawals();
      setSelectedWithdrawal(null);
    } catch (error: any) {
      toast({ title: "Error Rejecting Withdrawal", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = w.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || w.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || w.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingTotal = withdrawals.filter(w => w.status === "pending").reduce((sum, w) => sum + w.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
      case "approved":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Approved</Badge>;
      case "completed":
        return <Badge className="bg-success/20 text-success border-success/30">Completed</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="Withdrawal Management" 
            subtitle="Review and process withdrawal requests"
          />

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card variant="glass">
              <CardContent className="p-4">
                {loading ? <Skeleton className="h-16" /> : <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/20">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-display font-bold text-foreground">{withdrawals.filter(w => w.status === "pending").length}</p>
                  </div>
                </div>}
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                {loading ? <Skeleton className="h-16" /> : <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Amount</p>
                    <p className="text-xl font-display font-bold text-foreground">${pendingTotal.toLocaleString()}</p>
                  </div>
                </div>}
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                {loading ? <Skeleton className="h-16" /> : <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/20">
                    <Check className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-xl font-display font-bold text-foreground">{withdrawals.filter(w => w.status === "approved").length}</p>
                  </div>
                </div>}
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                {loading ? <Skeleton className="h-16" /> : <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/20">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-xl font-display font-bold text-foreground">{withdrawals.filter(w => w.status === "rejected").length}</p>
                  </div>
                </div>}
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card variant="glass" className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user name or username..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "pending", "approved", "rejected"].map((status) => (
                    <Button
                      key={status}
                      variant={filter === status ? "outline" : "ghost"}
                      size="sm"
                      onClick={() => setFilter(status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawals Table */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Withdrawal Requests ({filteredWithdrawals.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-3 px-2"><Skeleton className="h-5 w-32" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-24" /></td>
                          <td className="py-3 px-2 hidden md:table-cell"><Skeleton className="h-5 w-28" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-20" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-20" /></td>
                        </tr>
                      ))
                    ) : filteredWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium text-foreground text-sm">{withdrawal.full_name}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block truncate max-w-[120px]">{withdrawal.username}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm font-medium text-foreground">${withdrawal.amount.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">{new Date(withdrawal.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(withdrawal.status)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedWithdrawal(withdrawal)} disabled={isUpdating}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {withdrawal.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleApprove(withdrawal.id)} className="text-success" disabled={isUpdating}>
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleReject(withdrawal.id)} className="text-destructive" disabled={isUpdating}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Details Modal */}
          <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
            <DialogContent className="glass-strong border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>Withdrawal Details</DialogTitle>
                <DialogDescription>Review withdrawal request</DialogDescription>
              </DialogHeader>
              {selectedWithdrawal && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">User</label>
                      <p className="font-medium text-foreground">{selectedWithdrawal.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Username</label>
                      <p className="font-medium text-foreground">@{selectedWithdrawal.username}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Amount</label>
                      <p className="font-medium text-foreground text-lg">${selectedWithdrawal.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Request Date</label>
                      <p className="font-medium text-foreground">{new Date(selectedWithdrawal.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Wallet Address</label>
                      <p className="font-medium text-foreground font-mono text-sm break-all">{selectedWithdrawal.wallet_address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      {getStatusBadge(selectedWithdrawal.status)}
                    </div>
                  </div>
                  {selectedWithdrawal.status === "pending" && (
                    <div className="flex gap-2 pt-4">
                      <Button variant="default" className="flex-1 bg-success hover:bg-success/90" onClick={() => handleApprove(selectedWithdrawal.id)} disabled={isUpdating}>
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedWithdrawal.id)} disabled={isUpdating}>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default AdminWithdrawals;
