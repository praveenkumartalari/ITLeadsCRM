import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadInteraction, LeadJourneyEvent } from "@/types/leads";
import { toast } from "sonner";

export function useLeadInteractions(leadId: string) {
  const queryClient = useQueryClient();

  const { data: interactions, isLoading } = useQuery({
    queryKey: ['leadInteractions', leadId],
    queryFn: async () => {
      // Mock data for lead interactions
      return [
        {
          id: 'int1',
          lead_id: leadId,
          type: 'Call',
          title: 'Initial Discovery Call',
          description: 'Discussed client needs and project scope.',
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
          next_meeting_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          created_by: 'John Doe (Sales Person)',
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: null,
        },
        {
          id: 'int2',
          lead_id: leadId,
          type: 'Email',
          title: 'Follow-up Email',
          description: 'Sent project proposal and pricing details.',
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
          next_meeting_date: null,
          created_by: 'Jane Smith (Sales Team Lead)',
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: null,
        },
        {
          id: 'int3',
          lead_id: leadId,
          type: 'Meeting',
          title: 'In-Person Meeting',
          description: 'Met with client to review proposal and discuss next steps.',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          next_meeting_date: null,
          created_by: 'Michael Johnson (Sales Manager)',
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: null,
        },
      ] as LeadInteraction[];
    },
  });

  const addInteraction = useMutation({
    mutationFn: async (newInteraction: Omit<LeadInteraction, 'id' | 'created_at' | 'updated_at'>) => {
      // Simulate adding an interaction to the static data
      const newInteractionData: LeadInteraction = {
        id: `int${Date.now()}`, // Generate a unique ID
        created_at: new Date().toISOString(),
        updated_at: null,
        ...newInteraction,
      };
      return newInteractionData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadInteractions', leadId] });
      toast.success('Interaction added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add interaction');
      console.error('Error adding interaction:', error);
    },
  });

  const { data: journeyEvents } = useQuery({
    queryKey: ['leadJourney', leadId],
    queryFn: async () => {
      // Static mock data for journey events
      return [
        {
          id: '1',
          lead_id: leadId,
          event_type: 'Status Change',
          previous_value: 'New',
          new_value: 'Contacted',
          changed_by: 'John Doe (Sales Person)',
          changed_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        },
        {
          id: '2',
          lead_id: leadId,
          event_type: 'Score Change',
          previous_value: '50',
          new_value: '65',
          changed_by: 'Jane Smith (Sales Team Lead)',
          changed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        },
        {
          id: '3',
          lead_id: leadId,
          event_type: 'Status Change',
          previous_value: 'Contacted',
          new_value: 'Qualified',
          changed_by: 'John Doe (Sales Person)',
          changed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        },
        {
          id: '4',
          lead_id: leadId,
          event_type: 'Assignment',
          previous_value: 'John Doe (Sales Person)',
          new_value: 'Michael Johnson (Sales Manager)',
          changed_by: 'Jane Smith (Sales Team Lead)',
          changed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        },
        {
          id: '5',
          lead_id: leadId,
          event_type: 'Score Change',
          previous_value: '65',
          new_value: '85',
          changed_by: 'Michael Johnson (Sales Manager)',
          changed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
      ] as LeadJourneyEvent[];
    },
  });

  return {
    interactions,
    isLoading,
    addInteraction: addInteraction.mutate,
    isAdding: addInteraction.isPending,
    journeyEvents,
  };
}