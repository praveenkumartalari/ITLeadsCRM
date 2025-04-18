import { Task } from "./task";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  status: string;
  source?: string;
  score: number;
  industry?: string;
  lastContact?: string;
  estimated_cost?: number;
  currency: string;
  budget?: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadInteraction {
  id: string;
  lead_id: string;
  type: 'Call' | 'Meeting' | 'In Person';
  title: string;
  description?: string;
  date: string;
  next_meeting_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadJourneyEvent {
  id: string;
  lead_id: string;
  event_type: 'Status Change' | 'Score Change' | 'Assignment';
  previous_value?: string;
  new_value: string;
  changed_by: string;
  changed_at: string;
}

export type SalesRole = 'Sales Manager' | 'Sales Team Lead' | 'Sales Person';


export interface AssignedTo {
  id?: string;
  name: string;
  email: string;
}

export interface Note {
  id: number;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  subject: string;
  content: string;
  date: string;
  performed_by: string;
}

// export interface Task {
//   id: string;
//   title: string;
//   dueDate: string;
//   assignedTo: string;
//   priority: string;
// }

export interface LeadDetails {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  source: string;
  score: number;
  lastContact: string;
  assignedTo: AssignedTo;
  tags: string[];
  notes: string; // Changed from Note[] to string to match form
  activities: Activity[];
  tasks: Task[];
  budget?: number;
  expectedCloseDate?: string;
  company_size?: "Enterprise" | "Mid-Market" | "Small Business" | "Startup";
}


