import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Performer {
  userId: number;
  name: string;
  email: string;
  dealsClosed: number;
  amount: number;
}

interface TopPerformersProps {
  performers: Performer[];
  isLoading?: boolean;
}

export default function TopPerformers({
  performers,
  isLoading = false
}: TopPerformersProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="p-4 border-b border-slate-200">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="w-full py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : performers.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">No performance data available</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {performers.map((performer, index) => (
              <li key={performer.userId} className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 rounded-full">
                  <AvatarFallback
                    className={`${index === 0 ? 'bg-amber-100 text-amber-800' : 
                               index === 1 ? 'bg-slate-100 text-slate-800' : 
                               'bg-orange-100 text-orange-800'}`}
                  >
                    {getInitials(performer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {performer.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {performer.dealsClosed} deals closed
                  </p>
                </div>
                <div className="inline-flex items-center text-sm font-semibold text-green-600">
                  ${performer.amount.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
