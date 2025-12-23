import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, DollarSign, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Investment {
  id: number;
  user_id: string;
  amount: number;
  status: 'pending' | 'active' | 'rejected' | 'matured' | 'withdrawn' | 'reinvested' | 'approved';
  created_at: string;
  start_date: string;
  end_date: string;
  bonus: number;
  investment_plans: {
    name: string;
    duration_days: number;
    daily_interest_rate: number;
  };
}

interface InvestmentCardProps {
  investment: Investment;
  onWithdraw: (id: number) => void;
  onReinvest: (id: number) => void;
  onViewDetails: (investment: Investment) => void;
  isWithdrawing: boolean;
  getStatusBadge: (status: Investment['status']) => JSX.Element;
  calculateProgress: (startDate: string, endDate: string) => number;
  calculateReturns: (investment: Investment) => number;
}

const InvestmentCard = ({
  investment,
  onWithdraw,
  onReinvest,
  onViewDetails,
  isWithdrawing,
  getStatusBadge,
  calculateProgress,
  calculateReturns,
}: InvestmentCardProps) => {
  const progress = calculateProgress(investment.start_date, investment.end_date);
  const returns = calculateReturns(investment);

  return (
    <Card className="glass-strong border-border flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{investment.investment_plans.name}</CardTitle>
          {getStatusBadge(investment.status)}
        </div>
        <p className="text-sm text-muted-foreground">Started: {new Date(investment.start_date).toLocaleDateString()}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-medium text-foreground">${investment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bonus:</span>
          <span className="font-medium text-foreground">${investment.bonus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Est. Returns:</span>
          <span className="font-medium text-foreground">${returns.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="pt-2">
          <label className="text-muted-foreground text-xs block mb-1">Progress</label>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-full h-2 [&::-webkit-progress-bar]:bg-primary/20 [&::-webkit-progress-value]:bg-orange-500" />
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4 border-t border-border/50">
        <Button size="sm" variant="outline" onClick={() => onViewDetails(investment)}>
          <Eye className="w-4 h-4 mr-2" /> Details
        </Button>
        {investment.status === 'matured' ? (
          <>
            <Button size="sm" onClick={() => onWithdraw(investment.id)} disabled={isWithdrawing}>
              <DollarSign className="w-4 h-4 mr-2" /> {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onReinvest(investment.id)}>
              <Repeat className="w-4 h-4 mr-2" /> Reinvest
            </Button>
          </>
        ) : investment.status === 'withdrawn' || investment.status === 'reinvested' ? (
          <Badge variant="outline" className="text-xs">
            {investment.status === 'withdrawn' ? 'Withdrawn' : 'Reinvested'}
          </Badge>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default InvestmentCard;
