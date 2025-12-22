import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, UserCheck, UserX, Mail, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const users = [
  { id: 1, name: "John Doe", email: "john.doe@email.com", balance: "$45,230", investments: "$32,500", status: "active", kyc: "verified", joined: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane.smith@email.com", balance: "$28,400", investments: "$15,000", status: "active", kyc: "verified", joined: "2024-02-20" },
  { id: 3, name: "Mike Wilson", email: "mike.wilson@email.com", balance: "$12,850", investments: "$8,500", status: "suspended", kyc: "pending", joined: "2024-03-10" },
  { id: 4, name: "Sarah Jones", email: "sarah.jones@email.com", balance: "$67,200", investments: "$45,000", status: "active", kyc: "verified", joined: "2024-01-05" },
  { id: 5, name: "Alex Brown", email: "alex.brown@email.com", balance: "$5,200", investments: "$2,500", status: "active", kyc: "rejected", joined: "2024-04-01" },
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (action: string, userId: number) => {
    toast({
      title: `${action} action`,
      description: `Successfully performed ${action} on user ID: ${userId}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="User Management" 
            subtitle="View and manage all platform users"
          />

          {/* Search and Filters */}
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">All Users</Button>
                  <Button variant="ghost" size="sm">Active</Button>
                  <Button variant="ghost" size="sm">Suspended</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Balance</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Investments</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">KYC</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium text-foreground text-sm">{user.name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <span className="text-sm font-medium text-foreground">{user.balance}</span>
                        </td>
                        <td className="py-3 px-2 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">{user.investments}</span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-xs">
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              user.kyc === "verified" ? "border-success text-success" :
                              user.kyc === "pending" ? "border-warning text-warning" :
                              "border-destructive text-destructive"
                            }`}
                          >
                            {user.kyc}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-strong border-border bg-card">
                              <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("email", user.id)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleAction("suspend", user.id)} className="text-destructive">
                                  <UserX className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleAction("activate", user.id)} className="text-success">
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* User Details Modal */}
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="glass-strong border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>Complete user information</DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Name</label>
                      <p className="font-medium text-foreground">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground text-sm break-all">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Balance</label>
                      <p className="font-medium text-foreground">{selectedUser.balance}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Investments</label>
                      <p className="font-medium text-foreground">{selectedUser.investments}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      <Badge variant={selectedUser.status === "active" ? "default" : "destructive"}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">KYC Status</label>
                      <Badge variant="outline">{selectedUser.kyc}</Badge>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Joined</label>
                      <p className="font-medium text-foreground">{selectedUser.joined}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => handleAction("email", selectedUser.id)}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant={selectedUser.status === "active" ? "destructive" : "default"} 
                      className="flex-1"
                      onClick={() => handleAction(selectedUser.status === "active" ? "suspend" : "activate", selectedUser.id)}
                    >
                      {selectedUser.status === "active" ? "Suspend" : "Activate"}
                    </Button>
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

export default AdminUsers;
