import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Eye, FileText, User } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const kycRequests = [
  { id: 1, user: "John Doe", email: "john.doe@email.com", documentType: "Passport", documentNumber: "AB123456", country: "United States", status: "pending", submittedDate: "2024-04-10" },
  { id: 2, user: "Jane Smith", email: "jane.smith@email.com", documentType: "Driver's License", documentNumber: "DL789012", country: "Canada", status: "approved", submittedDate: "2024-04-08" },
  { id: 3, user: "Mike Wilson", email: "mike.wilson@email.com", documentType: "National ID", documentNumber: "NID345678", country: "United Kingdom", status: "pending", submittedDate: "2024-04-09" },
  { id: 4, user: "Sarah Jones", email: "sarah.jones@email.com", documentType: "Passport", documentNumber: "CD901234", country: "Australia", status: "rejected", submittedDate: "2024-04-07" },
  { id: 5, user: "Alex Brown", email: "alex.brown@email.com", documentType: "Driver's License", documentNumber: "DL567890", country: "Germany", status: "pending", submittedDate: "2024-04-10" },
];

const AdminKYC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKYC, setSelectedKYC] = useState<typeof kycRequests[0] | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredKYC = kycRequests.filter(k => {
    const matchesSearch = k.user.toLowerCase().includes(searchTerm.toLowerCase()) || k.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || k.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id: number) => {
    toast({ title: "KYC Approved", description: `User verification #${id} has been approved.` });
    setSelectedKYC(null);
  };

  const handleReject = (id: number) => {
    toast({ title: "KYC Rejected", description: `User verification #${id} has been rejected.`, variant: "destructive" });
    setSelectedKYC(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
      case "approved":
        return <Badge className="bg-success/20 text-success border-success/30">Approved</Badge>;
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
            title="KYC Verification" 
            subtitle="Review and approve user identity verification"
          />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/20">
                    <User className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-display font-bold text-foreground">{kycRequests.filter(k => k.status === "pending").length}</p>
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
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-xl font-display font-bold text-foreground">{kycRequests.filter(k => k.status === "approved").length}</p>
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
                    <p className="text-xl font-display font-bold text-foreground">{kycRequests.filter(k => k.status === "rejected").length}</p>
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
                    placeholder="Search users..."
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

          {/* KYC Table */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Verification Requests ({filteredKYC.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Document</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Country</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Submitted</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKYC.map((kyc) => (
                      <tr key={kyc.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium text-foreground text-sm">{kyc.user}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block truncate max-w-[120px]">{kyc.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">{kyc.documentType}</span>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">{kyc.country}</span>
                        </td>
                        <td className="py-3 px-2 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">{kyc.submittedDate}</span>
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(kyc.status)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedKYC(kyc)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {kyc.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleApprove(kyc.id)} className="text-success">
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleReject(kyc.id)} className="text-destructive">
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

          {/* KYC Details Modal */}
          <Dialog open={!!selectedKYC} onOpenChange={() => setSelectedKYC(null)}>
            <DialogContent className="glass-strong border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>KYC Details</DialogTitle>
                <DialogDescription>Review user verification documents</DialogDescription>
              </DialogHeader>
              {selectedKYC && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Full Name</label>
                      <p className="font-medium text-foreground">{selectedKYC.user}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground text-sm break-all">{selectedKYC.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Document Type</label>
                      <p className="font-medium text-foreground">{selectedKYC.documentType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Document Number</label>
                      <p className="font-medium text-foreground">{selectedKYC.documentNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Country</label>
                      <p className="font-medium text-foreground">{selectedKYC.country}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Submitted</label>
                      <p className="font-medium text-foreground">{selectedKYC.submittedDate}</p>
                    </div>
                  </div>
                  
                  {/* Document Preview Placeholder */}
                  <div className="border border-border rounded-xl p-8 text-center bg-secondary/20">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Document preview would appear here</p>
                  </div>

                  {selectedKYC.status === "pending" && (
                    <div className="flex gap-2 pt-4">
                      <Button variant="default" className="flex-1 bg-success hover:bg-success/90" onClick={() => handleApprove(selectedKYC.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedKYC.id)}>
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

export default AdminKYC;
