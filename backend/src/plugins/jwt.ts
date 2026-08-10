import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";

// Fastify instance ichiga "authenticate" nomli decorator qo'shamiz —
// himoyalangan route'larda shu funksiyani preHandler sifatida ishlatamiz.
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { userId: string; email: string };
  }
}

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string,
    sign: {
      expiresIn: "30d", // token 30 kun amal qiladi
    },
  });

  fastify.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Avtorizatsiyadan o'tilmagan" });
    }
  });
});