import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const dbUrl = import.meta.env.DATABASE_URL;

if (!dbUrl) {
    console.warn("DATABASE_URL is not defined. Database functionality will be limited to runtime checks.");
}

export const db = dbUrl
    ? drizzle(neon(dbUrl), { schema })
    : {} as any;
