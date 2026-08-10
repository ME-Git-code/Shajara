import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Migratsiya (CLI) uchun DIRECT_URL ishlatiladi — pooler orqali emas,
  // to'g'ridan-to'g'ri ulanish, chunki DDL (jadval yaratish) buni talab qiladi.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
