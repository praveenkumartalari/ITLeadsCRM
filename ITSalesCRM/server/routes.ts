import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticate, authorize, register, login, getCurrentUser } from "./auth";
import { z } from "zod";
import { insertLeadSchema, insertClientSchema, insertActivitySchema, insertFileSchema, insertContactSchema, leadStatusOptions, leadSourceOptions } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.get('/api/auth/me', authenticate, getCurrentUser);

  // Dashboard routes
  app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
  });

  // Leads routes
  app.get('/api/leads', async (req: Request, res: Response) => {
    try {
      const leads = await storage.listLeads();
      res.json(leads);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ message: 'Error fetching leads' });
    }
  });

  app.get('/api/leads/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);

      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }

      res.json(lead);
    } catch (error: any) {
      console.error('Error fetching lead:', error);
      res.status(500).json({ message: 'Error fetching lead' });
    }
  });

  app.post('/api/leads', async (req: Request, res: Response) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.status(201).json(lead);
    } catch (error: any) {
      console.error('Error creating lead:', error);
      res.status(400).json({ message: 'Invalid lead data', error: error.message });
    }
  });

  app.put('/api/leads/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingLead = await storage.getLead(id);

      if (!existingLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }

      const validatedData = insertLeadSchema.partial().parse(req.body);
      const updatedLead = await storage.updateLead(id, validatedData);
      res.json(updatedLead);
    } catch (error: any) {
      console.error('Error updating lead:', error);
      res.status(400).json({ message: 'Invalid lead data', error: error.message });
    }
  });

  app.delete('/api/leads/:id', authenticate, authorize(['admin', 'manager']), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLead(id);

      if (!success) {
        return res.status(404).json({ message: 'Lead not found' });
      }

      res.json({ message: 'Lead deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      res.status(500).json({ message: 'Error deleting lead' });
    }
  });

  // Clients routes
  app.get('/api/clients', authenticate, async (req: Request, res: Response) => {
    try {
      const clients = await storage.listClients();
      res.json(clients);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ message: 'Error fetching clients' });
    }
  });

  app.get('/api/clients/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      res.json(client);
    } catch (error: any) {
      console.error('Error fetching client:', error);
      res.status(500).json({ message: 'Error fetching client' });
    }
  });

  app.post('/api/clients', authenticate, async (req: Request, res: Response) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error: any) {
      console.error('Error creating client:', error);
      res.status(400).json({ message: 'Invalid client data', error: error.message });
    }
  });

  app.put('/api/clients/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingClient = await storage.getClient(id);

      if (!existingClient) {
        return res.status(404).json({ message: 'Client not found' });
      }

      const validatedData = insertClientSchema.partial().parse(req.body);
      const updatedClient = await storage.updateClient(id, validatedData);
      res.json(updatedClient);
    } catch (error: any) {
      console.error('Error updating client:', error);
      res.status(400).json({ message: 'Invalid client data', error: error.message });
    }
  });

  app.delete('/api/clients/:id', authenticate, authorize(['admin', 'manager']), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClient(id);

      if (!success) {
        return res.status(404).json({ message: 'Client not found' });
      }

      res.json({ message: 'Client deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting client:', error);
      res.status(500).json({ message: 'Error deleting client' });
    }
  });

  // Contacts routes
  app.get('/api/clients/:clientId/contacts', authenticate, async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const contacts = await storage.listContactsByClient(clientId);
      res.json(contacts);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: 'Error fetching contacts' });
    }
  });

  app.post('/api/contacts', authenticate, async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error: any) {
      console.error('Error creating contact:', error);
      res.status(400).json({ message: 'Invalid contact data', error: error.message });
    }
  });

  app.put('/api/contacts/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingContact = await storage.getContact(id);

      if (!existingContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      const validatedData = insertContactSchema.partial().parse(req.body);
      const updatedContact = await storage.updateContact(id, validatedData);
      res.json(updatedContact);
    } catch (error: any) {
      console.error('Error updating contact:', error);
      res.status(400).json({ message: 'Invalid contact data', error: error.message });
    }
  });

  app.delete('/api/contacts/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContact(id);

      if (!success) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.json({ message: 'Contact deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ message: 'Error deleting contact' });
    }
  });

  // Activities routes
  app.get('/api/activities', authenticate, async (req: Request, res: Response) => {
    try {
      const activities = await storage.listActivities();
      res.json(activities);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ message: 'Error fetching activities' });
    }
  });

  app.get('/api/activities/user/:userId', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const activities = await storage.listActivitiesByUser(userId);
      res.json(activities);
    } catch (error: any) {
      console.error('Error fetching user activities:', error);
      res.status(500).json({ message: 'Error fetching user activities' });
    }
  });

  app.get('/api/activities/upcoming/:userId', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const activities = await storage.listUpcomingActivities(userId, days);
      res.json(activities);
    } catch (error: any) {
      console.error('Error fetching upcoming activities:', error);
      res.status(500).json({ message: 'Error fetching upcoming activities' });
    }
  });

  app.post('/api/activities', authenticate, async (req: Request, res: Response) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error: any) {
      console.error('Error creating activity:', error);
      res.status(400).json({ message: 'Invalid activity data', error: error.message });
    }
  });

  app.put('/api/activities/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingActivity = await storage.getActivity(id);

      if (!existingActivity) {
        return res.status(404).json({ message: 'Activity not found' });
      }

      const validatedData = insertActivitySchema.partial().parse(req.body);
      const updatedActivity = await storage.updateActivity(id, validatedData);
      res.json(updatedActivity);
    } catch (error: any) {
      console.error('Error updating activity:', error);
      res.status(400).json({ message: 'Invalid activity data', error: error.message });
    }
  });

  app.delete('/api/activities/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteActivity(id);

      if (!success) {
        return res.status(404).json({ message: 'Activity not found' });
      }

      res.json({ message: 'Activity deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      res.status(500).json({ message: 'Error deleting activity' });
    }
  });

  // Files routes
  app.get('/api/files/:relatedTo/:relatedId', authenticate, async (req: Request, res: Response) => {
    try {
      const { relatedTo, relatedId } = req.params;
      const files = await storage.listFilesByRelated(relatedTo, parseInt(relatedId));
      res.json(files);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      res.status(500).json({ message: 'Error fetching files' });
    }
  });

  app.post('/api/files', authenticate, async (req: Request, res: Response) => {
    try {
      const validatedData = insertFileSchema.parse(req.body);
      const file = await storage.createFile(validatedData);
      res.status(201).json(file);
    } catch (error: any) {
      console.error('Error creating file:', error);
      res.status(400).json({ message: 'Invalid file data', error: error.message });
    }
  });

  app.delete('/api/files/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFile(id);

      if (!success) {
        return res.status(404).json({ message: 'File not found' });
      }

      res.json({ message: 'File deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting file:', error);
      res.status(500).json({ message: 'Error deleting file' });
    }
  });

  // Users routes (admin only)
  app.get('/api/users', authorize(['admin']), async (req: Request, res: Response) => {
    try {
      const users = await storage.listUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

  // Utility routes
  app.get('/api/options/lead-statuses', (req: Request, res: Response) => {
    res.json(leadStatusOptions);
  });

  app.get('/api/options/lead-sources', (req: Request, res: Response) => {
    res.json(leadSourceOptions);
  });

  const httpServer = createServer(app);
  return httpServer;
}
