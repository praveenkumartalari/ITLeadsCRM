
import { useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeadScoreIndicator } from "@/components/leads/LeadScoreIndicator";
import { 
  ArrowLeft, 
  Calendar, 
  Edit2, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Plus, 
  Send, 
  Tag, 
  User2
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

// Mock lead data
const leadData = {
  id: "1",
  name: "James Cooper",
  title: "Marketing Director",
  company: "Acme Inc",
  email: "james@acme.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  status: "Qualified",
  source: "Website",
  score: 85,
  lastContact: "2023-06-10",
  assignedTo: {
    name: "John Doe",
    email: "john@example.com",
  },
  tags: ["Enterprise", "Software", "High Budget"],
  notes: [
    {
      id: 1,
      content: "James showed interest in our enterprise plan during the intro call.",
      createdBy: "John Doe",
      createdAt: "2023-06-01T14:30:00",
    },
    {
      id: 2,
      content: "Sent follow-up email with pricing details for 100+ seats.",
      createdBy: "Sarah Miller",
      createdAt: "2023-06-03T10:15:00",
    },
    {
      id: 3,
      content: "James requested a demo call with the product team.",
      createdBy: "John Doe",
      createdAt: "2023-06-05T16:45:00",
    },
  ],
  activities: [
    {
      id: 1,
      type: "Email",
      subject: "Introduction to our Enterprise Plan",
      content: "Sent initial outreach email explaining our enterprise features and pricing model.",
      date: "2023-06-01T09:20:00",
      performed_by: "John Doe",
    },
    {
      id: 2,
      type: "Call",
      subject: "Initial Discovery Call",
      content: "30-minute call discussing their team size, current solutions, and pain points.",
      date: "2023-06-02T14:00:00",
      performed_by: "John Doe",
    },
    {
      id: 3,
      type: "Email",
      subject: "Follow-up with Pricing Details",
      content: "Sent detailed pricing breakdown for 100+ user seats as requested.",
      date: "2023-06-03T10:15:00",
      performed_by: "Sarah Miller",
    },
    {
      id: 4,
      type: "Meeting",
      subject: "Product Demo with Technical Team",
      content: "Demonstrated our API capabilities and integration options.",
      date: "2023-06-08T15:30:00",
      performed_by: "John Doe",
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Send Contract Draft",
      dueDate: "2023-06-18T10:00:00",
      status: "upcoming",
      priority: "High",
      assignedTo: "John Doe",
    },
    {
      id: 2,
      title: "Schedule Technical Follow-up Call",
      dueDate: "2023-06-20T15:00:00",
      status: "upcoming",
      priority: "Medium",
      assignedTo: "Sarah Miller",
    },
  ],
};

export default function LeadProfilePage() {
  const { id } = useParams();
  const [newNote, setNewNote] = useState("");
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);
  const [notes, setNotes] = useState(leadData.notes);

  // Function to handle new note submission
  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    setIsNoteSubmitting(true);
    
    // Simulate API call to add a note
    setTimeout(() => {
      const newNoteObj = {
        id: notes.length + 1,
        content: newNote.trim(),
        createdBy: "John Doe",
        createdAt: new Date().toISOString(),
      };
      
      setNotes([newNoteObj, ...notes]);
      setNewNote("");
      setIsNoteSubmitting(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/leads">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Lead Profile</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://avatar.vercel.sh/${leadData.email}`} alt={leadData.name} />
                      <AvatarFallback>
                        {leadData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{leadData.name}</CardTitle>
                      <CardDescription>{leadData.title} at {leadData.company}</CardDescription>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Lead Score</div>
                  <LeadScoreIndicator score={leadData.score} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Status</div>
                  <Badge>{leadData.status}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Lead Source</div>
                  <div className="text-sm">{leadData.source}</div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="text-sm font-medium mb-2">Contact Info</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href={`mailto:${leadData.email}`} className="text-brand-purple underline">
                        {leadData.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <a href={`tel:${leadData.phone}`} className="text-brand-purple underline">
                        {leadData.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{leadData.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="text-sm font-medium mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {leadData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="text-sm font-medium mb-2">Assigned To</div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={`https://avatar.vercel.sh/${leadData.assignedTo.email}`} 
                        alt={leadData.assignedTo.name} 
                      />
                      <AvatarFallback>
                        {leadData.assignedTo.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">{leadData.assignedTo.name}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button className="flex-1" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-2 space-y-6">
          <Card>
            <Tabs defaultValue="activity" className="w-full">
              <CardHeader className="pb-0">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="emails">Emails</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="activity" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Recent Activities</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Activity
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {leadData.activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4 p-3 border rounded-lg">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-purple-light text-brand-purple shrink-0">
                          {activity.type === "Email" ? (
                            <Mail className="h-5 w-5" />
                          ) : activity.type === "Call" ? (
                            <Phone className="h-5 w-5" />
                          ) : activity.type === "Meeting" ? (
                            <Calendar className="h-5 w-5" />
                          ) : (
                            <MessageSquare className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{activity.subject}</span>
                            <Badge variant="outline">{activity.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{activity.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>
                              {new Date(activity.date).toLocaleDateString()} at{" "}
                              {new Date(activity.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span>By: {activity.performed_by}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <form onSubmit={handleNoteSubmit} className="space-y-4">
                    <Textarea
                      placeholder="Add a note about this lead..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isNoteSubmitting}>
                        {isNoteSubmitting ? "Saving..." : "Add Note"}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="space-y-4 mt-6">
                    {notes.map((note) => (
                      <div key={note.id} className="p-3 border rounded-lg">
                        <p className="text-sm">{note.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>By: {note.createdBy}</span>
                          <span>
                            {new Date(note.createdAt).toLocaleDateString()} at{" "}
                            {new Date(note.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="tasks" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Tasks ({leadData.tasks.length})</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {leadData.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{task.title}</div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(task.dueDate).toLocaleDateString()} at{" "}
                                {new Date(task.dueDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User2 className="h-3 w-3" />
                              <span>{task.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={task.priority === "High" ? "destructive" : "outline"}>
                          {task.priority}
                        </Badge>
                        <Button size="sm">Complete</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="emails" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Email Communication</h3>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-dashed">
                    <Mail className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium">No emails yet</h3>
                    <p className="text-sm text-gray-500">
                      Start the conversation by sending an email to this lead.
                    </p>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Company Name</div>
                  <div>{leadData.company}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Industry</div>
                  <div>Software & Technology</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Company Size</div>
                  <div>100-250 employees</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Annual Revenue</div>
                  <div>$10M - $50M</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Website</div>
                <a href={`https://${leadData.company.toLowerCase().replace(/\s+/g, '')}.com`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-brand-purple underline">
                  {`${leadData.company.toLowerCase().replace(/\s+/g, '')}.com`}
                </a>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Address</div>
                <div>123 Tech Way, Suite 500</div>
                <div>New York, NY 10001</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
