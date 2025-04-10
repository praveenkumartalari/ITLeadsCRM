import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Save, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";

// Define the activity form schema
const activityFormSchema = z.object({
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  scheduledAt: z.date({
    required_error: "Scheduled date and time is required",
  }),
  completed: z.boolean().default(false),
  relatedTo: z.string().min(1, "Related entity is required"),
  relatedId: z.number({
    required_error: "Related ID is required",
  }),
  assignedToId: z.number().optional().nullable(),
});

// Define the props for the form
interface ActivityFormProps {
  id?: number;
}

export default function ActivityForm({ id }: ActivityFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = !!id;
  const [relatedEntity, setRelatedEntity] = useState<string>("Lead");

  // Fetch activity data if editing
  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: [`/api/activities/${id}`, id],
    enabled: !!id,
  });

  // Fetch leads
  const { data: leads } = useQuery({
    queryKey: ["/api/leads"],
  });

  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Fetch users
  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  // Form definition
  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: "",
      title: "",
      notes: "",
      scheduledAt: new Date(),
      completed: false,
      relatedTo: "Lead",
      relatedId: 0,
      assignedToId: user?.id || null,
    },
  });

  // Load activity data into form when available
  useEffect(() => {
    if (activity) {
      form.reset({
        type: activity.type,
        title: activity.title,
        notes: activity.notes || "",
        scheduledAt: new Date(activity.scheduledAt),
        completed: activity.completed,
        relatedTo: activity.relatedTo,
        relatedId: activity.relatedId,
        assignedToId: activity.assignedToId,
      });
      setRelatedEntity(activity.relatedTo);
    }
  }, [activity, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof activityFormSchema>) => {
      // Add created by info
      const activityData = {
        ...data,
        createdById: user?.id,
      };
      const response = await apiRequest("POST", "/api/activities", activityData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Activity created",
        description: "The activity has been successfully created.",
      });
      navigate("/activities");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof activityFormSchema>) => {
      const response = await apiRequest("PUT", `/api/activities/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/activities/${id}`, id] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Activity updated",
        description: "The activity has been successfully updated.",
      });
      navigate("/activities");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof activityFormSchema>) => {
    if (isEditMode) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  // Handle related entity change
  const handleRelatedEntityChange = (value: string) => {
    setRelatedEntity(value);
    form.setValue("relatedTo", value);
    form.setValue("relatedId", 0); // Reset the related ID when changing entity type
  };

  // Loading state
  if (isEditMode && isLoadingActivity) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/activities")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? "Edit Activity" : "Add New Activity"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Call">Call</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Meeting">Meeting</SelectItem>
                          <SelectItem value="Demo">Demo</SelectItem>
                          <SelectItem value="Task">Task</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Follow-up call" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Scheduled Date and Time*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={
                                "w-full pl-3 text-left font-normal flex justify-between"
                              }
                            >
                              {field.value ? (
                                format(field.value, "PPP p")
                              ) : (
                                <span>Pick a date and time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                // Preserve the time part when changing date
                                const currentTime = field.value;
                                date.setHours(
                                  currentTime.getHours(),
                                  currentTime.getMinutes()
                                );
                                field.onChange(date);
                              }
                            }}
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <Input
                              type="time"
                              onChange={(e) => {
                                const [hours, minutes] = e.target.value
                                  .split(":")
                                  .map(Number);
                                const newDate = new Date(field.value);
                                newDate.setHours(hours);
                                newDate.setMinutes(minutes);
                                field.onChange(newDate);
                              }}
                              value={format(field.value, "HH:mm")}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="relatedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related To*</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            handleRelatedEntityChange(value);
                          }}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select entity type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Lead">Lead</SelectItem>
                            <SelectItem value="Client">Client</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="relatedId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {relatedEntity === "Lead" ? "Lead" : "Client"}*
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value?.toString() || ""}
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`Select a ${relatedEntity.toLowerCase()}`}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {relatedEntity === "Lead"
                              ? leads?.map((lead: any) => (
                                  <SelectItem
                                    key={lead.id}
                                    value={lead.id.toString()}
                                  >
                                    {lead.name} -{" "}
                                    {lead.company || "Unknown company"}
                                  </SelectItem>
                                ))
                              : clients?.map((client: any) => (
                                  <SelectItem
                                    key={client.id}
                                    value={client.id.toString()}
                                  >
                                    {client.companyName}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="assignedToId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value ? parseInt(value) : null)
                        }
                        defaultValue={
                          field.value ? field.value.toString() : ""
                        }
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Assign to..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          {users?.map((user: any) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mark as completed</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional information about this activity..."
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/activities")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? "Update Activity" : "Save Activity"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
