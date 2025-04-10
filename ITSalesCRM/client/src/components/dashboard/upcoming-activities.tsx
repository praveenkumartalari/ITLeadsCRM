import { Link } from "wouter";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Activity } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";
import { 
  Phone, 
  MessageSquare, 
  Video, 
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UpcomingActivitiesProps {
  activities: Activity[];
  isLoading?: boolean;
}

export default function UpcomingActivities({
  activities,
  isLoading = false
}: UpcomingActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call':
        return <Phone className="text-lg" />;
      case 'email':
        return <MessageSquare className="text-lg" />;
      case 'meeting':
      case 'demo':
        return <Video className="text-lg" />;
      default:
        return <Calendar className="text-lg" />;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call':
        return 'bg-primary-100 text-primary-600';
      case 'email':
        return 'bg-secondary-100 text-secondary-600';
      case 'meeting':
        return 'bg-amber-100 text-amber-600';
      case 'demo':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };
  
  const getRelatedStatusBadge = (activity: Activity) => {
    if (activity.relatedTo === 'Lead') {
      return (
        <Badge
          variant="outline"
          className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800"
        >
          Lead
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="px-1.5 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800"
        >
          Client
        </Badge>
      );
    }
  };
  
  const formatActivityTime = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };
  
  return (
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="p-4 border-b border-slate-200 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Upcoming Activities
        </CardTitle>
        <Link href="/activities">
          <a className="text-sm text-primary hover:text-primary-700 font-medium">
            View all
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="w-full py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">No upcoming activities</p>
            <Link href="/activities/new">
              <a className="mt-2 inline-block text-primary font-medium">
                Schedule an activity
              </a>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {activities.map(activity => (
              <li key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatActivityTime(new Date(activity.scheduledAt))}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-slate-600 mr-2">
                      {activity.assignedToId ? `Assigned to #${activity.assignedToId}` : 'Unassigned'}
                    </span>
                    {getRelatedStatusBadge(activity)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
