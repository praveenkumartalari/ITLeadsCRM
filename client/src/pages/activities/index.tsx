import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Activity } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { format, isPast, isToday, isTomorrow } from "date-fns";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  CalendarCheck2,
} from "lucide-react";

export default function ActivitiesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch activities
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Activity deleted",
        description: "The activity has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Complete activity mutation
  const completeMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      await apiRequest("PUT", `/api/activities/${id}`, { 
        completed,
        completedAt: completed ? new Date().toISOString() : null 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Activity updated",
        description: "The activity status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Filter activities based on search and filters
  const filteredActivities = activities
    ? activities.filter((activity: Activity) => {
        const matchesSearch =
          searchTerm === "" ||
          activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (activity.notes && activity.notes.toLowerCase().includes(searchTerm.toLowerCase()));
          
        const matchesType =
          typeFilter === "all" || activity.type === typeFilter;
          
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "completed" && activity.completed) ||
          (statusFilter === "pending" && !activity.completed);
          
        return matchesSearch && matchesType && matchesStatus;
      })
    : [];
  
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleToggleComplete = (id: number, currentState: boolean) => {
    completeMutation.mutate({ id, completed: !currentState });
  };
  
  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call':
        return 'bg-primary-100 text-primary-800';
      case 'email':
        return 'bg-indigo-100 text-indigo-800';
      case 'meeting':
        return 'bg-amber-100 text-amber-800';
      case 'demo':
        return 'bg-orange-100 text-orange-800';
      case 'task':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };
  
  const formatDateDisplay = (date: string) => {
    const activityDate = new Date(date);
    
    if (isToday(activityDate)) {
      return `Today, ${format(activityDate, 'h:mm a')}`;
    } else if (isTomorrow(activityDate)) {
      return `Tomorrow, ${format(activityDate, 'h:mm a')}`;
    } else {
      return format(activityDate, 'MMM d, yyyy h:mm a');
    }
  };
  
  const isOverdue = (activity: Activity) => {
    return !activity.completed && isPast(new Date(activity.scheduledAt));
  };
  
  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Activities</h1>
        <Link href="/activities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
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
                placeholder="Search activities..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="w-full sm:w-40">
                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Demo">Demo</SelectItem>
                    <SelectItem value="Task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Activities table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="w-full py-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <CalendarCheck2 className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-lg font-medium text-slate-900">No activities found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Schedule your first activity to get started"}
              </p>
              {!searchTerm && typeFilter === "all" && statusFilter === "all" && (
                <Link href="/activities/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Related To</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity: Activity) => (
                    <TableRow key={activity.id} className={activity.completed ? "bg-slate-50/50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={activity.completed}
                          onCheckedChange={() => handleToggleComplete(activity.id, activity.completed)}
                        />
                      </TableCell>
                      <TableCell className={activity.completed ? "text-slate-500 line-through" : ""}>
                        <div className="font-medium">{activity.title}</div>
                        {activity.notes && (
                          <div className="text-sm text-slate-500 truncate max-w-[300px]">
                            {activity.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityTypeColor(activity.type)}`}
                        >
                          {activity.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-100">
                          {activity.relatedTo} #{activity.relatedId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={isOverdue(activity) ? "text-red-600 font-medium" : ""}>
                          {formatDateDisplay(activity.scheduledAt)}
                        </span>
                        {isOverdue(activity) && (
                          <Badge variant="outline" className="ml-2 bg-red-100 text-red-800">
                            Overdue
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {activity.assignedToId === user?.id 
                          ? <span className="font-medium">Me</span> 
                          : activity.assignedToId 
                            ? `User #${activity.assignedToId}` 
                            : 'Unassigned'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/activities/${activity.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/activities/${activity.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => handleDelete(activity.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
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
