export interface Task {
    id: string;
    title: string;
    description: string;
    due_date: string; // ISO 8601 date-time string
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: "PENDING" | "COMPLETED" | "CANCELLED" | "REOPENED";
    type: "CALL" | "EMAIL" | "MEETING" | "TASK";
    lead_id?: string; // Optional, as per Create Task API
    assigned_to_id?: string; // Optional, as per Create Task API
    created_by_id?: string; // Optional, as per Create Task API
    created_at?: string; // Optional, added from Get Tasks response
    updated_at?: string; // Optional, added from Get Tasks response
    completed_at?: string | null; // Optional, added from Get Tasks response
    source_interaction_id?: string | null; // Optional, added from Get Tasks response
    cancelled_at?: string | null; // Optional, added from Get Tasks response
    reopened_at?: string | null; // Optional, added from Get Tasks response
    status_changed_at?: string | null; // Optional, added from Get Tasks response
    status_changed_by_id?: string | null; // Optional, added from Get Tasks response
    updated_by_id?: string | null; // Optional, added from Get Tasks response
    assigned_to_name?: string; // Optional, added from Get Tasks response
    created_by_name?: string; // Optional, added from Get Tasks response
  }