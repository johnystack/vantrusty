import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Download, Upload, AlertCircle, CheckCircle, Clock } from "lucide-react";

const stats = [
  { title: "Total Users", value: "2,847", change: "+124 this week", icon: Users, color: "bg-gradient-primary" },
  { title: "Active Investments", value: "$1.2M", change: "+$85K this week", icon: TrendingUp, color: "bg-gradient-accent" },
  { title: "Pending Withdrawals", value: "23", change: "$45,200 total", icon: Upload, color: "bg-warning/20" },
];

const recentActivity = [
  { type: "withdrawal", user: "john.doe@email.com", amount: "$5,000", status: "pending", time: "2 min ago" },
  { type: "investment", user: "mike.wilson@email.com", amount: "$25,000", status: "active", time: "1 hour ago" },
  { type: "kyc", user: "sarah.jones@email.com", amount: "Verification", status: "pending", time: "2 hours ago" },
  { type: "withdrawal", user: "alex.brown@email.com", amount: "$2,500", status: "completed", time: "3 hours ago" },
];

const AdminDashboard = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="Admin Dashboard" 
            subtitle="Overview of platform activity and management"
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} variant="glass" className="overflow-hidden">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground truncate">{stat.title}</p>
                      <p className="text-xl lg:text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{stat.change}</p>
                    </div>
                    <div className={`p-2 lg:p-3 rounded-xl ${stat.color} flex-shrink-0`}>
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pending KYC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold text-warning">12</div>
                <p className="text-sm text-muted-foreground">Awaiting verification</p>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Active Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold text-success">456</div>
                <p className="text-sm text-muted-foreground">Running investments</p>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Today's Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold gradient-text-gold">$24,500</div>
                <p className="text-sm text-muted-foreground">From fees & investments</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">User</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2">
                          <span className="capitalize text-sm font-medium text-foreground">{activity.type}</span>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground truncate max-w-[150px] block">{activity.user}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm font-medium text-foreground">{activity.amount}</span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(activity.status)}
                            <span className="text-sm capitalize hidden sm:inline">{activity.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
