
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeadInteraction, LeadJourneyEvent } from "@/types/leads";
import { toast } from "sonner";

export function useLeadInteractions(leadId: string) {
  const queryClient = useQueryClient();

  const { data: interactions, isLoading } = useQuery({
    queryKey: ['leadInteractions', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LeadInteraction[];
    },
  });

  const addInteraction = useMutation({
    mutationFn: async (newInteraction: Omit<LeadInteraction, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('lead_interactions')
        .insert([newInteraction])
        .select()
        .single();

      if (error) throw error;
      return data;
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

  // Get journey analytics for this lead
  const { data: journeyEvents } = useQuery({
    queryKey: ['leadJourney', leadId],
    queryFn: async () => {
      // In a real app, we would fetch this from a lead_journey_events table
      // For now, we'll generate some mock data based on the lead ID
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
