const { z } = require('zod');

// Lead Schema
const insertLeadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    source: z.string().optional(),
    status: z.string().default('new'),
    assignedToId: z.string().uuid().optional(),
    notes: z.string().optional(),
    budget: z.number().optional(),
    expectedCloseDate: z.string().datetime().optional(),
    createdById: z.string().uuid(), // Changed to UUID
    updatedById: z.string().uuid().optional(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().optional(),
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
};