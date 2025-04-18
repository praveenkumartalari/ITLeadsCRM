const { z } = require('zod');

const insertLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  company: z.string().optional(),
  company_size: z.enum(['Enterprise', 'Mid-Market', 'Small Business', 'Startup']).optional(),
  industry: z.string().optional(),
  location: z.string().min(2, "Location must be at least 2 characters").optional(),
  source: z.string().optional(),
  status: z.string().default('new'),
  assigned_to_id: z.string().uuid().optional(),
  notes: z.string().optional(),
  budget: z.number().optional(),
  expected_close_date: z.string().datetime().optional(),
  createdById: z.string().uuid(),
  updatedById: z.string().uuid().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  score: z.number().int().min(0).max(100).default(0)
});

// Client Schema
const insertClientSchema = z.object({
  companyName: z.string(),
  industry: z.string().optional(),
  location: z.string().optional(),
  contactEmail: z.string().email(),
  phone: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
  leadId: z.number().int().optional(),
});

// Contact Schema
const insertContactSchema = z.object({
  clientId: z.number().int(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  position: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

// Activity Schema
const insertActivitySchema = z.object({
  type: z.string(),
  title: z.string(),
  notes: z.string().optional(),
  scheduledAt: z.string().datetime(), // Accepts ISO date strings
  completed: z.boolean().default(false),
  relatedTo: z.string(),
  relatedId: z.number().int(),
  createdById: z.number().int(),
  assignedToId: z.number().int().optional(),
});

// File Schema
const insertFileSchema = z.object({
  fileName: z.string(),
  fileUrl: z.string().url(),
  fileType: z.string().optional(),
  relatedTo: z.string(),
  relatedId: z.number().int(),
  uploadedById: z.number().int(),
});

const interactionTypes = Object.freeze([
  'CALL',
  'MEETING',
  'EMAIL',
  'NOTE',
  'OTHER'
]);

const insertInteractionSchema = z.object({
  leadId: z.string().uuid(),
  type: z.enum(interactionTypes),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  interactionDate: z.string().datetime(),
  nextFollowUp: z.string().datetime().optional(),
  durationMinutes: z.number().int().min(0).optional(),
  outcome: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});


const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  due_date: z.string().datetime({ offset: true }), // Expect ISO 8601 with timezone
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  type: z.enum(['CALL', 'MEETING', 'EMAIL', 'FOLLOW_UP', 'OTHER']),
  lead_id: z.string().uuid(),
  assigned_to_id: z.string().uuid().optional(),
  source_interaction_id: z.string().uuid().optional(),
});
const taskStatuses = [
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'REOPENED'
];

const updateTaskSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(taskStatuses).optional(),
    assignedToId: z.string().uuid().optional()
});

// Options (from your original schema)
const leadStatusOptions = [
  'New',
  'Contacted',
  'Proposal Sent',
  'Negotiation',
  'Won',
  'Lost',
];
const leadSourceOptions = [
  'Web',
  'Referral',
  'LinkedIn',
  'Email',
  'Cold Call',
  'Event',
  'Other',
];

module.exports = {
  insertLeadSchema,
  insertClientSchema,
  insertContactSchema,
  insertActivitySchema,
  insertFileSchema,
  leadStatusOptions,
  leadSourceOptions,
  insertInteractionSchema,
  interactionTypes,
  taskSchema,
  updateTaskSchema,
  taskStatuses
};