import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import prismaPlugin from "./plugins/prisma";

const fastify = Fastify({
  logger: true,
});

async function main() {
  // CORS — hozircha barcha manbalarga ochiq, keyinroq faqat
  // Vercel domenini qo'shib cheklaymiz (masalan https://shajara.uz)
  await fastify.register(cors, {
    origin: true,
  });

  // Prisma plugin — bazaga ulanish
  await fastify.register(prismaPlugin);

  // Sog'lik tekshiruvi endpointi — server va baza ishlayotganini tekshirish uchun
  fastify.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Bazaga ulanishni sinash uchun oddiy endpoint
  fastify.get("/health/db", async (request, reply) => {
    try {
      await fastify.prisma.$queryRaw`SELECT 1`;
      return { database: "connected" };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return { database: "error", message: String(error) };
    }
  });

  const port = Number(process.env.PORT) || 4000;

  try {
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Server ishga tushdi: http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();