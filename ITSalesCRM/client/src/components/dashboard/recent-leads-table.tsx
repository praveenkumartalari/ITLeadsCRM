import { Link } from "wouter";
import {
  Card,
  CardHeader,
  CardTitle,
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
  Eye,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RecentLeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
}

export default function RecentLeadsTable({
  leads,
  isLoading = false
}: RecentLeadsTableProps) {
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
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="p-4 border-b border-slate-200 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Recent Leads
        </CardTitle>
        <Link href="/leads">
          <a className="text-sm text-primary hover:text-primary-700 font-medium">
            View all
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="w-full py-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="w-full py-10 text-center">
              <p className="text-slate-500">No leads to display</p>
              <Link href="/leads/new">
                <a className="mt-2 inline-block text-primary font-medium">
                  Add your first lead
                </a>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Assigned To
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-200">
                {leads.map(lead => (
                  <TableRow key={lead.id} className="hover:bg-slate-50">
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                          <AvatarFallback className="text-xs">
                            {getInitials(lead.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">
                            {lead.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {lead.company || "-"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {lead.industry || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge 
                        variant="outline"
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {lead.assignedToId ? `Rep #${lead.assignedToId}` : 'Unassigned'}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-sm">
                      <Link href={`/leads/${lead.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary hover:text-primary-800 mr-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
