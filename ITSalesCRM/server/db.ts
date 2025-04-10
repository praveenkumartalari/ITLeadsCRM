import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Use the DATABASE_URL environment variable
const connectionString = process.env.DATABASE_URL || '';

// Create a PostgreSQL client
const client = postgres(connectionString, { max: 1 });

// Create a Drizzle instance
export const db = drizzle(client, { schema });