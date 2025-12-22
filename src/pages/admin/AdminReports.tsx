import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Wallet, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const stats = [
  { title: "Total Revenue", value: "$2,456,890", change: "+12.5%", positive: true, icon: DollarSign },
  { title: "Total Users", value: "2,847", change: "+8.2%", positive: true, icon: Users },
  { title: "Active Investments", value: "$1,234,567", change: "+15.3%", positive: true, icon: TrendingUp },
  { title: "Total Withdrawals", value: "$456,789", change: "-3.2%", positive: false, icon: Wallet },
];

const monthlyData = [
  { month: "Jan", withdrawals: 45000, users: 156 },
  { month: "Feb", withdrawals: 62000, users: 234 },
  { month: "Mar", withdrawals: 78000, users: 312 },
  { month: "Apr", withdrawals: 55000, users: 278 },
];

const AdminReports = () => {
  const handleExport = (type: string) => {
    toast({ title: "Export started", description: `${type} report is being generated...` });
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="Reports & Analytics" 
            subtitle="Platform performance and financial reports"
          />

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button variant="outline" onClick={() => handleExport("Financial")}>
              <Download className="w-4 h-4 mr-2" />
              Financial Report
            </Button>
            <Button variant="outline" onClick={() => handleExport("Users")}>
              <Download className="w-4 h-4 mr-2" />
              User Report
            </Button>
            <Button variant="outline" onClick={() => handleExport("Investments")}>
              <Download className="w-4 h-4 mr-2" />
              Investment Report
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} variant="glass">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-xl lg:text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                      <div className={`flex items-center gap-1 mt-1 ${stat.positive ? "text-success" : "text-destructive"}`}>
                        {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm">{stat.change}</span>
                      </div>
                    </div>
                    <div className="p-2 lg:p-3 rounded-xl bg-primary/10 flex-shrink-0">
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Monthly Overview */}
          <Card variant="glass" className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Month</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Withdrawals</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">New Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((row, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2 font-medium text-foreground">{row.month}</td>
                        <td className="py-3 px-2 text-destructive">${row.withdrawals.toLocaleString()}</td>
                        <td className="py-3 px-2 text-muted-foreground">{row.users}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-secondary/30">
                      <td className="py-3 px-2 font-bold text-foreground">Total</td>
                      <td className="py-3 px-2 font-bold text-destructive">
                        ${monthlyData.reduce((sum, r) => sum + r.withdrawals, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 font-bold text-foreground">
                        {monthlyData.reduce((sum, r) => sum + r.users, 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Top Investment Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Elite Plan", investors: 156, amount: "$450,000" },
                  { name: "Annual Plan", investors: 89, amount: "$380,000" },
                  { name: "Silver Plan", investors: 234, amount: "$280,000" },
                  { name: "Starter Plan", investors: 412, amount: "$124,000" },
                ].map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">{plan.investors} investors</p>
                    </div>
                    <span className="font-display font-bold text-primary">{plan.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Recent Payouts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { user: "John D.", amount: "$5,000", date: "Today", status: "completed" },
                  { user: "Jane S.", amount: "$2,500", date: "Today", status: "pending" },
                  { user: "Mike W.", amount: "$10,000", date: "Yesterday", status: "completed" },
                  { user: "Sarah J.", amount: "$1,500", date: "Yesterday", status: "completed" },
                ].map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{payout.user[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{payout.user}</p>
                        <p className="text-sm text-muted-foreground">{payout.date}</p>
                      </div>
                    </div>
                    <span className={`font-medium ${payout.status === "completed" ? "text-success" : "text-warning"}`}>
                      {payout.amount}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
