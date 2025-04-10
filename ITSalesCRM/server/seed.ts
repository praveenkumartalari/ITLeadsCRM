import bcrypt from 'bcryptjs';
import { db } from './db';
import { 
  users,
  leads,
  clients,
  activities
} from '@shared/schema';

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Check if we already have users
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log('Database already contains data, skipping seed');
      return;
    }
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const [admin] = await db.insert(users).values({
      username: 'admin',
      email: 'admin@smartlead.com',
      password: adminPassword,
      role: 'admin'
    }).returning();
    console.log(`Created admin user: ${admin.username}`);
    
    // Create a sales rep and manager
    const password = await bcrypt.hash('password123', 10);
    const [salesRep] = await db.insert(users).values({
      username: 'salesrep',
      email: 'sales@smartlead.com',
      password: password,
      role: 'sales_rep'
    }).returning();
    console.log(`Created sales rep: ${salesRep.username}`);
    
    const [manager] = await db.insert(users).values({
      username: 'manager',
      email: 'manager@smartlead.com',
      password: password,
      role: 'manager'
    }).returning();
    console.log(`Created manager: ${manager.username}`);
    
    // Create sample leads
    const [lead1] = await db.insert(leads).values({
      name: 'Michael Johnson',
      email: 'michael@techwave.io',
      phone: '555-123-4567',
      company: 'TechWave Solutions',
      industry: 'Software Development',
      source: 'Web',
      status: 'Contacted',
      assignedToId: salesRep.id,
      notes: 'Interested in our CRM solution'
    }).returning();
    console.log(`Created lead: ${lead1.name}`);
    
    const [lead2] = await db.insert(leads).values({
      name: 'Rebecca Liu',
      email: 'r.liu@datapulse.com',
      phone: '555-987-6543',
      company: 'DataPulse Analytics',
      industry: 'Data Analytics',
      source: 'LinkedIn',
      status: 'Proposal Sent',
      assignedToId: salesRep.id,
      notes: 'Sent proposal for data analytics solution'
    }).returning();
    console.log(`Created lead: ${lead2.name}`);
    
    const [lead3] = await db.insert(leads).values({
      name: 'Thomas Green',
      email: 'thomas@cloudnine.co',
      phone: '555-456-7890',
      company: 'CloudNine Security',
      industry: 'Cybersecurity',
      source: 'Referral',
      status: 'New',
      assignedToId: manager.id,
      notes: 'Referred by existing client'
    }).returning();
    console.log(`Created lead: ${lead3.name}`);
    
    // Create sample clients
    const [client1] = await db.insert(clients).values({
      companyName: 'InnovateX',
      industry: 'Software Development',
      location: 'Seattle, WA',
      contactEmail: 'l.vaughn@innovatex.net',
      phone: '555-111-2222',
      website: 'www.innovatex.net',
      notes: 'Long-term client, interested in expanding services',
      leadId: lead2.id
    }).returning();
    console.log(`Created client: ${client1.companyName}`);
    
    // Create sample activities
    const now = new Date();
    const [activity1] = await db.insert(activities).values({
      type: 'Call',
      title: 'Call with CloudNine Security',
      notes: 'Initial discussion about their security needs',
      scheduledAt: new Date(now.getTime() + 3600000), // 1 hour from now
      completed: false,
      relatedTo: 'Lead',
      relatedId: lead3.id,
      createdById: salesRep.id,
      assignedToId: salesRep.id
    }).returning();
    console.log(`Created activity: ${activity1.title}`);
    
    const [activity2] = await db.insert(activities).values({
      type: 'Meeting',
      title: 'Follow up with DataPulse Analytics',
      notes: 'Discuss the proposal details',
      scheduledAt: new Date(now.getTime() + 86400000), // 1 day from now
      completed: false,
      relatedTo: 'Lead',
      relatedId: lead2.id,
      createdById: manager.id,
      assignedToId: salesRep.id
    }).returning();
    console.log(`Created activity: ${activity2.title}`);
    
    const [activity3] = await db.insert(activities).values({
      type: 'Demo',
      title: 'Demo Meeting with TechWave',
      notes: 'Product demonstration',
      scheduledAt: new Date(now.getTime() + 259200000), // 3 days from now
      completed: false,
      relatedTo: 'Lead',
      relatedId: lead1.id,
      createdById: salesRep.id,
      assignedToId: salesRep.id
    }).returning();
    console.log(`Created activity: ${activity3.title}`);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

seed();