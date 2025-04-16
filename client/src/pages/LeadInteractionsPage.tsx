
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ArrowLeft, Plus, Calendar, Clock, PhoneCall, Video, Mail, MessageSquare, UserPlus, CircleArrowUp, CircleArrowDown, Milestone, History } from "lucide-react";
import { LeadInteraction } from "@/components/leads/LeadInteraction";
import { useLeadInteractions } from "@/hooks/useLeadInteractions";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Lead } from "@/types/leads";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeadScoreIndicator } from "@/components/leads/LeadScoreIndicator";

const getInteractionIcon = (type: string) => {
  switch (type) {
    case "Call":
      return <PhoneCall className="h-5 w-5" />;
    case "Meeting":
      return <Calendar className="h-5 w-5" />;
    case "In Person":
      return <UserPlus className="h-5 w-5" />;
    default:
      return <MessageSquare className="h-5 w-5" />;
  }
};

const getInteractionColor = (type: string) => {
  switch (type) {
    case "Call":
      return "bg-blue-100 text-blue-600";
    case "Video":
      return "bg-purple-100 text-purple-600";
    case "Email":
      return "bg-green-100 text-green-600";
    case "Meeting":
      return "bg-orange-100 text-orange-600";
    case "In Person":
      return "bg-pink-100 text-pink-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getJourneyEventIcon = (type: string) => {
  switch (type) {
    case "Status Change":
      return <Milestone className="h-5 w-5" />;
    case "Score Change":
      return <CircleArrowUp className="h-5 w-5" />;
    case "Assignment":
      return <UserPlus className="h-5 w-5" />;
    default:
      return <History className="h-5 w-5" />;
  }
};

const getJourneyEventColor = (type: string) => {
  switch (type) {
    case "Status Change":
      return "bg-blue-100 text-blue-600";
    case "Score Change":
      return "bg-green-100 text-green-600";
    case "Assignment":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export default function LeadInteractionsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const { interactions, isLoading, journeyEvents } = useLeadInteractions(id);
  
  const { data: lead } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Lead;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/leads">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Lead Details & Interactions</h1>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {lead?.email ? (
                    <AvatarImage src={`https://avatar.vercel.sh/${lead?.email}`} alt={lead?.name} />
                  ) : null}
                  <AvatarFallback>
                    {lead?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{lead?.name}</CardTitle>
                  <CardDescription>{lead?.title} at {lead?.company}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Status</div>
                  <Badge>{lead?.status}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Score</div>
                  <LeadScoreIndicator score={lead?.score} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Source</div>
                  <div className="text-sm">{lead?.source}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Assigned To</div>
                  <div className="text-sm">{lead?.assigned_to}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Estimated Value</div>
                  <div className="text-sm">{lead?.currency} {lead?.estimated_cost}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Added on</div>
                  <div className="text-sm">{lead?.created_at ? format(new Date(lead.created_at), 'MMM dd, yyyy') : '-'}</div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">
                  <PhoneCall className="h-4 w-4 mr-2" />
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
        
        <div className="col-span-2">
          <Tabs defaultValue="interactions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="interactions">Interactions</TabsTrigger>
                    <TabsTrigger value="journey">Journey Analytics</TabsTrigger>
                  </TabsList>
                  <Dialog open={isInteractionDialogOpen} onOpenChange={setIsInteractionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Interaction
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <LeadInteraction 
                        leadId={id} 
                        onClose={() => setIsInteractionDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="interactions">
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center text-gray-500">Loading interactions...</div>
                      </div>
                    ) : interactions?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">No interactions yet</h3>
                        <p className="text-sm text-gray-500 max-w-sm mt-1">
                          Record your first interaction with this lead to keep track of your conversation history.
                        </p>
                        <Button className="mt-4" onClick={() => setIsInteractionDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Interaction
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-200" />
                        
                        {interactions?.map((interaction) => (
                          <div key={interaction.id} className="relative mb-8 pl-12">
                            {/* Timeline dot */}
                            <div className={`absolute left-0 top-0 rounded-full p-2 ${getInteractionColor(interaction.type)}`}>
                              {getInteractionIcon(interaction.type)}
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 border">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium text-lg">{interaction.title}</h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(interaction.date)}
                                    </span>
                                    <Badge variant="outline">{interaction.type}</Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-700 mb-4">{interaction.description}</p>
                              
                              {interaction.next_meeting_date && (
                                <div className="flex items-center gap-2 text-sm bg-secondary p-2 rounded">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span>Next meeting: {formatDate(interaction.next_meeting_date)}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 mt-4 pt-3 border-t text-xs text-gray-500">
                                <span>Recorded by {interaction.created_by || 'Sales Team'}</span>
                                <span>•</span>
                                <span>{formatDate(interaction.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="journey">
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-200" />
                      
                      {journeyEvents?.map((event) => (
                        <div key={event.id} className="relative mb-8 pl-12">
                          {/* Timeline dot */}
                          <div className={`absolute left-0 top-0 rounded-full p-2 ${getJourneyEventColor(event.event_type)}`}>
                            {getJourneyEventIcon(event.event_type)}
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-lg">{event.event_type}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(event.changed_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              {event.previous_value && (
                                <div className="bg-gray-100 p-3 rounded-md">
                                  <div className="text-xs text-gray-500 mb-1">Previous</div>
                                  <div className="font-medium">{event.previous_value}</div>
                                </div>
                              )}
                              <div className="bg-blue-50 p-3 rounded-md">
                                <div className="text-xs text-gray-500 mb-1">New</div>
                                <div className="font-medium">{event.new_value}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t text-xs text-gray-500">
                              <span>Changed by {event.changed_by}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
