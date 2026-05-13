import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Strip ?pgbouncer=true from the URL — drizzle-kit push uses
// prepared statements which are incompatible with PgBouncer's
// transaction pooling mode.
const rawUrl = process.env.DATABASE_URL!;
const cleanUrl = rawUrl.replace(/[?&]pgbouncer=true/i, "");

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: cleanUrl,
  },
});
