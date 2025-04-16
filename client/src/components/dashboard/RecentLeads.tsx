
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PhoneCall, Mail } from "lucide-react";

const recentLeads = [
  {
    id: 1,
    name: "Jacob Wilson",
    company: "Acme Corporation",
    email: "jacob@acme.com",
    status: "New",
    source: "Website",
    avatar: "JW",
  },
  {
    id: 2,
    name: "Emma Davis",
    company: "Tech Industries",
    email: "emma@tech-ind.com",
    status: "Contacted",
    source: "Referral",
    avatar: "ED",
  },
  {
    id: 3,
    name: "Robert Miller",
    company: "Global Solutions",
    email: "robert@global-sol.com",
    status: "New",
    source: "LinkedIn",
    avatar: "RM",
  },
  {
    id: 4,
    name: "Olivia Brown",
    company: "Innovate Inc",
    email: "olivia@innovate.com",
    status: "Qualified",
    source: "Event",
    avatar: "OB",
  },
];

export function RecentLeads() {
  return (
    <div className="space-y-3">
      {recentLeads.map((lead) => (
        <div key={lead.id} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage alt={lead.name} />
              <AvatarFallback>{lead.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{lead.name}</div>
              <div className="text-sm text-gray-500">{lead.company}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={lead.status === "New" ? "default" : lead.status === "Contacted" ? "secondary" : "outline"}>
              {lead.status}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <PhoneCall className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">View All Leads</Button>
    </div>
  );
}
