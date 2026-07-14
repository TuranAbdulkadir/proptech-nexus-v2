import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// This configuration is optimized for edge/serverless environments.
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

// Disable prefetch as it is not supported for pooled edge environments
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
