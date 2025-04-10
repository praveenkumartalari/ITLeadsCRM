import { pgTable, text, serial, integer, timestamp, json, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("sales_rep"), // admin, sales_rep, manager
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

// Leads Schema
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  industry: text("industry"),
  source: text("source"), // Web, Referral, LinkedIn, etc.
  status: text("status").notNull().default("new"), // New, Contacted, Proposal Sent, Won, Lost
  assignedToId: integer("assigned_to_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  industry: true,
  source: true,
  status: true,
  assignedToId: true,
  notes: true,
});

// Clients Schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  industry: text("industry"),
  location: text("location"),
  contactEmail: text("contact_email").notNull(),
  phone: text("phone"),
  website: text("website"),
  notes: text("notes"),
  leadId: integer("lead_id").references(() => leads.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  companyName: true,
  industry: true,
  location: true,
  contactEmail: true,
  phone: true,
  website: true,
  notes: true,
  leadId: true,
});

// Contacts Schema (for client contacts)
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  position: text("position"),
  isPrimary: boolean("is_primary").default(false),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  clientId: true,
  name: true,
  email: true,
  phone: true,
  position: true,
  isPrimary: true,
});

// Activities Schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // Call, Meeting, Email, Task
  title: text("title").notNull(),
  notes: text("notes"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  completedAt: timestamp("completed_at"),
  completed: boolean("completed").default(false),
  relatedTo: text("related_to").notNull(), // Lead or Client
  relatedId: integer("related_id").notNull(),
  createdById: integer("created_by_id").references(() => users.id).notNull(),
  assignedToId: integer("assigned_to_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  title: true,
  notes: true,
  scheduledAt: true,
  completed: true,
  relatedTo: true,
  relatedId: true,
  createdById: true,
  assignedToId: true,
});

// Files Schema
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"),
  relatedTo: text("related_to").notNull(), // Lead, Client, Activity
  relatedId: integer("related_id").notNull(),
  uploadedById: integer("uploaded_by_id").references(() => users.id).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertFileSchema = createInsertSchema(files).pick({
  fileName: true,
  fileUrl: true,
  fileType: true,
  relatedTo: true,
  relatedId: true,
  uploadedById: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

// Additional types for enhanced frontend display and operations
export const leadSourceOptions = ["Web", "Referral", "LinkedIn", "Email", "Cold Call", "Event", "Other"];
export const leadStatusOptions = ["New", "Contacted", "Proposal Sent", "Negotiation", "Won", "Lost"];
export const activityTypeOptions = ["Call", "Meeting", "Email", "Task"];
export const userRoleOptions = ["admin", "sales_rep", "manager"];
export const industryOptions = [
  "Software Development",
  "Web Development", 
  "Data Analytics", 
  "Cybersecurity", 
  "IT Consulting", 
  "Cloud Services",
  "Artificial Intelligence",
  "Telecommunications",
  "IoT",
  "Other"
];
