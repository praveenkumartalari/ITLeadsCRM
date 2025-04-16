
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Edit2, 
  Copy, 
  BarChart, 
  PauseCircle,
  PlayCircle,
  Trash2,
  CalendarIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Mock data for campaigns
const campaigns = [
  {
    id: 1,
    name: "Summer Product Announcement",
    type: "Email",
    status: "Active",
    audience: "All Leads",
    leads: 1240,
    sent: 1180,
    opened: 485,
    replied: 72,
    lastUpdated: "2023-06-15",
    progress: 95,
  },
  {
    id: 2,
    name: "Enterprise Feature Demo",
    type: "Email",
    status: "Scheduled",
    audience: "Enterprise Leads",
    leads: 420,
    sent: 0,
    opened: 0,
    replied: 0,
    lastUpdated: "2023-06-10",
    progress: 0,
  },
  {
    id: 3,
    name: "Follow-up: Spring Conference",
    type: "Email",
    status: "Completed",
    audience: "Event Attendees",
    leads: 215,
    sent: 215,
    opened: 142,
    replied: 38,
    lastUpdated: "2023-05-28",
    progress: 100,
  },
  {
    id: 4,
    name: "Product Update Webinar",
    type: "Event",
    status: "Active",
    audience: "Qualified Leads",
    leads: 680,
    sent: 680,
    opened: 312,
    replied: 145,
    lastUpdated: "2023-06-12",
    progress: 100,
  },
  {
    id: 5,
    name: "Holiday Promotion",
    type: "Email",
    status: "Draft",
    audience: "All Customers",
    leads: 1850,
    sent: 0,
    opened: 0,
    replied: 0,
    lastUpdated: "2023-06-08",
    progress: 0,
  },
  {
    id: 6,
    name: "Customer Satisfaction Survey",
    type: "Email",
    status: "Paused",
    audience: "Current Customers",
    leads: 950,
    sent: 425,
    opened: 210,
    replied: 105,
    lastUpdated: "2023-06-05",
    progress: 45,
  },
  {
    id: 7,
    name: "New Feature Announcement",
    type: "Email",
    status: "Active",
    audience: "Beta Users",
    leads: 320,
    sent: 320,
    opened: 278,
    replied: 54,
    lastUpdated: "2023-06-14",
    progress: 100,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "success";
    case "Scheduled":
      return "secondary";
    case "Completed":
      return "default";
    case "Draft":
      return "outline";
    case "Paused":
      return "warning";
    default:
      return "default";
  }
};

const getCampaignTypeIcon = (type: string) => {
  switch (type) {
    case "Email":
      return Mail;
    case "Event":
      return CalendarIcon;
    default:
      return Mail;
  }
};

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <CampaignForm onClose={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="active" onClick={() => setStatusFilter("Active")}>
            Active
          </TabsTrigger>
          <TabsTrigger value="scheduled" onClick={() => setStatusFilter("Scheduled")}>
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setStatusFilter("Completed")}>
            Completed
          </TabsTrigger>
          <TabsTrigger value="draft" onClick={() => setStatusFilter("Draft")}>
            Draft
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{campaign.type}</span>
                          <span className="text-gray-400">•</span>
                          <span>Updated {campaign.lastUpdated}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(campaign.status) as any}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{campaign.audience}</div>
                        <div className="text-sm text-gray-500">
                          {campaign.leads} leads
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-40">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{campaign.progress}%</span>
                            <span>
                              {campaign.sent}/{campaign.leads}
                            </span>
                          </div>
                          <Progress value={campaign.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Open rate:</span>
                            <span>
                              {campaign.sent > 0
                                ? Math.round((campaign.opened / campaign.sent) * 100)
                                : 0}
                              %
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Reply rate:</span>
                            <span>
                              {campaign.sent > 0
                                ? Math.round((campaign.replied / campaign.sent) * 100)
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart className="mr-2 h-4 w-4" />
                              <span>View Report</span>
                            </DropdownMenuItem>
                            {campaign.status === "Active" ? (
                              <DropdownMenuItem>
                                <PauseCircle className="mr-2 h-4 w-4" />
                                <span>Pause</span>
                              </DropdownMenuItem>
                            ) : campaign.status === "Paused" ? (
                              <DropdownMenuItem>
                                <PlayCircle className="mr-2 h-4 w-4" />
                                <span>Resume</span>
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          {/* This will be auto-filtered by the tabsTrigger onClick */}
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-6">
          {/* This will be auto-filtered by the tabsTrigger onClick */}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {/* This will be auto-filtered by the tabsTrigger onClick */}
        </TabsContent>
        
        <TabsContent value="draft" className="mt-6">
          {/* This will be auto-filtered by the tabsTrigger onClick */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
