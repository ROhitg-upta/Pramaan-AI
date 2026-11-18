/**
 * Pramaan AI — Standalone Migration Runner (Node.js / Neon PostgreSQL)
 * 
 * Usage:
 *   DATABASE_URL="postgresql://user:pass@ep-host.region.neon.tech/neondb?sslmode=require" node scripts/migrate.mjs
 * 
 * Target: Neon Serverless PostgreSQL / Cloud PostgreSQL
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim();

if (!dbUrl || (!dbUrl.startsWith("postgres://") && !dbUrl.startsWith("postgresql://"))) {
  console.error("ERROR: DATABASE_URL or POSTGRES_URL environment variable must be set to a valid PostgreSQL connection string.");
  console.error("Format: postgresql://[user]:[password]@[ep-host].[region].neon.tech/[dbname]?sslmode=require");
  process.exit(1);
}

const migrationFile = path.join(__dirname, "..", "database", "migrations", "001_initial_schema.sql");

if (!fs.existsSync(migrationFile)) {
  console.error(`ERROR: Migration file not found at: ${migrationFile}`);
  process.exit(1);
}

async function run() {
  console.log("===============================================================================");
  console.log("   PRAMAAN AI — SCHEMA MIGRATION PIPELINE");
  console.log("===============================================================================");
  console.log(`\nReading migration DDL from: ${migrationFile}`);
  
  const sql = fs.readFileSync(migrationFile, "utf-8");
  const normalizedUrl = dbUrl.replace(/^postgres:\/\//, "postgresql://");
  
  const client = neon(normalizedUrl);
  
  // Split on semicolons for statement-level execution
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(`Executing ${statements.length} DDL statements on PostgreSQL...\n`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.split("\n")[0].substring(0, 60);
    try {
      await client(stmt);
      console.log(`  [✓] Statement ${i + 1}/${statements.length}: ${preview}...`);
    } catch (err) {
      console.error(`  [✗] Statement ${i + 1} FAILED: ${err.message}`);
      console.error(`      SQL: ${stmt}`);
      process.exit(1);
    }
  }

  console.log("\n===============================================================================");
  console.log("   MIGRATION COMPLETED SUCCESSFULLY!");
  console.log("===============================================================================\n");
}

run().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});
