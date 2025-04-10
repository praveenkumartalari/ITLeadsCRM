import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Lead } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

export default function LeadsPage() {
  const { isAdmin, isManager } = useAuth();
  const { toast } = useToast();
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  
  // Fetch leads
  const { data: leads, isLoading } = useQuery({
    queryKey: ["/api/leads"],
  });
  
  // Fetch status options
  const { data: statusOptions } = useQuery({
    queryKey: ["/api/options/lead-statuses"],
  });
  
  // Fetch source options
  const { data: sourceOptions } = useQuery({
    queryKey: ["/api/options/lead-sources"],
  });
  
  console.log("Status: ", statusOptions)
  console.log("Sources: ", sourceOptions)
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead deleted",
        description: "The lead has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete lead: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter leads based on search and filters
  const filteredLeads = leads
    ? leads.filter((lead: Lead) => {
        const matchesSearch =
          searchTerm === "" ||
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesStatus =
          statusFilter === "all" || lead.status === statusFilter;
          
        const matchesSource =
          sourceFilter === "all" || lead.source === sourceFilter;
          
        return matchesSearch && matchesStatus && matchesSource;
      })
    : [];
  
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800';
      case 'Proposal Sent':
        return 'bg-emerald-100 text-emerald-800';
      case 'Negotiation':
        return 'bg-purple-100 text-purple-800';
      case 'Won':
        return 'bg-green-100 text-green-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <Link href="/leads/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </Link>
      </div>
      
      {/* Filters and search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search leads..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="w-full sm:w-40">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions?.map((status: string) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-40">
                <Select
                  value={sourceFilter}
                  onValueChange={setSourceFilter}
                >
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {sourceOptions?.map((source: string) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Leads table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="w-full py-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-1">No leads found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first lead to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && sourceFilter === "all" && (
                <Link href="/leads/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lead
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead className="w-[200px]">Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead: Lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback className="bg-primary-100 text-primary-800">
                              {getInitials(lead.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-slate-500">{lead.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.company ? (
                          <div>
                            <div className="font-medium">{lead.company}</div>
                            <div className="text-sm text-slate-500">{lead.industry || "-"}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.source || "-"}</TableCell>
                      <TableCell>
                        {lead.createdAt 
                          ? new Date(lead.createdAt).toLocaleDateString() 
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/leads/${lead.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/leads/${lead.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            {(isAdmin || isManager) && (
                              <DropdownMenuItem 
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(lead.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
