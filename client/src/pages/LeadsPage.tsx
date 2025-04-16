
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Download,
  Filter,
  MoreHorizontal, 
  Plus, 
  Search,
  SlidersHorizontal,
  Mail,
  PhoneCall,
  Calendar,
  UserPlus,
  Edit,
  Trash2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadScoreIndicator } from "@/components/leads/LeadScoreIndicator"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeadForm } from "@/components/leads/LeadForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Mock data for the leads table
const leads = [
  {
    id: "1",
    name: "James Cooper",
    company: "Acme Inc",
    email: "james@acme.com",
    phone: "+1 (555) 123-4567",
    status: "New",
    source: "Website",
    lastContact: "Today",
    score: 85,
    tags: ["Enterprise", "Software"],
  },
  {
    id: "2",
    name: "Sarah Miller",
    company: "Tech Solutions",
    email: "sarah@techsolutions.com",
    phone: "+1 (555) 987-6543",
    status: "Contacted",
    source: "Referral",
    lastContact: "Yesterday",
    score: 72,
    tags: ["SMB", "Hardware"],
  },
  {
    id: "3",
    name: "Michael Johnson",
    company: "Global Systems",
    email: "michael@globalsystems.com",
    phone: "+1 (555) 456-7890",
    status: "Qualified",
    source: "LinkedIn",
    lastContact: "3 days ago",
    score: 91,
    tags: ["Enterprise", "Healthcare"],
  },
  {
    id: "4",
    name: "Emily Davis",
    company: "Innovative Designs",
    email: "emily@innovativedesigns.com",
    phone: "+1 (555) 789-0123",
    status: "Proposal",
    source: "Event",
    lastContact: "1 week ago",
    score: 68,
    tags: ["Startup", "Design"],
  },
  {
    id: "5",
    name: "Robert Wilson",
    company: "Wilson Manufacturing",
    email: "robert@wilsonmfg.com",
    phone: "+1 (555) 234-5678",
    status: "Negotiation",
    source: "Cold Call",
    lastContact: "2 days ago",
    score: 94,
    tags: ["Manufacturing", "Enterprise"],
  },
  {
    id: "6",
    name: "Jennifer Brown",
    company: "Brown Consulting",
    email: "jennifer@brownconsulting.com",
    phone: "+1 (555) 345-6789",
    status: "Closed Won",
    source: "Partner",
    lastContact: "5 days ago",
    score: 89,
    tags: ["Consulting", "SMB"],
  },
  {
    id: "7",
    name: "David Lee",
    company: "InnoTech",
    email: "david@innotech.com",
    phone: "+1 (555) 567-8901",
    status: "Closed Lost",
    source: "Webinar",
    lastContact: "2 weeks ago",
    score: 45,
    tags: ["Technology", "Startup"],
  },
  {
    id: "8",
    name: "Lisa Thompson",
    company: "Thompson Healthcare",
    email: "lisa@thompsonhealthcare.com",
    phone: "+1 (555) 678-9012",
    status: "New",
    source: "Email Campaign",
    lastContact: "Today",
    score: 77,
    tags: ["Healthcare", "Enterprise"],
  },
  {
    id: "9",
    name: "Thomas Anderson",
    company: "Matrix Systems",
    email: "thomas@matrixsystems.com",
    phone: "+1 (555) 890-1234",
    status: "Contacted",
    source: "Trade Show",
    lastContact: "4 days ago",
    score: 83,
    tags: ["Technology", "SMB"],
  },
  {
    id: "10",
    name: "Patricia Martinez",
    company: "Creative Solutions",
    email: "patricia@creativesolutions.com",
    phone: "+1 (555) 901-2345",
    status: "Qualified",
    source: "Website",
    lastContact: "Yesterday",
    score: 79,
    tags: ["Creative", "Agency"],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "default";
    case "Contacted":
      return "secondary";
    case "Qualified":
      return "blue";
    case "Proposal":
      return "purple";
    case "Negotiation":
      return "orange";
    case "Closed Won":
      return "green";
    case "Closed Lost":
      return "destructive";
    default:
      return "outline";
  }
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  // Filter leads based on search term and status
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleLeadClick = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <LeadForm onClose={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search leads..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Closed Won">Closed Won</SelectItem>
              <SelectItem value="Closed Lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Lead</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow 
                key={lead.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleLeadClick(lead.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${lead.email}`} alt={lead.name} />
                      <AvatarFallback>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(lead.status) as any}>{lead.status}</Badge>
                </TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>
                  <LeadScoreIndicator score={lead.score} />
                </TableCell>
                <TableCell>{lead.lastContact}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PhoneCall className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>Assign</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
