/**
 * Pramaan AI — Shared Database Client (Neon Serverless PostgreSQL)
 * Reuses the PostgreSQL schema defined in database/migrations/001_initial_schema.sql
 */

import { Pool, neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL?.trim() || "";

export const isDatabaseConfigured = Boolean(
  databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))
);

// Normalizes postgres:// to postgresql:// if needed
const normalizedDbUrl = databaseUrl.replace(/^postgres:\/\//, "postgresql://");

let sqlClient: ReturnType<typeof neon> | null = null;
let poolClient: Pool | null = null;

if (isDatabaseConfigured) {
  try {
    sqlClient = neon(normalizedDbUrl);
    poolClient = new Pool({ connectionString: normalizedDbUrl });
  } catch (err) {
    console.warn("Failed to initialize Neon database client:", err);
  }
}

/**
 * Execute a parameterized SQL query
 */
export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  if (!isDatabaseConfigured || !sqlClient) {
    throw new Error(
      "DATABASE_NOT_CONFIGURED: Shared PostgreSQL database connection string is not set in environment variables."
    );
  }
  const result = await (sqlClient as any)(text, params);
  return result as T[];
}

/**
 * Run a transaction block using the connection pool
 */
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  if (!isDatabaseConfigured || !poolClient) {
    throw new Error(
      "DATABASE_NOT_CONFIGURED: Shared PostgreSQL database pool is not set in environment variables."
    );
  }

  const client = await poolClient.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
