import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { 
  ArrowUpIcon, 
  ArrowDownIcon 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  trend?: number;
  trendLabel?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  trend,
  trendLabel
}: StatsCardProps) {
  const isPositiveTrend = trend && trend > 0;
  
  return (
    <Card className="bg-white rounded-lg shadow p-4 flex items-center">
      <div className={cn("rounded-full p-3", iconBgColor, iconColor)}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
        {trend !== undefined && (
          <p className={cn(
            "text-xs flex items-center",
            isPositiveTrend ? "text-emerald-500" : "text-red-500"
          )}>
            {isPositiveTrend ? (
              <ArrowUpIcon className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 mr-0.5" />
            )}
            {Math.abs(trend)}% {trendLabel || "this month"}
          </p>
        )}
      </div>
    </Card>
  );
}
