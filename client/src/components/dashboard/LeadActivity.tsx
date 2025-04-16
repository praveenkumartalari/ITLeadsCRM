
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PhoneCall, Mail, MessageSquare, Clock, File } from "lucide-react";

const activities = [
  {
    id: 1,
    leadName: "Sarah Johnson",
    action: "Email",
    description: "Sent product demo invitation",
    time: "10 mins ago",
    icon: Mail,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
    avatar: "SJ",
  },
  {
    id: 2,
    leadName: "David Williams",
    action: "Call",
    description: "Discussed pricing options",
    time: "1 hour ago",
    icon: PhoneCall,
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
    avatar: "DW",
  },
  {
    id: 3,
    leadName: "Emily Martinez",
    action: "Meeting",
    description: "Scheduled product demo",
    time: "3 hours ago",
    icon: Clock,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100",
    avatar: "EM",
  },
  {
    id: 4,
    leadName: "Michael Robinson",
    action: "Note",
    description: "Added follow-up reminder",
    time: "Yesterday",
    icon: File,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-100",
    avatar: "MR",
  },
  {
    id: 5,
    leadName: "Lisa Thompson",
    action: "Message",
    description: "Replied to feature inquiry",
    time: "Yesterday",
    icon: MessageSquare,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-100",
    avatar: "LT",
  }
];

export function LeadActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage alt={activity.leadName} />
            <AvatarFallback>{activity.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{activity.leadName}</span>
              <div className={`rounded-full ${activity.iconBg} ${activity.iconColor} p-1 text-xs flex items-center gap-1`}>
                <activity.icon className="h-3 w-3" />
                <span>{activity.action}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{activity.description}</p>
            <p className="text-xs text-gray-400">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
