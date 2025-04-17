import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  User2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Activity, LeadDetails, Note, Task } from "@/types/leads";
import { UpdateLeadForm, UpdateLeadValues } from "@/components/leads/LeadForm";

export default function LeadProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<LeadDetails | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchLead = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lead details");
      }
      const formattedLead: LeadDetails = {
        id: data.data.id,
        name: data.data.name,
        title: data.data.industry || "N/A",
        company: data.data.company || "N/A",
        email: data.data.email,
        phone: data.data.phone || "N/A",
        location: data.data.location || "N/A",
        status: data.data.status,
        source: data.data.source || "Unknown",
        score: data.data.score || 0,
        lastContact: data.data.updated_at
          ? `Updated ${new Date(data.data.updated_at).toLocaleDateString()}`
          : `Created ${new Date(data.data.created_at).toLocaleDateString()}`,
        assignedTo: {
          id: data.data.assigned_to_id || "",
          name: data.data.assigned_to?.username || "Unassigned",
          email: data.data.assigned_to?.email || "N/A",
        },
        tags: [data.data.industry || "N/A"],
        notes: data.data.notes || "",
        activities: [],
        tasks: [],
        budget: data.data.budget || undefined,
        expectedCloseDate: data.data.expected_close_date,
        company_size: data.data.company_size || undefined,
      };
      setLead(formattedLead);
      setNotes(
        formattedLead.notes
          ? [
              {
                id: 1,
                content: formattedLead.notes,
                createdBy: data.data.assigned_to?.username || "Unknown",
                createdAt: data.data.created_at,
              },
            ]
          : []
      );
      toast.success("Lead details loaded successfully");
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Failed to load lead details");
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsNoteSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: newNote.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add note");
      }
      const newNoteObj: Note = {
        id: data.data.id || notes.length + 1,
        content: newNote.trim(),
        createdBy: data.data.created_by || "Unknown",
        createdAt: data.data.created_at || new Date().toISOString(),
      };
      setNotes([newNoteObj, ...notes]);
      setNewNote("");
      toast.success("Note added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add note");
      console.error("Error adding note:", error);
    } finally {
      setIsNoteSubmitting(false);
    }
  };

  const handleEditSubmit = async (formData: UpdateLeadValues) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update lead");
      }
      const updatedLead: LeadDetails = {
        ...data.data,
        title: data.data.industry || "N/A",
        company: data.data.company || "N/A",
        phone: data.data.phone || "N/A",
        location: data.data.location || "N/A",
        source: data.data.source || "Unknown",
        score: data.data.score || 0,
        notes: data.data.notes || "",
        lastContact: data.data.updated_at
          ? `Updated ${new Date(data.data.updated_at).toLocaleDateString()}`
          : lead?.lastContact || "",
        assignedTo: {
          id: data.data.assigned_to_id || "",
          name: data.data.assigned_to?.username || "Unassigned",
          email: data.data.assigned_to?.email || "N/A",
        },
        tags: [data.data.industry || "N/A"],
        activities: lead?.activities || [],
        tasks: lead?.tasks || [],
        budget: data.data.budget || undefined,
        expectedCloseDate: data.data.expected_close_date,
        company_size: data.data.company_size || undefined,
      };
      setLead(updatedLead);
      setIsEditOpen(false);
      toast.success("Lead updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update lead");
      console.error("Error updating lead:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error || !lead)
    return (
      <div className="text-center py-10 text-red-500">
        {error || "Lead not found"}
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/leads")}>
          <ArrowLeft className="h-4 w-4" />
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
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${lead.email}`}
                        alt={lead.name}
                      />
                      <AvatarFallback>
                        {lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{lead.name}</CardTitle>
                      <CardDescription>
                        {lead.title} at {lead.company}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <UpdateLeadForm
                      onClose={() => setIsEditOpen(false)}
                      initialData={lead}
                      onSubmit={handleEditSubmit}
                      leadId={id!}
                      isOpen={isEditOpen}
                      setIsOpen={setIsEditOpen}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Lead Score</div>
                  <LeadScoreIndicator score={lead.score} />
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Status</div>
                  <Badge>{lead.status}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Lead Source</div>
                  <div className="text-sm">{lead.source}</div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="text-sm font-medium mb-2">Contact Info</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-brand-purple underline"
                      >
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-brand-purple underline"
                      >
                        {lead.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{lead.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="text-sm font-medium mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="text-sm font-medium mb-2">Assigned To</div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${lead.assignedTo.email}`}
                        alt={lead.assignedTo.name}
                      />
                      <AvatarFallback>
                        {lead.assignedTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">{lead.assignedTo.name}</div>
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
                    {lead.activities.length > 0 ? (
                      lead.activities.map((activity: Activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-4 p-3 border rounded-lg"
                        >
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
                              <span className="font-medium">
                                {activity.subject}
                              </span>
                              <Badge variant="outline">{activity.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {activity.content}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>
                                {new Date(activity.date).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(activity.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span>By: {activity.performed_by}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-dashed">
                        <MessageSquare className="h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="font-medium">No activities yet</h3>
                        <p className="text-sm text-gray-500">
                          Log an activity to get started.
                        </p>
                      </div>
                    )}
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
                    {notes.map((note: Note) => (
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
                    <h3 className="font-medium">Tasks ({lead.tasks.length})</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {lead.tasks.length > 0 ? (
                      lead.tasks.map((task: Task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{task.title}</div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(task.dueDate).toLocaleDateString()}{" "}
                                  at{" "}
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
                          <Badge
                            variant={
                              task.priority === "High" ? "destructive" : "outline"
                            }
                          >
                            {task.priority}
                          </Badge>
                          <Button size="sm">Complete</Button>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-dashed">
                        <Calendar className="h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="font-medium">No tasks yet</h3>
                        <p className="text-sm text-gray-500">
                          Add a task to get started.
                        </p>
                      </div>
                    )}
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
                  <div>{lead.company}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Industry</div>
                  <div>{lead.tags[0]}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Company Size</div>
                  <div>{lead.company_size || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Annual Revenue</div>
                  <div>{lead.budget ? `$${lead.budget}` : "N/A"}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Website</div>
                <a
                  href={`https://${lead.company
                    .toLowerCase()
                    .replace(/\s+/g, "")}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-purple underline"
                >
                  {`${lead.company.toLowerCase().replace(/\s+/g, "")}.com`}
                </a>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Address</div>
                <div>{lead.location}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}