import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Fastify instance ichiga "prisma" nomli maydon qo'shamiz,
// shunda istalgan route ichida fastify.prisma orqali bazaga murojaat qilish mumkin bo'ladi.
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  // Prisma 7'da runtime uchun "driver adapter" majburiy.
  // Bu yerda DATABASE_URL (pooled, 6543 port) ishlatiladi — chunki bu
  // server ishlayotganda doimiy so'rovlar uchun, migratsiya uchun emas.
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();
  fastify.log.info("✅ Prisma: bazaga muvaffaqiyatli ulandi");

  fastify.decorate("prisma", prisma);

  // Server yopilganda connection'ni ham to'g'ri yopamiz
  fastify.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
  });
});