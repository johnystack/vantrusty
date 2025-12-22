import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    type: "investment",
    title: "Investment",
    description: "Elite Plan activated",
    amount: "-$10,000.00",
    time: "5 hours ago",
    status: "completed",
  },
  {
    type: "withdrawal",
    title: "Withdrawal",
    description: "ETH Withdrawal processing",
    amount: "-$1,200.00",
    time: "1 day ago",
    status: "pending",
  },
  {
    type: "earning",
    title: "Earnings",
    description: "Investment returns",
    amount: "+$450.00",
    time: "2 days ago",
    status: "completed",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "withdrawal":
      return ArrowUpRight;
    case "investment":
    case "earning":
      return TrendingUp;
    default:
      return Clock;
  }
};

const RecentActivity = () => {
  return (
    <Card variant="glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type);
          return (
            <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                activity.type === "earning" ? "bg-success/10" : "bg-primary/10"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  activity.type === "earning" ? "text-success" : "text-primary"
                )} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{activity.title}</span>
                  <span className={cn(
                    "font-medium",
                    activity.amount.startsWith("+") ? "text-success" : "text-foreground"
                  )}>
                    {activity.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">{activity.description}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      activity.status === "completed" 
                        ? "bg-success/10 text-success" 
                        : "bg-warning/10 text-warning"
                    )}>
                      {activity.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
