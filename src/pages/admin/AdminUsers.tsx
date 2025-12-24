import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, UserCheck, UserX, Mail, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  available_balance: number;
  created_at: string;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'suspend' | 'activate' | 'email', userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (action === 'email') {
      toast({
        title: `Email action`,
        description: `Placeholder for sending email to ${user.full_name}`,
      });
      return;
    }

    setIsUpdating(true);
    const newStatus = action === 'activate' ? 'active' : 'suspended';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: `User ${action === 'activate' ? 'Activated' : 'Suspended'}`,
        description: `${user.full_name}'s status has been updated to ${newStatus}.`,
      });
      
      // Refresh the user list to show the new status
      fetchUsers();
      setSelectedUser(null); // Close modal if open

    } catch (error: any) {
      toast({
        title: `Error updating user`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, username, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-3 px-2"><Skeleton className="h-5 w-32" /></td>
                          <td className="py-3 px-2 hidden md:table-cell"><Skeleton className="h-5 w-20" /></td>
                          <td className="py-3 px-2 hidden lg:table-cell"><Skeleton className="h-5 w-24" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-16" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-16" /></td>
                          <td className="py-3 px-2"><Skeleton className="h-5 w-12" /></td>
                        </tr>
                      ))
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">No users found.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="py-3 px-2">
                            <div>
                              <div className="font-medium text-foreground text-sm">{user.full_name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-2 hidden md:table-cell">
                            <span className="text-sm font-medium text-foreground">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.available_balance)}
                            </span>
                          </td>
                          <td className="py-3 px-2 hidden lg:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'} className="text-xs capitalize">
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={user.status === 'active' ? 'success' : 'destructive'} className="text-xs capitalize">
                              {user.status}
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
                                <DropdownMenuItem onClick={() => setSelectedUser(user)} disabled={isUpdating}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction("email", user.id)} disabled={isUpdating}>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                {user.status === "active" ? (
                                  <DropdownMenuItem
                                    onClick={() => handleAction("suspend", user.id)}
                                    className="text-destructive"
                                    disabled={isUpdating}
                                  >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleAction("activate", user.id)}
                                    className="text-success"
                                    disabled={isUpdating}
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
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
                <DialogDescription>
                  Complete user information
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Full Name</label>
                      <p className="font-medium text-foreground">{selectedUser.full_name}</p>
                    </div>
                     <div>
                      <label className="text-sm text-muted-foreground">Username</label>
                      <p className="font-medium text-foreground">{selectedUser.username}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground text-sm break-all">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Available Balance</label>
                      <p className="font-medium text-foreground">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedUser.available_balance)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Role</label>
                      <Badge variant={selectedUser.role === 'admin' ? 'destructive' : 'outline'}>{selectedUser.role}</Badge>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Joined</label>
                      <p className="font-medium text-foreground">{new Date(selectedUser.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => handleAction("email", selectedUser.id)} disabled={isUpdating}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant={selectedUser.status === "active" ? "destructive" : "default"}
                      className="flex-1"
                      onClick={() => handleAction(selectedUser.status === "active" ? "suspend" : "activate", selectedUser.id)}
                      disabled={isUpdating}
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
