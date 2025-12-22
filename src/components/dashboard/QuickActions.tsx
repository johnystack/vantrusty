import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Download, Upload, Copy, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { icon: TrendingUp, label: "Invest", path: "/dashboard/investments", color: "bg-gradient-primary" },
  { icon: Upload, label: "Withdraw", path: "/dashboard/withdraw", color: "bg-accent" },
  { icon: Copy, label: "Referral", path: "/dashboard/referrals", color: "bg-secondary" },
  { icon: HelpCircle, label: "Support", path: "/dashboard/support", color: "bg-muted" },
];

const QuickActions = () => {
  return (
    <Card variant="glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {actions.map((action) => (
            <Link 
              key={action.path}
              to={action.path}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-muted-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
