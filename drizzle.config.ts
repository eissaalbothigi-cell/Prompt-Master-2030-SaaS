import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/models/schema.ts", // ← التعديل هنا
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});