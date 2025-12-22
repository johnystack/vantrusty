import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Eye, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const withdrawals = [
  { id: 1, user: "John Doe", email: "john.doe@email.com", amount: "$5,000", method: "Bank Transfer", wallet: "****4521", status: "pending", requestDate: "2024-04-10", processedDate: null },
  { id: 2, user: "Jane Smith", email: "jane.smith@email.com", amount: "$2,500", method: "Bitcoin", wallet: "bc1q...xyz", status: "pending", requestDate: "2024-04-10", processedDate: null },
  { id: 3, user: "Mike Wilson", email: "mike.wilson@email.com", amount: "$10,000", method: "USDT", wallet: "0x...abc", status: "approved", requestDate: "2024-04-09", processedDate: "2024-04-10" },
  { id: 4, user: "Sarah Jones", email: "sarah.jones@email.com", amount: "$1,500", method: "Ethereum", wallet: "0x...def", status: "completed", requestDate: "2024-04-08", processedDate: "2024-04-09" },
  { id: 5, user: "Alex Brown", email: "alex.brown@email.com", amount: "$3,000", method: "Bank Transfer", wallet: "****8745", status: "rejected", requestDate: "2024-04-07", processedDate: "2024-04-08" },
];

const AdminWithdrawals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<typeof withdrawals[0] | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = w.user.toLowerCase().includes(searchTerm.toLowerCase()) || w.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || w.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingTotal = withdrawals.filter(w => w.status === "pending").reduce((sum, w) => sum + parseFloat(w.amount.replace(/[$,]/g, "")), 0);

  const handleApprove = (id: number) => {
    toast({ title: "Withdrawal approved", description: `Withdrawal #${id} has been approved and will be processed.` });
    setSelectedWithdrawal(null);
  };

  const handleReject = (id: number) => {
    toast({ title: "Withdrawal rejected", description: `Withdrawal #${id} has been rejected.`, variant: "destructive" });
    setSelectedWithdrawal(null);
  };

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
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/20">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-display font-bold text-foreground">{withdrawals.filter(w => w.status === "pending").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Amount</p>
                    <p className="text-xl font-display font-bold text-foreground">${pendingTotal.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/20">
                    <Check className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-xl font-display font-bold text-foreground">{withdrawals.filter(w => w.status === "completed").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/20">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-xl font-display font-bold text-foreground">{withdrawals.filter(w => w.status === "rejected").length}</p>
                  </div>
                </div>
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
                    placeholder="Search withdrawals..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "pending", "approved", "completed", "rejected"].map((status) => (
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
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Method</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium text-foreground text-sm">{withdrawal.user}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block truncate max-w-[120px]">{withdrawal.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm font-medium text-foreground">{withdrawal.amount}</span>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">{withdrawal.method}</span>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">{withdrawal.requestDate}</span>
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(withdrawal.status)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedWithdrawal(withdrawal)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {withdrawal.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleApprove(withdrawal.id)} className="text-success">
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleReject(withdrawal.id)} className="text-destructive">
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
                      <p className="font-medium text-foreground">{selectedWithdrawal.user}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground text-sm break-all">{selectedWithdrawal.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Amount</label>
                      <p className="font-medium text-foreground text-lg">{selectedWithdrawal.amount}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Method</label>
                      <p className="font-medium text-foreground">{selectedWithdrawal.method}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Wallet/Account</label>
                      <p className="font-medium text-foreground font-mono text-sm">{selectedWithdrawal.wallet}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Request Date</label>
                      <p className="font-medium text-foreground">{selectedWithdrawal.requestDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      {getStatusBadge(selectedWithdrawal.status)}
                    </div>
                  </div>
                  {selectedWithdrawal.status === "pending" && (
                    <div className="flex gap-2 pt-4">
                      <Button variant="default" className="flex-1 bg-success hover:bg-success/90" onClick={() => handleApprove(selectedWithdrawal.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedWithdrawal.id)}>
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
