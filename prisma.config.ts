// Prisma 7 CLI configuration — the CLI no longer reads schema datasource
// env() automatically; it needs the URL here. dotenv loads .env/.env.local.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
