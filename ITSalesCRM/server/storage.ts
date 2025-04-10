import bcrypt from 'bcryptjs';
import {
  User, InsertUser, 
  Lead, InsertLead,
  Client, InsertClient,
  Contact, InsertContact,
  Activity, InsertActivity,
  File, InsertFile
} from '@shared/schema';

export interface IStorage {
  // User CRUD
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  
  // Lead CRUD
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, leadData: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  listLeads(): Promise<Lead[]>;
  listLeadsByAssignee(userId: number): Promise<Lead[]>;
  
  // Client CRUD
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  listClients(): Promise<Client[]>;
  
  // Contact CRUD
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contactData: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  listContactsByClient(clientId: number): Promise<Contact[]>;
  
  // Activity CRUD
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activityData: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: number): Promise<boolean>;
  listActivities(): Promise<Activity[]>;
  listActivitiesByUser(userId: number): Promise<Activity[]>;
  listActivitiesByRelated(relatedTo: string, relatedId: number): Promise<Activity[]>;
  listUpcomingActivities(userId: number, days: number): Promise<Activity[]>;
  
  // File CRUD
  getFile(id: number): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: number): Promise<boolean>;
  listFilesByRelated(relatedTo: string, relatedId: number): Promise<File[]>;
  
  // Dashboard metrics
  getDashboardStats(): Promise<{
    totalLeads: number;
    activeClients: number;
    conversionRate: number;
    dealsClosed: number;
    monthlySummary: {
      month: string;
      newLeads: number;
      converted: number;
    }[];
    salesFunnel: {
      stage: string;
      count: number;
    }[];
    topPerformers: {
      userId: number;
      name: string;
      email: string;
      dealsClosed: number;
      amount: number;
    }[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private clients: Map<number, Client>;
  private contacts: Map<number, Contact>;
  private activities: Map<number, Activity>;
  private files: Map<number, File>;
  
  private userIdCounter: number;
  private leadIdCounter: number;
  private clientIdCounter: number;
  private contactIdCounter: number;
  private activityIdCounter: number;
  private fileIdCounter: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.clients = new Map();
    this.contacts = new Map();
    this.activities = new Map();
    this.files = new Map();
    
    this.userIdCounter = 1;
    this.leadIdCounter = 1;
    this.clientIdCounter = 1;
    this.contactIdCounter = 1;
    this.activityIdCounter = 1;
    this.fileIdCounter = 1;
    
    // Initialize with an admin user
    this.createInitialData();
  }

  private async createInitialData() {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    this.createUser({
      username: 'admin',
      email: 'admin@smartlead.com',
      password: adminPassword,
      role: 'admin'
    });
    
    // Create a sales rep and manager
    const password = await bcrypt.hash('password123', 10);
    this.createUser({
      username: 'salesrep',
      email: 'sales@smartlead.com',
      password: password,
      role: 'sales_rep'
    });
    
    this.createUser({
      username: 'manager',
      email: 'manager@smartlead.com',
      password: password,
      role: 'manager'
    });
    
    // Create sample leads
    const lead1 = this.createLead({
      name: 'Michael Johnson',
      email: 'michael@techwave.io',
      phone: '555-123-4567',
      company: 'TechWave Solutions',
      industry: 'Software Development',
      source: 'Web',
      status: 'Contacted',
      assignedToId: 2,
      notes: 'Interested in our CRM solution'
    });
    
    const lead2 = this.createLead({
      name: 'Rebecca Liu',
      email: 'r.liu@datapulse.com',
      phone: '555-987-6543',
      company: 'DataPulse Analytics',
      industry: 'Data Analytics',
      source: 'LinkedIn',
      status: 'Proposal Sent',
      assignedToId: 2,
      notes: 'Sent proposal for data analytics solution'
    });
    
    const lead3 = this.createLead({
      name: 'Thomas Green',
      email: 'thomas@cloudnine.co',
      phone: '555-456-7890',
      company: 'CloudNine Security',
      industry: 'Cybersecurity',
      source: 'Referral',
      status: 'New',
      assignedToId: 3,
      notes: 'Referred by existing client'
    });
    
    // Create sample clients
    const client1 = this.createClient({
      companyName: 'InnovateX',
      industry: 'Software Development',
      location: 'Seattle, WA',
      contactEmail: 'l.vaughn@innovatex.net',
      phone: '555-111-2222',
      website: 'www.innovatex.net',
      notes: 'Long-term client, interested in expanding services',
      leadId: 2
    });
    
    // Create sample activities
    this.createActivity({
      type: 'Call',
      title: 'Call with CloudNine Security',
      notes: 'Initial discussion about their security needs',
      scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
      completed: false,
      relatedTo: 'Lead',
      relatedId: lead3.id,
      createdById: 2,
      assignedToId: 2
    });
    
    this.createActivity({
      type: 'Meeting',
      title: 'Follow up with DataPulse Analytics',
      notes: 'Discuss the proposal details',
      scheduledAt: new Date(Date.now() + 86400000), // 1 day from now
      completed: false,
      relatedTo: 'Lead',
      relatedId: lead2.id,
      createdById: 3,
      assignedToId: 2
    });
    
    this.createActivity({
      type: 'Demo',
      title: 'Demo Meeting with TechWave',
      notes: 'Product demonstration',
      scheduledAt: new Date(Date.now() + 259200000), // 3 days from now
      completed: false,
      relatedTo: 'Lead',
      relatedId: lead1.id,
      createdById: 2,
      assignedToId: 2
    });
  }

  // User CRUD
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Lead CRUD
  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }
  
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.leadIdCounter++;
    const now = new Date();
    const lead: Lead = { ...insertLead, id, createdAt: now };
    this.leads.set(id, lead);
    return lead;
  }
  
  async updateLead(id: number, leadData: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = await this.getLead(id);
    if (!lead) return undefined;
    
    const updatedLead = { ...lead, ...leadData };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }
  
  async deleteLead(id: number): Promise<boolean> {
    return this.leads.delete(id);
  }
  
  async listLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }
  
  async listLeadsByAssignee(userId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      (lead) => lead.assignedToId === userId
    );
  }
  
  // Client CRUD
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.clientIdCounter++;
    const now = new Date();
    const client: Client = { ...insertClient, id, createdAt: now };
    this.clients.set(id, client);
    return client;
  }
  
  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = await this.getClient(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...clientData };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }
  
  async listClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  // Contact CRUD
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const contact: Contact = { ...insertContact, id };
    this.contacts.set(id, contact);
    return contact;
  }
  
  async updateContact(id: number, contactData: Partial<InsertContact>): Promise<Contact | undefined> {
    const contact = await this.getContact(id);
    if (!contact) return undefined;
    
    const updatedContact = { ...contact, ...contactData };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }
  
  async listContactsByClient(clientId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      (contact) => contact.clientId === clientId
    );
  }
  
  // Activity CRUD
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const now = new Date();
    const activity: Activity = { ...insertActivity, id, createdAt: now };
    this.activities.set(id, activity);
    return activity;
  }
  
  async updateActivity(id: number, activityData: Partial<InsertActivity>): Promise<Activity | undefined> {
    const activity = await this.getActivity(id);
    if (!activity) return undefined;
    
    const updatedActivity = { ...activity, ...activityData };
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }
  
  async deleteActivity(id: number): Promise<boolean> {
    return this.activities.delete(id);
  }
  
  async listActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
  
  async listActivitiesByUser(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.assignedToId === userId
    );
  }
  
  async listActivitiesByRelated(relatedTo: string, relatedId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.relatedTo === relatedTo && activity.relatedId === relatedId
    );
  }
  
  async listUpcomingActivities(userId: number, days: number = 7): Promise<Activity[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return Array.from(this.activities.values()).filter(
      (activity) => 
        activity.assignedToId === userId && 
        !activity.completed &&
        activity.scheduledAt >= now &&
        activity.scheduledAt <= futureDate
    ).sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  }
  
  // File CRUD
  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }
  
  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.fileIdCounter++;
    const now = new Date();
    const file: File = { ...insertFile, id, uploadedAt: now };
    this.files.set(id, file);
    return file;
  }
  
  async deleteFile(id: number): Promise<boolean> {
    return this.files.delete(id);
  }
  
  async listFilesByRelated(relatedTo: string, relatedId: number): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.relatedTo === relatedTo && file.relatedId === relatedId
    );
  }
  
  // Dashboard metrics
  async getDashboardStats(): Promise<{
    totalLeads: number;
    activeClients: number;
    conversionRate: number;
    dealsClosed: number;
    monthlySummary: { month: string; newLeads: number; converted: number }[];
    salesFunnel: { stage: string; count: number }[];
    topPerformers: { userId: number; name: string; email: string; dealsClosed: number; amount: number }[];
  }> {
    const leads = await this.listLeads();
    const clients = await this.listClients();
    const totalLeads = leads.length;
    const activeClients = clients.length;
    
    // Calculate conversion rate
    const wonLeads = leads.filter(lead => lead.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
    
    // Fake deal amount for demo purposes - in a real app this would come from a deals table
    const dealsClosed = wonLeads * 15000; // Assuming average deal size of $15K
    
    // Generate monthly data for the past 6 months
    const monthlySummary = this.generateMonthlySummary();
    
    // Generate sales funnel data
    const salesFunnel = [
      { stage: 'New', count: leads.filter(lead => lead.status === 'New').length },
      { stage: 'Contacted', count: leads.filter(lead => lead.status === 'Contacted').length },
      { stage: 'Proposal Sent', count: leads.filter(lead => lead.status === 'Proposal Sent').length },
      { stage: 'Negotiation', count: leads.filter(lead => lead.status === 'Negotiation').length },
      { stage: 'Won', count: leads.filter(lead => lead.status === 'Won').length }
    ];
    
    // Generate top performers
    const salesReps = Array.from(this.users.values()).filter(user => user.role === 'sales_rep');
    
    // In a real app, this would be calculated from actual deals
    const topPerformers = salesReps.map(user => {
      // Randomly assign performance metrics
      const userLeads = leads.filter(lead => lead.assignedToId === user.id);
      const dealsClosed = userLeads.filter(lead => lead.status === 'Won').length;
      const amount = dealsClosed * Math.floor(Math.random() * 15000 + 10000);
      
      return {
        userId: user.id,
        name: user.username,
        email: user.email,
        dealsClosed,
        amount
      };
    }).sort((a, b) => b.amount - a.amount);
    
    return {
      totalLeads,
      activeClients,
      conversionRate,
      dealsClosed,
      monthlySummary,
      salesFunnel,
      topPerformers
    };
  }
  
  private generateMonthlySummary() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return months.map(month => ({
      month,
      newLeads: Math.floor(Math.random() * 50) + 30, // 30-80 new leads per month
      converted: Math.floor(Math.random() * 30) + 10  // 10-40 conversions per month
    }));
  }
}

export const storage = new MemStorage();
