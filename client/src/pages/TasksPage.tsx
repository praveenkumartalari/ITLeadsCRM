import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/types/task";

const taskStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REOPENED'];
const priorityColors = { HIGH: "text-red-500 bg-red-50", MEDIUM: "text-yellow-500 bg-yellow-50", LOW: "text-green-500 bg-green-50" };
const taskTypeIcons = { CALL: Calendar, EMAIL: Search, MEETING: Clock, TASK: Check };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, leadsResponse, userResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:5000/api/tasks", { credentials: "include" }),
          fetch("http://localhost:5000/api/leads", { credentials: "include" }),
          fetch("http://localhost:5000/api/auth/me", { credentials: "include" }),
          fetch("http://localhost:5000/api/users", { credentials: "include" }),
        ]);
        const [tasksData, leadsData, userData, usersData] = await Promise.all([
          tasksResponse.json(),
          leadsResponse.json(),
          userResponse.json(),
          usersResponse.json(),
        ]);
        if (!tasksResponse.ok) throw new Error(tasksData.message || "Failed to fetch tasks");
        if (!leadsResponse.ok) throw new Error(leadsData.message || "Failed to fetch leads");
        if (!userResponse.ok) throw new Error(userData.message || "Failed to fetch current user");
        if (!usersResponse.ok) throw new Error(usersData.message || "Failed to fetch users");

        setTasks(tasksData.data || []);
        setLeads(leadsData.data || []);
        setCurrentUser(userData.data.user);
        setUsers(usersData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const taskData: Partial<Task> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      due_date: `${formData.get("dueDate")}:00Z`, // Ensure full ISO 8601 format
      priority: (formData.get("priority") as "HIGH" | "MEDIUM" | "LOW") || "LOW",
      type: (formData.get("type") as "CALL" | "EMAIL" | "MEETING" | "TASK") || "TASK",
      status: "PENDING",
      lead_id: formData.get("leadId") as string,
      assigned_to_id: formData.get("assignedToId") as string,
      created_by_id: currentUser?.id || "9429ea2a-6b7d-4df5-a6a8-1813a3716d02",
    };

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create task");
      setTasks((prevTasks) => [...prevTasks, data.data]);
      setIsDialogOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleTaskCompletion = (taskId: string) => {
    setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));
  };

  const filterTasks = (tasks: Task[], tab: string, query: string) => {
    return tasks
      .filter((task) => {
        if (tab === "all") return true;
        if (taskStatuses.includes(tab.toUpperCase())) return task.status === tab.toUpperCase();
        if (tab === "overdue") {
          const dueDate = new Date(task.due_date);
          const today = new Date();
          return dueDate < today && task.status !== "COMPLETED" && !completedTasks.includes(task.id);
        }
        return true;
      })
      .filter((task) => {
        if (!query) return true;
        const searchFields = [task.title, task.description, task.assigned_to_name || "", task.created_by_name || ""].join(" ").toLowerCase();
        return searchFields.includes(query.toLowerCase());
      });
  };

  const isCompleted = (task: Task) => task.status === "COMPLETED" || completedTasks.includes(task.id);

  const filteredTasks = filterTasks(tasks, currentTab, searchQuery);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <Input name="title" placeholder="Task title" required />
              <Input name="description" placeholder="Description" required />
              <Input name="dueDate" type="datetime-local" required />
              <select name="priority" required>
                <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
              </select>
              <select name="type" required>
                <option value="CALL">Call</option><option value="EMAIL">Email</option><option value="MEETING">Meeting</option><option value="TASK">Task</option>
              </select>
              <Select name="leadId" required>
                <SelectTrigger><SelectValue placeholder="Select a lead" /></SelectTrigger>
                <SelectContent>{leads.map((lead) => <SelectItem key={lead.id} value={lead.id}>{lead.name} ({lead.company})</SelectItem>)}</SelectContent>
              </Select>
              <Select name="assignedToId" required>
                <SelectTrigger><SelectValue placeholder="Select an assignee" /></SelectTrigger>
                <SelectContent>{users.map((user) => <SelectItem key={user.id} value={user.id}>{user.username} ({user.email})</SelectItem>)}</SelectContent>
              </Select>
              <Button type="submit" className="w-full">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search tasks..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        
        <div className="flex items-center">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {taskStatuses.map((status) => <TabsTrigger key={status} value={status.toLowerCase()}>{status}</TabsTrigger>)}
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Tasks ({filteredTasks.length})</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 gap-1"><FilterX className="h-4 w-4" />Clear Filters</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3"><Check className="h-6 w-6 text-gray-400" /></div>
                  <h3 className="font-medium text-gray-900">No tasks found</h3>
                  <p className="text-sm text-gray-500 mt-1">{searchQuery ? "Try adjusting your search terms" : "Time to create a new task"}</p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const Icon = taskTypeIcons[task.type] || Check;
                  return (
                    <div key={task.id} className={`p-4 hover:bg-gray-50 transition-colors ${isCompleted(task) ? "bg-gray-50 opacity-70" : ""}`}>
                      <div className="flex items-center gap-3">
                        <Checkbox checked={isCompleted(task)} onCheckedChange={() => handleToggleTaskCompletion(task.id)} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isCompleted(task) ? "line-through text-gray-500" : ""}`}>{task.title}</span>
                            <Badge className={`${priorityColors[task.priority]} hover:${priorityColors[task.priority]}`} variant="outline">{task.priority}</Badge>
                            <Badge variant="outline">{task.type}</Badge>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500"><Clock className="h-3 w-3" /><span>{new Date(task.due_date).toLocaleDateString()} at {new Date(task.due_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
                            <div className="flex items-center gap-1 text-xs text-gray-500"><span>For:</span><span className="font-medium">{task.assigned_to_name || "Unassigned"}</span></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8"><AvatarFallback>{task.assigned_to_name?.[0] || "U"}</AvatarFallback></Avatar>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4" />Reassign</DropdownMenuItem>
                              <DropdownMenuItem><Calendar className="mr-2 h-4 w-4" />Reschedule</DropdownMenuItem>
                              <DropdownMenuItem><X className="mr-2 h-4 w-4" />Cancel</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}