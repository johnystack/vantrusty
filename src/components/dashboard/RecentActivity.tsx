import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: number;
  plan_name: string;
  amount: number;
  status: 'pending' | 'active' | 'denied' | 'matured' | 'withdrawn' | 'reinvested';
  created_at: string;
}

const getStatusBadge = (status: Activity['status']) => {
  switch (status) {
    case "pending":
      return <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">{status}</span>;
    case "active":
      return <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">{status}</span>;
    case "denied":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">{status}</span>;
    default:
      return <span className="text-xs px-2 py-0.5 rounded-full bg-muted/20 text-muted-foreground">{status}</span>;
  }
};

const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        const { data, error } = await supabase
          .from('investment_details')
          .select('id, plan_name, amount, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setActivities(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching recent activity",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Card variant="glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No recent activity found.
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Investment</span>
                  <span className="font-medium text-foreground">
                    -${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activity.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">{activity.plan_name}</span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activity.status)}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
