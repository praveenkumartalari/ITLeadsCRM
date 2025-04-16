
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Check,
  Clock,
  FilterX,
  MoreVertical,
  Plus,
  Search,
  UserPlus,
  X,
} from "lucide-react";

// Mock tasks data
const tasks = [
  {
    id: "1",
    title: "Call with Sarah from Acme Corp",
    description: "Follow up on their interest in the enterprise plan",
    dueDate: "2023-06-15T14:00:00",
    priority: "High",
    status: "upcoming",
    type: "Call",
    assignedTo: {
      name: "John Doe",
      email: "john@example.com",
    },
    related: {
      type: "Lead",
      name: "Sarah Miller",
      company: "Acme Corp",
    },
  },
  {
    id: "2",
    title: "Send pricing proposal to TechGiant",
    description: "Include all the custom features we discussed",
    dueDate: "2023-06-14T17:00:00",
    priority: "Medium",
    status: "overdue",
    type: "Email",
    assignedTo: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    related: {
      type: "Lead",
      name: "Michael Johnson",
      company: "TechGiant",
    },
  },
  {
    id: "3",
    title: "Follow up with Global Systems",
    description: "Check if they received our demo video",
    dueDate: "2023-06-16T11:00:00",
    priority: "Low",
    status: "upcoming",
    type: "Email",
    assignedTo: {
      name: "John Doe",
      email: "john@example.com",
    },
    related: {
      type: "Lead",
      name: "Emily Davis",
      company: "Global Systems",
    },
  },
  {
    id: "4",
    title: "Product demo with Innovate Inc",
    description: "Show new features in version 2.0",
    dueDate: "2023-06-12T15:30:00",
    priority: "High",
    status: "overdue",
    type: "Meeting",
    assignedTo: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    related: {
      type: "Lead",
      name: "Robert Wilson",
      company: "Innovate Inc",
    },
  },
  {
    id: "5",
    title: "Review contract from Wilson Manufacturing",
    description: "Check terms and pricing structure",
    dueDate: "2023-06-15T10:00:00",
    priority: "Medium",
    status: "upcoming",
    type: "Task",
    assignedTo: {
      name: "John Doe",
      email: "john@example.com",
    },
    related: {
      type: "Lead",
      name: "Jennifer Brown",
      company: "Wilson Manufacturing",
    },
  },
  {
    id: "6",
    title: "Update CRM with new lead notes",
    description: "Add information from recent calls",
    dueDate: "2023-06-13T09:00:00",
    priority: "Low",
    status: "completed",
    type: "Task",
    assignedTo: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    related: {
      type: "Lead",
      name: "David Lee",
      company: "InnoTech",
    },
  },
  {
    id: "7",
    title: "Send thank you email to Thomson Healthcare",
    description: "Thank them for meeting with us",
    dueDate: "2023-06-11T16:00:00",
    priority: "Medium",
    status: "completed",
    type: "Email",
    assignedTo: {
      name: "John Doe",
      email: "john@example.com",
    },
    related: {
      type: "Lead",
      name: "Lisa Thompson",
      company: "Thomson Healthcare",
    },
  },
];

const priorityColors: Record<string, string> = {
  High: "text-red-500 bg-red-50",
  Medium: "text-yellow-500 bg-yellow-50",
  Low: "text-green-500 bg-green-50",
};

const taskTypeIcons: Record<string, any> = {
  Call: Calendar,
  Email: Search,
  Meeting: Clock,
  Task: Check,
};

export default function TasksPage() {
  const [currentTab, setCurrentTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleToggleTaskCompletion = (taskId: string) => {
    setCompletedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const filterTasks = (tasks: any[], tab: string, query: string) => {
    return tasks
      .filter((task) => {
        // Filter by tab
        if (tab === "all") return true;
        if (tab === "completed") return task.status === "completed" || completedTasks.includes(task.id);
        if (tab === "overdue") return task.status === "overdue" && !completedTasks.includes(task.id);
        if (tab === "upcoming") return task.status === "upcoming" && !completedTasks.includes(task.id);
        return true;
      })
      .filter((task) => {
        // Filter by search query
        if (!query) return true;
        const searchFields = [
          task.title,
          task.description,
          task.related.name,
          task.related.company,
        ].join(" ").toLowerCase();
        return searchFields.includes(query.toLowerCase());
      });
  };

  const isCompleted = (task: any) => {
    return task.status === "completed" || completedTasks.includes(task.id);
  };

  const filteredTasks = filterTasks(tasks, currentTab, searchQuery);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                All
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Overdue
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Tasks ({filteredTasks.length})</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <FilterX className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Check className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900">No tasks found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchQuery ? "Try adjusting your search terms" : "Time to create a new task"}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      isCompleted(task) ? "bg-gray-50 opacity-70" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isCompleted(task)}
                        onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              isCompleted(task) ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {task.title}
                          </span>
                          <Badge
                            className={`${priorityColors[task.priority]} hover:${priorityColors[task.priority]}`}
                            variant="outline"
                          >
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">
                            {task.type}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-500 mt-1">
                          {task.description}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString()} at {new Date(task.dueDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>For:</span>
                            <span className="font-medium">
                              {task.related.name} ({task.related.company})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${task.assignedTo.email}`}
                            alt={task.assignedTo.name}
                          />
                          <AvatarFallback>
                            {task.assignedTo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>Reassign</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>Reschedule</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <X className="mr-2 h-4 w-4" />
                              <span>Cancel</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
