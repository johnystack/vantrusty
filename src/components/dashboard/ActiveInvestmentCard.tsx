import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';

interface Investment {
  amount: number;
  plan_name: string;
  start_date: string;
  end_date: string;
}

interface Props {
  investment: Investment;
}

const ActiveInvestmentCard = ({ investment }: Props) => {
  const calculateProgress = () => {
    const start = new Date(investment.start_date).getTime();
    const end = new Date(investment.end_date).getTime();
    const now = new Date().getTime();

    if (now >= end) return 100;
    if (now < start) return 0;

    return Math.floor(((now - start) / (end - start)) * 100);
  };

  const progress = calculateProgress();

  return (
    <Card className="bg-secondary/50 border-border p-4">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-foreground">{investment.plan_name}</span>
          <span className="font-bold text-lg text-foreground">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(investment.amount)}
          </span>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Progress: {progress}%</span>
            <span>Ends: {format(new Date(investment.end_date), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveInvestmentCard;
